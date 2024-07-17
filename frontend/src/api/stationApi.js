import axios from 'axios';
import TokenApi from "./TokenApi";

const REACT_APP_API_MOCKED_URL = process.env.REACT_APP_API_URL_FCT;
// const API_URL_USERS = process.env.REACT_APP_API_URL;


export const getAllJigs = async () => {
    const response = await TokenApi.get('/todosJigs');
    return response.data;
};

export const getStations = async (id) => {
    const response = await TokenApi.get(`${REACT_APP_API_MOCKED_URL}buscarJig/${id}`);
    return response.data;
};

export const createJigs = async (station) => {
    const response = await TokenApi.post('gerenciarJigs', station);
    return response.data;
};

export const updateJigs = async (station) => {
    const response = await TokenApi.post('gerenciarJigs', station);
    return response.data;
};

export const deleteJigs = async (id) => {
    await TokenApi.delete(`/deleteJigs/${id}`);
};
