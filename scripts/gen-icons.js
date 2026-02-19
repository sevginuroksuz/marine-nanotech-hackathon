const fs = require('fs');

function createSVGIcon(size) {
  const rx = Math.round(size * 0.2);
  const fontSize = Math.round(size * 0.5);
  const cy = Math.round(size * 0.62);
  const cx = Math.round(size / 2);

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
    `  <defs>`,
    `    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">`,
    `      <stop offset="0%" style="stop-color:#0a1628"/>`,
    `      <stop offset="100%" style="stop-color:#071120"/>`,
    `    </linearGradient>`,
    `    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">`,
    `      <stop offset="0%" style="stop-color:#22d3ee"/>`,
    `      <stop offset="100%" style="stop-color:#06b6d4"/>`,
    `    </linearGradient>`,
    `  </defs>`,
    `  <rect width="${size}" height="${size}" rx="${rx}" fill="url(#bg)"/>`,
    `  <text x="${cx}" y="${cy}" text-anchor="middle" font-size="${fontSize}" fill="url(#accent)" font-family="serif">\u2693</text>`,
    `</svg>`,
  ].join('\n');
}

[192, 512, 1024].forEach(size => {
  fs.writeFileSync(`public/icon-${size}.svg`, createSVGIcon(size));
  console.log(`Created icon-${size}.svg`);
});
