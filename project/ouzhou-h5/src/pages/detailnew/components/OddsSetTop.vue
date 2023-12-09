<template>
  <div class="component odds-set-top" @click.stop="onClick" 
    :class="value.hton!='0' ? 'icon_zd_select' : 'icon_zd_default'"
  >
  </div>
</template>
<script setup lang="ts">
import { api_details } from 'src/api';
import { MITT_TYPES, useMittEmit } from "src/output/index.js";

type Props = {
  value: TYPES.OddInfo
}
const props = withDefaults(defineProps<Props>(), {
})

function onClick() {
  if (props.value.hton != '0') {
    props.value.hton = '0'
  } else {
    useMittEmit(MITT_TYPES.EMIT_ANIMATE_RESET_MYSCROLL_TOP, 100);
    useMittEmit(MITT_TYPES.EMIT_RESET_SET_HTON);
    props.value.hton = Date.now().toString()
  }
  // 置顶状态变化时，更新相应玩法存储状态  todo  后续再优化
  const { hton,mid, hpid, topKey } = props.value
  api_details.get_category_playTop({
    matchId: mid,
    status: hton == '0' ? 1 : 0,
    playId: hpid,
    topKey
  })
}

</script>

<style scoped lang="scss">
.component.odds-set-top {
  width: 0.14rem;
  height: 0.14rem;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  margin-left: 14px;
}

.icon_zd_select {
  background-image: url($SCSSPROJECTPATH + "/image/detail/set_top_active.png");
}

.icon_zd_default {
  background-image: url($SCSSPROJECTPATH + "/image/detail/set_top.png");
}
</style>