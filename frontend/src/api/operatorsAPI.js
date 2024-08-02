import TokenApi from "./TokenApi";

// Fetch all operators
export const getAllOperators = async () => {
    try {
        const response = await TokenApi.get('/todosUsers');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch all operators", error);
        throw error;
    }
};

// Fetch a specific operator by ID
export const getOperators = async (id) => {
    try {
        const response = await TokenApi.get(`/BuscarOperatores/${id}`);
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

    try {
        const response = await TokenApi.post('/adicionar', form);
        return response.data;
    } catch (error) {
        console.error("Failed to create operator", error);
        throw error;
    }
};

// Update an existing operator
export const updateOperators = async (operator) => {
    try {
        const response = await TokenApi.put(`/update/${operator.id}`, operator); // Changed to PUT method
        return response.data;
    } catch (error) {
        console.error(`Failed to update operator with ID ${operator.id}`, error);
        throw error;
    }
};

// Delete an operator by ID
export const deleteOperators = async (id) => {
    try {
        await TokenApi.delete(`/delete/${id}`);
    } catch (error) {
        console.error(`Failed to delete operator with ID ${id}`, error);
        throw error;
    }
};
