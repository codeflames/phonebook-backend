require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


const app = express()
const Person = require('./models/persons')



morgan.token('body', function (req) { return JSON.stringify(req.body) })
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))




// let entries = [
//   {
//     "id": 1,
//     "name": "Arto Hellas",
//     "number": "040-123456"
//   },
//   {
//     "id": 2,
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523"
//   },
//   {
//     "id": 3,
//     "name": "Dan Abramov",
//     "number": "12-43-234345"
//   },
//   {
//     "id": 4,
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122"
//   }
// ];

// Info about the phonebook entries
app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>`
    )
  })
}
)

// Get all entries
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// Get a single entry
app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(person => {

    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => {
      next(error)
    })
})


// Delete a single entry
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndRemove(id).then(() => {

    response.status(204).end()
  })
    .catch(error => next(error))
})

// Generate a random id using Math.random
// const generateId = () => {
//   const randomId = Math.floor(Math.random() * 1000000)
//   return randomId

// }

// Add a new entry
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }
  //  else if (entries.find(entry => entry.name === body.name)) {
  //   return response.status(400).json({
  //     error: 'name already exist in the server: name must be unique'
  //   });
  // }
  const entry = new Person({
    name: body.name,
    number: body.number
  })

  entry.save(entry).then(savedEntry => {
    response.json(savedEntry)
  }).catch(error => next(error))


  morgan.token('body', function (req) { return JSON.stringify(req.body) })
})

// Update an entry
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const id = request.params.id
  const entry = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(id, entry, { new: true })
    .then(updatedEntry => {
      response.json(updatedEntry)
    })
    .catch(error => next(error))
})


// unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

//error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)






const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
