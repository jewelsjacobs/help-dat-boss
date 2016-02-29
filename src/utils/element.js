import { eventHighlightRow } from '../handlers/highlightRow';

/**
 * @func setElementProperties
 * @param uri
 * @param params
 * @param parentTag
 * @param itemCount
 * @returns {boolean}
 */
export function setElementProperties(uri, params: Object, parentTag: Object, itemCount: number) {
  console.log(uri);
  console.log(params);
  console.log(parentTag);
  console.log(itemCount);

  function buildPager(uri, parentTag, itemCount, next) {
    const ul = document.createElement('ul');
    ul.classList.add('pagination');
    const liPrev = document.createElement('li');
    liPrev.classList.add('ui-icon-previous');
    const liNext = document.createElement('li');
    liNext.classList.add('ui-icon-next');

    let numberOfPages = 0;
    const iLimit = parseInt(params.limit, 10);
    if (itemCount % iLimit === 0) {
      numberOfPages = itemCount / parseInt(params.limit);
    } else {
      numberOfPages = Math.ceil(itemCount / iLimit);
    }

    for (let m = 1; m <= numberOfPages; m++) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.innerText = m.toString();
      a.href = '#';
      li.appendChild(a);
      ul.appendChild(li);
    }

    const nav = document.createElement((milk.legacyBrowser) ? 'div' : 'nav');
    nav.id = parentTag.id + '_nav';
    nav.classList.add('text-center');

    if (milk.legacyBrowser) {
      nav.appendChild(document.createElement('br'));
    }

    if (numberOfPages > 1) {
      nav.appendChild(ul);
    }

    // TABLE PAGER
    if (parentTag.nodeName === 'TBODY') {

      let tba = parentTag;
      while (tba.nodeName !== 'TABLE') {
        tba = tba.parentNode;
      }

      tba.parentNode.appendChild(nav);
    } else {
      // OTHER PAGERS
      parentTag.parentNode.appendChild(nav);

      if (params.filter) {
        buildInputFilter(params, parentTag, (uri, baseId, params) => {
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
        const ev = e || event;
        ev.preventDefault() || ev.stopPropagation();

        if (ev.target.nodeName === 'A') {
          const page = ev.target.innerText;
          const children = document.getElementById((params.id).split('_nav')[0]).children;

          for (let n = 0; n < children.length; n++) {
            const tag = children[n];

            if (tag.nodeName === 'NAV') {
              break;
            }

            tag.classList.add('hide');
            tag.classList.remove('zebra');

            console.log(804, n, params);
            // toggle 'hide' if within range
            if (((n + 1) > ((page * params.limit) - params.limit)) &&
              ((n + 1) <= (page * params.limit))) {
              tag.classList.toggle('hide');
              if (params.zebra & (n % 2 === 0)) {
                tag.classList.add('zebra');
              }
            }
          }
        }
      }

      const tag = document.getElementById(params.id);

      if (tag) {
        tag.addEventListener('click', _handlerPreviousNext, false);

        const tagUl = tag.parentNode;

        function _handlerHighlighRow(e) {
          ev = e || event;

          const currentHighlightedRow = '030';

          const hit = ev.srcElement || ev.target;

          let tagParent = hit.parentNode;
          if (tagParent) {
            return !1;
          }

          while (tagParent.nodeName !== 'UL') {
            tagParent = tagParent.parentNode;
          }

          const aLi = tagParent.getElementsByTagName('li');

          for (let i = 0; i < aLi.length; i++) {
            aLi[i].classList.remove('active');
          }

          hit.classList.add('active');
        }

        milk.listen.removeEventMonitor(parentTag.id, _handlerHighlighRow);
        milk.listen.addEventMonitor('click', _handlerHighlighRow, tagUl.id, tagUl, true, true);
      }
    });
  }

// TODO Research if this should be added to TABLEs as well.
  function buidViewAll(uri, parentTag, params, next) {
    const div = document.createElement('div');
    div.id = `${parentTag.id}_viewAll`;
    div.innerHTML = '<a >View All</a>';

    parentTag.parentNode.appendChild(div);

    if (next) {
      next(uri, parentTag, params);
    }
  }

  function eventViewAll(uri, parentTag, params) {
    mje.stencil.listener.push(uri, (e) => {
      function _handlerViewAll(e) {
        const ev = e || event;
        ev.preventDefault() || ev.stopPropagation();

        if (ev.target.nodeName === 'A') {
          if (ev.target.innerText === 'View All') {
            ev.target.innerText = 'View Less';

            const children = document.getElementById((parentTag.id)).children;

            for (let n = 0; n < children.length; n++) {
              const tag = children[n];

              if (tag.nodeName === 'NAV') {
                // TODO this is slow to appear and disapear
                tag.classList.add('invisible');
                break;
              }

              tag.classList.remove('hide');
              tag.classList.remove('zebra');

              if (params.zebra) {
                if (n % 2 === 0) {
                  tag.classList.add('zebra');
                }
              }
            }
          } else {
            ev.target.innerText = 'View All';
            const children = document.getElementById((parentTag.id)).children;

            for (let n = 0; n < children.length; n++) {
              const tag = children[n];

              if (tag.nodeName === 'NAV') {
                tag.classList.remove('invisible');
                break;
              }

              tag.classList.add('hide');
              tag.classList.remove('zebra');

              if (((n + 1) >= 1) && ((n + 1) <= params.limit)) {
                tag.classList.remove('hide');
                if (params.zebra) {
                  if (n % 2 === 0) {
                    tag.classList.add('zebra');
                  }
                }
              }
            }
          }
        }
      }

      const tag = document.getElementById(`${parentTag.id}_viewAll`);

      if (tag) {
        tag.addEventListener('click', _handlerViewAll, false);
      }
    });
  }

  function buildInputFilter(params, parentTag, next) {
    const baseId = parentTag.id;
    const that = parentTag;

    const mk = that.parentNode.children;
    let tableDivIndex = 0;
    for (let mm = 0; mm < mk.length; mm++) {
      if (mk[mm] === that) {
        tableDivIndex = mm;
      }
    }

    const tag = document.createElement('div');
    tag.classList.add('input-group');
    const input = document.createElement('input');
    input.id = baseId + '_filter_input';
    input.setAttribute('type', 'search');
    input.classList.add('form-control');
    input.setAttribute('placeholder', 'filter results');
    input.setAttribute('aria-describedby', 'basic-addon2');
    const span = document.createElement('span');
    span.classList.add('input-group-btn');
    const button = document.createElement('button');
    button.id = baseId + '_filter_button';
    button.setAttribute('type', 'button');
    button.classList.add('btn');
    button.classList.add('btn-primary');
    button.classList.add('ui-icon-search');
    // button.innerText = 'Go';

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
      const _handlerSearchKeyUp = function (e) {
        e = e || event;
        const target = e.target || e.srcElement;

        if (target.value && target.value.length > 1) {
          search((target.value || null), params);
        }
      };

      const _handlerSearchEnter = function (e) {
        const tag = document.getElementById(`${baseId}_filter_input`);
        search((tag.value || null), params);
      };

      try {
        const inputId = baseId + '_filter_input';
        milk.listen.removeEventMonitor(inputId, _handlerSearchKeyUp);
        milk.listen.addEventMonitor('keyup', _handlerSearchKeyUp, inputId, document.getElementById(inputId), false, false);

        const buttonId = baseId + '_filter_button';
        milk.listen.removeEventMonitor(buttonId, _handlerSearchEnter);
        milk.listen.addEventMonitor('click', _handlerSearchEnter, buttonId, document.getElementById(buttonId), false, false);
      } catch (err) {
        console.log(err);
      }

      function search(findMe, params) {
        const tag = document.getElementById(baseId);

        if (!tag) {
          return !1;
        }

        const results = mje.look.elementFilter(tag, findMe, params.searchableChildren || []);

        let itemCount = 0;
        // Hide All
        for (let i = 0; i < tag.children.length; i++) {
          const tmp = tag.children[i];
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

        // Unhide Matched Results
        for (let i = 0; i < results.rows.length; i++) {
          const val = results.rows[i];

          if (tag.children[val]) {
            if (i < params.limit) {
              tag.children[val].classList.remove('hide');
            }

            if (params.zebra) {
              if (i % 2 === 0) {
                tag.children[val].classList.add('zebra');
              }
            }

            tag.children[val].classList.remove('filtered');
            tag.children[val].classList.add('visibleRow');
          }
        }

        const iFilteredOut = tag.getElementsByClassName('filtered').length;

        const ul = document.createElement('ul');
        ul.classList.add('pagination');
        const liPrev = document.createElement('li');
        liPrev.classList.add('ui-icon-previous');
        const liNext = document.createElement('li');
        liNext.classList.add('ui-icon-next');

        let numberOfPages = 0;
        const iLimit = parseInt(params.limit);

        // remove 'Filtered' items from the pagination
        itemCount = itemCount - iFilteredOut;

        if (itemCount % iLimit === 0) {
          numberOfPages = itemCount / parseInt(params.limit, 10);
        } else {
          numberOfPages = Math.ceil(itemCount / iLimit);
        }

        for (let m = 1; m <= numberOfPages; m++) {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.innerText = m;
          a.href = '#';
          li.appendChild(a);
          ul.appendChild(li);
        }

        if (numberOfPages > 1) {
          const nav = document.createElement('nav');
          nav.id = `${tag.id}_nav`;
          nav.classList.add('text-center');
          nav.appendChild(document.createElement('br'));
          nav.appendChild(ul);

          tag.appendChild(nav);

          if (tag.nodeName === 'TBODY') {
            // find TABLE parent
            let tba = tag;
            while (tba.nodeName !== 'TABLE') {
              tba = tba.parentNode;
            }
            tba.parentNode.appendChild(nav);
          } else {
            tag.appendChild(nav);
          }

          const _handlerPreviousNext = function (e) {
            const ev = e || event;
            ev.preventDefault() || ev.stopPropagation();

            if (ev.target.nodeName === 'A') {
              const page = ev.target.innerText;
              const children = document.getElementById((baseId).split('_nav')[0])
                .getElementsByClassName('visibleRow');

              for (let n = 0; n < children.length; n++) {
                const visibleTag = children[n];

                if (visibleTag.nodeName === 'NAV') {
                  break;
                }

                visibleTag.classList.add('hide');

                // toggle 'unhide' if within range
                if (((n + 1) > ((page * params.limit) - params.limit))
                  && ((n + 1) <= (page * params.limit))) {
                  visibleTag.classList.toggle('hide');
                  if (n % 2 === 0) {
                    visibleTag.classList.add('zebra');
                  }
                }
              }
            }
          }

          // params
          const navTag = document.getElementById(`${baseId}_nav`);
          navTag.addEventListener('click', _handlerPreviousNext, false);
        }
      }
    });
  }

  if (!params) {
    return !1;
  }

  if (!params.limit) {
    params.limit = 5;
  }

  if (params.paging) {
    buildPager(uri, parentTag, itemCount, (uri, args) => {
      eventPager(uri, args);
    });
  }

  if (params.highlightRow) {
    eventHighlightRow(uri, parentTag);
  }

  if (params.viewAll) {
    buidViewAll(uri, parentTag, params, (uri, parentTag, params) => {
      eventViewAll(uri, parentTag, params);
    });
  }
}