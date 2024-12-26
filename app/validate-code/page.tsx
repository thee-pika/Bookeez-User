"use client"
import { useSearchParams } from 'next/navigation';
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const VerifyCode = () => {
  const router = useRouter();

  const [code, setCode] = useState("");
  const searchParams = useSearchParams();
  const method = searchParams.get("method");
  const contact = searchParams.get("contact");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value)
  }

  const handleSubmit = async () => {
    console.log("clicked");
    const res = await fetch("http://localhost:8000/verify/verify-code", {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({ code, method, contact })
    })
    console.log("res", res);
    if (res.ok) {
      toast.success("OTP Verification Successful");
      router.push("/")
    }
  }

  return (
    <>
      <div className="verify flex-col justify-center">
        <input
          type='text'
          value={code}
          onChange={handleChange}
          placeholder='enter the otp'
          className='border border-black p-4 '
        />
        <button onClick={handleSubmit} className='bg-red-600 p-4 '>Verify</button>
      </div>
      <ToastContainer />
    </>
  )
}

export default VerifyCode