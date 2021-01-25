const executeIfAllowed = func => (...args) => {
    chrome.storage.local.get([StorageKeys.extensionState], state => {
        const extensionState = state[StorageKeys.extensionState];
        if (extensionState === ExtensionStates.on) {
            func(...args);
        }
    });
}