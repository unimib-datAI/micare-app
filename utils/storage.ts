import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { MMKV } from "react-native-mmkv";

export const storage = new MMKV({
  id: "micare-app",
  encryptionKey: "micare-app",
});

const clientStorage = {
  setItem: (key, value) => {
    storage.set(key, value);
  },
  getItem: (key) => {
    const value = storage.getString(key);
    return value === undefined ? null : value;
  },
  removeItem: (key) => {
    storage.delete(key);
  },
};

export const clientPersister = createSyncStoragePersister({
  storage: clientStorage,
});
