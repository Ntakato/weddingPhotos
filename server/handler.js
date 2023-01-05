const AWS = require("aws-sdk")
const express = require("express")
const serverless = require("serverless-http")
const crypto = require('crypto')

const app = express()

const SESSION_KEY_TABLE = process.env.SESSION_KEY_TABLE
const BUCKET_NAME = process.env.S3_BUCKET

const dynamoDbClient = new AWS.DynamoDB.DocumentClient()
const ssm = new AWS.SSM()
const s3 = new AWS.S3()

app.use(express.json())

const ONE_DAY_MILLIS = 24 * 60 * 60 * 1000

app.get("/images", async function (req, res) {
  const { authorization } = req.headers
  if (!authorization) {
    return res.status(403).json({ status: 403, message: 'auth error' })
  }
  const dynamoDbRequest = {
    TableName: SESSION_KEY_TABLE,
    Key: {
      sessionKey: authorization,
    },
  }
  try {
    const { Item } = await dynamoDbClient.get(dynamoDbRequest).promise()
    if (!Item || Item.expiredDate < new Date().getTime()) {
      return res.status(403).json({ status: 403, message: 'auth error' })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Could not access db" })
  }
  const s3ListObjectRequest = {
    Bucket: BUCKET_NAME,
    // ContinuationToken: 'STRING_VALUE',
    Prefix: 'guest-camera'
  }
  const imageKeys = await s3.listObjectsV2(s3ListObjectRequest).promise()
    .then(({ Contents }) => Contents.map(({ Key }) => Key))
  const signedUrls = await Promise.all(imageKeys.map(key => s3.getSignedUrl('getObject', { Bucket: BUCKET_NAME, Key: key })))
  return res.json({ signedUrls })
})

app.post("/auth", async (req, res) => {
  const { password } = req.body
  if (typeof password !== "string") {
    res.status(400).json({ error: '"password" must be a string' })
  }
  const response = await ssm.getParameter({
    Name: 'password',
    WithDecryption: true
  }).promise()
  if (password !== response.Parameter.Value) {
    res.status(403).json({ error: "password is incorrect" })
  }
  const sessionKey = crypto.randomBytes(32).toString('base64')
  const expiredDate = new Date().getTime() + ONE_DAY_MILLIS
  const params = {
    TableName: SESSION_KEY_TABLE,
    Item: {
      sessionKey,
      expiredDate
    }
  }
  try {
    await dynamoDbClient.put(params).promise()
    console.log({ sessionKey })
    res.json({ sessionKey })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Could not session" })
  }
})

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  })
})


module.exports.handler = serverless(app)

