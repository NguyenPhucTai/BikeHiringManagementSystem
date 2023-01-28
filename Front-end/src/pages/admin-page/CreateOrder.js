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

const handleGetCart = async (
    setLoadingData,
    setData,
    setOrderID,
    setListBike,
    setIsUsedService,
    setDepositType,
    setExpectedStartDate,
    setExpectedEndDate,
    setCalculatedCost,
    setServiceCost,
    setTotalAmount
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
                    price: data.price,
                    hiredNumber: data.hiredNumber
                }
            })
            setData(res.data.data);
            setOrderID(res.data.data.id)
            setListBike(listBike)
            setExpectedStartDate(dayjs(res.data.data.expectedStartDate))
            setExpectedEndDate(dayjs(res.data.data.expectedEndDate))

            setIsUsedService(res.data.data.isUsedService === null ? false : res.data.data.isUsedService)
            setDepositType(res.data.data.depositType === null ? "identifyCard" : res.data.data.depositType)

            setCalculatedCost(res.data.data.calculatedCost === null ? 0 : res.data.data.calculatedCost)
            setServiceCost(res.data.data.serviceCost === null ? 0 : res.data.data.serviceCost)
            setTotalAmount(res.data.data.totalAmount === null ? 0 : res.data.data.totalAmount)
        }
        setTimeout(() => {
            setLoadingData(false)
        }, 500);
    }).catch((error) => {
        if (error && error.response) {
            console.log("Error: ", error);
        }
    });
}

const handleDeleteBike = async (
    dataID,
    setDataID,
    setIsDelete,
    listBike,
    setListBike,
    orderID,
    setIsCalculateCost
) => {
    await AxiosInstance.post(OrderManagement.cartDeleteBike + "orderId=" + orderID + "&bikeId=" + dataID, null, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        if (res.data.code === 1) {
            setListBike(listBike.filter(data => data.id !== dataID));
            setIsCalculateCost(true);
        }
        setIsDelete(false)
        setDataID(0)
    }).catch((error) => {
        if (error && error.response) {
            console.log("Error: ", error);
        }
    });

}

const handleCalculateCost = async (
    orderID,
    expectedStartDate,
    expectedEndDate,
    setIsCalculateCost,
    serviceCost,
    setTotalAmount,
    setCalculatedCost,
) => {
    if (expectedEndDate.isAfter(expectedStartDate)) {
        const body = {
            id: orderID,
            expectedStartDate: expectedStartDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
            expectedEndDate: expectedEndDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        };
        await AxiosInstance.post(OrderManagement.cartCalculateCost, body, {
            headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
        }).then((res) => {
            if (res.data.code === 1) {
                setCalculatedCost(res.data.data)
                setTotalAmount(res.data.data + serviceCost)
            }
            setIsCalculateCost(false)
        }).catch((error) => {
            if (error && error.response) {
                console.log("Error: ", error);
            }
        });
    } else {
        setCalculatedCost(0)
        setIsCalculateCost(false)
    }
}

