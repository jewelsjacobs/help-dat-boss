/* @flow */

var Hello = function hello(name: string): string {
  return 'hello ' + (name || 'world');
};

module.exports = Hello;
