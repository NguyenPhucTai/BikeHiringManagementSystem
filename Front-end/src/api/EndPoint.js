export const Authen = {
    signUp: "/authen/signup",
    signIn: "/authen/signin",
}

export const Role = {
    create: "/admin/role/create/",
}

export const PublicAPI = {
    getBikePagination: "/public/bike/get",
    getBikeDetail: "/public/bike/get?bikeId="
}

export const BikeManagement = {
    create: "/admin/bike/create",
    getBikePagination: "/admin/bike/get",
    getCategory: "/admin/bike-category/get",
    getColor: "/admin/bike-color/get",
    getManufacturer: "/admin/bike-manufacturer/get",
    getById: "/admin/bike/get?bikeId="
};

export const CategoryManagement = {
    create: "/admin/bike-category/create",
    update: "/admin/bike-category/update/",
    delete: "/admin/bike-category/delete/",
    getById: "/admin/bike-category/get",
    getPagination: "/admin/bike-category/get",
}

export const Firebase_URL = "https://firebasestorage.googleapis.com/v0/b/bike-hiring-management-d7a01.appspot.com/o/bike-image%2F"