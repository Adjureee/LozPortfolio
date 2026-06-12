const fs = require('fs');
const file = 'public/monitor-os/static/js/main.fe030160.js';
let code = fs.readFileSync(file, 'utf8');

const searchStr = `bottomLeftText:"© Copyright 2022 John Lyold Lozada",children:(0,Ce.jsx)(ve,{children:(0,Ce.jsxs)("div",{className:"site-page",children:[(0,Ce.jsx)(Gl,{}),(0,Ce.jsxs)(he,{children:[(0,Ce.jsx)(fe,{path:"/",element:(0,Ce.jsx)(ml,{})}),(0,Ce.jsx)(fe,{path:"/about",element:(0,Ce.jsx)(bl,{})}),(0,Ce.jsx)(fe,{path:"/experience",element:(0,Ce.jsx)(Bl,{})}),(0,Ce.jsx)(fe,{path:"/projects",element:(0,Ce.jsx)(Dl,{})}),(0,Ce.jsx)(fe,{path:"/contact",element:(0,Ce.jsx)(Ol,{})}),(0,Ce.jsx)(fe,{path:"/projects/software",element:(0,Ce.jsx)(Ul,{})}),(0,Ce.jsx)(fe,{path:"/projects/music",element:(0,Ce.jsx)(Vl,{})}),(0,Ce.jsx)(fe,{path:"/projects/art",element:(0,Ce.jsx)(Ql,{})})]})]})})})`;

const replaceStr = `bottomLeftText:"© Copyright 2026 John Lyold Lozada",children:(0,Ce.jsx)("iframe",{src:"/os-showcase",style:{width:"100%",height:"100%",border:"none"}})})`;

if (code.includes(searchStr)) {
    code = code.replace(searchStr, replaceStr);
    fs.writeFileSync(file, code);
    console.log("Success! File patched.");
} else {
    console.log("Search string not found!");
}
