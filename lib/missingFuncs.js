    /// <summary>
    ///   Determines which HTML elements need to be added: inputFilter, Pagination
    /// <example>
    /// data-milk-loop="rows|limit:5|paging:true|filter:false|zebra:false|highlightRow:true|viewAll:true|searchableChildren:[2]"
    /// <special params>
    /// <returns>returns string
    function getTemplateParams(aKey) {

        //Identify any parameters
        var params = {};
        var aParams = aKey.splice(1, (aKey.length - 1));

        for (var p = 0; p < aParams.length; p++) {
            var tmp = (aParams[p].split(':'));


            if (tmp[1] == "true") {
                params[tmp[0]] = true;
            }
            else if (tmp[1] == "false") {
                params[tmp[0]] = false;
            }
            else {
                params[tmp[0]] = tmp[1];
            }
        }

        return params;
    }
    
    
    /// <summary>
    ///   Determines which HTML elements need to be added: inputFilter, Pagination
    /// <example>
    /// <special params>
    /// <returns>returns string
    function setElementProperties(uri, params, parentTag, itemCount) {

        console.log(uri);
        console.log(params);
        console.log(parentTag);
        console.log(itemCount);


        if (!params) {
            return !1;
        }

        if (!params['limit']) {
            params['limit'] = 5;
        }

        if (params['paging']) {

            buildPager(uri, parentTag, itemCount, function (uri, args) {

                eventPager(uri, args);
            })
        }

        if (params['highlightRow']) {

            eventHighlightRow(uri, params);
        }

        if (params['viewAll']) {

            buidViewAll(uri, parentTag, params, function (uri, parentTag, params) {

                eventViewAll(uri, parentTag, params);
            })
        }


        function HighlightRow() {

            var currentHighlightedRow = null;

            function _handlerHighlighRow(e) {

                e = e || event;
                e.preventDefault() || e.stopPropagation();
                var hit = e.target || e.srcElement;

                //TODO too specific
                if (hit.nodeName == 'LI') {

                    if (currentHighlightedRow) {
                        var tagCurrent = document.getElementById(currentHighlightedRow);
                        tagCurrent.classList.remove('active');
                    }

                    currentHighlightedRow = hit.id;
                    hit.classList.add('active');
                }
                else if (hit.nodeName == 'A') {

                    //TODO cluster
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
            };

            //var buttonId = baseId + '_filter_button';
            //milk.listen.removeEventMonitor(parentTag.id, _handlerHighlighRow);
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
            if (itemCount % iLimit === 0)
                numberOfPages = itemCount / parseInt(params.limit);
            else
                numberOfPages = Math.ceil(itemCount / iLimit);

            for (var m = 1; m <= numberOfPages; m++) {
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.innerText = m.toString();
                a.href = '#';
                li.appendChild(a);
                ul.appendChild(li);
            }


            var nav = document.createElement((milk.legacyBrowser) ? 'div' : 'nav');
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
                    })
                }
            }


            if (next) {
                next(uri, {id: nav.id, limit: iLimit});
            }
        }

        function eventPager(uri, params) {

            mje.stencil.listener.push(uri, function (e) {

                function _handlerPreviousNext(e) {

                    e = e || event;
                    e.preventDefault() || e.stopPropagation();

                    if (e.target.nodeName == 'A') {

                        var page = e.target.innerText;
                        var children = document.getElementById((params.id).split('_nav')[0]).children;

                        for (var n = 0; n < children.length; n++) {
                            var tag = children[n];

                            if (tag.nodeName == 'NAV')
                                break;

                            tag.classList.add('hide');
                            tag.classList.remove('zebra');

                            console.log(804, n, params)
                            //toggle 'hide' if within range
                            if (((n + 1) > ((page * params.limit) - params.limit)) && ((n + 1) <= (page * params.limit))) {
                                tag.classList.toggle('hide');
                                if (params.zebra & (n % 2 == 0)) {
                                    tag.classList.add('zebra');
                                }
                            }
                        }
                    }
                }

                var tag = document.getElementById(params.id);

                if (tag) {
                    tag.addEventListener('click', _handlerPreviousNext, false);


                    var tagUl = tag.parentNode;

                    function _handlerHighlighRow(e) {

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
                            aLi[i].classList.remove('active')
                        }

                        hit.classList.add('active');
                    }

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

                            var children = document.getElementById((parentTag.id)).children;

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
                        }
                        else {

                            e.target.innerText = 'View All';
                            var children = document.getElementById((parentTag.id)).children;

                            for (var n = 0; n < children.length; n++) {
                                var tag = children[n];

                                if (tag.nodeName == 'NAV') {
                                    tag.classList.remove('invisible');
                                    break;
                                }

                                tag.classList.add('hide');
                                tag.classList.remove('zebra');

                                if (((n + 1) >= 1 ) && ((n + 1) <= params.limit)) {
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

                var _handlerSearchKeyUp = function (e) {

                    e = e || event;
                    var target = e.target || e.srcElement;

                    if (target.value) {
                        if (target.value.length > 1) {
                            search((target.value || null), params);
                        }
                    }
                };

                var _handlerSearchEnter = function (e) {

                    var tag = document.getElementById(baseId + '_filter_input');
                    search((tag.value || null), params);

                };

                try {
                    var inputId = baseId + '_filter_input';
                    milk.listen.removeEventMonitor(inputId, _handlerSearchKeyUp);
                    milk.listen.addEventMonitor('keyup', _handlerSearchKeyUp, inputId, document.getElementById(inputId), false, false);


                    var buttonId = baseId + '_filter_button';
                    milk.listen.removeEventMonitor(buttonId, _handlerSearchEnter);
                    milk.listen.addEventMonitor('click', _handlerSearchEnter, buttonId, document.getElementById(buttonId), false, false);
                }
                catch (err) {
                }

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
                            }
                            else {
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

                    if (itemCount % iLimit === 0)
                        numberOfPages = itemCount / parseInt(params.limit);
                    else
                        numberOfPages = Math.ceil(itemCount / iLimit);


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

                        tag.appendChild(nav)

                        if (tag.nodeName == 'TBODY') {

                            //find TABLE parent
                            var tba = tag;
                            while (tba.nodeName !== 'TABLE') {
                                tba = tba.parentNode;
                            }
                            tba.parentNode.appendChild(nav);
                        }
                        else {
                            tag.appendChild(nav);
                        }


                        var _handlerPreviousNext = function (e) {

                            e = e || event;
                            e.preventDefault() || e.stopPropagation();

                            if (e.target.nodeName == 'A') {

                                var page = e.target.innerText;
                                var children = document.getElementById((baseId).split('_nav')[0]).getElementsByClassName('visibleRow');

                                for (var n = 0; n < children.length; n++) {
                                    var tag = children[n];

                                    if (tag.nodeName == 'NAV')
                                        break;

                                    tag.classList.add('hide');

                                    //toggle 'unhide' if within range
                                    if (((n + 1) > ((page * params.limit) - params.limit)) && ((n + 1) <= (page * params.limit))) {
                                        tag.classList.toggle('hide');
                                        if (n % 2 == 0) {
                                            tag.classList.add('zebra');
                                        }
                                    }

                                }
                            }
                        }

                        //params
                        var tag = document.getElementById(baseId + '_nav');
                        tag.addEventListener('click', _handlerPreviousNext, false);
                    }
                }

            });
        }
    }

    /// <summary>
    /// <example>
    /// <special params>
    /// <returns>returns string
    function setTableProperties(uri, params, parentTag, data) {

        var baseId = parentTag.id;
        var that = parentTag;
        var sortBy = null;

        var _handlerToggleSetting = function (e) {

            e = e || event;
            e.preventDefault() || e.stopPropagation();

            var id = (e.currentTarget.id).split('_settings')[0];
            var tag = document.getElementById(id + '_settingsColumns');
            tag.classList.toggle('hide');
        }

        var _handlerHideColumn = function (e) {

            e = e || event;
            e.preventDefault() || e.stopPropagation();
            var target = e.target || e.srcElement;
            var curTarget = e.currentTarget;

            var gTable = that;
            while (gTable.nodeName !== 'TABLE') {
                gTable = gTable.parentNode;
            }
            gTable = document.getElementById(gTable.id);
            var gHeader = gTable.getElementsByTagName("th");

            //find columnIndex of header to hide and use the columnIndex to hide the column in each row
            var columnIndex = 0;
            for (var i = 0; i < gHeader.length; i++) {
                if (gHeader[i].innerText == target.innerText) {
                    columnIndex = i;
                    break;
                }
            }

            var gRows = gTable.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

            if (target.classList.contains('hid')) {

                target.classList.remove('hid');
                target.classList.add('show');
                target.classList.add('added');

                //show column data
                for (var i = 0; i < gRows.length; i++) {
                    gRows[i].cells[columnIndex].classList.remove('hide');
                }
                //toggle classes
                gHeader[columnIndex].classList.remove('hide');
                gHeader[columnIndex].classList.add('show');

                //save hidden columns back to original object: pop array
                ///saved.splice(saved.indexOf(gHeader[columnIndex].textContent), 1)

            } else {

                target.classList.remove('show');
                target.classList.add('hid');
                target.classList.remove('added');

                //hide column data
                for (var i = 0; i < gRows.length; i++) {
                    gRows[i].cells[columnIndex].classList.add('hide');
                }

                gHeader[columnIndex].classList.add('hide');
                gHeader[columnIndex].classList.remove('show');

            }

            //Toggle class:active for clicked LI
            curTarget.children[columnIndex].classList.toggle('active');
        }

        function _handlerSortColumn(e) {

            e = e || event;
            e.preventDefault() || e.stopPropagation();
            var target = e.target || e.srcElement;
            var curTarget = e.currentTarget;

            if (target.nodeName !== 'TH') return !1;


            var gTable = that;
            while (gTable.nodeName !== 'TABLE') {
                gTable = gTable.parentNode;
            }

            ////Pull ALL data from table
            var data = milk.data.table2Json({
                id: gTable.id,
                resultType: 'json'
            });

            //must build headers first in order to use the key value
            //set column headers and array indexes
            var aHeaders = [];
            var colHeaders = data.rows[0];
            for (var key in colHeaders) {
                if (colHeaders.hasOwnProperty(key)) {
                    aHeaders.push(key);
                }
            }

            //Sorting
            function sortByKey(array, key, giSortAsc) {

                var a = array.sort(function (a, b) {

                    var columnType = 'String';
                    //if (giSortColumnDates.contains(key))
                    //    columnType = 'Date';
                    //else if (giaSortColumnNumbers.contains(key))
                    //    columnType = 'Number';

                    switch (columnType) {
                        case 'String':
                            var x = a[key];
                            var y = b[key];

                            if (giSortAsc) {
                                return ((x < y) ? -1 : ((x > y) ? 1 : 0)); 		//asc
                            } else {
                                return ((x > y) ? -1 : ((x < y) ? 1 : 0)); 		//desc
                            }
                        case 'Number':
                            var x = parseInt(a[key]);
                            var y = parseInt(b[key]);

                            if (giSortAsc) {
                                return ((x < y) ? -1 : ((x > y) ? 1 : 0)); 		//asc
                            } else {
                                return ((x > y) ? -1 : ((x < y) ? 1 : 0)); 		//desc
                            }
                        case 'Date':
                            var x = new Date(a[key]);
                            var y = new Date(b[key]);

                            if (giSortAsc) {
                                return (x - y); 		                            //asc
                            } else {
                                return (y - x); 		                        //desc
                            }
                    }
                });

                return a;
            }

            if (sortBy == target) {
                if (target.classList.contains('sortDown')) {
                    target.classList.remove('sortDown');
                    target.classList.add('sortUp');

                    var sortD = sortByKey(data.rows, aHeaders[target.cellIndex], false);
                    data.rows = sortD;
                }
                else if (target.classList.contains('sortUp')) {
                    target.classList.remove('sortUp');
                    target.classList.add('sortDown');

                    var sortD = sortByKey(data.rows, aHeaders[target.cellIndex], true);
                    data.rows = sortD;
                }
            }
            else {
                var gTRTH = target.parentNode.getElementsByTagName('TH');
                for (var i = 0; i < gTRTH.length; i++) {
                    gTRTH[i].classList.remove('sortDown');
                    gTRTH[i].classList.remove('sortUp');
                }

                target.classList.add('sortUp');
                var sortD = sortByKey(data.rows, aHeaders[target.cellIndex], false);
                data.rows = sortD;
            }
            sortBy = target;


            //determine which columns to show|hide
            var gHeader = document.getElementById(baseId + '_settingsColumns').children;
            var aHideTheseHeaders = [];
            for (var i = 0; i < gHeader.length; i++) {

                if (!(gHeader[i].classList.contains('active'))) {
                    aHideTheseHeaders.push(i);
                }
            }

            //Show|Hide rows and columns
            var eTBody = document.createElement('tbody');
            for (var i = 0; i < data.records; i++) {
                var eRow = eTBody.insertRow(i);

                //Show|Hide Columns
                for (var k = 0; k < data.columCount; k++) {

                    var eTBD = document.createElement('td');
                    eTBD.innerHTML = data.rows[i][aHeaders[k]];
                    eRow.appendChild(eTBD);

                    //hide column if in aHideTheseHeaders
                    if (aHideTheseHeaders.contains(k)) {
                        eTBD.classList.add('hide');
                    }
                }

                //Show|Hide Rows
                var page = 1;
                var iLimit = null;
                if (params.limit)
                    iLimit = parseInt(params.limit);

                if (iLimit) {
                    eRow.classList.add('hide');
                    if (((i + 1) > ((page * iLimit) - iLimit)) && ((i + 1) <= (page * iLimit))) {

                        eRow.classList.remove('hide');
                    }
                }

                eTBody.appendChild(eRow);
            }

            var gTable = document.getElementById(gTable.id);
            var childIndex = 0;
            for (var k = 0; k < gTable.children.length; k++) {
                childIndex = k;
                if (gTable.children[k].nodeName === 'TBODY') {
                    break;
                }
            }

            //Append DOM
            var gTBody = gTable.children[childIndex];
            eTBody.id = gTBody.id;
            gTable.insertBefore(eTBody, gTBody)
            gTable.removeChild(gTBody);
        }

        var gTable = that;
        while (gTable.nodeName !== 'TABLE') {
            gTable = gTable.parentNode;
        }

        if (!gTable.id) {
            gTable.id = milk.randomId(8);
        }

        //CALENDAR VIEW DEV
        if (gTable.classList.contains('milk-calendar')) {
            gTable.parentNode.classList.add("calendar-container");

            //TODO Test Data
            data = fakeAppointmentResult;
            //data = null;
            ///var headers = gTable.getElementsByTagName('thead')[0].getElementsByTagName('th');

            var weekday = new Array(7);
            weekday[-1] = "";
            weekday[0] = "Sun";
            weekday[1] = "Mon";
            weekday[2] = "Tues";
            weekday[3] = "Wed";
            weekday[4] = "Thu";
            weekday[5] = "Fri";
            weekday[6] = "Sat";


            function sortInt(a, b) {
                return a - b;
            }

            var tbody = gTable.getElementsByTagName('tbody')[0];
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }


            //Push timeSlots into JSON container
            //CG
            var timeSlots = {};
            var dateBench = null;
            var weekDates = [];
            var sorted = data.rows; //sortByKey(data.rows, params.calDate);

            //TODO Blank Calendar
            if (!data || data.rows == null || data.rows.length < 1) {


                var aheaders = gTable.getElementsByTagName('thead')[0];
                while (aheaders.firstChild) {
                    aheaders.removeChild(aheaders.firstChild);
                }
                var trheader = document.createElement('tr');
                for (var i = -1; i < 7; i++) {

                    var date = new Date();
                    var startDate = new Date(date);
                    startDate.setDate(startDate.getDate() - date.getDay());

                    var newdate = new Date(date);
                    newdate.setDate(newdate.getDate() + i - 1);


                    var dd = newdate.getDate();
                    var mm = newdate.getMonth() + 1;
                    var y = newdate.getFullYear();
                    var form = mm + '/' + dd + '/' + y;

                    var tdHeader = document.createElement('td');

                    if (i == -1) {
                        tdHeader.innerHTML = weekday[i];
                    }
                    else {
                        tdHeader.innerHTML = weekday[i] + ' ' + form;
                        weekDates[i] = form;
                    }

                    trheader.appendChild(tdHeader)
                }
                aheaders.appendChild(trheader);


                for (var i = 0; i < 10; i++) {

                    var trTime = document.createElement('tr');
                    //Set Time:AMPM TD (Y-Axis)

                    for (var k = -1; k < 7; k++) {
                        var tdTime = document.createElement('td');

                        if (k == -1) {
                            var ampm = 'AM';
                            var hr = i + 8;
                            if (hr > 11 && hr != 24) {
                                if (hr != 12) {
                                    hr = hr - 12;
                                }
                                ampm = 'PM'
                            }

                            tdTime.innerText = hr + ':00 ' + ampm;
                        }

                        if (k == 0 || k == 6) {
                            tdTime.classList.add('weekend');
                        }

                        trTime.appendChild(tdTime);
                    }

                    tbody.appendChild(trTime);
                }

                return;
            }


            //*********************************************************************************
            //*********************************************************************************


            //timeSlots
            for (var i = 0; i < sorted.length; i++) {

                var hr = sorted[i][params.calTime].split(':')[0];
                var min = sorted[i][params.calTime].split(':')[1].split(' ')[0];
                var ampm = (sorted[i][params.calTime].split(':')[1].split(' ')[1]).toUpperCase();

                if (!timeSlots[ampm + hr]) {
                    timeSlots[ampm + hr] = {};
                    timeSlots[ampm + hr]['00'] = [];
                    timeSlots[ampm + hr]['30'] = [];
                }

                if (parseInt(min) < 30) {

                    if (!timeSlots[ampm + hr]['00'][sorted[i][params.calDate]]) {
                        timeSlots[ampm + hr]['00'][sorted[i][params.calDate]] = [];
                    }

                    timeSlots[ampm + hr]['00'][sorted[i][params.calDate]].push(sorted[i]);
                    dateBench = new Date(sorted[i][params.calDate]);
                }
                else {

                    if (!timeSlots[ampm + hr]['30'][sorted[i][params.calDate]]) {
                        timeSlots[ampm + hr]['30'][sorted[i][params.calDate]] = [];
                    }

                    timeSlots[ampm + hr]['30'][sorted[i][params.calDate]].push(sorted[i]);
                    dateBench = new Date(sorted[i][params.calDate]);
                }
            }


            //Column Headers
            var aheaders = gTable.getElementsByTagName('thead')[0];
            while (aheaders.firstChild) {
                aheaders.removeChild(aheaders.firstChild);
            }


            var trheader = document.createElement('tr');


            var today = new Date();
            var sundDate = new Date();
            sundDate.setDate(sundDate.getDate() - today.getDay());

            for (var i = -1; i < 7; i++) {

                var newdate = new Date();
                newdate.setDate(sundDate.getDate() + i);

                var dd = newdate.getDate();
                var mm = newdate.getMonth() + 1;
                var y = newdate.getFullYear();
                var form = mm + '/' + dd + '/' + y;

                var tdHeader = document.createElement('td');

                if (i == -1) {
                    tdHeader.innerHTML = weekday[i];
                }
                else {
                    tdHeader.innerHTML = weekday[i] + ' ' + form;
                    weekDates[i] = form;
                }

                trheader.appendChild(tdHeader)
            }
            aheaders.appendChild(trheader);

            //reformat weekDates
            for (var r = 0; r < weekDates.length; r++) {

                var parts = weekDates[r].split('/');
                var dd = (parts[0].length == 2) ? parts[0] : '0' + parts[0];
                var mm = (parts[1].length == 2) ? parts[1] : '0' + parts[1];

                weekDates[r] = dd + '/' + mm + '/' + parts[2];
            }

            var calTime30 = {total: 0, pattern: ['00', '30']};

            var asi = [];
            for (var hourampm in timeSlots) {

                if (hourampm.substr(0, 2) == 'AM') {
                    asi.push(parseInt(hourampm.substring(2, hourampm.length)));
                }
                else {
                    var tmp = parseInt(hourampm.substring(2, hourampm.length)) + 12;
                    asi.push(tmp);
                }
            }

            //Determine Start and End time in hours
            var asi = asi.sort(sortInt);
            var siTime = asi[0];
            var eiTime = asi[asi.length - 1];
            var seDiff = (eiTime - siTime);

            //TODO 1
            var aTimes = [];
            for (var kk in timeSlots) {
                aTimes.push(kk);
            }


            //Fill Cell Data
            for (var i = 0; i < seDiff; i++) {

                var ampm = ((i + 12 + siTime) < 24) ? 'AM' : 'PM';
                var hr = ( (siTime + i) > 12 ) ? (siTime + i - 12 ) : siTime + i;
                hr = (hr > 9) ? hr : '0' + hr;

                for (var k = 0; k < calTime30.pattern.length; k++) {

                    //Rows
                    var tr = document.createElement('tr');

                    //Display Modified TR for blocked hours
                    var timeBusy = (aTimes.indexOf(ampm + hr) == -1);
                    if (timeBusy) {

                        tr.classList.add('folded');
                        var tdB = document.createElement('td');
                        tdB.classList.add('busy');

                        tdB.setAttribute('colspan', '8');
                        tdB.innerText = hr + ':00 - ' + hr + ':59';

                        tr.appendChild(tdB)
                        tbody.appendChild(tr);
                        break;
                    }

                    //*****************

                    //Set Time:AMPM TD (Y-Axis)
                    var td = document.createElement('td');
                    td.innerHTML = hr + ':' + calTime30.pattern[k] + '&nbsp;' + ampm;
                    tr.appendChild(td);

                    //Days of Week TD (X-Axis)
                    for (var j = 0; j < 7; j++) {

                        var td = document.createElement('td');
                        td.id = ampm + hr + calTime30.pattern[k] + '_' + j;
                        //Highlight weekends
                        if (j == 0 || j == 6) {
                            td.classList.add('weekend');
                        }

                        if (timeSlots[ampm + hr]) {

                            var hourMinute = calTime30.pattern[k];
                            if (timeSlots[ampm + hr][hourMinute][weekDates[j]]) {

                                var tmpNumberInTimeSlot = timeSlots[ampm + hr][hourMinute][weekDates[j]].length;

                                if (tmpNumberInTimeSlot == 1) {

                                    var span = document.createElement('span');
                                    span.classList.add('hide');
                                    span.innerText = 'b_allowbooking:[[b_allowbooking]]';
                                    td.appendChild(span)

                                    td.classList.add('available')
                                    td.classList.add('text-center')
                                    td.classList.add('milk-calendar-selectable');

                                    td.innerHTML = timeSlots[ampm + hr][hourMinute][weekDates[j]][0]['Time'];
                                }
                                else {

                                    //TODO unify operators =:,|#
                                    //<tr data-milk-loop="rows|calDate:Adate|calTime:Time|calText:milk-template:RunId:[[RunId]];Adate:[[Adate]];Book:[[Book]]" data-milk-model="ptp_getlabs">
                                    //<tr data-milk-loop="rows|calDate:Adate|calTime:Time|calText:milk-template#RunId=[[RunId]];Adate=[[Adate]];Book=[[Book]]" data-milk-model="ptp_getlabs">

                                    var span = document.createElement('span');
                                    span.classList.add('hide');
                                    span.innerText = 'b_allowbooking:[[b_allowbooking]]';
                                    td.appendChild(span)

                                    //td.classList.add('available')
                                    //td.classList.add('text-center')
                                    td.classList.add('milk-calendar-selectable');


                                    var spanLabel = document.createElement('span');
                                    spanLabel.id = ampm + hr + hourMinute + '_' + j + '_label';
                                    spanLabel.innerText = tmpNumberInTimeSlot + ' Avaliable';


                                    //*****************

                                    //TODO
                                    var aWeekDates = timeSlots[ampm + hr][hourMinute][weekDates[j]];
                                    var tdUl = document.createElement('ul');
                                    tdUl.id = ampm + hr + hourMinute + '_' + j + '_reference';
                                    tdUl.classList.add('hide');
                                    tdUl.classList.add('milk-expandable');
                                    var tdUlButtonClose = document.createElement('button');
                                    tdUlButtonClose.id = ampm + hr + hourMinute + '_' + j + '_close';
                                    tdUlButtonClose.classList.add('btn-xs');
                                    tdUlButtonClose.classList.add('ui-icon-close');
                                    tdUlButtonClose.classList.add('btn-link');
                                    tdUl.appendChild(tdUlButtonClose);

                                    for (var m = 0; m < aWeekDates.length; m++) {

                                        var li = document.createElement('li');
                                        li.innerText = aWeekDates[m]['Time'];

                                        //////
                                        var template = '';
                                        var aParts = (params.calHidden).split('#');
                                        if (aParts[0] == 'milk-template') {
                                            template = aParts[1];
                                        }
                                        else {
                                            template = aParts[0];
                                        }

                                        //template
                                        var textHidden = milk.presetSplit(template, timeSlots[ampm + hr][hourMinute][weekDates[j]][0]);

                                        var spanHidden = document.createElement('span');
                                        spanHidden.id = ampm + hr + hourMinute + '_' + j + '_hidden';
                                        spanHidden.classList.add('hide');
                                        spanHidden.innerText = textHidden;

                                        li.appendChild(spanHidden);
                                        tdUl.appendChild(li);
                                    }

                                    td.appendChild(spanLabel)
                                    td.appendChild(tdUl);

                                }
                            }
                        }

                        tr.appendChild(td);
                    }

                    tbody.appendChild(tr);
                }
            }

            //Event
            mje.stencil.listener.push(uri, function (e) {

                function viewMutipleTimes(e) {

                    e = e || event;
                    e.preventDefault() || e.stopPropagation();
                    var hit = e.target || e.srcElement;


                    var tagParent = hit;
                    while (tagParent.nodeName !== 'TD') {
                        tagParent = tagParent.parentNode;
                    }
                    var tdHidden1 = document.getElementById(tagParent.id + '_reference');

                    //Hide Content
                    if (hit.id == tagParent.id + '_close') {

                        tdHidden1.classList.add('hide');
                        tdHidden1.classList.remove('selected');

                        var tdHidden2 = document.getElementById(tagParent.id + '_label');
                        tdHidden2.classList.remove('hide');

                        return !1;
                    }

                    //Show Content
                    if (tdHidden1.classList.contains('hide')) {

                        tdHidden1.classList.remove('hide');
                        tdHidden1.classList.add('selected');

                        var tdHidden2 = document.getElementById(tagParent.id + '_label');
                        tdHidden2.classList.add('hide');
                    }

                    return !1;
                }

                var tag = document.getElementById(that.id);
                tag.addEventListener('click', viewMutipleTimes, false);

            });
        }
        else {

            //SHOW SETTINGS BUTTON
            var buttonSetting = document.createElement('button');
            buttonSetting.id = that.id + '_settings';

            //TODO
            // buttonSetting.type = 'button';
            buttonSetting.setAttribute('type', 'button');
            buttonSetting.classList.add('ui-icon-setting');
            buttonSetting.classList.add('btn-sm');
            buttonSetting.classList.add('btn-default');
            var divClear = document.createElement('div');
            divClear.classList.add('clearfix');

            var h1 = gTable.parentNode;
            var mk = gTable.parentNode.parentNode.children;
            var tableDivIndex = 0;
            for (var mm = 0; mm < mk.length; mm++) {
                if (mk[mm] == h1) {
                    tableDivIndex = mm;
                }
            }

            //Append to <h1 class="table-header">Lab Results<span class="badge">12</span></h1> which must be
            //the previous sibling of the tables container
            gTable.parentNode.parentNode.children[tableDivIndex - 1].appendChild(buttonSetting);
            gTable.parentNode.parentNode.children[tableDivIndex - 1].appendChild(divClear);

            //SHOW SETTINGS BAR
            var gHeader = gTable.getElementsByTagName("th");

            var eUl = document.createElement('ul');
            eUl.id = that.id + "_settingsColumns";
            eUl.classList.add('hide');
            eUl.classList.add('nav');
            eUl.classList.add('nav-pills');
            eUl.classList.add('margin-b10');
            //eUl.classList.add('margin-t10');

            //sets classes for headernames in filter dropdown
            for (var i = 0; i < gHeader.length; i++) {

                //settingColumns
                var eLi = document.createElement('li');

                //all columns are shown at first: todo
                eLi.classList.add('active');
                var a = document.createElement('a');
                a.href = '#';
                a.innerText = gHeader[i].innerText;
                eLi.appendChild(a);

                if (gHeader[i].classList.contains('show'))
                    eLi.classList.add('added');
                else if (gHeader[i].classList.contains('ignore')) {
                    eLi.classList.add('hide');
                }
                else {
                    eLi.classList.add('hid');
                }
                eUl.appendChild(eLi);
            }
            //gTable.parentNode.parentNode.insertBefore(eUl, gTable.parentNode);
            gTable.parentNode.parentNode.insertBefore(eUl, gTable.parentNode.parentNode.children[tableDivIndex]);

            mje.stencil.listener.push(uri, function (e) {

                //table-->thead-->tr
                if (document.getElementById(gTable.id)) {
                    var tag = document.getElementById(gTable.id).querySelectorAll('thead')[0];
                    if (tag) tag.addEventListener('click', _handlerSortColumn, false);
                }

                var tag = document.getElementById(that.id + "_settingsColumns");
                if (tag) tag.addEventListener('click', _handlerHideColumn, false);

                var tag = document.getElementById(buttonSetting.id);
                if (tag) tag.addEventListener('click', _handlerToggleSetting, false);
            });
        }
        //END OF CALENDAR VIEW DEV

    }
