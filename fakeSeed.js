const Chance = require('chance')
const _ = require('lodash')

const models = require('./models')
const {Page, User, db} = models

const chance = new Chance()

const authors = chance.n(
  () => ({
    name: chance.name(),
    email: chance.email()
  }),
  7
)

const makeWikiEntry = () => {
  const {name, email} = chance.pickone(authors)
  return {
    name,
    email,
    title: chance.sentence({words: chance.d8()}),
    content: chance.paragraph({sentences: chance.d12() + 8}),
    status: 'open'
  }
}

const main = async () => {
  try {
    await db.authenticate()
    await db.sync({force: true})

    const entries = _.times(20, () => makeWikiEntry())

    entries.forEach(async entry => {
      const {name, email} = entry
      // eslint-disable-next-line no-unused-vars
      const [author, isCreated] = await User.findOrCreate({
        where: {name, email}
      })

      const page = await Page.create(entry)
      page.setAuthor(author)
    })
    console.log('database seeded')
  } catch (error) {
    console.log('could not seed database')
  }
}

main()
