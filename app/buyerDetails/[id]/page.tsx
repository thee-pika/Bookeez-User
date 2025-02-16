"use client";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Loader from "@/app/components/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RenderRazorpay from "@/app/components/renderRazorpay";
import { useRouter } from "next/navigation";
import EditSelletDetails from "@/app/edit-seller/[id]/page";

interface sellerDetails {
    _id: string;
    userId: string;
    name: string;
    address: string;
    email: string;
}

interface Book {
    _id: string,
    title: string;
    author: string;
    price: number;
    isbn: string;
    subject: string;
    stream: string;
    description: string;
    semester: string;
    condition: string;
    imageUrl: string;
    sellerDetails: sellerDetails;
}

const BuyerDetails = () => {
    const { id } = useParams();
    const router = useRouter();
    const [books, setbooks] = useState<Book[] | null>(null);
    const [loading, setloading] = useState<boolean>(true);
    const [displayRazorpay, setDisplayRazorpay] = useState(false);
    const tokenRef = useRef<string>("");
    const [, setIsLoggedIn] = useState(false);
    const [userId, setuserId] = useState("");
    const [open, setopen] = useState(false);

    const [details, setdetails] = useState({
        templateId: "",
        bookId: "",
        name: "",
        email: "",
        address: ""
    })
    const [orderDetails, setorderDetails] = useState({
        orderId: "",
        currency: null,
        amount: 0,
        keyId: "",
        templateId: "",
        bookId: ""
    })

    useEffect(() => {
        const userDetails = localStorage.getItem("user");
        if (userDetails) {
            const user = JSON.parse(userDetails);
            setuserId(user._id);
        }

        const newToken = localStorage.getItem('authToken');
        console.log("new token", newToken);
        if (!newToken) {
            setIsLoggedIn(false);
            return router.push("/auth/login");
        }
        tokenRef.current = newToken
        setIsLoggedIn(!!newToken);
    }, [router]);

    // useEffect(() => {
    //     const fetchDetails = async () => {

    //       try {
    //           const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template/${details.templateId}/book/${details.bookId}`);
    //           if (res.ok) {
    //               const data = await res.json();

    //               const { book } = data;
    //               console.log("bookkkkkkkkkkkkkkkkkkkkkkkkk", book);
    //               setdetails({
    //                   ...details, name: book?.sellerDetails.name || "",
    //                   email: book?.sellerDetails.email || "",
    //                   address: book?.sellerDetails.address || ""
    //               });
    //               console.log("Fetched book data:", book);
    //           }
    //       // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //       } catch (error) {
    //         setloading(false)
    //       } finally {
    //         setloading(false)
    //       }
    //     }
    //     fetchDetails();
    // }, [details])

    // useEffect(() => {
    //     if (templateId && bookId) {
    //         const fetchDetails = async () => {
    //             try {

    //             } catch (error) {
    //                 console.error("Error fetching seller details:", error);
    //             } finally {
    //                 setloading(false);
    //             }
    //         };

    //         fetchDetails();
    //     }
    // }, [templateId, bookId]);


    useEffect(() => {
        if (id) {
            const fetchBuyers = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template/${id}`);
                    if (!res.ok) {
                        console.log("Error fetching template");
                    }
                    const { template } = await res.json();
                    console.log("template", template);
                    if (template) {
                        setbooks(template.books);
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error: unknown) {
                    toast.error(`Error occured!!`);
                    setloading(false);
                } finally {
                    setloading(false);
                }
            }

            fetchBuyers();
        }
    }, [id])

    if (loading) {
        return <div className="justify-center items-center flex">
            <Loader />
        </div>
    }

    const handleEDitSellerDetails = async (bookId: string) => {
        try {

            setopen(true);
            // setdetails({ ...details, });
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template/${id}/book/${bookId}`
            );

            if (res.ok) {
                const data = await res.json();
                const { book } = data;

                console.log("Fetched book data:", book);
                console.log("book?.sellerDetails?.name", book?.sellerDetails?.name);
                console.log("book?.sellerDetails?.email ", book?.sellerDetails?.email);
                console.log("book?.sellerDetails?.address", book?.sellerDetails?.address);
                setdetails({
                    ...details,
                    name: book?.sellerDetails?.name || "",
                    email: book?.sellerDetails?.email || "",
                    address: book?.sellerDetails?.address || "",
                    templateId: id as string, bookId
                });
            } else {
                console.error("Failed to fetch seller details");
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setloading(false);
        } finally {
            setloading(false);
        }
        // router.push(`/edit-seller/${id}`);
    }

    const handleDeleteSellerDetails = async (sellerId: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template/${id}/book/${sellerId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenRef.current}`
            },
        })

        if (res.ok) {
            toast.success("Book Deleted successfully!");
            setTimeout(() => {
                router.push("/");
            }, 1000)
        } else {
            toast.error("Book Deletion Failed!");
        }
    }

    const handleBuy = async (book: Book) => {
        console.log("book", book);
        const orderDetailss = {
            amount: book.price,
            currency: "INR"
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/payment/order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenRef.current}`
            },
            body: JSON.stringify(orderDetailss)
        });

        if (res.ok) {
            const data = await res.json();
            console.log("res rom razorpay", data);
            setorderDetails({
                ...orderDetails,
                orderId: data.order_id,
                currency: data.currency,
                amount: book.price,
                keyId: data.keyId,
                templateId: id ? id as string : "",
                bookId: book._id
            })

            setDisplayRazorpay(true);
        }
    }

    return (
        <>
            {
                !loading && open ? <EditSelletDetails details={details} /> :

                    <div className="flex flex-col items-center p-6">
                        {
                            books && books?.length > 0 ? books.map((book: Book, index: number) => (
                                book.sellerDetails ? (<div key={index} className="flex flex-col md:flex-row gap-6 p-4 border shadow-md rounded-lg w-full max-w-3xl">

                                    <div className="flex-shrink-0">
                                        <Image
                                            src={book.imageUrl}
                                            alt={book.title}
                                            width={48}
                                            height={64}
                                            className="object-cover rounded-md"
                                        />
                                    </div>

                                    <div className="flex flex-col justify-between w-full">
                                        <div className="mb-4">
                                            <div className="flex justify-between">
                                                <h1 className="text-xl font-bold">{book.title}</h1>
                                                <div>
                                                    {
                                                        userId === book.sellerDetails.userId ?
                                                            <div className="flex">
                                                                <span onClick={() => handleEDitSellerDetails(book._id)}>
                                                                    <Image
                                                                        src={"/assests/edit.svg"} alt={""} width={30} height={30} className="mx-2 cursor-pointer" />

                                                                </span>
                                                                <span onClick={() => handleDeleteSellerDetails(book._id)}>
                                                                    <Image
                                                                        src={'/assests/delete.svg'}
                                                                        alt={""}
                                                                        width={30}
                                                                        height={30}
                                                                        className="mx-2 cursor-pointer"
                                                                    />
                                                                </span>
                                                            </div> : ""
                                                    }
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">{book.author}</p>
                                        </div>
                                        <div className="mb-4">
                                            <h2 className="text-lg font-semibold">Buyer Details</h2>
                                            <p><strong>Name:</strong> {book.sellerDetails.name}</p>
                                            <p><strong>Address:</strong> {book.sellerDetails.address}</p>
                                            <p><strong>Email:</strong> {book.sellerDetails.email}</p>
                                        </div>

                                        <button
                                            className="px-4 py-2 bg-[#366977] text-white font-semibold rounded-lg hover:bg-[#14333c]"
                                            onClick={() => handleBuy(book)}
                                        >
                                            Buy Now
                                        </button>
                                        {
                                            displayRazorpay && <RenderRazorpay orderDetails={orderDetails} />
                                        }
                                    </div>
                                </div>) : <p key={book.isbn}> No buyers Found Still now</p>
                            ))
                                :
                                <p> No boooks found</p>
                        }
                    </div>}
            <ToastContainer />
        </>
    )
}

export default BuyerDetails