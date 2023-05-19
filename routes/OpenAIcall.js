const axios = require('axios')

const url = 'https://api.openai.com/v1/chat/completions';
const api_key = process.env.API_KEY;
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${api_key}`
};

async function makeAPIRequest(prompt) {
    const data = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'user', content: prompt }
        ]
    };
    try {
      const response = await axios.post(url, data, { headers });
      const answer = response.data.choices[0].message.content;
      return answer
    } catch (error) {
      return null
    }
}

module.exports = makeAPIRequest
