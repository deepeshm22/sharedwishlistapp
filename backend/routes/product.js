const express = require("express");
const router = express.Router();
const { db } = require("../firebase");
const authenticateToken = require("../middleware/auth");
const admin = require("firebase-admin");

// Protect all routes
router.use(authenticateToken);

// Add a product to a wishlist
router.post("/", async (req, res) => {
  try {
    const { wishlistId, name, imageUrl, price } = req.body;
    const docRef = await db
      .collection("wishlists")
      .doc(wishlistId)
      .collection("products")
      .add({
        name,
        imageUrl,
        price,
        addedBy: req.user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    res.json({ id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit a product
router.put("/:wishlistId/:productId", async (req, res) => {
  try {
    const { name, imageUrl, price } = req.body;
    const update = { updatedAt: new Date(), editedBy: req.user.uid };
    if (name) update.name = name;
    if (imageUrl) update.imageUrl = imageUrl;
    if (price) update.price = price;
    await db
      .collection("wishlists")
      .doc(req.params.wishlistId)
      .collection("products")
      .doc(req.params.productId)
      .update(update);
    res.json({ message: "Product updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove a product
router.delete("/:wishlistId/:productId", async (req, res) => {
  try {
    await db
      .collection("wishlists")
      .doc(req.params.wishlistId)
      .collection("products")
      .doc(req.params.productId)
      .delete();
    res.json({ message: "Product removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all products for a wishlist
router.get("/:wishlistId", async (req, res) => {
  try {
    const snapshot = await db
      .collection("wishlists")
      .doc(req.params.wishlistId)
      .collection("products")
      .get();
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a comment to a product
router.post("/:wishlistId/:productId/comments", async (req, res) => {
  try {
    const { text } = req.body;
    const comment = {
      text,
      user: req.user.uid,
      createdAt: new Date(),
    };
    const docRef = await db
      .collection("wishlists")
      .doc(req.params.wishlistId)
      .collection("products")
      .doc(req.params.productId)
      .collection("comments")
      .add(comment);
    res.json({ id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all comments for a product
router.get("/:wishlistId/:productId/comments", async (req, res) => {
  try {
    const snapshot = await db
      .collection("wishlists")
      .doc(req.params.wishlistId)
      .collection("products")
      .doc(req.params.productId)
      .collection("comments")
      .get();
    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add an emoji reaction to a product
router.post("/:wishlistId/:productId/reactions", async (req, res) => {
  try {
    const { emoji } = req.body;
    const productRef = db
      .collection("wishlists")
      .doc(req.params.wishlistId)
      .collection("products")
      .doc(req.params.productId);
    const doc = await productRef.get();
    let reactions = doc.data().reactions || {};
    reactions[emoji] = (reactions[emoji] || 0) + 1;
    await productRef.update({ reactions });
    res.json({ message: "Reaction added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove an emoji reaction from a product
router.delete("/:wishlistId/:productId/reactions", async (req, res) => {
  try {
    const { emoji } = req.body;
    const productRef = db
      .collection("wishlists")
      .doc(req.params.wishlistId)
      .collection("products")
      .doc(req.params.productId);
    const doc = await productRef.get();
    let reactions = doc.data().reactions || {};
    reactions[emoji] = Math.max((reactions[emoji] || 1) - 1, 0);
    await productRef.update({ reactions });
    res.json({ message: "Reaction removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
