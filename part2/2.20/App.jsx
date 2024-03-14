import { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY
// variable api_key now has the value set in startup

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/'

const weatherUrl = ({lat,lon}) => {
  const part = 'minutely,hourly'
  return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
}

const getWeather = ({lat, lon}) => {
  const request = axios.get(weatherUrl({lat, lon}))
  return request.then(response => response.data)
}

const getCountries = ({country}) => {
  const request = axios.get(`${baseUrl}${country}`)
  return request.then(response => response.data)
}

const Search = ({search, handleSearch}) => {
  return (
    <div>
      find countries <input value={search} onChange={handleSearch} />
    </div>
  )
}

const ShowButton = ({country, setCountriesToShow}) => {

  const handleClick = () => {
    console.log('show', country.name.common)
    setCountriesToShow([country])
  }
  return (
    <button onClick={handleClick}>show</button>
  )
}

const CountryName = ({country, setCountriesToShow}) => {
  return (
    <>
      <div>{country.name.common}</div> <ShowButton country={country} setCountriesToShow={setCountriesToShow} />
    </>
  )
}

const CountryInfo = ({country, weather}) => {

  console.log(Object.values(country))

  
  return (
    <div>
      <h2>{country.name.common}  <img src={country.flags.svg} alt='flag' width='60px' /></h2>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h3>languages</h3>
      <ul>
        {Object.values(country.languages).map(lg => <li key={lg}>{lg}</li>)}
      </ul>
      <h3>currencies</h3>
      <ul>
        {Object.values(country.currencies).map(c => <li key={c.name}>{c.name} ({c.symbol})</li>)}
      </ul>
      <div>
        <h3>Weather in {country.capital}</h3>
        <div>weather: {weather.weather[0].main},{weather.weather[0].description}</div>
        <div>temperature: {(weather.main.temp-273).toFixed(2)} °C</div>
        <div>wind: {weather.wind.speed} m/s</div>
      </div>
      
    </div>
  )
}
const App = () => {

  const [countries, setCountries] = useState([])
  const [countriesToShow, setCountriesToShow] = useState([])
  const [country, setCountry] = useState(null)
  const [search, setSearch] = useState('')
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    getCountries({country: 'all'})
      .then(respone => {
        setCountries(respone)
        console.log(respone[0].name.common)
      })
  }, [])

  useEffect(() => {
    //if country is not none
    if (country) {
      console.log('getting weather for', country.capital)
      getWeather({lat: country.capitalInfo.latlng[0], lon: country.capitalInfo.latlng[1]})
        .then(response => {
          console.log(response)
          setWeather(response)
        })
    }
  }
  , [country])

  const handleSearch = (event) => {
    event.preventDefault()
    console.log('filtering', event.target.value)
    setCountriesToShow(countries.filter(c => c.name.common.toLowerCase().includes(event.target.value.toLowerCase())))
    setSearch(event.target.value)
  }

  
  

  useEffect(() => {
    setCountry(countriesToShow[0]);
  }, [countriesToShow]);


  return (
    <div>
      <h1>Countries</h1>
      <Search search={search} handleSearch={handleSearch} />
      <div>
        {countriesToShow.length === 1 ? (
          <CountryInfo country={country}  weather={weather}/>
        ) : countriesToShow.length <= 10 ? (
          countriesToShow.map(country => <CountryName key={country.name.common} country={country} setCountriesToShow={setCountriesToShow}/>)
        ) : (
          <div>Too many matches</div>
        )}
      </div>
    </div>
  )
}



export default App