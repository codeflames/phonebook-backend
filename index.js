const express = require('express');
const morgan = require('morgan');
const cors = require('cors');


const app = express();


morgan.token('body', function (req, res) { return JSON.stringify(req.body); });
app.use(cors());
app.use(express.json());
app.use(express.static('build'));
app.use(morgan('tiny'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));




let entries = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

// Info about the phonebook entries
app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${entries.length} people</p>
    <p>${new Date()}</p>`
    );
}
);

// Get all entries
app.get('/api/persons', (request, response) => {
  response.json(entries);
});

// Get a single entry
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const entry = entries.find(entry => entry.id === id);
  if (entry) {
    response.json(entry);
  } else {
    response.status(404).end();
  }
});

// Delete a single entry
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  entries = entries.filter(entry => entry.id !== id);
  response.status(204).end();
});

// Generate a random id using Math.random
const generateId = () => {
  const randomId = Math.floor(Math.random() * 1000000);
  return randomId;

};

// Add a new entry
app.post('/api/persons', (request, response) => {
  const body = request.body;
 
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    });
  } else if (entries.find(entry => entry.name === body.name)) {
    return response.status(400).json({
      error: 'name already exist in the server: name must be unique'
    });
  }
  const entry = {
    id: generateId(),
    name: body.name,
    number: body.number
  };
  entries = entries.concat(entry);
  response.json(entry);

  morgan.token('body', function (req, res) { return JSON.stringify(req.body); });
});




const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
