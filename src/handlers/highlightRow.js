let currentHighlightedRow = null;

/**
 * @func _handlerHighlightRow
 * @param e
 * @private
 */
function _handlerHighlightRow(e) {
  const ev = e || event;
  ev.preventDefault() || ev.stopPropagation();
  const hit = ev.target || ev.srcElement;

  // TODO too specific
  if (hit.nodeName === 'LI') {
    if (currentHighlightedRow) {
      const tagCurrent = document.getElementById(currentHighlightedRow);
      tagCurrent.classList.remove('active');
    }

    currentHighlightedRow = hit.id;
    hit.classList.add('active');
  } else if (hit.nodeName === 'A') {
    // TODO cluster
    if (currentHighlightedRow) {
      const tagCurrent = document.getElementById(currentHighlightedRow);
      tagCurrent.classList.remove('active');
    }

    let tagParent = hit.parentNode;

    while (tagParent.nodeName !== 'LI') {
      tagParent = tagParent.parentNode;
    }

    currentHighlightedRow = hit.id;
  }
}

/**
 * @func highlightRow
 * @desc event monitor for highlighting rows on click events
 * @param parentTag
 */
function highlightRow(parentTag: Object) {
  milk.listen.addEventMonitor('click', _handlerHighlightRow,
    parentTag.id, document.getElementById(parentTag.id), true, true);
}

/**
 * @func eventHighlightRow
 * @desc event listener for highlighting rows on click events
 * @param uri
 * @param params
 * @param parentTag
 */
export function eventHighlightRow(uri: string, parentTag: Object) {
  mje.stencil.listener.push(uri, () => {
    highlightRow(parentTag);
  });
}