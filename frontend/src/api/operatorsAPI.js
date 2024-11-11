import TokenApi from "./TokenApi";
const url = 'api/Biometric'
// Fetch all operators
export const getAllOperators = async () => {
  try {
    const response = await TokenApi.get(`${url}/ListUsersPaginated?page=1&pageSize=50`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all operators", error);
    throw error;
  }
};

// Fetch a specific operator by ID
export const getOperators = async (id) => {
  try {
    const response = await TokenApi.get(`${url}/BuscarOperatores/${id}`);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch operator with ID ${id}`, error);
    throw error;
  }
};

// Create a new operator
export const createOperators = async (operator) => {

    const form = new FormData();
    form.append("name", operator.name);
    form.append("badge", operator.badge);
    // Definir um valor padrão para 'stream' caso ele esteja undefined
    const streamValue = operator.stream || null; // Substitua "default_stream_value" pelo valor padrão desejado
    form.append("stream", streamValue);

    try {
        const response = await TokenApi.post(`${url}/adicionar`, form);
        return response.data;
    } catch (error) {
        console.error("Failed to create operator", error);
        throw error;
    }
};


// Update an existing operator
export const updateOperators = async (operator) => {
    const form = new FormData();
    form.append("id", operator.id)
    form.append("name", operator.name);
    form.append("badge", operator.badge);
    // Definir um valor padrão para 'stream' caso ele esteja undefined
    const streamValue = operator.stream || null; // Substitua "default_stream_value" pelo valor padrão desejado
    form.append("stream", streamValue);

    try {
        const response = await TokenApi.post(`${url}/adicionar`, form);
        return response.data;
    } catch (error) {
        console.error("Failed to create operator", error);
        throw error;
    }
};

// Delete an operator by ID
export const deleteOperators = async (id) => {
  try {
    await TokenApi.delete(`${url}/delete/${id}`);
  } catch (error) {
    console.error(`Failed to delete operator with ID ${id}`, error);
    throw error;
  }
};
