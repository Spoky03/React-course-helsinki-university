const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}


const Part = (props) => {
  return (
    <p>
      {props.part} {props.ex}
    </p>
  )
}
const Content = (props) =>{
  return (
    <div>
      {props.parts.map((part, index) => {
        return <Part key={index} part={part.name} ex={part.exercises}/>
      }
      )}
    </div>
  )
}
const Total = (props) => {
  let sum = 0;
  props.total.forEach(element => {
    sum += element.exercises
  })
  return (
    <h1>Total: {sum}</h1>
  )
}


const App = () => {

  const course ={

    name: 'Half Stack application development',
  
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }



  return (
    <>
      <div>
        <Header course={course} />
        <Content parts={parts}/>
        <Total total={parts}/>
      </div>
    </>
  )
}

export default App