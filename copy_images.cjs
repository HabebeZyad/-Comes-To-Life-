const fs = require('fs');
const path = require('path');

const sourceDir = "C:\\Users\\GEDO STORE\\.gemini\\antigravity\\brain\\cd7a9aa2-8ed1-4b8c-94d2-d5df7de6a7fa";
const destDir = path.join(__dirname, 'src', 'assets', 'games');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir);

files.forEach(f => {
  if (f.endsWith('.png')) {
    if (f.includes('ramses_ii_real_bg')) {
      fs.copyFileSync(path.join(sourceDir, f), path.join(destDir, 'ramses_ii_bg.png'));
    } else if (f.includes('imhotep_real_bg')) {
      fs.copyFileSync(path.join(sourceDir, f), path.join(destDir, 'imhotep_vizier_bg.png'));
    } else if (f.includes('sinuhe_real_bg')) {
      fs.copyFileSync(path.join(sourceDir, f), path.join(destDir, 'sinuhe_figure_bg.png'));
    } else if (f.includes('djoser_real_bg')) {
      fs.copyFileSync(path.join(sourceDir, f), path.join(destDir, 'djoser_real_bg.png'));
    } else if (f.includes('khufu_real_bg')) {
      fs.copyFileSync(path.join(sourceDir, f), path.join(destDir, 'khufu_real_bg.png'));
    } else if (f.includes('hatshepsut_real_bg')) {
      fs.copyFileSync(path.join(sourceDir, f), path.join(destDir, 'hatshepsut_real_bg.png'));
    } else if (f.includes('akhenaten_real_bg')) {
      fs.copyFileSync(path.join(sourceDir, f), path.join(destDir, 'akhenaten_real_bg.png'));
    }
  }
});

console.log("Real images copied successfully!");
