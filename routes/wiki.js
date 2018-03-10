const {addPage, main, wikiPage} = require('../views')
const router = require('express').Router() // eslint-disable-line new-cap
const {Page, User} = require('../models')

router.get('/', (req, res, next) => {
  res.send(main())
})

router.get('/add', (req, res, next) => {
  res.send(addPage())
})

router.get('/:slug', async (req, res, next) => {
  const {slug} = req.params
  try {
    const page = await Page.findOne({
      where: {
        slug
      }
    })

    res.send(wikiPage(page, 'Daisy'))
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  const {author: name, email} = req.body

  try {
    // eslint-disable-next-line no-unused-vars
    const [author, _] = await User.findOrCreate({
      where: {name, email}
    })

    const page = await Page.create(req.body)
    page.setAuthor(author)

    res.redirect(`/wiki/${page.slug}`)
  } catch (error) {
    next(error)
  }
})

module.exports = router
