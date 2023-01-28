import React, { Fragment } from "react";
import { Formik, Form } from "formik";
import { SortSelect } from "../Form/SortSelect";
import { SearchField } from "../Form/SearchField";
import { SortType } from "../Form/SelectItem";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDispatch } from "react-redux";
import { reduxAction } from "../../redux-store/redux/redux.slice";

// Library - date time
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';

const initialValues = {
    searchKey: ""
};

const SortByStatus = [
    { value: "PENDING", label: "PENDING", key: "1" },
    { value: "CLOSED", label: "CLOSED", key: "2" },
    { value: "CANCEL", label: "CANCEL", key: "3" }
];

const SortBarOrder = (props) => {

    const { startDate, setStartDate, endDate, setEndDate, SortBy } = props;

    const dispatch = useDispatch();
    return (
        <Fragment>
            <Row className="sort-bar mb-3">
                <Col lg={3} xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="From"
                            value={startDate}
                            onChange={(newValue) => {
                                setStartDate(newValue);
                            }}
                            renderInput={({ inputRef, inputProps, InputProps }) => (
                                <div className="form-group mb-3">
                                    <div style={{ display: 'inline' }}>
                                        <input className='form-control shadow-none'
                                            autoComplete='off'
                                            ref={inputRef} {...inputProps}
                                        />
                                        {InputProps?.endAdornment}
                                    </div>
                                </div>
                            )}
                        />
                    </LocalizationProvider>
                </Col>
                <Col lg={3} xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="To"
                            value={endDate}
                            onChange={(newValue) => {
                                setEndDate(newValue);
                            }}
                            renderInput={({ inputRef, inputProps, InputProps }) => (
                                <div className="form-group mb-3">
                                    <div style={{ display: 'inline' }}>
                                        <input className='form-control shadow-none'
                                            autoComplete='off'
                                            ref={inputRef} {...inputProps}
                                        />
                                        {InputProps?.endAdornment}
                                    </div>
                                </div>
                            )}
                        />
                    </LocalizationProvider>
                </Col>
                <Col lg={3} xs={12}>
                    <SortSelect
                        options={SortBy}
                        defaultValue={{ label: "Sort by ID", value: "id" }}
                        onChange={(value) => {
                            dispatch(reduxAction.sortByBike(value.value))
                        }}
                    />
                </Col>
                <Col lg={3} xs={12}>
                    <SortSelect
                        options={SortType}
                        defaultValue={{ label: "Newest to Oldest", value: "DESC" }}
                        onChange={(value) => {
                            dispatch(reduxAction.sortTypeBike(value.value))
                        }}
                    />
                </Col>
            </Row>
            <Row className="sort-bar mb-3">
                <Col lg={3} xs={12}>
                    <SortSelect
                        options={SortByStatus}
                        defaultValue={{ label: "PENDING", value: "PENDING" }}
                        onChange={(value) => {
                            dispatch(reduxAction.sortByStatus(value.value))
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
                                            placeholder={"Search by id, total amount"}
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

export default SortBarOrder;

