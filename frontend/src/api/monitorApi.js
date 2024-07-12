import TokenApi from "./TokenApi";

const REACT_APP_API_MOCKED_URL = process.env.REACT_APP_API_URL_FCT;

export const getAllMonitors = async () => {
    const response = await TokenApi.get('/todosMonitores');
    return response.data;
};

export const getMonitors = async (id) => {
    const response = await TokenApi.get(`/BuscarMonitores${id}`);
    console.log(response.data);
    return response.data;
};

export const createMonitors = async (monitors) => {
    const response = await TokenApi.post('/adicionarMonitor', monitors);
    return response.data;
};

export const updateMonitors = async (id, monitors) => {
    const response = await TokenApi.put(`/adicionarMonitor${id}`, monitors);
    return response.data;
};

export const deleteMonitors = async (id) => {
    await TokenApi.delete(`/deleteMonitor?id=${id}`);
};
