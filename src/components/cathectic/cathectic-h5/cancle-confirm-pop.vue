<!--
 * @Author: 
 * @Date:  
 * @Description: 
-->
<template>
    <div v-if="show" class="cancle-confirm-pop fullscreen" @click.self="change_show" @touchmove.prevent>
        <div class="main-box fixed-center text-center">
        <p class="text-left yb_fontsize14">{{$root.$t("pre_record.confirm_matchinfo",[teamname])}}</p>
        <footer class="yb_fontsize16">
            <span class="cancle-button button" @click.self="cancle_handle">{{$root.$t("common.cancel")}}</span>
            <span class="confirm-button button" @click.self="confirm_handle">{{$root.$t("common.ok")}}</span>
        </footer>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'cancle_confirm_pop',
    props:{
        show:{                  // 是否显示
            type:Boolean,
            default: () => {
                return false
            }
        },
        teamname:String         // 队伍名称
    },
    // confirmHandle 确定方法
    // cancleHanddle 取消方法

    emits: ['confirmHandle', 'cancleHandle'],
    setup(props, evnet) {
        // 确定方法
        confirm_handle = () => {
            emit('confirmHandle')
        },
        // 取消方法
        cancle_handle = () => {
            emit('cancleHanddle')
        }
        /**
         *@description 取消合并投注项提示弹框展示
        */
        change_show = () => {
        // this.set_combine_tips_show(false)
        }
        return {
            change_show,
            confirm_handle,
            cancle_handle,
        }
    }
    
})

</script>
<style lang="scss" scoped>
.cancle-confirm-pop {
z-index: 8000 !important;
}
.main-box {
width: 3.2rem;
box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
border-radius: 0.1rem;
padding: 0.42rem 0.2rem 0;

p {
line-height: 0.24rem;
margin-bottom: 0.26rem;
text-align: center;
}

footer {
display: flex;
margin-bottom: 0.28rem;
justify-content: space-between;
.button{
border-radius: 0.18rem;
flex: 1;
font-size: 0.16rem;
text-align: center;
height: 0.36rem;
line-height: 0.36rem;
}
.cancle-button{
margin-right: 0.2rem;
}
}
}
</style>