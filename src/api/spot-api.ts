import Boom from "@hapi/boom";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { db } from "../models/db.js";
import { Spot } from "../types/spot-types.js";

export const spotApi = {
find: {
  auth: {
    strategy: "jwt",
  },
    handler: async function (request: Request, h: ResponseToolkit) {
      try {
        const spots = await db.spotStore.getAllSpots();
        return h.response(spots).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, h: ResponseToolkit) {
      const spotPayload = request.payload as Spot;
      const newSpot = {
        name: spotPayload.name,
        category: spotPayload.category,
        description: spotPayload.description,
        latitude: spotPayload.latitude,
        longitude: spotPayload.longitude,
        userid:  request.auth.credentials._id,
      };
      const spot = (await db.spotStore.addSpot(newSpot)) as Spot;
      console.log(spot);
      if (spot !== null) {
        return h.response(spot).code(200);
      }
      return Boom.badImplementation("error creating spot");
    },
  },


  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, h: ResponseToolkit) {
      try {
        const paramPayload = request.params as any;
        const spot = await db.spotStore.getSpotById(paramPayload.id);
        if (!spot) {
          return Boom.notFound("No Spot with this id");
        }
        await db.spotStore.deleteSpot(spot._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No Spot with this id");
      }
    },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    async handler(request: Request, h: ResponseToolkit) {
      try {
        const paramPayload = request.params as any;
        const spot = await db.spotStore.getSpotById(paramPayload.id);
        if (!spot) {
          return Boom.notFound("No Spot with this id");
        }
        return h.response(spot).code(200);
      } catch (err) {
        return Boom.serverUnavailable("No Spot with this id");
      }
    },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, h: ResponseToolkit) {
      try {
        await db.spotStore.deleteAllSpots();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  spotAnalytics: {
    auth: {
      strategy: "jwt",
    },
    async handler(request: Request, h: ResponseToolkit) {
      try {
      const loggedInUser = request.auth.credentials;
      const analytics = await db.spotStore.getSpotAnalytics(loggedInUser);
      return h.response(analytics).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
};