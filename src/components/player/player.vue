<template>
    <div class="player"  v-show="playList.length>0">

        <transition name="normal"
                    @enter="enter"
                    @after-enter="afterEnter"
                    @leave="leave"
                    @after-leave="afterLeave">
            <div class="normal-player" v-show="fullScreen">
            <div class="background">
              <img src="" alt="" width="100%" height="100%" :src="currentSong.image">
            </div>

            <div class="top">
              <div class="back" @click="back">
                <i class="icon-back"></i>
              </div>
              <h1 class="title" v-html="currentSong.name"></h1>
              <h2 class="subtitle" v-html="currentSong.singer"></h2>
            </div>

            <div class="middle">
              <div class="middle-l">
                <div class="cd-wrapper" ref="cdWrapper">
                  <div class="cd">
                      <img alt="" class="image" :class="cdCls" :src="currentSong.image">
                  </div>
                </div>
                <div class="playing-lyric-wrapper">
                  <div class="playing-lyric"></div>
                </div>
              </div>
              <div class="middle-r">
                <div class="lyric-wrapper">
                  <div>
                    <p class="text"></p>
                  </div>
                  <div class="pure-music" >
                    <p></p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bottom">

            <!--  <div class="dot-wrapper">
                <span class="dot"></span>
                <span class="dot"></span>
              </div>-->


              <!--歌曲播放进度条-->
              <div class="progress-wrapper">
                <span class="time time-l">{{ currentTime }}</span>
                <div class="progress-bar-wrapper"></div>
                <span class="time time-r"></span>
              </div>


              <div class="operators">
                <div class="icon i-left" >
                  <i class="icon-sequence"></i>
                </div>
                <div class="icon i-left" :class="disableCls">
                  <i @click="prev" class="icon-prev"></i>
                </div>
                <div class="icon i-center" :class="disableCls">
                  <i :class="playIcon" @click="togglePlaying"></i>
                </div>
                <div class="icon i-right" :class="disableCls">
                  <i @click="next" class="icon-next"></i>
                </div>
                <div class="icon i-right">
                  <i class="icon icon-not-favorite"></i>
                </div>
              </div>


            </div>

          </div>
        </transition>

        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="open">
              <div class="icon" >
                <div class="imgWrapper">
                  <img width="40" height="40" :src="currentSong.image" :class="cdCls">
                </div>
              </div>
              <div class="text">
                <h2 class="name" v-html="currentSong.name"></h2>
                <p class="desc" v-html="currentSong.singer"></p>
              </div>
              <div class="control">
                <i :class="miniIcon" @click.stop="togglePlaying"></i>
              </div>
              <div class="control" >
                <i class="icon-playlist"></i>
              </div>
            </div>
        </transition>

        <audio  ref="audio" @play="ready" @error="error" @timeupdate="updateTime"></audio>
        <!--这个ready是指等歌曲到下一首时在开始播放，不然不可以播放-->

    </div>
</template>

