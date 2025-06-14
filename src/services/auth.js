const BASE_URL = 'https://streamchat-backend.vercel.app/api'; // Reemplazá con tu URL si es distinta

// Registrar un nuevo usuario
export const registerUser = async ({ username, password }) => {
    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al registrar usuario');
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error('❌ Error en registerUser:', err.message);
        throw err;
    }
};

// Iniciar sesión
export const loginUser = async ({ username, password }) => {
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al iniciar sesión');
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error('❌ Error en loginUser:', err.message);
        throw err;
    }
};