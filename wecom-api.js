const axios = require('axios').default

const BASE_URL = 'https://qyapi.weixin.qq.com'

const getToken = async ({ id, secret }) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/cgi-bin/gettoken`, {
      params: {
        corpid: id,
        corpsecret: secret
      }
    })

    return data
  } catch (error) {
    console.error(error)
  }
}

const sendMessage = async ({ accessToken, agentId, userId, content }) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/cgi-bin/message/send`, {
      touser: userId,
      msgtype: 'text',
      agentid: agentId,
      text: {
        content
      }
    }, {
      params: {
        access_token: accessToken
      }
    })

    return data
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  getToken,
  sendMessage
}
