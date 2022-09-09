import React, { useState, useEffect, useRef, Fragment } from "react";
import Form from 'react-bootstrap/Form';
import { Formik } from "formik";

export const FilterSide = ({
    listColor,
    listManufacturer
}) => {
    // console.log(listColor);
    // console.log(listManufacturer);
    return (
        <Fragment>
            <Formik
                // initialValues={initialValues}
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
                    <Form>
                        <div key={"Select-Manufacturer"} className="form-group mb-3">
                            <label className='form-label'>Manufacturer</label>
                            {listManufacturer.map((data) => {
                                <Form.Check
                                    type={"checkbox"}
                                    id={`${data.value}`}
                                    label={`${data.value}`}
                                />
                            })}
                        </div>
                        <div key={"Select-Color"} className="form-group mb-3">
                            <label className='form-label'>Color</label>
                            {listColor.map((data) => {
                                <Form.Check
                                    type={"checkbox"}
                                    id={`${data.value}`}
                                    label={`${data.value}`}
                                />
                            })}
                        </div>
                        <div key={"Select-Status"} className="form-group mb-3">
                            <label className='form-label'>Status</label>
                            <Form.Check
                                type={"checkbox"}
                                id={"enable"}
                                label={"Enable"}
                            />
                            <Form.Check
                                type={"checkbox"}
                                id={"disable"}
                                label={"Disable"}
                            />
                        </div>
                        <button type="submit" className="btn btn-dark btn-md mt-3">
                            Filter
                        </button>
                    </Form>
                )}
            </Formik>
        </Fragment>
    )
}