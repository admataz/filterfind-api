require('dotenv-expand')(require('dotenv').config())
const faker = require('faker')

const { Client } = require('pg')
// const SQL = require('sql-template-strings')

const docQueries = require('../services/document/queries')
// const tagQueries = require('../services/tag/queries')
// const vocabQueries = require('../services/vocabulary/queries')

const randomInt = max => Math.ceil(Math.random() * max)

function generateDocument () {
  const doc = {
    doctype: faker.random.arrayElement(['animal', 'mineral', 'vegetable', 'abstract']),
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

  // let vocabsCount = 0
  // while (vocabsCount < 10) {
  //   await client.query(vocabQueries.create({
  //     label: faker.random.word(),
  //     description: faker.random.words(12)
  //   }))
  //   vocabsCount += 1
  // }

  // let tagsCount = 0
  // while (tagsCount < 300) {
  //   const res = await client.query(tagQueries.create({
  //     label: faker.random.word(),
  //     description: faker.random.words(12)
  //   }))
  //   const id = res.rows[0].id

  //   await client.query(vocabQueries.tagVocabulary(
  //     {
  //       vocabId: randomInt(10),
  //       tagId: id
  //     }
  //   ))

  //   await client.query(vocabQueries.tagVocabulary(
  //     {
  //       vocabId: randomInt(10),
  //       tagId: id
  //     }
  //   ))

  //   tagsCount += 1
  // }
  const docCount = 10000

  let documentCount = 0
  while (documentCount < docCount) {
    documentCount += 1
    // const res =
    await client.query(generateDocument())
    // const id = res.rows[0].id
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
