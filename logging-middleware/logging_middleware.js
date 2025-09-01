const axios = require('axios');

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';


const Log = async (stack, level, package, message) => {
    try {
        const logData = {
            stack: stack,
            level: level,
            package: package,
            message: message
        };
        
        const ID = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhZGl0aHlhMTQyNTVAZ21haWwuY29tIiwiZXhwIjoxNzU2NzA4MDIwLCJpYXQiOjE3NTY3MDcxMjAsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJjOGYzNDc1Yy01ZDFhLTRkNzUtYjBkNy00ODMyZDFmMjBiZTciLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJhZGl0aHlhIGciLCJzdWIiOiI0N2I0MGRkYy03YzgxLTQwODItOGNmOC0yODNlOWJmM2ZkMDgifSwiZW1haWwiOiJhZGl0aHlhMTQyNTVAZ21haWwuY29tIiwibmFtZSI6ImFkaXRoeWEgZyIsInJvbGxObyI6IjIyY3NhMDMiLCJhY2Nlc3NDb2RlIjoiZHFYdXdaIiwiY2xpZW50SUQiOiI0N2I0MGRkYy03YzgxLTQwODItOGNmOC0yODNlOWJmM2ZkMDgiLCJjbGllbnRTZWNyZXQiOiJyZkd6RlBzTllrZVl1Z3lnIn0.cG1SqeBF6Cvs9ybBZLgca5W6PjK1exFOT3d3qAFEmNo";

        const response = await axios.post(LOG_API_URL, JSON.stringify(logData), {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ID}`
            },
        });

        return {
            success: true,
            logID: response.data.logID,
            message: response.data.message
        };
        
    } catch (error) {
        console.error('Logging failed:', error.message);

        return {
            success: false,
            error: error.message,
        };
    }
};



module.exports = {
    Log
};