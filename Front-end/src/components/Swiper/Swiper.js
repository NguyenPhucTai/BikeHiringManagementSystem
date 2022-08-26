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
                slidesPerView={4}
                loop={true}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="mySwiper"
            >
                {listBike.map((data) => {
                    return (
                        <SwiperSlide>
                            <Link to={`/bike/${data.id}`}>
                                <img src={Firebase_URL + data.filePath} alt={data.fileName} />
                                <label className="bikeName">{data.name}</label>
                                <div className="bikeTag">
                                    <Badge>{data.bikeCategory}</Badge>
                                </div>
                                <p className="bikePrice">Price: <span>{data.price}</span></p>
                            </Link>
                        </SwiperSlide>
                    )
                })}
                <SwiperSlide>
                    <Link to={`/bike/1`}>
                        <img src={Firebase_URL + "1-nouvo-black-1.jpg-yOwB5QazxX?alt=media&token=d34cbc3b-adca-414d-9cdc-ead45f6520ac"} alt="image1" />
                        <label className="bikeName">Bike 1</label>
                        <div className="bikeTag">
                            <Badge>Manual Transmission Motorcycle</Badge>
                        </div>
                        <p className="bikePrice">Price: <span>100k</span></p>
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link to={`/bike/2`}>
                        <img src={Firebase_URL + "1-nouvo-black-1.jpg-yOwB5QazxX?alt=media&token=d34cbc3b-adca-414d-9cdc-ead45f6520ac"} alt="image1" />
                        <label className="bikeName">Bike 2</label>
                        <div className="bikeTag">
                            <Badge>Manual Transmission Motorcycle</Badge>
                        </div>
                        <p className="bikePrice">Price: <span>100k</span></p>
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link to={`/bike/3`}>
                        <img src={Firebase_URL + "1-nouvo-black-1.jpg-yOwB5QazxX?alt=media&token=d34cbc3b-adca-414d-9cdc-ead45f6520ac"} alt="image1" />
                        <label className="bikeName">Bike 3</label>
                        <div className="bikeTag">
                            <Badge>Manual Transmission Motorcycle</Badge>
                        </div>
                        <p className="bikePrice">Price: <span>100k</span></p>
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link to={`/bike/4`}>
                        <img src={Firebase_URL + "1-nouvo-black-1.jpg-yOwB5QazxX?alt=media&token=d34cbc3b-adca-414d-9cdc-ead45f6520ac"} alt="image1" />
                        <label className="bikeName">Bike 4</label>
                        <div className="bikeTag">
                            <Badge>Manual Transmission Motorcycle</Badge>
                        </div>
                        <p className="bikePrice">Price: <span>100k</span></p>
                    </Link>
                </SwiperSlide>
            </Swiper>
        </div>
    )
}