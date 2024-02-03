<!--
 * @Author: nuanyang
 * @Date: 2021-12-10 12:36:50
 * @Description:
-->
<template>
    <div class="tips-icon relative-position" @click.stop v-if="id_dict.includes(playId)" @click="click_popup"
          @mouseleave="img_mouseleave">
      <!-- 说明主体 -->
      <q-menu v-model="is_show" anchor="bottom left" self="top left" :content-class="`tips-body-match  ${popup_class}`">
        <!-- 箭头 fifteen-arrow十五分钟单独加样式 夜间模式使用 -->
        <!-- <div class="direction fifteen-arrow"></div> -->
        <!-- 内容主体 -->
        <div class="tips-box fifteen-bg" :class="{'fifteen': ['15minutes','5minutes'].includes(type), 'vi_content_width':['vi','ad'].includes(lang)}">
            <div class="tips-title" >
                <!-- 标题 -->
                <span class="tip-before">{{tips_content.title}}</span>
            </div>
            <!-- type cos15Minutes 十五分钟玩法 -->
            <template v-if="['15minutes','5minutes'].includes(type)">
              <div class="tips-item" v-for="(item, idx) in tips_content.content" :key="idx">
                <template v-if="item.title =='5min-icon'">
                  <div class="wrap-box yb-flex-center">
                    <div :class="['item-icon',`item-icon-${index}`]" v-for="index in 4" :key="`${index}_before`"></div>
                    <div class="item-content">{{item.content}}</div>
                    <div :class="['item-icon',`item-icon-${index}`]" v-for="index in [4,3,2,1]" :key="`${index}_after`"></div>
                  </div>
                </template>
                <template v-else>
                  <!-- 滚球时的title文案不同 -->
                  <div class="item-title">{{ get_tip_title(item)}}</div>
                  <div class="item-content">{{item.content}}</div>
                </template>
              </div>
            </template>
             <!-- 内容 -->
            <div v-else class="tips-content">{{tips_content.content}}</div>
        </div>
    </q-menu>
    </div>
</template>

<script>
import { get_match_status,getScrollbarWidth } from 'src/core/utils/common/index'
export default {
  data() {
    return {
      id_dict: ['306','307','308','309','310','311','312','313','314','315','316','317','318','319','320','321','322','323','324','325','326','327','328','329','125','230'],
      is_show:false,//显示说明开关
      popup_class:"style1"//
    };
  },
  props:{
    playId: String,
    tipstatus: Boolean,
    // 提示类型  punish：罚牌   penalty:点球大战
    type:{
      type: String,
      default: 'punish'
    },
    ms:{
      type: Number,
      default:0
    }
  },
  computed:{
    //todo
    // ...mapGetters({
    //   //获取页面大小信息
    //   vx_get_layout_size: "get_layout_size",
    //   lang: "get_lang",
    // }),
    // 提示内容
    tips_content(){
      if(this.type == 'punish'){
        if(['125','230'].includes(this.playId)){
          // 角球
          return {
            title:i18n_t('list.corner'),
            content:i18n_t('list.corner_tips'),
          }
        } else {
          // 罚牌
          return {
            title:i18n_t('list.punish'),
            content:i18n_t('list.punish_details'),
          }
        }
      } else if (this.type === '15minutes') {
        // 15分钟
        return {
          title: i18n_t('list.15minutes'),
          content: i18n_t('list.15minutes_details')
        }
      }else if(this.type === '5minutes'){
        // 5分钟
        // 滚球时  绝杀球（补时） 不展示  且标题展示 “下一个进球” 排除110-即将开赛的状态，即将开赛展示原文案
        if (get_match_status(lodash.get(this, 'ms'), [110]) == 1) {
          return {
            title:i18n_t('list.5minutes_roll'),
            content:lodash.dropRight(i18n_t('list.5minutes_details')),
          }
        }
       return   {
          title:i18n_t('list.5minutes'),
          content:i18n_t('list.5minutes_details'),
        }
      } else{
        // 点球大战
        return {
          title:i18n_t('list.penalty'),
          content:i18n_t('list.penalty_details'),
        }
      }
    }
  },
  methods:{
    // 获取提示的标题  滚球时文案不同  排除110-即将开赛的状态，即将开赛展示原文案
    get_tip_title(item){
      return get_match_status(lodash.get(this, 'ms'), [110]) == 1 ? (item.title_roll || item.title) : item.title
    },
      //展开角球罚牌说明
    click_popup(e){
      let  height =  ['15minutes','5minutes'].includes(this.type) ? 236 : 105
      let bottom = e.target.getBoundingClientRect().bottom
      let margin = getScrollbarWidth()
      let innerHeight = window.innerHeight - margin
      if (bottom + height > innerHeight) {
        this.popup_class = 'style2'
      }else{
        this.popup_class = 'style1'
      }
    },
    //移出说明图标
    img_mouseleave(){
      this.is_show  = false
    },

  }
};
</script>

