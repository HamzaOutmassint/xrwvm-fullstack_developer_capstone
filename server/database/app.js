const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const cors = require("cors");

const Reviews = require("./review");
const Dealerships = require("./dealership");

const app = express();
const port = 3030;

const reviewsData = JSON.parse(fs.readFileSync("reviews.json", "utf8"));
const dealershipsData = JSON.parse(
  fs.readFileSync("dealerships.json", "utf8")
);

app.use(cors());
app.use(require("body-parser").urlencoded({ extended: false }));

mongoose.connect("mongodb://mongo_db:27017/", { dbName: "dealershipsDB" });

try {
  Reviews.deleteMany({}).then(() => {
    Reviews.insertMany(reviewsData.reviews);
  });

  Dealerships.deleteMany({}).then(() => {
    Dealerships.insertMany(dealershipsData.dealerships);
  });
} catch (error) {
  console.error("Error initializing database:", error);
}

app.get("/", async (req, res) => {
  res.send("Welcome to the Mongoose API");
});

app.get("/fetchReviews", async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Error fetching documents" });
  }
});

app.get("/fetchReviews/dealer/:id", async (req, res) => {
  try {
    const documents = await Reviews.find({
      dealership: req.params.id
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Error fetching documents" });
  }
});

app.get("/fetchDealers", async (req, res) => {
  try {
    const documents = await Dealerships.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Error fetching dealerships" });
  }
});

app.get("/fetchDealers/:state", async (req, res) => {
  try {
    const documents = await Dealerships.find({
      state: req.params.state
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Error fetching dealerships by state" });
  }
});

app.get("/fetchDealer/:id", async (req, res) => {
  try {
    const document = await Dealerships.findOne({
      id: parseInt(req.params.id, 10)
    });

    if (document) {
      res.json(document);
    } else {
      res.status(404).json({ error: "Dealership not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching dealership by id" });
  }
});

app.post("/insert_review", express.raw({ type: "*/*" }), async (req, res) => {
  const data = JSON.parse(req.body);
  const documents = await Reviews.find().sort({ id: -1 });
  const newId = documents[0].id + 1;

  const review = new Reviews({
    id: newId,
    name: data.name,
    dealership: data.dealership,
    review: data.review,
    purchase: data.purchase,
    purchase_date: data.purchase_date,
    car_make: data.car_make,
    car_model: data.car_model,
    car_year: data.car_year
  });

  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error inserting review" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});