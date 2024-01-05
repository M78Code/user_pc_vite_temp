<template>
  <div class="skeleton-wrap virtual">
    <q-scroll-area :style="`height:100%`" :thumb-style="thumbStyle">
      <div class="center">
        <div class="first">
          <skeleton :width="1.02" :height="0.08" :radius="5"/>
          <skeleton :width="1.02" :height="0.08" :radius="5"/>
          <skeleton :width="1.02" :height="0.08" :radius="5"/>
        </div>
        <div class="rect row justify-center">
          <skeleton :width="3.59" :height="2.1" :radius="5"/>
        </div>
        <div class="first">
          <skeleton :width="1.02" :height="0.08" :radius="5"/>
          <skeleton :width="1.02" :height="0.08" :radius="5"/>
          <skeleton :width="1.02" :height="0.08" :radius="5"/>
        </div>
      </div>


      <!-- 标准版 -->
      <div class="version_biaozhun" v-if="standard_edition == 2">
        <div v-for="(item, index) in 6" :key="index" class="item">
          <div class="wrap">
            <div class="left">
              <skeleton :width="1.51" :height="0.1" :radius="6"/>
              <skeleton :width="1.51" :height="0.1" :radius="6"/>
              <skeleton :width="1.1" :height="0.1" :radius="6"/>
            </div>
            <div class="content">
              <div class="content-wrap">
                <div>
                  <skeleton :width="0.6" :height="0.32" :radius="2"/>
                  <skeleton :width="0.6" :height="0.32" :radius="2"/>
                  <skeleton :width="0.6" :height="0.32" :radius="2"/>
                </div>
                <div>
                  <skeleton :width="0.6" :height="0.49" :radius="2"/>
                  <skeleton :width="0.6" :height="0.49" :radius="2"/>
                </div>
                <div>
                  <skeleton :width="0.6" :height="0.49" :radius="2"/>
                  <skeleton :width="0.6" :height="0.49" :radius="2"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 简版 -->
      <div class="version_jian" v-if="standard_edition == 1">
        <div v-for="(item, index) in 6" :key="index" class="item">
          <div class="item-row">
            <div class="row-left">
              <skeleton :width="1.51" :height="0.1" :radius="6"/>
              <skeleton :width="1.51" :height="0.1" :radius="6"/>
            </div>
            <skeleton :width="1.7" :height="0.56" :radius="4"/>
          </div>
          <div class="item-row">
            <div class="row-left">
              <skeleton :width="1.51" :height="0.1" :radius="6"/>
              <skeleton :width="1.51" :height="0.1" :radius="6"/>
            </div>
            <skeleton :width="1.7" :height="0.56" :radius="4"/>
          </div>
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>

<script>
import skeleton from 'src/base-pc/vr/components/skeleton/index.vue'
import UserCtr from "src/core/user-config/user-ctr.js"; 

export default {
  components:{ skeleton },
  computed:{
    // ...mapGetters(["get_newer_standard_edition"]),
    // get_newer_standard_edition(){ return ''}
    standard_edition(){return UserCtr.standard_edition},
  },
  data(){
    return {
      thumbStyle:{
        background: "transparent",
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.virtual {
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  top: 1.1rem;
  width: 3.75rem;
  height: 100%;
  transform: unset;

  .center {
    margin-bottom: 0.08rem;

    .first {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 0.4rem;

      & > div {
        margin-right: 0.15rem;

        &:last-child {
          margin-right: 0;
        }
      }
    }

    .rect {
      height: 2.1rem;
      width: 100%;
    }
  }

  .version_biaozhun {
    padding: 0 0.07rem;
    margin-bottom: 0.4rem;

    .item {
      padding: 0 0.08rem;
      margin-bottom: 0.08rem;
      border-radius: 0.08rem;

      .wrap {
        height: 1.2rem;
        display: flex;
        justify-content: space-between;
        padding-top: 0.1rem;

        .left {
          margin-right: auto;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }

        .content {
          .content-wrap {
            display: flex;

            & > div {
              margin-right: 0.02rem;

              &:last-child {
                margin-right: 0;
              }

              & > div {
                margin-bottom: 0.02rem;

                &:last-child {
                  margin-bottom: 0;
                }
              }
            }
          }
        }
      }
    }
  }

  .version_jian {
    padding: 0 0.07rem;
    margin-bottom: 0.4rem;

    .item {
      padding: 0 0.08rem;
      margin-bottom: 0.08rem;
      border-radius: 0.08rem;

      .item-row {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 0.76rem;

        .row-left {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          margin-right: 0.24rem;
          height: 100%;
        }
      }
    }
  }
}
</style>
