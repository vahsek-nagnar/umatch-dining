const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PouchDB = require('pouchdb');

const app = express();
const port = process.env.PORT || 3000;

// cors
app.use(cors());
app.use(bodyParser.json());

// Initialize PouchDB instances for food and user databases
const food_db = new PouchDB('food_db');
const user_db = new PouchDB('user_db');

// Routes for food_db
// Get all foods
app.get('/api/foods', async (req, res) => {
  try {
    const allFoods = await food_db.allDocs({ include_docs: true });
    res.json(allFoods.rows.map(row => row.doc));
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({ error: 'Failed to fetch foods' });
  }
});

// Get a specific food by id
app.get('/api/foods/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const food = await food_db.get(id);
    res.json(food);
  } catch (error) {
    console.error(`Error fetching food ${id}:`, error);
    res.status(500).json({ error: `Failed to fetch food ${id}` });
  }
});

// Create a new food
app.post('/api/foods', async (req, res) => {
  const newFood = req.body;
  try {
    const response = await food_db.post(newFood);
    res.json(response);
  } catch (error) {
    console.error('Error creating food:', error);
    res.status(500).json({ error: 'Failed to create food' });
  }
});

// Update a food by id
app.put('/api/foods/:id', async (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  try {
    const food = await food_db.get(id);
    Object.assign(food, newData);
    const response = await food_db.put(food);
    res.json(response);
  } catch (error) {
    console.error(`Error updating food ${id}:`, error);
    res.status(500).json({ error: `Failed to update food ${id}` });
  }
});

// Delete a food by id
app.delete('/api/foods/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const food = await food_db.get(id);
    const response = await food_db.remove(food);
    res.json(response);
  } catch (error) {
    console.error(`Error deleting food ${id}:`, error);
    res.status(500).json({ error: `Failed to delete food ${id}` });
  }
});

// Routes for user_db
// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await user_db.allDocs({ include_docs: true });
    res.json(allUsers.rows.map(row => row.doc));
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get a specific user by id
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await user_db.get(id);
    res.json(user);
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    res.status(500).json({ error: `Failed to fetch user ${id}` });
  }
});

// Create a new user
app.post('/api/users', async (req, res) => {
  const newUser = req.body;
  try {
    const response = await user_db.post(newUser);
    res.json(response);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update a user by id
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  try {
    const user = await user_db.get(id);
    Object.assign(user, newData);
    const response = await user_db.put(user);
    res.json(response);
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    res.status(500).json({ error: `Failed to update user ${id}` });
  }
});

// Delete a user by id
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await user_db.get(id);
    const response = await user_db.remove(user);
    res.json(response);
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    res.status(500).json({ error: `Failed to delete user ${id}` });
  }
});

// Route to initialize food database with initial data
app.post('/api/foods/init', async (req, res) => {
    const initialData = req.body;
    try {
      const results = await Promise.all(
        initialData.map(async item => await food_db.post(item))
      );
      res.json(results);
    } catch (error) {
      console.error('Error initializing food database:', error);
      res.status(500).json({ error: 'Failed to initialize food database' });
    }
  });

// PUT update user's reviews
app.put('/api/users/:username/reviews', async (req, res) => {
    const { username } = req.params;
    const { foodItem, text, rating } = req.body;
    try {
        const user = await user_db.get(username);
        if (!user.reviews) {
            user.reviews = [];
        }
        user.reviews.push({ foodItem, text, rating });
        await user_db.put(user);
        res.json(user);
    } catch (error) {
        console.error('Error updating user reviews:', error);
        res.status(500).json({ error: 'Failed to update user reviews' });
    }
});


// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
