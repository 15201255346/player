import jsonp from 'common/js/jsonp'
import {commonParams , options} from "./config.js"
import axios from "axios"

export function getRecommend(){
    //url + data(queryString parameters 参数get)
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg' ;//推荐的url
    const data = Object.assign({} , commonParams , {
       platform : "h5",
       uin : 0,
       needNewCode : 1
    });
    return jsonp( url , data,options);
}

export function getDiscList(){ //获取歌单数据
  const url = '/api/getDiscList';
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  });

  return axios.get( url , {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  });
}









































