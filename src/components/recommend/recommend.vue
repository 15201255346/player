<template>
  <div class="recommend" ref="recommend">

    <scroll class="recommend-content" ref="scroll" :data="discList">  <!-- better-scroll加载滚动只能是子集第一个div里的内容 -->
        <div>

            <!--轮播部分-->
            <div class="slider-wrapper" v-if="recommendList.length">
              <div class="slider-content">
                <slider>
                  <div v-for="(item , index) in recommendList" class="slider-item">
                    <a :href="item.linkUrl">
                        <img :src="item.picUrl" alt="">
                    </a>
                  </div>
                </slider>
              </div>
            </div>

            <!--推荐列表部分-->
            <div class="recommend-list">
              <h1 class="list-title">热门歌单推荐</h1>
              <ul>
                <li class="item" v-for="item in discList">
                  <div class="icon">
                    <img v-lazy="item.imgurl" alt="" @load="loadImage()"  style="width: 60px;height: 60px;">
                  </div>
                  <div class="text">
                    <div class="name" v-html="item.creator.name"></div>  <!--因为有字符所以要转译用v-html-->
                    <div class="desc" v-html="item.dissname"></div>
                  </div>
                </li>
              </ul>
            </div>

        </div>

        <!--加载中-->
        <div class="loading-container">
            <loading v-show="discList.length === 0"></loading>
        </div>
    </scroll>


  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from "base/scroll/scroll"
  import {getRecommend , getDiscList} from "api/recommend"
  import {ERR_OK} from "api/config";
  import Slider from "base/slider/slider"
  import Loading from "base/loading/loading"

  export default {
     components:{
       Slider ,
       Scroll,
       Loading
     },
     data(){
        return{
          recommendList : [],
          discList : [],
        }
     },
     created(){
       setTimeout(()=>{
         this._getRecommend();
         this._getDiscList();
       } , 20);
     },
     methods : {
       _getRecommend(){  //获取推荐的数据
         getRecommend().then((res)=>{ //promise成功时执行的方法
            if( res.code === ERR_OK ){
               this.recommendList = res.data.slider;
            }
         })
       },
       _getDiscList(){
         getDiscList().then((res)=>{ //promise成功时执行的方法
            this.discList = res.data.list;
         })
       },
       loadImage(){//图片加载完成之后调用的方法
         if( !this.checked ){
             this.$refs.scroll.refresh();
             this.checked = true;
         }
       }


     }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        height: 0
        padding-top: 40%
        overflow: hidden
        .slider-content
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
