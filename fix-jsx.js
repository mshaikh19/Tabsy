const fs = require('fs');
const content = fs.readFileSync('D:\\Tabsy\\frontend\\src\\pages\\GroupMembers.jsx', 'utf8');
const idx = content.indexOf('Notify on Large Debts');
if (idx >= 0) {
  // The string is 'Notify on Large Debts (> > ₹150)'
  // Need to fix it to 'Notify on Large Debts (> ₹150)'
  // Replace '> >' with '>'
  const fixed = content.replace('Notify on Large Debts (> > ₹150)', 'Notify on Large Debts (> ₹150)');
  fs.writeFileSync('D:\\Tabsy\\frontend\\src\\pages\\GroupMembers.jsx', fixed, 'utf8');
  console.log('Done');
}