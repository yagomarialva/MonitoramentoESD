import axios from 'axios';
import TokenApi from "./TokenApi";

const REACT_APP_API_MOCKED_URL = process.env.REACT_APP_API_MOCKED_URL;
// const API_URL_USERS = process.env.REACT_APP_API_URL;


export const getAllOperators = async () => {
    const response = await TokenApi.get('/todosUsers');
    console.log('response', response)
    return response.data;
};

export const getOperators = async (id) => {
    const response = await axios.get(`${REACT_APP_API_MOCKED_URL}/users/${id}`);
    console.log(response.data)
    return response.data;
};

export const createOperators = async (operators) => {
    const response = await axios.post(`${REACT_APP_API_MOCKED_URL}/users`, operators);
    return response.data;
};

export const updateOperators = async (id, operators) => {
    const response = await axios.put(`${REACT_APP_API_MOCKED_URL}/users/${id}`, operators);
    return response.data;
};

export const deleteOperators = async (id) => {
    await axios.delete(`${REACT_APP_API_MOCKED_URL}/users/${id}`);
};
