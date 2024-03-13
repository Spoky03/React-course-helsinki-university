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

const DeleteButton = ({person}) => {

  const handleDelete = (id) => {
    window.confirm(`Delete ${person.name}?`) && deletePerson(id)
    
  }
  
  return (
    <button onClick={() => handleDelete(person.id)}>delete</button>
  )
}
const Persons = ({personsToShow, persons}) => {
  return (
    <>
      <h2>Numbers</h2>  
      <ul>
        {
          personsToShow.map(person =>
             <li key={person.name}>{person.name}:{person.number}
              <DeleteButton person={person}/>
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

  const handleForm = (event) => {
    event.preventDefault()
    console.log('form submitted', event.target)
    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
  
    const personObject = { name: newName, number: newNumber }
    createPerson(personObject)
      .then(response => {
        setPersons(persons.concat(response))
        setPersonsToShow(persons.concat(response))
        setNewName('')
        setNewNumber('')
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
        
      <Filter handleFilterChange={handleFilterChange} filter={filter} />

      <PersonForm handleForm={handleForm} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />

      <Persons   personsToShow={personsToShow} persons={persons}  />
    </div>
  )
}



  export default App