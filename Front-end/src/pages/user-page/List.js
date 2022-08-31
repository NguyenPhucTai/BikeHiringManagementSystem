import React, { useState, useEffect, Fragment } from "react";
import { AxiosInstance } from "../../api/AxiosClient";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Pagination from '@mui/material/Pagination';
import { Link } from "react-router-dom";
import { Firebase_URL, BikeManagement } from "../../api/EndPoint"; 
import Badge from 'react-bootstrap/Badge';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const handleGetListBike = async (values, categoryId, activePage, setMaxPage, setListMotor) => {
    var paramsValue = {
        searchKey: values === null || values.searchKey === null ? null : values.searchKey,
        categoryId: categoryId === null ? 1 : categoryId,
        page: activePage,
        limit: values === null || values.limit === null ? 12 : values.limit,
        sortBy: values === null || values.sortBy === null ? "name" : values.sortBy,
        sortType: values === null || values.sortType === null ? "ASC" : values.sortType,
    };
    await AxiosInstance.get(BikeManagement.get, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` },
        params: paramsValue,
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
    })
        .catch((error) => {
            if (error && error.response) {
                console.log("Error: ", error);
            }
        });
}

function List() {
    const [activePage, setActivePage] = useState(1);
    const [maxPage, setMaxPage] = useState(10);
    const [listMotor, setListMotor] = useState([]);

    const handleChangePage = (event, newPage) => {
        setActivePage(newPage);
    };

    useEffect(() => {
        // console.log(activePage);
        handleGetListBike(null, null, activePage, setMaxPage, setListMotor);
    }, [activePage])

    return (
        <Fragment>
            <div className="container">
                <h2 className="text-center">List Motorcycle</h2>
                <Row>
                    {listMotor.map((data) => {
                        return (
                            <Col className="column" xs={12} sm={6} md={4} lg={3}>
                                <Link to={`/bike/${data.id}`}>
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
                    <Col className="column" xs={12} sm={6} md={4} lg={3}>
                        <Link to={`/bike/1`}>
                            <img src={Firebase_URL + "1-nouvo-black-1.jpg-yOwB5QazxX?alt=media&token=d34cbc3b-adca-414d-9cdc-ead45f6520ac"} alt="image1" />
                            <label className="bikeName">Bike 1</label>
                            <div className="bikeTag">
                                <Badge>Manual Transmission Motorcycle</Badge>
                            </div>
                            <p className="bikePrice">Price: <span>100k</span></p>
                        </Link>
                    </Col>
                    <Col className="column" xs={12} sm={6} md={4} lg={3}>
                        <Link to={`/bike/1`}>
                            <img src={Firebase_URL + "1-nouvo-black-1.jpg-yOwB5QazxX?alt=media&token=d34cbc3b-adca-414d-9cdc-ead45f6520ac"} alt="image1" />
                            <label className="bikeName">Bike 1</label>
                            <div className="bikeTag">
                                <Badge>Manual Transmission Motorcycle</Badge>
                            </div>
                            <p className="bikePrice">Price: <span>100k</span></p>
                        </Link>
                    </Col>
                    <Col className="column" xs={12} sm={6} md={4} lg={3}>
                        <Link to={`/bike/1`}>
                            <img src={Firebase_URL + "1-nouvo-black-1.jpg-yOwB5QazxX?alt=media&token=d34cbc3b-adca-414d-9cdc-ead45f6520ac"} alt="image1" />
                            <label className="bikeName">Bike 1</label>
                            <div className="bikeTag">
                                <Badge>Manual Transmission Motorcycle</Badge>
                            </div>
                            <p className="bikePrice">Price: <span>100k</span></p>
                        </Link>
                    </Col>
                    <Col className="column" xs={12} sm={6} md={4} lg={3}>
                        <Link to={`/bike/1`}>
                            <img src={Firebase_URL + "1-nouvo-black-1.jpg-yOwB5QazxX?alt=media&token=d34cbc3b-adca-414d-9cdc-ead45f6520ac"} alt="image1" />
                            <label className="bikeName">Bike 1</label>
                            <div className="bikeTag">
                                <Badge>Manual Transmission Motorcycle</Badge>
                            </div>
                            <p className="bikePrice">Price: <span>100k</span></p>
                        </Link>
                    </Col>
                    <Col className="column" xs={12} sm={6} md={4} lg={3}>
                        <Link to={`/bike/1`}>
                            <img src={Firebase_URL + "1-nouvo-black-1.jpg-yOwB5QazxX?alt=media&token=d34cbc3b-adca-414d-9cdc-ead45f6520ac"} alt="image1" />
                            <label className="bikeName">Bike 1</label>
                            <div className="bikeTag">
                                <Badge>Manual Transmission Motorcycle</Badge>
                            </div>
                            <p className="bikePrice">Price: <span>100k</span></p>
                        </Link>
                    </Col>
                    <Col className="column" xs={12} sm={6} md={4} lg={3}>
                        <Link to={`/bike/1`}>
                            <img src={Firebase_URL + "1-nouvo-black-1.jpg-yOwB5QazxX?alt=media&token=d34cbc3b-adca-414d-9cdc-ead45f6520ac"} alt="image1" />
                            <label className="bikeName">Bike 1</label>
                            <div className="bikeTag">
                                <Badge>Manual Transmission Motorcycle</Badge>
                            </div>
                            <p className="bikePrice">Price: <span>100k</span></p>
                        </Link>
                    </Col>
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
        </Fragment>
    )
}

export default List;