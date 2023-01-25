import React, { useState, useEffect, useRef, Fragment } from "react";
import { Formik, Form } from "formik";
import { SortSelect } from "../Form/SortSelect";
import { SearchField } from "../Form/SearchField";
import { SortType } from "../Form/SelectItem";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDispatch } from "react-redux";
import { reduxAction } from "../../redux-store/redux/redux.slice";

const initialValues = {
    searchKey: "",
    sortBy: "id",
    sortType: "ASC"
};

const SortBar = (props) => {
    const dispatch = useDispatch();
    return (
        <Fragment>
            <Row className="sort-bar mb-3">
                <Col lg={3} xs={6}>
                    <SortSelect
                        options={props.SortBy}
                        placeholder={"Sort by ID"}
                        onChange={(value) => {
                            dispatch(reduxAction.sortByBike(value.value))
                        }}
                    />
                </Col>
                <Col lg={3} xs={6}>
                    <SortSelect
                        options={SortType}
                        placeholder={"Z to A"}
                        onChange={(value) => {
                            dispatch(reduxAction.sortTypeBike(value.value))
                        }}
                    />
                </Col>
                <Col lg={6} xs={12}>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values) => {
                            dispatch(reduxAction.searchBike({ searchKey: values.searchKey }));
                            dispatch(reduxAction.setIsSubmitting({ isSubmitting: true }));
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
                                <Row>
                                    <Col lg={9} xs={12}>
                                        <SearchField
                                            name={"searchKey"}
                                            type={"text"}
                                            placeholder={"Search..."}
                                        />
                                    </Col>
                                    <Col lg={3} xs={12}>
                                        <button type="submit" className="btn btn-dark btn-md" style={{ width: '100%' }}>
                                            Submit
                                        </button>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </Col>
            </Row>
        </Fragment >
    )
}

export default SortBar;

