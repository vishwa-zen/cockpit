import { apiService } from "./api";
import type { ApiRequestOptions } from "./api";

/**
 * Ticket interface
 */
export interface Ticket {
  id: string;
  status: string;
  title: string;
  description?: string;
  device: string;
  priority: string;
  reporter: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Ticket list response
 */
export interface TicketListResponse {
  tickets: Ticket[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Ticket Service
 * Example service demonstrating API usage
 */
class TicketService {
  private readonly baseUrl = "/tickets";

  /**
   * Get all tickets
   */
  async getTickets(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<TicketListResponse> {
    return apiService.get<TicketListResponse>(this.baseUrl, {
      params: { page, pageSize },
      showErrorToast: true,
    });
  }

  /**
   * Get ticket by ID
   */
  async getTicketById(id: string): Promise<Ticket> {
    return apiService.get<Ticket>(`${this.baseUrl}/${id}`, {
      showErrorToast: true,
      errorMessage: "Failed to load ticket details",
    });
  }

  /**
   * Create new ticket
   */
  async createTicket(
    data: Omit<Ticket, "id" | "createdAt" | "updatedAt">,
  ): Promise<Ticket> {
    return apiService.post<Ticket>(this.baseUrl, data, {
      showSuccessToast: true,
      showErrorToast: true,
      successMessage: "Ticket created successfully",
      errorMessage: "Failed to create ticket",
    });
  }

  /**
   * Update ticket
   */
  async updateTicket(
    id: string,
    data: Partial<Ticket>,
  ): Promise<Ticket> {
    return apiService.put<Ticket>(`${this.baseUrl}/${id}`, data, {
      showSuccessToast: true,
      showErrorToast: true,
      successMessage: "Ticket updated successfully",
      errorMessage: "Failed to update ticket",
    });
  }

  /**
   * Delete ticket
   */
  async deleteTicket(id: string): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`, {
      showSuccessToast: true,
      showErrorToast: true,
      successMessage: "Ticket deleted successfully",
      errorMessage: "Failed to delete ticket",
    });
  }

  /**
   * Search tickets
   */
  async searchTickets(query: string): Promise<Ticket[]> {
    return apiService.get<Ticket[]>(`${this.baseUrl}/search`, {
      params: { q: query },
      showErrorToast: true,
    });
  }
}

// Export singleton instance
export const ticketService = new TicketService();
