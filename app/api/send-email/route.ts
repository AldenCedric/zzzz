import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 emails per minute
});

export async function POST(request: Request) {
  try {
    const { email, subject, body } = await request.json();

    // Check rate limit before queuing
    const { success } = await ratelimit.limit(`email:${email}`);

    if (!success) {
      return Response.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // Queue the email job instead of sending immediately
    await queueEmailJob({
      email,
      subject,
      body,
      retryCount: 0,
      createdAt: new Date(),
    });

    return Response.json({ success: true, message: "Email queued" });
  } catch (error) {
    console.error("[v0] Email queueing failed:", error);
    return Response.json(
      { error: "Failed to queue email" },
      { status: 500 }
    );
  }
}
