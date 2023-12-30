// server.js

const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

// Replace 'YOUR_HUGGING_FACE_API_KEY' with your Hugging Face API key
const HUGGING_FACE_API_KEY = 'YOUR_HUGGING_FACE_API_KEY';
const HUGGING_FACE_ENDPOINT = 'https://api-inference.huggingface.co/models/t5-base';

app.use(express.json());

app.post('/api/generate-questions', async (req, res) => {
    try {
        const { prompt, n } = req.body;

        const response = await axios.post(
            `${HUGGING_FACE_ENDPOINT}/generate`,
            {
                inputs: prompt,
                parameters: {
                    max_tokens: 100,
                    num_return_sequences: n || 1,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
                },
            }
        );

        const generatedQuestions = response.data.map((result) => result.generated_text.trim());
        res.json({ questions: generatedQuestions });
    } catch (error) {
        console.error('Error generating questions:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
