const express = require("express");
const connectDB = require("./config/db");

const app = express();

// json parser middleware
app.use(express.json({ extended:  false }));


//Connect db
connectDB();

// Defining endpoints
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

app.get("/", (req, res) => res.json({ msg: "App is on" }));

const PORT = process.env.PORT || "5000";

app.listen(PORT, () => console.log(`server running on port : ${PORT}`));
