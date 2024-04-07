import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'https://easy-blue-miniskirt.cyclic.app' }));

const mongoURI = 'mongodb+srv://tush0417:NxPyqwgYB0hWPQ5b@cluster5.th0k6rq.mongodb.net/';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bdate: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

app.post("/login", async (req, res) => { 
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ message: "User Not Found" });
    }
    if (password === user.password) {
      res.send({ message: "Login Successful", user: user });
    } else {
      res.status(401).send({ message: "Invalid Password" });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.post("/register", async (req, res) => { 
  const { name, bdate, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send({ message: "User Already Registered" });
    }
    const newUser = new User({
      name,
      bdate,
      email,
      password
    });
    await newUser.save();
    res.status(201).send({ message: "Successfully Registered" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.listen(3000, () => { 
  console.log("Application started at port 3000");
});
