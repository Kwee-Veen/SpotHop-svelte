import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, SpotSpec, SpotSpecPlus, SpotEdit, SpotArray } from "../models/joi-schemas.js";
import { validationError } from "./logger.js";

export const spotApi = {
    find: {
      auth: {
        strategy: "jwt",
      },
        handler: async function (request, h) {
          try {
            const spots = await db.spotStore.getAllSpots();
            return spots;
          } catch (err) {
            return Boom.serverUnavailable("Database Error");
          }
        },
        tags: ["api"],
        description: "Get all spots",
        notes: "Returns details of all spots",
        response: { schema: SpotArray, failAction: validationError },
      },
    
      create: {
        auth: {
          strategy: "jwt",
        },
        handler: async function (request, h) {
          try {
            const spot = request.payload;
            const newSpot = await db.spotStore.addSpot(spot);
            if (newSpot) {
              return h.response(newSpot).code(201);
            }
            return Boom.badImplementation("error creating spot");
          } catch (err) {
            return Boom.serverUnavailable("Database Error");
          }
        },
        tags: ["api"],
        description: "Create a spot",
        notes: "Creates then returns the newly created spot",
        validate: { payload: SpotSpec, failAction: validationError },
        response: { schema: SpotSpecPlus, failAction: validationError },
      },

      deleteOne: {
        auth: {
          strategy: "jwt",
        },
        handler: async function (request, h) {
          try {
            const spot = await db.spotStore.getSpotById(request.params.id);
            if (!spot) {
              return Boom.notFound("No Spot with this id");
            }
            await db.spotStore.deleteSpot(spot._id);
            return h.response().code(204);
          } catch (err) {
            return Boom.serverUnavailable("No Spot with this id");
          }
        },
        tags: ["api"],
        description: "Delete one spot",
        notes: "Delete one specific spot",
        validate: { params: { id: IdSpec }, failAction: validationError },
      },
    
      findOne: {
        auth: {
          strategy: "jwt",
        },
        async handler(request) {
          try {
            const spot = await db.spotStore.getSpotById(request.params.id);
            if (!spot) {
              return Boom.notFound("No Spot with this id");
            }
            return spot;
          } catch (err) {
            return Boom.serverUnavailable("No Spot with this id");
          }
        },
        tags: ["api"],
        description: "Get one spot",
        notes: "Returns one specific spot",
        validate: { params: { id: IdSpec }, failAction: validationError },
        response: { schema: SpotSpecPlus, failAction: validationError },
      },
    
      deleteAll: {
        auth: {
          strategy: "jwt",
        },
        handler: async function (request, h) {
          try {
            await db.spotStore.deleteAllSpots();
            return h.response().code(204);
          } catch (err) {
            return Boom.serverUnavailable("Database Error");
          }
        },
        tags: ["api"],
        description: "Delete all spots",
        notes: "Deletes all spots from SpotHop",
      },
};