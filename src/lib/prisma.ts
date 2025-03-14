import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { DATABASE_URL, NODE_ENV } from "./environment-variables";

// Type definitions
declare global {
  var prisma: PrismaClient | undefined;
}

neonConfig.fetchEndpoint = (host) => {
  const [protocol, port] = host === 'db.localtest.me' ? ['http', 4444] : ['https', 443];
  return `${protocol}://${host}:${port}/sql`;
};

// For WebSocket connections, disable TLS for our local testing.
const connectionUrl = new URL(DATABASE_URL);
neonConfig.useSecureWebSocket = connectionUrl.hostname !== 'db.localtest.me';

// Set up the WebSocket proxy to point to port 4444.
neonConfig.wsProxy =
  connectionUrl.hostname === 'db.localtest.me'
    ? (host) => `${host}:4444/v1`
    : undefined;

// Provide the WebSocket constructor for Node.js.
neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
neonConfig.poolQueryViaFetch = true;


const pool = new Pool({ connectionString: DATABASE_URL });
const adapter = new PrismaNeon(pool);
const prisma = global.prisma || new PrismaClient({ adapter });

if (NODE_ENV === "development") global.prisma = prisma;

export { prisma };
