import * as Yup from "yup";

export const BikeSchema = Yup.object().shape({
    bikeManualId: Yup.string().required("Bike Manual Id is required"),
    bikeName: Yup.string().required("Bike Name is required"),
    bikeNo: Yup.string().required("Bike No is required"),
    bikeCategory: Yup.number().min(1, "Bike Category is required"),
    manufacturer: Yup.number().min(1, "Bike Manufacturer is required"),
    color: Yup.number().min(1, "Bike Color is required"),
});

export const UserSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
});