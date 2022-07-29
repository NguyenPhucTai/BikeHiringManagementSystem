import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation } from "swiper";
import { Firebase_URL } from "../../api/EndPoint";
import Badge from 'react-bootstrap/Badge';

export const ListSwiper = ({ listBike, ...props }) => {
    return (
        <div className="listSwiper">
            <Swiper
                slidesPerView={3}
                loop={true}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="mySwiper"
            >
                {listBike.map((data) => {
                    <Link to={"/bike/" + data.id}>
                        <SwiperSlide>
                            <img src={Firebase_URL + data.filePath} alt={data.fileName} />
                            <label className="bikeName">{data.name}</label>
                            <div className="bikeTag">
                                <Badge bg="secondary">{data.bikeCategory}</Badge>
                            </div>
                            <p className="bikePrice">Price: <span>{data.price}</span></p>
                        </SwiperSlide>
                    </Link>
                })}
                <SwiperSlide>
                    <img src={Firebase_URL + "download%20(1).jpg-dp8Bn82xzQ?alt=media&token=40d7d5e6-40c6-4d6f-a6bf-c036fbe87c3b"} alt="image1" />
                    <label className="bikeName">Bike 1</label>
                    <div className="bikeTag">
                        <Badge bg="secondary">Manual Transmission Motorcycle</Badge>
                    </div>
                    <p className="bikePrice">Price: <span>100k</span></p>
                </SwiperSlide>
            </Swiper>
        </div>
    )
}