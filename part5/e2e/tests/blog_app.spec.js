const { test, expect, describe, beforeEach } = require('@playwright/test')
const { error } = require('console')

const loginWith = async (page, username, password) => {
    await page.getByRole('button', { name: 'Login' }).click()
    await page.getByRole('textbox', { name: 'username' }).fill(username)
    await page.getByRole('textbox', { name: 'password' }).fill(password)
    await page.getByRole('button', { name: 'Login' }).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'Add blog' }).click()
    await page.getByTestId('title').fill(title)
    await page.getByTestId('author').fill(author)
    await page.getByTestId('url').fill(url)
    await page.getByRole('button', { name: 'Add blog' }).click()
}

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('api/testing/reset')
        await request.post('api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'salainen'
            }
        })
        await page.goto('/')
      })

    test('front page can be opened', async ({ page }) => {
        const locator = await page.getByText('Blogs')
        await expect(locator).toBeVisible()
        await expect(page.getByText('Blog App')).toBeVisible()
    })
    
    test('login form is shown', async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')

        await expect(page.getByText('loged as')).toBeVisible()
        await expect(page.getByText('Logout')).toBeVisible()

        })

    describe('when logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
        })

        test('a new blog can be created', async ({ page }) => {


            const randomBlogTitle= Math.random().toString(36).substring(7) + ' test blog'
            await createBlog(page, randomBlogTitle, 'mluukkai', 'test url')
            await expect(page.getByText(randomBlogTitle)).toBeVisible()
        })

        describe('and a blog exists', () => {
            beforeEach(async ({ page }) => {
                await createBlog(page, 'test blog', 'mluukkai', 'test url')
                await page.getByRole('button', { name: 'Add blog' }).click()
            })

            test('it can be liked', async ({ page }) => {
                await page.getByRole('button', { name: 'View' }).click()
                const likesContainer = await page.getByTestId('likeButton')
                await likesContainer.click()
                await expect(likesContainer).toHaveText('1')
            })

            test('it can be deleted', async ({ page }) => {
                const deleteButton = await page.getByTestId('deleteButton')
                await deleteButton.click()

            })
        })
    })

    describe('login fails', () => {
        test('with wrong credentials', async ({ page }) => {
            await loginWith(page, 'mluukkai', 'wrong')
            await expect(page.getByText('Invalid username or password')).toBeVisible()
            //expect axios to return 401

        })
    })
})