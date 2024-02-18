<template>
    <div>
        <div class="header">
          <GoBackSvg class="go-back" @click="go_back" />
            <span class="title">
                {{$root.$t('common.rule_description')}}
            </span>
        </div>
        <rule-wapper v-if="domain" use_component_key="Rule_h5"></rule-wapper>
        <error01 v-else></error01>
    </div>
    
</template>

<script setup>
import { RuleWapper } from 'src/components/rule'
import { useRouter, useRoute } from "vue-router";
import {compute_local_project_file_path} from "src/output/index.js";
import GoBackSvg from 'src/components/go_back/index.vue'
import error01 from "src/components/error/error01.vue";
import UserCtr from 'src/core/user-config/user-ctr.js'
const router = useRouter();
const domain = UserCtr.get_topic_key_url('sports_rules');
const go_back = () => {
    router.push({ name: "matchList" });
}

</script>
<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  padding-left: 0.15rem;
  padding-top: 0.01rem;
  position: relative;
  height: 0.44rem;
  position: fixed;
  width: 100%;

  .go-back {
    color: #A3A3A3;
  }

  .title {

    font-size: 0.16rem;
    color: var(--q-gb-t-c-18);
    text-align: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>