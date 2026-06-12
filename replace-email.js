const fs = require('fs');
const file = 'public/monitor-os/static/js/main.fe030160.js';
let code = fs.readFileSync(file, 'utf8');

if (code.includes('henryheffernan@gmail.com')) {
    code = code.replace(/henryheffernan@gmail\.com/g, 'johnlyoldlozada@gmail.com');
    fs.writeFileSync(file, code);
    console.log("Email replaced!");
} else {
    console.log("Email not found!");
}
