const KEY = 'newt_config';

const get = (key) => localStorage.getItem(key);
const set = (key, value) => localStorage.setItem(key, value);
const clear = () => localStorage.clear();

export const getConfig = () => JSON.parse(get(KEY));
export const setConfig = (config) => set(KEY, JSON.stringify(config));
export const clearConfig = () => clear();
