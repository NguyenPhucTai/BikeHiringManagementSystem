import React, { useState, useEffect, useRef, Fragment } from "react";
import { Formik, Form } from "formik";
import { TextField } from "../Form/TextField";
import { SelectField } from "../Form/SelectField";
import { BikeCategories } from "../Form/SelectItem";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const SortBar = () => {
    return (
        <Fragment>
            <Formik
                onSubmit={(values) => {

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
                    <Form className="inline">
                        <Row>
                            <Col lg={3}>
                                <SelectField
                                    label={""}
                                    name={"name"}
                                    options={BikeCategories}
                                    placeholder={"Sort A - Z"}
                                    onChange={(selectOption) => {
                                        // setFieldValue("name", selectOption.value);
                                    }}
                                    onBlur={() => {
                                        // handleBlur({ target: { name: "name" } });
                                    }}
                                />
                            </Col>
                            <Col lg={3}>
                                <SelectField
                                    label={""}
                                    name={"price"}
                                    options={BikeCategories}
                                    placeholder={"Sort high - low"}
                                    onChange={(selectOption) => {
                                        // setFieldValue("price", selectOption.value);
                                    }}
                                    onBlur={() => {
                                        // handleBlur({ target: { name: "price" } });
                                    }}
                                />
                            </Col>
                            <Col lg={6}>
                                <TextField
                                    label={""}
                                    name={"search"}
                                    type={"text"}
                                    placeholder={"Search..."}
                                />
                            </Col>
                        </Row>
                    </Form>
                )}
            </Formik>

        </Fragment>
    )
}

export default SortBar;