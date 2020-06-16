import originJSONP from 'jsonp'

export default function jsonp( url , data , option){
  // url = ?&_=1566367019671&g_tk=5381&
  url += ( url.indexOf("?") < 0 ? "?" : "&" ) + param(data);

  return new Promise(( resolve, reject )=>{
      originJSONP( url , option , ( err , data)=>{
        if( !err ){
          resolve(data);
        }
        else{
          reject(err);
        }
      })
  })

}

function param(data){
  let url = '';
  for(var k in data){
    // let value = data[k] !== undefined ? data[k] : ""  ;
    let value = data[k] || "";
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ""
}





























