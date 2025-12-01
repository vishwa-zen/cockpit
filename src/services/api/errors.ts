import { AxiosError } from "axios";

/**
 * Custom API Error class for better error handling
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "UNKNOWN_ERROR",
    details?: unknown,
    isOperational: boolean = true,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create ApiError from Axios error
   */
  static fromAxiosError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error status
      const data = error.response.data as any;
      return new ApiError(
        data?.message || error.message || "An error occurred",
        error.response.status,
        data?.code || `HTTP_${error.response.status}`,
        data?.details || data,
      );
    } else if (error.request) {
      // Request made but no response received
      return new ApiError(
        "No response from server. Please check your internet connection.",
        0,
        "NETWORK_ERROR",
        { originalError: error.message },
      );
    } else {
      // Error in request setup
      return new ApiError(
        error.message || "Failed to make request",
        0,
        "REQUEST_SETUP_ERROR",
        { originalError: error.message },
      );
    }
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    const errorMessages: Record<number, string> = {
      0: "Cannot connect to the server. Please ensure the API server is running on http://127.0.0.1:8003",
      400: "Invalid request. Please check your input and try again.",
      401: "You are not authorized. Please log in again.",
      403: "You don't have permission to perform this action.",
      404: "The requested resource was not found.",
      408: "Request timeout. Please try again.",
      409: "A conflict occurred. The resource may already exist.",
      422: "Validation failed. Please check your input.",
      429: "Too many requests. Please slow down and try again later.",
      500: "Server error. Please try again later.",
      502: "Bad gateway. The server is temporarily unavailable.",
      503: "Service unavailable. Please try again later.",
      504: "Gateway timeout. The server took too long to respond.",
    };

    // Return custom message if available
    if (this.message && this.message !== "An error occurred") {
      return this.message;
    }

    // Return status-based message
    return (
      errorMessages[this.statusCode] ||
      "An unexpected error occurred. Please try again."
    );
  }

  /**
   * Check if error is a specific type
   */
  isNetworkError(): boolean {
    return this.code === "NETWORK_ERROR" || this.statusCode === 0;
  }

  isAuthError(): boolean {
    return this.statusCode === 401 || this.statusCode === 403;
  }

  isValidationError(): boolean {
    return this.statusCode === 400 || this.statusCode === 422;
  }

  isServerError(): boolean {
    return this.statusCode >= 500 && this.statusCode < 600;
  }
}
