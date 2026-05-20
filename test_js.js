const html = require('fs').readFileSync('public/index.html', 'utf8');
const match = html.match(/<script>([\s\S]*?)<\/script>/g);
if (match) {
  console.log('Found', match.length, 'script blocks');
  match.forEach((m, i) => {
    console.log(`Script ${i+1}: ${m.length} chars`);
  });
}
console.log('Total HTML length:', html.length);