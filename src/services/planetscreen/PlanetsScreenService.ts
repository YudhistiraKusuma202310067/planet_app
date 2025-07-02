import axios from "axios";
import { API_URL } from "../../../url";

export const fetchDataPlanets = async () => {
    const { data } = await axios.get(`${API_URL}/planets`);
    // console.log("data planet: " + data)
    return data;
};