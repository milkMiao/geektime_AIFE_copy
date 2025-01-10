const fs = require('fs');
const xml2js = require('xml2js');

const parser = new xml2js.Parser();
const xmlData = fs.readFileSync('3-10test.xml', 'utf8');

parser.parseString(xmlData, (err, result) => {
    if (err) {
        console.error('Error:', err);
        return;
    }
    console.log(result);
}); 