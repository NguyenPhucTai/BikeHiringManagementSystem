import React, { useState, useEffect } from "react";
import axios from "axios";
import { ErrorMessage, Formik, Form } from "formik";
import { TextField } from "../components/Form/TextField";
import { SelectField } from "../components/Form/SelectField";
import { BikeCategories } from "../components/Form/SelectItem";
import { DropzoneArea } from "material-ui-dropzone";
import { BikeSchema } from "../validation";
import { BikeManagement } from "../api/EndPoint";
import { storage } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const handleSubmit = async (values, setBikeId) => {
    const body = {
        name: values.bikeName,
        bikeNo: values.bikeNo,
        bikeCategory: values.bikeCategory,
    };

    await axios.post(BikeManagement.create, body, {
        headers: {
            accept: 'application/json',
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    })
        .then((res) => {
            if (res.data.data !== null) {
                setBikeId(res.data.data);
            }
        })
        .catch((error) => {
            console.log(error)
        });
};

const initialValues = {
    bikeName: "",
    bikeNo: "",
    bikeCategory: 0,
    files: [{}],
};

const Test = (props) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bikeId, setBikeId] = useState(0);
    const [fileUpload, setFileUpload] = useState([]);
    const [dataUpload, setDataUpload] = useState([]);

    /** Handle upload image to firebase */
    useEffect(() => {
        if (dataUpload.length === 0) {
            return;
        }
        let upFiles = [];
        if (isSubmitting) {
            dataUpload.forEach((data) => {
                let fileName = `bike-image/${data.name}`;
                let imageRef = ref(storage, fileName);
                uploadBytes(imageRef, data).then(() => {
                    getDownloadURL(imageRef).then((url) => {
                        upFiles.push({
                            fileName: fileName.replace("bike-image/", ""),
                            filePath: url
                                .replace(
                                    "https://firebasestorage.googleapis.com/v0/b/bike-hiring-management-b185c.appspot.com/o",
                                    ""
                                )
                                .replace("%", ""),
                        });
                    });
                });
            });
            setFileUpload(upFiles);
        }
        setIsSubmitting(false);
    }, [isSubmitting, dataUpload]);

    const handleFileUpload = (event) => {
        let values = event.target.value
        values.forEach((data) => {
            setDataUpload(prevState => {
                return [...prevState, event.target.value[values.indexOf(data)]];
            });
        })
    };

    const handleFileRemove = (file) => {
        setDataUpload(prevState => {
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

            <Formik
                initialValues={initialValues}
                validationSchema={BikeSchema}
                onSubmit={(values) => {
                    handleSubmit(values, setBikeId);
                    setIsSubmitting(true);
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