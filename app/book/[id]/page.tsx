"use client";

import Image from "next/image";
import dotenv from 'dotenv';
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import StarRatingComponent from 'react-star-rating-component';
import "../../styles/globals.css"
import Loader from "@/app/components/Loader";
dotenv.config();


interface Template {
    template_name: string,
    _id: string,
    defaultValues: {
        title: string,
        author: string,
        price: number,
        isbn: string,
        subject: string,
        stream: string,
        description: string,
        semester: string,
        condition: string,
        imageUrl: string,
    }
}
interface Review {
    _id: string,
    comment: string,
    rating: number,
    userId: string,
    username: string
}

interface UserDetails {
    role: string,
    _id: string,
    username: string
}
const BookDetails = () => {
    const { id } = useParams();
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [comment, setcomment] = useState<string>("");
    const [reviews, setReviews] = useState<Review[]>([]);
    const [template, setTemplate] = useState<Template | undefined>();
    const [userData, setUserData] = useState<UserDetails | null>(null);
    const [loading, setloading] = useState<boolean>(true);
    const tokenRef = useRef<string>("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [reviewId, setreviewId] = useState("");
    const [isEditing, setisEditing] = useState(false);

    useEffect(() => {
        const newToken = localStorage.getItem('authToken');

        if (newToken) {
            setIsLoggedIn(true);
            tokenRef.current = newToken
        }

        setIsLoggedIn(!!newToken);
    }, []);

    const fetchTemplate = async () => {

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template/${id}`);
            console.log("res,", res);
            if (!res.ok) {
                console.log("Error fetching template");
            }
            const { template } = await res.json();
            setTemplate(template);

            if (!template.defaultValues.imageUrl) {
                console.log("Image not found!");
            }
        } catch (error) {
            console.log("Error fetching templateeeeeeeee:", error);
            toast.error("Error Loading!!");
            setloading(false);
        } finally {
            setloading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            console.log("im in fetch review")
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template/${id}/review`);

            if (!res.ok) {
                toast.error("Reviews couldn't be fetched successfully");
            }
            const data = await res.json();
            console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaa", data);
            setReviews(data.reviews);
        } catch (error) {
            console.log(error);

        }
    };

    useEffect(() => {
        const userDetails = localStorage.getItem("user");
        if (userDetails) {
            const user = JSON.parse(userDetails);
            console.log("userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr,", user);
            setUserData({ ...userData, role: user.role, _id: user._id, username: user.username });
        }
        if (id) {
            fetchTemplate();
            fetchReviews();
        }

    }, [id]);


    if (loading) {
        return <div className="justify-center items-center flex">
            <Loader />
        </div>
    }

    const handleBuy = () => {
        router.push(`/buyerDetails/${id}`);
    }

    const handleStarClick = (nextValue: number) => {
        setRating((prevRating) => prevRating === nextValue ? prevRating > 0 ? prevRating - 1 : prevRating : nextValue);
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenRef.current}`
                },
            });
            if (!res.ok) {
                toast.error("Template Deletion Failed!");
            } else {
                toast.success("Template Deleted successfully!");
                setTimeout(() => {
                    router.push("/");
                }, 1000)

            }
        } catch (error) {
            console.log(error);
            toast.error("Some error occurred");
        }
    };

    const handleReviewDelete = async (reviewId: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template/${id}/review/${reviewId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenRef.current}`
            },
        })

        if (res.ok) {
            toast.success("Template Deleted successfully!");
            setTimeout(() => {
                router.push("/");
            }, 1000)
        } else {
            toast.error("Review Deletion Failed!");
        }
    }

    const handleEDitReview = async (reviewId: string) => {
        setisEditing(true);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template/${id}/review/${reviewId}`);

        if (res.ok) {
            const data = await res.json();
            console.log("data", data);
            console.log("commenttttttttttttttttttttt", data.review.comment);
            console.log("rattttttttttttt", data.review.rating);
            setreviewId(data.review._id);
            setcomment(data.review.comment);
            setRating(data.review.rating);
        }
    }

    const handleCart = async () => {

        try {
            const template_Id = id;
            const userDetails = localStorage.getItem("user");

            if (userDetails != null) {
                const user = JSON.parse(userDetails);
                if (user) {
                    console.log(user._id);
                }
                const userId = user._id;
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/user/cart`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokenRef.current}`
                    },
                    body: JSON.stringify({ userId, template_Id })
                });
                if (res.ok) {
                    toast.success("Book added to cart successfully!");
                    setTimeout(() => {
                        router.push("/cart");
                    }, 1000);
                }
            }
        } catch (error) {
            console.log("Error", error);
            toast.error("Error in adding book to cart!");
        }
    };

    const handleReviewSubmit: React.ChangeEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        try {
            if (!isLoggedIn) {
                return router.push("/auth/login");
            }

            if (rating === 0 || comment === "") {
                toast.error("please enter the values!!");
            }
            const username = userData?.username
            if (isEditing) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template/${id}/review/${reviewId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokenRef.current}`
                    },
                    body: JSON.stringify({ rating, comment, username })
                });

                if (res.ok) {
                    console.log("res,", res);
                    toast.success("Review edited successfully!");

                    setTimeout(() => {
                        router.refresh();
                    }, 1000);
                }
            } else {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template/${id}/review`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokenRef.current}`
                    },
                    body: JSON.stringify({ rating, comment })
                });

                if (res.ok) {
                  
                    toast.success("Review added successfully!");

                    setTimeout(() => {
                        router.refresh();
                    }, 1000);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="mx-auto w-full max-w-screen-lg p-6">
                <div className="bg-white shadow-md rounded-lg h-auto flex flex-col md:flex-row hover:shadow-2xl border transition-shadow overflow-hidden">
                    {/* Left Side: Image */}
                    <div className="w-full md:w-2/5 flex justify-center items-center p-6">
                        {template?.defaultValues.imageUrl && (
                            <Image
                                src={template?.defaultValues.imageUrl}
                                alt={template._id}
                                width={300}
                                height={400}
                                className="w-full max-w-[300px] h-[400px] object-cover rounded-md hover:shadow-2xl"
                            />
                        )}
                    </div>

                    <div className="w-full md:w-3/5 p-6 flex flex-col justify-start">
                        <div className="flex justify-between items-start flex-wrap">
                            <h1 className="text-3xl font-bold mb-4 overflow-hidden text-ellipsis whitespace-nowrap">{template?.defaultValues.title}</h1>
                            <div className="icon-add">
                                <button className="hover:shadow-md shadow-[#605f5f]" onClick={handleCart}>
                                    <Image src={"/assests/cart.svg"} alt={""} width={40} height={40} />
                                </button>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-4">{template?.defaultValues.description}</p>
                        <p className="text-lg mb-2">
                            <span className="font-bold">Stream:</span> {template?.defaultValues.stream}
                        </p>
                        <p className="text-lg mb-2">
                            <span className="font-bold">Subject:</span> {template?.defaultValues.subject}
                        </p>
                        <p className="text-lg mb-2">
                            <span className="font-bold">Author:</span> {template?.defaultValues.author}
                        </p>
                        <p className="text-lg mb-4">
                            <span className="font-bold">Condition:</span> {template?.defaultValues.condition}
                        </p>
                        <p className="text-2xl font-semibold mb-6">
                            Price: <span className="text-[#d80032]">${template?.defaultValues.price}</span>
                        </p>
                        <button
                            className="bg-[#090909] text-white py-2 px-4 mb-4 rounded hover:bg-[rgb(43,47,52)] w-full md:w-[25rem]"
                            aria-label="Buy this template"
                            onClick={handleBuy}
                        >
                            Buyer Details
                        </button>
                        {userData?.role === "admin" && (
                            <div className="flex flex-wrap">
                                <Link href={`/edit-template/${template?._id}`} key={template?._id}>
                                    <button
                                        className="bg-[#366977] hover:bg-[#153943] text-white py-2 px-4 rounded w-full md:w-48 mb-4"
                                        aria-label="Edit template"
                                    >
                                        Edit
                                    </button>
                                </Link>
                                <button
                                    className="bg-[#d80032] hover:bg-[rgba(210,4,4,0.64)] text-white py-2 px-4 rounded w-full lg:ml-4 md:ml-3 md:w-48 mb-4"
                                    aria-label="Delete template"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Review section */}
            <hr />
            <div className="reviews-section flex flex-wrap justify-evenly mt-8">
                {/* Review Form */}
                <div className="review w-full md:w-1/3  m-4 mb-8 mt-4 border flex flex-col h-[45vh] items-center border-black rounded-md p-6">
                    <h1 className="font-bold text-lg hover:underline mb-4">{!isEditing ? "Write a Review ..." : "Edit your Review ..."}</h1>
                    <form onSubmit={handleReviewSubmit} className="w-full">

                        <div className="custom-star-rating rating text-2xl ml-4" style={{ fontSize: "2rem" }}>
                            <StarRatingComponent
                                name="rate1"
                                starColor="#FFD700"
                                starCount={5}
                                value={rating}
                                onStarClick={handleStarClick}
                                emptyStarColor="#d3d3d3"
                                editing={true}
                            />
                        </div>
                        <div className="comment">
                            <textarea
                                id="comment"
                                name="comment"
                                value={comment}
                                onChange={(e) => setcomment(e.target.value)}
                                rows={3}
                                cols={40}
                                placeholder="Enter the comment"
                                className="w-full border border-gray-300 rounded-md p-3 mt-2 mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#366977] focus:border-[#366977]"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-[#d80032] hover:bg-[rgba(210,4,4,0.64)] text-white py-2 px-4 mb-4 rounded w-full"
                        >
                            {!isEditing ? " Add Review" : "Edit Review "}
                        </button>
                    </form>
                </div>

                {/* Display Reviews */}
                <div className="display-reviews w-full m-4 md:w-1/3" key={"reviews"}>
                    {reviews.length > 0 ? (
                        reviews.map((review) => (

                            <div key={review._id} className="review-item border mb-4 rounded-md border-black p-4">
                                <div className="flex justify-between">
                                    <div className="flex">
                                        <div className="user-icon mt-2 ">
                                            <Image src={"/assests/user.svg"} alt={''} width={30} height={30} />
                                        </div>
                                        <div className="flex-col ml-4">
                                            <h1>{review.username ? review.username : "Anonymouse"}</h1>
                                            <p className="text-gray-600 text-sm">By Bookeez</p>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <Image
                                            src={"/assests/star.svg"}
                                            alt={""}
                                            width={24}
                                            height={24}
                                        />
                                        <span className="text-lg mt-2 ml-[2px]">{review.rating ? review.rating : 1} / 5</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <p>{review.comment}</p>
                                    <div className="flex items-end text-sm ratings justify-between">
                                        {
                                            userData?._id === review.userId ?
                                                <div className="flex">
                                                    <span onClick={() => handleEDitReview(review._id)}>

                                                        <Image
                                                            src={"/assests/edit.svg"} alt={""} width={30} height={30} className="mx-2" />

                                                    </span>
                                                    <span onClick={() => handleReviewDelete(review._id)}>
                                                        <Image
                                                            src={'/assests/delete.svg'}
                                                            alt={""}
                                                            width={30}
                                                            height={30}
                                                            className="mx-2"
                                                        />
                                                    </span>
                                                </div> : ""
                                        }
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default BookDetails;
