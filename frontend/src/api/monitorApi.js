import TokenApi from "./TokenApi";
const url = 'api/MonitorEsd'
// Obtém todos os monitores
export const getAllMonitors = async () => {
  try {
    const { data } = await TokenApi.get(`${url}/todosminitores`);
    return data;
  } catch (error) {
    console.error("Error fetching all monitors:", error);
    throw error;
  }
};

// Obtém um monitor específico por ID
export const getMonitor = async (id) => {
  try {
    const { data } = await TokenApi.get(`/BuscarMonitores/${id}`);
    console.log('data', data)
    return data;
  } catch (error) {
    console.error(`Error fetching monitor with ID ${id}:`, error);
    throw error;
  }
};

// Cria um novo monitor
export const createMonitor = async (monitor) => {
  try {
    const { data } = await TokenApi.post(`${url}/monitores`, monitor);
    return data;
  } catch (error) {
    console.error("Error creating monitor:", error);
    throw error;
  }
};

// Atualiza um monitor existente por ID
export const updateMonitor = async (monitor) => {
  try {
    const { data } = await TokenApi.post(`${url}/monitores`, monitor);
    return data;
  } catch (error) {
    console.error(`Error updating monitor with ID:`, error);
    throw error;
  }
};

// Deleta um monitor por ID
export const deleteMonitor = async (monitor) => {
  try {
    await TokenApi.delete(`${url}/${monitor}`, monitor);
  } catch (error) {
    console.error(`Error deleting monitor with ID :`, error);
    throw error;
  }
};
