import axios from "axios";

// Environment variables - using process.env instead of import.meta
declare const process: {
  env: {
    VITE_API_BASE_URL?: string;
  };
};

const API_BASE_URL = typeof process !== 'undefined' && process.env?.VITE_API_BASE_URL 
  ? process.env.VITE_API_BASE_URL 
  : "http://127.0.0.1:8003/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("msal.token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.clear();
      if (typeof window !== 'undefined') {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const ticketsAPI = {
  getMyTickets: async () => {
    try {
      return await apiClient.get("/tickets/my");
    } catch (error) {
      console.error("API Error:", error);
      return {
        data: [
          {
            id: "INC0012345",
            status: "open",
            statusColor: "bg-[#ffedd4] text-[#c93400] border-transparent",
            title: "Outlook not responding on LAPTOP-8X7D2K",
            device: "LAPTOP-8X7D2K",
            priority: "high",
            priorityColor: "bg-[#ffe2e2] text-[#c10007] border-[#ffc9c9]",
            time: "2 hours ago",
          },
        ],
      };
    }
  },
  
  getTicketById: async (id: string) => {
    try {
      return await apiClient.get(`/tickets/${id}`);
    } catch (error) {
      console.error("API Error:", error);
      return { data: null };
    }
  },
  
  searchTickets: async (query: string, type: string) => {
    try {
      return await apiClient.get(`/tickets/search?q=${query}&type=${type}`);
    } catch (error) {
      console.error("API Error:", error);
      return { data: [] };
    }
  },
};

export const diagnosticsAPI = {
  getRootCauses: async (ticketId: string) => {
    try {
      return await apiClient.get(`/diagnostics/${ticketId}/root-causes`);
    } catch (error) {
      console.error("API Error:", error);
      return { data: [] };
    }
  },
  
  getRecommendedActions: async (ticketId: string) => {
    try {
      return await apiClient.get(`/diagnostics/${ticketId}/actions`);
    } catch (error) {
      console.error("API Error:", error);
      return { data: [] };
    }
  },
};

export const systemStatusAPI = {
  getStatus: async () => {
    try {
      return await apiClient.get("/system/status");
    } catch (error) {
      console.error("API Error:", error);
      return {
        data: [
          { name: "ServiceNow", status: "operational", color: "bg-[#00c950]" },
          { name: "Tachyon", status: "operational", color: "bg-[#00c950]" },
          { name: "Nexthink", status: "degraded", color: "bg-[#f0b100]" },
          { name: "Intune / SCCM", status: "operational", color: "bg-[#00c950]" },
        ],
      };
    }
  },
};
