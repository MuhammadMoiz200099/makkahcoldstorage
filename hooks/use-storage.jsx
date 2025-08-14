'use client';

function useStorage() {

    const getToken = () => {
        return localStorage.getItem('token');
    }
    const getUser = () => {
        const user = localStorage.getItem('user');
        return JSON.parse(user);
    }
    const saveToken = (token) => {
        localStorage.setItem('token', token);
    }
    const saveUser = (user) => {
        localStorage.setItem('user', JSON.stringify(user));
    }
    const clearStorage = () => {
        localStorage.clear();
    }

    return {
        getToken,
        getUser,
        saveToken,
        saveUser,
        clearStorage
    }
}

export default useStorage;