import { v4 } from "uuid";
import { Spot } from "./spot.js";

export const spotMongoStore = {
    async getAllSpots() {
        const spots = await Spot.find().lean();
        return spots;
    },

    async addSpot(spot, userid) {
        if (spot) {
            try {
                if (!spot.userid) {
                    spot.userid = userid;
                }
                let newSpot = new Spot(spot);
                const spotObj = await newSpot.save();
                const u = await this.getSpotById(spotObj._id);
                return u;
            } catch (error) {
                console.log("Error adding spot: bad params");
                return null;
            }
        }
        console.log("Error adding spot: no spot provided");
        return null;
    },

    async getUserSpots(useridArg) {
        if (useridArg) {
            try {
                let foundSpot = await Spot.find({ userid: useridArg }).lean();
                if (foundSpot === undefined) foundSpot = null;
                return foundSpot;
            } catch (error) {
                console.log("Error getting spot by userid: bad params");
                return null;
            }
        }
        console.log("Error getting spot by userid: no userid provided");
        return null;
    },

    async getSpotById(id) {
        if (id) {
            try {
                let foundSpot = await Spot.findOne({ _id: id }).lean();
                if (foundSpot === undefined) foundSpot = null;
                return foundSpot;
            } catch (error) {
                console.log("Error getting spot by _id: bad params");
                return null;
            }
        }
        console.log("Error getting spot by _id: no _id provided");
        return null;
    },

    async getSpotsByCategory(categoryArg) {
        if (categoryArg) {
            try {
                let foundSpots = Spot.find({ category: categoryArg }).lean();
                if (!foundSpots) {
                    foundSpots = null;
                }
                return foundSpots;
            } catch (error) {
                console.log("Error getting spot by category: bad params");
                return null;
            }
        }
        console.log("Error getting spot by category: no category provided");
        return null;
    },

    async getSpotAnalytics(user) {
        if (user) {
            try {
                let results = {};
                results.Locale = 0;
                results.Activity = 0;
                results.Scenery = 0;
                results.Site = 0;
                results.Structure = 0;
                results.Shopping = 0;
                results.Uncategorised = 0;
                results.User = 0;
                results.Global = 0;
                let r = null;
                const categories = ['Locale', 'Activity', 'Scenery', 'Site', 'Structure', 'Shopping', 'Uncategorised'];
                for (let i = 0; i < categories.length; i++) {
                    let category = categories[i];
                    r = await this.getSpotsByCategory(category);
                    results[category] = r.length;
                }
                r = await this.getUserSpots(user._id);
                results.User = r.length;
                r = await this.getAllSpots();
                results.Global = r.length;
                return results;
            } catch (error) {
                console.log("Error getting spot analytics: bad params (user)");
                return null;
            }
        }
        console.log("Error getting spot analytics: no user provided");
        return null;
    },

    async searchSpots(userid, name, category, latitude, longitude) {
        try {
            let foundSpots = null;
            if (userid) {
                foundSpots = await this.getUserSpots(userid);
            } else {
                foundSpots = await this.getAllSpots();
            }
            if (foundSpots === null) {
                console.log("No spots found");
                return foundSpots;
            }
            if (name) {
                foundSpots = foundSpots.filter((spot) => spot.name === name);
            }
            if (latitude, longitude) {
                foundSpots = foundSpots.filter((spot) => spot.latitude === Number(latitude));
                foundSpots = foundSpots.filter((spot) => spot.longitude === Number(longitude));
            }
            if (category) {
                foundSpots = foundSpots.filter((spot) => spot.category === category);
            }
            if (foundSpots.length == 0) return null;
            return foundSpots;
        } catch (error) {
            console.log("Error executing spot search: bad params");
            return null;
        }
    },

    async deleteSpot(id) {
        if (id) {
            try {
                await Spot.deleteOne({ _id: id });
                return null;
            } catch (error) {
                console.log("Error deleting spot: bad _id");
                return null;
            }
        }
        console.log("Error deleting spot: no _id provided");
        return null;
    },

    async deleteAllSpots() {
        await Spot.deleteMany({});
    },

    async editSpot(originalSpot, updatedSpot) {
        if (originalSpot, updatedSpot) {
            try {
                if (!updatedSpot.name) {
                    updatedSpot.name = originalSpot.name;
                };
                if (!updatedSpot.description) {
                    updatedSpot.description = originalSpot.description;
                };
                if (!updatedSpot.category) {
                    updatedSpot.category = originalSpot.category;
                };
                if (!updatedSpot.latitude) {
                    updatedSpot.latitude = originalSpot.latitude;
                };
                if (!updatedSpot.longitude) {
                    updatedSpot.longitude = originalSpot.longitude;
                }
                updatedSpot.img = originalSpot.img,
                updatedSpot.userid = originalSpot.userid,
                updatedSpot._id = originalSpot._id,
                await this.deleteSpot(originalSpot._id);
                await this.addSpot(updatedSpot);
                return updatedSpot
            } catch (error) {
                console.log("Error editing spot: bad params");
                return null;
            }
        }
        console.log("Error editing spot: params missing");
        return null;
    },

    async deleteSpotsByUserid(userid) {
        if (userid) {
            try {
                const spots = await this.getUserSpots(userid);
                for (let i = 0; i < spots.length; i++) {
                    await this.deleteSpot(spots[i]._id);
                }
                return null;
            } catch (error) {
                console.log("Error deleting user spots: bad userid param");
                return null;
            }
        }
        console.log("Error deleting user spots: no userid provided");
        return null;
    },

    async updateSpot(updatedSpot) {
        const spot = await Spot.findOne({ _id: updatedSpot._id });
        spot.img = updatedSpot.img;
        await spot.save();
      },
};
