// hooks/useAuth.js
import { useState, useEffect } from 'react';

export function useAuth() {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Verificar si hay usuario guardado al cargar
    useEffect(() => {
        const savedUser = localStorage.getItem('chatUser');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                setCurrentUser(userData);
            } catch (error) {
                console.error('Error parsing saved user:', error);
                localStorage.removeItem('chatUser');
            }
        }
    }, []);

    // Función de registro
    const register = async ({ username, password, name, email, role = 'user' }) => {
        setIsLoading(true);
        try {
            const res = await fetch('https://streamchat-backend.vercel.app/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || 'Error en el registro');
            }

            if (!data.success) {
                throw new Error(data.error || 'Error en el registro');
            }

            // Crear objeto de usuario completo
            const newUser = {
                id: data.username,
                username: data.username,
                token: data.token,
                name: name || data.username,
                email: email,
                role: role,
            };

            // Guardar en localStorage
            localStorage.setItem('chatUser', JSON.stringify(newUser));
            setCurrentUser(newUser);
            
            return newUser;
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Función de login (corregida)
    const login = async ({ username, password }) => {
        setIsLoading(true);
        try {
            console.log('Intentando login con:', { username, password });
            
            // ✅ Corregir URL: agregar /api/login
            const res = await fetch('https://streamchat-backend.vercel.app/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            
            const data = await res.json();
            console.log('Respuesta del servidor:', data);
            
            if (!res.ok) {
                throw new Error(data.error || 'Usuario o contraseña incorrectos');
            }

            if (!data.success) {
                throw new Error(data.error || 'Usuario o contraseña incorrectos');
            }

            // Crear objeto de usuario completo
            const user = {
                id: data.username,
                username: data.username,
                token: data.token,
                name: data.username, // Podrías expandir esto
                role: username === 'admin' ? 'admin' : 'user', // Lógica simple de admin
            };

            console.log('Usuario creado:', user);

            // Guardar en localStorage
            localStorage.setItem('chatUser', JSON.stringify(user));
            setCurrentUser(user);
            
            console.log('✅ Login exitoso:', user);
            return user;
        } catch (error) {
            console.error('❌ Error en login:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Función de logout
    const logout = () => {
        localStorage.removeItem('chatUser');
        setCurrentUser(null);
        setUsers([]);
    };

    // Función para actualizar lista de usuarios
    const updateUsers = (usersList) => {
        setUsers(usersList);
    };

    return {
        currentUser,
        users,
        isLoading,
        register,
        login,
        logout,
        updateUsers,
        isAuthenticated: !!currentUser,
    };
}