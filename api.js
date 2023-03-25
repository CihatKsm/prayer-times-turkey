const { default: axios } = require("axios");


module.exports = async (data) => {
    if (!data?.place && !data?.plate) return '⚠️ The feature of seeing all provinces is not active at the moment.'
    let places = require('./places').map(m => { return { name: nameFix(m.name), plate: m.plate } })
    if (data?.place) places = places.filter(f => f.name == nameFix(data.place))
    if (!data?.place && data?.plate) places = places.filter(f => f.plate == data?.plate)
    let datas = []
    if (places.length == 0) return data?.place ? null : [];

    for (let _place of places) {
        const place = require('./places').find(f => f.plate == _place.plate)
        const api = await axios({ method: 'get', url: getURL(_place.name) }).catch((e) => null)
        const times = getTimes(api?.data)
        datas.push({ place, times })
    }

    if (data?.place || data?.plate) return datas[0];
    return datas;
};

function nameFix(name) {
    return name.toLowerCase()
        .replaceAll(`i̇`, 'i').replaceAll('i', 'i').replaceAll('ı', 'i').replaceAll('ğ', 'g')
        .replaceAll('ü', 'u').replaceAll('ş', 's').replaceAll('ö', 'o').replaceAll('ç', 'c')
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

function getURL(place) {
    return `https://www.sabah.com.tr/${place}-namaz-vakitleri`
}