import React, { Fragment, useEffect, useState } from 'react';

// Library
import Cookies from 'universal-cookie';
import { useSelector, useDispatch } from "react-redux";
import { reduxAction } from "../../redux-store/redux/redux.slice";
import { reduxPaginationAction } from '../../redux-store/redux/reduxPagination.slice';
import { Formik, Form } from 'formik';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Source
// API
import { AxiosInstance } from "../../api/AxiosClient";
import { ColorManagement } from '../../api/EndPoint';

//Component
import { TableCRUD } from '../../components/Table/TableCRUD';
import SortBarManagement from "../../components/Navbar/SortBarManagement";
import { Popup } from '../../components/Modal/Popup';
import { TextField } from '../../components/Form/TextField';
import { AlertMessage } from '../../components/Modal/AlertMessage';
import { GetFormattedDate } from "../../function/DateTimeFormat";
import { PaginationCustom } from '../../components/Table/Pagination';
import { PageLoad } from '../../components/Base/PageLoad';

const cookies = new Cookies();

const SortBy = [
    { value: "id", label: "Sort by ID", key: "1" },
    { value: "name", label: "Sort by name", key: "2" }
];

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
            alertStatus: "danger",
            alertMessage: message
        })
    }
}

const handleGetDataPagination = async (
    setListData,
    setLoadingData,
    setTotalPages,
    reduxFilter,
    reduxPagination
) => {
    const body = {
        searchKey: reduxFilter.reduxSearchKey,
        page: reduxPagination.reduxPage,
        limit: reduxPagination.reduxRowsPerPage,
        sortBy: reduxFilter.reduxSortBy,
        sortType: reduxFilter.reduxSortType
    };
    await AxiosInstance.post(ColorManagement.getPagination, body, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        var listData = res.data.data.content.map((data) => {
            return {
                id: data.id,
                name: data.name
            }
        })
        setListData(listData)
        setLoadingData(false)
        setTotalPages(res.data.data.totalPages)
    }).catch((error) => {
        if (error && error.response) {
            console.log("Error: ", error);
        }
    });
};

const handleGetDataById = async (dataID, setLineItem) => {
    await AxiosInstance.get(ColorManagement.getById + dataID, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        if (res.data.code === 1) {
            setLineItem(res.data.data);
        }
    }).catch((error) => {
        if (error && error.response) {
            console.log("Error: ", error);
        }
    });

}

const handleCreateData = async (
    values,
    reduxFilter,
    reduxPagination,
    setAlert,
    setListData,
    setLoadingData,
    setShowCloseButton,
    setTotalPages
) => {
    const body = {
        name: values.name
    };
    await AxiosInstance.post(ColorManagement.create, body, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        if (res.data.code === 1) {
            showAlert(setAlert, res.data.message, true);
            handleGetDataPagination(setListData, setLoadingData, setTotalPages, reduxFilter, reduxPagination);
            setShowCloseButton(true);
        } else {
            showAlert(setAlert, res.data.message, false);
        }
    }).catch((error) => {
        if (error && error.response) {
            console.log("Error: ", error);
        }
        showAlert(setAlert, error, false);
    });

}

const handleUpdateData = async (
    values,
    dataID,
    reduxFilter,
    reduxPagination,
    setAlert,
    setListData,
    setLoadingData,
    setShowCloseButton,
    setTotalPages
) => {
    const body = {
        name: values.name
    };
    await AxiosInstance.post(ColorManagement.update + dataID, body, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        if (res.data.code === 1) {
            showAlert(setAlert, res.data.message, true);
            handleGetDataPagination(setListData, setLoadingData, setTotalPages, reduxFilter, reduxPagination);
            setShowCloseButton(true);
        } else {
            showAlert(setAlert, res.data.message, false);
        }
    }).catch((error) => {
        if (error && error.response) {
            console.log("Error: ", error);
        }
        showAlert(setAlert, error, false);
    });

}

