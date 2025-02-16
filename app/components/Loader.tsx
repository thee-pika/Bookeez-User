import React from 'react'
import Image from 'next/image'
const Loader = () => {
    return (
        <>
            <div className='loader h-[77.55vh]'>
                <Image
                    src={"/assests/loader.gif"}
                    width={200}
                    height={100}
                    objectFit='cover'
                    alt=''
                />
            </div>
        </>
    )
}

export default Loader;