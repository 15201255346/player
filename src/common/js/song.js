//集中维护，类的扩展性比对象要强，面向对象的编程方式
export default class Song{
    constructor({ id , mid , singer , name , album  , duration , image , url }){
        this.id = id;
        this.mid = mid;
        this.singer = singer;
        this.name = name;
        this.album = album;
        this.duration = duration;
        this.image = image;
        this.url = url;
    }
}

export function createSong(musicDate) {
    return new Song({
        id : musicDate.songid,
        mid : musicDate.songmid,
        singer : filterSinger(musicDate.singer),
        name : musicDate.songname,
        album : musicDate.albumname,
        duration : musicDate.interval,
        image : `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicDate.albummid}.jpg?max_age=2592000`,
        // url: musicData.url
        // url : `http://ws.stream.qqmusic.qq.com/${musicDate.songid}.m4a?fromtag=46`
        url : `http://ws.stream.qqmusic.qq.com/C100${musicDate.albummid}.m4a?fromtag=0&guid=126548448`


    })
}

export function filterSinger( singer ) {
  let ret = [];
  if( !singer ){
      return ""
  }
  singer.forEach((s)=>{
      ret.push(s.name);
  });
  return ret.join('/');
}

















