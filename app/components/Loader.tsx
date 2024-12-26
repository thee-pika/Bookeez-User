import React from 'react'
import Image from 'next/image'
const Loader = () => {
    return (
        <>
            <div className='loader'>
                <Image
                    src={"/assests/loader.gif"}
                    width={300}
                    height={300}
                    objectFit='cover'
                    alt=''
                />
            </div>

        </>
    )
}

export default Loader