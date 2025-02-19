const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.static('public'));

// Connect to MongoDB Atlas (free tier)
mongoose.connect(process.env.MONGODB_URI);
const counterSchema = new mongoose.Schema({ count: Number });
const Counter = mongoose.model('Counter', counterSchema);

// Initialize counter
async function initializeCounter() {
  const existing = await Counter.findOne();
  if (!existing) await Counter.create({ count: 0 });
}
initializeCounter();

// Visitor endpoint
app.get('/visit', async (req, res) => {
  const counter = await Counter.findOneAndUpdate(
    {},
    { $inc: { count: 1 } },
    { new: true, upsert: true }
  );

  // Send to Telegram
  const message = `🚀 New visitor! Total: ${counter.count}`;
  await axios.post(
    `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
    {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message
    }
  );

  res.json({ count: counter.count });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
