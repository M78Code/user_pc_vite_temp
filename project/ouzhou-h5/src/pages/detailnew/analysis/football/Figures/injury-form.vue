<script setup name="injury-form">
const props = defineProps({
    list_data: {
        type: Array,
        default: () => [],
    },
})
</script>

<template>
    <div class="public_form">
        <!-- 头部 -->
        <div class="header">
            <div class="col1">{{i18n_t('analysis_football_matches.player')}}</div>
            <div class="col2">{{i18n_t('analysis_football_matches.position')}}</div>
            <div class="col3">{{ i18n_t('analysis_football_matches.reason') }}</div>
        </div>
        <!-- 主内容 -->
        <template v-if="list_data?.length">
            <div class="team-item" v-for="(item, i) in list_data" :key="i">
                <div class="col1">{{item.playerName}}</div>
                <div class="col2">{{item.positionName}}</div>
                <div class="col3">{{item.reason}}</div>
            </div>
        </template>
    </div>
</template>

<style lang="scss" scoped>
// 头部
.public_form {
    position: relative;

    .header {
        height: 0.3rem;
        display: flex;
        text-align: left;
        line-height: 0.32rem;
        padding: 0 0.1rem;

        .col1 {
            padding-left: 0.25rem;
        }

        > div {

            font-size: 0.1rem;
        }

        .sort-flag {
            width: 0.09rem;
        }
    }

    .team-item {
        display: flex;
        align-items: center;
        padding: 0 0.1rem;
        font-size: 0.13rem;
        height: 0.48rem;
        text-align: left;

        &:nth-child(odd) {

        }

        div {
            font-size: 0.12rem;
        }
    }

    .col1 {
        flex: 0 0 1.5rem;
    }

    .col2 {
        flex: 0 0 0.6rem;
    }

    .col3 {
        flex: 1;
    }
}
</style>
