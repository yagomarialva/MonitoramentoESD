import TokenApi from "./TokenApi";

// Obtém todos os monitores
export const getAllStationMapper = async () => {
  try {
    const { data } = await TokenApi.get("/api/StationView/factoryMap");
    return data;
  } catch (error) {
    console.error("Error fetching mapper:", error);
    throw error;
  }
};

// Obtém um monitor específico por ID
export const getStationMapper = async (id) => {
  try {
    const { data } = await TokenApi.get(`/BuscarMonitores/${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching station with ID ${id}:`, error);
    throw error;
  }
};

// Cria um novo monitor
export const createStationMapper = async (monitor) => {
  try {
    const { data } = await TokenApi.post("/api/StationView/adicionarEstacaoView", monitor);
    return data;
  } catch (error) {
    console.error("Error mapping:", error);
    throw error;
  }
};

// Atualiza um monitor existente por ID
export const updateStationMapper = async (monitor) => {
  try {
    const { data } = await TokenApi.post("/adicionarMonitor", monitor);
    return data;
  } catch (error) {
    console.error(`Error updating monitor with ID:`, error);
    throw error;
  }
};

// Deleta um monitor por ID
export const deleteStationMapper = async (id) => {
  try {
    await TokenApi.delete(`/deleteMonitor?id=${id}`);
  } catch (error) {
    console.error(`Error deleting monitor with ID ${id}:`, error);
    throw error;
  }
};
