import React from 'react'
import "../styles/layout.css"
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <div className='footer h-[92px]  flex flex-col justify-evenly  absolute items-center bg-[#366977]'>
      <div className="socials flex ">
        <div>
          <Link href={"/"}>
          <Image
            src={"/assests/google.svg"}
            width={30}
            height={30}
            alt='google'
          />
          </Link>
          
        </div>
        <div className='pl-4 pr-4'>
          <Link href={"/"}>
            <Image
              src={"/assests/github.svg"}
              width={30}
              height={30}
              alt='github'
            />
          </Link>
        </div>
        <div>
          <Link href={"/"}>
          <Image
            src={"/assests/linkedin.svg"}
            width={30}
            height={30}
            alt='linkedin'
          />
          </Link>

        </div>
      </div>
      <div className="copyright">
        Copyright © 2024 . Bookeez.com . All Rights Reserved
      </div>
    </div>
  )
}

export default Footer;