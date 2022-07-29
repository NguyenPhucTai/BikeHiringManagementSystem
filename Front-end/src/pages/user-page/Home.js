import React, { useState, useEffect } from "react";
import { AxiosInstance } from "../../api/AxiosClient";
import { Banner } from "../../components/Banner/Banner";
import { ListSwiper } from "../../components/Swiper/Swiper";
import { BikeManagement } from "../../api/EndPoint";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const handleGetListBikeManual = async (values, setListManual) => {
    const paramsValue = {
        searchKey: values === null || values.searchKey === null ? 1 : values.searchKey,
        page: values === null || values.page === null ? 1 : values.page,
        limit: values === null || values.limit === null ? 7 : values.limit,
        sortBy: values === null || values.sortBy === null ? "bikeCategory" : values.sortBy,
        sortType: values === null || values.sortType === null ? "DESC" : values.sortType,
    };
    await AxiosInstance.get(BikeManagement.get, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` },
        params: paramsValue,
    }).then((res) => {
        var listManualBike = res.data.data.content.map((data) => {
            return {
                id: data.id,
                name: data.name,
                bikeCategory: data.bikeCategory,
                price: data.price,
                filePath: data.file[0].filePath,
                fileName: data.file[0].fileName,
            }
        })
        setListManual(listManualBike)
    })
        .catch((error) => {
            if (error && error.response) {
                console.log("Error: ", error);
            }
        });
}

function Home() {
    const [listManual, setListManual] = useState([]);
    // const [listAutomatic, setListAutomatic] = useState([]);
    const [loadingPage, setLoadingPage] = useState(true);

    useEffect(() => {
        if (loadingPage) {
            handleGetListBikeManual(setListManual);
            // handleGetListBikeAutomatic(setListAutomatic);
            setLoadingPage(false);
        }
    }, [loadingPage])

    return (
        <div className="container">
            <h1 className="text-center">Rent Motorcycles</h1>
            <Banner />
            <h2 className="text-center">Manual Transmission Motorcycle</h2>
            <ListSwiper listBike={listManual} />
            <h2 className="text-center">Automatic Transmission Motorcycle</h2>
            {/* <ListSwiper listBike={listAutomatic} /> */}
        </div>
    )
}

export default Home;