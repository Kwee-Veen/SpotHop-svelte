import { SpotEdit } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { imageStore } from "../models/image-store.js";
export const spotController = {
    index: {
        handler: async function (request, h) {
            const spot = await db.spotStore.getSpotById(request.params.id);
            const viewData = {
                title: "Edit Spot",
                spot: spot,
            };
            console.log("Editing spot ", spot.name);
            return h.view("spot-view", viewData);
        },
    },
    editSpot: {
        validate: {
            payload: SpotEdit,
            options: { abortEarly: false },
            failAction: async function (request, h, error) {
                const loggedInUser = request.auth.credentials;
                const spots = await db.spotStore.getUserSpots(loggedInUser._id);
                return h.view("dashboard-view", { title: "Error editing spot", spots: spots, errors: error.details }).takeover().code(400);
            },
        },
        handler: async function (request, h) {
            const { name, category, description, latitude, longitude } = request.payload;
            const originalSpot = await db.spotStore.getSpotById(request.params.id);
            const newSpot = {
                name: name,
                category: category,
                description: description,
                latitude: latitude,
                longitude: longitude,
                _id: originalSpot._id,
                userid: originalSpot.userid,
            };
            console.log("Editing Spot \"" + JSON.stringify(originalSpot.name) + "\"");
            await db.spotStore.editSpot(originalSpot, newSpot);
            return h.redirect("/dashboard");
        },
    },
    uploadImage: {
        handler: async function (request, h) {
            try {
                const spot = await db.spotStore.getSpotById(request.params.id);
                const { imagefile } = request.payload;
                if (Object.keys(imagefile).length > 0) {
                    const url = await imageStore.uploadImage(imagefile);
                    spot.img = url;
                    await db.spotStore.updateSpot(spot);
                }
                console.log("Image added to spot " + spot.name);
                return h.redirect("/dashboard");
            }
            catch (err) {
                console.log(err);
                return h.redirect("/dashboard");
            }
        },
        payload: {
            multipart: true,
            output: "data",
            maxBytes: 209715200,
            parse: true,
        },
    },
    deleteImage: {
        handler: async function (request, h) {
            try {
                const spot = await db.spotStore.getSpotById(request.params.id);
                const url = await imageStore.deleteImage(spot.img);
                spot.img = null;
                await db.spotStore.updateSpot(spot);
                console.log("Image delete from spot " + spot.name);
                return h.redirect("/dashboard");
            }
            catch (err) {
                console.log(err);
                return h.redirect("/dashboard");
            }
        },
    },
};
