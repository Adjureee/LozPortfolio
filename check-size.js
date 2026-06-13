const fs = require('fs');

const glb = fs.readFileSync('public/commodore_64__computer_full_pack.glb');
const jsonChunkLength = glb.readUInt32LE(12);
const jsonChunk = glb.subarray(20, 20 + jsonChunkLength).toString('utf8');
const gltf = JSON.parse(jsonChunk);

const object19Node = gltf.nodes.find(n => n.name === 'Object_19');
console.log('Object_19 node:', object19Node);

const meshId = object19Node.mesh;
const mesh = gltf.meshes[meshId];

const primitive = mesh.primitives[0];
const positionAccessorId = primitive.attributes.POSITION;
const accessor = gltf.accessors[positionAccessorId];

console.log('Screen Bounding Box:');
console.log('MIN:', accessor.min);
console.log('MAX:', accessor.max);

const width = accessor.max[0] - accessor.min[0];
const height = accessor.max[1] - accessor.min[1];
const depth = accessor.max[2] - accessor.min[2];

console.log('Size:', { width, height, depth });
