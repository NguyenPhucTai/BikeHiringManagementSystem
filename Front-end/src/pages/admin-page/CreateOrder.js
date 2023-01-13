import React, { Fragment, useState, useEffect, useRef } from "react";

// Library
import { AxiosInstance } from "../../api/AxiosClient";
import { Formik, Form } from "formik";
import { DropzoneArea } from "material-ui-dropzone";
import { BikeSchema } from "../../validation";
import Cookies from 'universal-cookie';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


// Component
import { AlertMessage } from "../../components/Modal/AlertMessage";
import { TextField } from "../../components/Form/TextField";
import { SelectField } from "../../components/Form/SelectField";
import { OrderManagement } from "../../api/EndPoint";
import { PageLoad } from '../../components/Base/PageLoad';
import { Popup } from '../../components/Modal/Popup';

// Redux
import { useDispatch } from "react-redux";
import { reduxAuthenticateAction } from "../../redux-store/redux/reduxAuthenticate.slice";

const cookies = new Cookies();

function CreateOrder() {

    // Show Public Navigation
    const dispatch = useDispatch();
    const [loadingPage, setLoadingPage] = useState(true);
    if (loadingPage === true) {
        dispatch(reduxAuthenticateAction.updateIsShowPublicNavBar(false));
        setLoadingPage(false);
    }

    // Render page
    const navigate = useNavigate();

    // VARIABLE
    // CART
    const [data, setData] = useState({});
    const [formData, setFormData] = useState({});

    // VARIABLE
    // PAGE LOADING
    const [loadingData, setLoadingData] = useState(true);

    // VARIABLE
    // ALERT MESSAGE
    const [alert, setAlert] = useState({
        alertShow: false,
        alertStatus: "success",
        alertMessage: "",
    })

    // VARIABLE
    // POPUP
    const [showPopup, setShowPopup] = useState(false);
    const [showCloseButton, setShowCloseButton] = useState(false);

    // Formik variables
    const initialValues = {
        bikeName: "",
        bikeManualId: "",
        bikeNo: "",
        bikeCategory: 0,
        bikeColor: 0,
        bikeManufacturer: 0,
        files: [{}],
    };

    // USE EFFECT
    // PAGE LOADING
    useEffect(() => {
        if (loadingData) {
            setLoadingData(false)
        }
    }, [loadingData])

    // USE EFFECT
    // Update initialValues
    if (Object.keys(data).length !== 0) {
        // initialValues.bikeManualId = data.bikeManualId;
    }

    let popup = <Popup showPopup={showPopup} setShowPopup={setShowPopup}
        child={
            <Fragment>
                <AlertMessage
                    isShow={alert.alertShow}
                    message={alert.alertMessage}
                    status={alert.alertStatus}
                />
                <div className="popup-button">
                    {alert.alertStatus === "success" ?
                        <button className="btn btn-secondary btn-cancel"
                            onClick={() => {
                                setShowPopup(false);
                                navigate('/manage/bike/' + data.id);
                            }}>Close</button>
                        :
                        <button className="btn btn-secondary btn-cancel"
                            onClick={() => {
                                setShowPopup(false);
                            }}>Close</button>}
                </div>
            </Fragment >
        }
    />

    return (
        !loadingData ?
            <Fragment>
                {popup}
                <div className="container">
                    <h1 className="text-center">UPDATE BIKE</h1>
                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        validationSchema={BikeSchema}
                        onSubmit={(values) => {
                            setAlert({
                                alertShow: false,
                                alertStatus: "success",
                            })
                            setFormData({
                                id: data.id,
                                status: data.status,
                                hiredNumber: data.hiredNumber,
                                bikeName: values.bikeName,
                                bikeManualId: values.bikeManualId,
                                bikeNo: values.bikeNo,
                                bikeCategory: values.bikeCategory,
                                bikeColor: values.bikeColor,
                                bikeManufacturer: values.bikeManufacturer,
                                files: [{}]
                            })
                        }}>
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
                                <Row className="mb-3">
                                    <Col xs={12} sm={6}>
                                        <TextField
                                            label={"Bike Manual Id"}
                                            name={"bikeManualId"}
                                            type={"text"}
                                            placeholder={"Enter the bike manual id"}
                                        />
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <TextField
                                            label={"Bike Name"}
                                            name={"bikeName"}
                                            type={"text"}
                                            placeholder={"Enter the bike name"}
                                        />
                                    </Col>
                                    <button type="submit" className="btn btn-dark btn-md mt-3">
                                        Submit
                                    </button>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Fragment >
            :
            <Fragment>
                <PageLoad />
            </Fragment>
    )
}

export default CreateOrder;