const fs = require('fs');
const content = fs.readFileSync('public/monitor-os/static/js/main.fe030160.js', 'utf8');
const start = content.indexOf('ieBrowser:{key:"ieBrowser"');
const end   = content.indexOf('},credits:{key:"credits"', start);
const block = content.substring(start, end + 1);

let open = 0, close = 0;
for (const ch of block) { if (ch === '(') open++; if (ch === ')') close++; }
let bopen = 0, bclose = 0;
for (const ch of block) { if (ch === '{') bopen++; if (ch === '}') bclose++; }
console.log('Block length:', block.length);
console.log('Parens: open=' + open + ' close=' + close + ' diff=' + (open - close));
console.log('Braces: open=' + bopen + ' close=' + bclose + ' diff=' + (bopen - bclose));
console.log('\nLast 200 chars of block:');
console.log(block.slice(-200));
