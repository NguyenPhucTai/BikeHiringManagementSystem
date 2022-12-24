// Public API
export const Authen = {
    signUp: "/authen/signup",
    signIn: "/authen/signin",
}

export const PublicAPI = {
    getBikePagination: "/public/bike/get",
    getBikeDetail: "/public/bike/get?bikeId="
}

// Private API
export const Role = {
    create: "/admin/role/create/",
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
    getPagination: "/admin/bike-category/get",
    getById: "/admin/bike-category/get?id="
}

export const ColorManagement = {
    create: "/admin/bike-color/create",
    update: "/admin/bike-color/update/",
    delete: "/admin/bike-color/delete/",
    getPagination: "/admin/bike-color/get",
    getById: "/admin/bike-color/get?id="
}

export const ManufacturerManagement = {
    create: "/admin/bike-manufacturer/create",
    update: "/admin/bike-manufacturer/update/",
    delete: "/admin/bike-manufacturer/delete/",
    getPagination: "/admin/bike-manufacturer/get",
    getById: "/admin/bike-manufacturer/get?id="
}

// Fire Base
export const Firebase_URL = "https://firebasestorage.googleapis.com/v0/b/bike-hiring-management-d7a01.appspot.com/o/bike-image%2F"