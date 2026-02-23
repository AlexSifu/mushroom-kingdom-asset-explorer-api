/**
 * Generate 64×64 8-bit style PNG sprites (no external deps, Node built-in fs + zlib).
 * Run: node scripts/generate-sprites.js
 * Output: public/assets/sprites/s1.png .. s6.png
 */

const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const W = 64;
const H = 64;
const OUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'sprites');

// CRC32 for PNG (polynomial 0xedb88320)
function crc32(buf) {
  let c = 0xffffffff;
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let t = n;
    for (let k = 0; k < 8; k++) t = (t & 1) ? (0xedb88320 ^ (t >>> 1)) : (t >>> 1);
    table[n] = t;
  }
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function writeChunk(out, type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const combined = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(combined), 0);
  out.push(len, combined, crc);
}

function encodePNG(pixels) {
  // pixels: Uint8Array of size W*H*4 (RGBA), row-major
  const rows = [];
  for (let y = 0; y < H; y++) {
    rows.push(0); // filter byte 0 (None)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      rows.push(pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]);
    }
  }
  const raw = Buffer.from(rows);
  const compressed = zlib.deflateSync(raw, { level: 9 });

  const out = [];
  out.push(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr.writeUInt8(8, 8);   // bit depth
  ihdr.writeUInt8(6, 9);   // color type RGBA
  ihdr.writeUInt8(0, 10);  // compression
  ihdr.writeUInt8(0, 11);  // filter
  ihdr.writeUInt8(0, 12);  // interlace
  writeChunk(out, 'IHDR', ihdr);
  writeChunk(out, 'IDAT', compressed);
  writeChunk(out, 'IEND', Buffer.alloc(0));

  return Buffer.concat(out);
}

function fillRect(pixels, x0, y0, w, h, r, g, b, a = 255) {
  for (let y = y0; y < y0 + h && y < H; y++) {
    for (let x = x0; x < x0 + w && x < W; x++) {
      const i = (y * W + x) * 4;
      pixels[i] = r;
      pixels[i + 1] = g;
      pixels[i + 2] = b;
      pixels[i + 3] = a;
    }
  }
}

function block(pixels, bx, by, r, g, b) {
  const bs = 8;
  fillRect(pixels, bx * bs, by * bs, bs, bs, r, g, b);
}

// Clear to transparent
function clear(pixels) {
  pixels.fill(0);
}

// --- Sprites (8x8 block grid on 64x64) ---

function sprite1MarioIdle(pixels) {
  clear(pixels);
  // Red cap
  for (let by = 0; by < 3; by++) {
    block(pixels, 2, by, 0xc0, 0x40, 0x40);
    block(pixels, 3, by, 0xc0, 0x40, 0x40);
    block(pixels, 4, by, 0xc0, 0x40, 0x40);
  }
  // Face (skin)
  block(pixels, 2, 3, 0xff, 0xdb, 0xac);
  block(pixels, 3, 3, 0xff, 0xdb, 0xac);
  block(pixels, 4, 3, 0xff, 0xdb, 0xac);
  block(pixels, 3, 4, 0xff, 0xdb, 0xac);
  // Body (blue overalls)
  block(pixels, 2, 5, 0x40, 0x60, 0xc0);
  block(pixels, 3, 5, 0x40, 0x60, 0xc0);
  block(pixels, 4, 5, 0x40, 0x60, 0xc0);
  block(pixels, 3, 6, 0x40, 0x60, 0xc0);
  // Legs
  block(pixels, 2, 7, 0x40, 0x40, 0x80);
  block(pixels, 4, 7, 0x40, 0x40, 0x80);
}

function sprite2Coin(pixels) {
  clear(pixels);
  // Gold circle (approximate with blocks)
  const cx = 4, cy = 4;
  for (let by = 1; by < 7; by++) {
    for (let bx = 1; bx < 7; bx++) {
      const dx = (bx * 8 + 4) - (cx * 8 + 4);
      const dy = (by * 8 + 4) - (cy * 8 + 4);
      if (dx * dx + dy * dy < 22 * 22) block(pixels, bx, by, 0xff, 0xd7, 0x00);
    }
  }
  // Highlight
  block(pixels, 3, 2, 0xff, 0xec, 0x80);
}

function sprite3Brick(pixels) {
  clear(pixels);
  // Brick red
  for (let by = 0; by < 8; by++) {
    for (let bx = 0; bx < 8; bx++) {
      block(pixels, bx, by, 0xc0, 0x40, 0x40);
    }
  }
  // Mortar lines (darker)
  for (let i = 1; i < 8; i++) {
    fillRect(pixels, 0, i * 8, W, 1, 0x8b, 0x28, 0x28);
    fillRect(pixels, i * 8, 0, 1, H, 0x8b, 0x28, 0x28);
  }
}

