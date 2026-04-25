import { Redis } from "@upstash/redis";

// These env vars come from Upstash dashboard → copy REST URL + token
// Add them in .env.local for local dev and in Vercel dashboard for production
const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default redis;
