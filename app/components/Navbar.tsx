"use client";
import React, { useState, useEffect } from 'react';
import "../styles/layout.css";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    router.push('/auth/login');
  };

  return (
    <div className="nav-component">
      <nav className="nav h-[62px] bg-[#ACABA4] flex items-center justify-between pl-4 sm:pl-6 md:pl-8">
        {/* Logo and Name */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link href="/">
            <Image
              src="/assests/logo.png"
              width={40}
              height={40}
              alt="logo"
              className="cursor-pointer"
            />
          </Link>
          <Link href="/">
            <span className="name text-2xl sm:text-3xl font-bold">Bookeez</span>
          </Link>
        </div>

        {/* Hamburger Menu */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/sell">
            <button className="bg-[#d80032] rounded-md px-4 py-2 text-sm hover:bg-[#d8003281] text-[#F1FBFB]">
              Sell
            </button>
          </Link>
          {!isLoggedIn ? (
            <Link href="/auth/login">
              <button className="bg-[#366977] hover:bg-[#153943] rounded-md px-4 py-2 text-sm text-[#F1FBFB]">
                Login
              </button>
            </Link>
          ) : (
            <button
              className="bg-[#366977] hover:bg-[#153943] rounded-md px-4 py-2 text-sm text-[#F1FBFB]"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
          <Link href="/cart" className=''>
            <Image
              src="/assests/cart.svg"
              width={32}
              height={32}
              alt="cart"
              className="m-2 cursor-pointer rounded-md hover:bg-[#9d9b9b]"
            />
          </Link>
          <Link href="/buyedBooks">
            <Image
              src="/assests/book.svg"
              width={32}
              height={32}
              alt="book"
              className="m-2 cursor-pointer rounded-md hover:bg-[#9d9b9b]" />
          </Link>
        </div>
      </nav>

      {/* Popup Card-Style Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-[70px] right-4 w-[200px] bg-white shadow-lg rounded-lg z-50">
          <ul className="flex flex-col p-4 space-y-2">
            <li>
              <Link href="/sell">
                <button className="w-full text-left p-3 rounded-md hover:bg-[#9d9b9b] text-[#d80032] hover:text-[#a00028]">
                  <div className='flex items-center space-x-2'>
                    <Image src="/assests/sell.svg" width={20} height={20} alt="cart" />
                    <span>Sell</span>
                  </div>
                </button>
              </Link>
            </li>
            <li>
              {!isLoggedIn ? (
                <Link href="/auth/login">
                  <button className="w-full text-left p-2 rounded-md hover:bg-[#9d9b9b] text-[#366977] hover:text-[#1d4f61]">
                    <div className='flex items-center space-x-2'>
                      <Image src="/assests/login.svg" width={20} height={20} alt="cart" />
                      <span>Login</span>
                    </div>
                  </button>
                </Link>
              ) : (
                <button
                  className="w-full text-left p-3 rounded-md hover:bg-[#9d9b9b] text-[#366977] hover:text-[#1d4f61]"
                  onClick={handleLogout}
                >
                  <div className='flex items-center space-x-2'>
                    <Image src="/assests/logout.svg" width={20} height={20} alt="cart" />
                    <span>Logout</span>
                  </div>

                </button>
              )}
            </li>
            <li>
              <Link href="/cart">
                <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-[#9d9b9b] text-[#333] hover:text-[#555]">
                  <Image src="/assests/cart.svg" width={20} height={20} alt="cart" />
                  <span>Cart</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/buyedBooks">
                <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-[#9d9b9b] text-[#333] hover:text-[#555]">
                  <Image src="/assests/book.svg" width={20} height={20} alt="book" />
                  <span>books</span>
                </div>
              </Link>
            </li>

          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
