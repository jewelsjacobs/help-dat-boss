mje.loop = function (htmlString, data, uriTemplate, parentTagListSpecial) {

    console.log('**** mje.loops:args', data, uriTemplate);

    //sample html
    //<div data-milk-loop="rows|limit:4|paging:true" data-milk-model="ptp_getfamilyhistory" class="grid-cell future-appt">
    //    <div>[[FNAME]] [[RELATIONSHIP]] AAA </div>
    //</div>
    //
    //<span data-milk-loop="rows[].tags" class="label-sm water-bg">[[item]] [[id]]<span class="ui-icon-close">x</span><br/></span>

    if (!htmlString) {
        return '';
    }

    var container = document.createElement('div');
    container.innerHTML = htmlString;
    var tagList = container.querySelectorAll('[data-milk-loop]');

    //TODO all sandbox
    if (tagList.length < 1) {
        console.log(tagList);
        //console.log('NO [data-milk-loop] Flow');
        if (data) {

            console.log(data);
            var tagSwitch = container.querySelectorAll('ST'); //the sample does not have this attribute

            console.log(tagSwitch);

            if (tagSwitch.length == 0) {
                return htmlString;

            }

            var tagData = milk.fullDot('rows', data);

            console.log(tagData);

            for (var k = 0; k < tagData.length; k++) {

                (function (t, p, dd, index, indexCount) {

                    console.log(t);
                    console.log(dd);
                    console.log(index);

                    var text = mje.swap(t, dd[index]);
                    var text2 = milk.presetSplit(text, dd[index]);

                    var tag = document.createElement('div');
                    tag.innerHTML = text2;

                    console.log(text2);

                    //Assign Id to parent if needed
                    var parentTag = p;
                    if (parentTag) {
                        if (!parent.id) {
                            parentTag.id = milk.randomId(5);
                        }
                    }

                    tag.id = parentTag.id + '_' + (index + 1);
                    tag.removeAttribute('data-milk-loop'); //removing data-milk-loop
                    p[0].appendChild(tag);

                    //Remove [data-milk-switch] templates from dom
                    if (index === (indexCount - 1)) {
                        var tmpCase = tagSwitch[0].querySelectorAll('[data-milk-case]');
                        for (var j = 0; j < tmpCase.length; j++) {
                            tmpCase[j].parentNode.removeChild(tmpCase[j])
                        }
                    }

                })(htmlString, tagSwitch, tagData, k, tagData.length);
            }
        }
    }
    else {
        for (var i = 0; i < tagList.length; i++) {

            var key = tagList[i].getAttribute('data-milk-loop');

            console.log(key); //rows|limit:4|paging:true //rows[].tags //rows|limit:4|paging:true //rows[].tags

            var aKey = key.split('|');
            var subkey = '';
            key = aKey[0];


            console.log(aKey); //["rows", "limit:4", "paging:true"] //["rows[].tags"] //["rows", "limit:4", "paging:true"] //["rows[].tags"]
            console.log(key); //rows //rows[].tags //rows  //rows[].tags

            var isArray = key.indexOf('[]');

            console.log(isArray); //-1 //4 //-1 //4

            if (isArray > -1) {
                var aTmp = key.split('.');
                key = aTmp[0].split('[]')[0];
                subkey = aTmp[1];

                if (!key | key == '') {
                    key = 'self';
                }
            }

            var params = getTemplateParams(aKey);

            console.log(params); //Object {limit: "4", paging: true}//Object {} //Object {limit: "4", paging: true} //Object {}
            //Assign Id to parent if needed
            var parentTag = tagList[i].parentNode;

            if (parentTag) {
                if (!parent.id) {
                    parentTag.id = milk.randomId(5);
                }
            }
            else {
                break;
            }

            //clear child template
            parentTag.removeChild(tagList[i]);
            var ptHtml = parentTag.innerHTML;

            //copy template
            var templateText = tagList[i].outerHTML;

            console.log(key); //rows
            console.log(data); //

            var tagData = milk.fullDot(key, data);

            console.log(tagData); //undefined  //undefined //undefined //undefined

            var templateType = (templateText.split(' '))[0].replace('<', '').toLowerCase().trim();

            if (milk.getType(tagData) === 'Array') {

                //needs documentation.  believe it uses the .[] in data-milk-loop
                if (isArray > -1) {
                    var aHolding = tagData;
                    var tagData2 = milk.fullDot(subkey, tagData[i]);

                    console.log(aHolding);
                    console.log(tagData2);

                    if (tagData2) {
                        aHolding = tagData2;
                    }

                    for (var m = 0; m < aHolding.length; m++) {

                        var tag = document.createElement(templateType);
                        var usedTemplate = milk.presetSplit(templateText, tagData[m], null, true);

                        console.log(tag);
                        console.log(usedTemplate);

                        usedTemplate = usedTemplate.trim();

                        if (templateType === 'tr') {

                            var usedTemplate = milk.presetSplit(templateText, tagData[m], null, true);
                            usedTemplate = usedTemplate.trim();
                            var aTags = usedTemplate.split(/<td>/i);

                            for (var i = 1; i < aTags.length; i++) {
                                var td = document.createElement('TD');

                                td.innerText = aTags[i].split(/<\/td>/i)[0];
                                tag.appendChild(td)
                            }

                            if (params.limit && (m > (parseInt(params.limit) - 1))) {
                                tag.classList.add('hide');
                                tag.classList.add('zebra');
                            }
                            tag.id = parentTag.id + '_' + (m + 1);
                            tag.removeAttribute('data-milk-loop');

                            parentTag.appendChild(tag);
                        }
                        else if (templateType === 'li') {
                            var re = /^<li[^>]+>([\S\s]*)<\/li>$/gi; //capturing <li, whatever is in between and li>, g - all matches do not return on first, return on all, case insensitive
                            var aLiChildren = re.exec(usedTemplate);

                            var ret = /class="[^"]+"/i; //matches an i?
                            var aLiClasses = ret.exec(aLiChildren[0]);

                            aLiClasses = aLiClasses[0].substring(7, aLiClasses[0].length - 1);

                            console.log(aLiClasses);

                            if (aLiClasses) {
                                var aClasses = aLiClasses.trim().split(' ');

                                for (var i = 0; i < aClasses.length; i++) {
                                    tag.classList.add(aClasses[i] || 'milkemptyspace')
                                }
                            }

                            var text = mje.presetSplit(aLiChildren[1], {item: aHolding[m]});
                            tag.innerHTML = text || (aLiChildren[1] || '<div></div>');

                            console.log(text);

                            if (params.limit && (m > (parseInt(params.limit) - 1))) {
                                tag.classList.add('hide');
                            }
                            if (params['zebra']) {
                                if (m % 2 == 0) {
                                    tag.classList.add('zebra');
                                }
                            }

                            tag.id = parentTag.id + '_' + (m + 1);
                            tag.removeAttribute('data-milk-loop');
                            parentTag.appendChild(tag);
                        }
                        else {

                            var re = /[^^>]+>([\S\s]*)<\/[^^>]+>$/gi; //matches?
                            var aElementChildren = re.exec(usedTemplate);

                            var text = mje.presetSplit(aElementChildren[1], {item: aHolding[m]});
                            tag.innerHTML = text || ( aElementChildren[1] || '<div></div>');

                            if (params.limit && (m > (parseInt(params.limit) - 1))) {
                                tag.classList.add('hide');
                            }
                            if (params['zebra']) {
                                if (m % 2 == 0) {
                                    tag.classList.add('zebra');
                                }
                            }

                            tag.id = parentTag.id + '_' + (m + 1);
                            tag.removeAttribute('data-milk-loop');
                            parentTag.appendChild(tag);
                        }
                    }
                }
                else {
                    for (var k = 0; k < tagData.length; k++) {

                        var tag = document.createElement(templateType);
                        var usedTemplate = milk.presetSplit(templateText, tagData[k], null, true);
                        usedTemplate = usedTemplate.trim();

                        console.log(tag);
                        console.log(usedTemplate);

                        if (templateType === 'tr') {

                            var usedTemplate = milk.presetSplit(templateText, tagData[k], null, true);
                            usedTemplate = usedTemplate.trim();
                            var aTags = usedTemplate.split(/<td>/i); //splitting table cells

                            for (var i = 1; i < aTags.length; i++) {
                                var td = document.createElement('TD');

                                td.innerText = aTags[i].split(/<\/td>/i)[0];
                                tag.appendChild(td)
                            }

                            if (params.limit && (k > (parseInt(params.limit) - 1))) {
                                tag.classList.add('hide');
                                tag.classList.add('zebra'); //whats special about zebra class?
                            }
                            tag.id = parentTag.id + '_' + (k + 1);
                            tag.removeAttribute('data-milk-loop');

                            parentTag.appendChild(tag);
                        }
                        else if (templateType === 'li') {

                            var re = /^<li[^>]+>([\S\s]*)<\/li>$/gi; //matching <li li>
                            var aLiChildren = re.exec(usedTemplate);

                            var ret = /class="[^"]+"/i; //matches class=" and "]"
                            var aLiClasses = ret.exec(aLiChildren[0]);

                            console.log(aLiClasses);
                            if (aLiClasses && aLiClasses[0]) {
                                aLiClasses = aLiClasses[0].substring(7, aLiClasses[0].length - 1);

                                if (aLiClasses) {
                                    var aClasses = aLiClasses.trim().split(' ');

                                    for (var i = 0; i < aClasses.length; i++) {
                                        tag.classList.add(aClasses[i] || 'milkemptyspace')
                                    }
                                }
                            }

                            tag.innerHTML = aLiChildren[1] || '<div></div>';

                            if (tag.querySelectorAll('[data-milk-loop]').length > 0) {
                                var text = mje.loop(tag.innerHTML, tagData[k], uriTemplate);
                                tag.innerHTML = text || 'milkjs.undefined'
                            }


                            if (params.limit && (k > (parseInt(params.limit) - 1))) {
                                tag.classList.add('hide');
                            }
                            if (params['zebra']) {
                                if (k % 2 == 0) {
                                    tag.classList.add('zebra');
                                }
                            }


                            tag.id = parentTag.id + '_' + (k + 1);
                            tag.removeAttribute('data-milk-loop');
                            parentTag.appendChild(tag);
                        }
                        else {
                            var re = /[^^>]+>([\S\s]*)<\/[^^>]+>$/gi; //not sure what this is matching
                            var aElementChildren = re.exec(usedTemplate);

                            var text = mje.presetSplit(aElementChildren[1], tagData);
                            tag.innerHTML = text || (aElementChildren[1] || '<div></div>');

                            console.log(params);

                            if (params.limit && (k > (parseInt(params.limit) - 1))) {
                                tag.classList.add('hide');
                            }
                            if (params['zebra']) {
                                if (k % 2 == 0) {
                                    tag.classList.add('zebra');
                                }
                            }

                            tag.id = parentTag.id + '_' + (k + 1);
                            tag.removeAttribute('data-milk-loop');
                            parentTag.appendChild(tag);
                        }
                    }
                }

                //Pagination, Filters,  and Properties
                if (templateType === 'tr') {

                    setElementProperties(uriTemplate, params, parentTag, tagData.length);
                    setTableProperties(uriTemplate, params, parentTag, tagData);
                }
                else {
                    setElementProperties(uriTemplate, params, parentTag, tagData.length);
                }
            }
            //WORKSPACE
            else if (milk.getType(tagData) === 'Object') {
                console.log('Take a look. Rare milk.loop.Object');
                //TODO check if this is still legacy code and can be removed
                var tmp = {};
                tmp.count = 0;
                for (var key in tagData) {
                    if (tagData.hasOwnProperty(key)) {
                        tmp.count = tmp.count + 1;

                        var tag = document.createElement(templateType);
                        var usedTemplate = templateText;

                        console.log(usedTemplate);

                        var re = /[^^>]+>([\S\s]*)<\/[^^>]+>$/gi;
                        var aElementChildren = re.exec(usedTemplate);


                        console.log(aElementChildren);

                        var ret = /class="[^"]+"/i; //matching class="
                        var aLiClasses = ret.exec(aElementChildren[0]);

                        console.log(aLiClasses);

                        if (aLiClasses && aLiClasses[0]) {
                            aLiClasses = aLiClasses[0].substring(7, aLiClasses[0].length - 1);

                            if (aLiClasses) {
                                var aClasses = aLiClasses.trim().split(' ');

                                for (var i = 0; i < aClasses.length; i++) {
                                    tag.classList.add(aClasses[i] || 'milkemptyspace')
                                }
                            }
                        }

                        var value = tagData[key];

                        console.log(value);

                        if (milk.getType(value) === 'Array') {
                            value = JSON.stringify(value);
                        }

                        var text = mje.presetSplit(aElementChildren[1], {key: key, value: value});
                        tag.innerHTML = text || ( aElementChildren[1] || '<div></div>');

                        /*if (params.limit && (m > (parseInt(params.limit) - 1))) {
                         tag.classList.add('hide');
                         }
                         if (params['zebra']) {
                         if (m % 2 == 0) {
                         tag.classList.add('zebra');
                         }
                         }*/

                        tag.id = parentTag.id + '_' + tmp.count;

                        console.log(tag.id);

                        tag.removeAttribute('data-milk-loop');
                        parentTag.appendChild(tag);
                    }
                }

                //Place non template in the innerHTML of a tmp tag
                var tmpTag = document.createElement('div');
                tmpTag.innerHTML = ptHtml;
                for (var g = 0; g < tmpTag.children.length; g++) {
                    parentTag.appendChild(tmpTag.children[g]);

                    console.log(tmpTag.children);
                }

            }
        }
    }

    //console.log('*** milk.loop:returned|', container.innerHTML);
    return container.innerHTML;
};
