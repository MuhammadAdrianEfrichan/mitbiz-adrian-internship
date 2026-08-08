import { useState } from "react"
import RegisterAkun from "../../Register/RegisterAkun";
import { register1, register2, register3 } from "../../../services/auth.service";
import RegisterOutlet from "../../Register/RegisterOutlet";
import RegisterBisnis from "../../Register/RegisterBisnis";
import RegisterDone from "../../Register/RegisterDone";

const RegisterAdmin = ()=>{
    const [step, setStep] = useState(1);
    const [tempUserId, setTempUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleStep1 = async (formData) =>{
        setLoading(true);
        setError("");
        try{
            const data = await register1(formData);
            setTempUserId(data.userId ?? data.data?.userId ?? null);
            setStep(2);
        }catch{
            setError("Tidak bisa terhubung ke server");
        }finally {
            setLoading(false);
        }
    }
    const handleStep2 = async (formData) =>{
        setLoading(true);
        setError("");
        try{
            const data = await register2(formData);
            setTempUserId(data.userId ?? data.data?.userId ?? null);
            setStep(3);
            console.log(data)
        }catch(err){
            setError(err.message||"Tidak bisa terhubung ke server");
        }finally {
            setLoading(false);
        }
    }
    const handleStep3 = async (formData) =>{
        setLoading(true);
        setError("");
        try{
            const data = await register3(formData);
            setTempUserId(data.userId ?? data.data?.userId ?? null);
            setStep(4);
        }catch(err){
            setError(err.message||"Tidak bisa terhubung ke server");
        }finally {
            setLoading(false);
        }
    }

    return(
    <div className="">
    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

    {step === 1 && <RegisterAkun onNext={handleStep1} loading={loading} />}
    {step === 2 && <RegisterBisnis onNext={handleStep2} loading={loading} />}
    {step === 3 && <RegisterOutlet onNext={handleStep3} loading={loading} />}
    {step === 4 && <RegisterDone />}
    </div>
    )
}

export default RegisterAdmin