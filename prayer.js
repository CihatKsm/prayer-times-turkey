const { default: axios } = require('axios');
const api = require('./api');

module.exports.times = async (datas) => await api(datas);