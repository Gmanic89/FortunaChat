// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { storageService } from '../services/storage';

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const savedUsers = storageService.getUsers();
        const savedCurrentUser = storageService.getCurrentUser();

        setUsers(savedUsers);
        setCurrentUser(savedCurrentUser);
    }, []);

    const register = async (userData) => {
        try {
            setIsLoading(true);
            const newUser = await authService.registerUser(userData);
            setCurrentUser(newUser);
            setUsers(prev => [...prev, newUser]);
            return newUser;
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setIsLoading(true);
            const user = await authService.loginUser(credentials);
            setCurrentUser(user);
            return user;
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await authService.logoutUser();
            setCurrentUser(null);
        } catch (error) {
            console.error('Error durante logout:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        currentUser,
        users,
        isLoading,
        register,
        login,
        logout,
        isAuthenticated: !!currentUser
    };
};