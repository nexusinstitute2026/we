const fs = require('fs');
const template = fs.readFileSync('month.html', 'utf8');
const courses = [
  { id: 'al-buddhism-2027', name: 'බුද්ධ ධර්මය 2027 සිද්ධාන්ත' },
  { id: 'al-buddhism-2026', name: 'බුද්ධ ධර්මය 2026 පුනරීක්ෂණ' },
  { id: 'al-buddhism-paper', name: 'බුද්ධ ධර්මය ප්‍රශ්න පත්‍ර' },
  { id: 'al-pali-2027', name: 'පාලි 2027 සිද්ධාන්ත' },
  { id: 'al-pali-2026', name: 'පාලි 2026 පුනරීක්ෂණ' },
  { id: 'al-pali-paper', name: 'පාලි ප්‍රශ්න පත්‍ර' },
  { id: 'al-sanskrit-2027', name: 'සංස්කෘත 2027 සිද්ධාන්ත' },
  { id: 'al-sanskrit-2026', name: 'සංස්කෘත 2026 පුනරීක්ෂණ' },
  { id: 'al-sanskrit-paper', name: 'සංස්කෘත ප්‍රශ්න පත්‍ර' },
  { id: 'al-sinhala-2027', name: 'සිංහල 2027 සිද්ධාන්ත' },
  { id: 'al-sinhala-2026', name: 'සිංහල 2026 පුනරීක්ෂණ' },
  { id: 'al-sinhala-paper', name: 'සිංහල ප්‍රශ්න පත්‍ර' },
  { id: 'prachina-prarambha-pali', name: 'ප්‍රාරම්භ පාලි' },
  { id: 'prachina-prarambha-sanskrit', name: 'ප්‍රාරම්භ සංස්කෘත' },
  { id: 'prachina-prarambha-sinhala', name: 'ප්‍රාරම්භ සිංහල' },
  { id: 'prachina-madya-pali', name: 'මධ්‍ය පාලි' },
  { id: 'prachina-madya-sanskrit', name: 'මධ්‍ය සංස්කෘත' },
  { id: 'prachina-madya-sinhala', name: 'මධ්‍ය සිංහල' },
  { id: 'prachina-awasana-pali', name: 'අවසාන පාලි' },
  { id: 'prachina-awasana-sanskrit', name: 'අවසාන සංස්කෘත' },
  { id: 'prachina-awasana-sinhala', name: 'අවසාන සිංහල' }
];

courses.forEach(c => {
  let newContent = template
    .replace(/<title>Sanskrit Revision 2026<\/title>/, `<title>${c.name}</title>`)
    .replace(/<h1>සංස්කෘත අධිපුණරීක්ෂණ 2026<\/h1>/, `<h1>${c.name}</h1>`);
  fs.writeFileSync(`pages/${c.id}.html`, newContent);
});
console.log('Files created.');
