function toggleExtensionState() {
    chrome.storage.local.get([Settings.extensionState], state => {
        const extensionState = state[Settings.extensionState];

        const newExtensionState = extensionState === Toggle.ON ? Toggle.OFF : Toggle.ON;
        chrome.storage.local.set({ [Settings.extensionState]: newExtensionState });
        updateSettingValueInUi(Settings.extensionState, newExtensionState);
        chrome.browserAction.setIcon({ path: `webDiplomacy-logo-${newExtensionState}.png`});
        setDisabledState(newExtensionState);
    });
};

const toggle = settingName => () => {
    chrome.storage.local.get([settingName], state => {
        const setting = state[settingName];

        const newSetting = setting === Toggle.ON ? Toggle.OFF : Toggle.ON;
        chrome.storage.local.set({ [settingName]: newSetting });
        updateSettingValueInUi(settingName, newSetting);
    });
};

function toggleDefaultMapSize() {
    chrome.storage.local.get([Settings.defaultMapSize], state => {
        const defaultMapSize = state[Settings.defaultMapSize];

        const newDefaultMapSize = defaultMapSize === MapSize.LARGE ? MapSize.SMALL : MapSize.LARGE;
        chrome.storage.local.set({ [Settings.defaultMapSize]: newDefaultMapSize });
        updateSettingValueInUi(Settings.defaultMapSize, newDefaultMapSize);
    });
}

function setSettingsValue() {
    chrome.storage.local.get(Object.values(Settings), state => {
        for (let settingName in state) {
            updateSettingValueInUi(settingName, state[settingName]);
        }

        setDisabledState(state[Settings.extensionState]);
    });
}

function updateSettingValueInUi(settingName, newValue) {
    const valueDiv = document.getElementById(settingName).getElementsByClassName("value")[0];
    valueDiv.textContent = newValue;

    if (newValue === Toggle.ON) {
        valueDiv.classList.add("success");
        valueDiv.classList.remove("alert");
    }
    else if (newValue === Toggle.OFF) {
        valueDiv.classList.add("alert");
        valueDiv.classList.remove("success");
    }
}

function setDisabledState(extensionState) {
    const classListOperation = extensionState === Toggle.ON ? "remove" : "add";
    const settingDivs = document.getElementsByClassName("setting");
    for (let settingDiv of settingDivs) {
        settingDiv.classList[classListOperation]("bg-grey");
        settingDiv.classList[classListOperation]("o-50");
        settingDiv.classList[classListOperation]("pointer-events-none");
    }
}

document.getElementById("extensionState").onclick = toggleExtensionState;
document.getElementById("notifyOfNewNotice").onclick = toggle(Settings.notifyOfNewNotice);
document.getElementById("notifyOfNewMessage").onclick = toggle(Settings.notifyOfNewMessage);
document.getElementById("largeMapEnabled").onclick = toggle(Settings.largeMapEnabled);
document.getElementById("defaultMapSize").onclick = toggleDefaultMapSize;
setSettingsValue();