export const Authen = {
    signUp: "/authen/signup",
    signIn: "/authen/signin",
}

export const Role = {
    create: "/admin/role/create/",
}

export const BikeManagement = {
    create: "/admin/bike/create",
    get: "/public/bike/get",
    getCategory: "/public/bike-category/get",
    getColor: "/public/bike-color/get",
    getManufacturer: "/public/bike-manufacturer/get",
    getDetail: "/public/bike/get?bikeId="
};

export const CategoryManagement = {
    create: "/admin/bike-category/create",
    update: "/admin/bike-category/update/",
    get: "/public/bike-category/get",
}

export const Firebase_URL = "https://firebasestorage.googleapis.com/v0/b/bike-hiring-management-d7a01.appspot.com/o/bike-image%2F"