import { userApi } from "./api/user-api.js";
import { spotApi } from "./api/spot-api.js";

export const apiRoutes = [
  { method: "POST" as const, path: "/api/users/authenticate", config: userApi.authenticate },

  { method: "POST" as const, path: "/api/users", config: userApi.create },
  { method: "GET" as const, path: "/api/users", config: userApi.find },
  { method: "DELETE" as const, path: "/api/users", config: userApi.deleteAll },
  { method: "GET" as const, path: "/api/users/{id}", config: userApi.findOne },
  { method: "GET" as const, path: "/api/users/spotCount/", config: userApi.getUserSpotCount },

  { method: "POST" as const, path: "/api/spots", config: spotApi.create },
  { method: "DELETE" as const, path: "/api/spots", config: spotApi.deleteAll },
  { method: "GET" as const, path: "/api/spots", config: spotApi.find },
  { method: "GET" as const, path: "/api/spots/{id}", config: spotApi.findOne },
  { method: "DELETE" as const, path: "/api/spots/{id}", config: spotApi.deleteOne },
  { method: "GET" as const, path: "/api/spots/analytics", config: spotApi.spotAnalytics },
];
