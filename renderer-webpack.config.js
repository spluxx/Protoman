const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const lessToJs = require('less-vars-to-js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const tsImportPluginFactory = require('ts-import-plugin');

const antdThemeOverrides = lessToJs(fs.readFileSync(path.join(__dirname, './theme.less'), 'utf8'));

console.log(antdThemeOverrides);

const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  mode: NODE_ENV,
  devtool: 'inline-source-map',
  entry: './src/renderer/index.tsx',
  target: 'electron-renderer',
  output: {
    filename: 'renderer.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          compilerOptions: {
            module: 'esnext',
          },
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: true,
              }),
            ],
          }),
        },
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        loader: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              modifyVars: antdThemeOverrides,
            },
          },
        ],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  watchOptions: {
    poll: true,
    ignored: /node_modules/,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'UT-Proto',
      template: './templates/index.html',
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ja|it/),
    ...(NODE_ENV === 'production' ? [new BundleAnalyzerPlugin()] : []),
  ],
};
