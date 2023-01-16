import * as Yup from "yup";

export const BikeSchema = Yup.object().shape({
    bikeManualId: Yup.string().required("Bike Manual Id is required"),
    bikeName: Yup.string().required("Bike Name is required"),
    bikeNo: Yup.string().required("Bike No is required"),
    bikeCategory: Yup.number().min(1, "Bike Category is required"),
    bikeManufacturer: Yup.number().min(1, "Bike Manufacturer is required"),
    bikeColor: Yup.number().min(1, "Bike Color is required"),
});

export const OrderSchema = Yup.object().shape({
    customerName: Yup.string().required("Customer Name is required"),
    phoneNumber: Yup.string().required("Phone Number is required"),
    calculatedCost: Yup.number().min(1, "Calculated Cost is required").required("Calculated Cost is required"),
    serviceDescription: Yup.string()
        .when('isUsedService', {
            is: (isUsedService) => isUsedService === true,
            then: Yup.string().required("Service description is required"),
        }),
    serviceCost: Yup.number()
        .when('isUsedService', {
            is: (isUsedService) => isUsedService === true,
            then: Yup.number().min(1, "Service Cost must be greater than 0"),
        }),
    depositIdentifyCard: Yup.string()
        .when('depositType', {
            is: (depositType) => depositType === 'identifyCard',
            then: Yup.string().required("Identify Card is required")
        }),
    depositAmount: Yup.number()
        .when('depositType', {
            is: (depositType) => depositType === 'money',
            then: Yup.number().min(1, "Deposit Amount must be greater than 0").required("Deposit Amount is required"),
        }),
    depositHotel: Yup.string()
        .when('depositType', {
            is: (depositType) => depositType === 'hotel',
            then: Yup.string().required("Hotel address is required"),
        }),
    note: Yup.string().required("Note is required"),
    totalAmount: Yup.number().min(1, "Total amount required").required("Total amount is required"),
});

export const UserSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
});