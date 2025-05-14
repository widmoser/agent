const apiKey: string | undefined  = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
    console.error('Please set the OPENROUTER_API_KEY environment variable.');
    process.exit(1);
}

const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${apiKey}`,
        // 'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
        // 'X-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages: [
            {
                role: 'user',
                content: 'What is the meaning of life?',
            },
        ],
    }),
});

const data = await response.json();
console.log(data.choices[0].message.content);

export {};