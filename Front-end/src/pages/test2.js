import React, { useState, useEffect } from "react";
import { ErrorMessage, Formik, Form } from "formik";
import { DropzoneArea } from "material-ui-dropzone";
import { storage } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


const initialValues = {
    files: [{}],
};

const TestUploadImage = (props) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileUpload, setFileUpload] = useState([]);
    const [dataUpload, setDataUpload] = useState([]);

    /** Handle upload image to firebase */
    useEffect(() => {
        console.log(dataUpload)
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
                // validationSchema={IdeaSchema}
                onSubmit={(values) => {
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
                    <Form>
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
                            id='attachment'
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

export default TestUploadImage;