import { useState, useEffect, useRef } from "react"
import { Blogs } from "./components/Blogs"
import { AddBlog } from "./components/AddBlog"
import { FlashMessage } from "./components/FlashMessage"
import { LoginForm } from "./components/LoginForm"
import axios from "axios"
import loginService from "./services/loginService"
import noteService from "./services/noteService"
import Togglable from "./components/Togglable"

const App = () => {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [flashedMessage, setFlashedMessage] = useState("")

  const [updateBlogs, setUpdateBlogs] = useState(0)

  const [loginVisible, setLoginVisible] = useState(false)

  const blogFormRef = useRef()

  //if user is already logged in when the app is loaded
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser")
    setUser(null)
  }

  const handleAddBlog = async (event) => {
    event.preventDefault()
    blogFormRef.current.toggleVisibility()

    const title = event.target.title.value
    const author = event.target.author.value
    const url = event.target.url.value
    const likes = 0
    try {
      const response = await noteService.create({ title, author, url, likes })
      if (response && response.status === 201) {
        setUpdateBlogs((updateBlogs) => updateBlogs + 1)
        setFlashedMessage({ body: "Blog added", type: "success" })
      } else {
        setFlashedMessage({ body: "Failed to add blog", type: "error" })
      }
    } catch (exception) {
      setFlashedMessage({ body: "Failed to add blog", type: "error" })
    }
  }

  return (
    <>
      <h1 className="text-xl p-2">Blog App</h1>
      <div className="m-10">
        {flashedMessage && (
          <FlashMessage
            message={flashedMessage}
            setFlashedMessage={setFlashedMessage}
          />
        )}
        {!user ? (
          <LoginForm
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            setUser={setUser}
            setFlashedMessage={setFlashedMessage}
          />
        ) : (
          <div>
            <div className="flex mb-5">
              <p className="p-2">
                loged as{" "}
                <span className="rounded-md border px-1">{user.username}</span>
              </p>
              <button
                className="bg-gray-900 text-white p-2 rounded-md"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
            <Togglable buttonLabel="Add blog" ref={blogFormRef}>
              <AddBlog
                handleAddBlog={handleAddBlog}
                blogFormRef={blogFormRef}
              />
            </Togglable>
          </div>
        )}
        <Blogs updateBlogs={updateBlogs} user={user} />
      </div>
    </>
  )
}

export default App
