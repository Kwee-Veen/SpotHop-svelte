import { v4 } from "uuid";
import { db } from "./store-utils.js";

export const spotJsonStore = {
  async getAllSpots() {
    await db.read();
    return db.data.spots;
  },

  async addSpot(spot, userid) {
    if (spot) {
      try {
        await db.read();
        if (!spot._id) {
          spot._id = v4();
        }
        if (!spot.userid) {
          spot.userid = userid;
        }
        db.data.spots.push(spot);
        await db.write();
        return spot;
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
        await db.read();
        let foundSpots = db.data.spots.filter((spot) => spot.userid === useridArg);
        if (!foundSpots) {
          foundSpots = null;
        }
        return foundSpots;
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
        await db.read();
        let foundSpot = db.data.spots.find((spot) => spot._id === id);
        if (!foundSpot) {
          foundSpot = null;
        }
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
        await db.read();
        let foundSpots = db.data.spots.filter((spot) => spot.category === categoryArg);
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
        await db.read();
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
      await db.read();
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
      if (foundSpots.length === 0) foundSpots = null
      return foundSpots;
    } catch (error) {
      console.log("Error executing spot search: bad params");
      return null;
    }
  },

  async deleteSpot(id) {
    if (id) {
      try {
        await db.read();
        const index = db.data.spots.findIndex((spot) => spot._id === id);
        if (index !== -1) db.data.spots.splice(index, 1);
        await db.write();
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
    db.data.spots = [];
    await db.write();
  },

  async editSpot(originalSpot, updatedSpot) {
    if (originalSpot, updatedSpot) {
      try {
        await db.read();
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
        updatedSpot.userid = originalSpot.userid,
          updatedSpot._id = originalSpot._id,
          await this.deleteSpot(originalSpot._id);
        await this.addSpot(updatedSpot);
        return updatedSpot;
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
        await db.read();
        const spots = await this.getUserSpots(userid);
        for (let i = 0; i < spots.length; i++) {
          await this.deleteSpot(spots[i]._id);
        }
        await db.write();
        return null;
      } catch (error) {
        console.log("Error deleting user spots: bad userid param");
        return null;
      }
    }
    console.log("Error deleting user spots: no userid provided");
    return null;
  },
};
