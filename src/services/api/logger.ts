import { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Log levels
 */
type LogLevel = "info" | "warn" | "error" | "debug";

import { ENV } from "../../config/env";

/**
 * Logger configuration
 */
const LOGGER_CONFIG = {
  enabled: ENV.IS_DEV, // Only log in development
  logRequests: true,
  logResponses: true,
  logErrors: true,
  maxBodyLength: 1000, // Max characters to log from request/response body
};

/**
 * Color codes for console output
 */
const COLORS = {
  info: "#3b82f6", // blue
  warn: "#f59e0b", // amber
  error: "#ef4444", // red
  debug: "#8b5cf6", // purple
  success: "#10b981", // green
};

/**
 * API Logger utility
 */
class ApiLogger {
  private enabled: boolean;

  constructor() {
    this.enabled = LOGGER_CONFIG.enabled;
  }

  /**
   * Generic log method
   */
  log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.enabled) return;

    const timestamp = new Date().toISOString();
    const color = COLORS[level];

    console.groupCollapsed(
      `%c[${level.toUpperCase()}] ${timestamp} - ${message}`,
      `color: ${color}; font-weight: bold;`,
    );

    if (data) {
      console.log(data);
    }

    console.trace("Stack trace");
    console.groupEnd();
  }

  /**
   * Log API request
   */
  logRequest(config: AxiosRequestConfig): void {
    if (!this.enabled || !LOGGER_CONFIG.logRequests) return;

    const { method, url, params, data, headers } = config;

    console.groupCollapsed(
      `%c→ ${method?.toUpperCase()} ${url}`,
      `color: ${COLORS.info}; font-weight: bold;`,
    );

    console.log("📤 Request Details:");
    console.table({
      Method: method?.toUpperCase(),
      URL: url,
      "Base URL": config.baseURL,
      Timeout: `${config.timeout}ms`,
    });

    if (params && Object.keys(params).length > 0) {
      console.log("🔍 Query Parameters:", params);
    }

    if (headers) {
      console.log("📋 Headers:", this.sanitizeHeaders(headers));
    }

    if (data) {
      console.log("📦 Request Body:", this.truncateData(data));
    }

    console.groupEnd();
  }

  /**
   * Log API response
   */
  logResponse(response: AxiosResponse): void {
    if (!this.enabled || !LOGGER_CONFIG.logResponses) return;

    const { config, status, statusText, data, headers } = response;
    const duration = this.getRequestDuration(config);

    console.groupCollapsed(
      `%c← ${status} ${config.method?.toUpperCase()} ${config.url}`,
      `color: ${COLORS.success}; font-weight: bold;`,
    );

    console.log("📥 Response Details:");
    console.table({
      Status: `${status} ${statusText}`,
      Duration: duration ? `${duration}ms` : "N/A",
      URL: config.url,
    });

    if (headers) {
      console.log("📋 Response Headers:", headers);
    }

    if (data) {
      console.log("📦 Response Data:", this.truncateData(data));
    }

    console.groupEnd();
  }

  /**
   * Log API error
   */
  logError(message: string, error: unknown): void {
    if (!this.enabled || !LOGGER_CONFIG.logErrors) return;

    console.groupCollapsed(
      `%c✖ ${message}`,
      `color: ${COLORS.error}; font-weight: bold;`,
    );

    if (error instanceof Error) {
      console.error("Error Message:", error.message);
      console.error("Error Stack:", error.stack);
    }

    console.error("Full Error:", error);
    console.groupEnd();
  }

  /**
   * Sanitize headers (remove sensitive data)
   */
  private sanitizeHeaders(headers: unknown): unknown {
    if (typeof headers !== "object" || headers === null) return headers;

    const sanitized = { ...headers } as Record<string, unknown>;
    const sensitiveKeys = ["authorization", "cookie", "x-api-key"];

    sensitiveKeys.forEach((key) => {
      if (key in sanitized) {
        sanitized[key] = "***REDACTED***";
      }
    });

    return sanitized;
  }

  /**
   * Truncate large data objects
   */
  private truncateData(data: unknown): unknown {
    if (typeof data === "string") {
      return data.length > LOGGER_CONFIG.maxBodyLength
        ? `${data.substring(0, LOGGER_CONFIG.maxBodyLength)}... (truncated)`
        : data;
    }

    if (typeof data === "object" && data !== null) {
      const stringified = JSON.stringify(data, null, 2);
      if (stringified.length > LOGGER_CONFIG.maxBodyLength) {
        return `${stringified.substring(0, LOGGER_CONFIG.maxBodyLength)}... (truncated)`;
      }
      return data;
    }

    return data;
  }

  /**
   * Get request duration
   */
  private getRequestDuration(config: AxiosRequestConfig): number | null {
    const metadata = (config as any).metadata;
    if (metadata?.startTime) {
      return Date.now() - metadata.startTime;
    }
    return null;
  }

  /**
   * Enable/disable logger
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Export singleton instance
export const logger = new ApiLogger();
