<!--
 * @Date: 2023-12-14 
 * @Description: 虚拟体育详情tab
-->
<template>
  <div ref='details_tab' class="row vir-details-tab" v-cloak>
    <q-tabs v-model="viewTab" inline-label narrow-indicator class="bg-tabs" active-color="active-tab" @update:model-value="change_tab">
      <q-tab v-for="item in tab_list" :label="i18n_t(item.label_i18n_key)" :name="item.name" :key="item.id" />
    </q-tabs>

  </div>
</template>

<script>
export default {
  name: 'virtual_sports_detail_tab',
  props: {
    current_match :Object,
  },
  data() {
    return {
      viewTab: 'bet',
      tab_list: [
        { label_i18n_key: 'virtual_sports.match_detail.historical_results', id: 1, name: 'lszj' },
        { label_i18n_key: 'virtual_sports.match_detail.bet', id: 2, name: 'bet' },
        { label_i18n_key: 'virtual_sports.match_detail.leaderboard', id: 3, name: 'rank' }
      ]
    }
  },
  methods: {
    change_tab (val){
      this.viewTab =val
      this.$emit('change_tab',val)
    }
  },
  watch: {
    // 赛马详情，不显示排行榜
    "current_match": {
      handler(new_){
        console.log('new_', new_, new_?.csid);
        
        if(new_?.csid == "1011"){
          this.tab_list = [
          { label_i18n_key: 'match_detail.bet', id: 2, name: 'bet' },
          { label_i18n_key: 'match_detail.historical_results', id: 1, name: 'lszj' },
          ]
        }
      },
      immediate: true
    }
  },
}
</script>
<style lang="scss" scoped>
.vir-details-tab {
  height: 0.4rem;
  margin-bottom: 0.04rem;
  width: 100%;
}
.bg-tabs {
  width:100%;
  background: var(--q-gb-bg-c-15);
  
.bg-active-tab {
  background: var(--q-gb-bg-c-15);

}
}
:deep(.q-tab) {
  min-height: 0.4rem;
  height: 0.4rem;

  &.text-active-tab {
    .q-tab__label {
      font-weight: bolder;
      color: var(--q-gb-t-c-1);
    }
  }

  .q-tab__indicator {
  color: var(--q-gb-bg-c-13);
  border-radius: 1.5px;
  z-index: 1;
}
  .q-tab__label {
    font-size: 0.14rem;
    color: var(--q-gb-t-c-19);
    
  }
}

.menu-third {
  padding-right: 0.1rem;
  height: 0.4rem;
  line-height: 0.4rem;
  position: relative;
  float: left;
  text-align: center;

  &:after {
    content: ' ';
    display: block;
    width: 1px;
    height: 0.21rem;
    position: absolute;
    top: 0.1rem;
  }
}

.tab-fixed {
  position: fixed;
  top: 2.04rem;
  z-index: 90;
}
</style>