import { createMMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

export const storage = createMMKV({ id: "my-app-storage" });

export const mmkvStorage: StateStorage = {
    setItem: (key: string, value: string) => {
        storage.set(key, value);
    },
    getItem: (key) => {
        const value = storage.getString(key);
        return value ?? null;
    },
    removeItem: (key: string) => {
        storage.remove(key);
    },
};