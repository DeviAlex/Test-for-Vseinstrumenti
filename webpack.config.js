var path = require('path');

module.exports = {
  context: __dirname, // `__dirname` is root of project and `/src` is source
  mode: 'development',
  entry: {
    app: './index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'foo.bundle.js'
  },
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, ''),
    compress: true,
    port: 3000
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          // apply multiple loaders and options
          "htmllint-loader",
          {
            loader: "html-loader",
          }
        ]
      },
      {
        test: /\.js$/, // rule for .js files
        exclude: /node_modules/,
        loader: "babel-loader" // apply this loader for js files
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
          }
        ]
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        use: [
          'file-loader?name=[name].[ext]&outputPath=portal/content/json'
        ]
      },
    ]
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "app")
    ],
    extensions: [".js", ".json", ".css"],
  }
};
