import { useState } from "react"
import noteService from "../services/noteService"

export const AddBlog = ({ handleAddBlog }) => {

  return (
    <div>
      <form
        data-testid="addBlogForm"
        className="max-w-36 justify-center flex flex-col"
        onSubmit={handleAddBlog}
      >
        <h2 className="font-bold">Add new blog</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="title">Title</label>
          <input
            data-testid="title"
            className="text-gray-950"
            type="text"
            id="title"
            name="title"
          />
          <label htmlFor="author">Author</label>
          <input
            data-testid="author"
            className="text-gray-950"
            type="text"
            id="author"
            name="author"
          />
          <label htmlFor="url">Url</label>
          <input 
            data-testid="url" 
            className="text-gray-950" 
            type="text" id="url" name="url" />
          <button
            className="bg-gray-900 text-white p-2 rounded-md"
            type="submit"
          >
            Add blog
          </button>
        </div>
      </form>
    </div>
  )
}
