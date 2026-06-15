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

console.log('IE block found: start=' + start + ' end=' + end + ' length=' + (end - start));

// Clean IE component using React.createElement (no JSX, no Ce.jsx, guaranteed syntax)
// Uses React.useState via the outer closure variable 'e' (same as credits component)
const newIE =
'ieBrowser:{key:"ieBrowser",name:"Internet Explorer",shortcutIcon:"ieIcon",' +
'component:function(t){' +
  'var su=e.useState("adjureee.github.io/LozPortfolio"),urlV=su[0],setUrlV=su[1];' +
  'var so=e.useState("https://adjureee.github.io/LozPortfolio"),srcV=so[0],setSrcV=so[1];' +
  'var se=e.useState(false),errV=se[0],setErrV=se[1];' +
  'function go(){' +
    'var v=urlV.trim();' +
    'if(!v)return;' +
    'if(v.indexOf("http")!==0)v="https://"+v;' +
    'setErrV(false);setSrcV(v);setUrlV(v);' +
  '}' +
  'return(0,Ce.jsx)(Sl,{' +
    'top:30,left:80,width:900,height:600,' +
    'windowBarIcon:"windowExplorerIcon",' +
    'windowTitle:"Internet Explorer",' +
    'closeWindow:t.onClose,' +
    'onInteract:t.onInteract,' +
    'minimizeWindow:t.onMinimize,' +
    'bottomLeftText:errV?"Cannot display page":"Done",' +
    'children:' +
      '(0,Ce.jsx)("div",{className:"site-page",style:{flexDirection:"column"},' +
        'children:' +
          '(0,Ce.jsx)("div",{style:{display:"flex",flexDirection:"column",width:"100%",height:"100%"},' +
            'children:[' +
              '(0,Ce.jsx)("div",{' +
                'style:{display:"flex",alignItems:"center",gap:"4px",padding:"3px 4px",' +
                       'background:"#d4d0c8",borderBottom:"2px solid #808080",flexShrink:0},' +
                'children:[' +
                  '(0,Ce.jsx)("span",{style:{fontSize:"13px",whiteSpace:"nowrap"},children:"Address:"}),' +
                  '(0,Ce.jsx)("input",{' +
                    'value:urlV,' +
                    'onChange:function(ev){setUrlV(ev.target.value);},' +
                    'onKeyDown:function(ev){if(ev.key==="Enter")go();},' +
                    'style:{flex:1,fontSize:"13px",padding:"1px 4px"},' +
                    'spellCheck:false' +
                  '}),' +
                  '(0,Ce.jsx)("button",{' +
                    'onClick:go,' +
                    'className:"site-button",' +
                    'style:{padding:"2px 10px",fontSize:"13px",flexShrink:0},' +
                    'children:"Go"' +
                  '})' +
                ']' +
              '}),' +
              'errV' +
                '?(0,Ce.jsx)("div",{' +
                    'style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",' +
                           'justifyContent:"center",background:"white",padding:"40px",textAlign:"center"},' +
                    'children:[' +
                      '(0,Ce.jsx)("h2",{style:{color:"#aa0000"},children:"The page cannot be displayed"}),' +
                      '(0,Ce.jsx)("p",{children:"This page is unavailable or is blocking iframe embedding."}),' +
                      '(0,Ce.jsx)("p",{style:{color:"#666",fontSize:"13px"},children:"Note: Sites like Google and YouTube block iframes for security reasons."})' +
                    ']' +
                  '})' +
                ':(0,Ce.jsx)("iframe",{' +
                    'key:srcV,' +
                    'src:srcV,' +
                    'style:{flex:1,width:"100%",border:"none"},' +
                    'title:"IE",' +
                    'onError:function(){setErrV(true);}' +
                  '})' +
            ']' +
          '})' +
        '})' +
    '})' +
'}}';

content = content.substring(0, start) + newIE + content.substring(end);
fs.writeFileSync(bundlePath, content, 'utf8');

// Verify
const v = fs.readFileSync(bundlePath, 'utf8');
const vIdx = v.indexOf('ieBrowser:{key:"ieBrowser"');
console.log('Verification: IE re-inserted at index', vIdx);
console.log('First 300 chars of new block:');
console.log(v.substring(vIdx, vIdx + 300));
console.log('\nDone!');
