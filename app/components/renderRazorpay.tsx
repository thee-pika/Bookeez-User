
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface RenderRazorpayProps {
    orderId: string;
    currency: string | null;
    amount: number;
    keyId: string;
    templateId: string,
    bookId: string
}

interface Options {
    order_id: string;
    currency: string | null;
    amount: number;
    key: string;
    name: string;
    prefill: {
        name: string
    }
}

interface RazorPayResponse {
    razorpay_payment_id: string | null;
}

const loadScript = (src: string) => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;

    script.onload = () => {
        console.log('razorpay loaded successfully');
        resolve(true);
    };

    script.onerror = () => {
        console.log('error in loading razorpay');
        resolve(false);
    };

    document.body.appendChild(script);
});

const displayRazorpay = async (options: Options) => {

    const res = await loadScript(
        'https://checkout.razorpay.com/v1/checkout.js',
    );

    if (res) {
        const rzpy = new window.Razorpay(options);
        rzpy.open()
    }
}

const RenderRazorpay = ({ orderDetails }: { orderDetails: RenderRazorpayProps }) => {
    const router = useRouter();
    const tokenRef = useRef<string>("");

    useEffect(() => {
        const getToken = () => {
            const newtoken = localStorage.getItem('authToken');
            console.log("token before paymentttttttttttt", newtoken);
            if (newtoken) {
                console.log("im in new token iff ");
                tokenRef.current = newtoken;
            }
        }
        getToken();
    }, [])

    const AddPayment = async (response: RazorPayResponse) => {
        console.log("res", response);
        const paymentDetails = {
            paymentId: response.razorpay_payment_id,
            amount: orderDetails.amount,
            templateId: orderDetails.templateId,
            bookId: orderDetails.bookId
        }
        console.log("payment deatils", paymentDetails);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/payment/paid`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenRef.current}`
            },
            body: JSON.stringify(paymentDetails)
        });

        if (!res.ok) {
            console.log("Error fetching template");
            console.log("res", res);
        }
        toast.success("Payment successfull");
        router.push("/");
        console.log("res,", res);
    }

    useEffect(() => {

        if (!orderDetails) {
            router.push("/");
        }

        const options = {
            key: orderDetails.keyId,
            amount: orderDetails.amount,
            currency: orderDetails.currency,
            name: 'amit',
            order_id: orderDetails.orderId,

            handler: (response: RazorPayResponse) => {
                console.log("res after payment", response);
                AddPayment(response)
            },

            prefill: {
                "name": "Gaurav Kumar",
            }
        };

        displayRazorpay(options);
    }, []);

    <ToastContainer />
    return null;
}

export default RenderRazorpay;

declare global {
    interface Window {
        Razorpay: {
            new(options: Options): {
                open: () => void;
                close: () => void;
                on(event: string, handler: (response: unknown) => void): void;
            };
        }
    }
}


