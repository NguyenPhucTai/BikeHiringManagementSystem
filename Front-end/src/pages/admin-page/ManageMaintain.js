import React, { Fragment, useEffect, useState } from 'react';

// Library
import Cookies from 'universal-cookie';
import { Formik, Form } from 'formik';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import dayjs from 'dayjs';

// Source
// API
import { AxiosInstance } from "../../api/AxiosClient";
import { MaintainManagement } from '../../api/EndPoint';

//Component
import { TableMaintainList } from '../../components/Table/TableMaintainList';
import SortBarMaintain from "../../components/Navbar/SortBarMaintain";
import { Popup } from '../../components/Modal/Popup';
import { TextFieldCustom } from '../../components/Form/TextFieldCustom';
import { AlertMessage } from '../../components/Modal/AlertMessage';
import { GetFormattedDate } from "../../function/DateFormat";
import { PaginationCustom } from '../../components/Table/Pagination';
import { PageLoad } from '../../components/Base/PageLoad';
import { GetFormattedCurrency } from '../../function/CurrencyFormat';
import { GetFormattedDatetTime } from '../../function/DateTimeFormat';
import { useNavigate } from 'react-router-dom';

// Redux
import { useSelector, useDispatch } from "react-redux";
import { reduxAction } from "../../redux-store/redux/redux.slice";
import { reduxPaginationAction } from '../../redux-store/redux/reduxPagination.slice';
import { reduxAuthenticateAction } from "../../redux-store/redux/reduxAuthenticate.slice";

const cookies = new Cookies();

const SortBy = [
    { value: "id", label: "Sort by ID", key: "1" },
    { value: "type", label: "Sort by type", key: "2" },
    { value: "title", label: "Sort by title", key: "3" },
    { value: "cost", label: "Sort by cost", key: "4" },
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
            alertStatus: "error",
            alertMessage: message
        })
    }
}

const handleGetDataPagination = async (
    setListData,
    setLoadingData,
    setTotalPages,
    reduxFilter,
    reduxPagination,
    startDate,
    endDate
) => {
    const body = {
        searchKey: reduxFilter.reduxSearchKey,
        page: reduxPagination.reduxPage,
        limit: reduxPagination.reduxRowsPerPage,
        sortBy: reduxFilter.reduxSortBy,
        sortType: reduxFilter.reduxSortType,
        dateFrom: startDate,
        dateTo: endDate
    };
    await AxiosInstance.post(MaintainManagement.getPagination, body, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        var listData = res.data.data.content.map((data) => {
            return {
                id: data.id,
                date: GetFormattedDatetTime(data.date),
                type: data.type,
                title: data.title,
                cost: GetFormattedCurrency(data.cost)
            }
        })
        setListData(listData)
        setTotalPages(res.data.data.totalPages)
        setTimeout(() => {
            setLoadingData(false)
        }, 500);
    }).catch((error) => {
        if (error && error.response) {
            console.log("Error: ", error);
        }
    });
};

