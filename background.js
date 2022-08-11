let speeddials = [];

chrome.storage.sync.get(['speeddials'], (result) => {
    speeddials = result;
});

chrome.storage.onChanged.addListener((changed, namespace) => {
    if(namespace === 'sync' && changed.speeddials?.newValue) {
        speeddials = changed.speeddials.newValue;
        console.log(speeddials);
    }
})

let autofill = () => {
    let speeddials = [];

    chrome.storage.sync.get(['speeddials'], ({speeddials}) => {
        console.log(speeddials);
        let focusedEl = document.querySelector(':focus');
        let fillPrefix = "";
        switch(focusedEl.nodeName) {
            case 'DIV':
                fillPrefix = focusedEl.innerHTML;
                speeddials.forEach(sd => {
                    if(fillPrefix.endsWith(sd.prefix)) {
                        focusedEl.innerHTML = focusedEl.innerHTML.replace(sd.prefix, '');
                        focusedEl.innerHTML += sd.template;
                    }
                });
                break;
            case 'INPUT':
                fillPrefix = focusedEl.value;
                speeddials.forEach(sd => {
                    if(fillPrefix.endsWith(sd.prefix)) {
                        focusedEl.value = focusedEl.value.replace(sd.prefix, '');
                        focusedEl.value += sd.template;
                    }
                });
                break;
        }
    });
    
}

chrome.commands.onCommand.addListener(async (command) => {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    switch(command) {
        case "autofill":
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: autofill,
            });
            break;
    }
})