//////////////// milk/mje methods

    /// <summary>
    ///   Finds the vale for the stringed key of an object
    /// <example>
    ///   milk.fullDot(key, obj)
    /// <special params>
    ///   very usefull especially in templating
    /// <returns>returns executed function
    mje.fullDot = function (key, obj) {

        if (obj === undefined) {
            return 'na';
        }

        if (key === 'self') {
            return obj;
        }

        var check = '';

        if (key) {

            var childObject = key.split('.');

            if (childObject.length > 1) {

                var childTarget = milk.clone(obj);
                for (var n = 0; n < childObject.length; n++) {

                    if (n != (childObject.length - 1)) {
                        childTarget = milk.clone(childTarget[childObject[n]]);
                    }
                    else {
                        check = childTarget[childObject[n]];
                    }
                }
            }
            else {
                try {
                    check = obj[key];
                    //check = JSON.stringify(check);
                }
                catch (err) {
                    //console.log('milk.fullDot:err:', key, obj)
                }
            }
        }

        return check;
    }
    
        //data should be an item in an array[]
    mje.swap = function (htmlString, data) {

        console.log('**** mje.swap:data');

        //sample html
        //<div data-milk-switch="[{status}]" class="appt-btn">
        //<a data-milk-case="N|CANC"  id="appointmentMore.[[UID]].[[medinfoapptno]]" class="ui-icon-more"> </a>
        //<a data-milk-case="N|CANC"  id="appointmentCalendar.[[UID]].[[medinfoapptno]]" class="ui-icon-calendar"> </a>
        //<a data-milk-case="N|CANC" id="appointmentCancel.[[UID]].[[medinfoapptno]]" class="ui-icon-delete"> </a>
        //</div>

        var container = document.createElement('div');
        container.innerHTML = htmlString;
        var tagList = container.querySelectorAll('[data-milk-switch]');

        if (tagList.length < 1) {
            return htmlString;
        }

        for (var i = 0; i < tagList.length; i++) {

            var exp = tagList[i].getAttribute('data-milk-switch');

            var key = null;
            //strips [{ }]
            if (exp.substring(0, 2) == '[{') {
                key = exp.substring(2, (exp.length - 2));
            }
            else {
                key = exp;
            }


            //Data has to have a key that matches what's in the brackets
            //so for data-milk-switch="[{status}]" it'd be status
            //so key is the status
            //so if data-milk-switch='frog' then data has to something like {frog: 'green'}

            var tagData = data;
            var value = tagData[key];

            console.log(value);

            if (!tagList[i]) {
                console.log("!tagList[i]");
                break;
            }

            var subTag = tagList[i].querySelectorAll('[data-milk-case]');

            for (var cg in subTag) {

                if (subTag.hasOwnProperty(cg)) {

                    if (milk.getType(subTag[cg]).substring(0, 4) == 'HTML') {

                        var child = subTag[cg];
                        var av = child.getAttribute('data-milk-case');
                        var aValues = av.split('|');
                        var match = false;

                        for (var k = 0; k < aValues.length; k++) {
                            if (value === aValues[k]) {
                                match = true;
                                break;
                            }
                        }

                        if (!match) {
                            child.parentNode.removeChild(child);
                        }

                        //Remove attribute since it has been used already
                        child.removeAttribute('data-milk-case');
                    }
                }
            }

            return tagList[i].innerHTML;
        }

        //TODO
        return '';
    };
    
        /// <summary>
    ///   Replaces text in a string. Commonly used for building LI rows. accepts dot (.) notation obj.key.key.key = value
    /// <example>
    ///   milk.presetSplit( '[ADESC]<span class="dateInfo">[ADATE]</span><span class="timeInfo">[ATIME]</span>', data[i] );
    /// <special params>
    ///   text: html template
    ///   replacementObject: JSON data row.
    /// <returns>returns string
    mje.presetSplit = function (text, obj) {

        //console.log(pres++, (obj['milk-match'] || 'unknown'), obj)
        //TODO Need some solid documentation on the formatter. Good tool, especially formatBool
        //Move this up one level
        function formatter(args, value, obj) {

            var type = args[1];
            var customDate = function (dateString) {

                if (!dateString)
                    return dateString;

                var d = new Date(dateString) || new Date();

                d.setDate(d.getDate());
                var yyyy = d.getFullYear().toString();
                var mm = (d.getMonth() + 1).toString();
                mm = (mm.length < 2) ? '0' + mm : mm;
                var dd = d.getDate().toString();
                dd = (dd.length < 2) ? '0' + dd : dd;

                return yyyy + '-' + mm + '-' + dd;
            }
            var formatDate = function (dateString) {

                if (!dateString)
                    return dateString;

                if (dateString) {
                    var aDate = dateString.split(' ');

                    if (aDate.length === 1) {
                        return dateString.substr(0, 10);
                    }
                    else {
                        return dateString.split(' ')[0]
                    }
                }
                else {
                    return 'Uknown Date';
                }
            }
            var formatTime = function (dateString) {

                if (!dateString)
                    return dateString;

                var time = dateString.split(' ')[1];
                var ampm = dateString.split(' ')[2];

                return time + ' ' + ampm;
            }
            var formatCurrency = function (currency) {

                //TODO
                if (!currency)
                    return currency;

                currency = currency.toString();

                var aSplits = currency.split('.')
                var cents = aSplits[1];
                var dollars = '';

                var commaCounter = 1;
                for (var i = aSplits[0].length - 1; i >= 0; i--) {

                    dollars = aSplits[0][i] + dollars;
                    if (commaCounter == 3 && i != 0) {
                        commaCounter = 1;
                        dollars = ',' + dollars;
                    }
                    commaCounter++;
                }

                return dollars + '.' + cents.substring(0, 2);
            }
            var formatBool = function (casement, value) {

                // adding '#' infront of an object's key will transform to the object's value
                //css [[b_allowbooking|bool|==True?cssClassYellowBackground:cssClassBlueBackground]]
                //text [[medinforeasondesc|bool|==US Abdomen Limited?#medinforeasondesc:#medinfocompany]]
                //text [[medinforeasondesc|bool|%%US ?#medinforeasondesc:#medinfocompany]]
                //text [[medinforeasondesc|bool|!!null?null or undefined:#medinforeasondesc #medinfocompany]]

                //text [[medinforeasondesc|bool|^^null?null or undefined:#medinforeasondesc #medinfocompany]]

                function buildPhrase(args) {
                    var phrase = '';
                    var words = args.split(' ');
                    for (var i = 0; i < words.length; i++) {
                        if (words[i].substring(0, 1) == '#') {
                            phrase += obj[words[i].substring(1, words[i].length)] + ' ';
                        }
                        else {
                            phrase += words[i] + ' ';
                        }
                    }
                    return phrase;
                }


                var operator = casement[2].substr(0, 2);
                var compareTo = casement[2].substring(2, casement[2].length).split('?')[0];

                var ifTrue = casement[2].substring(2, casement[2].length).split('?')[1].split(':')[0];
                var ifFalse = casement[2].substring(2, casement[2].length).split('?')[1].split(':')[1];

                switch (operator) {
                    case '==':
                        //equal
                        if (value == compareTo) {
                            return buildPhrase(ifTrue);
                        }
                        else {
                            return buildPhrase(ifFalse);
                        }
                    case '!=':
                        //not equal
                        if (value != compareTo) {
                            return buildPhrase(ifTrue);
                        }
                        else {
                            return buildPhrase(ifFalse);
                        }
                    case '==':
                        //contains
                        var pattern = compareTo;//(compareTo).toLowerCase();
                        var re = new RegExp(/pattern/i);
                        //TODO, TEST may not be IE 8 supported: check this
                        var match = re.test(value); // re.test(value.toLowerCase());

                        if (match) {
                            return buildPhrase(ifTrue);
                        }
                        else {
                            return buildPhrase(ifFalse);
                        }
                    case '^^':
                        //in[]
                        if (compareTo.indexOf(value) > -1) {
                            return buildPhrase(ifTrue);
                        }
                        else {
                            return buildPhrase(ifFalse);
                        }
                    case '!!':
                        //value is  null
                        if ((value === undefined) || (value === null)) {
                            return buildPhrase(ifTrue);
                        }
                        else {
                            return buildPhrase(ifFalse);
                        }
                    default:
                        return value;
                }
            }

            function formatCamelCase(str) {

                if (!str) {
                    return str;
                }
                var res = str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {

                    if (index == 0) {
                        return letter.toUpperCase()
                    }
                }).replace(/\s+/g, '');

                return res;
            }

            switch (type) {
                case 'date':
                    return formatDate(value);
                case 'time':
                    return formatTime(value);
                case 'currency':
                    return formatCurrency(value);
                case 'bool':
                    return formatBool(args, value);
                case 'camelCase':
                    return formatCamelCase(value)

            }
        }

        if (!obj || !text) {
            return text;
        }

        var html = '';
        var aTag = [];
        var aData = [];

        var aInit = text.toString().split(']]');

        for (var j = 0; j < aInit.length; j++) {
            var aKvp = (aInit[j]).split('[[');
            aTag.push(aKvp[0]);
            aData.push(aKvp[1]);
        }

        for (var k = 0; k < aTag.length; k++) {

            var val = '';
            var key = aData[k];

            if (key) {
                var childObject = key.split('.');
                if (childObject.length > 1) {

                    var childTarget = milk.clone(obj);
                    for (var n = 0; n < childObject.length; n++) {

                        if (n != (childObject.length - 1)) {
                            childTarget = milk.clone(childTarget[childObject[n]]);
                        }
                        else {
                            val = childTarget[childObject[n]];
                        }
                    }
                }
                else {
                    var aVal = key.split('|');
                    if (aVal.length > 1) {
                        val = formatter(aVal, obj[aVal[0]], obj);
                    }
                    else {
                        val = obj[key];
                    }
                }
            }

            if (milk.getType(val) === 'Object')
                val = JSON.stringify(val);

            var retVal = (val !== undefined) ? val : '[[' + key + ']]';
            html += (aTag[k] + retVal);
        }

        return html;
    }
    
        // <summary>
    ///   Returns random 4 digit interger
    /// <example>
    ///   var id = milk.randomId();
    /// <special params>
    /// <returns>returns integer
    mje.randomId = function (sigfig) {
        sigfig = sigfig || 3;
        var size = Math.pow(10, sigfig);

        return _randomId(size);
    };
    
        // <summary>
    ///   Helper: Returns name of Object type
    /// <example>
    ///    milk.getType(object)
    /// <special params>
    /// <returns>returns
    mje.getType = function (a) {

        return _getType(a);
    };
    
    