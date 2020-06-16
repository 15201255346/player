<template>
    <transition appear name="slide">
        <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
    </transition>
</template>

<script>
    import {mapState,mapGetters} from 'vuex'
    import {getSingerDetail} from 'api/singer'
    import {createSong} from 'common/js/song'
    import musicList from 'components/music-list/music-list'

    export default {
        name: "singer-detail",
        components:{
          musicList
        },
        computed : {
          /*  ...mapGetters([
            'singer'
          ]),*/
          title(){
              return this.singer.name;
          },
          bgImage(){
              return this.singer.avatar
          },
          ...mapState({
              singer : state=>state.singer
          })
        },
        data(){
            return{
                songs : []
            }
        },
        created(){
            this._getSinger();
        },
        methods:{
           _getSinger(){
               if( !this.singer.id ){
                    this.$router.push('/singer');
                    return;
               }
               getSingerDetail(this.singer.id).then((res)=>{
                 if(res.code === 0){
                    console.log( res.data.list );
                    let song = this._normalizeSongs(res.data.list);
                    console.log( song );
                    this.songs = song;
                 }
               })
           },
            _normalizeSongs(list){
                let ret = [] ;
                list.forEach((item)=>{
                    let {musicData} = item;
                    if( musicData.songid && musicData.albumid ){
                        ret.push( createSong(musicData) );
                    }
                });
              return ret
            }
        },




    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .singer-detail
      position : fixed
      z-index :100
      top:0
      left:0
      right:0
      bottom:0
      background : $color-background
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>

































