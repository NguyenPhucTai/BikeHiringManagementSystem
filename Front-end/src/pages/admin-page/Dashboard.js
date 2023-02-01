import React, { useState, useEffect, Fragment } from "react";

// Redux
import { useDispatch } from "react-redux";
import { reduxAuthenticateAction } from "../../redux-store/redux/reduxAuthenticate.slice";

// Library
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';

// Library - date time
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { PolarArea, Doughnut, Bar, Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

// Component
import { CardCustom } from "../../components/Card/CardCustom";

// Function
import { ConvertLongNumber } from "../../function/ConvertLongNumber";

function Dashboard() {

    // Show Public Navigation
    const dispatch = useDispatch();
    const [loadingPage, setLoadingPage] = useState(true);
    if (loadingPage === true) {
        dispatch(reduxAuthenticateAction.updateIsShowPublicNavBar(false));
        setLoadingPage(false);
    }

    // Search By Date
    var now = dayjs();
    const [startDate, setStartDate] = useState(now.set('month', -1));
    const [endDate, setEndDate] = useState(now);

    // Chart
    const [dataChart2, setDataChart2] = useState({
        labels: ['Total revenue', 'Total expense'],
        datasets: [{
            label: 'Revenue & Expense Chart',
            data: [200000, 100000],
        }]
    });

    return (
        <Fragment>
            <div className="container" style={{ backgroundColor: '#E7E9EB' }}>
                <h2 className="text-center">Dashboard</h2>
                <Stack spacing={2} divider={<Divider />}>
                    <div>
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
                                                <label className='form-label' htmlFor={inputProps.name}>
                                                    Date From
                                                </label>
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
                                                <label className='form-label' htmlFor={inputProps.name}>
                                                    Date To
                                                </label>
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
                        </Row>
                        <Row style={{ marginBottom: '2rem' }}>
                            <Col lg={4} xs={12}>
                                <CardCustom
                                    title={'Total income'}
                                    icon={<ReceiptLongIcon className="card-icon-avatar-image" />}
                                    value={200000000}
                                    setFormatValue={ConvertLongNumber}
                                    colorType={'primary'}
                                    duration={1000}
                                />
                            </Col>
                            <Col lg={4} xs={12}>
                                <CardCustom
                                    title={'Total Order'}
                                    icon={<AttachMoneyOutlinedIcon className="card-icon-avatar-image" />}
                                    value={100}
                                    setFormatValue={ConvertLongNumber}
                                    colorType={'warning'}
                                    duration={1000}
                                />
                            </Col>
                            <Col lg={4} xs={12}>
                                <CardCustom
                                    title={'Total new user'}
                                    icon={<GroupAddOutlinedIcon className="card-icon-avatar-image" />}
                                    value={60}
                                    setFormatValue={ConvertLongNumber}
                                    colorType={'success'}
                                    duration={1000}
                                />
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: '2rem' }}>
                            <Col lg={3} xs={12}>
                                <Card variant="outlined" className="card-custom" >
                                    <CardContent>
                                        <PolarArea
                                            data={dataChart2}
                                        />
                                    </CardContent>
                                </Card>
                            </Col>
                            <Col lg={3} xs={12}>
                                <Card variant="outlined" className="card-custom" >
                                    <CardContent>
                                        <Doughnut
                                            data={dataChart2}
                                        />
                                    </CardContent>
                                </Card>
                            </Col>
                            <Col lg={3} xs={12}>
                                <Card variant="outlined" className="card-custom" >
                                    <CardContent>
                                        <Doughnut
                                            data={dataChart2}
                                        />
                                    </CardContent>
                                </Card>
                            </Col>
                            <Col lg={3} xs={12}>
                                <Card variant="outlined" className="card-custom" >
                                    <CardContent>
                                        <Doughnut
                                            data={dataChart2}
                                        />
                                    </CardContent>
                                </Card>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: '2rem' }}>
                        </Row>
                    </div>
                    <div></div>
                </Stack>
            </div>
        </Fragment >
    )
}

export default Dashboard;