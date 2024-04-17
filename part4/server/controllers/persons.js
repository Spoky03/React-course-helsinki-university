const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/info', async (request, response) => {
    const date = new Date()
  
    const persons = await Person.find({})
  
    response.send(
      `<h3>Phone book has info for ${persons.length} people</h3>
      <br/>
      <p>${date}</p>
      `
    )
  })
  
personsRouter.get('/', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
        .catch(error => next(error))
    })
  
personsRouter.get('/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
        })
        .catch(error => next(error))
    })
  
  // app.delete('/api/persons/:id', (request, response) => {
  //   const id = Number(request.params.id)
  //   persons = persons.filter(note => note.id !== id)
  
  //   response.status(204).end()
  // })
  
  personsRouter.post('/', (request, response, next) => {
    const id = Math.floor(Math.random() * 10000)
    const body = request.body
    
    if (!body.name || !body.number || body.name === undefined) {
      return response.status(400).json({ error: 'name or number missing' })
    }
    const person = new Person({
      name: body.name,
      number: body.number,
      id: id
    })
    person.save()
      .then(savedPerson => {
        response.json(savedPerson)
      })
      .catch(error => next(error))
  }
  )
  
  personsRouter.put('/:id', (request, response, next) => {
    const {name,number} = request.body
  
    Person.findByIdAndUpdate(request.params.id, {name,number}, { new: true, runValidators: true, context: 'query'})
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })
  
  personsRouter.delete('/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id).then(note => {
      response.json(note)
    }
    )
      .catch(error => {
        console.log(error)
        response.status(404).end()
      })
  })
  
module.exports = personsRouter