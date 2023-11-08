<template>
	<div class='search-container'>
		<div class="top_info_search">
			<input type="search" maxlength="15" placeholder="Search" v-model="input_value" />
			<img :src="compute_local_project_file_path('image/home/top_seach.png')" alt="" />
			<span class="clear_value" @click="clear_value">X</span>
			<span class="close_btn" @click="to_home">close</span>
		</div>
		<div class="middle_info_tab">
			<div :class="['tab', tabIndex === 1 ? 'active' : '']">Soccer</div>
			<div :class="['tab', tabIndex === 2 ? 'active' : '']">Gaming</div>
		</div>
		<ul class="list">
			<li>
				T20 Blast <img src="" alt=""><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
			</li>
			<li>
				T20 Blast <img src="" alt=""><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
			</li>
			<li>
				T20 Blast <img src="" alt=""><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
			</li>
		</ul>
	</div>
</template>
<script setup>
import { ref } from 'vue';
import { compute_local_project_file_path } from  "src/core/";
import router from "../../router";
const search_match = (item) => {
  console.error(item);
};
const input_value = ref('');
const clear_value = () => {
	input_value.value = '';
}
const to_home = () => {
	router.push('/')
}
const tabIndex = ref(1);
</script>
<style lang="scss" scoped>
.search-container {
	background-color: #E2E2E2;
}
.top_info_search {
    position: relative;
    padding-left: 20px;
		height: 50px;
		line-height: 50px;
		width: 100%;
		background-color: #ff8b33;
    img {
      position: absolute;
      left: 35px;
      top: 20px;
      width: 12px;
      height: 12px;
			color: #fff;
    }
    input {
      border: 1px solid #CE5B00;
      border-radius: 20px;
      width: 300px;
      height: 30px;
      padding-left: 30px;
      background: #CE5B00;
      outline: none;
      color: #fff;
			margin-right: 6px;
			font-weight: 500;
    }
    ::-webkit-input-placeholder {
      color: #ffffff;
      font-size: 14px;
      padding-left: 5px;
    }
		.clear_value {
			position: absolute;
			right: 70px;
			top: 0px;
			color: #fff;
			font-size: 14px;
		}
		.close_btn {
			color: #fff;
			opacity: .8;
			font-size: 14px;
		}
}
.middle_info_tab {
	padding: 10px 18px;
	display: flex;
	border-bottom: 1px solid #FF7000;
	background-color: #fff;
	.tab {
		width: 70px;
		height: 24px;
		line-height: 24px;
		background-color: #FFf;
		border-radius: 20px;
		margin-right: 10px;
		text-align: center;
		font-weight: 600;
		&:last-child {
			margin-right: 0;
		}
		&.active {
			background-color: #FF7000;
			color: #fff;
		}
	}
}
.list {
	padding: 8px 10px;
	height: 100vh;
	li {
		margin: 8px 0;
		padding: 14px 10px;
		background-color: #fff;
		border-radius: 6px;
		img {
			vertical-align: text-top;
		}
	}
}
</style>
  
  