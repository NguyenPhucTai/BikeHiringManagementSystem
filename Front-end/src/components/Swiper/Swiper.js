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
                breakpoints={{
                    // when window width is >= 270px
                    270: {
                        slidesPerView: 1,
                    },
                    // when window width is >= 768px
                    768: {
                        slidesPerView: 2,
                    },
                    // when window width is >= 992px
                    992: {
                        slidesPerView: 3,
                    },
                    // when window width is >= 1200px
                    1200: {
                        slidesPerView: 4,
                    },
                }}
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
                            <Link className="card-item" to={`/bike/${data.id}`}>
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
                    <Link className="card-item" to={`/bike/1`}>
                        <img src={Firebase_URL + "1-nouvo-black-1.jpg-yOwB5QazxX?alt=media&token=d34cbc3b-adca-414d-9cdc-ead45f6520ac"} alt="image1" />
                        <label className="bikeName">Bike 1</label>
                        <div className="bikeTag">
                            <Badge>Manual Transmission Motorcycle</Badge>
                        </div>
                        <p className="bikePrice">Price: <span>100k</span></p>
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link className="card-item" to={`/bike/2`}>
                        <img src={Firebase_URL + "1-nouvo-black-1.jpg-yOwB5QazxX?alt=media&token=d34cbc3b-adca-414d-9cdc-ead45f6520ac"} alt="image1" />
                        <label className="bikeName">Bike 2</label>
                        <div className="bikeTag">
                            <Badge>Manual Transmission Motorcycle</Badge>
                        </div>
                        <p className="bikePrice">Price: <span>100k</span></p>
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link className="card-item" to={`/bike/3`}>
                        <img src={Firebase_URL + "1-nouvo-black-1.jpg-yOwB5QazxX?alt=media&token=d34cbc3b-adca-414d-9cdc-ead45f6520ac"} alt="image1" />
                        <label className="bikeName">Bike 3</label>
                        <div className="bikeTag">
                            <Badge>Manual Transmission Motorcycle</Badge>
                        </div>
                        <p className="bikePrice">Price: <span>100k</span></p>
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link className="card-item" to={`/bike/4`}>
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