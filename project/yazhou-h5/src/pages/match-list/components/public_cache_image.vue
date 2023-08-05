<!--
 * @Description: 图片缓存 加载组件
 * @Date: 2022-09-20 17:46:47
-->
<template v-if="show_image">
  <!-- 有缓存图片优先使用缓存图片 -->
  <img class="team-icon row no-wrap" loading="lazy" decoding="async" :src="image_src"
       @error="league_icon_error"/>
</template>
<script>
export default {
  data() {
    return {
      //显示图片
      show_image: false,
      // 图片最终路径
      image_src: "",
      // 图片 默认路径
      default_url: "",
      // 图片 全路径
      full_path: "",
      // 主题
      theme : "theme01",
      // 默认联赛图标
      default_league_icon : "image/wwwassets/bw3/common/match_cup.svg",
      // 无联赛logo图标
      none_league_icon :  "image/wwwassets/bw3/common/match_cup.svg",
      // 无联赛logo图标黑色版
      none_league_icon_black :  "image/wwwassets/bw3/common/match_cup_black.svg",
      // 主队默认头像
      home_default_avatar :  "image/wwwassets/bw3/common/team_s_l.png",
      // 客队默认头像
      away_default_avatar :  "image/wwwassets/bw3/common/team_s_r.png",
      //图标出错 与 记录
      img_error_map : {},
      // 电竞赛种csid
      e_sport_csids : [101, 100, 103, 102]
    };
  },
  props: {
    // 赛种 id
    csid: {},
    // 图片路径
    path: "",
    //    类型
    type: "",
  },
  created() {
    //设置 默认 图片
    this.set_default_icon();
    this.check_image_load();
  },
  watch: {
    path() {
      // 监听地址变化
      this.check_image_load();
    }
  },
  methods: {
    /**
     * @description: 图标出错时
     * @param {Object} $event 错误事件对象
     */
    league_icon_error($event){
      $event.target.src = this.load_img_default_by_type(this.type);
      $event.target.onerror = null
    },
    //  设置主题
    set_default_icon(theme = "theme02") {
      // 主题
      this.theme = theme;
      // 默认联赛图标
      this.default_league_icon = theme == "theme02" ? this.none_league_icon_black : this.none_league_icon;
    },
    check_image_load() {
      // 当是数组时显示数组第一个元素
      let path = _.isArray(this.path)?_.get(this.path,'[0]'):this.path;
      let params = { key: path, csid: this.csid, type: this.type };
      // 检查是否 加载 过 是否 ok  { 0: 第一次加载, 1:加载过 而且成功, -1: 加载过但是已确认 出错 }
      let status = this.check_if_loaded_img(params);
      // 返回默认图片
      this.default_url = this.load_img_default_by_type(this.type);
      // 获取图片完整网络路径
      this.full_path = this.get_file_path(path, this.csid);
      // -1   加载过但是已确认 出错
      //0  未加载
      this.image_src = this.default_url;
      this.show_image = true;
      // return
      // 第一次加载   0
      if (!status) {
        this.load_image_first_time(params);
      } else if (status == -1) {  //  加载过但是已确认 出错 -1
        this.image_src = this.default_url;
        this.show_image = true;
      } else { // 加载过 而且成功 1
        // this.image_src = this.full_path;
        this.image_src = this.get_img_cache_obj(this.path);
        this.show_image = true;
      }
    },
    //  首次加载图片
    load_image_first_time(params) {
      //   url= "https://image.girltui.com/group1/M00/00/27/CgURt17qYq-AGLDAAAAcppGYnrQ4571.png"
      let myImage = new Image(100, 200);
      myImage.onload = (event) => {
        // console.log("内存内创建的 图片 加载成功 ------------------");
        // 设置key对应缓存的图片路径
        this.set_img_cache_obj(this.path, event)
        this.image_src = this.full_path;
        this.show_image = true;
        this.load_img_success(params);
        this.$nextTick(() => {
          myImage = null;
        });
      };
      myImage.onerror = () => {
        // console.log("内存内创建的 图片 加载 失败 ------------------");
        this.image_src = this.default_url;
        this.show_image = true;
        this.load_img_error(params);
        this.$nextTick(() => {
          myImage = null;
        });
      };
      myImage.src =this. full_path;
    },
    /**
     * 根据类型 返回默认图片
     */
    load_img_default_by_type(type) {
      let url = "";
      switch (type) {
        case "away":
          url = this.away_default_avatar;
          break;
        case "home":
          url = this.home_default_avatar;
          break;
        case "league":
          url = this.default_league_icon;
          break;
        default:
          url = this.default_league_icon;
          break;
      }
      return url;
    },
    // 检查是否 加载 过 是否 ok
    check_if_loaded_img(params) {
      let { key, type, csid } = params;
      // -1   加载过但是已确认 出错
      //0  未加载
      // 1  加载过 而且成功
      return this.img_error_map[`${csid || ""}_${key}`] || 0;
    },
    // 图片加载错误
    load_img_error(params) {
      let { key, type, csid = 0 } = params;
      this.img_error_map[`${csid || ""}_${key}`] = -1;
    },
    // 图片加载成功 是 1
    load_img_success(params) {
      let { key, type, csid = 0 } = params;
      this.img_error_map[`${csid || ""}_${key}`] = 1;
    },
    /**
     * @description: 获取key对应缓存的图片路径
     * @param {String} key  图片路径
     * @return {String} 返回缓存的路径
     */
    get_img_cache_obj(key){
      // 没有图片缓存的路径就返回空字符串
      let res = '';
      // 判断是否有图片缓存的路径
      if(key && window.img_cache_obj && window.img_cache_obj[this.csid+'_'+key]){
        // 获取图片缓存的路径
        res = window.img_cache_obj[this.csid+'_'+key];
      }
      return res;
    },
    /**
     * @description: 设置key对应缓存的图片路径
     * @param {String} key  图片路径
     * @param {String} event  dom event事件
     */
    set_img_cache_obj(key,event){
      // 判断src属性是否有图片路径
      if(key && event && event.currentTarget && event.currentTarget.src){
        // 判断图片缓存对象是否为空,为空时设置空对象
        if(!window.img_cache_obj){
          // 初始化window.img_cache_obj空对象
          window.img_cache_obj = {};
        }
        // 设置缓存的图片,图片的key为球种csid + '_' +图片路径
        window.img_cache_obj[this.csid+'_'+key] = event.currentTarget.src;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.team-icon {
  width: 0.18rem;
  height: 0.18rem;
  margin-right: 0.06rem;
  flex-shrink: 0;
  justify-content: center;
}
</style>
