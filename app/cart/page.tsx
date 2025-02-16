"use client"
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import dotenv from 'dotenv';
import Loader from '../components/Loader';
import EmptyCart from '../components/EmptyCart';
import { useRouter } from 'next/navigation';
dotenv.config();
interface cartItem {
  template: {
    defaultValues: {
      imageUrl: string,
      title: string,
      price: number,
      description: string,
      subject: string,
    }

  },
  _id: string,
  addedAt: Date,
  quantity: number
}


const CartItems = () => {
  const router = useRouter();
  const [loading, setloading] = useState(true)
  const [cartItems, setcartItems] = useState<cartItem[]>([])
  const tokenRef = useRef<string>("");

  useEffect(() => {
    const newToken = localStorage.getItem('authToken');

    if (newToken) {
      tokenRef.current = newToken
    } else {
      return router.push("/auth/login");
    }

  }, []);

  useEffect(() => {
    fetchCartItems()
  }, [])

  const fetchCartItems = async () => {
    try {
      const userDetails = localStorage.getItem("user");
      if (userDetails != null) {
        const user = JSON.parse(userDetails);

        if (user) {
          const userId = user._id

          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/user/cart?userId=${userId}`)
          if (res.ok) {
            const data = await res.json();

            const sortedCartItems = data.cart.sort((a: cartItem, b: cartItem) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
            console.log("sortedCartItems", sortedCartItems)

            setcartItems(sortedCartItems);
            console.log("cartItems", cartItems)
          }
        }
      }
    } catch (error) {
      console.log("error", error);

    } finally {
      setloading(false)
    }
  }
  if (loading) {
    return <div className=" justify-center items-center flex">
      <Loader />
    </div>
  }
  
  const handleDeleteCartItem = async (itemId: string) => {
    const userDetails = localStorage.getItem("user");
    if (userDetails != null) {
      const user = JSON.parse(userDetails);
      if (user) {
        const userId = user._id;

        // API call to delete the cart item
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/user/cart?userId=${userId}&itemId=${itemId}`, {
          method: 'DELETE',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenRef.current}`
        },
        });

        if (res.ok) {
          // Remove item from local state after deletion
          setcartItems(cartItems.filter(item => item._id !== itemId));
        } else {
          alert('Failed to delete item');
        }
      }
    }
  }

  return (
    <div className="container mx-auto p-4 h-full ">
      <div className="grid gap-4">
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          cartItems.map((item) => (
            <div key={item._id} className="flex  p-4 border-b w-[60vw] mx-auto">
              {/* Left: Image */}
              <div className="w-[50vw]">
                <Image
                  src={item.template.defaultValues.imageUrl}
                  alt={item.template.defaultValues.title}
                  width={250}
                  height={250}
                  className="object-cover rounded-md"
                />
              </div>


              <div className="w-[70vw] pl-4 flex flex-col justify-evenly border-[1px] rounded-md">

                <h3 className="text-3xl font-semibold">{item.template.defaultValues.title}</h3>
                <p className="text-md text-gray-600">{item.template.defaultValues.description}</p>
                <div className='flex text-lg '>
                  <span>Price : </span>
                  <p className="text-xl font-bold text-red-800 ml-4"> ${item.template.defaultValues.price}</p>
                </div>
                <div className='flex justify-between'>
                  <div className="title">
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>

                  <div className="delete">
                    <button onClick={() => handleDeleteCartItem(item._id)}>
                      <Image
                        src={"/assests/delete.svg"}
                        alt=""
                        width={40}
                        height={40}
                        className="object-cover rounded-md mr-8"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}


export default CartItems