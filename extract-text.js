const fs = require('fs');
const file = 'public/monitor-os/static/js/main.fe030160.js';
let code = fs.readFileSync(file, 'utf8');

// Find all strings in children:"..." or children: `...` inside React.createElement or JSX
const regex = /(?:children|text):"([^"]{10,})"/g;
let match;
let count = 0;
while ((match = regex.exec(code)) !== null) {
    if (match[1].length > 20) {
        console.log(match[1]);
        count++;
    }
}
console.log(`Found ${count} strings.`);
