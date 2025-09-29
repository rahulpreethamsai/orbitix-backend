const mongoose = require("mongoose");
const bcrypt = require('bcryptjs'); // Import bcrypt

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"]
    },
},
{
    // Corrected: 'timestamps' should be lowercase
    timestamps: true,
},
);

// Mongoose middleware to hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to match entered password with the hashed password in the DB
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model("User", userSchema);