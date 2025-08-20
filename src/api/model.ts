import axios from "axios";
import { axiosInterceptor } from "./axiosInterceptor";

export const uploadModel = async (form: any, callback: any) => {
    await axios.post(' https://daraprasidang2.pythonanywhere.com/predict', form)
        .then((result) => {
            callback(result.data)
        }).catch((err) => {
            console.log(err);
        });
}