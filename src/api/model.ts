import axios from "axios";
import { axiosInterceptor } from "./axiosInterceptor";

export const uploadModel = async (form: any, callback: any) => {
    await axios.post(' http://127.0.0.1:5000/predict', form)
        .then((result) => {
            callback(result.data)
        }).catch((err) => {
            console.log(err);
        });
}