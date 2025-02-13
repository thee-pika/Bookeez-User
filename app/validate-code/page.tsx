"use client"
import {  useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyCode = () => {
  const router = useRouter();
  const [method, setMethod] = useState("");
  const [contact, setContact] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setMethod(params.get("method") || "");
      setContact(params.get("contact") || "");
    }
  }, []);

  // const searchParams = useSearchParams();
  // const method = searchParams.get("method");
  // const contact = searchParams.get("contact");

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