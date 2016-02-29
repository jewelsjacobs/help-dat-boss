/* @flow */
import $ from 'jquery';
import { hello } from './hello';

/**
 * @class bossRefactor
 * @desc namespace for global class exposed to browser
 * @type {{}}
 */
const bossRefactor = {};

// this is just to test everything
bossRefactor.hello = hello;
window.bossRefactor = bossRefactor;
