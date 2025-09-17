import axios from "axios";

export const uploadModel = async (form: any) => {
    try {
        const result = await axios.post("https://daraprasidang2.pythonanywhere.com/predict", form);
        return result.data;
    } catch (err) {
        throw new Error("Terjadi error pada model"); // biar bisa ditangkap handleAnswer
    }
};
