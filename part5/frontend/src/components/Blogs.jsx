import React, { useEffect, useState, useRef } from "react"
import noteService from "../services/noteService"
import { BlogCard } from "./BlogCard"


export const Blogs = ({ updateBlogs, user }) => {
  const [blogs, setBlogs] = useState([])

  const blogRef = useRef()

  useEffect(() => {
    noteService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
  }, [updateBlogs])

  const handleDelete = async (id) => {
    const response = await noteService.deleteBlog(id);
    setBlogs(blogs.filter((blog) => blog._id !== id));
  };

  return (
    <div>
      <h2 className="pb-5 mt-5">Blogs</h2>
      <ul className="flex flex-col gap-5">
        {blogs.map((blog, index) => (
          <li
            key={index}
            className="bg-gray-900 p-3 rounded-md max-w-48 relative"
          >
            <BlogCard
              user={user}
              blog={blog}
              blogRef={blogRef}
              setBlogs={setBlogs}
              blogs={blogs}
              handleDelete={handleDelete}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
