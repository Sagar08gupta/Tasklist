import fs from 'fs';
const text = fs.readFileSync('edit.html', 'utf8');
const regex = /\["([^"]+)",[0-9]+,[0-9]+,[0-9]+,[0-9]+,[0-9]+,[0-9]+,[0-9]+/g;
let match;
while ((match = regex.exec(text)) !== null) {
  console.log(match[1]);
}
// Try another regex
const regex2 = /\\"name\\":\\"([^"]+)\\"/g;
let match2;
while ((match2 = regex2.exec(text)) !== null) {
  console.log('regex2', match2[1]);
}

const regex3 = /"name":"([^"]+)"/g;
let match3;
while ((match3 = regex3.exec(text)) !== null) {
  console.log('regex3', match3[1]);
}

