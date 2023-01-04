import React, { Fragment, useState, useEffect } from "react";

// Library
import { AxiosInstance } from "../../api/AxiosClient";
import { Formik, Form } from "formik";
import Cookies from 'universal-cookie';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

// Firebase
import { storage } from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Component
import { TextField } from "../../components/Form/TextField";
import { Firebase_URL, BikeManagement } from "../../api/EndPoint";
import { PageLoad } from '../../components/Base/PageLoad';
import { Popup } from '../../components/Modal/Popup';
import { AlertMessage } from '../../components/Modal/AlertMessage';

const cookies = new Cookies();

// FUNCTION
// INTERNAL PAGE
const showAlert = (setAlert, message, isSuccess) => {
    if (isSuccess) {
        setAlert({
            alertShow: true,
            alertStatus: "success",
            alertMessage: message
        })
    } else {
        setAlert({
            alertShow: true,
            alertStatus: "error",
            alertMessage: message
        })
    }
}

// FUNCTION
// CALL API
const handleGetBikeById = async (id, setData) => {

    await AxiosInstance.get(BikeManagement.getById + id, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        if (res.data.code === 1) {
            setData(res.data.data);
        }
    }).catch((error) => {
        if (error && error.response) {
            console.log("Error: ", error);
        }
    });
};


function ManageBikeDetail() {

    // GET ID FROM URL
    let { id } = useParams()

    // Render page
    const navigate = useNavigate();

    // INITIALIZE USE STATE
    // VARIABLE
    // PAGE LOADING
    const [loadingData, setLoadingData] = useState(true);

    // VARIABLE
    // GET DETAIL
    const [data, setData] = useState({});

    // VARIABLE
    // LOADING BAR
    const [loading, setLoading] = useState(false);

    // VARIABLE
    // DELETE POPUP
    const [showPopup, setShowPopup] = useState(false);
    const [showCloseButton, setShowCloseButton] = useState(false);
    const [alert, setAlert] = useState({
        alertShow: false,
        alertStatus: "success",
        alertMessage: "",
    })

    // Formik variables
    const initialValues = {
        bikeName: "",
        bikeManualId: "",
        bikeNo: "",
        bikeCategory: "",
        bikeColor: "",
        bikeManufacturer: "",
        hiredNumber: 0,
        status: "",
        createdUser: "",
        createdDate: "",
        modifiedUser: "",
        modifiedDate: "",
    };

    // USE EFFECT
    // PAGE LOADING
    useEffect(() => {
        if (loadingData) {
            handleGetBikeById(id, setData);
            setLoadingData(false)
        }
    }, [loadingData])

    // Update initialValues
    if (Object.keys(data).length !== 0) {
        initialValues.bikeManualId = data.bikeManualId;
        initialValues.bikeName = data.name;
        initialValues.bikeNo = data.bikeNo;
        initialValues.bikeCategory = data.bikeCategoryName;
        initialValues.bikeManufacturer = data.bikeManufacturerName;
        initialValues.bikeColor = data.bikeColor;
        initialValues.hiredNumber = data.hiredNumber;
        initialValues.status = data.status;
        initialValues.createdUser = data.createdUser;
        initialValues.createdDate = data.createdDate;
        initialValues.modifiedUser = data.modifiedUser ? data.modifiedUser : "N/A";
        initialValues.modifiedDate = data.modifiedDate ? data.modifiedDate : "N/A";
    }

    // POPUP INTERFACE
    let deletePopup =
        <Popup showPopup={showPopup} setShowPopup={setShowPopup} title={"Delete Bike " + data.bikeManualId} child={
            showCloseButton ?
                < Fragment >
                    <AlertMessage
                        isShow={alert.alertShow}
                        message={alert.alertMessage}
                        status={alert.alertStatus}
                    />
                    <div className="popup-button">
                        <button className="btn btn-secondary btn-cancel"
                            onClick={() => {
                                setShowPopup(false);
                                setShowCloseButton(false);
                                setAlert({ alertShow: false });
                            }}>Close</button>
                    </div>
                </ Fragment>
                :
                <Fragment>
                    <div className='popup-message text-center mb-3'>
                        <label>Do you really want to delete this record?</label>
                        <p>This process cannot be undone</p>
                    </div>
                    <div className="popup-button">
                        <button className="btn btn-danger btn-action">DELETE</button>
                        <button className="btn btn-secondary btn-cancel"
                            onClick={() => {
                                setShowPopup(false);
                            }}>Cancel</button>
                    </div>
                </Fragment >
        } />

    return (
        !loadingData ?
            <div className="container">
                {deletePopup}
                <h1 className="text-center">BIKE DETAIL</h1>
                {loading && (
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>
                )}
                <div className="button-section" style={{ textAlign: "right" }}>
                    <button className="btn btn-primary" style={{ marginLeft: "16px" }} onClick={() => navigate('/manage/bike/update/' + id)}>UPDATE</button>
                    <button className="btn btn-danger" style={{ marginLeft: "16px" }} onClick={() => setShowPopup(true)}>DELETE</button>
                </div>
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                >
                    {({
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        errors,
                        touched,
                        setFieldValue,
                    }) => (
                        <Form className="d-flex flex-column">
                            <Row>
                                <Col xs={12} sm={6}>
                                    <TextField
                                        label={"Bike Manual Id"}
                                        name={"bikeManualId"}
                                        type={"text"}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <TextField
                                        label={"Bike Name"}
                                        name={"bikeName"}
                                        type={"text"}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <TextField
                                        label={"Bike No"}
                                        name={"bikeNo"}
                                        type={"text"}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <TextField
                                        label={"Bike Category"}
                                        name={"bikeCategory"}
                                        type={"text"}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <TextField
                                        label={"Bike Manufacturer"}
                                        name={"bikeManufacturer"}
                                        type={"text"}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <TextField
                                        label={"Bike Color"}
                                        name={"bikeColor"}
                                        type={"text"}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <TextField
                                        label={"Hired Number"}
                                        name={"hiredNumber"}
                                        type={"text"}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <TextField
                                        label={"Status"}
                                        name={"status"}
                                        type={"text"}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <TextField
                                        label={"Create User"}
                                        name={"createdUser"}
                                        type={"text"}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <TextField
                                        label={"Create Date"}
                                        name={"createdDate"}
                                        type={"text"}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <TextField
                                        label={"Modified User"}
                                        name={"modifiedUser"}
                                        type={"text"}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <TextField
                                        label={"Modified Date"}
                                        name={"modifiedDate"}
                                        type={"text"}
                                    />
                                </Col>
                                <label className='form-label'>Bike Images</label>
                                {Object.keys(data).length !== 0 ?
                                    data.imageList.map((value) => {
                                        return (
                                            <Col xs={12} sm={6} md={4} lg={3}>
                                                <div className="card-item">
                                                    <img src={Firebase_URL + value.filePath} alt={value.fileName} />
                                                </div>
                                            </Col>
                                        )
                                    })
                                    :
                                    <div></div>
                                }
                            </Row>
                        </Form>
                    )}
                </Formik>

            </div >
            :
            <Fragment>
                <PageLoad />
            </Fragment>
    )
}
export default ManageBikeDetail;