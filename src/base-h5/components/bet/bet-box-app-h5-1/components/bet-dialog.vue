<template>
    <q-dialog v-model="props.tooltipboxs">
        <div class="toltip" >
          <template v-if="id?.toString().trim().split('00')[1] == 1">
            <header>{{ i18n_t('app_h5.bet.toltip1')}}{{ item.name || item.seriesValue }}</header>
            <div> {{ item.name }}{{ i18n_t('app_h5.bet.toltip2')}}{{ item.name || item.seriesValue.trim().slice(0,1) }}{{ i18n_t('app_h5.bet.toltip3')}} </div>
            <div>
            {{ i18n_t('app_h5.bet.toltip4')}}
            {{ item.name || item.seriesValue.trim().slice(0,1) }} 
            {{ i18n_t('app_h5.bet.toltip5')}}
            {{ item.name || item.seriesValue}} 
            {{ i18n_t('app_h5.bet.toltip6')}}
            {{ item.name || item.seriesValue.trim().slice(0,1) }}
            {{ i18n_t('app_h5.bet.toltip7')}}
            {{ item.name || item.seriesValue.trim().slice(0,1) }}
            {{ i18n_t('app_h5.bet.toltip8')}}
            </div>
          </template>
          <template v-else>
            <header>{{ i18n_t('app_h5.bet.toltip1')}}{{ item.name || item.seriesValue }}</header>
            <div>{{ toltiptitle }}</div>
            <div>{{ toltipcontent }}</div>
          </template>
        <footer @click="handleClose">{{i18n_t("info_rules.i_know")}}</footer>
        </div>
    </q-dialog>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({ 
    item:{},
    tooltipboxs:Boolean,
    id:''
})
console.log(props.item,"-----")
const toltiptitle = computed(() => {
  return  i18n_t(`app_h5.bet.toltips.${props.id}.title`)
})
const toltipcontent = computed(() => {
  return  i18n_t(`app_h5.bet.toltips.${props.id}.content`)
})

const emits = defineEmits(["close"]);
const handleClose = ()=>{
    emits('close')
}
</script>

<style lang="scss" scoped>
  .toltip{
    background-color: var(--q-gb-bg-c-21);
    color: #414655;
    border-radius: 0.16rem;
    width: 3.2rem;
    padding: 0.2rem 0;
    margin: auto;
    > header{
      font-size: 0.16rem;
      color: var(--q-gb-t-c-18);;
      letter-spacing: 0;
      margin:0 0.2rem 0.1rem 0.2rem;
      font-weight: 700;
      text-align: center;
    }
    > div{
      margin:0.12rem 0.2rem;
      color:var(--q-gb-t-c-24);
      font-size:0.14rem;
    }
    > footer {
      font-size: 0.16rem;
      color: var(--q-gb-t-c-1);
      padding: 0.12rem 0.2rem 0;
      font-weight: 700;
      border-top: 1px solid var(--q-gb-bg-c-18);
      text-align: center;
    }
  }
</style>