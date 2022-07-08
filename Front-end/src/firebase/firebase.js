import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBS6LCAnV4DZVPb2O4gYOlLkXk7PAMNtYc",
    authDomain: "bike-hiring-management-system.firebaseapp.com",
    projectId: "bike-hiring-management-system",
    storageBucket: "bike-hiring-management-system.appspot.com",
    messagingSenderId: "775393932285",
    appId: "1:775393932285:web:4aeb2c9fd4eedb61619f94",
    measurementId: "G-H3Z3BMKZW4"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);