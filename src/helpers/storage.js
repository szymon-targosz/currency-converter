const getItem = item => JSON.parse(localStorage.getItem(item));

const storeItem = (item, data) => localStorage.setItem(item, JSON.stringify(data));

export { getItem, storeItem };
