/**
 * Replaces the IE browser component in the minified Windows 95 OS bundle.
 * Uses explicit brace/paren counting to verify correctness before writing.
 */
const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, '..', 'public', 'monitor-os', 'static', 'js', 'main.fe030160.js');
let content = fs.readFileSync(bundlePath, 'utf8');

const start = content.indexOf('ieBrowser:{key:"ieBrowser"');
const end   = content.indexOf('},credits:{key:"credits"', start);

if (start < 0 || end < 0) {
  console.error('ERROR: Could not locate IE block. start=' + start + ' end=' + end);
  process.exit(1);
}
console.log('Found IE block: start=' + start + ' end=' + end);

// ---------------------------------------------------------------------------
// Build the new component piece by piece with zero ambiguity about nesting.
// Naming: A=site-page div, B=flex-column div, C=toolbar div
// ---------------------------------------------------------------------------

// --- address bar (toolbar) ---
const spanAddr   = '(0,Ce.jsx)("span",{style:{fontSize:"13px",whiteSpace:"nowrap"},children:"Address:"})';
const inputAddr  = '(0,Ce.jsx)("input",{value:urlV,onChange:function(ev){setUrlV(ev.target.value);},onKeyDown:function(ev){if(ev.key==="Enter")go();},style:{flex:1,fontSize:"13px",padding:"1px 4px"},spellCheck:false})';
const btnGo      = '(0,Ce.jsx)("button",{onClick:go,className:"site-button",style:{padding:"2px 10px",fontSize:"13px",flexShrink:0},children:"Go"})';
// C: toolbar div  — jsxs because children is an array
const divC       = '(0,Ce.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"4px",padding:"3px 4px",background:"#d4d0c8",borderBottom:"2px solid #808080",flexShrink:0},children:[' + spanAddr + ',' + inputAddr + ',' + btnGo + ']})';

// --- error screen ---
const errH2  = '(0,Ce.jsx)("h2",{style:{color:"#aa0000"},children:"The page cannot be displayed"})';
const errP1  = '(0,Ce.jsx)("p",{children:"This page is unavailable or is blocking iframe embedding."})';
const errP2  = '(0,Ce.jsx)("p",{style:{color:"#666",fontSize:"13px"},children:"Note: Sites like Google and YouTube block iframes for security reasons."})';
const divErr = '(0,Ce.jsxs)("div",{style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"white",padding:"40px",textAlign:"center"},children:[' + errH2 + ',' + errP1 + ',' + errP2 + ']})';

// --- iframe ---
const iframeEl = '(0,Ce.jsx)("iframe",{key:srcV,src:srcV,style:{flex:1,width:"100%",border:"none"},title:"IE",onError:function(){setErrV(true);}})';

// ternary content
const ternary = 'errV?' + divErr + ':' + iframeEl;

// B: flex-column container — jsxs because children is an array [C, ternary]
const divB = '(0,Ce.jsxs)("div",{style:{display:"flex",flexDirection:"column",width:"100%",height:"100%"},children:[' + divC + ',' + ternary + ']})';

// A: site-page wrapper — jsx because single child (divB)
const divA = '(0,Ce.jsx)("div",{className:"site-page",style:{flexDirection:"column"},children:' + divB + '})';

// Sl window wrapper — jsx because single child (divA)
const slEl = '(0,Ce.jsx)(Sl,{top:30,left:80,width:900,height:600,windowBarIcon:"windowExplorerIcon",windowTitle:"Internet Explorer",closeWindow:t.onClose,onInteract:t.onInteract,minimizeWindow:t.onMinimize,bottomLeftText:errV?"Cannot display page":"Done",children:' + divA + '})';

// component function body
const fnBody =
  'var su=e.useState("adjureee.github.io/LozPortfolio"),urlV=su[0],setUrlV=su[1];' +
  'var so=e.useState("https://adjureee.github.io/LozPortfolio"),srcV=so[0],setSrcV=so[1];' +
  'var se=e.useState(false),errV=se[0],setErrV=se[1];' +
  'function go(){var v=urlV.trim();if(!v)return;if(v.indexOf("http")!==0)v="https://"+v;setErrV(false);setSrcV(v);setUrlV(v);}' +
  'return ' + slEl + ';';

// full app entry (no trailing comma — the comma is in the bundle between entries)
const newIE =
  'ieBrowser:{key:"ieBrowser",name:"Internet Explorer",shortcutIcon:"ieIcon",' +
  'component:function(t){' + fnBody + '}}';

// ---------------------------------------------------------------------------
// Verify brace/paren balance before writing
// ---------------------------------------------------------------------------
function countChar(str, ch) {
  let n = 0;
  for (const c of str) if (c === ch) n++;
  return n;
}
const openB  = countChar(newIE, '{');
const closeB = countChar(newIE, '}');
const openP  = countChar(newIE, '(');
const closeP = countChar(newIE, ')');
const openBr = countChar(newIE, '[');
const closeBr= countChar(newIE, ']');

console.log('newIE braces  {/}: ' + openB + '/' + closeB + ' diff=' + (openB - closeB));
console.log('newIE parens  (/)  : ' + openP + '/' + closeP + ' diff=' + (openP - closeP));
console.log('newIE brackets[/]: ' + openBr + '/' + closeBr + ' diff=' + (openBr - closeBr));

if (openB !== closeB || openP !== closeP || openBr !== closeBr) {
  console.error('BALANCE ERROR — aborting. Fix the script before writing.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------
content = content.substring(0, start) + newIE + content.substring(end);
fs.writeFileSync(bundlePath, content, 'utf8');
console.log('\nWritten successfully. Verifying insertion...');

const v2 = fs.readFileSync(bundlePath, 'utf8');
const vIdx = v2.indexOf('ieBrowser:{key:"ieBrowser"');
console.log('IE block at index:', vIdx);
console.log('First 150 chars:', v2.substring(vIdx, vIdx + 150));
