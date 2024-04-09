
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


mongoose.connect('mongodb://localhost:27017/tush', {

  family: 4 
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

const User = new mongoose.model("User", userSchema);



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
    res.status(500).send({ message: "Internal Server Error" });
  }
});




app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});



app.listen(9000, () => { 
  console.log("Application started at port 9000");
});