import React, { useState, useEffect, Fragment } from "react";
import { AxiosInstance } from "../../api/AxiosClient";
import { Banner } from "../../components/Banner/Banner";
import { ListSwiper } from "../../components/Swiper/Swiper";
import { BikeManagement } from "../../api/EndPoint";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const handleGetListBike = async (categoryId, setListManual, setListAutomatic) => {
    const body = {
        searchKey: null,
        categoryId: categoryId,
        page: 1,
        limit: 7,
        sortBy: "name",
        sortType: "ASC",
    };
    await AxiosInstance.post(BikeManagement.get, body, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    })
        .then((res) => {
            var listBike = res.data.data.content.map((data) => {
                return {
                    id: data.id,
                    name: data.name,
                    bikeCategory: data.categoryName,
                    price: data.price,
                    filePath: data.imageList[0].filePath,
                    fileName: data.imageList[0].fileName,
                }
            })
            if (categoryId === 1) {
                setListAutomatic(listBike)
            } else {
                setListManual(listBike)
            }
        })
        .catch((error) => {
            if (error && error.response) {
                console.log("Error: ", error);
            }
        });
}

function Home() {
    const [listManual, setListManual] = useState([]);
    const [listAutomatic, setListAutomatic] = useState([]);
    const [loadingPage, setLoadingPage] = useState(true);

    useEffect(() => {
        if (loadingPage) {
            handleGetListBike(1, setListManual, setListAutomatic);
            handleGetListBike(2, setListManual, setListAutomatic);
            setLoadingPage(false);
        }
    }, [loadingPage])

    return (
        <Fragment>
            <Banner />
            <div className="container">
                <h2 className="text-center">Manual Transmission Motorcycle</h2>
                <ListSwiper listBike={listManual} />
                <h2 className="text-center">Automatic Transmission Motorcycle</h2>
                <ListSwiper listBike={listAutomatic} />
            </div>
        </Fragment>
    )
}

export default Home;