import { useState, useEffect } from 'react'
import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const createPerson = (personObject) => {
  const request = axios.post(baseUrl, personObject)
  return request.then(response => response.data)
}
const getPersons = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
const deletePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}
const updatePerson = (id, personObject) => {
  const request = axios.put(`${baseUrl}/${id}`, personObject)
  return request.then(response => response.data)
}

const Message = ({message}) => {
  if (message === null) {
    return null
  }
  return (
    <div className="message">
      {message}
    </div>
  )
}

const DeleteButton = ({person, setMessage}) => {

  const handleDelete = (id) => {
    window.confirm(`Delete ${person.name}?`) && deletePerson(id)
    .catch(e => {
      setMessage(`${person.name} has already been deleted`)
      return
    }
    )
    setMessage(`Deleted: ${person.name}`)

    
  }
  
  return (
    <button onClick={() => handleDelete(person.id)}>delete</button>
  )
}
const Persons = ({personsToShow, persons, setMessage}) => {
  return (
    <>
      <h2>Numbers</h2>  
      <ul>
        {
          personsToShow.map(person =>
             <li key={person.name}>{person.name}:{person.number}
              <DeleteButton person={person} setMessage={setMessage}/>
             </li>
             )
        }
      </ul>
    </>
  );
}

const PersonForm = ({handleForm, newName, handleNameChange, newNumber, handleNumberChange}) => {

  return (
    <>
      <h2>add new:</h2>
      <form onSubmit={handleForm}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>

      </form>
    </>
    )
}

const Filter = ({handleFilterChange, filter}) => {
  return (
    <>
      <h2>search</h2>
      <div>
        filter: <input value={filter} onChange={handleFilterChange}/>
      </div>
    </>
  )
}

const App = () => {

  const [persons, setPersons] = useState([])

  useEffect(() => {
    console.log('effect')
    getPersons()
      .then(respone => {
        console.log('promise fulfilled')
        setPersons(respone)
        setPersonsToShow(respone)
      })
  }, [])
  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')

  const [personsToShow, setPersonsToShow] = useState([])

  const [message, setMessage] = useState(null)

  const handleForm = (event) => {
    event.preventDefault()
    console.log('form submitted', event.target)
    if (persons.find(person => person.name === newName)) {
      console.log('person already in phonebook')
      window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`) && 
      updatePerson(persons.find(person => person.name === newName).id, {name: newName, number: newNumber})
      setPersonsToShow(persons.map(person => person.name === newName ? {...person, number: newNumber} : person))
      setMessage(`Updated: ${newName}`)
      return
    }
  
    const personObject = { name: newName, number: newNumber }
    createPerson(personObject)
      .then(response => {
        setPersons(persons.concat(response))
        setPersonsToShow(persons.concat(response))
        setNewName('')
        setNewNumber('')

        setMessage(`Added: ${newName}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)

      })
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const [filter, setFilter] = useState('')

  const handleFilterChange = (event) => {
    event.preventDefault()
    console.log('filtering', event.target.value)
    if (event.target.value === '') {    
      setPersonsToShow(persons)
    } else {
      setPersonsToShow(persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase())))
    }
    console.log(event.target.value)
    setFilter(event.target.value) 
  }


  return (
    <div>
      <h2>Phonebook</h2>

      <Message message={message} />
        
      <Filter handleFilterChange={handleFilterChange} filter={filter} />

      <PersonForm handleForm={handleForm} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />

      <Persons   personsToShow={personsToShow} persons={persons} setMessage={setMessage}  />
    </div>
  )
}



  export default App