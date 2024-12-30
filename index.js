const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

dotenv.config();

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",  
  methods: "GET,POST",
  allowedHeaders: "Content-Type,Authorization"
};

app.use(cors(corsOptions));

mongoose.connect('mongodb+srv://fhadshnde32:fhad@cluster0.lu7zq.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // مهلة 5 ثوانٍ
}, (err) => {
  if (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  } else {
    console.log("Connected to MongoDB");
  }
});

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
