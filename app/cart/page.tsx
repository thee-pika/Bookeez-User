"use client"
import { useEffect, useState } from 'react'
import Image from 'next/image'
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
  const [cartItems, setcartItems] = useState<cartItem[]>([])

  useEffect(() => {
    fetchCartItems()
  }, [])

  const fetchCartItems = async () => {
    const userDetails = localStorage.getItem("user");
    if (userDetails != null) {
      const user = JSON.parse(userDetails);

      if (user) {
        const userId = user._id

        const res = await fetch(`http://localhost:5000/api/user/cart?userId=${userId}`)
        if (res.ok) {
          const data = await res.json();
          console.log("data.cart", data.cart)
          const sortedCartItems = data.cart.sort((a: cartItem, b: cartItem) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
          console.log("sortedCartItems", sortedCartItems)

          setcartItems(sortedCartItems);
          console.log("cartItems", cartItems)
        }
      }
    }
  }
  const handleDeleteCartItem = async (itemId: string) => {
    const userDetails = localStorage.getItem("user");
    if (userDetails != null) {
      const user = JSON.parse(userDetails);
      if (user) {
        const userId = user._id;
        
        // API call to delete the cart item
        const res = await fetch(`http://localhost:5000/api/user/cart?userId=${userId}&itemId=${itemId}`, {
          method: 'DELETE',
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
    <div className="container mx-auto p-4">
      <div className="grid gap-4">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
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