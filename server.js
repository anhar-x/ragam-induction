const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

//Middleware
app.use(express.json());

//Connect to database
connectDB();

//Routes
app.use('/api/books', require('./routes/bookRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).json({ message: err.message });
});

//Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
