// ==UserScript==
// @name         Flyff Universe Multi-Tab Spell Caster
// @namespace    pPrecel
// @version      1.0
// @description  Helpful tool for the web browser version of the Flyff Universe to cast spells from another tab.
// @author       pPrecel
// @website      https://github.com/pPrecel/flyff-universe-multi-tab-spell-caster
// @include      https://universe.flyff.com/play
// @grant        GM_log
// @license      MIT
// ==/UserScript==

(function () {
    "use strict";

    const channel = new BroadcastChannel('spellcaster');

    function onKeydown(event) {
      switch (event.keyCode) {
          case 191: // /
              channel.addEventListener ('message', onMessage);
              alert('Listener configured! Use "ctrl + <number>" combination in another tab to manage your slave.');
              break;
          case 17: // ctrl
              // ignore ctrl event
              break;
          default:
              forwardKeyboardEvent(event);
              break;
      }
    }

    function onMessage(event) {
        var data = JSON.parse(event.data);

        // press key down and up - simulate such behavior
        document.querySelector("canvas").dispatchEvent(new KeyboardEvent("keydown", data));
        document.querySelector("canvas").dispatchEvent(new KeyboardEvent("keyup", data));
    }

    function forwardKeyboardEvent(event) {
        if (!event.ctrlKey) {
            return;
        }

        channel.postMessage(JSON.stringify({
            "key": event.key,
            "keyCode": event.keyCode,
            "which": event.which,
            "code": event.code,
            "location": event.location,
            "altKey": false,
            "ctrlKey": false,
            "metaKey": false,
            "shiftKey": false,
            "repeat": false
        }));
    }

    document.addEventListener('keydown', onKeydown, true);
})();
