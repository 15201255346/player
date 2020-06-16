<template>
  <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
        <slot></slot>
      </div>
      <div class="dots">
        <span class="dot" v-for="(item,index) in dots" :class=" { active : currentIndex === index}"></span>
      </div>
  </div>
</template>

<script>
    import betterScroll from 'better-scroll'
    import {addClass} from "common/js/dom";


    export default {
        name: "slider",
        data(){
          return{
            dots : [],
            currentIndex : 0
          }
        },
        props:{
           loop : { //是否轮播
             type : Boolean ,
             default : true
           },
           autoPlay : { //是否自动轮播
             type : Boolean,
             default:true
           },
           interval : {
             type : Number,
              default: 4000
           }
        },
        mounted(){
          setTimeout(()=>{
              this._setSilderWidth();
              this._initDots();
              this._initSlider();

              if( this.autoPlay ){
                 this._play();
              }
          } , 20);

          window.addEventListener("resize" ,()=>{
           /* if( !this.slider ){
                return;
            }*/
            this._setSilderWidth(true);
            this.slider.refresh();
          })


        },
        methods:{
           /* 设置轮播的宽度
            是否轮播*/
            _setSilderWidth(isResize){

                this.children = this.$refs.sliderGroup.children;
                let sliderWidth = this.$refs.slider.clientWidth;
                let width = 0;

                for( let i = 0; i<this.children.length;i++ ){
                    addClass( this.children[i] , 'slider-item' );
                    this.children[i].style.width = sliderWidth + 'px';
                    width += sliderWidth;
                }
                console.log( width );
                if( this.loop && !isResize ){
                  width += 2*sliderWidth;
                }

                this.$refs.sliderGroup.style.width = width + 'px';

            },

            // 初始化轮播
            _initSlider(){
              this.slider = new betterScroll( this.$refs.slider , {
                  scrollX : true,
                  scrollY : false,
                  momentum : false,//是否是动画效果
                  snap: {
                    loop: this.loop,
                    threshold: 0.3,
                    speed: 400
                  },
                  click : true
              });

              this.slider.on("scrollEnd" , ()=>{
                  this.currentIndex = this.slider.getCurrentPage().pageX;
                  if( this.autoPlay ){
                    this._play();
                  }
              });



            },

            //初始化dots
            _initDots(){
                this.dots = new Array( this.children.length );
            },

            //是否自动播放
            _play(){
                this.timer = setTimeout(()=>{
                    this.slider.next() //当我们做 slider 组件的时候，slider 通常会分成多个页面。调用此方法可以滚动到指定的页面
                } , this.interval);
            }

        },
        //当组件有计时器功能，销毁时要清除计时器，有利于内存的释放
        destroyed(){
            clearTimeout(this.timer);
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      transform: translateZ(1px)
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>















































