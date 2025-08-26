var express = require('express');
var router = express.Router();
const User = require("../models/User")
const { z } = require("zod")


const UserInput = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(254),
})
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post("/", async (req, res) => {
  try {
    const { name, email } = UserInput.parse(req.body)

    // Upsert: create if new, update name if email exists
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { name } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    return res.status(201).json({ ok: true, user })
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ ok: false, error: "Invalid input", details: err.issues })
    }
    if (err.code === 11000) {
      // unique index conflict (rare with upsert but possible under race)
      return res.status(409).json({ ok: false, error: "Email already exists" })
    }
    console.error(err)
    return res.status(500).json({ ok: false, error: "Server error" })
  }
})

// List recent users (paginate in real apps)
router.get("/", async (req, res) => {
  const { limit = 100 } = req.query
  const users = await User.find({}, { name: 1, email: 1, createdAt: 1 })
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(limit) || 100, 500))
  res.json({ ok: true, users })
})


module.exports = router;
