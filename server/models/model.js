const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  createdDate: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  debit: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
