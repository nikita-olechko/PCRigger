const axios = require('axios');

const url = 'https://api.openai.com/v1/chat/completions';
const api_key = process.env.API_KEY;
const headers = 
// setting the headers for the API call
{
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${api_key}`
};

async function makeAPIRequest(prompt) {
    const data = 
    // setting the data for the API call
    {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'user', content: prompt }
        ]
    };
    try {
      // making the API call
      const response = await axios.post(url, data, { headers });
      // getting the answer from the API response object
      const answer = response.data.choices[0].message.content;
      return answer;
    } catch (error) {
      return null;
    }
}

module.exports = makeAPIRequest;