function ManageMaintain() {

    // Show Public Navigation
    const dispatch = useDispatch();
    const [loadingPage, setLoadingPage] = useState(true);
    if (loadingPage === true) {
        dispatch(reduxAuthenticateAction.updateIsShowPublicNavBar(false));
        dispatch(reduxAction.setSortType('DESC'));
        dispatch(reduxAction.setSortBy('id'));
        setLoadingPage(false);
    }

    // Render page
    const navigate = useNavigate();

    // Table variables
    const tableTitleList = [
        { name: 'ID', width: '10%' },
        { name: 'DATE', width: '15%' },
        { name: 'TYPE', width: '15%' },
        { name: 'TITLE', width: '25%' },
        { name: 'COST', width: '15%' }
    ]

    // Formik variables
    const initialValues = {
        type: "",
        description: "",
        cost: 0,
    };

    // Redux - Filter form
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

    // Search By Date
    var now = dayjs()
    const [startDate, setStartDate] = useState(now.startOf('year'));
    const [endDate, setEndDate] = useState(now.endOf('year'));

    // Table useState
    const [loadingData, setLoadingData] = useState(true);
    const [listData, setListData] = useState([]);

    // Popup useState
    const [dataID, setDataID] = useState(0);
    const [lineItem, setLineItem] = useState({});
    const [titlePopup, setTitlePopup] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [showCloseButton, setShowCloseButton] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [alert, setAlert] = useState({
        alertShow: false,
        alertStatus: "success",
        alertMessage: "",
    })

    // useEffect
    // Table loading - page load
    useEffect(() => {
        if (loadingData === true) {
            handleGetDataPagination(setListData, setLoadingData, setTotalPages, reduxFilter, reduxPagination, startDate, endDate);
        }
    }, [loadingData])

    // Table loading filter submit
    useEffect(() => {
        if (reduxIsSubmitting === true) {
            if (reduxPagination.reduxPage === 1) {
                handleGetDataPagination(setListData, setLoadingData, setTotalPages, reduxFilter, reduxPagination, startDate, endDate);
            } else {
                dispatch(reduxPaginationAction.updatePage(1));
            }
            dispatch(reduxAction.setIsSubmitting({ isSubmitting: false }));
        }
    }, [reduxIsSubmitting])

    // Table loading pagination - change page
    useEffect(() => {
        handleGetDataPagination(setListData, setLoadingData, setTotalPages, reduxFilter, reduxPagination, startDate, endDate);
    }, [reduxPagination.reduxPage])


    // Table loading pagination - change row per page -> call above useEffect
    useEffect(() => {
        if (reduxPagination.reduxPage === 1) {
            handleGetDataPagination(setListData, setLoadingData, setTotalPages, reduxFilter, reduxPagination, startDate, endDate);
        } else {
            dispatch(reduxPaginationAction.updatePage(1));
        }
    }, [reduxPagination.reduxRowsPerPage])

    // Trigger Get Data by ID API
    useEffect(() => {
        if (isDelete === false && dataID !== 0) {
            console.log("delete maintain")

        }
    }, [isDelete, dataID])



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
                            console.log("handle create");
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
                                <TextFieldCustom
                                    label={"Name"}
                                    name={"name"}
                                    type={"text"}
                                    placeholder={"Enter the category name"}
                                />
                                <TextFieldCustom
                                    label={"Price"}
                                    name={"price"}
                                    type={"number"} onWheel={(e) => e.target.blur()}
                                    placeholder={"Enter the category price"}
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
                                <Col lg={6} xs={6}><label className="body-title">Category Id:</label></Col>
                                <Col lg={6} xs={6}><label>{lineItem.id}</label></Col>
                                <Col lg={6} xs={6}><label className="body-title">Category Name:</label></Col>
                                <Col lg={6} xs={6}><label>{lineItem.name}</label></Col>
                                <Col lg={6} xs={6}><label className="body-title">Price:</label></Col>
                                <Col lg={6} xs={6}><label>{lineItem.price}</label></Col>
                                <Col lg={6} xs={6}><label className="body-title">Create Date:</label></Col>
                                <Col lg={6} xs={6}><label>{GetFormattedDate(lineItem.createdDate)}</label></Col>
                                <Col lg={6} xs={6}><label className="body-title">Create User:</label></Col>
                                <Col lg={6} xs={6}><label>{lineItem.createdUser}</label></Col>
                                <Col lg={6} xs={6}><label className="body-title">Modified Date:</label></Col>
                                <Col lg={6} xs={6}><label>{lineItem.modifiedDate === null ? "N/A" : GetFormattedDate(lineItem.modifiedDate)}</label></Col>
                                <Col lg={6} xs={6}><label className="body-title">Modified User:</label></Col>
                                <Col lg={6} xs={6}><label>{lineItem.modifiedUser === null ? "N/A" : lineItem.modifiedUser}</label></Col>
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
                            onClick={() => {
                                console.log("delete")
                            }}>{titlePopup}</button>
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
            <TableMaintainList
                tableTitleList={tableTitleList}
                listData={listData}
                setShowPopup={setShowPopup}
                setTitlePopup={setTitlePopup}
                setDataID={setDataID}
                setIsDelete={setIsDelete}
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
                    <SortBarMaintain
                        SortBy={SortBy}
                        startDate={startDate}
                        endDate={endDate}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                    />
                    <div className='table-header'>
                        <Row>
                            <Col lg={6} xs={6}><label style={{ fontSize: '36px' }}>Maintain List</label></Col>
                            <Col lg={6} xs={6}><button className="btn btn-primary" style={{ float: "right", marginTop: '10px' }} onClick={() => navigate('/manage/maintain/create')}>Create</button></Col>
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

export default ManageMaintain;