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

const main = async () => {
  try {
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
      page.setAuthor(author)
    }
    console.log('DATABASE SEEDED!!!')
  } catch (error) {
    console.log(error)
    console.log('DATABASE NOT SEEDED ')
  } finally {
    // Process hangs with connection pool draining error.  when trying to use
    // db.close() [promise]. The docs state that pool is cleaned up at
    // process.exit. So I force it.  See:
    // http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html#instance-method-close
    //
    process.exit(0)
  }
}

main()
