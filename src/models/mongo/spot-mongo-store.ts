import { Spot } from "../../types/spot-types.js";
import { SpotMongoose } from "./spot.js";
import { User } from "../../types/spot-types.js";

export const spotMongoStore = {
    async getAllSpots(): Promise<Spot[] | null> {
        const spots = await SpotMongoose.find().lean();
        return spots;
    },

    async addSpot(spot: Spot, userid: string) {
        if (spot) {
            try {
                if (!spot.userid) {
                    spot.userid = userid;
                }
                let newSpot = new SpotMongoose({...spot});
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

    async getUserSpots(useridArg: string): Promise<Spot[] | null>{
        if (useridArg) {
            try {
                const foundSpot = await SpotMongoose.find({ userid: useridArg }).lean();
                if (foundSpot === undefined) return null;
                return foundSpot;
            } catch (error) {
                console.log("Error getting spot by userid: bad params");
                return null;
            }
        }
        console.log("Error getting spot by userid: no userid provided");
        return null;
    },

    async getSpotById(id: string) {
        if (id) {
            try {
                let foundSpot = await SpotMongoose.findOne({ _id: id }).lean();
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

    async getSpotsByCategory(categoryArg: string): Promise<Spot[] | null> {
        if (categoryArg) {
            try {
                const foundSpots = await SpotMongoose.find({ category: categoryArg }).lean();
                if (!foundSpots) {
                    return null;
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

    async getSpotAnalytics(user: User): Promise<any | null> {
        if (user) {
            try {
                let results:any = {};
                results.Locale = 0;
                results.Activity = 0;
                results.Scenery = 0;
                results.Site = 0;
                results.Structure = 0;
                results.Shopping = 0;
                results.Uncategorised = 0;
                results.User = 0;
                results.Global = 0;
                let r:any = null;
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

    async searchSpots(userid: string, name: string, category: string, latitude: number, longitude: number): Promise<Spot[] | null> {
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
            if ((latitude) && (longitude)) {
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

    async deleteSpot(id: string) {
        if (id) {
            try {
                await SpotMongoose.deleteOne({ _id: id });
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
        await SpotMongoose.deleteMany({});
    },

    async editSpot(originalSpot: Spot, updatedSpot: Spot): Promise<Spot | null> {
        if ((originalSpot) && (updatedSpot)) {
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
                await this.deleteSpot(originalSpot._id);
                await this.addSpot(updatedSpot, originalSpot.userid as string);
                return updatedSpot
            } catch (error) {
                console.log("Error editing spot: bad params");
                return null;
            }
        }
        console.log("Error editing spot: params missing");
        return null;
    },

    async deleteSpotsByUserid(userid: string) {
        if (userid) {
            try {
                const spots = await this.getUserSpots(userid);
                if (spots) {
                    for (let i = 0; i < spots.length; i++) {
                        await this.deleteSpot(spots[i]._id);
                    }
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

    async updateSpot(updatedSpot: Spot) {
        const spot = await SpotMongoose.findOne({ _id: updatedSpot._id });
        if (spot) {
            spot.img = updatedSpot.img;
            await spot.save();
        }
    },
};
