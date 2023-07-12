import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { MongoClient } from "mongodb";

/* Be sure to use DATABASE_NAME in your call to .db(), so we can change the constant while grading. */
let DATABASE_NAME = "project";
if (process.env.DATABASE_NAME) DATABASE_NAME = process.env.DATABASE_NAME;

let api = express.Router();
let Users;

const initApi = async (app) => {
  app.set("json spaces", 2);
  app.use("/api", api);

  // Set up database connection and collection variables
  let conn = await MongoClient.connect("mongodb://127.0.0.1");
  let db = conn.db(DATABASE_NAME);
  Users = db.collection("users");
};

api.use(bodyParser.json());
api.use(cors());

api.get("/", (req, res) => {
  res.json({ message: "API is running" });
});


api.get("/users", async(req, res) => {
  let allUsers = await Users.find().toArray();
  let userIds = allUsers.map(user => user.id);

  res.status(200).json({users: userIds});
});

api.get("/users/:id", async (req, res) => {
  let userId = req.params.id;
  let user = await Users.findOne({id: userId});
  if (!user) {
    res.status(404).json({ error: `No user with ID ${userId}` } );
  } else {
    const { _id, ...userNoId } = user;
    res.status(200).json(userNoId);
  }
});

api.post("/users", async (req, res) => {
  let userId = req.body.id;
  if (!userId || userId.trim() === "") {
    res.status(400).json({ error: "Missing id"});
    return;
  }

  // Check if the user already exists
  const existingUser = await Users.findOne({id: userId });
  if (existingUser) {
    res.status(400).json({ error: `${userId} already exists` });
    return;
  }

  // Create a new user object
  const newUser = {
    id: userId,
    name: userId,
    age: "0",
    gender: "",
    records: {},
  };
  
  await Users.insertOne(newUser);
  delete newUser._id;

  res.status(200).json(newUser);
});

api.patch("/users/:id", async (req, res) => {
  let userId = req.params.id;
  let name = req.body.name;
  let age = req.body.age;
  let gender = req.body.gender;
  let records = req.body.records;

  let user = await Users.findOne({ id: userId });
  if (!user) {
    res.status(404).json({ error: `No user with ID ${userId}` });
    return;
  }
  // Update the user's profile fields if provided
  if (name !== undefined) {
    user.name = name.trim() === "" ? userId : name;
  }

  if (age !== undefined) {
    user.age = age.trim() === "" ? "0": age;
  }

  if (gender !== undefined && gender !== null) {
    user.gender = gender.trim() === "" ? "": gender;
  }

  if (records !== undefined) {
    user.records = records;
  }

  // Update the user in the database
  await Users.updateOne({ id: userId }, { $set: { name: user.name, age: user.age, gender: user.gender, records: user.records} });

  delete user._id;
  res.status(200).json(user);
});



/* Catch-all route to return a JSON error if endpoint not defined.
   Be sure to put all of your endpoints above this one, or they will not be called. */
api.all("/*", (req, res) => {
  res.status(404).json({ error: `Endpoint not found: ${req.method} ${req.url}` });
});

export default initApi;
