const express = require('express');
const logger = require('../logging-middleware/logging_middleware');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const urlDatabase = {};

const generateShortCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i=0;i<6;i++){
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

app.post('/shorturls', async (req,res) => {
    try {
        const {url, validity, shortCode} = req.body;
        let finalShortCode = shortCode;

        if (!finalShortCode) {
            finalShortCode = generateShortCode();
            await logger.Log('backend', 'debug', 'utils', `Generated new short code: ${finalShortCode}`);
        } 
        else if (urlDatabase[finalShortCode]) {
            await logger.Log('backend', 'warn', 'handler', `Short code already exists: ${finalShortCode}`);
            return res.status(400).json({
                success: false,
                message: 'Short code already exists. Please choose another one.'
            });
        }
        
        if(!validity){
            urlDatabase[finalShortCode] = { url: url, expiry: Date.now() + 30 * 60 * 1000 };
        }else{
            urlDatabase[finalShortCode] = { url: url, expiry: Date.now() + validity * 60 * 1000 };
        }
        
        await logger.Log('backend', 'info', 'handler', `URL successfully shortened: ${url} -> ${finalShortCode}`);

        res.status(201).json({
            shortlink: `http://localhost:8000/${finalShortCode}`,
            expiry: new Date(urlDatabase[finalShortCode].expiry).toISOString()
        });

    } catch (error) {
        await logger.Log('backend', 'error', 'handler', `Error in URL shortening: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

app.get('/:shortCode', async (req,res) => {
    try {
        const { shortCode } = req.params;
        
        await logger.Log('backend', 'info', 'handler', `Redirect request for short code: ${shortCode}`);

        if (!urlDatabase[shortCode]) {
            await logger.Log('backend', 'warn', 'handler', `Short code not found: ${shortCode}`);
            return res.status(404).json({
                success: false,
                message: 'Short URL not found'
            });
        }

        const originalUrl = urlDatabase[shortCode].url;
        if (urlDatabase[shortCode].expiry < Date.now()) {
            await logger.Log('backend', 'error', 'handler', `The shortcode you have entered has expired!`);
            delete urlDatabase[shortCode];
            return res.status(404).json({
            message: 'Link has expired, please try again'
            });
        }
        
        await logger.Log('backend', 'info', 'handler', `Redirecting ${shortCode} to ${originalUrl}`);
        
        console.log(shortCode, urlDatabase);
        res.redirect(originalUrl);

    } catch (error) {
        await logger.Log('backend', 'error', 'handler', `Error in redirect: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

app.listen(8000, async () => {
    console.log(`URL Shortener running on port ${8000}`);
    await logger.Log('backend', 'info', 'service', 'URL Shortener service started on port 8000');
});