export interface EmailJob {
    id: string;
    email: string;
    subject: string;
    body: string;
    retryCount: number;
    maxRetries: number;
    nextRetryAt?: Date;
    lastError?: string;
    status: "pending" | "sent" | "failed" | "retry";
  }
  
  export class RetryStrategy {
    /**
     * Calculate exponential backoff with jitter
     * Formula: min(maxDelay, baseDelay * 2^retryCount) + randomJitter
     */
    static calculateBackoffDelay(
      retryCount: number,
      baseDelay: number = 1000, // 1 second
      maxDelay: number = 60000, // 1 minute
      maxRetries: number = 5
    ): number {
      if (retryCount >= maxRetries) {
        return -1; // Signal: don't retry
      }
  
      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      const exponentialDelay = baseDelay * Math.pow(2, retryCount);
      const cappedDelay = Math.min(exponentialDelay, maxDelay);
  
      // Add jitter (±20%) to prevent thundering herd
      const jitter = cappedDelay * (0.8 + Math.random() * 0.4);
  
      console.log(
        `[v0] Backoff calculated - Attempt ${retryCount + 1}: ${jitter}ms`
      );
  
      return Math.floor(jitter);
    }
  
    /**
     * Determine if an error is retryable
     */
    static isRetryable(error: string): boolean {
      const retryableErrors = [
        "rate_limit_exceeded",
        "timeout",
        "service_unavailable",
        "temporary_failure",
        "connection_refused",
        "ECONNRESET",
        "ETIMEDOUT",
      ];
  
      return retryableErrors.some((err) => error.toLowerCase().includes(err));
    }
  
    /**
     * Get retry strategy based on error type
     */
    static getRetryStrategy(error: string): {
      shouldRetry: boolean;
      maxRetries: number;
      baseDelay: number;
    } {
      if (error.includes("rate_limit")) {
        return {
          shouldRetry: true,
          maxRetries: 10,
          baseDelay: 5000, // Start with longer delay for rate limits
        };
      }
  
      if (error.includes("invalid_email")) {
        return { shouldRetry: false, maxRetries: 0, baseDelay: 0 };
      }
  
      // Default for transient errors
      return { shouldRetry: true, maxRetries: 5, baseDelay: 1000 };
    }
  }
