const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000; // Change as needed

// Connect to MongoDB
mongoose.connect('mongodb://localhost/social_network', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Mongoose Schemas
const userSchema = new mongoose.Schema({
  username: String,
  thoughts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thought' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const thoughtSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
  reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reaction' }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const reactionSchema = new mongoose.Schema({
  emoji: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  thought: { type: mongoose.Schema.Types.ObjectId, ref: 'Thought' },
});

// Define Mongoose Models
const User = mongoose.model('User', userSchema);
const Thought = mongoose.model('Thought', thoughtSchema);
const Reaction = mongoose.model('Reaction', reactionSchema);

// Middleware to parse JSON
app.use(express.json());

// Routes
app.post('/users', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await Thought.create(req.body);
    res.status(201).json(newThought);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/reactions', async (req, res) => {
  try {
    const newReaction = await Reaction.create(req.body);
    res.status(201).json(newReaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/users/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friend = await User.findById(req.params.friendId);

    if (!user || !friend) {
      res.status(404).json({ error: 'User or friend not found' });
      return;
    }

    user.friends.push(friend._id);
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
