import storage from './localStorage';

// data = { email: 'mail@...' }
const saveObjToStorage = (key, data) => {
  const storageData = storage.get(key) || {};
  const updatedData = {
    ...storageData,
    ...data,
  };
  storage.save(key, updatedData);
};

const saveArrayItemToStorage = (key, item) => {
  const storageData = storage.get(key) || [];
  const updatedData = [...storageData, item];
  storage.save(key, updatedData);
};

const saveUniqueArrayItemToStorage = (key, item) => {
  const storageData = storage.get(key) || [];
  const updatedData = [...new Set([...storageData, item])];
  storage.save(key, updatedData);
};

const deleteArrayItemFromStorage = (key, item) => {
  const storageData = storage.get(key);
  const updatedData = storageData.filter(data => data !== item);
  storage.save(key, updatedData);
};

export {
  saveObjToStorage,
  saveArrayItemToStorage,
  saveUniqueArrayItemToStorage,
  deleteArrayItemFromStorage,
};
