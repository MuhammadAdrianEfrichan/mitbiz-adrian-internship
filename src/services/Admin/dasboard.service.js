import { environment } from "../../constant/environment";

  export const getDasboard = (params = {}) => {
  	const query = new URLSearchParams(params).toString();
  	return fetch(`${environment.API_URL}/dashboard${query ? `?${query}` : ""}`, {
  		method: "GET",
  		credentials: "include",
  	}).then(async (res) => {
  		const data = await res.json();
  		if (!res.ok) throw new Error(data.message || "Gagal mengambil data dashboard");
  		return data;
  	});
  };