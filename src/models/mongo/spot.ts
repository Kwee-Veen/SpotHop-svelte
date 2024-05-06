import { Schema, model } from "mongoose";
import { Spot } from "../../types/spot-types.js";

const spotSchema = new Schema<Spot>({
    name: String,
    description: String,
    img: String,
    category: String,
    latitude: Number,
    longitude: Number,
    userid: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
});

export const SpotMongoose = model("Spot", spotSchema);

