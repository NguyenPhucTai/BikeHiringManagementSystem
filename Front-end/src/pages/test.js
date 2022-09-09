import React, { useState, useEffect, useRef } from "react";
import { AxiosInstance } from "../api/AxiosClient";
import { Formik, Form } from "formik";
import { TextField } from "../components/Form/TextField";
import { SelectField } from "../components/Form/SelectField";
import { BikeCategories } from "../components/Form/SelectItem";
import { DropzoneArea } from "material-ui-dropzone";
import { BikeSchema } from "../validation";
import { BikeManagement } from "../api/EndPoint";
import { storage } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { AlertMessage } from "../components/Modal/AlertMessage";
import { GenerateRandomString } from "../function/RandomString";
import Cookies from 'universal-cookie';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const cookies = new Cookies();

const handleSubmit = async (bikeData, fileUpload, setAlert, setIsSubmitting, setFileUpload, setLoading) => {

    const body = {
        name: bikeData.bikeName,
        bikeNo: bikeData.bikeNo,
        bikeCategory: bikeData.bikeCategory,
        files: fileUpload,
    };

    await AxiosInstance.post(BikeManagement.create, body, {
        headers: { Authorization: `Bearer ${cookies.get('accessToken')}` },
    })
        .then((res) => {
            setIsSubmitting(false)
            console.log(res)
            if (res.data.code === 1) {
                setAlert({
                    alertShow: true,
                    alertStatus: "success",
                    alertMessage: "Create success",
                })
                setFileUpload([]);
                setLoading(false);
            } else {
                setAlert({
                    alertShow: true,
                    alertStatus: "danger",
                    alertMessage: res.data.message,
                })
                fileUpload.forEach((data) => {
                    const imageRef = ref(storage, `bike-image/${data.fileName}`);
                    deleteObject(imageRef).then(() => {
                        // File deleted successfully
                    }).catch((error) => {
                        // Uh-oh, an error occurred!
                    });
                })
                setFileUpload([]);
                setLoading(false);
            }
        })
        .catch((error) => {
            setAlert({
                alertShow: true,
                alertStatus: "danger",
                alertMessage: error,
            })
            setLoading(false);
        });
};

const initialValues = {
    bikeManualId: "",
    bikeName: "",
    bikeNo: "",
    bikeCategory: 0,
    manufacturer: 0,
    color: 0,
    files: [{}],
};

const Test = (props) => {
    // Upload bike
    const [isClicking, setIsClicking] = useState(false);
    const [isSubmiting, setIsSubmitting] = useState(false);
    const [imageUpload, setImageUpload] = useState([]);
    const [fileUpload, setFileUpload] = useState([]);
    const [bikeData, setBikeData] = useState({
        bikeName: "",
        bikeNo: "",
        bikeCategory: 0,
    });
    // Alert messaegg
    const [alert, setAlert] = useState({
        alertShow: false,
        alertStatus: "success",
        alertMessage: "",
    })
    // Loading bar
    const [loading, setLoading] = useState(false);
    const timer = useRef();

    /** Handle upload image to firebase */
    useEffect(() => {

        // let upFiles = [];
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
    /** Handle upload image to firebase */

    /** Handle submitting */
    useEffect(() => {
        if (isSubmiting && imageUpload.length === fileUpload.length) {
            handleSubmit(bikeData, fileUpload, setAlert, setIsSubmitting, setFileUpload, setLoading);
        }
    }, [isSubmiting, fileUpload])
    /** Handle submitting */

    const handleFileUpload = (event) => {
        let values = event.target.value
        values.forEach((data) => {
            setImageUpload(prevState => {
                return [...prevState, event.target.value[values.indexOf(data)]];
            });
        })
    };

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

    /** Handle loading bar */
    useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    /** Handle loading bar  */
    return (
        <div className="container">
            <h1 className="text-center">Form</h1>

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
                    isSubmiting,
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
                                    options={BikeCategories}
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
                                    name={"manufacturer"}
                                    options={BikeCategories}
                                    placeholder={"Choose bike manufacturer"}
                                    onChange={(selectOption) => {
                                        setFieldValue("manufacturer", selectOption.value);
                                    }}
                                    onBlur={() => {
                                        handleBlur({ target: { name: "manufacturer" } });
                                    }}
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                <SelectField
                                    label={"Bike Color"}
                                    name={"color"}
                                    options={BikeCategories}
                                    placeholder={"Choose bike color"}
                                    onChange={(selectOption) => {
                                        setFieldValue("color", selectOption.value);
                                    }}
                                    onBlur={() => {
                                        handleBlur({ target: { name: "color" } });
                                    }}
                                />
                            </Col>
                        </Row>
                        <DropzoneArea
                            acceptedFiles={[
                                ".png,.jpg,.jpeg",
                            ]}
                            showPreviews={true}
                            maxFileSize={10000000}
                            fullWidth={true}
                            dropzoneText='Drop files to attach or browse'
                            filesLimit={10}
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
    )
}

export default Test;