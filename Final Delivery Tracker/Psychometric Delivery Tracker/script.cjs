const fs = require('fs');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const path = dir + '/' + file;
    if (fs.statSync(path).isDirectory()) {
      replaceInDir(path);
    } else if (path.endsWith('.tsx') || path.endsWith('.ts')) {
      let content = fs.readFileSync(path, 'utf8');
      content = content.replace(/emerald-500/g, 'mettl-green');
      content = content.replace(/indigo-600/g, 'mettl-blue');
      content = content.replace(/indigo-50/g, 'mettl-blue-light');
      content = content.replace(/emerald-50/g, 'mettl-green-light');
      content = content.replace(/bg-slate-900 text-white sticky/g, 'bg-mettl-gradient text-white sticky');
      content = content.replace(/bg-slate-900 text-white p-10/g, 'bg-mettl-gradient text-white p-10');
      content = content.replace(/border-indigo-500/g, 'border-mettl-purple');
      content = content.replace(/text-indigo-500/g, 'text-mettl-purple');
      fs.writeFileSync(path, content);
    }
  }
}

replaceInDir('src');
