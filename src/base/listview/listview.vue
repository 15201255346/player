<template>
    <scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" @scroll="fromSonFun">

        <!--左侧-->
        <ul>
          <li v-for="group in data" class="list-group" ref="listGroup">
              <h2 class="list-group-title">{{group.title}}</h2>
              <ul>
                  <li class="list-group-item" v-for="item in group.items" @click="selectItem(item)">
                      <img src="" alt="" class="avatar" v-lazy="item.avatar">
                      <span class="name">{{item.name}}</span>
                  </li>
              </ul>
          </li>
        </ul>

        <!--右侧-->
        <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
            <ul>
                <li class="item" v-for="(item,index) in shortcutList"
                    :class="{ 'current' : index === currentIndex }" :data-index="index">
                    {{ item }}
                </li>
            </ul>
        </div>

        <!--固定-->
        <div class="list-fixed" v-show="fixedTitle" ref="fixed">
            <h1 class="fixed-title">{{ fixedTitle }}</h1>
        </div>

        <div class="loading-container" v-show="!data.length">
             <loading></loading>
        </div>


    </scroll>
</template>

<script>
    import Scroll from "base/scroll/scroll"
    import Loading from 'base/loading/loading'
    import {getData} from 'common/js/dom'

    const ANCHOR_HEIGHT = 18 ; //锚点的高度 计算偏移
    const TITLE_HEIGHT = 30; // title条高度


    export default {
        name:    "listview",
        data(){
           return{
             currentIndex : 0,
             scrollY : -1,
             diffrence : 0 //滚动的差值
           }
        },
        components : {
          Scroll,
          Loading
        },
        props:{
          data : {
              type : Array,
              default : null
          }
        },
        created(){
          /*  为什么不在data里面创建touch,
              因为在vue里面不管是data还是props里面的东西都会
              被vue添加一个getter 和 setter
              都会有一个监听，主要是为了和dom绑定

              放在created里面是因为不需要检测touch的变化
              只是为了相互之间获取数据
            */
            this.touch = {};
            this.listenScroll = true;//控制滚动组件要监听scroll事件
            this.listHeight = [];
        },
        mounted(){
            setTimeout(()=>{
                this.caculateHeight();
            } , 20)
        },
        computed : {
            shortcutList(){
                return this.data.map((group) => {
                    return group.title.substr(0, 1)
                });
            },
            fixedTitle(){
                if( this.scrollY>0 ) return "";
                return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ""
            }
        },
        methods : {
          onShortcutTouchStart(e){
              let anchorIndex = parseInt(getData(e.target, 'index'));//当前点击的下标

              let firstTouch = e.touches[0];
              this.touch.y1 = firstTouch.pageY; //第一次点击的y轴的位置
              this.touch.anchorIndex = anchorIndex ; //第一次点击的索引

              let index = getData(e.target, 'index');
              if( index === null ){
                return;
              }
              this.currentIndex = anchorIndex ; //将选中的样式设置为 当前点击的下标
              this._scrollTo(anchorIndex);
              // this.scroll.scrollToElement(e.target);

          },
          onShortcutTouchMove(e){
              let firstTouch = e.touches[0];
              this.touch.y2 = firstTouch.pageY;
              let delta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) ; //y轴上的偏移 取整
              let anchorIndex = this.touch.anchorIndex + delta ; //偏移量加上 上次的下标
              let index = getData( e.target, 'index' );
              if( index === null ){
                return;
              }

              // console.log( anchorIndex );
              if( anchorIndex<0 || anchorIndex>=this.shortcutList.length  )return; //当偏移量小于0或者是大于右侧所有列表和也就意味着到顶部或者是底部时
              this.currentIndex = anchorIndex;
              this._scrollTo(anchorIndex);

          },
          _scrollTo(index){
              this.$refs.listview.scrollToElement(this.$refs.listGroup[index] , 0);
          },
          fromSonFun(pos){
              this.scrollY = pos.y;
          },
          caculateHeight(){
              this.listHeight = [];
              let listGroup = this.$refs.listGroup;
              if(!listGroup)return;
              let height = 0;
              this.listHeight.push(height);
              for( let i = 0; i<listGroup.length ;i++ ){
                  let item = listGroup[i];
                  height+=item.clientHeight;
                  this.listHeight.push(height);
              }
          },
          selectItem(item){
              // console.log( item );
              this.$emit('select',item);

          }



        },
        watch:{
            data(){
                this.$nextTick(()=>{
                    this.caculateHeight();
                });
            },
            scrollY(newDate){
                let listHeight = this.listHeight;
                //往上拉到顶部
                if( newDate >= 0 ){
                    this.currentIndex = 0;
                    return;
                }

                //滚动在中间位置
                for( let i = 0 ; i < listHeight.length-1 ; i++ ){
                    let height1 = listHeight[i];
                    let height2 = listHeight[i+1];
                    if( -newDate > height1 && -newDate < height2 ){
                          this.currentIndex = i;
                          this.diffrence = height2 + newDate;
                          return;
                    }
                }

                //滚动到底部时
                // this.currentIndex = listHeight.length - 2;
            },
            diffrence(newDiff){
              //fixed将要变化的时候有一个往上顶的动画
                let fixedTop = null;
                if( newDiff > 0 && newDiff < TITLE_HEIGHT ){
                  fixedTop = newDiff-TITLE_HEIGHT;
                }
                else {
                  fixedTop = 0;
                }
                if( this.fixedTop === fixedTop ){
                  return;
                }
                this.fixedTop = fixedTop;
                this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
            }



        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  * { touch-action: pan-y; }
  .listview
    position: relative;
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
