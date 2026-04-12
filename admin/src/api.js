/**
 * GigKavach — Centralized API Client
 * This client connects the React Admin panel to the FastAPI AI backend.
 */

const API_BASE_URL = 'http://192.168.1.12:8000';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.detail || `API Error: ${response.statusText}`);
  }
  return response.json();
};

export const GigKavachApi = {
  // Dashboard Stats
  getStats: () => fetch(`${API_BASE_URL}/api/v1/dashboard/stats`).then(handleResponse),
  
  // Predictive Analytics
  getPredictions: () => fetch(`${API_BASE_URL}/api/v1/dashboard/predictions`).then(handleResponse),
  
  // Workers
  getWorkers: () => fetch(`${API_BASE_URL}/api/v1/workers`).then(handleResponse),
  
  // Simulation Management
  getScenarios: () => fetch(`${API_BASE_URL}/api/v1/simulation/scenarios`).then(handleResponse),
  
  runScenario: (scenarioId) => fetch(`${API_BASE_URL}/api/v1/simulation/run/${scenarioId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }).then(handleResponse),

  // Engine Controls
  runEngine: (zone, city) => fetch(`${API_BASE_URL}/api/engine/evaluate?zone=${zone}&city=${city}`, {
    method: 'POST',
  }).then(handleResponse),
  
  resetSim: () => fetch(`${API_BASE_URL}/api/mock/reset`, { method: 'POST' }).then(handleResponse),
};
