

import BUILDIN_CONFIG from "app/job/output/env/index.js";

    // 用于判断收藏按钮是否可以触发
    export function   judge_collectSwitch(collectSwitchStatus,vm){
        // 前端配置写死，世界杯后删除
        // 前端开    后台开       >开
        // 前端开    后台关       >关
        // 前端关    后台开       >关
        // 前端关    后台关       >关
        if(!collectSwitchStatus || ! BUILDIN_CONFIG.LOCAL_FUNCTION_SWITCH.ENABLE_COLLECT_API ){
          vm.$toast(vm.i18n_t(`common.temporarily_unavailable`), 2000)
          return false
        }
        // 世界杯后恢复
        // if(!GlobalAccessConfig.get_collectSwitch()){
        //   this.$toast(i18n_t(`common.temporarily_unavailable`), 2000)
        //   return false
        // }
        return true
      }