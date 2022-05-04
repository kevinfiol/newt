const KEY = 'newt_config';

const get = (key) => localStorage.getItem(key);
const set = (key, value) => localStorage.setItem(key, value);
const clear = () => localStorage.clear();

export const localStorage = {
    getConfig: () => JSON.parse(get(KEY)),
    setConfig: (config) => set(KEY, JSON.stringify(config)),
    clearConfig: () => clear()
};

export const browserStorage = {
    getConfig: async () => browser.storage.local.get(),
    setConfig: async (config) => browser.storage.local.set(config),
    clearConfig: async () => browser.storage.local.clear()
};