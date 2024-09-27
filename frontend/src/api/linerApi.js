import TokenApi from "./TokenApi";
const url = "api/Line";
// `${url}`
// Obtém todos os linees
export const getAllLines = async () => {
  try {
    const { data } = await TokenApi.get(`${url}/TodasLinhas`);
    return data;
  } catch (error) {
    console.error("Error fetching all lines:", error);
    throw error;
  }
};

// Obtém um Line específico por ID
export const getLine = async (id) => {
  try {
    const { data } = await TokenApi.get(`${url}/BuscarLinha/${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching Line with ID ${id}:`, error);
    throw error;
  }
};

// Cria um novo Line
export const createLine = async (line) => {
  try {
    const { data } = await TokenApi.post(`${url}/adicionarLinha`, line);
    return data;
  } catch (error) {
    console.error("Error creating line:", error);
    throw error;
  }
};

// Atualiza um line existente por ID
export const updateLine = async (line) => {
  try {
    const { data } = await TokenApi.post(`${url}/adicionarLinha`, line);
    return data;
  } catch (error) {
    console.error(`Error updating line with ID:`, error);
    throw error;
  }
};

// Deleta um line por ID
export const deleteLine = async (id) => {
  try {
    await TokenApi.delete(`${url}/DeleteLinha/${id}`);
  } catch (error) {
    console.error(`Error deleting line with ID ${id}:`, error);
    throw error;
  }
};
