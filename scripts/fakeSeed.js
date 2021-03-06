const Chance = require('chance')

const models = require('../models')
const {Page, User, db} = models

const chance = new Chance()

const authors = chance.n(
  () => ({
    name: chance.name(),
    email: chance.email()
  }),
  14
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

const seedDB = async () => {
  await db.authenticate()
  await db.sync({force: true})

  for (let ii = 0; ii <= 200; ii++) {
    const entry = makeWikiEntry()
    const {name, email} = entry

    // eslint-disable-next-line no-unused-vars
    const [author, isCreated] = await User.findOrCreate({
      where: {name, email}
    })

    const page = await Page.create(entry)
    await page.setAuthor(author)
  }
}

seedDB()
  .then(() => {
    console.log('DATABASE SEEDED!!!')
    db.close()
  })
  .catch(err => {
    console.log(err)
    console.log('DATABASE NOT SEEDED!!!')
    db.close()
  })
