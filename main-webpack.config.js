const path = require('path');

const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  mode: NODE_ENV,
  devtool: 'inline-source-map',
  entry: './src/main/index.ts',
  target: 'electron-main',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        use: {
          loader: 'node-loader',
        },
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },
  watchOptions: {
    poll: true,
    ignored: /node_modules/,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  node: {
    __dirname: false,
  },
};
