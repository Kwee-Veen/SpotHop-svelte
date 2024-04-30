import { SpotSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const spots = await db.spotStore.getUserSpots(loggedInUser._id);
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
      const name = request.payload.name;
      const category = request.payload.category;
      const latitude = request.payload.latitude;
      const longitude = request.payload.longitude;
      let userid = null; 
      if (request.payload.global === "false") {
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
      const newSpot = {
        name: request.payload.name,
        category: request.payload.category,
        description: request.payload.description,
        latitude: request.payload.latitude,
        longitude: request.payload.longitude,
        userid: loggedInUser._id,
      };
      await db.spotStore.addSpot(newSpot, loggedInUser._id);
      console.log("New spot added: " + JSON.stringify(newSpot.name));
      return h.redirect("/dashboard");
    },
  },

  deleteSpot: {
    handler: async function (request, h) {
      const spot = await db.spotStore.getSpotById(request.params.id);
      console.log("Spot deleted: " + JSON.stringify(spot.name));
      await db.spotStore.deleteSpot(spot._id);
      return h.redirect("/dashboard");
    },
  },
};
