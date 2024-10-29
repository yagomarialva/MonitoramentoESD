import TokenApi from "./TokenApi";
const url = 'api/MonitorEsd'
const url_logs = 'api/LogMonitorEsd'

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
export const getMonitorLogs = async (id) => {
  try {
    const { data } = await TokenApi.get(`${url_logs}/ListMonitorEsd?id=${id}&page=1&pageSize=50`);
    console.log('data', data)
    return data;
  } catch (error) {
    console.error(`Error fetching monitor with ID ${id}:`, error);
    throw error;
  }
};



// Obtém um monitor específico por ID
export const getMonitor = async (serialNumber) => {
  try {
    const { data } = await TokenApi.get(`${url}/Pesquisa${serialNumber}`);
    console.log('data', data)
    return data;
  } catch (error) {
    console.error(`Error fetching monitor with ID ${serialNumber}:`, error);
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
    console.error("Error creating monitor:", error);
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
