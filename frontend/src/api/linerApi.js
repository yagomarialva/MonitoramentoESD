import TokenApi from "./TokenApi";

// Obtém todos os linees
export const getAllLines = async () => {
  try {
    const { data } = await TokenApi.get("/TodasLinhas");
    return data;
  } catch (error) {
    console.error("Error fetching all lines:", error);
    throw error;
  }
};

// Obtém um Line específico por ID
export const getLine = async (id) => {
  try {
    const { data } = await TokenApi.get(`/BuscarLinha/${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching Line with ID ${id}:`, error);
    throw error;
  }
};

// Cria um novo Line
export const createLine = async (line) => {
  try {
    const { data } = await TokenApi.post("/adicionarLinha", line);
    return data;
  } catch (error) {
    console.error("Error creating line:", error);
    throw error;
  }
};

// Atualiza um line existente por ID
export const updateLine = async (line) => {
  try {
    const { data } = await TokenApi.post("/adicionarLine", line);
    return data;
  } catch (error) {
    console.error(`Error updating line with ID:`, error);
    throw error;
  }
};

// Deleta um line por ID
export const deleteLine = async (id) => {
  try {
    await TokenApi.delete(`/DeleteLinha/${id}`);
  } catch (error) {
    console.error(`Error deleting line with ID ${id}:`, error);
    throw error;
  }
};
