<template>
    <div>
        <div class="header">
            <div class="go-back" @click="go_back">
                <img
                    class="img"
                    :src="compute_local_project_file_path('/image/svg/go-back-icon.svg')"
                    alt=""
                />
            </div>
            <span class="title">
                {{$root.$t('common.rule_description')}}
            </span>
        </div>
        <rule-wapper use_component_key="Rule_h5"></rule-wapper>
    </div>
    
</template>

<script setup>
import { RuleWapper } from 'src/components/rule'
import { useRouter, useRoute } from "vue-router";
import {compute_local_project_file_path} from "src/output/index.js";

const router = useRouter();

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

  .go-back {
    align-items: center;
    display: flex;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    justify-content: flex-start;
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