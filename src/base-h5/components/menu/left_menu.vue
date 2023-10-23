<!--
* @Author: Tyrone
* @Description: 菜单列表
-->
<template>
  <div class="left_drawer_page">
    <q-list>
      <q-item-label header class="q-list-content">
        <!-- Esports---VR Sports 电竞  VR-->
        <div class="sports-genre">
          <div
            class="item"
            :class="[
              item.className,
              { active: state.current_menu.mi == item.mi },
            ]"
            v-for="(item, index) in sportsGenre"
            :key="index"
            @click="set_menu_obj"
          >
            <sport_icon size="20" :sport_id="item.mi" />
            <div>{{ item.name }}</div>
          </div>
        </div>
        <!-- 分割线 -->
        <div class="segmentation"></div>
        <!-- POPULAR 热门赛事-->
        <div class="popular">
          <h5>POPULAR</h5>
          <div
            class="item"
            :class="[
              item.className,
              { active: state.current_menu.mi == item.mi },
            ]"
            v-for="(item, index) in popular"
            :key="item.mi"
            @click="change_current_menu(item)"
          >
            <sport_icon size="18" :sport_id="item.mi" />
            <div>{{ item.name }}</div>
          </div>
        </div>
        <!-- 分割线 -->
        <div class="segmentation"></div>
        <!-- 赛事球类 -->
        <div class="menu_container">
          <h5>ALL SPORTS</h5>
          <div
            class="menu_item"
            :class="[
              'menu_item_' + item.mi,
              { active: state.current_menu.mi == item.mi },
            ]"
            v-for="item in state.menu_list"
            :key="item.mi"
            @click="change_current_menu(item)"
            :data-id="item.mi"
          >
            <!-- 有电竟体育时展示电竞体育2000  Esports  -->
            <sport_icon size="18" :sport_id="item.mi" />
            <div>
              {{
                item.mi == "2000" ? "Esports" : state.menu_name_list[item.mi]
              }}
            </div>
          </div>
        </div>
      </q-item-label>
    </q-list>
  </div>
</template>

<script>
import { defineComponent, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import lodash from "lodash";
import { api_match } from "src/api/index.js";
export default defineComponent({
  name: "leftMenu",
  components: { sport_icon },
  setup(props, event) {
    let menu_obj = reactive({});
    let menu_list = reactive({});
    // let state = store.getState();
    const router = useRouter();
    const route = useRoute();
    const sportsGenre = reactive([
      { name: "Esports", className: "esports", mi: "2000" },
      { name: "VR Sports", className: "vr-sports", mi: "300" },
    ]);
    const popular = reactive([
      { name: "Football", className: "football", mi: "101" },
      { name: "Basketball", className: "basketball", mi: "102" },
      { name: "Tennis", className: "tennis", mi: "105" },
    ]);
    const set_menu_obj = (data) => {
      router.push("/coming_soon");
    };
    onMounted(() => {
      // TODO  当menu_list没数据时请求下菜单数据接口--临时解决开发时indexPage页面不走<menu_list />组件无法获取菜单列表数据
      if (state.menu_list.length < 1) {
        init_menu_list();
      }
      unsubscribe();
    });
    const init_menu_list = async (m_data) => {
      const { data } = await api_match.handle_menu_id_list();
      if (data && data.data) {
        let new_list = lodash.cloneDeep(data.data);
        // 过滤出电竞类赛事
        let esports_list = _.cloneDeep(data.data).filter(
          (item) => 2000 < parseInt(item.mi) && parseInt(item.mi) < 3000
        );
        // 过滤2000以上3000以下的mi
        // 2000 > parseInt(item.mi) ||  parseInt(item.mi) > 3000
        // 过滤不需要展示的的球类
        // parseInt_mi !== 5000 && parseInt_mi !== 500 && parseInt_mi !== 400 && parseInt_mi !== 300 && parseInt_mi !== 118
        //过滤没有赛事数据球类
        const menu_list = new_list.filter((item, index) => {
          const parseInt_mi = parseInt(item.mi);
          return (
            item.sl &&
            (2000 > parseInt_mi || parseInt_mi > 3000) &&
            ![5000, 500, 400, 300, 118].includes(parseInt_mi)
          );
        });
        // //存储menu list数据
        // store.dispatch({
        //   type: "SET_MENU_LIST",
        //   data: menu_list,
        // });
      }
    };
    // 点击菜单item触发方法
    const change_current_menu = async (m_data) => {
      let euid = await original_data.get_euid(m_data.mi);

      // 关闭左侧菜单
      event.emit("isLeftDrawer", false);
      let current_menu = {
        ...m_data,
        euid,
      };
      // //存储menu选中数据
      // store.dispatch({
      //   type: "SET_MENU",
      //   data: current_menu,
      // });
      // 跳赛事列表页面
      route.path !== "/menu_list" && router.push("/menu_list");
    };
    return {
      change_current_menu,
      init_menu_list,
      set_menu_obj,
      menu_obj,
      sportsGenre,
      popular,
    };
  },
});
</script>
<style lang="scss" scoped>
  @import "./styles/left-menu.scss";
</style>
