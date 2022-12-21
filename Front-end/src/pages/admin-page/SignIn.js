import React, { useState } from "react";
import { AxiosInstance } from "../../api/AxiosClient";
import Cookies from 'universal-cookie';
import { Authen } from "../../api/EndPoint";
import { TextField } from "../../components/Form/TextField";
import { Formik, Form } from "formik";
import { UserSchema } from "../../validation";
import { AlertMessage } from "../../components/Modal/AlertMessage";

const cookies = new Cookies();

const initialValues = {
    username: "",
    password: "",
};

const handleSignIn = async (values, setAlert) => {
    const body = {
        username: values.username,
        password: values.password,
    };
    await AxiosInstance.post(Authen.signIn, body)
        .then((res) => {
            if (res.data.code === 1) {
                cookies.set('accessToken', res.data.data.token);
                setAlert({
                    alertShow: true,
                    alertStatus: "success",
                    alertMessage: "Sign in success",
                })
            } else {
                setAlert({
                    alertShow: true,
                    alertStatus: "danger",
                    alertMessage: res.data.message,
                })
            }
        })
        .catch((error) => {
            setAlert({
                alertShow: true,
                alertStatus: "danger",
                alertMessage: error,
            })
        })
}

function SignIn() {
    const [alert, setAlert] = useState({
        alertShow: false,
        alertStatus: "success",
        alertMessage: "",
    })

    return (
        <div className="container">
            <h1 className="text-center">Sign In</h1>

            <AlertMessage
                isShow={alert.alertShow}
                message={alert.alertMessage}
                status={alert.alertStatus}
            />

            <Formik
                initialValues={initialValues}
                validationSchema={UserSchema}
                onSubmit={(values) => {
                    handleSignIn(values, setAlert);
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
                        <TextField
                            label={"Username"}
                            name={"username"}
                            type={"text"}
                            placeholder={"Enter the username"}
                        />
                        <TextField
                            label={"Password"}
                            name={"password"}
                            type={"password"}
                            placeholder={"Enter the password"}
                        />
                        <button type="submit" className="btn btn-dark btn-md mt-3">
                            Sign In
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignIn;