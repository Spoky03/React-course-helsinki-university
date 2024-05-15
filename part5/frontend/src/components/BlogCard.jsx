import React, { useState, useEffect } from "react";
import noteService from "../services/noteService";
import Togglable from "./Togglable";
export const BlogCard = ({ user, blog, blogRef, handleDelete }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  useEffect(() => {
    if (user) {
      if (blog.likedBy && blog.likedBy.includes(user.id)) {
        setIsLiked(true);
      }
    }
  }, [user, blog]);

  const handleLike = async () => {
    console.log(user);
    if (isLiked) {
      const updatedBlog = await noteService.likeBlog(blog._id, -1);
      console.log(updatedBlog);
      setIsLiked(false);
      setLikes((prev) => prev - 1);
    } else {
      const updatedBlog = await noteService.likeBlog(blog._id, 1);
      console.log(updatedBlog);
      setIsLiked(true);
      setLikes((prev) => prev + 1);
    }
  };

  return (
    <div className="blogCard">
      <h3 className="font-bold">{blog.title}</h3>
      <Togglable buttonLabel="View" ref={blogRef}>
        <>
          <span>{blog.author}</span>
          <div className="mt-3">{blog.url}</div>
          <button
            className={
              `float-right ` +
              (isLiked ? "border-green-500 border-2 rounded-full " : "")
            }
            onClick={handleLike}
          > 
            { user &&
            <div data-testid="likeButton" className="rounded-full bg-gray-950 p-1 w-8 text-center">
              {likes}
            </div>
            }
          </button>
        </>
      </Togglable>
      <div>
        {user && ( blog.user && (blog.user.username === user.username) ) &&  (
            <button data-testid="deleteButton"
            className="absolute top-0 right-0 m-1 w-4 rounded-full h-4 bg-red-700 "
            onClick={() => handleDelete(blog._id)}
            >
            </button>
        )}
      </div>
    </div>
  );
};
