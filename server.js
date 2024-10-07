import express from "express";
import cors from "cors"
import { initializeDBAndStartServer } from "./services/db/ConnectionToDB.js";
import { loginUserHandler, newRegistrationHandler } from "./routes/users.js";
import { authenticateUser } from "./middlewares/auth.js";
import bodyParser from "body-parser";
import {
  getAllPlacesHander,
  getSinglePlaceHandler,
  postDraftPlaceHandler,
  setDraftplaceHandler,
  setPostPlaceHandler,
} from "./routes/places.js";
import { placeIdSchema, placeSchema } from "./schema/places.schema.js";

export const app = express();

app.use(express.json());
app.use(cors())
app.use(bodyParser.json());

// connect to db
initializeDBAndStartServer();

// testing file
app.get("/", async (req, res) => {
  res.send("Hello word");
});

//register a user
app.post("/user/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  await newRegistrationHandler(fullName, email, password, res);
});

app.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  await loginUserHandler(email, password, res);
});

app.post("/place/new", authenticateUser, async (req, res) => {
  const { email } = req;

  await postDraftPlaceHandler(email, res);
});


// Drafting
app.put("/draft/place/:placeId", authenticateUser, async (req, res) => {
  const { email } = req;

  const { placeId } = req.params;
  // checking validaiton of inputs

  // TO-DO: Implement carousal images
  placeIdSchema.parse(placeId);
  const validation = placeSchema.safeParse(req.body);

  // TO-DO: Maintain proper error handling
  if (!validation.success) {
    return res.status(400).json(validation.error);
  }

  const {
    placeName,
    address,
    locationLink,
    imageUrl,
    description,
    carouselImages,
  } = req.body;

  await setDraftplaceHandler(
    email,
    res,
    placeId,
    placeName,
    address,
    locationLink,
    imageUrl,
    description,
    carouselImages
  );
});

// TO-DO: If any error try change method to POST
app.put("/post/place/:placeId", authenticateUser, async (req, res) => {
  const { email } = req;

  const { placeId } = req.params;
  placeIdSchema.parse(placeId);

  await setPostPlaceHandler(res, placeId, email);
});


app.get("/browse/places", authenticateUser, async (req, res) => {
  await getAllPlacesHander(res);
})

app.get("/place/:placeId", authenticateUser, async (req, res) => {
  const {placeId} = req.params
  await getSinglePlaceHandler(res, placeId )
})