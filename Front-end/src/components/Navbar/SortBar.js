import React, { useState, useEffect, useRef, Fragment } from "react";
import { Formik, Form } from "formik";
import { SortSelect } from "../Form/SortSelect";
import { SearchField } from "../Form/SearchField";
import { BikeCategories } from "../Form/SelectItem";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const initialValues = {
    search: "",
}

const SortBar = () => {
    return (
        <Fragment>
            <Row>
                <Col lg={3}>
                    <SortSelect
                        options={BikeCategories}
                        onChange={(value) => { console.log(value.value) }}
                    />
                </Col>
                <Col lg={3}>
                    <SortSelect
                        options={BikeCategories}
                        onChange={(value) => { console.log(value.value) }}
                    />
                </Col>
                <Col lg={6}>
                    <Formik
                        initialStatus={initialValues}
                        onSubmit={(values) => {
                            console.log(1)
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
                            <Form>
                                <SearchField
                                    name={"search"}
                                    type={"text"}
                                    placeholder={"Search..."}
                                />
                            </Form>
                        )}
                    </Formik >
                </Col>
            </Row>
        </Fragment >
    )
}

export default SortBar;