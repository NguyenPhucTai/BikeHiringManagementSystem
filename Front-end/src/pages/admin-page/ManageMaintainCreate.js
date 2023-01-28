import React, { Fragment, useState, useEffect, useRef } from "react";

// Library
import { AxiosInstance } from "../../api/AxiosClient";
import { Formik, Form } from 'formik';
import { MaintainSchema } from "../../validation";
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
const handleSubmit = async (formikRef, date, setAlert, setShowPopup) => {

}


function ManageMaintainCreate() {

    var now = dayjs()

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

    // DATA
    const listType = [
        { value: "GENERAL", label: "GENERAL", key: 1 },
        { value: "BIKE", label: "BIKE", key: 2 }
    ]

    const [data, setData] = useState({})
    const [date, setDate] = useState(now);
    const [type, setType] = useState("GENERAL");


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
        type: "GENERAL",
        title: "",
        description: "",
        stringListManualId: "",
        cost: 0,
    }



    // USE EFFECT
    // PAGE LOADING
    useEffect(() => {
        if (loadingData === true) {
            setTimeout(() => {
                setLoadingData(false)
            }, 500);
        }
    }, [loadingData])

    // USE EFFECT
    // HANDLING SUBMIT FORM
    useEffect(() => {
        if (isSubmitting === true) {
            handleSubmit(formikRef, date, setAlert, setShowPopup)
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
                        validationSchema={MaintainSchema}
                        onSubmit={(values) => {
                            setIsSubmitting(true);
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
                                    <Col xs={12} sm={2}>
                                        <label className='form-label'>Type</label>
                                        <RadioGroup
                                            aria-labelledby="demo-controlled-radio-buttons-group"
                                            name="type"
                                            value={type}
                                            onChange={(e, value) => {
                                                setType(value)
                                                setFieldValue("type", value);
                                            }}
                                        >
                                            <FormControlLabel value={"GENERAL"} control={<Radio />} label="GENERAL" />
                                            <FormControlLabel value={"BIKE"} control={<Radio />} label="BIKE" />
                                        </RadioGroup>
                                    </Col>
                                    {type === "BIKE" &&
                                        <Col xs={12} sm={12}>
                                            <TextAreaCustom
                                                label={"Bike Manual ID List"}
                                                name={"stringListManualId"}
                                                type={"text"}
                                                placeholder={"Enter the manual ID list"}
                                            />
                                        </Col>
                                    }
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