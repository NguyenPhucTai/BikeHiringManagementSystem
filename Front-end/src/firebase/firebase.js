import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBANlhOLbzZh34gqcSpHdjyLxilXJtZ88M",
    authDomain: "bike-hiring-management-b185c.firebaseapp.com",
    projectId: "bike-hiring-management-b185c",
    storageBucket: "bike-hiring-management-b185c.appspot.com",
    messagingSenderId: "206431925660",
    appId: "1:206431925660:web:fe69bf155e65891ed0c459",
    measurementId: "G-F80MX5DQ3B"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);