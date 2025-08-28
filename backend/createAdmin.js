// createAdmin.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => {
    console.error("Failed to connect:", err);
    process.exit(1);
});

// Load Admin model
const Admin = require("./models/adminSchema"); // adjust path if needed

// Admin details
const adminData = {
    name: "Super Admin",
    email: "admin@example.com",
    password: "admin123", // plain password
    schoolName: "My School"
};

// Hash password and create admin
bcrypt.hash(adminData.password, 10)
    .then(hashedPassword => {
        adminData.password = hashedPassword;
        return Admin.create(adminData);
    })
    .then(admin => {
        console.log("Admin created successfully:");
        console.log(admin);
        process.exit(0);
    })
    .catch(err => {
        console.error("Error creating admin:", err);
        process.exit(1);
    });
