describe("Email Rate Limiting", () => {
    it("should respect provider rate limits", async () => {
      const processor = new EmailQueueProcessor({
        emailsPerSecond: 10,
        batchSize: 5,
        maxConcurrent: 3,
      });
  
      const startTime = Date.now();
  
      // Send 50 emails (should take ~5 seconds at 10/sec)
      const jobs = Array.from({ length: 50 }, (_, i) => ({
        id: `job_${i}`,
        email: `test${i}@example.com`,
        subject: "Test",
        body: "Test body",
        retryCount: 0,
        maxRetries: 5,
        status: "pending" as const,
      }));
  
      for (const job of jobs) {
        await processor.processEmail(job);
      }
  
      const elapsedTime = Date.now() - startTime;
  
      // Should take approximately 5 seconds (50 emails / 10 per second)
      expect(elapsedTime).toBeGreaterThanOrEqual(4500);
      expect(elapsedTime).toBeLessThan(7000); // Allow some variance
    });
  
    it("should implement exponential backoff correctly", () => {
      const delays = Array.from({ length: 5 }, (_, i) =>
        RetryStrategy.calculateBackoffDelay(i, 1000, 60000, 5)
      );
  
      // Delays should roughly double each time (with jitter)
      expect(delays[1]).toBeGreaterThan(delays[0]);
      expect(delays[2]).toBeGreaterThan(delays[1]);
    });
  
    it("should not retry non-retryable errors", () => {
      const isRetryable = RetryStrategy.isRetryable(
        "invalid_email_format"
      );
      expect(isRetryable).toBe(false);
  
      const isRetryableTimeout = RetryStrategy.isRetryable("timeout");
      expect(isRetryableTimeout).toBe(true);
    });
  });
