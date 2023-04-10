const { default: axios } = require("axios");
const cheerio = require('cheerio');

module.exports = async (data) => {
    const places = require('./places').map(m => { return { name: m.name.toLowerCase(), plate: m.plate } });
    let place;
    if (!data?.place && !data?.plate) return null;
    if (data?.plate) place = places.find(f => f.plate == data?.plate);
    if (data?.place) place = places.find(f => f.name == data?.place?.toLowerCase());
    if (!place) return null;

    const response = await axios({ method: 'get', url: "https://haber.com/namaz-vakitleri" }).catch((e) => null);
    const $ = cheerio.load(response.data);
    let datas = [];

    $('tr').slice(1).each((i, e) => {
        const text = (x) => $(e).find('td').eq(x).text();
        datas.push({
            place: { name: text(0), plate: require('./places').find(f => f.name == text(0))?.plate },
            times: [
                { name: 'İmsak', time: text(1) },
                { name: 'Güneş', time: text(2) },
                { name: 'Öğle', time: text(3) },
                { name: 'İkindi', time: text(4) },
                { name: 'Akşam', time: text(5) },
                { name: 'Yatsı', time: text(6) },
            ],
            remainingTimes: [
                { name: 'İftar', time: iftarTime(text(1), text(5)) },
                { name: 'Sahur', time: sahurTime(text(1), text(5)) },
            ]
        })
    })
    
    return datas.find(f => f.place.plate == place.plate)
}

const minute = (x) => x.split(':').map(m => Number(m)).reduce((a, b) => a * 60 + b);
const rtc = (x) => x < 0 ? true : (Math.floor(x / 60) > 0 ? Math.floor(x / 60) + ' saat ' : '') + x % 60 + ' dakika kaldı.';

function iftarTime(imsak, aksam) {
    const iftarStatus = minute(now()) > minute(imsak) ? rtc(minute(aksam) - minute(now())) : true;
    return iftarStatus ? iftarStatus : true;
}

function sahurTime(imsak, aksam) {
    const sahurStatus = minute(now()) > minute(aksam) || minute(now()) < minute(imsak) ?
        minute(imsak) - minute(now()) > 0 ? rtc(minute(imsak) - minute(now())) :
            rtc(((24 * 60) - minute(now())) + minute(imsak)) : false;
    return sahurStatus ? sahurStatus : false;
}

function now() {
    const formatter = new Intl.DateTimeFormat("tr", { dateStyle: "short", timeStyle: "medium", timeZone: 'Europe/Istanbul' });
    return formatter.format(new Date()).split(' ')[1].split(':').slice(0, 2).join(':');
}