const handleDeleteData = async (
    dataID,
    reduxFilter,
    reduxPagination,
    setAlert,
    setListData,
    setLoadingData,
    setShowCloseButton,
    setTotalPages
) => {
    await AxiosInstance.post(ColorManagement.delete + dataID, {}, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        if (res.data.code === 1) {
            showAlert(setAlert, res.data.message, true);
            handleGetDataPagination(setListData, setLoadingData, setTotalPages, reduxFilter, reduxPagination);
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

function ManageBikeColor() {

    // Table variables
    const tableTitleList = ['ID', 'NAME']

    // Formik variables
    const initialValues = {
        name: ""
    };

    // Redux - Filter form
    const dispatch = useDispatch();
    let reduxFilter = {
        reduxSearchKey: useSelector((state) => state.redux.searchKey),
        reduxSortBy: useSelector((state) => state.redux.sortBy),
        reduxSortType: useSelector((state) => state.redux.sortType),
    }
    const reduxIsSubmitting = useSelector((state) => state.redux.isSubmitting);

    // Redux - Pagination
    const [totalPages, setTotalPages] = useState(1);
    let reduxPagination = {
        reduxPage: useSelector((state) => state.reduxPagination.page),
        reduxRowsPerPage: useSelector((state) => state.reduxPagination.rowsPerPage)
    }

    // Table useState
    const [loadingData, setLoadingData] = useState(true);
    const [listData, setListData] = useState([]);

    // Popup useState
    const [dataID, setDataID] = useState(0);
    const [lineItem, setLineItem] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [titlePopup, setTitlePopup] = useState("");
    const [showCloseButton, setShowCloseButton] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [alert, setAlert] = useState({
        alertShow: false,
        alertStatus: "success",
        alertMessage: "",
    })


    // useEffect
    // Table loading - page load
    useEffect(() => {
        if (loadingData === true) {
            handleGetDataPagination(setListData, setLoadingData, setTotalPages, reduxFilter, reduxPagination);
        }
    }, [loadingData])

    // Table loading filter submit
    useEffect(() => {
        if (reduxIsSubmitting === true) {
            if (reduxPagination.reduxPage === 1) {
                handleGetDataPagination(setListData, setLoadingData, setTotalPages, reduxFilter, reduxPagination);
            } else {
                dispatch(reduxPaginationAction.updatePage(1));
            }
            dispatch(reduxAction.setIsSubmitting({ isSubmitting: false }));
        }
    }, [reduxIsSubmitting])

    // Table loading pagination - change page
    useEffect(() => {
        handleGetDataPagination(setListData, setLoadingData, setTotalPages, reduxFilter, reduxPagination);
    }, [reduxPagination.reduxPage])

    // Table loading pagination - change row per page -> call above useEffect
    useEffect(() => {
        if (reduxPagination.reduxPage === 1) {
            handleGetDataPagination(setListData, setLoadingData, setTotalPages, reduxFilter, reduxPagination);
        } else {
            dispatch(reduxPaginationAction.updatePage(1));
        }
    }, [reduxPagination.reduxRowsPerPage])

    // Trigger Get Data by ID API
    useEffect(() => {
        if (isDelete === false && dataID !== 0) {
            handleGetDataById(dataID, setLineItem);
        }
    }, [isDelete, dataID])


    // Update initialValues
    if (isUpdate === true && lineItem !== null) {
        initialValues.name = lineItem.name;
    }

    // Popup Interface
    let popupTitle;
    if (titlePopup === "Create") {
        popupTitle = <Popup showPopup={showPopup} title={"Create"} child={
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
                                dispatch(reduxPaginationAction.updatePage(1));
                            }}>Close</button>
                    </div>
                </ Fragment>
                :
                <Fragment>
                    <AlertMessage
                        isShow={alert.alertShow}
                        message={alert.alertMessage}
                        status={alert.alertStatus}
                    />
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values) => {
                            handleCreateData(
                                values,
                                reduxFilter,
                                reduxPagination,
                                setAlert,
                                setListData,
                                setLoadingData,
                                setShowCloseButton,
                                setTotalPages
                            );
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
                                <TextField
                                    label={"Name"}
                                    name={"name"}
                                    type={"text"}
                                    placeholder={"Enter the color name"}
                                />
                                <div className="popup-button">
                                    <button className="btn btn-primary btn-action" type="submit">{titlePopup}</button>
                                    <button className="btn btn-secondary btn-cancel"
                                        onClick={() => {
                                            setShowPopup(false);
                                            setAlert({ alertShow: false })
                                        }}>Cancel</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Fragment>
        } />
    } else if (titlePopup === "Update") {
        popupTitle = <Popup showPopup={showPopup} setShowPopup={setShowPopup} title={"Update"} child={
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
                                setDataID(0);
                                setIsUpdate(false)
                            }}>Close</button>
                    </div>
                </ Fragment>
                :
                <Fragment>
                    <AlertMessage
                        isShow={alert.alertShow}
                        message={alert.alertMessage}
                        status={alert.alertStatus}
                    />
                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        onSubmit={(values) => {
                            handleUpdateData(
                                values,
                                dataID,
                                reduxFilter,
                                reduxPagination,
                                setAlert,
                                setListData,
                                setLoadingData,
                                setShowCloseButton,
                                setTotalPages
                            );
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
                                <TextField
                                    label={"Name"}
                                    name={"name"}
                                    type={"text"}
                                    placeholder={"Enter the color name"}
                                />
                                <div className="popup-button">
                                    <button className="btn btn-primary btn-action" type="submit">{titlePopup}</button>
                                    <button className="btn btn-secondary btn-cancel"
                                        onClick={() => {
                                            setShowPopup(false);
                                            setAlert({ alertShow: false });
                                            setDataID(0); setIsUpdate(false)
                                        }}>Cancel</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Fragment>
        } />
    } else if (titlePopup === "View") {
        popupTitle = <Popup showPopup={showPopup} setShowPopup={setShowPopup} title={"View"} child={
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
                                setDataID(0)
                            }}>Close</button>
                    </div>
                </ Fragment>
                :
                <Fragment>
                    <div className='popup-view-container'>
                        <div>{popupTitle}</div>
                        <div className="popup-view-header">
                            <div>{popupTitle}</div>
                        </div>
                        <div className="popup-view-body">
                            <Row>
                                <Col lg={6} xs={6}><label className="body-title">Color Id:</label></Col>
                                <Col lg={6} xs={6}><label>{lineItem.id}</label></Col>
                                <Col lg={6} xs={6}><label className="body-title">Color Name:</label></Col>
                                <Col lg={6} xs={6}><label>{lineItem.name}</label></Col>
                                <Col lg={6} xs={6}><label className="body-title">Create Date:</label></Col>
                                <Col lg={6} xs={6}><label>{GetFormattedDate(lineItem.createdDate)}</label></Col>
                                <Col lg={6} xs={6}><label className="body-title">Create User:</label></Col>
                                <Col lg={6} xs={6}><label>{lineItem.createdUser}</label></Col>
                                <Col lg={6} xs={6}><label className="body-title">Modified Date:</label></Col>
                                <Col lg={6} xs={6}><label>{GetFormattedDate(lineItem.modifiedDate)}</label></Col>
                                <Col lg={6} xs={6}><label className="body-title">Modified User:</label></Col>
                                <Col lg={6} xs={6}><label>{lineItem.modifiedUser}</label></Col>
                            </Row>
                        </div>
                        <div className="popup-view-footer">
                            <div className="popup-button">
                                <button className="btn btn-secondary btn-cancel"
                                    onClick={() => {
                                        setShowPopup(false);
                                        setDataID(0)
                                    }}>Cancel</button>
                            </div>
                        </div>
                    </div>

                </Fragment >

        } />
    } else if (titlePopup === "Delete") {
        popupTitle = <Popup showPopup={showPopup} setShowPopup={setShowPopup} title={"Delete ID " + dataID} child={
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
                                setDataID(0);
                                setIsDelete(false)
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
                        <button className="btn btn-danger btn-action"
                            onClick={() => handleDeleteData(
                                dataID,
                                reduxFilter,
                                reduxPagination,
                                setAlert,
                                setListData,
                                setLoadingData,
                                setShowCloseButton,
                                setTotalPages
                            )}>{titlePopup}</button>
                        <button className="btn btn-secondary btn-cancel"
                            onClick={() => {
                                setShowPopup(false);
                                setDataID(0);
                                setIsDelete(false)
                            }}>Cancel</button>
                    </div>
                </Fragment >
        } />
    }

    // Table - Pagination
    let tablePagination;
    if (listData.length > 0) {
        tablePagination = <div className='table-pagination'>
            <TableCRUD
                tableTitleList={tableTitleList}
                listData={listData}
                setShowPopup={setShowPopup}
                setTitlePopup={setTitlePopup}
                setDataID={setDataID}
                setIsDelete={setIsDelete}
                setIsUpdate={setIsUpdate}
            />
            <PaginationCustom
                totalPages={totalPages}
            />
        </div>
    } else {
        tablePagination = <div className='text-center'>
            <label style={{ fontSize: '36px' }}>No data found</label>
        </div>
    }

    return (
        !loadingData ?
            <Fragment>
                <div className='container'>
                    {popupTitle}
                    <SortBarManagement SortBy={SortBy} />
                    <div className='table-header'>
                        <Row>
                            <Col lg={6} xs={6}><label style={{ fontSize: '36px' }}>Bike Color List</label></Col>
                            <Col lg={6} xs={6}><button className="btn btn-primary" style={{ float: "right", marginTop: '10px' }} onClick={() => { setShowPopup(true); setTitlePopup("Create") }}>Create</button></Col>
                        </Row>
                    </div>
                    {tablePagination}
                </div>
            </Fragment>
            :
            <Fragment>
                <PageLoad />
            </Fragment>
    )
}
export default ManageBikeColor;