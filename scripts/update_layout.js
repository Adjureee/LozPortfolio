const fs = require('fs');

const ieIconBase64 = 'data:image/png;base64,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';

let main = fs.readFileSync('public/monitor-os/static/js/main.fe030160.js', 'utf8');

if (main.includes('{top:104*t}')) {
  // Let's implement real column wrapping: {top: 86 * (t % 6), left: 10 + 70 * Math.floor(t / 6)}
  main = main.replace('{top:104*t}', '{top:86*(t%6),left:10+70*Math.floor(t/6)}');
  fs.writeFileSync('public/monitor-os/static/js/main.fe030160.js', main, 'utf8');
  console.log('Successfully updated grid layout to wrap at 6 icons per column.');
} else {
  console.log('Could not find top:104*t');
}

const match = main.match(/"(\.\/ieIcon\.png)":(\d+)/);
if (match) {
  const id = match[2];
  const oldB64Regex = new RegExp(id + ':\\s*e=>\\{\\s*"use strict";\\s*e\\.exports="([^"]+)"');
  main = main.replace(oldB64Regex, id + ':e=>{"use strict";e.exports="' + ieIconBase64 + '"}');
  fs.writeFileSync('public/monitor-os/static/js/main.fe030160.js', main, 'utf8');
  console.log('Successfully updated IE base64 image.');
} else {
  console.log('ieIcon not found');
}
