const mongoose = require("mongoose");
/** EXPLANATION
 * bcrypt is essentially a helper library designed to securely
 * handle password hashing and verification.
 * It simplifies the process of generating strong,
 * salted hashes for passwords and ensures that the
 * hashing is done safely and efficiently. */
const bcrypt = require("bcryptjs");

// User Schema
/** EXPLANATION
 * A schema is like a blueprint (ABSTRACTION) for our data.
 * It defines what fields our data will have and their types.
 * For example, a user will have a name, email, password and role.
 * The user will be assigned a role of either 'admin' or 'user'.
 * The 'required' field means that this information must
 * be provided when creating a new user.
 */
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Hash the password before saving the user
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    // a salt is a random string of characters that is
    // added to a password before it is hashed
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model("User", UserSchema);
