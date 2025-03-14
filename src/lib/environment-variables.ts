// const _absent_envs: string[] = [];

const APP_NAME = process.env.APP_NAME || "APP_NAME";
if (!process.env.APP_NAME) {
  console.warn(
    "Environment Variables doesnot contain: APP_NAME\n\tUsing default: APP_NAME"
  );
}

const NEXTAUTH_URL = process.env.NEXTAUTH_URL || window.location.origin;
if (!process.env.NEXTAUTH_URL) {
  console.warn(
    `Environment Variables doesnot contain: NEXTAUTH_URL\n\tUsing default: ${window.location.origin}`
  );
}

const NODE_ENV = process.env.NODE_ENV || "development";
if (!process.env.NODE_ENV) {
  console.warn(
    "Environment Variables doesnot contain: NODE_ENV\n\tUsing default: development"
  );
}

const DATABASE_URL = process.env.DATABASE_URL || "";
if (!process.env.DATABASE_URL) {
  console.warn("Environment Variables doesnot contain: DATABASE_URL");
  // _absent_envs.push("DATABASE_URL");
}

const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY || "";
if (!process.env.AZURE_OPENAI_API_KEY) {
  console.warn("Environment Variables doesnot contain: AZURE_OPENAI_API_KEY");
  // _absent_envs.push("AZURE_OPENAI_API_KEY");
}

const AZURE_OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION || "";
if (!process.env.AZURE_OPENAI_API_VERSION) {
  console.warn(
    "Environment Variables doesnot contain: AZURE_OPENAI_API_VERSION"
  );
  // _absent_envs.push("AZURE_OPENAI_API_VERSION");
}

const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT || "";
if (!process.env.AZURE_OPENAI_ENDPOINT) {
  console.warn("Environment Variables doesnot contain: AZURE_OPENAI_ENDPOINT");
  // _absent_envs.push("AZURE_OPENAI_ENDPOINT");
}

const AZURE_OPENAI_DEPLOYMENT_NAME =
  process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "";
if (!process.env.AZURE_OPENAI_DEPLOYMENT_NAME) {
  console.warn(
    "Environment Variables doesnot contain: AZURE_OPENAI_DEPLOYMENT_NAME"
  );
  // _absent_envs.push("AZURE_OPENAI_DEPLOYMENT_NAME");
}

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "";
if (!process.env.NEXTAUTH_SECRET) {
  console.warn("Environment Variables doesnot contain: NEXTAUTH_SECRET");
  // _absent_envs.push("NEXTAUTH_SECRET");
}

const AUTH_GOOGLE_ID = process.env.AUTH_GOOGLE_ID || "";
if (!process.env.AUTH_GOOGLE_ID) {
  console.warn("Environment Variables doesnot contain: AUTH_GOOGLE_ID");
  // _absent_envs.push("AUTH_GOOGLE_ID");
}

const AUTH_GOOGLE_SECRET = process.env.AUTH_GOOGLE_SECRET || "";
if (!process.env.AUTH_GOOGLE_SECRET) {
  console.warn("Environment Variables doesnot contain: AUTH_GOOGLE_SECRET");
  // _absent_envs.push("AUTH_GOOGLE_SECRET");
}

const AUTH_GITHUB_ID = process.env.AUTH_GITHUB_ID || "";
if (!process.env.AUTH_GITHUB_ID) {
  console.warn("Environment Variables doesnot contain: AUTH_GITHUB_ID");
  // _absent_envs.push("AUTH_GITHUB_ID");
}

const AUTH_GITHUB_SECRET = process.env.AUTH_GITHUB_SECRET || "";
if (!process.env.AUTH_GITHUB_SECRET) {
  console.warn("Environment Variables doesnot contain: AUTH_GITHUB_SECRET");
  // _absent_envs.push("AUTH_GITHUB_SECRET");
}

const AUTH_AZURE_AD_ID = process.env.AUTH_AZURE_AD_ID || "";
if (!process.env.AUTH_AZURE_AD_ID) {
  console.warn("Environment Variables doesnot contain: AUTH_AZURE_AD_ID");
  // _absent_envs.push("AUTH_AZURE_AD_ID");
}

const AUTH_AZURE_AD_SECRET = process.env.AUTH_AZURE_AD_SECRET || "";
if (!process.env.AUTH_AZURE_AD_SECRET) {
  console.warn("Environment Variables doesnot contain: AUTH_AZURE_AD_SECRET");
  // _absent_envs.push("AUTH_AZURE_AD_SECRET");
}

const DEFAULT_LOGIN_ROUTE = process.env.DEFAULT_LOGIN_ROUTE || "/login";
if (!process.env.DEFAULT_LOGIN_ROUTE) {
  console.warn(
    "Environment Variables doesnot contain: DEFAULT_LOGIN_ROUTE\n\tUsing default: /login"
  );
  // _absent_envs.push("DEFAULT_LOGIN_ROUTE");
}

const DEFAULT_REGISTER_ROUTE =
  process.env.DEFAULT_REGISTER_ROUTE || "/register";
if (!process.env.DEFAULT_REGISTER_ROUTE) {
  console.warn(
    "Environment Variables doesnot contain: DEFAULT_REGISTER_ROUTE\n\tUsing default: /register"
  );
  // _absent_envs.push("DEFAULT_REGISTER_ROUTE");
}

const DEFAULT_PASSKEY_REGISTER_ROUTE =
  process.env.DEFAULT_PASSKEY_REGISTER_ROUTE || "/register/passkey";
if (!process.env.DEFAULT_PASSKEY_REGISTER_ROUTE) {
  console.warn(
    "Environment Variables doesnot contain: DEFAULT_PASSKEY_REGISTER_ROUTE\n\tUsing default: /register/passkey"
  );
  // _absent_envs.push("DEFAULT_PASSKEY_REGISTER_ROUTE");
}

const DEFAULT_LOGGED_IN_ROUTE = process.env.DEFAULT_LOGGED_IN_ROUTE || "/chats";
if (!process.env.DEFAULT_LOGGED_IN_ROUTE) {
  console.warn(
    "Environment Variables doesnot contain: DEFAULT_LOGGED_IN_ROUTE\n\tUsing default: /chats"
  );
  // _absent_envs.push("DEFAULT_LOGGED_IN_ROUTE");
}

export {
  APP_NAME,
  NEXTAUTH_URL,
  NODE_ENV,
  DATABASE_URL,
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_API_VERSION,
  AZURE_OPENAI_ENDPOINT,
  AZURE_OPENAI_DEPLOYMENT_NAME,
  NEXTAUTH_SECRET,
  AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET,
  AUTH_GITHUB_ID,
  AUTH_GITHUB_SECRET,
  AUTH_AZURE_AD_ID,
  AUTH_AZURE_AD_SECRET,
  DEFAULT_LOGIN_ROUTE,
  DEFAULT_REGISTER_ROUTE,
  DEFAULT_PASSKEY_REGISTER_ROUTE,
  DEFAULT_LOGGED_IN_ROUTE,
};
