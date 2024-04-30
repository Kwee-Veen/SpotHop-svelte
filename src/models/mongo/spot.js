import Mongoose from "mongoose";

const { Schema } = Mongoose;

const spotSchema = new Schema({
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

export const Spot = Mongoose.model("Spot", spotSchema);