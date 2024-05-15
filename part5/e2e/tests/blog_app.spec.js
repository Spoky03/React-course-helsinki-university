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

            test('only user who created the blog can delete it', async ({ page, request }) => {
                //logout
                await page.getByText('Logout').click()
                await request.post('api/users', {
                    data: {
                        name: 'Stefan',
                        username: 'stefan',
                        password: '1234'
                    }
                })
                await page.goto('/')

                await loginWith(page, 'stefan', '1234')
                await page.getByRole('button', { name: 'View' }).click()
                await expect(page.getByTestId('deleteButton')).toBeDisabled()
                await expect(page.getByTestId('deleteButton')).toBeHidden()
            })
            describe('blogs are sorted by likes', () => {
                beforeEach(async ({ page, request }) => {
                    await createBlog(page, 'blog1', 'mluukkai', 'test url1')
                    await createBlog(page, 'blog2', 'mluukkai', 'test url2')
                    await createBlog(page, 'blog3', 'mluukkai', 'test url3')
                    await page.locator('li').filter({ hasText: 'blog1' }).getByRole('button', { name: 'View' }).click()
                    await expect(page.getByText('test url1')).toBeVisible()
                    await page.locator('li').filter({ hasText: 'blog2' }).getByRole('button', { name: 'View' }).click()
                    await expect(page.getByText('test url2')).toBeVisible()
                    await page.locator('li').filter({ hasText: 'blog3' }).getByRole('button', { name: 'View' }).click()
                    await expect(page.getByText('test url3')).toBeVisible()
                    // like each blog
                    for (let i = 1; i <= 3; i++) {
                        await page.getByTestId('likeButton').nth(i).click()
                    }
                    //login on diffrent user
                    await page.getByText('Logout').click()
                    await request.post('api/users', {
                        data: {
                            name: 'Stefan',
                            username: 'stefan',
                            password: '1234'
                        }
                    })
                    await page.goto('/')
                    await loginWith(page, 'stefan', '1234')
                    //likes only the first blog
                    await page.locator('li').filter({ hasText: 'blog1' }).getByRole('button', { name: 'View' }).click()
                    await expect(page.locator('button:visible').getByTestId('likeButton')).toHaveText('1')
                    await page.locator('button:visible').getByTestId('likeButton').click()
                    await expect(page.locator('button:visible').getByTestId('likeButton')).toHaveText('2')
                    
                })

                test('blogs are sorted by likes', async ({ page }) => {
                    const likes = await page.getByTestId('likeButton').all()
                    const likesTexts = await Promise.all(likes.map(async (like) => await like.textContent()))
                    const sortedLikes = likesTexts.sort((a, b) => b - a)
                    await expect(likesTexts).toHaveLength(4)
                    await expect(likesTexts).toEqual(sortedLikes)

                })
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