<script>
    import { mapState , mapGetters , mapMutations ,mapActions } from 'vuex'
    import animations from 'create-keyframe-animation'
    import {prefixStyle} from "common/js/dom";

    const transform = prefixStyle('transform');

    export default {
        name: "player",
        data(){
          return{
            songReady : false,
            currentTime : 0
          }
        },
        computed:{
          /* ...mapState([
              'fullScreen',
              'playList'
            ])
            */
          cdCls(){
              return this.playing ? "play" : ""
          },
          playIcon(){
              return this.playing ? 'icon-pause' : 'icon-play'
          },
          miniIcon(){
              return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
          },
          disableCls(){
              return this.songReady ? "" : "disable"
          },
          ...mapGetters([
              'fullScreen',
              'playList',
              'currentSong',
              'playing',
              'currentIndex'
          ])
        },
        methods:{
          back(){
              this.SET_FULL_SCREEN(false);
          },
          open(){
              this.SET_FULL_SCREEN(true);
          },
          enter(el , done){
              const { x , y , scale } = this._getPosAndScale();
              //动画的整个过程
              let animation = {
                  0 : {
                      transform : `translate3d(${x}px,${y}px,0) scale(${scale})` //最开始是在底部
                  },
                  60 : {
                      transform : `translate3d(0,0,0) scale(1.1)` // 60%的时候到达顶部然后有一个放大的过程
                  },
                  100 : {
                      transform : `translate3d(0 ,0 ,0 ) scale(1)` //最后停在顶部并且不放大
                  }
              };

              animations.registerAnimation({ //注册一个动画
                  name : 'move', //动画名称
                  animation ,
                  presets: {//预设
                    duration: 400, //动画间隔
                    easing: 'linear' //缓动
                  }
              });

              //执行这个动画
              animations.runAnimation(this.$refs.cdWrapper, 'move', done) ;//done函数执行完了之后就会跳到afterEnter

          },
          afterEnter(){
              animations.unregisterAnimation('move');
              this.$refs.cdWrapper.style.animation = '';
          },
          leave(el , done){
              this.$refs.cdWrapper.style.transition = 'all 0.4s';
              const {x,y,scale} = this._getPosAndScale();
              this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
              this.$refs.cdWrapper.addEventListener('transitionend',done);
          },
          afterLeave(){
              this.$refs.cdWrapper.style.transition = '';
              this.$refs.cdWrapper.style[transform] = '';
          },
          ready(){
              this.songReady = true;
          },
          error(){
              this.songReady = true;
          },
          _getPosAndScale(){
              const targetWidth = 40; //mini-player 的 img高度
              const paddingLeft = 40; //中心坐标离左边距离40px
              const paddingBottom = 30; //中心坐标离右下方
              const paddingTop = 80; //距离头部高度
              const width = window.innerWidth * .8; //宽度是80% * 屏幕宽度 正常图片宽度
              const scale = targetWidth / width ; // 小图宽度/大图宽度
              const x = -(window.innerWidth/2 - paddingLeft);
              const y = width.innerHeight - paddingBottom-paddingTop - width/2;
              return {
                x,
                y,
                scale
              }

          },
          togglePlaying(){
             if(!this.songReady){
                return;
             }
             this.SET_PLAYING_STATE(!this.playing);
          },
          next(){
             if(!this.songReady){
                return;
             }
             let index = this.currentIndex + 1;
             if(index === this.playList.length){
                  index = 0;
             }
             this.SET_CURRENT_INDEX(index);
             if( !this.playing ){
                this.togglePlaying();
             }
             this.songReady = false;

          },
          prev(){
              if(!this.songReady){
                 return;
              }
              let index = this.currentIndex - 1;
              if( index === -1 ){
                 index = this.playList.length - 1;
              }
              this.SET_CURRENT_INDEX(index);
              if( !this.playing ){
                this.togglePlaying();
              }
              this.songReady = false;
          },
          updateTime(e){
              this.currentTime = e.target.currentTime; //表示的是audio播放的当前时间,也可以修改当前时间 控制播放位置
          },
          ...mapMutations([
              'SET_FULL_SCREEN',
              'SET_PLAYING_STATE',
              'SET_CURRENT_INDEX'
          ])
        },
        watch : {
          currentSong(newSong,oldSong){
             console.log( newSong );
             console.log( oldSong );
             this.$nextTick(()=>{
                this.$refs.audio.play();
             });
          },
      /*    currentSong(newSong, oldSong) {
            if (!newSong.id || !newSong.url || newSong.id === oldSong.id) {
              return
            }
            this.songReady = false
            this.canLyricPlay = false
            if (this.currentLyric) {
              this.currentLyric.stop()
              // 重置为null
              this.currentLyric = null
              this.currentTime = 0
              this.playingLyric = ''
              this.currentLineNum = 0
            }
            this.$refs.audio.src = newSong.url
            this.$refs.audio.play()
            // 若歌曲 5s 未播放，则认为超时，修改状态确保可以切换歌曲。
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
              this.songReady = true
            }, 5000)
            this.getLyric()
          },*/
          playing(newPlaying){
             const audio = this.$refs.audio;
             this.$nextTick(()=>{
               newPlaying ? audio.play() : audio.pause();
             });
          }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            box-sizing: border-box
            height: 100%
            .cd
              width: 100%
              height: 100%
              border-radius: 50%
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                box-sizing: border-box
                border-radius: 50%
                border: 10px solid rgba(255, 255, 255, 0.1)
              .play
                animation: rotate 20s linear infinite
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
            .pure-music
              padding-top: 50%
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        height: 40px
        padding: 0 10px 0 20px
        .imgWrapper
          height: 100%
          width: 100%
          img
            border-radius: 50%
            &.play
              animation: rotate 10s linear infinite
            &.pause
              animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
