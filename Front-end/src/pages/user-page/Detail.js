import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import { AxiosInstance } from "../../api/AxiosClient";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CircularProgress from '@mui/material/CircularProgress';
import { Firebase_URL, PublicAPI } from "../../api/EndPoint";
import ImageGallery from "react-image-gallery";
import Badge from 'react-bootstrap/Badge';
import Cookies from 'universal-cookie';
import { green } from "@mui/material/colors";
import { PageLoad } from "../../components/Base/PageLoad";

const cookies = new Cookies();

const handleBikeDetail = async (id, setBikeDetail, setListImage, setLoadingData, Firebase_URL) => {
    await AxiosInstance.get(PublicAPI.getBikeDetail + id, {
        headers: {}
    }).then((res) => {
        var bikeDetail = {
            name: res.data.data.name,
            bikeNo: res.data.data.bikeNo,
            bikeCategoryName: res.data.data.bikeCategoryName,
            bikeColor: res.data.data.bikeColor,
            bikeManufacturerName: res.data.data.bikeManufacturerName,
            status: res.data.data.status,
            price: res.data.data.price
        }
        var listImage = res.data.data.imageList
        var listLinkImage = []
        listImage.forEach(e => {
            var image = {
                original: Firebase_URL + e.filePath,
                thumbnail: Firebase_URL + e.filePath
            }
            listLinkImage.push(image)
        });
        setListImage(listLinkImage);
        setBikeDetail(bikeDetail);
        setLoadingData(false);
    }).catch((error) => {
        if (error && error.response) {
            console.log("Error: ", error);
        }
    });
}

const Detail = props => {
    let { id } = useParams()
    const [loadingData, setLoadingData] = useState(true);
    const [listImage, setListImage] = useState([]);
    const [bikeDetail, setBikeDetail] = useState({});

    useEffect(() => {
        if (loadingData) {
            handleBikeDetail(id, setBikeDetail, setListImage, setLoadingData, Firebase_URL);
        }
    }, [loadingData])

    return (
        !loadingData ?
            <Fragment>
                <div className="container">
                    {loadingData ?
                        <div className="circular_progress circular_progress_detail">
                            <CircularProgress />
                        </div> :
                        <Row>
                            <Col lg={6} xs={12}>
                                <ImageGallery
                                    showPlayButton={false}
                                    thumbnailPosition={"right"}
                                    items={listImage}
                                />
                            </Col>
                            <Col lg={6} xs={12} className="public">
                                <div className="detail-header">
                                    <h2 className="bikeName">{bikeDetail.name}</h2>
                                    <Badge>{bikeDetail.bikeCategoryName}</Badge>
                                </div>
                                <div className="detail-body">
                                    <Row>
                                        <Col lg={3} xs={6}><label className="body-title">Bike No:</label></Col>
                                        <Col lg={9} xs={6}><label>{bikeDetail.bikeNo}</label></Col>
                                        <Col lg={3} xs={6}><label className="body-title">Bike Color:</label></Col>
                                        <Col lg={9} xs={6}><label>{bikeDetail.bikeColor}</label></Col>
                                        <Col lg={3} xs={6}><label className="body-title">Bike Manufacturer:</label></Col>
                                        <Col lg={9} xs={6}><label>{bikeDetail.bikeManufacturerName}</label></Col>
                                        <Col lg={3} xs={6}><label className="body-title">Status:</label></Col>
                                        <Col lg={9} xs={6}>{bikeDetail.status === "AVAILABLE" ?
                                            <label style={{ color: 'green' }}>{bikeDetail.status}</label> :
                                            <label style={{ color: 'red' }}>{bikeDetail.status}</label>}
                                        </Col>
                                    </Row>
                                </div>
                                <div className="detail-footer">
                                    <h3 className="bikePrice">{bikeDetail.price}</h3>
                                </div>
                                {/* <label className="bikeName">{bikeDetail.name}</label>
                            <div className="bikeTag">
                                <Badge>{bikeDetail.bikeCategory}</Badge>
                            </div>
                            <p className="bikePrice">Price: <span>{bikeDetail.price}</span></p> */}
                            </Col>
                        </Row>
                    }
                </div>
            </Fragment>
            :
            <Fragment>
                <PageLoad />
            </Fragment>
    )
}

export default Detail;