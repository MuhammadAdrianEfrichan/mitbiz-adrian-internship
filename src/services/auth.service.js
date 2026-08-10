import { environment } from "../constant/environment";

export const register1 = async (formData) => {
    const res = await fetch(`${environment.API_URL}/auth/register/step1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials : "include",
        body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Registrasi akun gagal");
    }

    return data; 
};


export const register2 = async (formData) => {
    const res = await fetch(`${environment.API_URL}/auth/register/step2`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        credentials : "include",
        body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Registrasi akun gagal");
    }
    return data; 
};

export const register3 = async (formData) => {
    const res = await fetch(`${environment.API_URL}/auth/register/step3`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        credentials : "include",
        body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Registrasi akun gagal");
    }

    return data; 
};



export const login = async (formData) => {
    const res = await fetch(`${environment.API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Login gagal");
    }

    return data;
};

export const getMe = async () => {
    const res = await fetch(`${environment.API_URL}/auth/me`, { 
        method: "GET",
        credentials: "include",  
    });
    if (!res.ok) throw new Error("Belum login");
    return res.json();
};

export const logout = async () => {
    const res = await fetch(`${environment.API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",  
    });
    if (!res.ok) throw new Error("Gagal logout");
    return res.json();
};