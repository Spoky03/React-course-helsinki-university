const Courses = ({courses}) => {
    return (
      <div>
        {courses.map((course, index) => {
  
          return <Course key={index} course={course}/>
        }
        )}
      </div>
    )
  
  
  
  
  }
  const Course = (props) => {
    return (
      <div>
        <Header course={props.course.name} />
        <Content parts={props.course.parts} />
        <Sum parts={props.course.parts}/>
      </div>
    )
  }
  const Sum = ({parts}) => {
    const initialValue = 0
    const total = parts.reduce((sum, part) => {
      return sum + part.exercises
    }, initialValue
    )
  
    return (
      <h3>total number of {total} exercises</h3>
    )
  }
  
  const Header = ({course}) => {
    return (
      <h1>{course}</h1>
    )
  }
  
  
  const Part = ({part,exercises}) => {
    return (
      <>
        <p>{part} {exercises}</p>
      </>
    )
  }
  const Content = (props) =>{
    return (
      <div>
        {props.parts.map((part, index) => {
          return <Part key={index} part={part.name} exercises={part.exercises}/>
        }
        )}
      </div>
    )
  }
  

export default Courses