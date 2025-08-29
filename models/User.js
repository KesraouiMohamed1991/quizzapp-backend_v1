// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    image: { type: String, default: "" },
    providers: [
        {
            provider: { type: String, required: true }, // "google", "github", etc.
            providerId: { type: String, required: true }, // ID unique chez le provider
            _id: false, // Désactive l'ID auto-généré pour les sous-documents
        }
    ],
    lastLogin: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});

// Index pour optimiser les recherches
userSchema.index({ email: 1 });
userSchema.index({ "providers.provider": 1, "providers.providerId": 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
