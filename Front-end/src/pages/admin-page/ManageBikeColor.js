import React, { Fragment, useEffect, useState } from 'react';

// Library
import Cookies from 'universal-cookie';
import { useSelector, useDispatch } from "react-redux";
import { reduxAction } from "../../redux-store/redux/redux.slice";
import { Formik, Form } from 'formik';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Pagination from '@mui/material/Pagination';

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

const cookies = new Cookies();

const SortBy = [
    { value: "id", label: "Sort by ID", key: "1" },
    { value: "name", label: "Sort by name", key: "2" }
];

const handleGetDataPagination = async (setListData, setLoadingPage, reduxFilter) => {
    const body = {
        searchKey: reduxFilter.reduxSearchKey,
        page: 1,
        limit: 5,
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
        setLoadingPage(false)
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
    setAlert,
    setListData,
    setLoadingPage,
    setShowCloseButton
) => {
    const body = {
        name: values.name
    };
    await AxiosInstance.post(ColorManagement.create, body, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        if (res.data.code === 1) {
            setAlert({
                alertShow: true,
                alertStatus: "success",
                alertMessage: res.data.message,
            })
            setShowCloseButton(true);
            handleGetDataPagination(setListData, setLoadingPage, reduxFilter);
        } else {
            setAlert({
                alertShow: true,
                alertStatus: "danger",
                alertMessage: res.data.message,
            })
        }
    }).catch((error) => {
        if (error && error.response) {
            console.log("Error: ", error);
        }
        setAlert({
            alertShow: true,
            alertStatus: "danger",
            alertMessage: error,
        })
    });

}

const handleUpdateData = async (
    values,
    dataID,
    reduxFilter,
    setAlert,
    setListData,
    setLoadingPage,
    setShowCloseButton
) => {
    const body = {
        name: values.name
    };
    await AxiosInstance.post(ColorManagement.update + dataID, body, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        if (res.data.code === 1) {
            setAlert({
                alertShow: true,
                alertStatus: "success",
                alertMessage: res.data.message,
            })
            handleGetDataPagination(setListData, setLoadingPage, reduxFilter);
            setShowCloseButton(true);
        } else {
            setAlert({
                alertShow: true,
                alertStatus: "danger",
                alertMessage: res.data.message,
            })
        }
    }).catch((error) => {
        if (error && error.response) {
            console.log("Error: ", error);
        }
        setAlert({
            alertShow: true,
            alertStatus: "danger",
            alertMessage: error,
        })
    });

}

const handleDeleteData = async (
    dataID,
    reduxFilter,
    setAlert,
    setListData,
    setLoadingPage,
    setShowCloseButton
) => {
    await AxiosInstance.post(ColorManagement.delete + dataID, {}, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        if (res.data.code === 1) {
            setAlert({
                alertShow: true,
                alertStatus: "success",
                alertMessage: res.data.message,
            })
            handleGetDataPagination(setListData, setLoadingPage, reduxFilter);
        } else {
            setAlert({
                alertShow: true,
                alertStatus: "danger",
                alertMessage: res.data.message,
            })
        }
        setShowCloseButton(true);
    }).catch((error) => {
        if (error && error.response) {
            console.log("Error: ", error);
        }
        setAlert({
            alertShow: true,
            alertStatus: "danger",
            alertMessage: error,
        })
    });

}

function ManageBikeColor() {

    // Table variables
    const tableTitleList = ['ID', 'NAME']

    // Formik variables
    const initialValues = {
        name: ""
    };

    // Redux
    const dispatch = useDispatch();
    let reduxFilter = {
        reduxSearchKey: useSelector((state) => state.redux.searchKey),
        reduxSortBy: useSelector((state) => state.redux.sortBy),
        reduxSortType: useSelector((state) => state.redux.sortType),
    }
    const reduxIsSubmitting = useSelector((state) => state.redux.isSubmitting);

    // Table useState
    const [loadingPage, setLoadingPage] = useState(true);
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

    // Pagination
    const [activePage, setActivePage] = useState(1);
    const [maxPage, setMaxPage] = useState(10);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // useEffect
    // Page loading default
    useEffect(() => {
        if (loadingPage === true) {
            handleGetDataPagination(setListData, setLoadingPage, reduxFilter);
        }
    }, [loadingPage])

    // Page loading action
    useEffect(() => {
        if (reduxIsSubmitting === true) {
            handleGetDataPagination(setListData, setLoadingPage, reduxFilter);
            dispatch(reduxAction.setIsSubmitting({ isSubmitting: false }));
        }
    }, [reduxIsSubmitting])

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

    //Pagination
    const handleChangePage = (event, newPage) => {
        setActivePage(newPage);
    };

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
                                setAlert({ alertShow: false })
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
                                setAlert,
                                setListData,
                                setLoadingPage,
                                setShowCloseButton
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
                                setAlert,
                                setListData,
                                setLoadingPage,
                                setShowCloseButton
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
                                setDataID(0); setIsDelete(false)
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
                                setAlert,
                                setListData,
                                setLoadingPage,
                                setShowCloseButton
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

    return (
        <Fragment>
            <div className='container'>
                {popupTitle}
                <SortBarManagement SortBy={SortBy} />
                <button className="btn btn-primary" onClick={() => { setShowPopup(true); setTitlePopup("Create") }}>Create</button>
                <TableCRUD
                    tableTitleList={tableTitleList}
                    listData={listData}
                    setShowPopup={setShowPopup}
                    setTitlePopup={setTitlePopup}
                    setDataID={setDataID}
                    setIsDelete={setIsDelete}
                    setIsUpdate={setIsUpdate}
                />
                <Pagination
                    count={maxPage}
                    shape="rounded"
                    size="large"
                    defaultPage={1}
                    showFirstButton
                    showLastButton
                    page={activePage}
                    onChange={handleChangePage}
                    rowsPerPage={[1, 2, 3, 4, 5]}
                />

            </div>
        </Fragment>
    )
}
export default ManageBikeColor;