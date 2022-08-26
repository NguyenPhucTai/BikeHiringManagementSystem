import React, { useState, useEffect, Fragment } from "react";
import { AxiosInstance } from "../../api/AxiosClient";
import { Banner } from "../../components/Banner/Banner";
import { Footer } from "../../components/Footer/Footer";
import { ListSwiper } from "../../components/Swiper/Swiper";
import { BikeManagement } from "../../api/EndPoint";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const handleGetListBike = async (values, setListManual, setListAutomatic, categoryId) => {
    var paramsValue = {
        searchKey: values === null || values.searchKey === null ? null : values.searchKey,
        categoryId: categoryId === null ? 1 : categoryId,
        page: values === null || values.page === null ? 1 : values.page,
        limit: values === null || values.limit === null ? 7 : values.limit,
        sortBy: values === null || values.sortBy === null ? "name" : values.sortBy,
        sortType: values === null || values.sortType === null ? "ASC" : values.sortType,
    };
    await AxiosInstance.get(BikeManagement.get, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` },
        params: paramsValue,
    }).then((res) => {
        console.log(res)
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
            handleGetListBike(null, setListManual, setListAutomatic, 1);
            handleGetListBike(null, setListManual, setListAutomatic, 2);
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
            <Footer />
        </Fragment>
    )
}

export default Home;