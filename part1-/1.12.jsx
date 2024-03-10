import { useState } from 'react'

const Button = ({ handleClick, text }) => {

  
  return (<button onClick={handleClick}>
    {text}
  </button>)
}


const StatisticsLine = ({text, value}) => {
  return (
    <p>{text} {value}</p>
  )
}
const Statistics = ({good, neutral, bad}) => {
  let total = good+neutral+bad
  if (total === 0) {
    return (
      <p>no feedback given</p>
    )
  }
  return (
    <>
    <StatisticsLine text="average" value={(good-bad)/total}/>
    <StatisticsLine text="positive" value={(good/total)*100 + "%"}/>
    </>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  if (good+neutral+bad === 0) {
    return (
      <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <h2>statistics</h2>
      <p>no feedback given</p>
      </div>
    )
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <h2>statistics</h2>
      <tr>
      <StatisticsLine text="good" value={good}/>
      <StatisticsLine text="neutral" value={neutral}/>
      <StatisticsLine text="bad" value={bad}/>
      <StatisticsLine text="all" value={good+neutral+bad}/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
      </tr>
    </div>
  )
}

export default App