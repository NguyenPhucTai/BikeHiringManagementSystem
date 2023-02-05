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
import { SortSelect } from "../../components/Form/SortSelect";
import { TableOrderBikeList } from "../../components/Table/TableOrderBikeList";

// Function
import { ConvertLongNumber } from "../../function/ConvertLongNumber";

const cookies = new Cookies();

/*---------------- CONST LABEL -------------------*/
const labelChart2 = 'Revenue & Expense Chart';
const arrLabelChart2 = ['Total revenue', 'Total expense'];
const labelChart3 = 'Total Order By Type Chart';
const arrLabelChart3 = ['Close order', 'Cancel order', 'Pending order'];
const labelChart4 = 'Total Hired Number By Bike Category Chart';
const arrLabelChart4 = ['Manual Transmission', 'Automatic Transmission'];
const labelChart5 = 'Total Maintain By Type Chart';
const arrLabelChart5 = ['General Maintain', 'Bike Maintain'];

// YEAR DATA TEMP
export const SortYear = [
    { value: 2023, label: "2023", key: "1" },
    { value: 2022, label: "2022", key: "2" },
    { value: 2021, label: "2021", key: "3" },
    { value: 2020, label: "2020", key: "4" },
    { value: 2019, label: "2019", key: "5" },
    { value: 2018, label: "2018", key: "6" }
];

// NON-API FUNCTION
const setValueForCircleChart = (lable, arrLabel, arrData, setDataChart) => {
    setDataChart({
        labels: arrLabel,
        datasets: [{
            label: lable,
            data: arrData,
        }]
    })
}

const getListYear = () => {

}

// GET API FUNCTION
const handleGetByDateFromTo = async (
    startDate,
    endDate,
    setFirstChart,
    setSecondChart,
    setThirdChart,
    setFourthChart,
    setFifthChart,
    setListMonthDataCustomerRankHiredNumber,
    setListMonthDataCustomerRankHiredCost
) => {
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
            setSecondChart({
                totalExpense: res.data.data.secondChart.totalExpense,
                totalRevenue: res.data.data.secondChart.totalRevenue
            })
            setThirdChart({
                totalOrderPending: res.data.data.thirdChart.totalOrderPending,
                totalOrderCancel: res.data.data.thirdChart.totalOrderCancel,
                totalOrderClose: res.data.data.thirdChart.totalOrderClose
            })
            setFourthChart({
                totalBikeAutoHired: res.data.data.fourthChart.totalBikeAutoHired,
                totalBikeManualHired: res.data.data.fourthChart.totalBikeManualHired,
            })
            setFifthChart({
                totalMaintainBike: res.data.data.fifthChart.totalMaintainBike,
                totalMaintainGeneral: res.data.data.fifthChart.totalMaintainGeneral
            })

            var listMonthDataCustomerRankHiredNumber = res.data.data.sixthChart.listTopCustomerHiringNumber.map((data) => {
                return {
                    rank: data.rank,
                    name: data.name,
                    phoneNumber: data.phoneNumber,
                    hiredNumber: data.hiredNumber
                }
            })

            var listMonthDataCustomerRankHiredCost = res.data.data.sixthChart.listTopCustomerHiringCost.map((data) => {
                return {
                    rank: data.rank,
                    name: data.name,
                    phoneNumber: data.phoneNumber,
                    hiredCost: data.hiredCost
                }
            })
            setListMonthDataCustomerRankHiredNumber(listMonthDataCustomerRankHiredNumber)
            setListMonthDataCustomerRankHiredCost(listMonthDataCustomerRankHiredCost)
        }).catch((error) => {
            if (error && error.response) {
                console.log("Error: ", error);
            }
        });
    }
};

const handleGetByYear = async (
    year,
    setListMonthDataCustomerRankHiredNumber,
    setListMonthDataCustomerRankHiredCost
) => {
    const body = {
        year: year
    };
    await AxiosInstance.post(DashboardAPI.getByYear, body, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        // console.log(res.data.data)
        // var listMonthDataCustomerRankHiredNumber = res.data.data.monthChart.listMonthData.map((data) => {
        //     return {
        //         id: data.id,
        //         name: data.name,
        //         price: GetFormattedCurrency(data.price)
        //     }
        // })
        // var listMonthDataCustomerRankHiredCost = res.data.data.monthChart.listMonthData.map((data) => {
        //     return {
        //         id: data.id,
        //         name: data.name,
        //         price: GetFormattedCurrency(data.price)
        //     }
        // })
    }).catch((error) => {
        if (error && error.response) {
            console.log("Error: ", error);
        }
    });
}

