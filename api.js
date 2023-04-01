const { default: axios } = require("axios");
const url = (place) => `https://www.sabah.com.tr/${place}-namaz-vakitleri`;

module.exports = async (data) => {
    if (!data?.place && !data?.plate) return null;
    let _place;
    const places = require('./places').map(m => { return { name: nameFix(m.name), plate: m.plate } });
    if (data?.plate) _place = places.find(f => f.plate == data?.plate);
    if (data?.place) _place = places.find(f => f.name == nameFix(data.place));
    if (!_place) return null;

    const place = require('./places').find(f => f.plate == _place.plate);
    const api = await axios({ method: 'get', url: url(_place.name) }).catch((e) => null);
    const times = getTimes(api?.data);
    const fTime = (name) => times.find(f => f.name == name).time;

    const minute = (x) => x.split(':').map(m => Number(m)).reduce((a, b) => a * 60 + b)
    const rtc = (x) => x < 0 ? true : (Math.floor(x / 60) > 0 ? Math.floor(x / 60) + ' saat ' : '') + x % 60 + ' dakika kaldı.'

    const iftarStatus = minute(now()) > minute(fTime('İmsak')) ? rtc(minute(fTime('Akşam')) - minute(now())) : true;

    const sahurStatus = minute(now()) > minute(fTime('Akşam')) || minute(now()) < minute(fTime('İmsak')) ?
        minute(fTime('İmsak')) - minute(now()) > 0 ?
            rtc(minute(fTime('İmsak')) - minute(now())) :
            rtc(((24 * 60) - minute(now())) + minute(fTime('İmsak'))) : false;

    const iftar = { name: 'İftar', time: iftarStatus ? iftarStatus : true }
    const sahur = { name: 'Sahur', time: sahurStatus ? sahurStatus : false }
    const remainingTimes = [iftar, sahur]
    return { place, times, remainingTimes };
};

function nameFix(_name) {
    let name = String(_name)?.toLowerCase() || null;
    const fixs = [['i̇', 'i'], ['ı', 'i'], ['ğ', 'g'], ['ü', 'u'], ['ş', 's'], ['ö', 'o'], ['ç', 'c']]
    for (let fix of fixs) name = name?.replaceAll(fix[0], fix[1])
    return name;
}

function getTimes(_datas) {
    const x = '<div class="vakitler boxShadowSet">', y = '</div>'
    const datas = _datas?.slice(_datas.indexOf(x) + x.length)
    const _data = datas?.slice(0, datas.indexOf(y))
    const data = _data.split('\r\n').filter(f => f.includes('<strong>') || f.includes('<span>')).map(m => m.trim()).join('')
    const times = data.split('</span><strong>')
        .map(m => m.replace('<strong>', '').replace('</strong>', ' ').replace('<span>', '').replace('</span>', '').trim())
        .map(m => { return { name: m.split(' ')[0], time: m.split(' ')[1] } })
    return times;
}

function now() {
    const input = new Date();
    const formatter = new Intl.DateTimeFormat("tr", { dateStyle: "short", timeStyle: "medium", timeZone: 'Europe/Istanbul' });
    const formated = formatter.format(input).split(' ')[1].split(':').slice(0, 2).join(':')
    return formated;
}