import TokenApi from "./TokenApi";


export const getAllOperators = async () => {
    const response = await TokenApi.get('/todosUsers');
    return response.data;
};

export const getOperators = async (id) => {
    const response = await TokenApi.get(`/BuscarOperatores${id}`);
    console.log(response.value);
    return response.value;
};

// export const createOperators = async (operator) => {
//     const response = await TokenApi.post('adicionar',operator);
//     return response.data;
// };

export const createOperators = async (operator) => {
    const form = new FormData()
    // form.append("id", operator.id)
    form.append("name", operator.name)
    form.append("badge", operator.badge)
    console.log(operator)
    const response = await TokenApi.post('/adicionar', form);
    return response.data;
};


export const updateOperators = async (operator) => {
    const response = await TokenApi.post('adicionar', operator);
    return response.data;
};

export const deleteOperators = async (id) => {
    await TokenApi.delete(`/delete/${id}`);
};
