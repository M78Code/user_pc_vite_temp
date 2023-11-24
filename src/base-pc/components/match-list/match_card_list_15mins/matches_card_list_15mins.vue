<template>
  <div class="matches-card-list-wrap">
    <template2 :is_show_btn="matches_15mins_list.length > 4">
		<div class="matches-card-list" v-for="(item, index) in matches_15mins_list" :key="item.id">
			<MatchesCard15Mins :current_tab="get_match_info(item)"/>
			<div class="split-line" v-show="index != matches_15mins_list.length - 1"></div>
		</div>
    </template2>
	</div>
</template>

<script setup>
import template2 from 'src/base-pc/components/match-list/featured_matches/template2.vue';
import MatchesCard15Mins from './matches_card_15mins.vue';
import {onBeforeUnmount} from 'vue'
import {MatchDataWarehouse_ouzhou_PC_l5mins_List_Common} from 'src/core'
import use_match_list_ws from 'src/core/match-list-pc/composables/match-list-ws.js'
const {ws_destroyed,set_active_mids}= use_match_list_ws(MatchDataWarehouse_ouzhou_PC_l5mins_List_Common)
const props = defineProps({
	matches_15mins_list: {
		type: [ Array ],
		default: () => [],
	}
})
set_active_mids(JSON.parse(JSON.stringify(props.matches_15mins_list)))

const get_match_info = (mid) => {
	return MatchDataWarehouse_ouzhou_PC_l5mins_List_Common.get_quick_mid_obj(mid)
}

onBeforeUnmount(()=>{
	ws_destroyed()
})
</script>

<style lang="scss" scoped>
	.matches-card-list-wrap {
		background: var(--q-gb-bg-lg-1);
		padding: 25px 12px 13px 12px;
		box-sizing: border-box;
		width: 100%;
		height: 150px;
		display: flex;
		align-items: center;
		.matches-card-list {
			display: flex;
			align-items: center;
			cursor: pointer;
		}
		.split-line {
			flex-shrink: 0;
			width: 0.5px;
			height: 80px;
			background: var(--q-gb-bg-c-10);
			margin:  0 24px;
		}
	}
</style>
