import { AxiosRequestConfig } from "axios";
import { toast } from "../../hooks/use-toast";
import { apiClient } from "./config";
import { ApiError } from "./errors";
import { logger } from "./logger";

/**
 * API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * API Request options
 */
export interface ApiRequestOptions extends AxiosRequestConfig {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  silent?: boolean;
}

/**
 * Centralized API Service
 */
class ApiService {
  /**
   * Generic request method
   */
  private async request<T>(
    config: AxiosRequestConfig,
    options: ApiRequestOptions = {},
  ): Promise<T> {
    const {
      showSuccessToast = false,
      showErrorToast = true,
      successMessage,
      errorMessage,
      silent = false,
    } = options;

    try {
      const response = await apiClient.request<ApiResponse<T>>(config);

      // Show success toast if enabled
      if (showSuccessToast && !silent) {
        toast({
          title: "Success",
          description: successMessage || response.data.message || "Operation completed successfully",
          variant: "success",
        });
      }

      return response.data.data;
    } catch (error) {
      // Handle error
      const apiError =
        error instanceof ApiError ? error : ApiError.fromAxiosError(error as any);

      // Show error toast if enabled
      if (showErrorToast && !silent) {
        this.showErrorToast(apiError, errorMessage);
      }

      // Re-throw error for caller to handle
      throw apiError;
    }
  }

  /**
   * GET request
   */
  async get<T>(url: string, options: ApiRequestOptions = {}): Promise<T> {
    return this.request<T>(
      {
        method: "GET",
        url,
        params: options.params,
      },
      options,
    );
  }

  /**
   * POST request
   */
  async post<T>(
    url: string,
    data?: unknown,
    options: ApiRequestOptions = {},
  ): Promise<T> {
    return this.request<T>(
      {
        method: "POST",
        url,
        data,
      },
      options,
    );
  }

  /**
   * PUT request
   */
  async put<T>(
    url: string,
    data?: unknown,
    options: ApiRequestOptions = {},
  ): Promise<T> {
    return this.request<T>(
      {
        method: "PUT",
        url,
        data,
      },
      options,
    );
  }

  /**
   * PATCH request
   */
  async patch<T>(
    url: string,
    data?: unknown,
    options: ApiRequestOptions = {},
  ): Promise<T> {
    return this.request<T>(
      {
        method: "PATCH",
        url,
        data,
      },
      options,
    );
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, options: ApiRequestOptions = {}): Promise<T> {
    return this.request<T>(
      {
        method: "DELETE",
        url,
      },
      options,
    );
  }

  /**
   * Upload file
   */
  async upload<T>(
    url: string,
    file: File,
    options: ApiRequestOptions = {},
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    return this.request<T>(
      {
        method: "POST",
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
      options,
    );
  }

  /**
   * Show error toast with appropriate message
   */
  private showErrorToast(error: ApiError, customMessage?: string): void {
    let title = "Error";
    let description = customMessage || error.getUserMessage();

    // Customize based on error type
    if (error.isNetworkError()) {
      title = "Network Error";
      description = "Unable to connect to the server. Please check your internet connection.";
    } else if (error.isAuthError()) {
      title = "Authentication Error";
      description = "Your session has expired. Please log in again.";
    } else if (error.isValidationError()) {
      title = "Validation Error";
    } else if (error.isServerError()) {
      title = "Server Error";
      description = "Something went wrong on our end. Please try again later.";
    }

    toast({
      title,
      description,
      variant: "destructive",
    });

    // Log error for debugging
    logger.log("error", `API Error: ${title}`, {
      message: description,
      statusCode: error.statusCode,
      code: error.code,
      details: error.details,
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();
