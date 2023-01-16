import React, { Fragment, useState, useEffect } from "react";

// Library
import { AxiosInstance } from "../../api/AxiosClient";
import { Formik, Form } from 'formik';
import { OrderSchema } from "../../validation";
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
import { TableOrder } from "../../components/Table/TableOrder";

// Redux
import { useDispatch } from "react-redux";
import { reduxAuthenticateAction } from "../../redux-store/redux/reduxAuthenticate.slice";

const cookies = new Cookies();

const handleGetCart = async (setLoadingData, setData, setListBike) => {
    await AxiosInstance.get(OrderManagement.getCartByUsername, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        if (res.data.code === 1) {
            var listBike = res.data.data.listBike.map((data) => {
                return {
                    id: data.id,
                    name: data.name,
                    bikeManualId: data.bikeManualId,
                    bikeCategoryName: data.bikeCategoryName,
                    hiredNumber: data.hiredNumber
                }
            })
            setListBike(listBike)
            setData(res.data.data)
        }
        setLoadingData(false)
    }).catch((error) => {
        if (error && error.response) {
            console.log("Error: ", error);
        }
    });
}


const handleSubmit = async (setIsSubmitting) => {
    console.log("submit")
    setIsSubmitting(false);
};

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

    const tableTitleList = ['NAME', 'MANUAL ID', 'CATEGORY', 'HIRED NUMBER']

    // VARIABLE
    // CART
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [data, setData] = useState({});
    const [expectedStartDate, setExpectedStartDate] = useState(null);
    const [expectedEndDate, setExpectedEndDate] = useState(null);
    const [isUsedService, setIsUsedService] = useState(false);
    const [depositType, setDepositType] = useState("identifyCard");
    const [listBike, setListBike] = useState([])

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
        calculatedCost: 0,
        isUsedService: false,
        serviceDescription: "",
        serviceCost: 0,
        depositType: "identifyCard",
        depositAmount: "",
        depositIdentifyCard: "",
        depositHotel: "",
        note: "",
        totalAmount: 0
    };

    // USE EFFECT
    // PAGE LOADING
    useEffect(() => {
        if (loadingData === true) {
            handleGetCart(setLoadingData, setData, setListBike);
        }
    }, [loadingData])

    // USE EFFECT
    // HANDLING SUBMIT FORM
    useEffect(() => {
        if (isSubmitting == true) {
            console.log("USE EFFECT")
            handleSubmit(setIsSubmitting);
        }
    }, [isSubmitting])

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
                                navigate('/order/create');
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
                        validationSchema={OrderSchema}
                        onSubmit={(values) => {
                            console.log("Test");
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
                                {/* Customer info */}
                                <Row className="mb-3">
                                    <Row className="mb-3">
                                        <Col xs={12} sm={12}>
                                            <TextFieldCustom
                                                label={"Customer Name"}
                                                name={"customerName"}
                                                type={"text"}
                                                placeholder={"Enter the customer name"}
                                            />
                                        </Col>
                                        <Col xs={12} sm={12}>
                                            <TextFieldCustom
                                                label={"Phone Number"}
                                                name={"phoneNumber"}
                                                type={"text"}
                                                placeholder={"Enter the phone number"}
                                            />
                                        </Col>
                                        <Col xs={12} sm={12}>
                                            <Row >
                                                <label className='form-label'>Expected Start Date</label>
                                            </Row>
                                            <Row style={{ width: "25%" }}>
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
                                        <Col xs={12} sm={12}>
                                            <Row>
                                                <label className='form-label'>Expected End Date</label>
                                            </Row>
                                            <Row style={{ width: "25%" }}>
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
                                    </Row>
                                    <Row>
                                        <Col xs={12} sm={12}>
                                            <label className='form-label'>Bike List</label>
                                            <TableOrder
                                                tableTitleList={tableTitleList}
                                                listData={listBike}
                                            />
                                        </Col>
                                        <Col xs={12} sm={12}>
                                            <TextFieldCustom
                                                label={"Cost"}
                                                name={"calculatedCost"}
                                                type={"number"}
                                                placeholder={"Enter the cost"}
                                            />
                                        </Col>
                                    </Row>
                                </Row>

                                {/* Service info */}
                                <Row className="mb-3">
                                    <Col xs={12} sm={12}>
                                        <label className='form-label'>Using Service?</label>
                                        <RadioGroup
                                            aria-labelledby="demo-controlled-radio-buttons-group"
                                            name="isUsedService"
                                            defaultValue={false}
                                            // value={values.isUsedService}
                                            onChange={(e, value) => {
                                                let result = false;
                                                if (value === 'true') {
                                                    result = true;
                                                }
                                                setIsUsedService(result)
                                                setFieldValue("isUsedService", result);
                                            }}
                                        >
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                        </RadioGroup>
                                    </Col>
                                    {isUsedService === true &&
                                        <Row>
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
                                        </Row>
                                    }
                                </Row>

                                {/* Deposit info */}
                                <Row className="mb-3">
                                    <Col xs={12} sm={12}>
                                        <label className='form-label'>Deposit type</label>
                                        <RadioGroup
                                            aria-labelledby="demo-controlled-radio-buttons-group"
                                            name="depositType"
                                            defaultValue={"identifyCard"}
                                            onChange={(e, value) => {
                                                console.log(value)
                                                setDepositType(value)
                                                setFieldValue("depositType", value);
                                            }}
                                        >
                                            <FormControlLabel value="identifyCard" control={<Radio />} label="Identify Card" />
                                            <FormControlLabel value="money" control={<Radio />} label="Money" />
                                            <FormControlLabel value="hotel" control={<Radio />} label="Hotel" />
                                        </RadioGroup>
                                    </Col>
                                    {depositType === "identifyCard" &&
                                        <Col xs={12} sm={12}>
                                            <TextFieldCustom
                                                label={"Identify Card"}
                                                name={"depositIdentifyCard"}
                                                type={"text"}
                                                placeholder={"Enter the Identify Card"}
                                            />
                                        </Col>
                                    }
                                    {depositType === "money" &&
                                        <Col xs={12} sm={12}>
                                            <TextFieldCustom
                                                label={"Despoit Amount"}
                                                name={"depositAmount"}
                                                type={"number"}
                                                placeholder={"Enter the deposit amount"}
                                            />
                                        </Col>
                                    }
                                    {depositType === "hotel" &&
                                        <Col xs={12} sm={12}>
                                            <TextFieldCustom
                                                label={"Hotel"}
                                                name={"depositHotel"}
                                                type={"text"}
                                                placeholder={"Enter the hotel address"}
                                            />
                                        </Col>
                                    }
                                </Row>

                                {/* Total info */}
                                <Row className="mb-3">
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

export default CreateOrder;