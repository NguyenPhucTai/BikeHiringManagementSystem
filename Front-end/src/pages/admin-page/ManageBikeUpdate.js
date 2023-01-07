import React, { Fragment, useState, useEffect, useRef } from "react";

// Library
import { AxiosInstance } from "../../api/AxiosClient";
import { Formik, Form } from "formik";
import { DropzoneArea } from "material-ui-dropzone";
import { BikeSchema } from "../../validation";
import Cookies from 'universal-cookie';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useParams } from "react-router-dom";

// Firebase
import { storage } from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Component
import { AlertMessage } from "../../components/Modal/AlertMessage";
import { TextField } from "../../components/Form/TextField";
import { SelectField } from "../../components/Form/SelectField";
import { BikeManagement, CategoryManagement, ColorManagement, ManufacturerManagement } from "../../api/EndPoint";
import { GenerateRandomString } from "../../function/RandomString";
import { PageLoad } from '../../components/Base/PageLoad';

const cookies = new Cookies();



// FUNCTION
// INTERNAL PAGE
const showAlert = (setAlert, message, isSuccess) => {
    if (isSuccess) {
        setAlert({
            alertShow: true,
            alertStatus: "success",
            alertMessage: message
        })
    } else {
        setAlert({
            alertShow: true,
            alertStatus: "error",
            alertMessage: message
        })
    }
}

// FUNCTION
// CALL API
const handleGetBikeById = async (id, setData) => {

    await AxiosInstance.get(BikeManagement.getById + id, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        if (res.data.code === 1) {
            setData(res.data.data);
        }
    }).catch((error) => {
        if (error && error.response) {
            console.log("Error: ", error);
        }
    });
};

const handleGetCategoryList = async (setListCategory) => {
    const body = {
        searchKey: null,
        page: 1,
        limit: 100,
        sortBy: "name",
        sortType: "ASC"
    };
    await AxiosInstance.post(CategoryManagement.getPagination, body, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        var listCategory = res.data.data.content.map((data) => {
            return {
                value: data.id,
                label: data.name,
                key: data.id,
            }
        })
        setListCategory(listCategory)
    })
        .catch((error) => {
            if (error && error.response) {
                console.log("Error: ", error);
            }
        });
};

const handleGetColorList = async (setListColor) => {
    const body = {
        searchKey: null,
        page: 1,
        limit: 100,
        sortBy: "name",
        sortType: "ASC"
    };
    await AxiosInstance.post(ColorManagement.getPagination, body, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        var listColor = res.data.data.content.map((data) => {
            return {
                value: data.id,
                label: data.name,
                key: data.id,
            }
        })
        setListColor(listColor)
    })
        .catch((error) => {
            if (error && error.response) {
                console.log("Error: ", error);
            }
        });
};

const handleGetManufacturerList = async (setListManufacturer) => {
    const body = {
        searchKey: null,
        page: 1,
        limit: 100,
        sortBy: "name",
        sortType: "ASC"
    };
    await AxiosInstance.post(ManufacturerManagement.getPagination, body, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
    }).then((res) => {
        var listManufacturer = res.data.data.content.map((data) => {
            return {
                value: data.id,
                label: data.name,
                key: data.id,
            }
        })
        setListManufacturer(listManufacturer)
    })
        .catch((error) => {
            if (error && error.response) {
                console.log("Error: ", error);
            }
        });
};

const handleSubmit = async (bikeData, fileUpload, setAlert, setIsSubmitting, setFileUpload, setLoading) => {

    const body = {
        name: bikeData.bikeName,
        bikeManualId: bikeData.bikeManualId,
        bikeNo: bikeData.bikeNo,
        bikeCategoryId: bikeData.bikeCategory,
        bikeColorId: bikeData.bikeColor,
        bikeManufacturerId: bikeData.bikeManufacturer,
        files: fileUpload,
    };
    console.log(body);

    // await AxiosInstance.post(BikeManagement.create, body, {
    //     headers: { Authorization: `Bearer ${cookies.get('accessToken')}` },
    // })
    //     .then((res) => {
    //         setIsSubmitting(false)
    //         console.log(res)
    //         if (res.data.code === 1) {
    //             showAlert(setAlert, "Create success", true)
    //             setFileUpload([]);
    //             setLoading(false);
    //         } else {
    //             showAlert(setAlert, res.data.message, false)
    //             fileUpload.forEach((data) => {
    //                 const imageRef = ref(storage, `bike-image/${data.fileName}`);
    //                 deleteObject(imageRef).then(() => {
    //                     // File deleted successfully
    //                 }).catch((error) => {
    //                     // Uh-oh, an error occurred!
    //                 });
    //             })
    //             setFileUpload([]);
    //             setLoading(false);
    //         }
    //     })
    //     .catch((error) => {
    //         showAlert(setAlert, error, false)
    //         setLoading(false);
    //     });
};


