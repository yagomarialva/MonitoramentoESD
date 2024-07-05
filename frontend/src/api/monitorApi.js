import axios from 'axios';

const REACT_APP_API_MOCKED_URL = process.env.REACT_APP_API_URL;
// const API_URL_USERS = process.env.REACT_APP_API_URL;


export const getAllMonitors = async () => {
    const response = await axios.get(`${REACT_APP_API_MOCKED_URL}/posts`);
    return response.data;
};

export const getMonitors = async (id) => {
    const response = await axios.get(`${REACT_APP_API_MOCKED_URL}/posts/${id}`);
    console.log(response.data)
    return response.data;
};

export const createMonitors = async (monitors) => {
    const response = await axios.post(`${REACT_APP_API_MOCKED_URL}/posts`, monitors);
    return response.data;
};

export const updateMonitors = async (id, monitors) => {
    const response = await axios.put(`${REACT_APP_API_MOCKED_URL}/posts/${id}`, monitors);
    return response.data;
};

export const deleteMonitors = async (id) => {
    await axios.delete(`${REACT_APP_API_MOCKED_URL}/todos/${id}`);
};
