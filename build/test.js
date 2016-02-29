/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var context = __webpack_require__(2);
	context.keys().forEach(context);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./__test__/hello_spec.js": 3,
		"./utils/__test__/element_spec.js": 7,
		"./utils/__test__/template_spec.js": 5
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 2;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _hello = __webpack_require__(4);

	var expect = chai.expect;
	var should = chai.should();


	describe('hello', function () {
	  it('should say hello', function () {
	    expect((0, _hello.hello)()).to.equal('hello world');
	  });
	  it('should say hello to person', function () {
	    expect((0, _hello.hello)('Bob')).to.equal('hello Bob');
	  });
	});

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.hello = hello;
	function hello(name) {
	  return 'hello ' + (name || 'world');
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _template = __webpack_require__(6);

	var expect = chai.expect;
	var should = chai.should();

	var templateParams = ['rows', 'limit:4', 'paging:true'];
	var templateParamObj = { limit: '4', paging: true };

	describe('getTemplateParams', function () {
	  it('should convert template param string to object', function () {
	    expect((0, _template.getTemplateParams)(templateParams)).to.have.all.keys('limit', 'paging');
	  });
	});

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getTemplateParams = getTemplateParams;
	/**
	 * @desc Determines which HTML elements need to be added: inputFilter, Pagination
	 * @example ["rows", "limit:4", "paging:true"] -> { paging: true }
	 * @param aKey
	 * @returns {{}}
	 */
	function getTemplateParams(aKey) {
	  // Identify any parameters
	  var params = {};
	  var aParams = aKey.splice(1, aKey.length - 1);

	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _iterator = aParams[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var param = _step.value;

	      var tmp = param.split(':');

	      if (tmp[1] === 'true') {
	        params[tmp[0]] = true;
	      } else if (tmp[1] === 'false') {
	        params[tmp[0]] = false;
	      } else {
	        params[tmp[0]] = tmp[1];
	      }
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator.return) {
	        _iterator.return();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }

	  return params;
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _element = __webpack_require__(8);

	var expect = chai.expect;
	var should = chai.should();


	describe('setElementProperties', function () {
	  it('should do something', function () {
	    expect(5).to.not.equal(4);
	  });
	});

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.setElementProperties = setElementProperties;
	/**
	 * @func setElementProperties
	 * @param uri
	 * @param params
	 * @param parentTag
	 * @param itemCount
	 * @returns {boolean}
	 */
	function setElementProperties(uri, params, parentTag, itemCount) {
	  console.log(uri);
	  console.log(params);
	  console.log(parentTag);
	  console.log(itemCount);

	  function HighlightRow() {
	    var currentHighlightedRow = null;

	    function _handlerHighlighRow(e) {
	      var ev = e || event;
	      ev.preventDefault() || ev.stopPropagation();
	      var hit = ev.target || ev.srcElement;

	      // TODO too specific
	      if (hit.nodeName === 'LI') {
	        if (currentHighlightedRow) {
	          var tagCurrent = document.getElementById(currentHighlightedRow);
	          tagCurrent.classList.remove('active');
	        }

	        currentHighlightedRow = hit.id;
	        hit.classList.add('active');
	      } else if (hit.nodeName === 'A') {
	        // TODO cluster
	        if (currentHighlightedRow) {
	          var tagCurrent = document.getElementById(currentHighlightedRow);
	          tagCurrent.classList.remove('active');
	        }

	        var tagParent = hit.parentNode;

	        while (tagParent.nodeName !== 'LI') {
	          tagParent = tagParent.parentNode;
	        }

	        currentHighlightedRow = hit.id;
	      }
	    }

	    // var buttonId = baseId + '_filter_button';
	    // milk.listen.removeEventMonitor(parentTag.id, _handlerHighlighRow);
	    milk.listen.addEventMonitor('click', _handlerHighlighRow, parentTag.id, document.getElementById(parentTag.id), true, true);
	  }

	  function eventHighlightRow(uri, params) {

	    mje.stencil.listener.push(uri, function () {
	      HighlightRow();
	    });
	  }

	  function buildPager(uri, parentTag, itemCount, next) {

	    var ul = document.createElement('ul');
	    ul.classList.add('pagination');
	    var liPrev = document.createElement('li');
	    liPrev.classList.add('ui-icon-previous');
	    var liNext = document.createElement('li');
	    liNext.classList.add('ui-icon-next');

	    var numberOfPages = 0;
	    var iLimit = parseInt(params.limit);
	    if (itemCount % iLimit === 0) numberOfPages = itemCount / parseInt(params.limit);else numberOfPages = Math.ceil(itemCount / iLimit);

	    for (var m = 1; m <= numberOfPages; m++) {
	      var li = document.createElement('li');
	      var a = document.createElement('a');
	      a.innerText = m.toString();
	      a.href = '#';
	      li.appendChild(a);
	      ul.appendChild(li);
	    }

	    var nav = document.createElement(milk.legacyBrowser ? 'div' : 'nav');
	    nav.id = parentTag.id + '_nav';
	    nav.classList.add('text-center');

	    if (milk.legacyBrowser) {
	      nav.appendChild(document.createElement('br'));
	    }

	    if (numberOfPages > 1) {
	      nav.appendChild(ul);
	    }

	    //TABLE PAGER
	    if (parentTag.nodeName == 'TBODY') {

	      var tba = parentTag;
	      while (tba.nodeName !== 'TABLE') {
	        tba = tba.parentNode;
	      }

	      tba.parentNode.appendChild(nav);
	    }
	    //OTHER PAGERS
	    else {
	        parentTag.parentNode.appendChild(nav);

	        if (params.filter) {
	          buildInputFilter(params, parentTag, function (uri, baseId, params) {

	            eventFilter(uri, baseId, params);
	          });
	        }
	      }

	    if (next) {
	      next(uri, { id: nav.id, limit: iLimit });
	    }
	  }

	  function eventPager(uri, params) {

	    mje.stencil.listener.push(uri, function (e) {

	      function _handlerPreviousNext(e) {

	        e = e || event;
	        e.preventDefault() || e.stopPropagation();

	        if (e.target.nodeName == 'A') {

	          var page = e.target.innerText;
	          var children = document.getElementById(params.id.split('_nav')[0]).children;

	          for (var n = 0; n < children.length; n++) {
	            var tag = children[n];

	            if (tag.nodeName == 'NAV') break;

	            tag.classList.add('hide');
	            tag.classList.remove('zebra');

	            console.log(804, n, params);
	            //toggle 'hide' if within range
	            if (n + 1 > page * params.limit - params.limit && n + 1 <= page * params.limit) {
	              tag.classList.toggle('hide');
	              if (params.zebra & n % 2 == 0) {
	                tag.classList.add('zebra');
	              }
	            }
	          }
	        }
	      }

	      var tag = document.getElementById(params.id);

	      if (tag) {
	        var _handlerHighlighRow = function _handlerHighlighRow(e) {

	          e = e || event;
	          //e.preventDefault() || e.stopPropagation();
	          var currentHighlightedRow = '030';

	          var hit = e.srcElement || e.target;

	          var tagParent = hit.parentNode;
	          if (tagParent) {
	            return !1;
	          }

	          while (tagParent.nodeName !== 'UL') {
	            tagParent = tagParent.parentNode;
	          }

	          var aLi = tagParent.getElementsByTagName('li');

	          for (var i = 0; i < aLi.length; i++) {
	            aLi[i].classList.remove('active');
	          }

	          hit.classList.add('active');
	        };

	        tag.addEventListener('click', _handlerPreviousNext, false);

	        var tagUl = tag.parentNode;

	        milk.listen.removeEventMonitor(parentTag.id, _handlerHighlighRow);
	        milk.listen.addEventMonitor('click', _handlerHighlighRow, tagUl.id, tagUl, true, true);
	      }
	    });
	  }

	  //TODO Research if this should be added to TABLEs as well.
	  function buidViewAll(uri, parentTag, params, next) {

	    var div = document.createElement('div');
	    div.id = parentTag.id + "_viewAll";
	    div.innerHTML = '<a >View All</a>';

	    parentTag.parentNode.appendChild(div);

	    if (next) {
	      next(uri, parentTag, params);
	    }
	  }

	  function eventViewAll(uri, parentTag, params) {

	    mje.stencil.listener.push(uri, function (e) {

	      function _handlerViewAll(e) {

	        e = e || event;
	        e.preventDefault() || e.stopPropagation();

	        if (e.target.nodeName == 'A') {

	          if (e.target.innerText == 'View All') {
	            e.target.innerText = 'View Less';

	            var children = document.getElementById(parentTag.id).children;

	            for (var n = 0; n < children.length; n++) {
	              var tag = children[n];

	              if (tag.nodeName == 'NAV') {
	                //TODO this is slow to appear and disapear
	                tag.classList.add('invisible');
	                break;
	              }

	              tag.classList.remove('hide');
	              tag.classList.remove('zebra');

	              if (params['zebra']) {
	                if (n % 2 == 0) {
	                  tag.classList.add('zebra');
	                }
	              }
	            }
	          } else {

	            e.target.innerText = 'View All';
	            var children = document.getElementById(parentTag.id).children;

	            for (var n = 0; n < children.length; n++) {
	              var tag = children[n];

	              if (tag.nodeName == 'NAV') {
	                tag.classList.remove('invisible');
	                break;
	              }

	              tag.classList.add('hide');
	              tag.classList.remove('zebra');

	              if (n + 1 >= 1 && n + 1 <= params.limit) {
	                tag.classList.remove('hide');
	                if (params['zebra']) {
	                  if (n % 2 == 0) {
	                    tag.classList.add('zebra');
	                  }
	                }
	              }
	            }
	          }
	        }
	      }

	      var tag = document.getElementById(parentTag.id + '_viewAll');

	      if (tag) {
	        tag.addEventListener('click', _handlerViewAll, false);

	        //--//milk.listen.addEventMonitor('click', _handlerViewAll, parentTag.id, parentTag, true, true);
	      }
	    });
	  }

	  function buildInputFilter(params, parentTag, next) {

	    var baseId = parentTag.id;
	    var that = parentTag;

	    var mk = that.parentNode.children;
	    var tableDivIndex = 0;
	    for (var mm = 0; mm < mk.length; mm++) {

	      if (mk[mm] == that) {
	        tableDivIndex = mm;
	      }
	    }

	    var tag = document.createElement('div');
	    tag.classList.add('input-group');
	    var input = document.createElement('input');
	    input.id = baseId + '_filter_input';
	    input.setAttribute('type', 'search');
	    input.classList.add('form-control');
	    input.setAttribute('placeholder', 'filter results');
	    input.setAttribute('aria-describedby', 'basic-addon2');
	    var span = document.createElement('span');
	    span.classList.add('input-group-btn');
	    var button = document.createElement('button');
	    button.id = baseId + '_filter_button';
	    button.setAttribute('type', 'button');
	    button.classList.add('btn');
	    button.classList.add('btn-primary');
	    button.classList.add('ui-icon-search');
	    //button.innerText = 'Go';

	    span.appendChild(button);
	    tag.appendChild(input);
	    tag.appendChild(span);

	    that.parentNode.insertBefore(tag, that.parentNode.children[tableDivIndex]);

	    if (next) {
	      next(uri, baseId, params);
	    }
	  }

	  function eventFilter(uri, baseId, params) {

	    mje.stencil.listener.push(uri, function (e) {

	      var _handlerSearchKeyUp = function _handlerSearchKeyUp(e) {

	        e = e || event;
	        var target = e.target || e.srcElement;

	        if (target.value) {
	          if (target.value.length > 1) {
	            search(target.value || null, params);
	          }
	        }
	      };

	      var _handlerSearchEnter = function _handlerSearchEnter(e) {

	        var tag = document.getElementById(baseId + '_filter_input');
	        search(tag.value || null, params);
	      };

	      try {
	        var inputId = baseId + '_filter_input';
	        milk.listen.removeEventMonitor(inputId, _handlerSearchKeyUp);
	        milk.listen.addEventMonitor('keyup', _handlerSearchKeyUp, inputId, document.getElementById(inputId), false, false);

	        var buttonId = baseId + '_filter_button';
	        milk.listen.removeEventMonitor(buttonId, _handlerSearchEnter);
	        milk.listen.addEventMonitor('click', _handlerSearchEnter, buttonId, document.getElementById(buttonId), false, false);
	      } catch (err) {}

	      function search(findMe, params) {

	        var tag = document.getElementById(baseId);

	        if (!tag) {
	          return !1;
	        }

	        var results = mje.look.elementFilter(tag, findMe, params.searchableChildren || []);

	        var itemCount = 0;
	        //Hide All
	        for (var i = 0; i < tag.children.length; i++) {

	          var tmp = tag.children[i];
	          if (tmp) {
	            if (tmp.nodeName !== 'NAV') {
	              tmp.classList.add('hide');
	              tmp.classList.add('filtered');
	              tmp.classList.remove('visibleRow');
	              tmp.classList.remove('zebra');
	              itemCount = itemCount + 1;
	            } else {
	              tmp.parentNode.removeChild(tmp);
	            }
	          }
	        }

	        //Unhide Matched Results
	        for (var i = 0; i < results.rows.length; i++) {

	          var val = results.rows[i];

	          if (tag.children[val]) {
	            if (i < params.limit) {
	              tag.children[val].classList.remove('hide');
	            }

	            if (params['zebra']) {
	              if (i % 2 == 0) {
	                tag.children[val].classList.add('zebra');
	              }
	            }

	            tag.children[val].classList.remove('filtered');
	            tag.children[val].classList.add('visibleRow');
	          }
	        }

	        //
	        var iFilteredOut = tag.getElementsByClassName('filtered').length;

	        var ul = document.createElement('ul');
	        ul.classList.add('pagination');
	        var liPrev = document.createElement('li');
	        liPrev.classList.add('ui-icon-previous');
	        var liNext = document.createElement('li');
	        liNext.classList.add('ui-icon-next');

	        var numberOfPages = 0;
	        var iLimit = parseInt(params.limit);

	        //remove 'Filtered' items from the pagination
	        itemCount = itemCount - iFilteredOut;

	        if (itemCount % iLimit === 0) numberOfPages = itemCount / parseInt(params.limit);else numberOfPages = Math.ceil(itemCount / iLimit);

	        var ul = document.createElement('ul');
	        ul.classList.add('pagination');
	        var liPrev = document.createElement('li');
	        liPrev.classList.add('ui-icon-previous');
	        var liNext = document.createElement('li');
	        liNext.classList.add('ui-icon-next');

	        for (var m = 1; m <= numberOfPages; m++) {
	          var li = document.createElement('li');
	          var a = document.createElement('a');
	          a.innerText = m;
	          a.href = '#';
	          li.appendChild(a);
	          ul.appendChild(li);
	        }

	        if (numberOfPages > 1) {
	          var nav = document.createElement('nav');
	          nav.id = tag.id + '_nav';
	          nav.classList.add('text-center');
	          nav.appendChild(document.createElement('br'));
	          nav.appendChild(ul);

	          tag.appendChild(nav);

	          if (tag.nodeName == 'TBODY') {

	            //find TABLE parent
	            var tba = tag;
	            while (tba.nodeName !== 'TABLE') {
	              tba = tba.parentNode;
	            }
	            tba.parentNode.appendChild(nav);
	          } else {
	            tag.appendChild(nav);
	          }

	          var _handlerPreviousNext = function _handlerPreviousNext(e) {

	            e = e || event;
	            e.preventDefault() || e.stopPropagation();

	            if (e.target.nodeName == 'A') {

	              var page = e.target.innerText;
	              var children = document.getElementById(baseId.split('_nav')[0]).getElementsByClassName('visibleRow');

	              for (var n = 0; n < children.length; n++) {
	                var tag = children[n];

	                if (tag.nodeName == 'NAV') break;

	                tag.classList.add('hide');

	                //toggle 'unhide' if within range
	                if (n + 1 > page * params.limit - params.limit && n + 1 <= page * params.limit) {
	                  tag.classList.toggle('hide');
	                  if (n % 2 == 0) {
	                    tag.classList.add('zebra');
	                  }
	                }
	              }
	            }
	          };

	          //params
	          var tag = document.getElementById(baseId + '_nav');
	          tag.addEventListener('click', _handlerPreviousNext, false);
	        }
	      }
	    });
	  }

	  if (!params) {
	    return !1;
	  }

	  if (!params['limit']) {
	    params['limit'] = 5;
	  }

	  if (params['paging']) {
	    buildPager(uri, parentTag, itemCount, function (uri, args) {
	      eventPager(uri, args);
	    });
	  }

	  if (params['highlightRow']) {
	    eventHighlightRow(uri, params);
	  }

	  if (params['viewAll']) {
	    buidViewAll(uri, parentTag, params, function (uri, parentTag, params) {
	      eventViewAll(uri, parentTag, params);
	    });
	  }
	}

/***/ }
/******/ ]);