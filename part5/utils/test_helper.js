const User = require('../models/User')

const initialUsers = [
  {
    username: 'root',
    name: 'Superuser',
    password: 'salainen',
  },
  {
    username: 'test',
    name: 'Test User',
    password: 'password',
  },
]


const nonExistingId = async () => {
  const user = new User({ username:
    'willremovethissoon', password: 'password' })
  await user.save()
  await user.remove()

  return user._id.toString()
}


const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  nonExistingId,
  usersInDb,
  initialUsers
}