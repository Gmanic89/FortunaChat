// services/storage.js
import { STORAGE_KEYS } from '../utils/constants';

export const storageService = {
    saveUsers: (users) => {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    },

    getUsers: () => {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    },

    saveCurrentUser: (user) => {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
    },

    clearCurrentUser: () => {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    },

    save: (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    },

    get: (key, defaultValue = null) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    }
};