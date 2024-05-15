import { render, screen, fireEvent } from '@testing-library/react'
import { AddBlog } from './AddBlog'
import userEvent from '@testing-library/user-event'

test('<AddBlog /> updates parent state and calls onSubmit', async () => {
  const handleAddBlog = vi.fn()

  render(<AddBlog handleAddBlog={handleAddBlog} />)

  const inputTitle = screen.queryByTestId('title')
  const inputAuthor = screen.queryByTestId('author')
  const inputUrl = screen.queryByTestId('url')
  const form = screen.queryByTestId('addBlogForm')

  expect(form).toBeDefined()

  fireEvent.change(inputTitle, { target: { value: 'Testing of forms could be easier' } })
  fireEvent.change(inputAuthor, { target: { value: 'Test Author' } })
  fireEvent.change(inputUrl, { target: { value: 'www.testurl.com' } })
  fireEvent.submit(form)

  expect(handleAddBlog).toHaveBeenCalledTimes(1)

  expect(handleAddBlog).toHaveBeenCalledWith(expect.anything())
})