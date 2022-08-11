let makeEmptyRowDirty = () => {
    // empty row is no longer empty
    hasEmptyRow = false;
}

let generateId = () => {
    return crypto.randomUUID();
}

let renderSpeedDialOption = (speeddial = '', template = '') => {
    let speedDialOptionContainerEl = document.createDocumentFragment();
    let speedDialPrefixEl = document.createElement('input');
    speedDialPrefixEl.classList.add('prefix');
    speedDialPrefixEl.dataset.id = generateId();
    speedDialPrefixEl.value = speeddial;
    let speedDialTemplateEl = document.createElement('textarea');
    if(speeddial == '' && template == '') {
        speedDialPrefixEl.addEventListener('change', makeEmptyRowDirty);
        speedDialTemplateEl.addEventListener('change', makeEmptyRowDirty);
    }
    speedDialTemplateEl.textContent = template;
    speedDialTemplateEl.dataset.prefix = speedDialPrefixEl.dataset.id;
    speedDialOptionContainerEl.appendChild(speedDialPrefixEl);
    speedDialOptionContainerEl.appendChild(speedDialTemplateEl);
    return speedDialOptionContainerEl;
}

let hasEmptyRow = false;

let addRow = () => {
    // don't allow adding multiple empty rows
    if(hasEmptyRow) return;
    let containerEl = document.querySelector('.container');
    containerEl.appendChild(
        renderSpeedDialOption()
    );
    hasEmptyRow = true;
}

let saveSds = () => {
    let prefixes = document.querySelectorAll('.prefix');
    prefixes.forEach(prefix => {
        let template = document.querySelector(`[data-prefix="${prefix.dataset.id}"]`);
        let sd = {
            prefix: prefix.value,
            template: template.value
        };
        // don't save blank prefixes
        if(sd.prefix == '') {
            
        }
        chrome.storage.sync.get(['speeddials'], ({speeddials}) => {
            speeddials = speeddials || [];
            speeddials.push(sd);
            chrome.storage.sync.set({speeddials});
        });
        console.log(prefix.value, template.value);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    let containerEl = document.querySelector('.container');
    chrome.storage.sync.get(['speeddials'], ({speeddials}) => {
        speeddials = speeddials || [];
        speeddials.forEach(sd => {
            containerEl.appendChild(
                renderSpeedDialOption(sd.prefix, sd.template)
            );
        });
    });
    let addNewBtn = document.querySelector('#add-new');
    addNewBtn.addEventListener('click', addRow);
    let saveSdBtn = document.querySelector('#save-sds');
    saveSdBtn.addEventListener('click', saveSds);
});