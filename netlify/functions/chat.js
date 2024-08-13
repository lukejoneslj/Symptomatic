const axios = require('axios');

   exports.handler = async function(event, context) {
     if (event.httpMethod !== 'POST') {
       return { statusCode: 405, body: 'Method Not Allowed' };
     }

     const { message } = JSON.parse(event.body);

     try {
       const response = await axios.post('https://api.openai.com/v1/chat/completions', {
         model: 'gpt-3.5-turbo',
         messages: [{ role: 'user', content: message }],
       }, {
         headers: {
           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
           'Content-Type': 'application/json',
         },
       });

       return {
         statusCode: 200,
         body: JSON.stringify({ message: response.data.choices[0].message.content }),
       };
     } catch (error) {
       console.error('Error:', error.response ? error.response.data : error.message);
       return {
         statusCode: 500,
         body: JSON.stringify({ error: 'There was an error processing your request' }),
       };
     }
   };
