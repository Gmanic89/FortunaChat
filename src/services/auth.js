// services/auth.js
import { storageService } from './storage';
import { streamChatService } from './streamChat';
import { USER_VALIDATION } from '../utils/constants';

export const authService = {
    validateRegistration: (userData, existingUsers) => {
        const { username, password, confirmPassword } = userData;

        if (password !== confirmPassword) {
            throw new Error('Las contraseñas no coinciden');
        }

        if (existingUsers.find(user => user.username === username)) {
            throw new Error('El usuario ya existe');
        }

        if (username.length < USER_VALIDATION.MIN_USERNAME_LENGTH) {
            throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
        }

        return true;
    },

    createUser: (userData) => {
        return {
            id: Date.now(),
            username: userData.username,
            password: userData.password,
            createdAt: new Date().toISOString(),
            isAdmin: streamChatService.checkIfAdmin(userData.username)
        };
    },

    registerUser: async (userData) => {
        const users = storageService.getUsers();

        authService.validateRegistration(userData, users);

        const newUser = authService.createUser(userData);
        const updatedUsers = [...users, newUser];

        storageService.saveUsers(updatedUsers);
        storageService.saveCurrentUser(newUser);

        return newUser;
    },

    loginUser: async (credentials) => {
        const users = storageService.getUsers();
        const user = users.find(u =>
            u.username === credentials.username && u.password === credentials.password
        );

        if (!user) {
            throw new Error('Usuario o contraseña incorrectos');
        }

        storageService.saveCurrentUser(user);
        return user;
    },

    logoutUser: async () => {
        await streamChatService.disconnectUser();
        storageService.clearCurrentUser();
    },

    getCurrentUser: () => {
        return storageService.getCurrentUser();
    }
};