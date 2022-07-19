import React, { useState, useEffect } from "react";
import { AxiosInstance } from "../api/AxiosClient";
import { RequestHeader } from "../api/AxiosComponent";
import { Formik, Form } from "formik";
import { TextField } from "../components/Form/TextField";
import { SelectField } from "../components/Form/SelectField";
import { BikeCategories } from "../components/Form/SelectItem";
import { DropzoneArea } from "material-ui-dropzone";
import { BikeSchema } from "../validation";
import { BikeManagement } from "../api/EndPoint";
import { storage } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AlertMessage } from "../components/Modal/AlertMessage";

const handleSubmit = async (bikeData, fileUpload, setAlert) => {
    const body = {
        name: bikeData.bikeName,
        bikeNo: bikeData.bikeNo,
        bikeCategory: bikeData.bikeCategory,
        files: fileUpload,
    };
    console.log(body);
    setAlert({
        alertShow: true,
        alertStatus: "success",
        alertMessage: "Create success",
    })

    // await AxiosInstance.post(BikeManagement.create, body, RequestHeader.checkAuthHeaders)
    //     .then((res) => {
    //         if (res.data.data !== null) {
    //             console.log(res.data.data);
    //         }
    //     })
    //     .catch((error) => {
    //         setAlert({
    //             alertShow: true,
    //             alertStatus: "danger",
    //             alertMessage: error,
    //         })
    //     });
};

const initialValues = {
    bikeName: "",
    bikeNo: "",
    bikeCategory: 0,
    files: [{}],
};

const Test = (props) => {
    const [isClicking, setIsClicking] = useState(false);
    const [isSubmiting, setIsSubmitting] = useState(false);
    const [imageUpload, setImageUpload] = useState([]);
    const [fileUpload, setFileUpload] = useState([]);
    const [bikeData, setBikeData] = useState({
        bikeName: "",
        bikeNo: "",
        bikeCategory: 0,
    });
    const [alert, setAlert] = useState({
        alertShow: false,
        alertStatus: "success",
        alertMessage: "",

    })

    /** Handle upload image to firebase */
    useEffect(() => {
        let upFiles = [];
        if (isClicking && imageUpload.length === 0) {
            setAlert({
                alertShow: true,
                alertStatus: "danger",
                alertMessage: "Bike should have at least one image.",
            })
        }
        else if (isClicking) {
            imageUpload.forEach((data) => {
                let fileName = `bike-image/${data.name}`;
                let imageRef = ref(storage, fileName);
                uploadBytes(imageRef, data).then(() => {
                    getDownloadURL(imageRef).then((url) => {
                        upFiles.push({
                            fileName: fileName.replace("bike-image/", ""),
                            filePath: url
                                .replace(
                                    "https://firebasestorage.googleapis.com/v0/b/bike-hiring-management-d7a01.appspot.com/o",
                                    ""
                                )
                                .replace("%", ""),
                        });
                    });
                });
            });
            setFileUpload(upFiles);
            setIsSubmitting(true);
        }
        setIsClicking(false);
    }, [isClicking, imageUpload]);
    /** Handle upload image to firebase */

    /** Handle submitting */
    useEffect(() => {
        if (isSubmiting) {
            handleSubmit(bikeData, fileUpload, setAlert);
        }
    }, [isSubmiting])
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

    return (
        <div className="container">
            <h1 className="text-center">Form</h1>

            <AlertMessage
                isShow={alert.alertShow}
                message={alert.alertMessage}
                status={alert.alertStatus}
            />

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
                        <TextField
                            label={"Bike Name"}
                            name={"bikeName"}
                            type={"text"}
                            placeholder={"Enter the bike name"}
                        />
                        <TextField
                            label={"Bike No"}
                            name={"bikeNo"}
                            type={"text"}
                            placeholder={"Enter your bike number"}
                        />
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