"use client";

import Image from "next/image";
import dotenv from 'dotenv';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import StarRatingComponent from "react-star-rating-component";
import "../../styles/globals.css"

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
    comment: string,
    rating: number,
    userId: string,
    username: string
}

const BookDetails = () => {
    const { id } = useParams();
    dotenv.config();
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [comment, setcomment] = useState<string>("");
    const [reviews, setReviews] = useState<Review[]>([]);
    const [template, setTemplate] = useState<Template | undefined>();
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const userDetails = localStorage.getItem("user");
        if (userDetails) {
            const user = JSON.parse(userDetails);
            setUserRole(user.role);  // Set user role (admin or other roles)
        }
        if (id) {
            fetchTemplate();
            fetchReviews();
        }
    }, [id]);

    const fetchTemplate = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template/${id}`);
            if (!res.ok) {
                console.log("Error fetching template");
            }
            const { template } = await res.json();
            setTemplate(template);

            if (!template.defaultValues.imageUrl) {
                console.log("Image not found!");
            }
        } catch (error) {
            console.log("Error fetching template:", error);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template/${id}/review`);
            if (!res.ok) {
                toast.success("Reviews couldn't be fetched successfully");
            }
            const data = await res.json();
            setReviews(data.reviews);
        } catch (error) {
            console.log(error);
        }
    };

    const handleStarClick = (nextValue: number) => {
        setRating((prevRating) => prevRating === nextValue ? prevRating > 0 ? prevRating - 1 : prevRating : nextValue);
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!res.ok) {
                toast.error("Template Deletion Failed!");
            } else {
                toast.success("Template Deleted successfully!");
                router.push("/");
            }
        } catch (error) {
            console.log(error);
            toast.error("Some error occurred");
        }
    };

    const handleBuy = () => {
        console.log("Buy clicked");
    };

    const handleCart = async () => {
        console.log("Cart clicked");
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
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ userId, template_Id })
                });
                if (res.ok) {
                    toast.success("Book added to cart successfully!");
                }
            }
        } catch (error) {
            console.log("Error", error);
            toast.error("Error in adding book to cart!");
        }
    };

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setcomment(e.target.value);
    };

    const handleReviewSubmit: React.ChangeEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template/${id}/review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ rating, comment })
            });
            if (res.ok) {
                toast.success("Review added successfully!");
                router.refresh();
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
                            Buy Now
                        </button>
                        {userRole === "admin" && (
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
                    <h1 className="font-bold text-lg hover:underline mb-4">Write a Review ...</h1>
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
                                id="description"
                                name="description"
                                value={comment}
                                onChange={handleChange}
                                rows={3}
                                cols={40}
                                placeholder="Enter the description of the book"
                                className="w-full border border-gray-300 rounded-md p-3 mt-2 mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#366977] focus:border-[#366977]"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-[#d80032] hover:bg-[rgba(210,4,4,0.64)] text-white py-2 px-4 mb-4 rounded w-full"
                        >
                            Add Review
                        </button>
                    </form>
                </div>

                {/* Display Reviews */}
                <div className="display-reviews w-full m-4  md:w-1/3" key={""}>
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.userId} className="review-item border mb-4 rounded-md border-black p-4">
                                <div className="flex items-center text-xl">
                                    <StarRatingComponent
                                        name={`rating-${review.userId}`}
                                        starColor="#FFD700"
                                        starCount={5}
                                        value={review.rating}
                                        editing={false}
                                        emptyStarColor="#d3d3d3"
                                    />
                                </div>
                                <p>{review.comment}</p>
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
