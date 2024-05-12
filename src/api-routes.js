import { userApi } from "./api/user-api.js";
import { spotApi } from "./api/spot-api.js";
export const apiRoutes = [
    { method: "POST", path: "/api/users/authenticate", config: userApi.authenticate },
    { method: "POST", path: "/api/users", config: userApi.create },
    { method: "GET", path: "/api/users", config: userApi.find },
    { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
    { method: "GET", path: "/api/users/{id}", config: userApi.findOne },
    { method: "GET", path: "/api/users/spotCount/", config: userApi.getUserSpotCount },
    { method: "POST", path: "/api/spots", config: spotApi.create },
    { method: "DELETE", path: "/api/spots", config: spotApi.deleteAll },
    { method: "GET", path: "/api/spots", config: spotApi.find },
    { method: "GET", path: "/api/spots/{id}", config: spotApi.findOne },
    { method: "DELETE", path: "/api/spots/{id}", config: spotApi.deleteOne },
    { method: "GET", path: "/api/spots/analytics", config: spotApi.spotAnalytics },
];
