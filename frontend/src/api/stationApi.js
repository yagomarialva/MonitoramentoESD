import axios from 'axios';
import TokenApi from "./TokenApi";

const API_BASE_URL = process.env.REACT_APP_API_URL_FCT;

// Função auxiliar para manipulação de respostas
const handleResponse = async (request) => {
    try {
        const response = await request();
        return response.data;
    } catch (error) {
        console.error("API call failed: ", error);
        throw error;
    }
};

export const getAllStations = async () => {
    return handleResponse(() => TokenApi.get('/todosEstacoes'));
};

export const getStation = async (id) => {
    return handleResponse(() => TokenApi.get(`/Buscarestacao/${id}`));
};

export const createStation = async (station) => {
    return handleResponse(() => TokenApi.post('/adicionarEstacao', station));
};

export const updateStation = async (station) => {
    return handleResponse(() => TokenApi.put('/adicionarEstacao', station));
};

export const deleteStation = async (id) => {
    return handleResponse(() => TokenApi.delete(`/deleteEstação?id=${id}`));
};
