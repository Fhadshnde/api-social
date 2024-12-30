import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import multer from "multer";
import userRoute from "./routes/users.js";
import authRoute from "./routes/auth.js";
import postRoute from "./routes/posts.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cors from "cors";

// تحديد __dirname باستخدام import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",  
  methods: "GET,POST",
  allowedHeaders: "Content-Type,Authorization"
};

app.use(cors(corsOptions));

try {
  await mongoose.connect('mongodb+srv://fhadshnde32:fhad123@cluster0.c8ify.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Failed to connect to MongoDB:", error);
  process.exit(1);
}

if (!fs.existsSync(path.join(__dirname, "public/images"))) {
  fs.mkdirSync(path.join(__dirname, "public/images"), { recursive: true });
}

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error uploading file");
  }
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.listen(process.env.PORT || 8800, () => {
  console.log("Backend server is running!");
});
