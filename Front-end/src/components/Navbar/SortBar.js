import React, { useState, useEffect, useRef, Fragment } from "react";
import { Formik, Form } from "formik";
import { SortSelect } from "../Form/SortSelect";
import { SearchField } from "../Form/SearchField";
import { SortType, SortBy } from "../Form/SelectItem";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDispatch } from "react-redux";
import { listBikeAction } from "../../redux-store/listBike/listBike.slice";

const initialValues = {
    search: "",
};

const SortBar = () => {
    const dispatch = useDispatch();
    return (
        <Fragment>
            <Row className="sort-bar mb-3">
                <Col lg={3}>
                    <SortSelect
                        options={SortBy}
                        placeholder={"Sort by"}
                        onChange={(value) => {
                            dispatch(listBikeAction.sortByBike(value.value))
                        }}
                    />
                </Col>
                <Col lg={3}>
                    <SortSelect
                        options={SortType}
                        placeholder={"Sort type"}
                        onChange={(value) => { 
                            dispatch(listBikeAction.sortTypeBike(value.value)) 
                        }}
                    />
                </Col>
                <Col lg={6}>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values) => {
                            dispatch(listBikeAction.searchBike({searchKey: values.search}));
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
                            <Form className="d-flex flex-</Form>column">
                                <SearchField
                                    name={"search"}
                                    type={"text"}
                                    placeholder={"Search..."}
                                />
                                <button type="submit" className="btn btn-dark btn-md mt-3">
                                    Submit
                                </button>
                            </Form>
                        )}
                    </Formik>
                </Col>
            </Row>
        </Fragment >
    )
}

export default SortBar;