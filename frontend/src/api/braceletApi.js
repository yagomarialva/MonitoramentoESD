import axios from 'axios';

const REACT_APP_API_MOCKED_URL = process.env.REACT_APP_API_URL;
// const API_URL_USERS = process.env.REACT_APP_API_URL;


export const getAllBracelets = async () => {
    const response = await axios.get(`${REACT_APP_API_MOCKED_URL}/todos`);
    return response.data;
};

export const getBracelets = async (id) => {
    const response = await axios.get(`${REACT_APP_API_MOCKED_URL}/todos/${id}`);
    console.log(response.data)
    return response.data;
};

export const createBracelets = async (bracelets) => {
    const response = await axios.post(`${REACT_APP_API_MOCKED_URL}/todos`, bracelets);
    return response.data;
};

export const updateBracelets = async (id, bracelets) => {
    const response = await axios.put(`${REACT_APP_API_MOCKED_URL}/todos/${id}`, bracelets);
    return response.data;
};

export const deleteBracelets = async (id) => {
    await axios.delete(`${REACT_APP_API_MOCKED_URL}/todos/${id}`);
};
