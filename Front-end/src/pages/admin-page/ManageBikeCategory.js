import React, { Fragment, useEffect, useState } from 'react';
import { TableCRUD } from '../../components/Table/TableCRUD';
import { AxiosInstance } from "../../api/AxiosClient";
import Cookies from 'universal-cookie';
import { CategoryManagement } from '../../api/EndPoint';
import SortBar from "../../components/Navbar/SortBar";
import { Popup } from '../../components/Modal/Popup';
import { TextField } from '../../components/Form/TextField';
import { Formik, Form } from 'formik';

const initialValues = {
    name: "",
    price: 0,
};

const cookies = new Cookies();

const handleGetCategory = async (setListCategory, setLoadingPage) => {
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
        var listCategory = res.data.data.content.map((data) => {
            return {
                id: data.id,
                name: data.name,
                price: data.price
            }
        })
        setListCategory(listCategory)
        setLoadingPage(false)
    })
        .catch((error) => {
            if (error && error.response) {
                console.log("Error: ", error);
            }
        });
};


function ManageBikeCategory() {
    const [listCategory, setListCategory] = useState([]);
    const [loadingPage, setLoadingPage] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [titlePopup, setTitlePopup] = useState("");
    const tableTitleList = ['ID', 'NAME', 'PRICE']


    useEffect(() => {
        handleGetCategory(setListCategory, setLoadingPage);
    }, [loadingPage])

    let popupTitle;
    if (titlePopup === "Create") {
        popupTitle = <Popup showPopup={showPopup} setShowPopup={setShowPopup} title={"Create"} child={
            <Fragment>
                <p>{titlePopup}</p>
                <Formik
                    initialValues={initialValues}

                    onSubmit={(values) => {
                        console.log(values);
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
                                name={"username"}
                                type={"text"}
                                placeholder={"Enter the username"}
                            />
                            <TextField
                                label={"Password"}
                                name={"password"}
                                type={"password"}
                                placeholder={"Enter the password"}
                            />
                            <button type="submit" className="btn btn-dark btn-md mt-3">
                                Sign In
                            </button>
                        </Form>
                    )}
                </Formik>
            </Fragment>
        } />
    } else if (titlePopup === "Update") {
        popupTitle = <Popup showPopup={showPopup} setShowPopup={setShowPopup} title={"Update"} child={
            <p>{titlePopup}</p>
        } />
    } else if (titlePopup === "View") {
        popupTitle = <Popup showPopup={showPopup} setShowPopup={setShowPopup} title={"View"} child={
            <p>{titlePopup}</p>
        } />
    }


    return (
        <Fragment>
            <div className='container'>
                {popupTitle}
                <button className="btn btn-primary" onClick={() => { setShowPopup(true); setTitlePopup("Create") }}>Create</button>
                <SortBar />
                <TableCRUD tableTitleList={tableTitleList} data={listCategory} setShowPopup={setShowPopup} setTitlePopup={setTitlePopup} />
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