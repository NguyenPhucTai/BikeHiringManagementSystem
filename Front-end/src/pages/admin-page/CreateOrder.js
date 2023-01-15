import React, { Fragment, useState, useEffect } from "react";

// Library
import { AxiosInstance } from "../../api/AxiosClient";
import { Formik, Form } from "formik";
import { BikeSchema } from "../../validation";
import Cookies from 'universal-cookie';
import LinearProgress from '@mui/material/LinearProgress';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';
import { Radio, RadioGroup, FormControlLabel, } from "@mui/material";

// Library - date time
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';


// Component
import { AlertMessage } from "../../components/Modal/AlertMessage";
import { TextFieldCustom } from "../../components/Form/TextFieldCustom";
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
    const [expectedStartDate, setExpectedStartDate] = useState(null);
    const [expectedEndDate, setExpectedEndDate] = useState(null);
    const [isUsedService, setIsUsedService] = useState("");
    const [depositType, setDepositType] = useState("");

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
        customerName: "",
        phoneNumber: "",
        expectedStartDate: "",
        expectedEndDate: "",
        calculatedCost: 0,
        bikeManufacturer: 0,
        serviceDescription: "",
        serviceCost: 0,
        depositAmount: "",
        depositIdentifyCard: "",
        note: "",
        totalAmount: 0,
        listBike: [{}]
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
                                        <TextFieldCustom
                                            label={"Customer Name"}
                                            name={"customerName"}
                                            type={"text"}
                                            placeholder={"Enter the customer name"}
                                        />
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <TextFieldCustom
                                            label={"Phone Number"}
                                            name={"phoneNumber"}
                                            type={"text"}
                                            placeholder={"Enter the phone number"}
                                        />
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <Row >
                                            <label className='form-label'>Expected Start Date</label>
                                        </Row>
                                        <Row style={{ width: "50%" }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DateTimePicker
                                                    value={expectedStartDate}
                                                    onChange={(newValue) => setExpectedStartDate(newValue)}
                                                    renderInput={(params) => (
                                                        <TextField {...params} />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </Row>

                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <Row>
                                            <label className='form-label'>Expected End Date</label>
                                        </Row>
                                        <Row style={{ width: "50%" }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DateTimePicker
                                                    value={expectedEndDate}
                                                    onChange={(newValue) => setExpectedEndDate(newValue)}
                                                    renderInput={(params) => (
                                                        <TextField {...params} />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </Row>
                                    </Col>
                                    <Col xs={12} sm={12}>
                                        <label className='form-label'>Bike List</label>
                                    </Col>
                                    <Col xs={12} sm={12}>
                                        <TextFieldCustom
                                            label={"Cost"}
                                            name={"calculatedCost"}
                                            type={"number"}
                                            placeholder={"Enter the cost"}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12}>
                                        <label className='form-label'>Using Service?</label>
                                        <RadioGroup
                                            aria-labelledby="demo-controlled-radio-buttons-group"
                                            name="controlled-radio-buttons-group"
                                            defaultValue="yes"
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Col>
                                    <Col xs={12} sm={12}>
                                        <TextFieldCustom
                                            label={"Service Description"}
                                            name={"serviceDescription"}
                                            type={"text"}
                                            placeholder={"Enter the description"}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12}>
                                        <TextFieldCustom
                                            label={"Service Cost"}
                                            name={"serviceCost"}
                                            type={"number"}
                                            placeholder={"Enter the service cost"}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12}>
                                        <label className='form-label'>Deposit type</label>
                                        <RadioGroup
                                            aria-labelledby="demo-controlled-radio-buttons-group"
                                            name="controlled-radio-buttons-group"
                                            defaultValue="identifyCard"
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel value="identifyCard" control={<Radio />} label="IdentifyCard" />
                                            <FormControlLabel value="money" control={<Radio />} label="Money" />
                                            <FormControlLabel value="hotel" control={<Radio />} label="Hotel" />
                                        </RadioGroup>
                                    </Col>
                                    <Col xs={12} sm={12}>
                                        <TextFieldCustom
                                            label={"Identify Card"}
                                            name={"identifyCard"}
                                            type={"text"}
                                            placeholder={"Enter the Identify Card"}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12}>
                                        <TextFieldCustom
                                            label={"Despoit"}
                                            name={"serviceCost"}
                                            type={"number"}
                                            placeholder={"Enter the service cost"}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12}>
                                        <TextFieldCustom
                                            label={"Hotel"}
                                            name={"hotel"}
                                            type={"text"}
                                            placeholder={"Enter the hotel address"}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12}>
                                        <TextFieldCustom
                                            label={"Note"}
                                            name={"note"}
                                            type={"text"}
                                            placeholder={"Enter the note"}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12}>
                                        <TextFieldCustom
                                            label={"Total Cost"}
                                            name={"totalAmount"}
                                            type={"number"}
                                            placeholder={"Total Cost"}
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