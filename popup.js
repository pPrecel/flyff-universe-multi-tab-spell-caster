(async () => {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const regex = 'https://universe.flyff.com/play*';
    if (tab.url.match(regex) == null) {
        otherTabPopup();
        return
    }

    const response = await chrome.tabs.sendMessage(tab.id, {action: 'get'});

    flyffTabPopup(response.enabled);
})();

function otherTabPopup() {
    let statusText=document.createElement('h1');
    statusText.textContent='UNSUPPORTED PAGE'
    statusText.style='color: red;';

    let statusDiv=document.getElementById('status');
    statusDiv.appendChild(statusText);
}

function flyffTabPopup(isEnabled) {
    let statusText = document.createElement('h1');
    statusText.id = 'statusText';

    let statusDiv = document.getElementById('status');
    statusDiv.appendChild(statusText);

    let button = document.createElement('button');
    button.id = 'button';
    button.onclick = changeStatus;

    document.body.appendChild(button);

    updateStatusAndButton(isEnabled);
}

function updateStatusAndButton(isEnabled) {
    let statusText = document.getElementById('statusText');
    statusText.textContent = isEnabled?'ENABLED':'DISABLED';
    statusText.style = isEnabled?'color: green;':'color: red;';

    let button = document.getElementById('button');
    button.textContent = isEnabled?"Stop repeating in this tab":"Repeat spells in this tab";
}

async function changeStatus() {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {action: 'set'});

    updateStatusAndButton(response.enabled);
}

