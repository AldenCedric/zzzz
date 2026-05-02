export const emailConfig = {
    // Provider-specific limits (adjust based on your tier)
    providers: {
      sendgrid: {
        emailsPerSecond: 100,
        maxConcurrent: 50,
        dailyLimit: 100000,
      },
      aws_ses: {
        emailsPerSecond: 14, // Default SES limit
        maxConcurrent: 20,
        dailyLimit: 50000,
      },
      mailgun: {
        emailsPerSecond: 600,
        maxConcurrent: 100,
        dailyLimit: 200000,
      },
    },
  
    // Retry strategy
    retry: {
      maxAttempts: 5,
      initialDelayMs: 1000,
      maxDelayMs: 60000,
      backoffMultiplier: 2,
    },
  
    // Timeouts
    timeout: {
      requestMs: 10000,
      overallMs: 30000,
    },
  
    // Monitoring
    monitoring: {
      enabled: true,
      sampleRate: 0.1, // Sample 10% for cost control
    },
  };
