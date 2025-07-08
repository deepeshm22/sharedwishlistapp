const express = require("express");
const router = express.Router();
const { db } = require("../firebase");
const authenticateToken = require("../middleware/auth");
const admin = require("firebase-admin");

// Protect all routes
router.use(authenticateToken);

// Create a new wishlist
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const ownerName =
      req.user.name || req.user.displayName || req.user.email || req.user.uid;
    const docRef = await db.collection("wishlists").add({
      name,
      owner: ownerName,
      members: [req.user.uid],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.json({ id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all wishlists for a user
router.get("/", async (req, res) => {
  try {
    const snapshot = await db
      .collection("wishlists")
      .where("members", "array-contains", req.user.uid)
      .get();
    const wishlists = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(wishlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a wishlist
router.put("/:id", async (req, res) => {
  try {
    const { name, members } = req.body;
    const update = { updatedAt: new Date() };
    if (name) update.name = name;
    if (members) update.members = members;
    await db.collection("wishlists").doc(req.params.id).update(update);
    res.json({ message: "Wishlist updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a wishlist
router.delete("/:id", async (req, res) => {
  try {
    await db.collection("wishlists").doc(req.params.id).delete();
    res.json({ message: "Wishlist deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mock invite endpoint
router.post("/:id/invite", async (req, res) => {
  try {
    const { email } = req.body;
    // In a real app, look up user by email. Here, just mock a UID from email.
    const mockUid = `mock_${Buffer.from(email).toString("base64")}`;
    const docRef = db.collection("wishlists").doc(req.params.id);
    // Get current members
    const doc = await docRef.get();
    let members = doc.data().members || [];
    if (!members.includes(mockUid)) {
      members.push(mockUid);
    }
    await docRef.update({
      members,
      updatedAt: new Date(),
    });
    res.json({ message: `Invited ${email} (mock UID: ${mockUid})` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
