import React, { useState, useEffect, Fragment } from "react";

// Redux
import { useDispatch } from "react-redux";
import { reduxAuthenticateAction } from "../../redux-store/redux/reduxAuthenticate.slice";

// Library
import { AxiosInstance } from "../../api/AxiosClient";
import Cookies from 'universal-cookie';
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
import { DashboardAPI } from "../../api/EndPoint";
import { CardCustom } from "../../components/Card/CardCustom";

// Function
import { ConvertLongNumber } from "../../function/ConvertLongNumber";

const cookies = new Cookies();

const handleGetByDateFromTo = async (startDate, endDate, setFirstChart) => {
    if (endDate.isAfter(startDate)) {
        const body = {
            dateFrom: startDate,
            dateTo: endDate,
        };
        await AxiosInstance.post(DashboardAPI.getByDateFromTo, body, {
            headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
        }).then((res) => {
            setFirstChart({
                totalIncome: res.data.data.firstChart.totalIncome,
                totalOrder: res.data.data.firstChart.totalOrder,
                totalNewUser: res.data.data.firstChart.totalNewCustomer
            })
        }).catch((error) => {
            if (error && error.response) {
                console.log("Error: ", error);
            }
        });
    }
};

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
    const [firstChart, setFirstChart] = useState({
        totalIncome: 0,
        totalOrder: 0,
        totalNewUser: 0
    })

    useEffect(() => {
        handleGetByDateFromTo(startDate, endDate, setFirstChart);
    }, [startDate, endDate])

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
                                    value={firstChart.totalIncome}
                                    setFormatValue={ConvertLongNumber}
                                    colorType={'primary'}
                                    duration={1000}
                                />
                            </Col>
                            <Col lg={4} xs={12}>
                                <CardCustom
                                    title={'Total Order'}
                                    icon={<AttachMoneyOutlinedIcon className="card-icon-avatar-image" />}
                                    value={firstChart.totalOrder}
                                    setFormatValue={ConvertLongNumber}
                                    colorType={'warning'}
                                    duration={1000}
                                />
                            </Col>
                            <Col lg={4} xs={12}>
                                <CardCustom
                                    title={'Total new user'}
                                    icon={<GroupAddOutlinedIcon className="card-icon-avatar-image" />}
                                    value={firstChart.totalNewUser}
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