import { ref, computed } from 'vue';

// Authentication state
const user = ref(null);
const token = ref(localStorage.getItem('token') || null);
const isAuthenticated = computed(() => !!token.value);

// API base URL from environment variable
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;


// Initialize user from localStorage
const initAuth = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            user.value = JSON.parse(storedUser);
        } catch (e) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }
};

// Register
export const register = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Login
export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store token and user
        token.value = data.token;
        user.value = data.loggedInUser;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.loggedInUser));

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Logout
export const logout = async () => {
    try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.value}`,
            },
        });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Clear local state regardless of API call result
        token.value = null;
        user.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

// Get auth header
export const getAuthHeader = () => {
    return token.value ? { 'Authorization': `Bearer ${token.value}` } : {};
};

// Check if user is authenticated
export const checkAuth = () => {
    return isAuthenticated.value;
};

// Get current user
export const getCurrentUser = () => {
    return user.value;
};

// Initialize on import
initAuth();

export const useAuth = () => {
    return {
        user: computed(() => user.value),
        token: computed(() => token.value),
        isAuthenticated,
        login,
        logout,
        register,
        checkAuth,
        getCurrentUser,
        getAuthHeader,
    };
};
