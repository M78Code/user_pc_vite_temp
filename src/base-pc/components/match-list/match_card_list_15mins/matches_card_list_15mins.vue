<template>
  <div class="matches-card-list-wrap">
    <template2 :is_show_btn="matches_15mins_list.length >= 4">
		<div class="matches-card-list" v-for="(item, index) in matches_15mins_list" :key="item.id">
			<MatchesCard15Mins :current_tab="item" />
			<div class="split-line" v-show="index != matches_15mins_list.length - 1"></div>
		</div>
    </template2>
	</div>
</template>

<script setup>
import template2 from 'src/base-pc/components/match-list/featured_matches/template2.vue';
import MatchesCard15Mins from './matches_card_15mins.vue';

const props = defineProps({
	matches_15mins_list: {
		type: [ Object, Array ],
		default: () => [],
	}
})
</script>

<style lang="scss" scoped>
	.matches-card-list-wrap {
		background: var(--q-gb-bg-lg-1);
		padding: 25px 12px;
		box-sizing: border-box;
		width: 100%;
		height: 150px;
		display: flex;
		align-items: center;
		.matches-card-list {
			display: flex;
			align-items: center;
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