function Dashboard() {

    // Show Public Navigation
    const dispatch = useDispatch();
    const [loadingPage, setLoadingPage] = useState(true);
    if (loadingPage === true) {
        dispatch(reduxAuthenticateAction.updateIsShowPublicNavBar(false));
        setLoadingPage(false);
    }

    // TABLE TITLE
    const tableTitleListCustomerHiredNumber = [
        { name: 'RANK', width: '25%' },
        { name: 'NAME', width: '25%' },
        { name: 'PHONE NUMBER', width: '25%' },
        { name: 'HIRED NUMBER', width: '25%' }
    ]

    const tableTitleListCustomerHiredCost = [
        { name: 'RANK', width: '25%' },
        { name: 'NAME', width: '25%' },
        { name: 'PHONE NUMBER', width: '25%' },
        { name: 'HIRED COST', width: '25%' }
    ]


    // SEARCH DATA 
    var now = dayjs();
    const [startDate, setStartDate] = useState(now.startOf('year'));
    const [endDate, setEndDate] = useState(now);
    const [year, setYear] = useState(now.get('year'))


    /*----------- DATA API----------*/
    const [firstChart, setFirstChart] = useState({
        totalIncome: 0,
        totalOrder: 0,
        totalNewUser: 0
    })
    const [secondChart, setSecondChart] = useState({
        totalExpense: 0,
        totalRevenue: 0
    })
    const [thirdChart, setThirdChart] = useState({
        totalOrderPending: 0,
        totalOrderCancel: 0,
        totalOrderClose: 0
    })
    const [fourthChart, setFourthChart] = useState({
        totalBikeAutoHired: 0,
        totalBikeManualHired: 0
    })
    const [fifthChart, setFifthChart] = useState({
        totalMaintainBike: 0,
        totalMaintainGeneral: 0
    })
    const [listMonthDataCustomerRankHiredNumber, setListMonthDataCustomerRankHiredNumber] = useState([]);
    const [listMonthDataCustomerRankHiredCost, setListMonthDataCustomerRankHiredCost] = useState([]);


    /*----------- DATA IN CHART----------*/
    const [dataChart2, setDataChart2] = useState({
        labels: [],
        datasets: [{
            label: '',
            data: [],
        }]
    });
    const [dataChart3, setDataChart3] = useState({
        labels: [],
        datasets: [{
            label: '',
            data: [],
        }]
    });
    const [dataChart4, setDataChart4] = useState({
        labels: [],
        datasets: [{
            label: '',
            data: [],
        }]
    });
    const [dataChart5, setDataChart5] = useState({
        labels: [],
        datasets: [{
            label: '',
            data: [],
        }]
    });

    // USE EFFECT
    // Page loading
    useEffect(() => {
        handleGetByDateFromTo(
            startDate,
            endDate,
            setFirstChart,
            setSecondChart,
            setThirdChart,
            setFourthChart,
            setFifthChart,
            setListMonthDataCustomerRankHiredNumber,
            setListMonthDataCustomerRankHiredCost
        );
        handleGetByYear(
            year,
            setListMonthDataCustomerRankHiredNumber,
            setListMonthDataCustomerRankHiredCost
        );
    }, [startDate, endDate])


    // USE EFFECT
    // CHANGE YEAR
    useEffect(() => {
        console.log(year)
    }, [year])

    // USE EFFECT
    // CHART DATA CHANGED
    // CHART 2
    useEffect(() => {
        let arrData = [];
        arrData.push(secondChart.totalRevenue);
        arrData.push(secondChart.totalExpense);
        setValueForCircleChart(labelChart2, arrLabelChart2, arrData, setDataChart2);
    }, [secondChart])

    // CHART 3
    useEffect(() => {
        let arrData = [];
        arrData.push(thirdChart.totalOrderClose);
        arrData.push(thirdChart.totalOrderCancel);
        arrData.push(thirdChart.totalOrderPending);
        setValueForCircleChart(labelChart3, arrLabelChart3, arrData, setDataChart3);
    }, [thirdChart])

    // CHART 4
    useEffect(() => {
        let arrData = [];
        arrData.push(fourthChart.totalBikeManualHired);
        arrData.push(fourthChart.totalBikeAutoHired);
        setValueForCircleChart(labelChart4, arrLabelChart4, arrData, setDataChart4);
    }, [fourthChart])

    // CHART 5
    useEffect(() => {
        let arrData = [];
        arrData.push(fifthChart.totalMaintainGeneral);
        arrData.push(fifthChart.totalMaintainBike);
        setValueForCircleChart(labelChart5, arrLabelChart5, arrData, setDataChart5);
    }, [fifthChart])

    return (
        <Fragment>
            <div className="container" style={{ backgroundColor: '#E7E9EB' }}>
                <h2 className="text-center">Dashboard</h2>
                <Stack spacing={2} divider={<Divider />}>
                    <div>

                        {/* Search Bar Date TO FROM */}
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

                        {/* Chart Date To */}
                        {/* Chart 1 */}
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

                        {/* Circle chart */}
                        <Row style={{ marginBottom: '2rem' }}>
                            {/* Chart 2 */}
                            <Col lg={3} xs={12}>
                                <Card variant="outlined" className="card-custom" >
                                    <CardContent>
                                        <PolarArea
                                            data={dataChart2}
                                        />
                                    </CardContent>
                                </Card>
                            </Col>

                            {/* Chart 3 */}
                            <Col lg={3} xs={12}>
                                <Card variant="outlined" className="card-custom" >
                                    <CardContent>
                                        <Doughnut
                                            data={dataChart3}
                                        />
                                    </CardContent>
                                </Card>
                            </Col>

                            {/* Chart 4 */}
                            <Col lg={3} xs={12}>
                                <Card variant="outlined" className="card-custom" >
                                    <CardContent>
                                        <Doughnut
                                            data={dataChart4}
                                        />
                                    </CardContent>
                                </Card>
                            </Col>

                            {/* Chart 5 */}
                            <Col lg={3} xs={12}>
                                <Card variant="outlined" className="card-custom" >
                                    <CardContent>
                                        <Doughnut
                                            data={dataChart5}
                                        />
                                    </CardContent>
                                </Card>
                            </Col>
                        </Row>

                        {/* Rank table */}
                        <Row style={{ marginBottom: '2rem' }}>
                            <Col lg={6} xs={12}>
                                <label className='form-label'>RANKING CUSTOMER HIRED NUMBER</label>
                                {Object.keys(listMonthDataCustomerRankHiredNumber).length !== 0 ?
                                    <TableOrderBikeList
                                        tableTitleList={tableTitleListCustomerHiredNumber}
                                        listData={listMonthDataCustomerRankHiredNumber}
                                        isShowButtonDelete={false}
                                    />
                                    :
                                    <div>No data found</div>
                                }
                            </Col>
                            <Col lg={6} xs={12}>
                                <label className='form-label'>RANKING CUSTOMER HIRED COST</label>
                                {Object.keys(listMonthDataCustomerRankHiredCost).length !== 0 ?
                                    <TableOrderBikeList
                                        tableTitleList={tableTitleListCustomerHiredCost}
                                        listData={listMonthDataCustomerRankHiredCost}
                                        isShowButtonDelete={false}
                                    />
                                    :
                                    <div>No data found</div>
                                }
                            </Col>
                        </Row>

                        {/* SELECT Date By year */}
                        <Row style={{ marginBottom: '2rem' }}>
                            <Col lg={3} xs={6}>
                                <SortSelect
                                    label={'Sort By Year'}
                                    name={'year'}
                                    options={SortYear}
                                    defaultValue={{ label: year, value: year }}
                                    onChange={(value) => {
                                        setYear(value.value)
                                    }}
                                />
                            </Col>
                        </Row>
                    </div>
                    <div></div>
                </Stack>
            </div>
        </Fragment >
    )
}

export default Dashboard;