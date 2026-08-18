import { environment } from "../constant/environment";


export const getProduct = async () => {
    const res = await fetch(`${environment.API_URL}/products`, {
        method: "GET",
        credentials: "include",
    }); 
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data cabang");
    return data;
};

// CREATE — tambah cabang baru
export const createProduct = async (productData) => {
    const res = await fetch(`${environment.API_URL}/products`, {
        method: "POST",
        credentials: "include",
        body: productData, // langsung kirim FormData, JANGAN set Content-Type & JANGAN stringify
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menambah cabang");
    return data;
};


export const updateProduct = async (id, productData) => {
    const res = await fetch(`${environment.API_URL}/products/${id}`, {
        method: "PATCH",
        credentials: "include",
        body: productData, 
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengubah cabang");
    return data;
};

// UPDATE — edit cabang berdasarkan id

// DELETE — hapus cabang berdasarkan id
export const deleteProduct = async (id) => {
    const res = await fetch(`${environment.API_URL}/products/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menghapus cabang");
    return data;
};

// seacrh

export const searchProduct = async (search) => {
    const filter = search ? search.toLocaleLowerCase() : "";

    const url = filter
        ? `${environment.API_URL}/products?search=${encodeURIComponent(filter)}`
        : `${environment.API_URL}/products`;

    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data produk");
    return data;
};
export const categoryProduct = async (category) => {
    // const filter = search ? search.toLocaleLowerCase() : "";
    let url = `${environment.API_URL}/products`
    if(category){
        url+= `?categoryId=${encodeURIComponent(category)}`;
    }

    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data produk");
    return data;
};

