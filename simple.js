const prayer = require('./prayer')
const date = () => new Date()

console.log(date(), 'System opened!')

setTimeout(async () => {
    const information = await prayer.times({ plate: '23' })
    console.log(information)

    //await testPlaces();
    //await testPlates();
}, 1000);

async function testPlaces() {
    console.log(date(), 'Places test started!');
    let bugs = [];
    const places = require('./places');
    for (let place of places.map(m => m.name)) {
        const prayerInfo = await prayer.times({ place });
        if (!prayerInfo) bugs.push({ searced: place, found: prayerInfo })
    }
    console.log(bugs)
}

async function testPlates() {
    console.log(date(), 'Plates test started!');
    let bugs = [];
    const places = require('./places');
    for (let plate of places.map(m => m.plate)) {
        const prayerInfo = await prayer.times({ plate });
        if (!prayerInfo) bugs.push({ searced: plate, found: prayerInfo })
    }
    console.log(bugs)
}