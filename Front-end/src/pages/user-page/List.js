import React, { useState, useEffect, Fragment } from "react";
import { AxiosInstance } from "../../api/AxiosClient";
import SortBar from "../../components/Navbar/SortBar";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from "react-router-dom";
import { Firebase_URL, PublicAPI } from "../../api/EndPoint";
import Badge from 'react-bootstrap/Badge';
import { useSelector } from "react-redux";

const handleGetListBike = async (
    searchKey,
    categoryId,
    activePage,
    sortBy,
    sortType,
    setMaxPage,
    setListMotor,
    setLoadingPage) => {
    const body = {
        searchKey: searchKey,
        categoryId: categoryId,
        page: activePage,
        limit: 12,
        sortBy: sortBy,
        sortType: sortType,
    };
    // console.log(body)
    await AxiosInstance.post(PublicAPI.getBikePagination, body, {
        headers: {}
    }).then((res) => {
        var listMotor = res.data.data.content.map((data) => {
            return {
                id: data.id,
                name: data.name,
                bikeCategory: data.bikeCategoryName,
                price: data.price,
                filePath: data.imageList[0].filePath,
                fileName: data.imageList[0].fileName,
            }
        })
        setListMotor(listMotor)
        setMaxPage(res.data.data.totalPages)
        setLoadingPage(false)
    })
        .catch((error) => {
            if (error && error.response) {
                console.log("Error: ", error);
            }
        });
}

const List = props => {
    const [activePage, setActivePage] = useState(1);
    const [maxPage, setMaxPage] = useState(10);
    const [listMotor, setListMotor] = useState([]);
    const [loadingPage, setLoadingPage] = useState(true);
    const searchKey = useSelector((state) => state.redux.searchKey);
    const sortBy = useSelector((state) => state.redux.sortBy);
    const sortType = useSelector((state) => state.redux.sortType);
    const [categoryId, setCategoryId] = useState(null);

    const handleChangePage = (event, newPage) => {
        setActivePage(newPage);
    };

    useEffect(() => {
        switch (props.category) {
            case 1:
                setCategoryId(1);
                break;
            case 2:
                setCategoryId(2);
                break;
            default:
                setCategoryId(null);
                break;
        }
    }, [props.category])

    useEffect(() => {
        if (sortBy !== undefined && sortType !== undefined) {
            handleGetListBike(searchKey, categoryId, activePage, sortBy, sortType, setMaxPage, setListMotor, setLoadingPage);
        }
    }, [activePage, searchKey, categoryId])

    return (
        <Fragment>
            <div className="container">
                <Row>
                    <Col lg={12}>
                        <div className="container">
                            <h2 className="text-center">List Motorcycle</h2>
                            <SortBar />
                            {loadingPage ?
                                <div className="circular_progress">
                                    <CircularProgress />
                                </div> :
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
                            }
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
            </div>
        </Fragment>
    )
}

export default List;