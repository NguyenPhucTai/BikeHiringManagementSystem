import * as Yup from "yup";

export const BikeSchema = Yup.object().shape({
    bikeName: Yup.string().required("Bike Name is required"),
    bikeNo: Yup.string().required("Bike No is required"),
    bikeCategory: Yup.number().min(1, "Bike Category is required"),
});

export const UserSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
});