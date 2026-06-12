const fs = require('fs');
const THREE = require('three');
const { GLTFLoader } = require('three/examples/jsm/loaders/GLTFLoader.js');
const { JSDOM } = require('jsdom');

// We need a DOM for GLTFLoader to work in Node
const { window } = new JSDOM();
global.window = window;
global.document = window.document;
global.self = window;
global.Blob = window.Blob;
global.URL = window.URL;

async function run() {
  // Wait, GLTFLoader in Node is notoriously difficult because it relies on fetch and DOM images.
  // Instead, I'll just write the raycaster directly into `sad-office-room.tsx` and use a `console.log`
  // Actually, I can just let the app run it in the browser!
}
