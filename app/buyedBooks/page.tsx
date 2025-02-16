"use client"

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Loader from "../components/Loader";

interface sellerDetails {
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

const BuyedBooks = () => {
  const [buyedBooks, setbuyedBooks] = useState<Book[] | null>(null);
  const tokenRef = useRef<string>("");
  const router = useRouter();
  const [loading, setloading] = useState<boolean>(true);

  useEffect(() => {
    const newToken = localStorage.getItem('authToken');

    if (!newToken) {
      return router.push("/auth/login");
    }
    tokenRef.current = newToken

  }, []);

  useEffect(() => {
    const getBuyedBooks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/books`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenRef.current}`
          }
        });
        console.log("res", res);
        if (!res.ok) {
  
        }
        const data = await res.json();
  
        setbuyedBooks(data.books);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setloading(false);
      } finally {
        setloading(false);
      }
    }
    getBuyedBooks();
  }, [])

  
  if (loading) {
    return <div className="justify-center items-center flex">
        <Loader />
    </div>
}

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-[79vw] min-h-full h-full flex flex-col justify-between overflow-y-auto rounded-md bg-[#f1f1f1] m-4 shadow-xl ">
        {/* Responsive Grid for Images */}
        <h1 className="text-2xl font-bold m-8 ">Your Books</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {buyedBooks && buyedBooks.length > 0 ? (
            buyedBooks.map((book) => (
              <Link href={`/book/${book._id}`} key={book._id} className="group">
                <div
                  key={book._id}
                  className="m-4 shadow-sm rounded-md overflow-hidden flex justify-center"
                >
                  <div className="w-[200px] h-[290px] relative overflow-hidden">

                    <Image
                      src={book.imageUrl}
                      alt=""
                      layout="fill"
                      objectFit="cover"
                      className=" transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                </div>
              </Link>
            ))

          ) : (
            <p>No books available.</p>
          )}
        </div>
      </div>

    </>
  )
}

export default BuyedBooks