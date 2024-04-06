import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors());


const mongoURI = 'mongodb+srv://root:root123@cluster1.3b90av8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

const userSchema = new mongoose.Schema({
  name: String,
  bdate: String, 
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

app.post("/login", async (req, res) => { 
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Successful", user: user });
      } else {
        res.send({ message: "Invalid Password" });
      }
    } else {
      res.send({ message: "User Not Found" });
    }
  } catch (err) {
    res.send({ message: "Internal Server Error" });
  }
});

app.post("/register", async (req, res) => { 
  const { name, bdate, email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      res.send({ message: "User Already Registered" });
    } else {
      const newUser = new User({
        name,
        bdate,
        email,
        password
      });
      await newUser.save();
      res.send({ message: "Successfully Registered" });
    }
  } catch (err) {
    res.send({ message: "Internal Server Error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.send({ message: "Internal Server Error" });
  }
});

app.listen(3000, () => { 
  console.log("Application started at port 3000");
});
