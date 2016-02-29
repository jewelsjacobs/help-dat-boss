/* @flow */
import $ from 'jquery';
import { hello } from './hello';

/**
 * @class bossRefactor
 * @desc namespace for global class exposed to browser
 * @type {{}}
 */
const bossRefactor = {};
bossRefactor.hello = hello;
window.bossRefactor = bossRefactor;
