// Restore the original clean bundle from git, then apply all 3 fixes carefully
const { execSync } = require('child_process');
const fs = require('fs');

const FILE = 'public/monitor-os/static/js/main.fe030160.js';

// Step 1: Restore original from last known good commit (ebfd52c - before any IE changes)
console.log('=== Step 1: Restoring original bundle from ebfd52c ===');
const original = execSync('git show ebfd52c:' + FILE, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
fs.writeFileSync(FILE, original, 'utf8');

// Verify
try {
  execSync('node --check ' + FILE, { encoding: 'utf8' });
  console.log('  ✓ Original bundle syntax OK');
} catch (e) {
  console.log('  ✗ Original bundle has syntax error!', e.message);
  process.exit(1);
}

// Step 2: Fix icon grid layout — change {top:104*t} to column-wrapping math
console.log('\n=== Step 2: Fix icon grid layout ===');
let content = fs.readFileSync(FILE, 'utf8');
const layoutTarget = '{top:104*t}';
if (content.includes(layoutTarget)) {
  // Wrap at 5 icons per column (safe for most viewport heights)
  // top: 86*(t%5) gives 0,86,172,258,344 — all above 400px taskbar area
  // left uses shortcutContainer's existing left:6 as base offset
  content = content.replace(layoutTarget, '{top:86*(t%5),left:6+80*Math.floor(t/5)}');
  fs.writeFileSync(FILE, content, 'utf8');
  try {
    execSync('node --check ' + FILE, { encoding: 'utf8' });
    console.log('  ✓ Layout fix syntax OK');
  } catch (e) {
    console.log('  ✗ Layout fix broke syntax!', e.message);
    process.exit(1);
  }
} else {
  console.log('  ! Could not find layout target');
}

// Step 3: Add IE browser component to the app registry
console.log('\n=== Step 3: Add IE browser to app registry ===');
content = fs.readFileSync(FILE, 'utf8');

// The app registry looks like: lozordle:{...},credits:{...}
// We insert ieBrowser before credits
const insertPoint = ',credits:{key:"credits"';
if (content.includes(insertPoint)) {
  // Build the IE component carefully — minimal, functional
  const ieComponent = [
    ',ieBrowser:{key:"ieBrowser",name:"Internet Explorer",shortcutIcon:"ieIcon",component:function(t){',
    'var s1=e.useState("https://adjureee.github.io/LozPortfolio");',
    'var urlV=s1[0];var setUrlV=s1[1];',
    'var s2=e.useState("https://adjureee.github.io/LozPortfolio");',
    'var srcV=s2[0];var setSrcV=s2[1];',
    'var s3=e.useState(false);var errV=s3[0];var setErrV=s3[1];',
    'function doGo(){var v=urlV.trim();if(!v)return;if(v.indexOf("http")!==0)v="https://"+v;setErrV(false);setSrcV(v);}',
    'var addrInput=(0,Ce.jsx)("input",{type:"text",value:urlV,',
    'onChange:function(ev){setUrlV(ev.target.value)},',
    'onKeyDown:function(ev){if(ev.key==="Enter")doGo()},',
    'style:{flex:1,fontFamily:"MS Sans Serif",fontSize:12,border:"1px inset #888",padding:"2px 4px"}});',
    'var goBtn=(0,Ce.jsx)("button",{onClick:doGo,',
    'style:{fontFamily:"MS Sans Serif",fontSize:11,marginLeft:4,padding:"1px 8px",cursor:"pointer"},',
    'children:"Go"});',
    'var toolbar=(0,Ce.jsx)("div",{style:{display:"flex",alignItems:"center",padding:4,background:"#c0c0c0",borderBottom:"1px solid #808080"},',
    'children:[(0,Ce.jsx)("span",{style:{fontFamily:"MS Sans Serif",fontSize:11,marginRight:4},children:"Address:"}),addrInput,goBtn]});',
    'var errScreen=(0,Ce.jsx)("div",{style:{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",fontFamily:"MS Sans Serif",background:"#fff",padding:32},',
    'children:[(0,Ce.jsx)("p",{style:{fontWeight:"bold",fontSize:14},children:"The page cannot be displayed"}),',
    '(0,Ce.jsx)("p",{style:{fontSize:11,color:"#444",marginTop:8},children:"The page you are looking for may have refused the connection or the address may be incorrect."})]});',
    'var iframe=(0,Ce.jsx)("iframe",{key:srcV,src:srcV,style:{flex:1,width:"100%",border:"none"},title:"IE",onError:function(){setErrV(true)}});',
    'var body=errV?errScreen:iframe;',
    'var mainDiv=(0,Ce.jsx)("div",{style:{display:"flex",flexDirection:"column",width:"100%",height:"100%"},children:[toolbar,body]});',
    'return (0,Ce.jsx)(Sl,{top:30,left:80,width:900,height:600,windowBarIcon:"windowExplorerIcon",windowTitle:"Internet Explorer",closeWindow:t.onClose,onInteract:t.onInteract,minimizeWindow:t.onMinimize,bottomLeftText:"Internet Explorer",children:mainDiv})',
    '}}'
  ].join('');

  content = content.replace(insertPoint, ieComponent + insertPoint);
  fs.writeFileSync(FILE, content, 'utf8');
  try {
    execSync('node --check ' + FILE, { encoding: 'utf8' });
    console.log('  ✓ IE component syntax OK');
  } catch (e) {
    console.log('  ✗ IE component broke syntax!');
    // Show the error line
    console.log(e.stderr ? e.stderr.toString() : e.message);
    process.exit(1);
  }
} else {
  console.log('  ! Could not find insert point for IE');
}

// Step 4: Register ieIcon in the webpack require context (module 994)
console.log('\n=== Step 4: Register ieIcon in webpack context ===');
content = fs.readFileSync(FILE, 'utf8');
const iconRegistry = '"./lozordleIcon.png":9';
if (content.includes(iconRegistry) && !content.includes('"./ieIcon.png"')) {
  content = content.replace(iconRegistry, iconRegistry + ',"./ieIcon.png":998');
  fs.writeFileSync(FILE, content, 'utf8');
  try {
    execSync('node --check ' + FILE, { encoding: 'utf8' });
    console.log('  ✓ Icon registry syntax OK');
  } catch (e) {
    console.log('  ✗ Icon registry broke syntax!');
    process.exit(1);
  }
} else if (content.includes('"./ieIcon.png"')) {
  console.log('  - ieIcon already registered');
} else {
  console.log('  ! Could not find icon registry');
}

// Step 5: Add ieIcon module (998) with a proper transparent PNG base64
console.log('\n=== Step 5: Add ieIcon base64 module ===');
content = fs.readFileSync(FILE, 'utf8');
if (!content.includes('998:e=>{')) {
  // The IE icon as a transparent 32x32 PNG (Windows 95 style globe/e logo)
  const ieBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAACGklEQVRYhe2XMW/TQBTHf+c6EhKbl0x2mPIRKiIspRk8sVeEiZLsAan9FBRB9lRsgBQxdPYQglylrfgEnpBvypBMCGiT+hgcTEwSpzKKs/QvWfd87/nez+d3urNQSrFN6cev326N4OjwCB1gt1LJPfnlYAD6NAIAqD76xi/tKaeqzv7kPR+7z6nXnY0BvDqOWn2+81TVCcV3PnX3CXd+ZB68f/YAgL1ajc+9HgDV6kP6/fPYhjeLAPVph7BwD/GkgPjwGABNFAjVJJFAE9rK5KEKY1tdT5bGaDd/n08AKL2AxhV0n6HfhFzDQvKkrghVAUGUVIhouL1aDRX+RON+9LZTQAiq9qzW1M4iQDRtX2d3zag5S8mdqt7aiMvBIAnwpyMPza+6xCc4fPkiF4Av5xexvbqacpKe5jx5d0Kr1cIwDMrlctzv+z5SSjqdDgDNZhPTNBdixuMx7XabxkEjG4DjOBiGgZQSKWXCZ5omjuPE9rqYVUr9BJZl4XneUp/neViWdauYzAB56A4gtQjTZNt2XPW+7+cPMBwOGY1GCCGYTNL2iw0BFIvFxAz8uwQ3DjC/xIIgoFQqZRpn60V4B5AKEAQBtm0v9dm2TRAEt4pJU2oRuq6LlHLpTyelxHVdgLUxmXfDxkEj9eH5uKzaeg3EM7BbqSSOSrkC5HkgXSYFKIRQ87YmNAXEbeL6H/8sjyY0hY4S2/49/w3Rtu4aUKeIqAAAAABJRU5ErkJggg==';
  
  // Find where to insert — after module 995 (credits icon)
  const m995end = content.indexOf('995:e=>{"use strict"');
  if (m995end !== -1) {
    // Find the end of module 995
    const afterM995 = content.indexOf('"},', m995end);
    if (afterM995 !== -1) {
      const insertAt = afterM995 + 2; // after the '"}'
      content = content.substring(0, insertAt) + ',998:e=>{"use strict";e.exports="' + ieBase64 + '"}' + content.substring(insertAt);
      fs.writeFileSync(FILE, content, 'utf8');
      try {
        execSync('node --check ' + FILE, { encoding: 'utf8' });
        console.log('  ✓ ieIcon module syntax OK');
      } catch (e) {
        console.log('  ✗ ieIcon module broke syntax!');
        console.log(e.stderr ? e.stderr.toString() : e.message);
        process.exit(1);
      }
    }
  }
} else {
  console.log('  - Module 998 already exists');
}

// Step 6: Add ieIcon to the Ge icon map (shortcut name -> module mapping)
console.log('\n=== Step 6: Register ieIcon in Ge icon map ===');
content = fs.readFileSync(FILE, 'utf8');
const geMap = 'lozordleIcon:Oe';
if (content.includes(geMap) && !content.includes('ieIcon:')) {
  // Need to find what variable the require(998) would produce
  // The pattern is: var XX = n(998) — but since we added module 998, we need to import it
  // Actually, the icon imports are like: var Le=n(995) for credits
  // We need to add our import and map entry
  
  // Find the import block: var ... Le=n(995),...
  const leImport = 'Le=n(995)';
  if (content.includes(leImport)) {
    // Add our import right after
    content = content.replace(leImport, leImport + ',Ie2=n(998)');
    // Add to the Ge icon map
    content = content.replace(geMap, geMap + ',ieIcon:Ie2');
    fs.writeFileSync(FILE, content, 'utf8');
    try {
      execSync('node --check ' + FILE, { encoding: 'utf8' });
      console.log('  ✓ Icon map syntax OK');
    } catch (e) {
      console.log('  ✗ Icon map broke syntax!');
      console.log(e.stderr ? e.stderr.toString() : e.message);
      process.exit(1);
    }
  }
} else if (content.includes('ieIcon:')) {
  console.log('  - ieIcon already in Ge map');
} else {
  console.log('  ! Could not find Ge map');
}

// Final verification
console.log('\n=== Final Verification ===');
content = fs.readFileSync(FILE, 'utf8');
try {
  execSync('node --check ' + FILE, { encoding: 'utf8' });
  console.log('✓ ALL CHECKS PASSED - Bundle is syntactically valid');
} catch (e) {
  console.log('✗ FINAL CHECK FAILED');
  console.log(e.stderr ? e.stderr.toString() : e.message);
  process.exit(1);
}

// Verify our changes exist
console.log('\nVerification:');
console.log('  ieBrowser in registry:', content.includes('ieBrowser:{key:"ieBrowser"'));
console.log('  Layout wrapping:', content.includes('86*(t%5)'));
console.log('  ieIcon module:', content.includes('998:e=>{"use strict"'));
console.log('  ieIcon in context:', content.includes('"./ieIcon.png":998'));
console.log('  ieIcon import:', content.includes('Ie2=n(998)'));
console.log('  ieIcon in Ge map:', content.includes('ieIcon:Ie2'));
