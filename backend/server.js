import express from 'express';
import bodyParser from 'body-parser';
import PouchDB from 'pouchdb';
import pouchdbFind from 'pouchdb-find';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Connect to PouchDB databases
PouchDB.plugin(pouchdbFind);
const usersDB = new PouchDB('http://localhost:5984/users');
const foodsDB = new PouchDB('http://localhost:5984/foods');

// Routes for Users
app.get('/api/users', async (req, res) => {
    try {
        const result = await usersDB.allDocs({ include_docs: true });
        res.json(result.rows.map(row => row.doc));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const { body } = req;
        const response = await usersDB.post(body);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await usersDB.get(id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const user = await usersDB.get(id);
        const updatedUser = await usersDB.put({
            _id: id,
            _rev: user._rev,
            ...body
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await usersDB.get(id);
        const response = await usersDB.remove(user);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Routes for Foods
app.get('/api/foods', async (req, res) => {
    try {
        const result = await foodsDB.allDocs({ include_docs: true });
        res.json(result.rows.map(row => row.doc));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/foods', async (req, res) => {
    try {
        const { body } = req;
        const response = await foodsDB.post(body);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/foods/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const food = await foodsDB.get(id);
        res.json(food);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/foods/:id', async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const food = await foodsDB.get(id);
        const updatedFood = await foodsDB.put({
            _id: id,
            _rev: food._rev,
            ...body
        });
        res.json(updatedFood);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/foods/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const food = await foodsDB.get(id);
        const response = await foodsDB.remove(food);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
