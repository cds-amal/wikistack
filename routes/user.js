const router = require('express').Router() // eslint-disable-line new-cap
const {User, Page} = require('../models')
const {userList, userPages} = require('../views')

router.get('/', async (req, res, next) => {
  //
  console.log('users  root')
  try {
    const authors = await User.findAll()
    res.send(userList(authors))
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const author = await User.findById(req.params.id)
    const pages = await Page.findAll({
      where: {
        authorId: req.params.id
      }
    })
    res.send(userPages(author, pages))
  } catch (err) {
    next(err)
  }
})

module.exports = router
