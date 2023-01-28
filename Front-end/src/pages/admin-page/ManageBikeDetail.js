import React, { Fragment, useState, useEffect } from "react";

// Library
import { AxiosInstance } from "../../api/AxiosClient";
import { Formik, Form } from "formik";
import Cookies from 'universal-cookie';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

// Component
import { TextFieldCustom } from "../../components/Form/TextFieldCustom";
import { Firebase_URL, BikeManagement } from "../../api/EndPoint";
import { PageLoad } from '../../components/Base/PageLoad';
import { Popup } from '../../components/Modal/Popup';
import { AlertMessage } from '../../components/Modal/AlertMessage';
import { GetFormattedDate } from "../../function/DateFormat";

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

const handleNavigateToListPage = (isDeleted, navigate) => {
    if (isDeleted) {
        navigate("/manage/bike");
    }
}

// FUNCTION
// CALL API
const handleGetBikeById = async (id, setData, navigate) => {
    await AxiosInstance.get(BikeManagement.getById + id, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        if (res.data.code === 1) {
            if (res.data.data !== null) {
                setData(res.data.data);


            } else {
                navigate("/404");
            }
        }
    }).catch((error) => {
        if (error && error.response) {
            console.log("Error: ", error);
        }
    });
};

const handleDeleteBikeById = async (
    id,
    setAlert,
    setShowCloseButton,
    setIsDeleted
) => {
    await AxiosInstance.post(BikeManagement.delete + id, {}, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        if (res.data.code === 1) {
            showAlert(setAlert, res.data.message, true);
            setIsDeleted(true)
        } else {
            showAlert(setAlert, res.data.message, false);
        }
        setShowCloseButton(true);
    }).catch((error) => {
        if (error && error.response) {
            console.log("Error: ", error);
        }
        showAlert(setAlert, error, false);
    });

}


function ManageBikeDetail() {

    // Show Public Navigation
    const dispatch = useDispatch();
    const [loadingPage, setLoadingPage] = useState(true);
    if (loadingPage === true) {
        dispatch(reduxAuthenticateAction.updateIsShowPublicNavBar(false));
        setLoadingPage(false);
    }

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
    const [isDeleted, setIsDeleted] = useState(false);

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
        id: 0,
        bikeName: "",
        bikeManualId: "",
        bikeNo: "",
        bikeCategory: "",
        price: 0,
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
            handleGetBikeById(id, setData, navigate);
            setLoadingData(false)
        }
    }, [loadingData])

    // Update initialValues
    if (Object.keys(data).length !== 0) {
        console.log()
        initialValues.id = data.id;
        initialValues.bikeManualId = data.bikeManualId;
        initialValues.bikeName = data.name;
        initialValues.bikeNo = data.bikeNo;
        initialValues.bikeCategory = data.bikeCategoryName;
        initialValues.price = data.price;
        initialValues.bikeManufacturer = data.bikeManufacturerName;
        initialValues.bikeColor = data.bikeColor;
        initialValues.hiredNumber = data.hiredNumber;
        initialValues.status = data.status;
        initialValues.createdUser = data.createdUser;
        initialValues.createdDate = GetFormattedDate(data.createdDate);
        initialValues.modifiedUser = data.modifiedUser ? data.modifiedUser : "N/A";
        initialValues.modifiedDate = data.modifiedDate ? GetFormattedDate(data.modifiedDate) : "N/A";
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
                                handleNavigateToListPage(isDeleted, navigate);
                            }}>Close</button>
                    </div>
                </ Fragment>
                :
                <Fragment>
                    <div className='popup-message text-center mb-3'>
                        <label>Do you really want to delete this bike?</label>
                        <p>This process cannot be undone</p>
                    </div>
                    <div className="popup-button">
                        <button className="btn btn-danger btn-action"
                            onClick={() => handleDeleteBikeById(id, setAlert, setShowCloseButton, setIsDeleted)}>DELETE</button>
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
                                <Col xs={12} lg={6}>
                                    <TextFieldCustom
                                        label={"Bike Id"}
                                        name={"id"}
                                        type={"text"}
                                        disabled={true}
                                    />
                                </Col>
                                <Col xs={12} lg={6}>
                                    <TextFieldCustom
                                        label={"Bike Manual Id"}
                                        name={"bikeManualId"}
                                        type={"text"}
                                        disabled={true}
                                    />
                                </Col>
                                <Col xs={12} lg={6}>
                                    <TextFieldCustom
                                        label={"Bike Name"}
                                        name={"bikeName"}
                                        type={"text"}
                                        disabled={true}
                                    />
                                </Col>
                                <Col xs={12} lg={6}>
                                    <TextFieldCustom
                                        label={"Bike No"}
                                        name={"bikeNo"}
                                        type={"text"}
                                        disabled={true}
                                    />
                                </Col>
                                <Col xs={12} lg={6}>
                                    <TextFieldCustom
                                        label={"Bike Category"}
                                        name={"bikeCategory"}
                                        type={"text"}
                                        disabled={true}
                                    />
                                </Col>
                                <Col xs={12} lg={6}>
                                    <TextFieldCustom
                                        label={"Price"}
                                        name={"price"}
                                        type={"text"}
                                        disabled={true}
                                    />
                                </Col>
                                <Col xs={12} lg={6}>
                                    <TextFieldCustom
                                        label={"Bike Manufacturer"}
                                        name={"bikeManufacturer"}
                                        type={"text"}
                                        disabled={true}
                                    />
                                </Col>
                                <Col xs={12} lg={6}>
                                    <TextFieldCustom
                                        label={"Bike Color"}
                                        name={"bikeColor"}
                                        type={"text"}
                                        disabled={true}
                                    />
                                </Col>
                                <Col xs={12} lg={6}>
                                    <TextFieldCustom
                                        label={"Hired Number"}
                                        name={"hiredNumber"}
                                        type={"text"}
                                        disabled={true}
                                    />
                                </Col>
                                <Col xs={12} lg={6}>
                                    <TextFieldCustom
                                        label={"Status"}
                                        name={"status"}
                                        type={"text"}
                                        disabled={true}
                                    />
                                </Col>
                                <Col xs={12} lg={6}>
                                    <TextFieldCustom
                                        label={"Create User"}
                                        name={"createdUser"}
                                        type={"text"}
                                        disabled={true}
                                    />
                                </Col>
                                <Col xs={12} lg={6}>
                                    <TextFieldCustom
                                        label={"Create Date"}
                                        name={"createdDate"}
                                        type={"text"}
                                        disabled={true}
                                    />
                                </Col>
                                <Col xs={12} lg={6}>
                                    <TextFieldCustom
                                        label={"Modified User"}
                                        name={"modifiedUser"}
                                        type={"text"}
                                        disabled={true}
                                    />
                                </Col>
                                <Col xs={12} lg={6}>
                                    <TextFieldCustom
                                        label={"Modified Date"}
                                        name={"modifiedDate"}
                                        type={"text"}
                                        disabled={true}
                                    />
                                </Col>
                                <label className='form-label'>Bike Images</label>
                                {Object.keys(data).length !== 0 ?
                                    data.imageList.map((value, index) => {
                                        return (
                                            <Col key={index} xs={12} sm={6} md={4} lg={3}>
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