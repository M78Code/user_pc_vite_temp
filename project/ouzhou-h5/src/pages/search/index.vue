<template>
	<div class='search-container'>
		<!-- 头部搜索 -->
		<div class="top_info_search">
			<input ref="input_ref" type="search" maxlength="15" placeholder="Search" v-model="input_value" />
			<img :src="compute_local_project_file_path('image/home/top_seach.png')" alt="" />
			<span class="clear_value" @click="clear_value">X</span>
			<span class="close_btn" @click="to_home">Close</span>
		</div>
		<!-- 搜索结果1 -->
		<div class="content" v-if="0">
			<div class="middle_info_tab">EXAMPLE SEARCHES</div>
			<ul class="list">
				<li>
					T20 Blast <img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
				</li>
				<li>
					T20 Blast <img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
				</li>
				<li>
					T20 Blast <img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
				</li>
			</ul>
		</div>
		<!-- 搜索结果2 -->
		<div class="content" v-if="1">
			<div class="middle_info_tab">
				<div @click="tabIndex = 1" :class="['tab', tabIndex === 1 ? 'active' : '']">Soccer</div>
				<div @click="tabIndex = 2" :class="['tab', tabIndex === 2 ? 'active' : '']">Gaming</div>
			</div>
			<ul class="list">
				<li>
					<div class="list_top">
						<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
					</div>
					<div class="list_bottom">
						<div>
							<p>Man City  v  Inter Milan</p>
							<p>Sun 11 Jun 03:00</p>
						</div>
						<div>
							<div>
								1
							</div>
							<div>
								2
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="list_top">
						<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
					</div>
					<div class="list_bottom">
						<div>
							<p>Man City  v  Inter Milan</p>
							<p>Sun 11 Jun 03:00</p>
						</div>
						<div>
							<div>
								1
							</div>
							<div>
								2
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="list_top">
						<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
					</div>
					<div class="list_bottom">
						<div>
							<p>Man City  v  Inter Milan</p>
							<p>Sun 11 Jun 03:00</p>
						</div>
						<div>
							<div>
								1
							</div>
							<div>
								2
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<!-- 搜索结果3 -->
		<div class="content" v-if="0">
			<div class="middle_info_tab">
				<div @click="tabIndex = 1" :class="['tab', tabIndex === 1 ? 'active' : '']">Soccer</div>
				<div @click="tabIndex = 2" :class="['tab', tabIndex === 2 ? 'active' : '']">Gaming</div>
			</div>
			<div class="teams">
				<div class="title">View all soccer</div>
				<div class="middle_info_tab">TEAMS</div>
				<ul class="list1">
					<li>
						<div class="list_top">
							<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
						</div>
						<div class="list_bottom">
							<div>
								<p>Man City  v  Inter Milan</p>
								<p>Sun 11 Jun 03:00</p>
							</div>
							<div>
								<div>
									1
								</div>
								<div>
									2
								</div>
							</div>
						</div>
					</li>
					<li>
						<div class="list_top">
							<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
						</div>
						<div class="list_bottom">
							<div>
								<p>Man City  v  Inter Milan</p>
								<p>Sun 11 Jun 03:00</p>
							</div>
							<div>
								<div>
									1
								</div>
								<div>
									2
								</div>
							</div>
						</div>
					</li>
					<li>
						<div class="list_top">
							<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
						</div>
						<div class="list_bottom">
							<div>
								<p>Man City  v  Inter Milan</p>
								<p>Sun 11 Jun 03:00</p>
							</div>
							<div>
								<div>
									1
								</div>
								<div>
									2
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
			<div class="teams">
				<div class="middle_info_tab">TEAMS</div>
				<ul class="list1">
					<li>
						<div class="list_top">
							<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
						</div>
						<div class="list_bottom">
							<div>
								<p>Man City  v  Inter Milan</p>
								<p>Sun 11 Jun 03:00</p>
							</div>
							<div>
								<div>
									1
								</div>
								<div>
									2
								</div>
							</div>
						</div>
						<div class="list_top">
							<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
						</div>
						<div class="list_bottom">
							<div>
								<p>Man City  v  Inter Milan</p>
								<p>Sun 11 Jun 03:00</p>
							</div>
							<div>
								<div>
									1
								</div>
								<div>
									2
								</div>
							</div>
						</div>
					</li>
					<li>
						<div class="list_top">
							<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
						</div>
						<div class="list_bottom">
							<div>
								<p>Man City  v  Inter Milan</p>
								<p>Sun 11 Jun 03:00</p>
							</div>
							<div>
								<div>
									1
								</div>
								<div>
									2
								</div>
							</div>
						</div>
						<div class="list_top">
							<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
						</div>
						<div class="list_bottom">
							<div>
								<p>Man City  v  Inter Milan</p>
								<p>Sun 11 Jun 03:00</p>
							</div>
							<div>
								<div>
									1
								</div>
								<div>
									2
								</div>
							</div>
						</div>
					</li>
					<li>
						<div class="list_top">
							<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
						</div>
						<div class="list_bottom">
							<div>
								<p>Man City  v  Inter Milan</p>
								<p>Sun 11 Jun 03:00</p>
							</div>
							<div>
								<div>
									1
								</div>
								<div>
									2
								</div>
							</div>
						</div>
						<div class="list_top">
							<span>T20 Blast </span><img :src="compute_local_project_file_path('image/svg/right_arrow.svg')" alt="">
						</div>
						<div class="list_bottom">
							<div>
								<p>Man City  v  Inter Milan</p>
								<p>Sun 11 Jun 03:00</p>
							</div>
							<div>
								<div>
									1
								</div>
								<div>
									2
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<!-- 搜索结果4 -->
		<div class="content" v-if="0">
			<div class="middle_info_tab">No results found. please try a different search term.</div>
			<div class="not_found">
				<img :src="compute_local_project_file_path('image/png/not_found.png')" alt="">
				<p>No results</p>
			</div>
		</div>
	</div>
</template>
<script setup>
import { ref } from 'vue';
import { compute_local_project_file_path } from  "src/core/";
import router from "../../router";
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
.content {
	color: #1A1A1A;
}
.middle_info_tab {
	padding: 10px 18px;
	display: flex;
	border-bottom: 1px solid #FF7000;
	background-color: #fff;
	font-size: 14px;
	font-weight: 500;
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
li {
	margin: 8px 0;
	padding: 14px 10px;
	background-color: #fff;
	border-radius: 6px;
	font-size: 14px;
	// img {
	// 	vertical-align: text-top;
	// }
	.list_top {
		margin-bottom: 19px;
		font-size: 14px;
		font-weight: 500;
	}
	.list_bottom {
		display: flex;
		div p:first-child {
			font-size: 14px;
		}
		div p:last-child {
			color: #8A8986;
		}
	}
}
.list1 {
	margin-bottom: 8px;
	li {
		margin: 0;
		border-radius: 0;
	}
}
.list {
	padding: 0 10px;
	height: 100vh;
}
.teams {
	.title {
		height: 36px;
		line-height: 36px;
		padding-left: 18px;
		font-weight: 500;
		font-size: 14px;
	}
	.middle_info_tab {
		font-size: 12px;
		font-weight: 600;
		color: #FF7000;
	}
}
.not_found {
	height: 100vh;
	text-align: center;
	margin: 86px 0;
	p {
		font-size: 16px;
		font-weight: 500;
	}
}
</style>
  
  