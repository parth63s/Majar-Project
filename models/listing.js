const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listeningSchema = new Schema({
    title: {
        type:String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        set : (v) => v === "" ? "default link" : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ]
});

listeningSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({reviews: {$in: listing.reviews}});
    }
})

const  Listing = mongoose.model("Listing", listeningSchema);
module.exports = Listing;