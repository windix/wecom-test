require('dotenv').config()

const { getSignature, decrypt } = require('@wecom/crypto')
const express = require('express')
const { getToken, sendMessage } = require('./wecom-api')

const { TOKEN, ENCODING_AES_KEY } = process.env
const { COMPANY_ID, AGENT_ID, SECRET } = process.env

const app = express()
const port = 8848

let accessToken = ''
let lastAccessTokenExpiryTime = 0

app.get('/', (req, res) => {
  try {
    // http://api.3dept.com/?msg_signature=ASDFQWEXZCVAQFASDFASDFSS&timestamp=13500001234&nonce=123412323&echostr=ENCRYPT_STR

    const { msg_signature, timestamp, nonce, echostr } = req.query

    const signature = getSignature(TOKEN, timestamp, nonce, echostr)

    console.log({
      expectedSignature: signature,
      messageSignature: msg_signature,
    })

    const { id, message } = decrypt(ENCODING_AES_KEY, echostr)

    console.log({ id, message })

    res.send(message)

  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.get('/msg', async (req, res) => {
  try {
    if (Date.now() > lastAccessTokenExpiryTime) {
      console.log('Refreshing access token...')

      const { access_token, expires_in } = await getToken({ id: COMPANY_ID, secret: SECRET })

      accessToken = access_token
      lastAccessTokenExpiryTime = Date.now() + expires_in * 1000
    }

    const result = await sendMessage({ accessToken, agentId: AGENT_ID, userId: '@all', content: req.query.message })

    console.log(result)
    res.send('Message sent')

  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
