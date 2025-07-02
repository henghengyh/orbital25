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
    accountCreatedOn: { type: Date, default: Date.now },
    emailVerificationCode: { type: String },
    pendingEmail: { type: String },
    profilePhoto: { type: String },
    profilePhotoPublicId: { type: String },
    profileInfo: {
        bio: { type: String, default: "" },
        favouriteDestination: { type: String, default: "" },
        gender: { type: String, default: "" },
        dateOfBirth: { type: Date, default: null },
        location: { type: String, default: "" },
    },
    friendsWith: {type: [String], default: []},
    emailSignUp: { type: Boolean, default: true },
}, {
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

/** STATIC METHODS */

UserSchema.statics.listAllUsers = function() {
    return this.find({});
};

UserSchema.statics.findByEmail = function(email) {
    if (typeof email === "object" && email.email) {
        return this.findOne({ email: email.email });
    }
    return this.findOne({ email });
};

UserSchema.statics.findById = function(id) {
    if (typeof id === "object" && id._id) {
        return this.findOne({ _id: id._id });
    }
    return this.findOne({ _id: id });
};

module.exports = mongoose.model("User", UserSchema);
