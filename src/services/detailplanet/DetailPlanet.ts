import axios from "axios";
import { API_URL } from "../../../url";

export const fetchDetailPlanets = async (planetId: number) => {
    const { data } = await axios.get(`${API_URL}/planets/${planetId}`);
    return data;
};