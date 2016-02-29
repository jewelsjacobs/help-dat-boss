var path = require('path');

module.exports = {
  entry: {
    test: [path.join(__dirname, 'webpack.test.bootstrap.js')]
  },
  output: {
    path: path.join(__dirname, './build'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['src', 'node_modules']
  },
  node: {
    fs: 'empty'
  }
};
