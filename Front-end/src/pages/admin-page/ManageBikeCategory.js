import React, { Fragment, useEffect, useState } from 'react';
import { TableCRUD } from '../../components/Table/TableCRUD';
import { AxiosInstance } from "../../api/AxiosClient";
import Cookies from 'universal-cookie';
import { CategoryManagement } from '../../api/EndPoint';
import SortBar from "../../components/Navbar/SortBar";
import { Popup } from '../../components/Modal/Popup';
import { TextField } from '../../components/Form/TextField';
import { Formik, Form } from 'formik';
import { AlertMessage } from '../../components/Modal/AlertMessage';

const cookies = new Cookies();
const initialValues = {
    name: "",
    price: 0,
};

const handleCreateData = async (values, setAlert, setListData, setLoadingPage) => {
    const body = {
        name: values.name,
        price: values.price,
    };
    await AxiosInstance.post(CategoryManagement.create, body, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        if (res.data.code === 1) {
            setAlert({
                alertShow: true,
                alertStatus: "success",
                alertMessage: res.data.message,
            })
            handleGetDataPagination(setListData, setLoadingPage);
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

const handleUpdateData = async (values, dataID, setAlert, setListData, setLoadingPage) => {
    const body = {
        name: values.name,
        price: values.price,
    };
    await AxiosInstance.post(CategoryManagement.update + dataID, body, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        if (res.data.code === 1) {
            setAlert({
                alertShow: true,
                alertStatus: "success",
                alertMessage: res.data.message,
            })
            handleGetDataPagination(setListData, setLoadingPage);
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

const handleGetDataPagination = async (setListData, setLoadingPage) => {
    const body = {
        searchKey: null,
        page: 1,
        limit: 5,
        sortBy: "name",
        sortType: "ASC"
    };
    await AxiosInstance.post(CategoryManagement.getPagination, body, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        var listData = res.data.data.content.map((data) => {
            return {
                id: data.id,
                name: data.name,
                price: data.price
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

const handleDeleteData = async (dataID, setAlert, setListData, setLoadingPage, setShowCloseButton) => {
    await AxiosInstance.post(CategoryManagement.delete + dataID, {}, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        if (res.data.code === 1) {
            setAlert({
                alertShow: true,
                alertStatus: "success",
                alertMessage: res.data.message,
            })
            handleGetDataPagination(setListData, setLoadingPage);
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

function ManageBikeCategory() {
    const tableTitleList = ['ID', 'NAME', 'PRICE']
    const [loadingPage, setLoadingPage] = useState(true);
    const [listData, setListData] = useState([]);
    const [dataID, setDataID] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [titlePopup, setTitlePopup] = useState("");
    const [showCloseButton, setShowCloseButton] = useState(false);
    const [alert, setAlert] = useState({
        alertShow: false,
        alertStatus: "success",
        alertMessage: "",
    })

    useEffect(() => {
        handleGetDataPagination(setListData, setLoadingPage);
    }, [loadingPage])


    let popupTitle;
    if (titlePopup === "Create") {
        popupTitle = <Popup showPopup={showPopup} title={"Create"} child={
            <Fragment>
                <AlertMessage
                    isShow={alert.alertShow}
                    message={alert.alertMessage}
                    status={alert.alertStatus}
                />
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values) => {
                        handleCreateData(values, setAlert, setListData, setLoadingPage);
                    }}>
                    {({
                        isSubmiting,
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
                                placeholder={"Enter the category name"}
                            />
                            <TextField
                                label={"Price"}
                                name={"price"}
                                type={"number"}
                                placeholder={"Enter the category price"}
                            />
                            <div className="popup-button">
                                <button className="btn btn-primary btn-action" type="submit">{titlePopup}</button>
                                <button className="btn btn-secondary btn-cancel" onClick={() => { setShowPopup(false); setAlert({ alertShow: false }) }}>Cancel</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Fragment>
        } />
    } else if (titlePopup === "Update") {
        popupTitle = <Popup showPopup={showPopup} setShowPopup={setShowPopup} title={"Update"} child={
            <Fragment>
                <AlertMessage
                    isShow={alert.alertShow}
                    message={alert.alertMessage}
                    status={alert.alertStatus}
                />

                <Formik
                    initialValues={initialValues}
                    onSubmit={(values) => {
                        handleUpdateData(values, dataID, setAlert, setListData, setLoadingPage);
                    }}>
                    {({
                        isSubmiting,
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
                                placeholder={"Enter the category name"}
                            />
                            <TextField
                                label={"Price"}
                                name={"price"}
                                type={"number"}
                                placeholder={"Enter the category price"}
                            />
                            <div className="popup-button">
                                <button className="btn btn-primary btn-action" type="submit">{titlePopup}</button>
                                <button className="btn btn-secondary btn-cancel" onClick={() => { setShowPopup(false); setAlert({ alertShow: false }) }}>Cancel</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Fragment>
        } />
    } else if (titlePopup === "View") {
        popupTitle = <Popup showPopup={showPopup} setShowPopup={setShowPopup} title={"View"} child={
            <p>{titlePopup}</p>
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
                        <button className="btn btn-secondary btn-cancel" onClick={() => { setShowPopup(false); setShowCloseButton(false); setAlert({ alertShow: false }) }}>Close</button>
                    </div>
                </ Fragment>
                :
                <Fragment>
                    <div className='popup-message text-center mb-3'>
                        <label>Do you really want to delete this record?</label>
                        <p>This process cannot be undone</p>
                    </div>
                    <div className="popup-button">
                        <button className="btn btn-danger btn-action" onClick={() => handleDeleteData(dataID, setAlert, setListData, setLoadingPage, setShowCloseButton)}>{titlePopup}</button>
                        <button className="btn btn-secondary btn-cancel" onClick={() => { setShowPopup(false) }}>Cancel</button>
                    </div>
                </Fragment >
        } />
    }

    return (
        <Fragment>
            <div className='container'>
                {popupTitle}
                <button className="btn btn-primary" onClick={() => { setShowPopup(true); setTitlePopup("Create") }}>Create</button>

                <SortBar />
                <TableCRUD
                    tableTitleList={tableTitleList}
                    listData={listData}
                    setShowPopup={setShowPopup}
                    setTitlePopup={setTitlePopup}
                    setDataID={setDataID}
                />
                {/* <Pagination
                    count={maxPage}
                    shape="rounded"
                    size="large"
                    defaultPage={1}
                    showFirstButton
                    showLastButton
                    page={activePage}
                    onChange={handleChangePage} /> */}
            </div>
        </Fragment>
    )
}
export default ManageBikeCategory;