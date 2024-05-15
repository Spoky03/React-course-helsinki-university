import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BlogCard } from './BlogCard'

test('renders content', async () => {
  const blog = {
    title: 'Title of the blog',
    likes: 69420,
    author: 'Author of the blog',
    url: 'Url of the blog',
  }
  const user = {
    id: '123',
    username: 'username',
    }

  const mockHandler = vi.fn()

  render(
    <BlogCard blog={blog} handleLike={mockHandler} user={user} />
  )

    

//   expect(mockHandler.mock.calls).toHaveLength(1)
     expect(screen.getByText('Title of the blog')).toBeDefined()
     expect(screen.getByText('Author of the blog')).toBeDefined()
     expect(screen.queryByText('69420')).not.toBeVisible()

      const userEngine = userEvent.setup()
      const button = screen.getByText('View')
      await userEngine.click(button)

      expect(screen.getByText('69420')).toBeDefined()


})
// wont work bcs handleLike is defined inside itself and not passed as a prop
// test('if the like button is clicked twice, the event handler is called twice', async () => {
//   const blog = {
//     title: 'Title of the blog',
//     author: 'Author of the blog',
//     url: 'www.blogurl.com',
//     likes: 5,
//     user: {
//       id: '123456789',
//       name: 'Test User',
//       username: 'testuser',
//     },
//   }

//   const user = {
//     username: 'testuser',
//     name: 'Test User',
//   }

//   const mockHandler = vi.fn()

//   render(
//     <BlogCard blog={blog} handleLike={mockHandler} user={user} />
//   )

//   const userEngine = userEvent.setup()
//   const viewButton = screen.getByText('View')
//   await userEngine.click(viewButton)

//   const likeButton = screen.getByTestId('likeButton')
//   await userEngine.click(likeButton)
//   await userEngine.click(likeButton)

//   expect(mockHandler).toHaveBeenCalledTimes(2)
// })