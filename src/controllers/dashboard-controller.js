import { SpotSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
export const dashboardController = {
    index: {
        handler: async function (request, h) {
            const loggedInUser = request.auth.credentials;
            console.log("logged in user _id: " + loggedInUser._id);
            const spots = await db.spotStore.getUserSpots(loggedInUser._id);
            console.log(spots);
            const analytics = await db.spotStore.getSpotAnalytics(loggedInUser);
            const viewData = {
                title: "SpotHop Dashboard",
                user: loggedInUser,
                spots: spots,
                analytics: analytics,
            };
            console.log("Rendering dashboard view");
            return h.view("dashboard-view", viewData);
        },
    },
    searchSpot: {
        handler: async function (request, h) {
            const loggedInUser = request.auth.credentials;
            const payload = request.payload;
            const name = payload.name;
            const category = payload.category;
            const latitude = payload.latitude;
            const longitude = payload.longitude;
            let userid = null;
            if (payload.global === "false") {
                userid = loggedInUser._id;
            }
            const spots = await db.spotStore.searchSpots(userid, name, category, latitude, longitude);
            const analytics = await db.spotStore.getSpotAnalytics(loggedInUser);
            const viewData = {
                title: "Search Results",
                user: loggedInUser,
                spots: spots,
                analytics: analytics,
            };
            console.log("Executing search");
            return h.view("dashboard-view", viewData);
        },
    },
    addSpot: {
        validate: {
            payload: SpotSpec,
            options: { abortEarly: false },
            failAction: async function (request, h, error) {
                const loggedInUser = request.auth.credentials;
                const spots = await db.spotStore.getUserSpots(loggedInUser._id);
                console.log("Error adding spot");
                return h.view("dashboard-view", { title: "Error adding spot", spots: spots, errors: error.details }).takeover().code(400);
            },
        },
        handler: async function (request, h) {
            const loggedInUser = request.auth.credentials;
            const payload = request.payload;
            const newSpot = {
                name: payload.name,
                category: payload.category,
                description: payload.description,
                latitude: payload.latitude,
                longitude: payload.longitude,
                userid: loggedInUser._id,
            };
            await db.spotStore.addSpot(newSpot, loggedInUser._id);
            console.log("New spot added: " + JSON.stringify(newSpot.name));
            return h.redirect("/dashboard");
        },
    },
    deleteSpot: {
        handler: async function (request, h) {
            const paramPayload = request.params;
            const spot = await db.spotStore.getSpotById(paramPayload.id);
            console.log("Spot deleted: " + JSON.stringify(spot.name));
            await db.spotStore.deleteSpot(spot._id);
            return h.redirect("/dashboard");
        },
    },
};
