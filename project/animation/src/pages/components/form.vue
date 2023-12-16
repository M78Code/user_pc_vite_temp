<template>
  <div class="top">
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md form"
      ref="form"
    >
      <span class="label text-white">赛种ID</span>
      <input
        v-model="form.sportId"
      />
      <span class="label text-white">赛事id</span>
      <input
        v-model="form.matchId"
      />
      <span class="label text-white">数据源</span>
      <input
        v-model="form.dataSourceCode"
      />
      <span class="label text-white">token</span>
      <input
        v-model="form.token"
      />
      <q-btn v-show="!isStart" label="启动" type="submit" color="primary" flat class="q-ml-sm"/>
      <q-btn v-show="isStart" label="停止"  color="primary" flat class="q-ml-sm" @click="pause" />
<!--      <q-btn label="清空" type="reset" color="primary" flat class="q-ml-sm" />-->
      <q-btn label="清空" color="primary" flat class="q-ml-sm"  @click="reset" />
      <q-btn v-show="!isMoNiEmit" label="模拟推送" color="primary" flat class="q-ml-sm"  @click="emitEvent" />
      <q-btn v-show="isMoNiEmit" label="暂停模拟推送" color="primary" flat class="q-ml-sm"  @click="emitPauseEvent" />
    </q-form>
  </div>
</template>
<script>
export default {
  data(){
    return {
      isStart: false,
      isMoNiEmit: false,
      form: {
        sportId: '1',
        matchId: '2952300',
        dataSourceCode: 'RB',
        token: 'bea5eddf73b1549cb330af08cd5255fd7b3e2ba4',
      },
    };
  },
  methods: {
    validate(){
      
    },
    onSubmit () {
      this.$refs.form.validate()
        .then(success => {
          if (success) {
            sessionStorage.setItem("formData",JSON.stringify(this.form))
            console.log(this.form)
            this.isStart = true
            this.$emit('submit', this.form)
          } else {
          }
        })
    },
    onReset () {
      // this.form = {
      //   sportId: '',
      //   matchId: '',
      //   dataSourceCode: '',
      //   token: '',
      // }
      // this.$emit('submit', this.form)
    },
    pause(){
      this.isStart = false
      this.$emit('pause')
    },
    reset(){
      this.form = {
        sportId: '',
        matchId: '',
        dataSourceCode: '',
        token: '',
      }
      this.$emit('reset')
    },
    emitEvent(){
      this.isMoNiEmit = true
      this.$emit('emitEvent')
    },
    emitPauseEvent(){
      this.isMoNiEmit = false
      this.$emit('emitPauseEvent')
    }
  }
}
</script>
<style scoped lang="scss">

.top {
  margin-top: 20px;
  margin-bottom: 20px;
  //background: #fff;
  padding-left: 20px;
}

.form {
  display: flex;
  align-items: center;
}
</style>