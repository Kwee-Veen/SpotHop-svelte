import * as dotenv from "dotenv";
import Mongoose from "mongoose";
// @ts-ignore
import * as mongooseSeeder from "mais-mongoose-seeder";
import { userMongoStore } from "./user-mongo-store.js";
import { spotMongoStore } from "./spot-mongo-store.js";
import { seedData } from "./seed-data.js";
const seedLib = mongooseSeeder.default;
async function seed() {
    const seeder = seedLib(Mongoose);
    const dbData = await seeder.seed(seedData, { dropDatabase: false, dropCollections: true });
    console.log(dbData);
}
export function connectMongo(db) {
    dotenv.config();
    Mongoose.set("strictQuery", true);
    Mongoose.connect(process.env.db);
    const mongoDb = Mongoose.connection;
    db.userStore = userMongoStore;
    db.spotStore = spotMongoStore;
    mongoDb.on("error", (err) => {
        console.log(`database connection error: ${err}`);
    });
    mongoDb.on("disconnected", () => {
        console.log("database disconnected");
    });
    mongoDb.once("open", function () {
        console.log(`database connected to ${mongoDb.name} on ${mongoDb.host}`);
        seed();
    });
}
