import Image from "next/image";
import Link from "next/link";

const EmptyCart = () => {
    return (
        <>
            <div className="flex-col mx-auto justify-evenly">

                <div className="cart-image w-70 h-[50vh] relative overflow-hidden">
                    <Image
                        src={"/assests/cart-empty.webp"}
                        objectFit="cover"
                        layout="fill"
                        alt={""}
                    />
                </div>
                <div>
                    <h1 className="text-center font-bold text-xl ">Your Cart is Empty </h1>
                    <h3 className="text-center mt-4 text-gray-500"> Looks like you have not added anything to your Cart </h3>
                    <h3 className="text-center text-gray-500"> Go ahead and explore the Top categories</h3>
                </div>
                <div>
                    <Link href={"/"} >
                    <button
                        className="bg-[#090909] text-white mt-4 py-2 px-4 mb-4 rounded hover:bg-[rgb(43,47,52)] w-full md:w-[25rem]"
                        aria-label="Buy this template"
                    >
                        Discover Books
                    </button>

                    </Link>
                </div>
            </div>
        </>
    )
}

export default EmptyCart