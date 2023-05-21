const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./db/db.json');

// Generate unique IDs for each note
const { uuid } = require('uuidv4');

// Allow the public folder to be accessed
app.use(express.static('public'));

// Parse incoming JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const newDb = db.filter(note => note.id !== String(noteId));
  fs.writeFile('./db/db.json', JSON.stringify(newDb), err => {
    if (err) return res.status(500).send('An error occurred while deleting the note.');
    res.json(newDb);
  });
});

// HTML Routes
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});


// API Routes
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred while retrieving notes.');
    }
    const dbData = JSON.parse(data);
    console.log('Notes retrieved from db.json:', dbData);
    res.json(dbData);
  });   
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuid();
  db.push(newNote);
  fs.writeFile('./db/db.json', JSON.stringify(db), err => {
    if (err) return res.status(500).send('An error occurred while saving the note.');
    res.json(newNote);
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


// Start the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}.`);
});