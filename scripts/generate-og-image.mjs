#!/usr/bin/env node
/** Generate the 1200×630 social preview without native image dependencies. */
import { writeFile } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';

const WIDTH = 1200;
const HEIGHT = 630;
const pixels = Buffer.alloc(WIDTH * HEIGHT * 4);

const FONT = {
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10111', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  J: ['00111', '00010', '00010', '00010', '10010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
  0: ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  1: ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  2: ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  3: ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  4: ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  5: ['11111', '10000', '10000', '11110', '00001', '00001', '11110'],
  6: ['01110', '10000', '10000', '11110', '10001', '10001', '01110'],
  7: ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  8: ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  9: ['01110', '10001', '10001', '01111', '00001', '00001', '01110'],
  '.': ['00000', '00000', '00000', '00000', '00000', '00110', '00110'],
  ':': ['00000', '00110', '00110', '00000', '00110', '00110', '00000'],
  '/': ['00001', '00010', '00010', '00100', '01000', '01000', '10000'],
  '&': ['01100', '10010', '10100', '01000', '10101', '10010', '01101'],
  '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000']
};

const rgb = (hex) => {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255, 255];
};

function setPixel(x, y, color) {
  if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return;
  const i = (Math.floor(y) * WIDTH + Math.floor(x)) * 4;
  pixels[i] = color[0];
  pixels[i + 1] = color[1];
  pixels[i + 2] = color[2];
  pixels[i + 3] = color[3];
}

function fillRect(x, y, width, height, color) {
  for (let py = y; py < y + height; py += 1) {
    for (let px = x; px < x + width; px += 1) setPixel(px, py, color);
  }
}

function line(x0, y0, x1, y1, color, thickness = 1) {
  const dx = Math.abs(x1 - x0);
  const sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0);
  const sy = y0 < y1 ? 1 : -1;
  let error = dx + dy;
  while (true) {
    fillRect(x0 - Math.floor(thickness / 2), y0 - Math.floor(thickness / 2), thickness, thickness, color);
    if (x0 === x1 && y0 === y1) break;
    const twice = 2 * error;
    if (twice >= dy) {
      error += dy;
      x0 += sx;
    }
    if (twice <= dx) {
      error += dx;
      y0 += sy;
    }
  }
}

function rectangle(x, y, width, height, color, thickness = 1) {
  line(x, y, x + width, y, color, thickness);
  line(x + width, y, x + width, y + height, color, thickness);
  line(x + width, y + height, x, y + height, color, thickness);
  line(x, y + height, x, y, color, thickness);
}

function ellipse(cx, cy, rx, ry, color, thickness = 1) {
  let previous;
  for (let degree = 0; degree <= 360; degree += 0.25) {
    const angle = (degree * Math.PI) / 180;
    const point = [Math.round(cx + rx * Math.cos(angle)), Math.round(cy + ry * Math.sin(angle))];
    if (previous) line(previous[0], previous[1], point[0], point[1], color, thickness);
    previous = point;
  }
}

function text(value, x, y, scale, color) {
  let cursor = x;
  for (const character of value.toUpperCase()) {
    const glyph = FONT[character] ?? FONT[' '];
    glyph.forEach((row, rowIndex) => {
      [...row].forEach((bit, columnIndex) => {
        if (bit === '1') fillRect(cursor + columnIndex * scale, y + rowIndex * scale, scale, scale, color);
      });
    });
    cursor += 6 * scale;
  }
}

function textWidth(value, scale) {
  return value.length * 6 * scale - scale;
}

function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, checksum]);
}

const colors = {
  background: rgb('#04060a'),
  grid: rgb('#0a1720'),
  border: rgb('#173141'),
  panel: rgb('#08141d'),
  cyan: rgb('#00e5f4'),
  cyanSoft: rgb('#67e8f9'),
  cyanDark: rgb('#00aeba'),
  red: rgb('#ff0055'),
  white: rgb('#f8fafc'),
  body: rgb('#a5b4c7'),
  muted: rgb('#94a3b8')
};

fillRect(0, 0, WIDTH, HEIGHT, colors.background);
for (let x = 0; x < WIDTH; x += 40) line(x, 0, x, HEIGHT - 1, colors.grid);
for (let y = 0; y < HEIGHT; y += 40) line(0, y, WIDTH - 1, y, colors.grid);
rectangle(24, 24, 1151, 581, colors.border, 2);
line(24, 82, 1175, 82, colors.border, 2);

text('PARADIGM-OS // RECOVERED ARCHIVE', 52, 45, 2, colors.cyanSoft);
const status = 'PUBLIC ACCESS // EST. 1971';
text(status, 1148 - textWidth(status, 2), 45, 2, colors.muted);

ellipse(184, 284, 112, 112, colors.cyan, 7);
line(72, 284, 296, 284, colors.cyanDark, 4);
ellipse(184, 284, 45, 112, colors.cyanDark, 4);
ellipse(184, 284, 20, 20, colors.red, 20);
ellipse(184, 284, 137, 137, colors.border, 2);

text('GLOBAL', 360, 171, 7, colors.white);
text('PARADIGMS CORP.', 360, 237, 7, colors.white);
line(360, 311, 1114, 311, colors.cyan, 4);
text('SECURE ARCHIVE & INTELLIGENCE REPOSITORY', 360, 341, 3, colors.cyanSoft);
text('ORIGINAL INTERACTIVE FICTION // 412 RECORDS', 360, 396, 2, colors.body);
text('SEVEN CRYPTOGRAPHIC SEALS // ONE BURIED SIGNAL', 360, 429, 2, colors.body);

fillRect(52, 530, 1096, 38, colors.panel);
rectangle(52, 530, 1095, 37, colors.border);
text('AN ORIGINAL WORK BY ZAZIE PRODUCTIONS', 70, 542, 2, colors.white);
const url = 'GLOBALPARADIGMSCORP.COM';
text(url, 1130 - textWidth(url, 2), 542, 2, colors.cyan);

const scanlines = Buffer.alloc(HEIGHT * (WIDTH * 4 + 1));
for (let y = 0; y < HEIGHT; y += 1) {
  const rowStart = y * (WIDTH * 4 + 1);
  scanlines[rowStart] = 0;
  pixels.copy(scanlines, rowStart + 1, y * WIDTH * 4, (y + 1) * WIDTH * 4);
}
const header = Buffer.alloc(13);
header.writeUInt32BE(WIDTH, 0);
header.writeUInt32BE(HEIGHT, 4);
header[8] = 8;
header[9] = 6;
const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', header),
  chunk('IDAT', deflateSync(scanlines, { level: 9 })),
  chunk('IEND', Buffer.alloc(0))
]);
await writeFile('public/og-image.png', png);
console.log(`[seo] wrote public/og-image.png (${png.length} bytes)`);
