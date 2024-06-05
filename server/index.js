const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const url = "mongodb://0.0.0.0:27017/expense-tracker"; // Update with your MongoDB connection string

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected successfully to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

const Transaction = require("./models/model.js");

app.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const addTransaction = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    const transactions = await Transaction.find();
    res.status(201).json({ message: "Transaction created successfully", transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

app.delete("/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    const transactions = await Transaction.find();
    res.status(200).json({ message: "Transaction deleted successfully", transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/transactions", addTransaction);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
