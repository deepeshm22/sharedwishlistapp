const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { db } = require("./firebase");
const wishlistRouter = require("./routes/wishlist");
const productRouter = require("./routes/product");

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// TODO: Add Firebase and API routes here
app.use("/api/wishlist", wishlistRouter);
app.use("/api/product", productRouter);

// --- Product seeding logic ---
async function seedProductsIfNeeded() {
  const productsRef = db.collection("products");
  const snapshot = await productsRef.get();
  if (snapshot.empty) {
    const products = [
      {
        name: "Apple iPhone 15",
        imageUrl: "https://via.placeholder.com/150",
        price: 999,
      },
      {
        name: "Samsung Galaxy S23",
        imageUrl: "https://via.placeholder.com/150",
        price: 899,
      },
      {
        name: "Sony WH-1000XM5 Headphones",
        imageUrl: "https://via.placeholder.com/150",
        price: 349,
      },
      {
        name: 'Apple MacBook Pro 14"',
        imageUrl: "https://via.placeholder.com/150",
        price: 1999,
      },
      {
        name: "Dell XPS 13 Laptop",
        imageUrl: "https://via.placeholder.com/150",
        price: 1299,
      },
      {
        name: "Nintendo Switch OLED",
        imageUrl: "https://via.placeholder.com/150",
        price: 349,
      },
      {
        name: "Canon EOS R10 Camera",
        imageUrl: "https://via.placeholder.com/150",
        price: 979,
      },
      {
        name: "Fitbit Charge 6",
        imageUrl: "https://via.placeholder.com/150",
        price: 159,
      },
      {
        name: "GoPro HERO12 Black",
        imageUrl: "https://via.placeholder.com/150",
        price: 399,
      },
      {
        name: "Apple iPad Air",
        imageUrl: "https://via.placeholder.com/150",
        price: 599,
      },
      {
        name: "Bose SoundLink Flex",
        imageUrl: "https://via.placeholder.com/150",
        price: 149,
      },
      {
        name: "Kindle Paperwhite",
        imageUrl: "https://via.placeholder.com/150",
        price: 139,
      },
      {
        name: "Logitech MX Master 3S Mouse",
        imageUrl: "https://via.placeholder.com/150",
        price: 99,
      },
      {
        name: "Anker PowerCore 20000",
        imageUrl: "https://via.placeholder.com/150",
        price: 49,
      },
      {
        name: "JBL Flip 6 Speaker",
        imageUrl: "https://via.placeholder.com/150",
        price: 129,
      },
    ];
    for (const product of products) {
      await productsRef.add(product);
    }
    console.log("Seeded products collection with demo products.");
  }
}

// --- Products API endpoint ---
app.get("/api/products", async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await seedProductsIfNeeded();
  console.log(`Server running on port ${PORT}`);
});
