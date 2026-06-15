const fs = require('fs');
const file = 'public/monitor-os/static/js/main.fe030160.js';
let content = fs.readFileSync(file, 'utf8');

const badIdx = content.indexOf('}}},credits:{key:"credits"');
if (badIdx !== -1) {
  console.log('Found corrupted sequence at', badIdx);
  const fixed = content.substring(0, badIdx) + '}},credits:{key:"credits"' + content.substring(badIdx + '}}},credits:{key:"credits"'.length);
  fs.writeFileSync(file, fixed, 'utf8');
  console.log('Fixed duplicated brace.');
} else {
  console.log('Could not find exact corrupted sequence.');
  const test = content.indexOf('credits:{key:"credits"');
  console.log('Nearby:', content.substring(test - 20, test + 20));
}
