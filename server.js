var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

// Start watching and bundling tests here
var tests = require('./webpack.test.config');
var testsCompiler = webpack(tests);

testsCompiler.watch({}, function (err) {
  if (err) console.log(err);
  // console.log('Test file bundled');
});

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(3000, 'localhost', function (err) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:3000');
});
