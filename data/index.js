const fs = require('fs');
const cheerio = require('cheerio');

fs.readFile('./data.html', 'utf8', dataLoaded);

function dataLoaded(err, data) {
    let output = '';
    const $ = cheerio.load(data);
    $('.cue').each((i, element) => {
        const startAt = $(element).attr('start-offset') / 1000;
        const text = $(element).text().trim();
        output += `
        {
            startAt: ${startAt},
            source: "${text}",
        },
        `;
    });
    output = `
    [
        ${output}
    ]
    `;
    fs.writeFile('./output.txt', output, () => {
        console.log('Done.');
    });
};