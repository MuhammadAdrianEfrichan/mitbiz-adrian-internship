import { useState } from "react"
import RegisterAkun from "../../Register/RegisterAkun";

const RegisterAdmin = ()=>{
    const [step, useStep] = useState(1);
    const [tempUserId, setTempUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const handleStep1 = async (formData) =>{
        setLoading(true);
        setError("");
        try{
            const res = await fetch("https://schema.getpostman.com/json/collection/v2.1.0/collection.json/auth/login",{
                method: "POST",
                headers : {"Content-Type": "application/json"},
                body : JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
            setError(data.message || "Registrasi akun gagal");
            return;
            }

            setTempUserId(data.userId ?? data.data?.userId ?? null);
            setStep(2);
        }catch{
            setError("Tidak bisa terhubung ke server");
        }finally {
            setLoading(false);
        }
    }

    return(
    <div className="">
    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

    {step === 1 && <RegisterAkun onNext={handleStep1} loading={loading} />}
    {step === 2 && <StepOutlet onNext={handleStep2} loading={loading} />}
    {step === 3 && <StepSuccess />}
    </div>
    )
}

export default RegisterAdmin