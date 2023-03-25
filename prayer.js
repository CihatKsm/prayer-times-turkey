const { default: axios } = require('axios');
const api = require('./api');

/**
 * 
 * @returns Shows the information of the last ~100 (max) earthquakes that have occurred.
 */
module.exports.times = async (datas) => await api(datas);

// setTimeout(async () => await checkUpdate(), 1000);
// async function checkUpdate() {
//     const package = require('./package.json');
//     const url = 'https://unpkg.com/prayer-times-turkey@latest';
//     const api = await axios({ method: 'get', url }).catch((e) => null);
//     const latest = api.request.path.split('/')[1].split('@')[1] || 0;

//     if (Number(latest.split('.').join('')) > Number(package.version.split('.').join('')))
//         console.log('\x1b[32m%s\x1b[0m', `✅ Please update prayer-times-turkey module ${package.version} to ${latest} version.`)
// }
