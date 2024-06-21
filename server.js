const express = require('express');
const crypto = require('crypto');

const app = express();
const BOT_TOKEN = '7463089336:AAHpqKUrE82yxW5vAUwLNu55t_LlNjEYxjY';
const SECRET_KEY = crypto.createHash('sha256').update(BOT_TOKEN).digest();

app.get('/auth', (req, res) => {
    const { hash, ...data } = req.query;
    const checkString = Object.keys(data).sort().map(k => (`${k}=${data[k]}`)).join('\n');
    const hmac = crypto.createHmac('sha256', SECRET_KEY).update(checkString).digest('hex');
    
    if (hmac === hash) {
        res.send(`
            <script>
                window.opener.TelegramLoginWidget.onLogin(${JSON.stringify(data)});
                window.close();
            </script>
        `);
    } else {
        res.status(403).send('Authentication failed');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