function ManageBikeUpdate() {

    // GET ID FROM URL
    let { id } = useParams()

    // INITIALIZE USE STATE
    // VARIABLE
    // PAGE LOADING
    const [loadingData, setLoadingData] = useState(true);

    // VARIABLE
    // UPDATE BIKE
    const [isClicking, setIsClicking] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageUpload, setImageUpload] = useState([]);
    const [fileUpload, setFileUpload] = useState([]);
    const [bikeData, setBikeData] = useState({
        bikeName: "",
        bikeNo: "",
        bikeCategory: 0,
    });
    const [listCategory, setListCategory] = useState([]);
    const [listColor, setListColor] = useState([]);
    const [listManufacturer, setListManufacturer] = useState([]);
    const [data, setData] = useState({});

    // VARIABLE
    // ALERT MESSAGE
    const [alert, setAlert] = useState({
        alertShow: false,
        alertStatus: "success",
        alertMessage: "",
    })

    // VARIABLE
    // LOADING BAR
    const [loading, setLoading] = useState(false);
    const timer = useRef();

    // Formik variables
    const initialValues = {
        bikeName: "",
        bikeManualId: "",
        bikeNo: "",
        bikeCategory: 0,
        bikeColor: 0,
        bikeManufacturer: 0,
        files: [{}],
    };

    // IMAGE HANDLING
    // USE EFFECT
    // UPLOAD IMAGE TO FIREBASE
    useEffect(() => {
        if (isClicking && imageUpload.length === 0) {
            handleSubmit(bikeData, fileUpload, setAlert, setIsSubmitting, setFileUpload, setLoading);
        }
        else if (isClicking) {
            var index = 0;
            imageUpload.forEach((data) => {
                index++;
                let randomString = GenerateRandomString(10);
                let fileName = `bike-image/${index}-${data.name}-${randomString}`;
                let imageRef = ref(storage, fileName);
                uploadBytes(imageRef, data).then(() => {
                    getDownloadURL(imageRef).then((url) => {
                        setFileUpload(prevState => {
                            return [...prevState, {
                                fileName: fileName.replace("bike-image/", ""),
                                filePath: url
                                    .replace(
                                        "https://firebasestorage.googleapis.com/v0/b/bike-hiring-management-d7a01.appspot.com/o/bike-image%2F",
                                        ""
                                    )
                            }];
                        })
                    });
                });
            });
            setIsSubmitting(true);
        }
        setIsClicking(false);
    }, [isClicking, imageUpload]);

    // USE EFFECT
    // HANDLING SUBMIT FORM
    useEffect(() => {
        if (isSubmitting && imageUpload.length === fileUpload.length) {
            handleSubmit(bikeData, fileUpload, setAlert, setIsSubmitting, setFileUpload, setLoading);
        }
    }, [isSubmitting, fileUpload])

    // FUNCTION
    // UPLOAD IMAGE
    const handleFileUpload = (event) => {
        let values = event.target.value
        values.forEach((data) => {
            setImageUpload(prevState => {
                return [...prevState, event.target.value[values.indexOf(data)]];
            });
        })
    };

    // FUNCTION
    // REMOVE IMAGE
    const handleFileRemove = (file) => {
        setImageUpload(prevState => {
            let currentData = prevState;
            currentData.forEach((data) => {
                if (data.path === file.path) {
                    let index = currentData.indexOf(data);
                    currentData.splice(index, 1);
                }
            });
            return currentData;
        });
    };

    // USE EFFECT
    // LOADING BAR - UPLOAD IMAGE
    useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);


    // USE EFFECT
    // PAGE LOADING
    useEffect(() => {
        if (loadingData) {
            handleGetCategoryList(setListCategory);
            handleGetColorList(setListColor);
            handleGetManufacturerList(setListManufacturer)
            handleGetBikeById(id, setData);
            setLoadingData(false)
        }
    }, [loadingData])


    // Update initialValues
    if (Object.keys(data).length !== 0) {
        initialValues.bikeManualId = data.bikeManualId;
        initialValues.bikeName = data.name;
        initialValues.bikeNo = data.bikeNo;
        initialValues.bikeCategory = data.bikeCategoryId;
        initialValues.bikeManufacturer = data.bikeManufacturerId;
        initialValues.bikeColor = data.bikeColorId;
    }

    return (
        !loadingData ?
            <div className="container">
                <h1 className="text-center">UPDATE BIKE</h1>
                <AlertMessage
                    isShow={alert.alertShow}
                    message={alert.alertMessage}
                    status={alert.alertStatus}
                />
                {loading && (
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>
                )}
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={BikeSchema}
                    onSubmit={(values) => {
                        setAlert({
                            alertShow: false,
                            alertStatus: "success",
                        })
                        setBikeData(values)
                        setIsClicking(true);
                        setLoading(true);
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
                                <Col xs={12} sm={6}>
                                    <TextField
                                        label={"Bike Manual Id"}
                                        name={"bikeManualId"}
                                        type={"text"}
                                        placeholder={"Enter the bike manual id"}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <TextField
                                        label={"Bike Name"}
                                        name={"bikeName"}
                                        type={"text"}
                                        placeholder={"Enter the bike name"}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <TextField
                                        label={"Bike No"}
                                        name={"bikeNo"}
                                        type={"text"}
                                        placeholder={"Enter your bike number"}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <SelectField
                                        label={"Bike Category"}
                                        name={"bikeCategory"}
                                        options={listCategory}
                                        value={{ label: data.bikeCategoryName, value: data.bikeCategoryId }}
                                        placeholder={"Choose bike category"}
                                        onChange={(selectOption) => {
                                            setFieldValue("bikeCategory", selectOption.value);
                                        }}
                                        onBlur={() => {
                                            handleBlur({ target: { name: "bikeCategory" } });
                                        }}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <SelectField
                                        label={"Bike Manufacturer"}
                                        name={"bikeManufacturer"}
                                        options={listManufacturer}
                                        value={{ label: data.bikeManufacturerName, value: data.bikeManufacturerId }}
                                        placeholder={"Choose bike manufacturer"}
                                        onChange={(selectOption) => {
                                            setFieldValue("bikeManufacturer", selectOption.value);
                                        }}
                                        onBlur={() => {
                                            handleBlur({ target: { name: "bikeManufacturer" } });
                                        }}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <SelectField
                                        label={"Bike Color"}
                                        name={"bikeColor"}
                                        options={listColor}
                                        value={{ label: data.bikeColor, value: data.bikeColorId }}
                                        placeholder={"Choose bike color"}
                                        onChange={(selectOption) => {
                                            setFieldValue("bikeColor", selectOption.value);
                                        }}
                                        onBlur={() => {
                                            handleBlur({ target: { name: "bikeColor" } });
                                        }}
                                    />
                                </Col>
                            </Row>
                            <div className="image-section">
                                <label className='form-label'>Bike Images</label>
                                <Row>
                                    <Col className="column" xs={12} sm={6} md={4} lg={3}>
                                        <div className="card-item">
                                            <div className="text-right" style={{ textAlign: "right" }}>
                                                <button type="button" style={{ border: '0' }}><HighlightOffIcon /></button>
                                            </div>
                                            <div className="card-body">
                                                <img src="https://image.thanhnien.vn/1200x630/Uploaded/2022/hgnatm/z-ba-hung-2021/thang-7-2021/xe-may-so/xe-may-so_thanhnien-3_tdnb.jpg" />
                                            </div>
                                        </div>
                                    </Col>

                                </Row>
                            </div>
                            <DropzoneArea
                                acceptedFiles={[
                                    ".png,.jpg,.jpeg",
                                ]}
                                showPreviews={true}
                                maxFileSize={10000000}
                                fullWidth={true}
                                dropzoneText='Drop files to attach or browse'
                                filesLimit={4}
                                showFileNamesInPreview={true}
                                showPreviewsInDropzone={false}
                                showAlerts={false}
                                name='file'
                                id='bikeImage'
                                onDelete={(file) => {
                                    handleFileRemove(file);
                                }}
                                onDrop={(dropFiles) => {
                                    let event = {
                                        target: {
                                            name: "files",
                                            value: dropFiles,
                                        },
                                    };
                                    handleChange(event);
                                    handleFileUpload(event);
                                }}
                            />
                            <button type="submit" className="btn btn-dark btn-md mt-3">
                                Submit
                            </button>
                        </Form>
                    )}
                </Formik>

            </div>
            :
            <Fragment>
                <PageLoad />
            </Fragment>
    )
}

export default ManageBikeUpdate;