<style lang="scss" scoped>
.tips-icon {
  margin-left: 28px;
  width: 14px;
  height: 14px;
  background-size: 100%;
  background-image: url($SCSSPROJECTPATH+"/image/svg/y0_details_info.svg");
     &:hover {
        background-image: url($SCSSPROJECTPATH+"/image/svg/y0_details_info_focus.svg");
    }
}
</style>
<style lang="scss">
.tips-body-match {
  overflow: unset;
  &.style1 {
    transform: translate(-15px, 12px);
    .direction {
      top: -12px;
    }
  }
  &.style2 {
    transform: translate(-15px, -12px);
    .direction {
      transform: rotate(180deg);
      bottom: -14px;
    }
  }
  /* 箭头 */
}
.direction {
  position: absolute;
  left: 14px;
  width: 14px;
  height: 14px;
  border: 7px solid transparent;
  z-index: 100;
  /* 箭头 */
  &:after {
    position: absolute;
    border-width: 0 5px 5px;
    border-style: solid;
    content: "";
    top: 2px;
    left: -5px;
    pointer-events: none;
  }
}
/* 说明容器 */
.tips-box {
  position: relative;
  width: 219px;
  border-radius: 4px;
  z-index: 99;
  font-family: PingFangSC-Regular;
  overflow: hidden; 
  top: 1px;
  /*15分钟弹层样式*/
  &.fifteen {
    width: 320px;
  }
  &.vi_content_width {
    width: 360px;
  }
  /* 说明标题 */
  .tips-title {
    padding-left: 23px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    font-size: 14px;
    margin-bottom: 9px;
    font-weight: 600;
    .tip-before {
      &::before {
        display: inline-block;
        position: relative;
        top: 2px;
        margin-right: 8px;
        width: 3px;
        height: 14px;
        border-radius: 1.5px;
        content: "";
      }
    }
  }
  /* 说明内容 */
  .tips-content {
    word-wrap: break-word;
    padding: 0 18px 10px 23px;
  }
  /* 15分钟说明 */
  .tips-item {
      margin: 0 20px;
      display: flex;
      justify-content: space-between;
      height: 34px;
      line-height: 34px;
    &:last-child {
      border-bottom: none !important;
    }
    &:nth-child(2).tips-item {
      margin-top: -9px;
    }
    .wrap-box{
      flex: 1;
      .item-content{
        margin: 0 10px;
        white-space: nowrap;
      }
      .item-icon {
        border-radius: 50%;
        background-color: var(--qq--y0-text-color1);
        margin:0 5px;
        &.item-icon-1 {
          width: 2px;
          height: 2px;
        }
        &.item-icon-2 {
          width: 4px;
          height: 4px;
        }
        &.item-icon-3 {
          width: 6px;
          height: 6px;
        }
        &.item-icon-4 {
          width: 8px;
          height: 8px;
        }
      }
    }
  }
}
</style>