const handleSaveCart = async (
    isCreateOrder,
    formikRef,
    expectedStartDate,
    expectedEndDate,
    calculatedCost,
    serviceCost,
    totalAmount,
    setLoadingData,
    setShowPopup,
    setAlert,
    setIsRunLinear,
) => {
    if (serviceCost === undefined || serviceCost < 0) {
        serviceCost = 0;
    }
    const body = {
        tempCustomerName: formikRef.current.values.customerName === "" ? null : formikRef.current.values.customerName,
        tempCustomerPhone: formikRef.current.values.phoneNumber === "" ? null : formikRef.current.values.phoneNumber,
        expectedStartDate: expectedStartDate,
        expectedEndDate: expectedEndDate,

        serviceDescription: formikRef.current.values.serviceDescription === "" ? null : formikRef.current.values.serviceDescription,
        depositAmount: formikRef.current.values.depositAmount,
        depositIdentifyCard: formikRef.current.values.depositIdentifyCard === "" ? null : formikRef.current.values.depositIdentifyCard,
        depositHotel: formikRef.current.values.depositHotel === "" ? null : formikRef.current.values.depositHotel,
        note: formikRef.current.values.note === "" ? null : formikRef.current.values.note,

        isUsedService: formikRef.current.values.isUsedService,
        depositType: formikRef.current.values.depositType,

        calculatedCost: calculatedCost,
        serviceCost: serviceCost,
        totalAmount: totalAmount,
        isCreateOrder: isCreateOrder
    };
    await AxiosInstance.post(OrderManagement.cartSave, body, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` },
    }).then((res) => {
        if (res.data.code === 1) {
            showAlert(setAlert, res.data.message, true)
        }
        if (isCreateOrder === false) {
            setLoadingData(true)
        }
        setIsRunLinear(false);
        setShowPopup(true)
    }).catch((error) => {
        showAlert(setAlert, error, false)
    });
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

    // TABLE TITLE
    const tableTitleList = ["ID", 'NAME', 'MANUAL ID', 'CATEGORY', 'PRICE', 'HIRED NUMBER']

    // VARIABLE
    // CART
    // TRIGGER
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCalculateCost, setIsCalculateCost] = useState(false);

    // DATA
    const [data, setData] = useState({})
    const [listBike, setListBike] = useState([])
    const [orderID, setOrderID] = useState(0);
    const [expectedStartDate, setExpectedStartDate] = useState(null);
    const [expectedEndDate, setExpectedEndDate] = useState(null);

    const [isUsedService, setIsUsedService] = useState(false);
    const [depositType, setDepositType] = useState("identifyCard");

    const [calculatedCost, setCalculatedCost] = useState(0);
    const [serviceCost, setServiceCost] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);


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
    // DELETE BIKE
    const [dataID, setDataID] = useState(0);
    const [isDelete, setIsDelete] = useState(false);


    // VARIABLE
    // FORMIK
    const formikRef = useRef(null);
    const initialValues = {
        customerName: "",
        phoneNumber: "",
        isUsedService: false,
        serviceDescription: "",
        depositType: "identifyCard",
        depositAmount: "",
        depositIdentifyCard: "",
        depositHotel: "",
        note: "",
    }



    // USE EFFECT
    // PAGE LOADING
    useEffect(() => {
        if (loadingData === true) {
            handleGetCart(
                setLoadingData,
                setData,
                setOrderID,
                setListBike,
                setIsUsedService,
                setDepositType,
                setExpectedStartDate,
                setExpectedEndDate,
                setCalculatedCost,
                setServiceCost,
                setTotalAmount
            );
        }
    }, [loadingData])

    // USE EFFECT
    // CHANGE SERVICE CODE -> UPDATE TOTAL AMOUNT
    useEffect(() => {
        if (serviceCost > 0) {
            setTotalAmount(serviceCost + calculatedCost)
        } else {
            setTotalAmount(calculatedCost)
        }
    }, [serviceCost])

    // USE EFFECT
    // TRIGGER API CALCULATE COST
    useEffect(() => {
        if (isCalculateCost === true) {
            handleCalculateCost(orderID, expectedStartDate, expectedEndDate, setIsCalculateCost, serviceCost, setTotalAmount, setCalculatedCost)
        }
    }, [isCalculateCost])

    // USE EFFECT
    // DELETE BIKE
    useEffect(() => {
        if (isDelete === true) {
            handleDeleteBike(dataID, setDataID, setIsDelete, listBike, setListBike, orderID, setIsCalculateCost);
        }
    }, [isDelete])

    // USE EFFECT
    // HANDLING SUBMIT FORM
    useEffect(() => {
        if (isSubmitting === true) {
            setIsRunLinear(true);
            handleSaveCart(
                true,
                formikRef,
                expectedStartDate,
                expectedEndDate,
                calculatedCost,
                serviceCost,
                totalAmount,
                setLoadingData,
                setShowPopup,
                setAlert,
                setIsRunLinear,
            )
        }
    }, [isSubmitting])


    // Update initialValues
    if (Object.keys(data).length !== 0) {
        initialValues.customerName = data.customerName === null ? "" : data.customerName;
        initialValues.phoneNumber = data.phoneNumber === null ? "" : data.phoneNumber;

        initialValues.isUsedService = data.isUsedService === null ? false : data.isUsedService;
        initialValues.serviceDescription = data.serviceDescription === null ? "" : data.serviceDescription;

        initialValues.depositType = data.depositType === null ? "identifyCard" : data.depositType;
        initialValues.depositAmount = data.depositAmount === null ? 0 : data.depositAmount;
        initialValues.depositIdentifyCard = data.depositIdentifyCard === null ? "" : data.depositIdentifyCard;
        initialValues.depositHotel = data.depositHotel === null ? "" : data.depositHotel;

        initialValues.note = data.note === null ? "" : data.note;
    }

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
                    <h1 className="text-center">CREATE ORDER</h1>
                    <Button variant="contained" color="success"
                        onClick={() =>
                            handleSaveCart(
                                false,
                                formikRef,
                                expectedStartDate,
                                expectedEndDate,
                                calculatedCost,
                                serviceCost,
                                totalAmount,
                                setLoadingData,
                                setShowPopup,
                                setAlert,
                                setIsRunLinear,
                            )
                        }>
                        SAVE CART
                    </Button>
                    {isRunLinear && (
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    )}
                    <Formik
                        innerRef={formikRef}
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
                                    <Row className="mb-3">
                                        <Row className="mb-3">
                                            <label className='form-label'>Expect Date</label>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col xs={12} sm={2}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DateTimePicker
                                                        label="Expected Start Date"
                                                        value={expectedStartDate}
                                                        onChange={(newValue) => {
                                                            setExpectedStartDate(newValue);
                                                        }}
                                                        onAccept={() => setIsCalculateCost(true)}
                                                        renderInput={(params) => (
                                                            <TextField {...params} />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            </Col>
                                            <Col xs={12} sm={2}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DateTimePicker
                                                        label="Expected End Date"
                                                        value={expectedEndDate}
                                                        onChange={(newValue) => {
                                                            setExpectedEndDate(newValue);
                                                        }}
                                                        onAccept={() => setIsCalculateCost(true)}
                                                        renderInput={(params) => (
                                                            <TextField {...params} />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            </Col>
                                        </Row>
                                    </Row>
                                    <Row>
                                        <Col xs={12} sm={12}>
                                            <label className='form-label'>Bike List</label>
                                            {Object.keys(listBike).length !== 0 ?
                                                <TableDelete
                                                    tableTitleList={tableTitleList}
                                                    listData={listBike}
                                                    setDataID={setDataID}
                                                    setIsDelete={setIsDelete}
                                                    isShowButtonDelete={true}
                                                />
                                                :
                                                <div>No bike found</div>
                                            }
                                        </Col>
                                        <Col xs={12} sm={12}>
                                            <TextFieldCustom
                                                label={"Cost"}
                                                name={"calculatedCost"}
                                                type={"number"} onWheel={(e) => e.target.blur()}
                                                placeholder={"Enter the cost"}
                                                value={calculatedCost}
                                                disabled={true}
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
                                            value={isUsedService}
                                            onChange={(e, value) => {
                                                let result = false;
                                                if (value === 'true') {
                                                    result = true;
                                                } else {
                                                    setServiceCost(0);
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
                                                    onWheel={(e) => e.target.blur()}
                                                    placeholder={"Enter the service cost"}
                                                    value={serviceCost}
                                                    onChange={(event) => {
                                                        let value = event.target.value;
                                                        if (value === "") {
                                                            setServiceCost("")
                                                        } else {
                                                            setServiceCost(parseFloat(value))
                                                        }
                                                    }}
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
                                            value={depositType}
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
                                                onWheel={(e) => e.target.blur()}
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
                                        <TextAreaCustom
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
                                            onWheel={(e) => e.target.blur()}
                                            placeholder={"Total Cost"}
                                            value={totalAmount}
                                            onChange={(event) => {
                                                let value = event.target.value;
                                                if (value === "") {
                                                    setTotalAmount("")
                                                } else {
                                                    setTotalAmount(parseFloat(value))
                                                }
                                            }}
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