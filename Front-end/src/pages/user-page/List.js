import React, { useState, useEffect, Fragment } from "react";
import { AxiosInstance } from "../../api/AxiosClient";
import { FilterSide } from "../../components/Navbar/FilterSide";
import SortBar from "../../components/Navbar/SortBar";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Pagination from '@mui/material/Pagination';
import { Link } from "react-router-dom";
import { Firebase_URL, BikeManagement } from "../../api/EndPoint";
import Badge from 'react-bootstrap/Badge';
import Cookies from 'universal-cookie';
import { useSelector } from "react-redux";

const cookies = new Cookies();

const handleGetListBike = async (
    searchKey,
    categoryId,
    activePage,
    sortBy,
    sortType,
    setMaxPage,
    setListMotor) => {
    const body = {
        searchKey: searchKey,
        categoryId: categoryId,
        page: activePage,
        limit: 12,
        sortBy: sortBy,
        sortType: sortType,
    };
    // console.log(body)
    await AxiosInstance.post(BikeManagement.get, body,{
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        var listMotor = res.data.data.content.map((data) => {
            return {
                id: data.id,
                name: data.name,
                bikeCategory: data.categoryName,
                price: data.price,
                filePath: data.imageList[0].filePath,
                fileName: data.imageList[0].fileName,
            }
        })
        setListMotor(listMotor)
        setMaxPage(res.data.data.totalPages);
    })
        .catch((error) => {
            if (error && error.response) {
                console.log("Error: ", error);
            }
        });
}

const handleGetColor = async (setListColor) => {
    const body = {
        searchKey: null,
        page: 1,
        limit: 100,
        sortBy: "name",
        sortType: "ASC"
    };
    await AxiosInstance.post(BikeManagement.getColor, body, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` },
    }).then((res) => {
        var listColor = res.data.data.content.map((data) => {
            return {
                value: data.id,
                label: data.name,
                key: data.id,
            }
        })
        setListColor(listColor)
    })
        .catch((error) => {
            if (error && error.response) {
                console.log("Error: ", error);
            }
        });
};

const handleGetManufacturer = async (setListManufacturer) => {
    const body = {
        searchKey: null,
        page: 1,
        limit: 100,
        sortBy: "name",
        sortType: "ASC"
    };
    await AxiosInstance.post(BikeManagement.getManufacturer, body, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        var listManufacturer = res.data.data.content.map((data) => {
            return {
                value: data.id,
                label: data.name,
                key: data.id,
            }
        })
        setListManufacturer(listManufacturer)
    })
        .catch((error) => {
            if (error && error.response) {
                console.log("Error: ", error);
            }
        });
};

function List() {
    const [activePage, setActivePage] = useState(1);
    const [maxPage, setMaxPage] = useState(10);
    const [listMotor, setListMotor] = useState([]);
    const [listColor, setListColor] = useState([]);
    const [listManufacturer, setListManufacturer] = useState([]);
    const [loadingPage, setLoadingPage] = useState(true);
    const searchKey = useSelector((state) => state.listBike.searchKey);
    const sortBy = useSelector((state) => state.listBike.sortBy);
    const sortType = useSelector((state) => state.listBike.sortType);

    const handleChangePage = (event, newPage) => {
        setActivePage(newPage);
    };

    useEffect(() => {
        if (loadingPage) {
            handleGetColor(setListColor);
            handleGetManufacturer(setListManufacturer)
            setLoadingPage(false)
        }
    }, [loadingPage])

    useEffect(() => {
        if (sortBy != undefined && sortType != undefined) {
            handleGetListBike(searchKey, null, activePage, sortBy, sortType, setMaxPage, setListMotor);
        }
    }, [activePage, searchKey, sortBy, sortType])

    return (
        <Fragment>
            <Row>
                <Col lg={2} className="filter-side" style={{backgroundColor: "coral"}}>
                    <div className="container">
                        <FilterSide listColor={listColor} listManufacturer={listManufacturer} />
                    </div>
                </Col>
                <Col lg={10}>
                    <div className="container">
                        <h2 className="text-center">List Motorcycle</h2>
                        <SortBar />
                        <Row>
                            {listMotor.map((data) => {
                                return (
                                    <Col className="column" xs={12} sm={6} md={4} lg={3}>
                                        <Link className="card-item" to={`/bike/${data.id}`}>
                                            <img src={Firebase_URL + data.filePath} alt={data.fileName} />
                                            <label className="bikeName">{data.name}</label>
                                            <div className="bikeTag">
                                                <Badge>{data.bikeCategory}</Badge>
                                            </div>
                                            <p className="bikePrice">Price: <span>{data.price}</span></p>
                                        </Link>
                                    </Col>
                                )
                            })}
                        </Row>
                        <Pagination
                            count={maxPage}
                            shape="rounded"
                            size="large"
                            defaultPage={1}
                            showFirstButton
                            showLastButton
                            page={activePage}
                            onChange={handleChangePage} />
                    </div>
                </Col>
            </Row>
        </Fragment>
    )
}

export default List;