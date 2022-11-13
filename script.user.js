// ==UserScript==
// @name         Flyff Universe Multi-Tab Spell Caster
// @namespace    pPrecel
// @version      2.0
// @description  Helpful tool for the web browser version of the Flyff Universe to cast spells from another tab.
// @author       pPrecel
// @website      https://github.com/pPrecel/flyff-universe-multi-tab-spell-caster
// @include      https://universe.flyff.com/play
// @grant        GM_log
// @license      MIT
// ==/UserScript==

(function () {
    "use strict";

    const zeroCode = 48;
    const nineCode = 57;
    const shiftCode = 16;
    const altCode = 18;
    const slachCode = 191;
    const singleQouteCode = 222;

    const channel = new BroadcastChannel('spellcaster');

    function configAndRun(runFn) {
        return function(event) {
            let code = event.keyCode
            if (code == slachCode) {
                channel.addEventListener('message', fireSpell);
                alert('Listener configured! Use "ctrl + <number>" combination in another tab to manage your slave.');
            } else if (code == singleQouteCode) {
                channel.removeEventListener('message', fireSpell);
                alert('Listener disabled!');
            } else {
                runFn(event);
            }
        }
    }

    function commonKeyForward(type) {
        return function(event) {
            let code = event.keyCode
            if ( isNumber(code) || isCtrlAltOrShift(code) ){
                forwardKeyboardEvent(type, event);
            }
        }
    }

    function isNumber(code) {
        return code >= zeroCode && code <= nineCode
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
