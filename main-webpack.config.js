const path = require('path');
const tsImportPluginFactory = require('ts-import-plugin');

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
      {
        test: /ace-builds.*\/worker-.*$/,
        loader: 'file-loader',
        options: {
          esModule: false,
          name: '[name].[hash:8].[ext]',
        },
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
