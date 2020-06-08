const head = document.querySelector('[data-head]');
const table = document.querySelector('[data-table]');

const getHoursArray = () => {
  const arr = [...new Array(24)].map((item, i) => {
    if (i < 10) {
      return `0${i}:00`;
    }

    return `${i}:00`;
  });

  return arr;
}

const addEvents = () => {
  [...table.querySelectorAll('.js-list-row')].forEach(item => {
    item.addEventListener('click', e => {
      const row = e.target.parentNode
      
      if (row.classList.contains('virtual')) {
        row.classList.add('actual');
        row.classList.remove('virtual');
      } else {
        row.classList.add('virtual');
        row.classList.remove('actual');
      }
    });
  });
};

const generateHead = () => {
  const hours = getHoursArray()

  hours.forEach((item, i) => {
    const node = document.createElement('li');

    node.classList.add('item', 'table-cell');
    node.innerText = item;

    head.append(node);
  });
};

const addRowInner = (items) => {
  return items.map((item, i) => {
    const rowInner = document.createElement('li');
    rowInner.classList.add('item', 'table-cell');

    if (i < 2) {
      rowInner.innerText = item
    } else {
      rowInner.setAttribute('data-body-hour', i - 2);
    }

    return rowInner;
  });
};

const addBodyRows = (rows) => {
  rows.forEach((item, i) => {
    const [name, place, role, dateFrom, dateTo] = item;

    const row = document.createElement('ul');
    row.classList.add('table-row', 'js-list-row', 'virtual');
    row.setAttribute('data-body-person-index', i);

    const inners = addRowInner([name, `${place} / ${role}`, ...getHoursArray()]);
    inners.forEach(item => row.appendChild(item));

    const actualTimeLine = document.createElement('li');
    actualTimeLine.classList.add('actual-time');

    const virtualTimeLine = document.createElement('li');
    virtualTimeLine.classList.add('virtual-time');
    [actualTimeLine, virtualTimeLine].forEach(item => row.appendChild(item));
    table.appendChild(row);
  })
};

const addTimeLine = ({ actual, virtual }, type) => {
  (type === 'actual' && actual || virtual).forEach((item, i) => {
    const person = document.querySelector(`[data-body-person-index="${i}"]`);
    const [_n, _p, _r, dateFrom, dateTo] = item

    if (dateFrom && dateTo) {
      const dFrom = new Date(dateFrom);
      const dTo = new Date(dateTo);

      const firstBlock = person.querySelector(`[data-body-hour="${dFrom.getUTCHours()}"]`);
      const actualTimeLine = person.querySelector('.actual-time');
      const virtualTimeLine = person.querySelector('.virtual-time');
      const timeLine = (type === 'actual' && actualTimeLine) || virtualTimeLine;

      const { x, y, width, height } = firstBlock.getBoundingClientRect();
      const { y: tableOffsetTop, x: tableOffsetLeft } = table.getBoundingClientRect();

      const startPercent = 100 * dFrom.getMinutes() / 60;
      const startPx = width * startPercent / 100;

      if (dFrom.getUTCHours() < dTo.getUTCHours()) {
        const lastBlock = person.querySelector(`[data-body-hour="${dTo.getUTCHours()}"]`);
        const { x: x2 } = lastBlock.getBoundingClientRect();

        const endPercent = 100 * dTo.getMinutes() / 60;
        const endPx = width * endPercent / 100;

        timeLine.style.width = `${x2 - x - startPx + endPx}px`;
      } else {
        const lastBlock = person.querySelector('[data-body-hour="23"]');
        const { x: x2, width: width2 } = lastBlock.getBoundingClientRect();

        timeLine.style.width = `${x2 - x - startPx + width2}px`;
      }

      timeLine.style.left = `${x - tableOffsetLeft + startPx}px`;
      timeLine.style.top = `${y - tableOffsetTop}px`;
      timeLine.style.height = `${height}px`;

      type === 'actual' && actualTimeLine.setAttribute('data-actual-timeline-valid', true);
    }
  });
};

const startGenerateBody = () => {
  const response = fetch('/app/data.json')
    .then(res => res.json())
    .then(res => {
      const { virtual } = res;

      addBodyRows(virtual);
      addEvents();

      addTimeLine(res, 'virtual');
      addTimeLine(res, 'actual');
    });
};

generateHead();
startGenerateBody();
