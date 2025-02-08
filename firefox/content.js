const zeroCode = 48;
const nineCode = 57;
const zeroNumpadCode = 96;
const nineNumpadCode = 105;
const f1Code = 112;
const f10Code = 121;
const shiftCode = 16;
const altCode = 18;

var listen = false;

const channel = new BroadcastChannel('spellcaster');

browser.runtime.onMessage.addListener(handleMessage);

function handleMessage(message, _sender, sendResponse) {
    if (message.action=="get") {
        sendResponse({enabled: listen})
        return
    }

    // update state
    listen = !listen;

    if (listen==false) {
        // disable listener
        removeEventListener();
        sendResponse({enabled: listen});
        return
    }

    // enable listener
    addEventListener();
    sendResponse({enabled: listen});
}

function addEventListener() {
    channel.addEventListener('message', fireSpell);
}

function removeEventListener() {
    channel.removeEventListener('message', fireSpell);
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

document.addEventListener('keydown', commonKeyForward("keydown"), true);
document.addEventListener('keyup', commonKeyForward("keyup"), true);
