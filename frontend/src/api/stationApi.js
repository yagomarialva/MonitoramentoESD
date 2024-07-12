import axios from 'axios';
import TokenApi from "./TokenApi";

const REACT_APP_API_MOCKED_URL = process.env.REACT_APP_API_URL_FCT;
// const API_URL_USERS = process.env.REACT_APP_API_URL;


export const getAllStations = async () => {
    const response = await TokenApi.get('/todasStations');
    return response.data;
};

export const getStations = async (id) => {
    const response = await TokenApi.get(`${REACT_APP_API_MOCKED_URL}buscarStationId${id}`);
    return response.data;
};

export const createStations = async (station) => {
    const response = await TokenApi.post('gerenciarStation', station);
    return response.data;
};

export const updateStations = async (station) => {
    const response = await TokenApi.post('gerenciarStation', station);
    return response.data;
};

export const deleteStations = async (id) => {
    await TokenApi.delete(`/deleteSation/${id}`);
};
