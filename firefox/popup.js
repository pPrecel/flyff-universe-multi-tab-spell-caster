(async () => {
    const [tab] = await browser.tabs.query({active: true, lastFocusedWindow: true});
    const regex = 'https://universe.flyff.com/play*';
    if (tab.url.match(regex) == null) {
        otherTabPopup();
        return
    }

    const response = await browser.tabs.sendMessage(tab.id, {action: 'get'});

    flyffTabPopup(response.enabled);
})();

function otherTabPopup() {
    let statusText=document.createElement('h1');
    statusText.textContent='UNSUPPORTED PAGE'
    statusText.style='color: red;';

    let redirectText=document.createElement('button');
    redirectText.textContent='play now';

    let redirectLink=document.createElement('a');
    redirectLink.setAttribute("href","https://universe.flyff.com/play");
    redirectLink.setAttribute("target", "_blank");

    redirectLink.appendChild(redirectText);

    let statusDiv=document.getElementById('status');
    statusDiv.appendChild(statusText);
    
    document.body.appendChild(redirectLink);
}

function flyffTabPopup(isEnabled) {
    let roleText = document.createElement('h2');
    roleText.id = 'roleText';

    let statusText = document.createElement('h1');
    statusText.id = 'statusText';

    let statusDiv = document.getElementById('status');
    statusDiv.appendChild(roleText);
    statusDiv.appendChild(statusText);

    let button = document.createElement('button');
    button.id = 'button';
    button.onclick = changeStatus;

    document.body.appendChild(button);

    updateStatusAndButton(isEnabled);
}

function updateStatusAndButton(isEnabled) {
    let statusText = document.getElementById('statusText');
    statusText.textContent = isEnabled?'SLAVE':'MASTER';
    statusText.style = isEnabled?'color: green;':'color: purple;';

    let roleText = document.getElementById('roleText');
    roleText.textContent = 'Role:';

    let button = document.getElementById('button');
    button.textContent = isEnabled?"Stop repeating in this tab":"Repeat spells in this tab";
}

async function changeStatus() {
    const [tab] = await browser.tabs.query({active: true, lastFocusedWindow: true});
    const response = await browser.tabs.sendMessage(tab.id, {action: 'set'});

    updateStatusAndButton(response.enabled);
}

