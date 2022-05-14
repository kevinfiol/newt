const KEY = 'newt_config';
const protocol = window.location.protocol;

const storage = {
    getConfig: async () => JSON.parse(localStorage.getItem(KEY)),
    setConfig: async (config) => localStorage.setItem(KEY, JSON.stringify(config)),
    clearConfig: async () => localStorage.clear()
};

if (protocol == 'moz-extension:') {
    storage.getConfig = async () => browser.storage.local.get();
    storage.setConfig = async (config) => browser.storage.local.set(config);
    storage.clearConfig = async () => browser.storage.local.clear();
}

export { storage };