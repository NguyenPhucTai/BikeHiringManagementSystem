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

const handleGetCart = async (
    setLoadingData,
    setData,
    setListBike,
    setIsUsedService,
    setDepositType,
    setExpectedStartDate,
    setExpectedEndDate
) => {
    await AxiosInstance.get(OrderManagement.cartGetByUsername, {
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
            setExpectedStartDate(dayjs(res.data.data.expectedStartDate))
            setExpectedEndDate(dayjs(res.data.data.expectedEndDate))
            setIsUsedService(res.data.data.isUsedService == null ? false : res.data.data.isUsedService)
            setDepositType(res.data.data.depositType == null ? "identifyCard" : res.data.data.depositType)
        }
        console.log("Get Cart")
        setTimeout(() => {
            setLoadingData(false)
        }, 500);
    }).catch((error) => {
        if (error && error.response) {
            console.log("Error: ", error);
        }
    });
}

const handleSaveCart = async (ref, expectedStartDate, expectedEndDate, setAlert, setLoadingData) => {

    const body = {
        tempCustomerName: ref.current.values.customerName == "" ? null : ref.current.values.customerName,
        tempCustomerPhone: ref.current.values.phoneNumber == "" ? null : ref.current.values.phoneNumber,
        expectedStartDate: expectedStartDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        expectedEndDate: expectedEndDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        calculatedCost: ref.current.values.calculatedCost,
        isUsedService: ref.current.values.isUsedService,
        serviceDescription: ref.current.values.serviceDescription == "" ? null : ref.current.values.serviceDescription,
        serviceCost: ref.current.values.serviceCost,
        depositType: ref.current.values.depositType,
        depositAmount: ref.current.values.depositAmount,
        depositIdentifyCard: ref.current.values.depositIdentifyCard == "" ? null : ref.current.values.depositIdentifyCard,
        depositHotel: ref.current.values.depositHotel == "" ? null : ref.current.values.depositHotel,
        note: ref.current.values.note == "" ? null : ref.current.values.note,
        totalAmount: ref.current.values.totalAmount,
    };
    console.log(body);
    await AxiosInstance.post(OrderManagement.cartSave, body, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` },
    }).then((res) => {
        if (res.data.data.code === 1) {
            showAlert(setAlert, res.data.data.message, true)
        }
        setLoadingData(true)
    }).catch((error) => {
        showAlert(setAlert, error, false)
    });

};

const handleSubmit = async (setIsSubmitting, ref) => {
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
    const [showCloseButton, setShowCloseButton] = useState(false);

    // VARIABLE
    // FORMIK REF
    const ref = useRef(null);

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
            handleGetCart(setLoadingData, setData, setListBike, setIsUsedService, setDepositType, setExpectedStartDate, setExpectedEndDate);
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
        initialValues.customerName = data.customerName == null ? "" : data.customerName;
        initialValues.phoneNumber = data.phoneNumber == null ? "" : data.phoneNumber;
        initialValues.calculatedCost = data.calculatedCost == null ? 0 : data.calculatedCost;
        initialValues.serviceDescription = data.serviceDescription == null ? "" : data.serviceDescription;
        initialValues.serviceCost = data.serviceCost == null ? 0 : data.serviceCost;
        initialValues.depositAmount = data.depositAmount == null ? 0 : data.depositAmount;
        initialValues.depositIdentifyCard = data.depositIdentifyCard == null ? "" : data.depositIdentifyCard;
        initialValues.depositHotel = data.depositHotel == null ? "" : data.depositHotel;
        initialValues.totalAmount = data.totalAmount == null ? 0 : data.totalAmount;

        initialValues.depositType = data.depositType == null ? "identifyCard" : data.depositType;
        initialValues.isUsedService = data.isUsedService == null ? false : data.isUsedService;
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
                    <h1 className="text-center">CREATE ORDER</h1>
                    <Button variant="contained" color="success" onClick={() => handleSaveCart(ref, expectedStartDate, expectedEndDate, setAlert, setLoadingData)}>
                        SAVE CART
                    </Button>
                    {isRunLinear && (
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    )}
                    <Formik
                        innerRef={ref}
                        enableReinitialize
                        initialValues={initialValues}
                        validationSchema={OrderSchema}
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
                                            defaultValue={isUsedService}
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
                                            defaultValue={depositType}
                                            onChange={(e, value) => {
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