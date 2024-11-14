import TokenApi from "./TokenApi";
const url = "api/Biometric";
// Fetch all operators
export const getAllOperators = async () => {
  try {
    const response = await TokenApi.get(
      `${url}/ListUsersPaginated?page=1&pageSize=50`
    );
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
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch operator with ID ${id}`, error);
    throw error;
  }
};

export const createOperators = async (operator) => {
  console.log('operator', operator)
  const form = new FormData();
  form.append("ID", operator.id || 0); // ID padrão 0 se não for especificado
  form.append("Name", operator.name);
  form.append("Badge", operator.badge);

  // Checa se o operador tem um arquivo de imagem válido antes de adicioná-lo
  if (operator.stream && operator.stream instanceof Blob) {
    form.append("Image", operator.stream, "image.png"); // Adiciona com o nome de arquivo desejado
  }

  try {
    const response = await TokenApi.post(`${url}/adicionar`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log('response', response.data)
    return response.data;
  } catch (error) {
    console.error("Failed to create operator", error);
    throw error;
  }
};

// Update an existing operator
export const updateOperators = async (operator) => {
  console.log("operador", operator);
  const form = new FormData();
  form.append("id", operator.id);
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

// REACT_APP_API_URL_FCT=http://localhost:5051/
// REACT_APP_HOST=localhost
