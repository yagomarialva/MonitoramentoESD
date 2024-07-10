import axios from "axios";

const TokenApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL_USERS,
    headers: {
        'authorization': localStorage.getItem('token')
    },
})

export default TokenApi