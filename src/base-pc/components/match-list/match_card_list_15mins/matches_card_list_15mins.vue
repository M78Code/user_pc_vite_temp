<!--
 * @Author: lockie
 * @Date: 2023-07-01 14:05:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-15 23:24:12
 * @FilePath: \user-pc-vue3\src\components\match_list\match_card_list_15mins\matches_card_list_15mins.vue
-->
<template>
  <div class="matches-card-list-wrap">
		<template v-for="(item, index) in matches_15mins_list" :key="item.id">
			<MatchesCard15Mins :current_tab="item" />
			<div class="split-line" v-show="index != matches_15mins_list.length - 1"></div>
		</template>
	</div>
</template>

<script setup>

	import { ref } from 'vue';

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
		background: linear-gradient(272.18deg, #FFF1E6 0%, #FFFFFF 100%);
		padding: 25px 21px 25px 12px;
		box-sizing: border-box;
		width: 100%;
		height: 150px;
		display: flex;
		align-items: center;
		.split-line {
			flex-shrink: 0;
			width: 0.5px;
			height: 80px;
			background: #D9D9D9;
			margin:  0 24px;
		}
	}
</style>
