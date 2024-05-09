import Boom from "@hapi/boom";
import { db } from "../models/db.js";
export const spotApi = {
    find: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const spots = await db.spotStore.getAllSpots();
                return h.response(spots).code(200);
                ;
            }
            catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
    },
    create: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            const spotPayload = request.payload;
            console.log("request auth credentials _id: " + request.auth.credentials._id);
            const newSpot = {
                name: spotPayload.name,
                category: spotPayload.category,
                description: spotPayload.description,
                latitude: spotPayload.latitude,
                longitude: spotPayload.longitude,
                userid: request.auth.credentials._id,
            };
            const spot = (await db.spotStore.addSpot(newSpot));
            console.log(spot);
            if (spot !== null) {
                return h.response(spot).code(200);
            }
            return Boom.badImplementation("error creating candidate");
        },
    },
    deleteOne: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const paramPayload = request.params;
                const spot = await db.spotStore.getSpotById(paramPayload.id);
                if (!spot) {
                    return Boom.notFound("No Spot with this id");
                }
                await db.spotStore.deleteSpot(spot._id);
                return h.response().code(204);
            }
            catch (err) {
                return Boom.serverUnavailable("No Spot with this id");
            }
        },
    },
    findOne: {
        auth: {
            strategy: "jwt",
        },
        async handler(request, h) {
            try {
                const paramPayload = request.params;
                const spot = await db.spotStore.getSpotById(paramPayload.id);
                if (!spot) {
                    return Boom.notFound("No Spot with this id");
                }
                return h.response(spot).code(200);
            }
            catch (err) {
                return Boom.serverUnavailable("No Spot with this id");
            }
        },
    },
    deleteAll: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                await db.spotStore.deleteAllSpots();
                return h.response().code(204);
            }
            catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
    },
};
