
const testQuery = async (query) => {
    try {
        console.log(`Testing query: "${query}"...`);
        const response = await fetch('http://localhost:3000/api/ai', {
            method: 'POST',
            body: JSON.stringify({ prompt: query }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error('Response text:', text);
            return;
        }

        const data = await response.json();
        console.log('Result:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Test failed:', error);
    }
};

(async () => {
    await testQuery('mumbai');
    await testQuery('bengaluru city');
})();
