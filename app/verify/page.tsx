"use client"
import { useState } from 'react'
import dotenv from 'dotenv';
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Verify = () => {
    dotenv.config();
    const [method, setmethod] = useState("")
    const [email, setemail] = useState("")
    const [number, setNumber] = useState("")
    const router = useRouter();

    const handleVerify = async () => {
        let contact;
        if (method === "email") {
            contact = email;

        } else {
            if (number.startsWith("+")) {
                contact = number;
            } else if (number.startsWith("91")) {
                contact = `+${number}`;
            } else {
                contact = `+91${number}`;
            }
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/verify/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ method, contact })
        })

        await response.json()
        console.log("res", response)
        if (response.ok) {
            toast.success("OTP sent successfully");
            router.push(`/validate-code?method=${method}&contact=${encodeURIComponent(contact)}`);

        } else {
            console.log("contact:", contact);
            console.log("method:", method);

            toast.error("Failed to send OTP");
        }
    }

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNumber(e.target.value)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("email", email)
        setemail(e.target.value)
    }

    return (
        <>
            <div className='flex flex-col items-center h-[78vh] justify-center'>
                <div className='mb-8 mt-8 text-3xl font-bold '> verification </div>
                <button className="verify-email bg-[#ACABA4] hover:bg-[#474745] rounded-md p-4 mb-4 w-[20vw] " onClick={() => setmethod("email")}>Verify Using Email</button>
                <button className="verify-number bg-[#ACABA4] hover:bg-[#474745] rounded-md p-4 w-[20vw]" onClick={() => setmethod("phone")}>Verify Using Mobile Number</button>

                {
                    method === "phone" ?
                        (
                            <div className="phone flex justify-center mt-12  ">
                                <input
                                    type='number'
                                    placeholder='Enter Your Number'
                                    onChange={handleNumberChange}
                                    value={number}
                                    className='w-[20vw] focus:outline-none border-[2.5px] p-3 rounded-md border-red-700'
                                    required
                                />
                                <button className='bg-red-700 text-white p-3 hover:bg-red-900 rounded-md ml-4 ' onClick={handleVerify}>Send OTP</button>
                            </div>
                        )
                        :
                        <div className="phone flex justify-center mt-12 ">
                            <input
                                type='email'
                                placeholder='Enter Your email'
                                value={email}
                                onChange={handleChange}
                                className='w-[20vw] focus:outline-none border-[2.5px] p-3 rounded-md border-red-700'
                                required
                            />
                            <button className='bg-red-700 text-white p-3 rounded-md ml-4 hover:bg-red-900' onClick={handleVerify}>Send Code</button>
                        </div>
                }
            </div>
            <ToastContainer />
        </>
    )
}

export default Verify