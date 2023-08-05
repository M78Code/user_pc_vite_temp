<!--
 * @Author: Router
 * @Description:  跳转banner图和猜你喜欢
-->
<template>
  <div class="tiaozhuan-panel" :class="{
    'tiaozhuan-panel2':!show_banner2,
    'show-b2':!(show_banner2 && carousel_src.length)
    }">
    <img  src="image/wwwassets/bw3/common/close.svg" class="delete" @click.self="show_banner = false" v-show="show_banner2 && carousel_src.length">
    <!-- 轮播图组件 -->
    <q-carousel swipeable animated v-model="slide" infinite :autoplay="7000" transition-prev="slide-right" transition-next="slide-left" width="100%" v-show="show_banner2 && carousel_src.length" class="panel2">
      <template v-for="(item,index) in carousel_src">
        <q-carousel-slide :name="index" :img-src="item.imgUrl" :key="index" @click="confirm(item)" />
      </template>
      <template v-slot:control v-if="carousel_src.length > 1">
        <!-- 控制按钮 -->
        <q-carousel-control position="bottom" :offset="[0, 8]">
          <span v-for="(item,index) in carousel_src" :key="index" class="tab" :class="{'tab2': index == slide}"></span>
        </q-carousel-control>
      </template>
    </q-carousel>
    <!-- 猜你喜欢 -->
    <may-also-like v-show="!show_banner2" :from_where="101" :show_="Boolean(show_banner2)" v-if="_.get(get_access_config,'hotRecommend')"></may-also-like>
  </div>
</template>

<script>
import mayAlsoLike from "src/project/pages/match-list/components/may_also_like.vue";  // 列表页猜你喜欢
import { mapMutations, mapGetters } from 'vuex'
export default {
  name: 'tiaozhuan_panel',
  data() {
    return {
      show_banner: true, //显示banner图
      slide: 0, //轮播初始下标
      carousel_src: [], //轮播图片地址
    };
  },

  components: { mayAlsoLike },

  computed: {
    ...mapGetters([
      // 当前选中的二级菜单id
      'get_curr_sub_menu_type',
      // 商户配置的图片地址和弹框信息
      'get_banner_obj',
      // 用户信息,用户金额,userId 需要监听变化
      'get_user',
      'get_access_config',
      'get_golistpage',
      'get_hot_list_item'
    ]),
    show_banner2(){
      return this.get_banner_obj.type2 && this.get_banner_obj.type2.length && this.show_banner
    }
  },
  watch: {
    //滚球才有
    get_curr_sub_menu_type(new_, old_) {
      if (this.get_menu_type === 1) {
        this.reset_timer()
      }
    },
    'get_banner_obj.type2'() {
      this.fetch_actimg()
    }
  },

  created() {
    this.timer=0; //计时器
    this.fetch_actimg()
  },

  methods: {
    ...mapMutations([
      // 跳转活动的确认信息
      'set_activity_msg',
      'get_lang',
      'set_menu_type',
      'set_goto_detail_matchid',
      'set_details_item',
      'set_home_tab_item',
      'set_hot_tab_item'
    ]),
    /**
     *@description 获取轮播图片
     *@return {Undefined} undefined
     */
    fetch_actimg() {
      if (this.get_banner_obj.type2 && Array.isArray(this.get_banner_obj.type2)) {
        let arr = []
        this.get_banner_obj.type2.forEach(item => {
          arr.push({ ...item, imgUrl: this.get_file_path(item.imgUrl) })
        });
        this.carousel_src = arr
      }
      this.reset_timer()
    },
    /**
     *@description 跳转逻辑
     *@return {Undefined} undefined
     */
    confirm(val) {
      let _url = _.get(val, 'hostUrl')
      let _type = _.get(val, 'urlType')
      if (!_url) return
      if (val.comfirmTxt && this.get_user.activityList) {
        this.set_activity_msg(val)
      } else if (_url.startsWith('http') && _type === '2') {
          window.open(_url, '_blank')
      } else if (_type === '1') {
        if (/#*\/*details/.test(_url) && this.$route.name != 'category') {
          const {groups: {mid, csid}} = /#*\/*details\/(?<mid>\d+)\/(?<csid>\d+)/.exec(_url) || {groups:{}}
          if (mid && csid) {
            if ([100,101,102,103].includes(+csid)) {  // 如果是电竞赛事，需要设置菜单类型
            this.set_menu_type(3000)
          }
          this.set_goto_detail_matchid(mid);
          this.set_details_item(0);
          this.$router.push({name:'category', params: {mid, csid}});
          }
        } else if (_url == 'act' && this.get_user.activityList) {
          this.$router.push({ name: 'activity_task', query: { rdm: new Date().getTime() } })
        } else if (_url.startsWith('hot') && !this.get_golistpage) {
          let tid = _url.split('/')[1]
          let is_existtid = this.get_hot_list_item && this.get_hot_list_item.subList && this.get_hot_list_item.subList.find(item => {
            return item.field2 == tid
          })
          if (tid && is_existtid) {
            this.set_home_tab_item({component: 'hot', index: 1, name: '热门'})
            this.set_hot_tab_item({field2: tid})
            if (this.$route.name == 'home') {
              this.$root.$emit(this.emit_cmd.EMIT_HOME_TAB)
            } else {
              this.$router.push({name: 'home'})
            }
          }
        }
      }      
    },
    /**
     *@description 重置计时器
     *@return {Undefined} undefined
     */
    reset_timer() {
      clearTimeout(this.timer)
      this.show_banner = true
      this.timer = setTimeout(() => {
        this.show_banner = false
      }, 7000 * this.carousel_src.length);
    }
  },
  destroyed() {
    clearTimeout(this.timer)
    this.timer = null

    for (const key in this.$data) {
      this.$data[key] = null
    }
  },
}

</script>
<style lang="scss" scoped>
.tiaozhuan-panel {
  width: 3.6rem;
  margin: 0.04rem auto 0;
  position: relative;
  border-radius: 0.1rem;
  overflow: hidden;

  &.tiaozhuan-panel2 {
    box-shadow: none;
    margin: 0.04rem 0 0;
    width: 100%;
    border-radius: 0;
  }

  &.show-b2 {
    margin-top: 0.02rem;
  }

  & ::v-deep .q-carousel__control {
    display: flex;
    justify-content: center;
  }

  & ::v-deep .q-carousel__slide {
    background-size: 100% 100%;
  }

  & ::v-deep .q-carousel {
    background: transparent;
  }

  .panel2 {
    height: 1.48rem;
  }

  .tab {
    width: 0.04rem;
    height: 0.02rem;
    border-radius: 2px;
    display: inline-block;
    margin: 0 2px;
    background-color: var(--q-color-com-bg-color-12);
  }

  .tab2 {
    width: 0.08rem;
  }

  .delete {
    position: absolute;
    z-index: 1;
    right: 0.08rem;
    top: 0.16rem;
    width: 0.14rem;
    box-sizing: initial;
    border: 4px solid transparent;
  }
}
</style>
