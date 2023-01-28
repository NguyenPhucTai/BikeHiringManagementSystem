import React, { Fragment, useState, useEffect, useRef } from "react";

// Library
import { AxiosInstance } from "../../api/AxiosClient";
import { Formik, Form } from 'formik';
import { OrderSchema } from "../../validation";
import Cookies from 'universal-cookie';
import LinearProgress from '@mui/material/LinearProgress';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';
import { Radio, RadioGroup, FormControlLabel, Button, Box } from "@mui/material";

// Library - date time
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';


// Component
import { AlertMessage } from "../../components/Modal/AlertMessage";
import { TextFieldCustom } from "../../components/Form/TextFieldCustom";
import { TextAreaCustom } from "../../components/Form/TextAreaCustom";
import { SelectField } from "../../components/Form/SelectField";
import { OrderManagement } from "../../api/EndPoint";
import { PageLoad } from '../../components/Base/PageLoad';
import { Popup } from '../../components/Modal/Popup';
import { TableDelete } from "../../components/Table/TableDelete";

// Redux
import { useDispatch } from "react-redux";
import { reduxAuthenticateAction } from "../../redux-store/redux/reduxAuthenticate.slice";

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



function ManageMaintainCreate() {

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
    // TRIGGER
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCalculateCost, setIsCalculateCost] = useState(false);

    // DATA
    const [data, setData] = useState({})
    const [date, setDate] = useState(null);

    // VARIABLE
    // PAGE LOADING
    const [loadingData, setLoadingData] = useState(true);
    const [isRunLinear, setIsRunLinear] = useState(false);

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


    // VARIABLE
    // FORMIK
    const formikRef = useRef(null);
    const initialValues = {
        type: "",
        title: "",
        description: "",
        listBikeId: "",
        cost: 0,
    }



    // USE EFFECT
    // PAGE LOADING
    useEffect(() => {
        if (loadingData === true) {
            console.log("load data")
            setLoadingData(false)
        }
    }, [loadingData])

    // USE EFFECT
    // HANDLING SUBMIT FORM
    useEffect(() => {
        if (isSubmitting === true) {
            console.log("Submit form")
        }
    }, [isSubmitting])


    let popup = <Popup showPopup={showPopup} setShowPopup={setShowPopup}
        child={
            <Fragment>
                <AlertMessage
                    isShow={alert.alertShow}
                    message={alert.alertMessage}
                    status={alert.alertStatus}
                />
                {isSubmitting === false ?
                    <div className="popup-button">
                        <button className="btn btn-secondary btn-cancel"
                            onClick={() => {
                                setShowPopup(false);
                            }}>Close</button>
                    </div>
                    :
                    <div className="popup-button">
                        <button className="btn btn-secondary btn-cancel"
                            onClick={() => {
                                navigate('/manage/order')
                            }}>Close</button>
                    </div>
                }
            </Fragment >
        }
    />

    return (
        !loadingData ?
            <Fragment>
                {popup}
                <div className="container">
                    <h1 className="text-center">CREATE MAINTAIN</h1>
                    <Formik
                        innerRef={formikRef}
                        enableReinitialize
                        initialValues={initialValues}
                        // validationSchema={OrderSchema}
                        onSubmit={(values) => {
                            console.log("Submit");
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
                                    <Col xs={12} sm={12}>
                                        <TextFieldCustom
                                            label={"Title"}
                                            name={"title"}
                                            type={"text"}
                                            placeholder={"Enter the title"}
                                        />
                                    </Col>

                                    <Row className="mb-3">
                                        <Row>
                                            <label className='form-label'>Date</label>
                                        </Row>
                                        <Row>
                                            <Col xs={12} sm={12}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DateTimePicker
                                                        label="Choose date"
                                                        value={date}
                                                        onChange={(newValue) => {
                                                            setDate(newValue);
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField {...params} />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            </Col>
                                        </Row>
                                    </Row>
                                    <Col xs={12} sm={3}>
                                        <SelectField
                                            label={"Choose Type"}
                                            name={"type"}
                                            options={null}
                                            placeholder={"Choose type"}
                                            onChange={(selectOption) => {
                                                setFieldValue("type", selectOption.value);
                                            }}
                                            onBlur={() => {
                                                handleBlur({ target: { name: "type" } });
                                            }}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12}>
                                        <TextAreaCustom
                                            label={"Bike Manual ID List"}
                                            name={"stringListManualId"}
                                            type={"text"}
                                            placeholder={"Enter the manual ID list"}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12}>
                                        <TextAreaCustom
                                            label={"Description"}
                                            name={"description"}
                                            type={"text"}
                                            placeholder={"Enter the description"}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12}>
                                        <TextFieldCustom
                                            label={"Total cost"}
                                            name={"cost"}
                                            type={"number"}
                                            onWheel={(e) => e.target.blur()}
                                            placeholder={"Enter the cost"}
                                        />
                                    </Col>
                                </Row>
                                <button type="submit" className="btn btn-dark btn-md mt-3">
                                    Submit
                                </button>
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

export default ManageMaintainCreate;