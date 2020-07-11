require('dotenv-expand')(require('dotenv').config())
const faker = require('faker')

const { Client } = require('pg')
const docQueries = require('../services/document/queries')
const schemaQueries = require('../services/docschema/queries')

const randomInt = max => Math.ceil(Math.random() * max)
const doctypes = ['animal', 'mineral', 'vegetable', 'abstract']

function generateDocument (docSchemaId) {
  const doc = {
    docschema: docSchemaId,
    title: faker.random.words(4),
    excerpt: faker.company.catchPhrase(),
    body: faker.lorem.paragraphs(5),
    metadata: {
      [faker.random.objectElement()]: faker.random.words(3),
      [faker.random.objectElement()]: faker.random.words(3),
      assets: {
        img: [faker.image.nature(), faker.image.nature(), faker.image.nature()]
      }
    },
    content: {
      data: {
        prop1: faker.random.number(),
        prop2: faker.random.number()
      }
    }
  }
  return docQueries.create(doc)
}

async function seedData () {
  const client = new Client()
  await client.connect()
  const docCount = 1000

  // THIS WILL CASCADE AND DELETE EVERYTHING!! 
  await client.query('TRUNCATE "public"."docschema" RESTART IDENTITY CASCADE;')
  const docSchemaIds = await Promise.all(doctypes.map(async (d) => {
    const docschemaQuery = schemaQueries.create({
      label: d
    })
    const res = await client.query(docschemaQuery)
    return res.rows[0].id
  }))


  let documentCount = 0
  while (documentCount < docCount) {
    documentCount += 1
    const docSchemaId = faker.random.arrayElement(docSchemaIds)
    await client.query(generateDocument(docSchemaId))
  }

  documentCount = 0
  while (documentCount < docCount) {
    documentCount += 1
    let relcount = 0
    while (relcount < randomInt(20)) {
      await client.query(docQueries.addTag(
        {
          relatedDocumentId: randomInt(docCount),
          baseDocumentId: documentCount
        }
      ))
      relcount += 1
    }
  }

  await client.end()
}

module.exports = seedData

seedData().catch(err => console.log(err))
