<template>
  <div class="singer">

      <!--父容器的高度要固定，子容器的高度撑开-->
      <list-view :data="singerList" @select="selectSinger"></list-view>

      <!--子路由-->
      <router-view></router-view>

  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import Singer from 'common/js/singer'
  import listView from "base/listview/listview"
  import {mapMutations} from 'vuex'

  const HOT_SINGER = 10;
  const HOT_NAME = '热门111';

  export default {
      components:{
        listView
      },
      data(){
          return{
            singerList : []
          }
      },
      mounted(){
          setTimeout(()=>{
             this._initSinger();
          } , 20)
      },
      methods : {
          selectSinger(singer){
              this.$router.push({
                path : `/singer/${singer.id}`
              });
              this.SET_SINGER(singer)
          },
          _initSinger(){
            getSingerList().then((res)=>{
                this.singerList = this._createMap(res.data.list);
            })
          },
          _createMap(date){
              let map = {
                  hot : {
                      title : HOT_NAME,
                      items : []
                  }
              };
              date.forEach(( item , index )=>{
                  if( index < HOT_SINGER ){
                      map.hot.items.push( new Singer({id : item.Fsinger_mid , name : item.Fsinger_name}) );
                  }
                  if( !map[item.Findex] ){
                    map[item.Findex] = {
                        title : item.Findex,
                        items : []
                    }
                  }
                  map[item.Findex].items.push( new Singer({id : item.Fsinger_mid , name : item.Fsinger_name}) );

              });

              //对所得到的数据进行排序
              let hot = []; //热门
              let ret = []; //排序
              for( let key in map ){
                  if( map[key].title.match(/[a-zA-Z]/) ){
                      ret.push(map[key]);
                  }
                  else if( map[key].title === HOT_NAME ){
                      hot.push(map[key]);
                  }
              }


              ret.sort((a,b)=>{
                  return a.title.charCodeAt(0) - b.title.charCodeAt(0);
              });
              return hot.concat(ret);


          },
        /*  ...mapMutations({
              setSinger : "SET_SINGER"
          })*/
        ...mapMutations([
          'SET_SINGER'
        ])
      }


  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
