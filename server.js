const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const propertyRoutes = require("./routes/properties");
const userRoutes = require("./routes/users");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/users", userRoutes);

// 404 page
app.use((req, res, next) => {
	res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// Connect to MongoDB
mongoose.connect("mongodb+srv://harrysaif675:sellerbuyer@clustersellerbuyer.8nj7us7.mongodb.net/ClusterSellerBuyer?retryWrites=true&w=majority")
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.log(err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
