<!--
 * @Author: Router
 * @Description: 投注弹框，单关串关切换逻辑与普通赛事不一致，所以组件区分，避免逻辑混乱
-->
<template>
  <div class="bet-mix-box fullscreen">
    <!-- 冠军、虚拟体育、电竞菜单 -->
    <bet-mix-box-child-1 v-if="[100, 900, 3000].includes(+get_menu_type)"></bet-mix-box-child-1>
    <!-- 普通赛事菜单 -->
    <bet-mix-box-child-2 v-else></bet-mix-box-child-2>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import betMixBoxChild1 from "src/project/components/bet/bet_mix_box_child1.vue";
import betMixBoxChild2 from "src/project/components/bet/bet_mix_box_child2.vue";
export default {
  name: "bet_mix_box",
  mixins: [],
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters(['get_menu_type']),
  },
  methods: {
    ...mapMutations(['clear_single_money'])
  },
  components: {
    betMixBoxChild1,
    betMixBoxChild2
  },
  beforeDestroy() {
    this.clear_single_money(1)
  },
}

</script>

<style lang="scss" scoped>
.bet-mix-box {
  z-index: 541;
  max-width:3.78rem;
}
</style>
