import { apiService } from "./api";
import { MOCK_INCIDENTS, shouldUseMockData } from "./mockData";
import { toast } from "../hooks/use-toast";

/**
 * ServiceNow Incident interface
 */
export interface ServiceNowIncident {
  sysId: string;
  incidentNumber: string;
  shortDescription: string;
  priority: string;
  impact: number;
  status: string;
  active: boolean;
  assignedTo: string;
  deviceName: string;
  createdBy: string;
  callerId: string;
  openedAt: string;
  lastUpdatedAt: string;
}

/**
 * ServiceNow API Response
 */
export interface ServiceNowIncidentsResponse {
  incidents: ServiceNowIncident[];
}

/**
 * Mapped Ticket for UI
 */
export interface Ticket {
  id: string;
  incidentNumber: string;
  status: string;
  statusColor: string;
  title: string;
  device: string;
  priority: string;
  priorityColor: string;
  timeAgo: string;
  openedAt: string;
  lastUpdatedAt: string;
  assignedTo: string;
  createdBy: string;
  callerId: string;
}

/**
 * ServiceNow Service
 */
class ServiceNowService {
  private readonly baseUrl = "/servicenow/technician/FS_Cockpit_Integration";

  /**
   * Map priority string to label and color
   */
  private mapPriority(priority: string): { label: string; color: string } {
    // Priority format: "1 - Critical", "2 - High", etc.
    const priorityLower = priority.toLowerCase();
    
    if (priorityLower.includes("critical")) {
      return { label: "Critical", color: "bg-[#ffe2e2] text-[#c10007] border-[#ffc9c9]" };
    } else if (priorityLower.includes("high")) {
      return { label: "High", color: "bg-[#ffe2e2] text-[#c10007] border-[#ffc9c9]" };
    } else if (priorityLower.includes("medium") || priorityLower.includes("moderate")) {
      return { label: "Medium", color: "bg-[#fef9c2] text-[#a65f00] border-[#feef85]" };
    } else if (priorityLower.includes("low")) {
      return { label: "Low", color: "bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]" };
    } else if (priorityLower.includes("planning")) {
      return { label: "Planning", color: "bg-[#f3f4f6] text-[#4b5563] border-[#d1d5db]" };
    }
    
    return { label: priority, color: "bg-gray-100 text-gray-600 border-gray-300" };
  }

  /**
   * Map status string to label and color
   */
  private mapStatus(status: string): { label: string; color: string } {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes("new")) {
      return { label: "New", color: "bg-[#dbeafe] text-[#1e40af] border-transparent" };
    } else if (statusLower.includes("in progress") || statusLower.includes("work in progress")) {
      return { label: "In Progress", color: "bg-[#ffedd4] text-[#c93400] border-transparent" };
    } else if (statusLower.includes("on hold") || statusLower.includes("pending")) {
      return { label: "On Hold", color: "bg-[#fef9c2] text-[#a65f00] border-transparent" };
    } else if (statusLower.includes("resolved")) {
      return { label: "Resolved", color: "bg-[#d1fae5] text-[#065f46] border-transparent" };
    } else if (statusLower.includes("closed")) {
      return { label: "Closed", color: "bg-[#f3f4f6] text-[#4b5563] border-transparent" };
    } else if (statusLower.includes("cancel")) {
      return { label: "Canceled", color: "bg-[#fee2e2] text-[#991b1b] border-transparent" };
    }
    
    return { label: status, color: "bg-[#ffedd4] text-[#c93400] border-transparent" };
  }

  /**
   * Calculate time ago from timestamp
   */
  private getTimeAgo(timestamp: string): string {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
  }

  /**
   * Map ServiceNow incident to UI Ticket
   */
  private mapIncidentToTicket(incident: ServiceNowIncident): Ticket {
    const priority = this.mapPriority(incident.priority);
    const status = this.mapStatus(incident.status);

    return {
      id: incident.sysId,
      incidentNumber: incident.incidentNumber,
      status: status.label,
      statusColor: status.color,
      title: incident.shortDescription,
      device: incident.deviceName || incident.callerId || "N/A",
      priority: priority.label,
      priorityColor: priority.color,
      timeAgo: this.getTimeAgo(incident.lastUpdatedAt),
      openedAt: incident.openedAt,
      lastUpdatedAt: incident.lastUpdatedAt,
      assignedTo: incident.assignedTo,
      createdBy: incident.createdBy,
      callerId: incident.callerId,
    };
  }

  /**
   * Get all incidents assigned to technician
   */
  async getMyIncidents(): Promise<Ticket[]> {
    // Check if mock data should be used
    if (shouldUseMockData()) {
      console.log("🎭 Using mock data");
      toast({
        title: "Mock Data Mode",
        description: "Using sample data. API is not connected.",
        variant: "info",
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return MOCK_INCIDENTS.map((incident) =>
        this.mapIncidentToTicket(incident)
      );
    }

    try {
      console.log("🌐 Fetching from API:", `${this.baseUrl}/incidents`);
      
      const response = await apiService.get<ServiceNowIncidentsResponse>(
        `${this.baseUrl}/incidents`,
        {
          showErrorToast: false, // We'll handle errors manually
        }
      );

      console.log("✅ API data loaded successfully");
      
      return response.incidents.map((incident) =>
        this.mapIncidentToTicket(incident)
      );
    } catch (error) {
      console.error("❌ API Error - Falling back to mock data:", error);
      
      // Show warning toast
      toast({
        title: "API Connection Failed",
        description: "Using sample data. Please check your API connection.",
        variant: "warning",
      });

      // Automatically enable mock data mode for subsequent requests
      localStorage.setItem("use_mock_data", "true");
      
      // Return mock data as fallback
      return MOCK_INCIDENTS.map((incident) =>
        this.mapIncidentToTicket(incident)
      );
    }
  }

  /**
   * Get incident by ID
   */
  async getIncidentById(sysId: string): Promise<Ticket | null> {
    const incidents = await this.getMyIncidents();
    return incidents.find((ticket) => ticket.id === sysId) || null;
  }

  /**
   * Search incidents
   */
  async searchIncidents(query: string): Promise<Ticket[]> {
    const incidents = await this.getMyIncidents();
    const lowerQuery = query.toLowerCase();

    return incidents.filter(
      (ticket) =>
        ticket.incidentNumber.toLowerCase().includes(lowerQuery) ||
        ticket.title.toLowerCase().includes(lowerQuery) ||
        ticket.device.toLowerCase().includes(lowerQuery)
    );
  }
}

// Export singleton instance
export const serviceNowService = new ServiceNowService();
