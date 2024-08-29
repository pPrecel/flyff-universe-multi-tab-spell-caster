// ==UserScript==
// @name         Flyff Universe Multi-Tab Spell Caster
// @namespace    pPrecel
// @version      2.1
// @description  Helpful tool for the web browser version of the Flyff Universe to cast spells from another tab.
// @author       pPrecel, doodlefudge
// @website      https://github.com/pPrecel/flyff-universe-multi-tab-spell-caster
// @include      https://universe.flyff.com/play*
// @grant        GM_log
// @license      MIT
// ==/UserScript==

(function () {
    "use strict";

    const zeroCode = 48;
    const nineCode = 57;
    const zeroNumpadCode = 96;
    const nineNumpadCode = 105;
    const f1Code = 112;
    const f10Code = 121;
    const shiftCode = 16;
    const altCode = 18;
    const homeCode = 36;
    const endCode = 35;

    const channel = new BroadcastChannel('spellcaster');

    window.addEventListener('load', () => {
        addButton('sbutton', 's', addEventListener, {position: 'absolute', left: '0.1%', top:'0.1%', 'z-index': 3});
        addButton('ubutton', 'u', removeEventListener, {position: 'absolute', left: '0.6%', top:'0.1%', 'z-index': 3});
        addButton('hbutton', 'h', hideButtons, {position: 'absolute', left: '1.2%', top:'0.1%', 'z-index': 3});
    })

    function addButton(buttonID, text, onclick, cssObj) {
        let button = document.createElement('button'), btnStyle = button.style;
        document.body.appendChild(button);
        button.id = buttonID;
        button.innerHTML = text;
        button.onclick = onclickFuncWithCanvasFocus(onclick);
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key]);

        return button
    }

    function configAndRun(runFn) {
        return function(event) {
            let code = event.keyCode;
            if (code == homeCode) {
                addEventListener();
            } else if (code == endCode) {
                removeEventListener();
            } else {
                runFn(event);
            }
        }
    }

    // run onclick func and then focus again on canvas
    function onclickFuncWithCanvasFocus(onclick) {
        return function(){
            onclick();
            document.getElementById("canvas").focus();
        }
    }

    function hideButtons() {
        document.getElementById('sbutton').style.visibility = 'hidden';
        document.getElementById('ubutton').style.visibility = 'hidden';
        document.getElementById('hbutton').style.visibility = 'hidden';
    }

    function addEventListener() {
        channel.addEventListener('message', fireSpell);
        alert('Slave listener configured! Use <number>, ctrl + <number>, Fn Keys, or NumPad key combinations in another tab to manage your slave.');
    }

    function removeEventListener() {
        channel.removeEventListener('message', fireSpell);
        alert('Slave listener disabled!');
    }

    function commonKeyForward(type) {
        return function(event) {
            let code = event.keyCode
            if (
                    isNumber(code) ||
                    isCtrlAltOrShift(code) ||
                    isNumpadNumber(code) ||
                    isFunctionKey(code) ||
                    (code == 90)// Z for follow
            ){
                forwardKeyboardEvent(type, event);
            }
        }
    }

    function isNumber(code) {
        return code >= zeroCode && code <= nineCode
    }

    function isNumpadNumber(code) {
        return code >= zeroNumpadCode && code <= nineNumpadCode
    }

    function isFunctionKey(code) {
        return code >= f1Code && code <= f10Code
    }

    function isCtrlAltOrShift(code) {
        return code >= shiftCode && code <= altCode
    }

    function fireSpell(event) {
        var data = JSON.parse(event.data);

        document.querySelector("canvas").dispatchEvent(new KeyboardEvent(data.type, data));
    }

    function forwardKeyboardEvent(type, event) {
        channel.postMessage(JSON.stringify({
            "type": type,
            "key": event.key,
            "keyCode": event.keyCode,
            "which": event.which,
            "code": event.code,
            "location": event.location,
            "altKey": event.altKey,
            "ctrlKey": event.ctrlKey,
            "metaKey": event.metaKey,
            "shiftKey": event.shiftKey,
            "repeat": false
        }));
    }

    document.addEventListener('keydown', configAndRun(commonKeyForward("keydown")), true);
    document.addEventListener('keyup', commonKeyForward("keyup"), true);
})();