function sprite4Goomba(pixels) {
  clear(pixels);
  // Brown body (blob)
  block(pixels, 1, 4, 0x65, 0x43, 0x21);
  block(pixels, 2, 4, 0x65, 0x43, 0x21);
  block(pixels, 3, 4, 0x65, 0x43, 0x21);
  block(pixels, 4, 4, 0x65, 0x43, 0x21);
  block(pixels, 5, 4, 0x65, 0x43, 0x21);
  block(pixels, 2, 5, 0x65, 0x43, 0x21);
  block(pixels, 3, 5, 0x65, 0x43, 0x21);
  block(pixels, 4, 5, 0x65, 0x43, 0x21);
  block(pixels, 3, 6, 0x65, 0x43, 0x21);
  // Eyes white
  block(pixels, 2, 3, 0xff, 0xff, 0xff);
  block(pixels, 4, 3, 0xff, 0xff, 0xff);
  // Pupils
  block(pixels, 2, 4, 0x20, 0x20, 0x20);
  block(pixels, 4, 4, 0x20, 0x20, 0x20);
}

function sprite5Cloud(pixels) {
  clear(pixels);
  // Light gray cloud shapes
  const c = [0xc0, 0xc0, 0xc0];
  const w = [0xe8, 0xe8, 0xe8];
  block(pixels, 1, 2, ...w);
  block(pixels, 2, 2, ...c);
  block(pixels, 3, 2, ...c);
  block(pixels, 4, 2, ...c);
  block(pixels, 5, 2, ...w);
  block(pixels, 0, 3, ...w);
  block(pixels, 1, 3, ...c);
  block(pixels, 2, 3, ...c);
  block(pixels, 3, 3, ...c);
  block(pixels, 4, 3, ...c);
  block(pixels, 5, 3, ...w);
  block(pixels, 6, 3, ...w);
  block(pixels, 1, 4, ...c);
  block(pixels, 2, 4, ...c);
  block(pixels, 3, 4, ...c);
  block(pixels, 4, 4, ...c);
}

function sprite6Mushroom(pixels) {
  clear(pixels);
  // Red cap
  block(pixels, 1, 0, 0xc0, 0x40, 0x40);
  block(pixels, 2, 0, 0xc0, 0x40, 0x40);
  block(pixels, 3, 0, 0xc0, 0x40, 0x40);
  block(pixels, 4, 0, 0xc0, 0x40, 0x40);
  block(pixels, 5, 0, 0xc0, 0x40, 0x40);
  block(pixels, 0, 1, 0xc0, 0x40, 0x40);
  block(pixels, 1, 1, 0xc0, 0x40, 0x40);
  block(pixels, 2, 1, 0xc0, 0x40, 0x40);
  block(pixels, 3, 1, 0xc0, 0x40, 0x40);
  block(pixels, 4, 1, 0xc0, 0x40, 0x40);
  block(pixels, 5, 1, 0xc0, 0x40, 0x40);
  block(pixels, 6, 1, 0xc0, 0x40, 0x40);
  block(pixels, 1, 2, 0xc0, 0x40, 0x40);
  block(pixels, 2, 2, 0xc0, 0x40, 0x40);
  block(pixels, 3, 2, 0xc0, 0x40, 0x40);
  block(pixels, 4, 2, 0xc0, 0x40, 0x40);
  block(pixels, 5, 2, 0xc0, 0x40, 0x40);
  // White spots
  block(pixels, 2, 1, 0xff, 0xff, 0xff);
  block(pixels, 4, 1, 0xff, 0xff, 0xff);
  block(pixels, 3, 2, 0xff, 0xff, 0xff);
  // White stem
  block(pixels, 2, 3, 0xff, 0xff, 0xff);
  block(pixels, 3, 3, 0xff, 0xff, 0xff);
  block(pixels, 4, 3, 0xff, 0xff, 0xff);
  block(pixels, 2, 4, 0xff, 0xff, 0xff);
  block(pixels, 3, 4, 0xff, 0xff, 0xff);
  block(pixels, 4, 4, 0xff, 0xff, 0xff);
  block(pixels, 3, 5, 0xff, 0xff, 0xff);
}

const sprites = [
  { name: 's1', fn: sprite1MarioIdle },
  { name: 's2', fn: sprite2Coin },
  { name: 's3', fn: sprite3Brick },
  { name: 's4', fn: sprite4Goomba },
  { name: 's5', fn: sprite5Cloud },
  { name: 's6', fn: sprite6Mushroom },
];

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

for (const s of sprites) {
  const pixels = new Uint8Array(W * H * 4);
  s.fn(pixels);
  const png = encodePNG(pixels);
  const outPath = path.join(OUT_DIR, `${s.name}.png`);
  fs.writeFileSync(outPath, png);
  console.log('Written:', outPath);
}

console.log('Done. Sprites 64x64 saved to public/assets/sprites/');
