import { Swiper, SwiperSlide } from "swiper/react"
import Image from 'next/image'

import "swiper/css"
import { Autoplay, Navigation, Pagination } from "swiper/modules"

const Banner = () => {
    return (
        <div className="banner">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                loop={true}
                autoplay={{ delay: 3000 }}
                pagination={{ clickable: true }}
            >
                <SwiperSlide>
                    <Image src={"/assests/banner1.webp"} alt=""
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: '100%', height: '74.5vh' }}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={"/assests/banner2.webp"} alt=""
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: '100%', height: '74.5vh' }}
                    />
                </SwiperSlide>
            </Swiper>
        </div>
    )
}

export default Banner