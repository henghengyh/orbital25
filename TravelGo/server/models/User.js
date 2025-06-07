const mongoose = require("mongoose");
/** EXPLANATION
 * bcrypt is essentially a helper library designed to securely
 * handle password hashing and verification.
 * It simplifies the process of generating strong,
 * salted hashes for passwords and ensures that the
 * hashing is done safely and efficiently. */
const bcrypt = require("bcryptjs");

/** ActivitySchema
 * @param {String} name - username
 * @param {String} email - email, which must only have 1 in DB
 * @param {String} password - password, which must be hashed
 */
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // SECURITY! To remove the password field from the response
    toJSON: {
        transform: function(_, ret) {
            delete ret.password;
            return ret;
        }
    }
});

// INBUILT FUNCTION ... Hash the password before saving the user
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    // a salt is a random string of characters that is
    // added to a password before it is hashed
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
    next();
});

/** INSTANCE METHODS */

UserSchema.methods.comparePassword = function(newPass) {
    return bcrypt.compare(newPass, this.password);
};

/** STATIC METHODS */

UserSchema.statics.listAllUsers = function() {
    return this.find({});
};

UserSchema.statics.findByEmail = function(email) {
    return this.findOne({ email });
};

module.exports = mongoose.model("User", UserSchema);
