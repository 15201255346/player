/*状态管理*/
import {playMode} from "common/js/config";

const state = {
    singer : {} ,
    playing : false , //是否播放
    fullScreen : false , //是否全屏播放
    playList : [], //播放列表
    sequenceList : [], //顺序列表
    mode : playMode.sequence,
    currentIndex : -1 //当前播放的是哪首歌 索引
};
export default state



























