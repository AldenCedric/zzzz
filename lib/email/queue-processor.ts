import nodemailer from "nodemailer";

interface QueueConfig {
  emailsPerSecond: number;
  batchSize: number;
  maxConcurrent: number;
}

export class EmailQueueProcessor {
  private transporter: nodemailer.Transporter;
  private config: QueueConfig;
  private activeRequests: number = 0;
  private lastRequestTime: number = 0;

  constructor(config: QueueConfig) {
    this.config = config;
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  /**
   * Rate limit enforcement - token bucket algorithm
   */
  private async enforceRateLimit(): Promise<void> {
    const minIntervalMs = 1000 / this.config.emailsPerSecond;
    const timeSinceLastRequest = Date.now() - this.lastRequestTime;

    if (timeSinceLastRequest < minIntervalMs) {
      const delayMs = minIntervalMs - timeSinceLastRequest;
      console.log(`[v0] Rate limit: waiting ${delayMs.toFixed(0)}ms`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Process a single email with built-in retry logic
   */
  async processEmail(job: EmailJob): Promise<void> {
    // Wait for capacity
    while (this.activeRequests >= this.config.maxConcurrent) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.activeRequests++;

    try {
      // Enforce rate limit before sending
      await this.enforceRateLimit();

      console.log(
        `[v0] Sending email to ${job.email} (Attempt ${job.retryCount + 1})`
      );

      await this.transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: job.email,
        subject: job.subject,
        html: job.body,
      });

      // Mark as sent successfully
      job.status = "sent";
      await this.updateJobStatus(job.id, "sent", null);

      console.log(`[v0] Email sent successfully to ${job.email}`);
    } catch (error) {
      await this.handleEmailError(job, error);
    } finally {
      this.activeRequests--;
    }
  }

  /**
   * Handle email sending errors with smart retry decisions
   */
  private async handleEmailError(
    job: EmailJob,
    error: any
  ): Promise<void> {
    const errorMessage = error.message || String(error);
    console.error(`[v0] Email error for ${job.email}:`, errorMessage);

    const { shouldRetry, maxRetries, baseDelay } =
      RetryStrategy.getRetryStrategy(errorMessage);

    if (!shouldRetry || job.retryCount >= maxRetries) {
      console.error(
        `[v0] Email to ${job.email} failed permanently after ${job.retryCount} retries`
      );
      await this.updateJobStatus(
        job.id,
        "failed",
        `${errorMessage} (retries exhausted)`
      );
      return;
    }

    const backoffDelay = RetryStrategy.calculateBackoffDelay(
      job.retryCount,
      baseDelay,
      60000,
      maxRetries
    );

    const nextRetryAt = new Date(Date.now() + backoffDelay);

    console.log(
      `[v0] Scheduling retry for ${job.email} at ${nextRetryAt.toISOString()}`
    );

    await this.updateJobStatus(job.id, "retry", errorMessage, nextRetryAt);
  }

  /**
   * Process queue in batches
   */
  async processQueue(): Promise<void> {
    while (true) {
      const pendingJobs = await this.getPendingJobs(this.config.batchSize);

      if (pendingJobs.length === 0) {
        // Check for retry-due jobs
        const retryJobs = await this.getRetryDueJobs(this.config.batchSize);

        if (retryJobs.length === 0) {
          console.log("[v0] Queue empty, waiting...");
          await new Promise((resolve) => setTimeout(resolve, 5000));
          continue;
        }

        // Process retry jobs
        await Promise.all(retryJobs.map((job) => this.processEmail(job)));
      } else {
        // Process pending jobs
        await Promise.all(
          pendingJobs.map((job) => this.processEmail(job))
        );
      }
    }
  }

  private async getPendingJobs(limit: number): Promise<EmailJob[]> {
    // Implementation depends on your database
    // This is a placeholder
    return [];
  }

  private async getRetryDueJobs(limit: number): Promise<EmailJob[]> {
    // Fetch jobs where nextRetryAt <= now()
    return [];
  }

  private async updateJobStatus(
    jobId: string,
    status: string,
    error?: string | null,
    nextRetryAt?: Date
  ): Promise<void> {
    // Update job in database
    console.log(`[v0] Job ${jobId} status updated to ${status}`);
  }
}
