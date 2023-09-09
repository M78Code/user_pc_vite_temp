<!--
 * @
 * @Author: Yellow
 * @Description: 自定义下拉框
 * @Date: 2020-09-29 11:08:05
-->
<template>
  <div class="y-select handel  relative-position" :class="versions_class" @click.stop>
    <div class="y-field-control" @click="isShow = true" :style="{width: `${popWidth}px`}">
			<input 
			type="text" 
			class="input" 
			v-model="input_val" 
			@input="ipt_change"
			@blur="ipt_blur"
			@focus="ipt_focus"
			:class="{'is_select': is_select}" 
			:placeholder="$root.$t('select.placeholder')"/>
      <icon name="icon-search" color="#99A3B1" size="12px"/>
		</div>
		
		<div class="select-content" v-if="isShow">
			<div class="top-btn ">
				<!-- 全选 -->
				<div class="btn-item" @click="checkAll()">
					<div :class="{'active': menu == 'all'}"  class="radio-checked"/>
					<span class="">{{$root.$t("select.checkAll")}}</span>
				</div>
				<!-- 反选 -->
				<div class="btn-item" @click="checkInvert()">
					<div :class="{'active': menu == 'invert'}"  class="radio-checked" />
					<span class="">{{$root.$t("select.invert")}}</span>
				</div>
				<!-- 热门 -->
				<div class="btn-item checkbox" @click="checkHot()">
					<div class="y-checkbox " :class="{'active': is_hot}"   />
					<span>{{$root.$t("select.hot")}}</span>
				</div>
			</div>
			<q-scroll-area :style="{'flex':'1'}">
				<div 
					class="wrap-item" 
					v-for="(item,index) in list" 
					:key="`select_${index}`" 
					:class="{'active':item.id==active}"
					@click="choose(item, index)"
				>
					<div 
					class="y-checkbox" 
					:class="{'active': active_tournament.includes(item.id)}" />
					<div class="select-item ">{{item.tournamentName}}</div>
				</div>
			</q-scroll-area>
			<div class="btn-confrim">
				<span class="cancel" @click="cancel">{{$root.$t("select.cancel")}}</span>
				<span @click="confrim()">{{$root.$t("select.confirm")}}</span>
			</div>
		</div>
		
  </div>
</template>

<script>
// import { mapGetters } from "vuex";
export default {
	data () {
		return {
			option: "",//选中项
			isShow: false, // 是否展示联赛列表
			active: "",//选择的下标
			active_tournament:[],//选中项的id
			shape: "all",//默认全选
			menu: 'all',//全选、反选、热门
			is_select: false,//是否筛选
			input_val: "",
			timer: null, //定时器
			isSearch: false,//是否模糊查询
			is_hot: false,//是否热门
			copy_list: [], // 复制一份完整的 list
			copy_id: [],
			new_list: [],
			isConfirm: false, // 是否已经点了确认
			targetSport: false,
			inputOldVal: '', // 输入框 focus 时的旧值
			init: false, // 是否处理从 url 获取的数据
			selectedIds: [], // 已选中的联赛
			initSport: 0, // 当前更新是否是切换球种
			isAllSelect: 1, // 1 全选 0反选
			itemAllSelect: 'all', // 针对选项的判断 all 全部选中  part 部分选中
		}
	},
	props:{
		list: {//下拉框子项
			type: Array,
			default: []
		},
		sport_id: String,//球类id
		popWidth: String,//宽度
		hideSelect: Number, // 隐藏下拉框
		isTimeChanged: Boolean, // 判断时间是否有变
	},
	methods:{
		/**
		* @description: input获取焦点
		*/
		ipt_focus(){
			this.$emit('confirm', 0)
			this.$emit('to_hide_select');
			// 获取焦点时会获取联赛列表，同时会触发 list 的监听，所以需要修改此标记
			this.initSport = 0;
			// 获取焦点时保留旧的值
			this.inputOldVal = this.input_val;
			if(this.input_val == this.$root.$t("select.all")){
				this.input_val = ""
				this.isSearch = false
				this.is_select = false;
			}
			if (this.input_val == this.$root.$t("select.filter")) {
				this.input_val = "";
				// this.menu = ""
			}
			// 如果是跳转过来赛果的，就不请求全部
			// 当前是筛选状态也不请求全部，保留当前状态
			// this.inputOldVal != this.$root.$t("select.filter")
			if (!this.targetSport) {
				this.$emit("ipt_search", this.input_val, Number(this.is_hot))
			}
		},
		/**
		* @description: input失去焦点
		*/
		ipt_blur(){
			// if(this.input_val == ""){
			// 	this.$emit('confirm', 0)
			// 	// this.input_val = this.$root.$t("select.all")
			// 	if (this.inputOldVal == this.$root.$t("select.filter")) {
			// 		this.is_select = true;
			// 	} else {
			// 		this.is_select = false;
			// 	}
			// 	this.input_val = this.inputOldVal;
			// }
		},
		/**
		* @description: 监听input输入
		* @param {String} val input值
		*/
		ipt_change(){
			this.$emit('confirm', 0)
			//'','全部','已筛选'
			if(['', this.$root.$t("select.all"), this.$root.$t("select.filter")].includes(this.input_val)){
				this.isSearch = false
			} else {
				this.isSearch = true
			}

			if (this.timer) {
				clearTimeout(this.timer)
				this.timer =null
			};
			// 输入完之后把当前已选中的联赛清空
			this.active_tournament.length = 0;
			this.timer = setTimeout(() => {
				this.$emit("ipt_search", this.input_val, Number(this.is_hot))
			}, 500);
		}, 
		/**
		* @description: 全选
		* @param {}
		* @return {undefined} undefined
		*/
		checkAll(){
			this.$emit('confirm', 0)
			this.list && this.list.forEach(item =>{
				if(!this.active_tournament.includes(item.id)){
					this.active_tournament.push(item.id)
				}
			})
			// 全选
			this.menu = "all"
			this.isAllSelect = 1;
		},
		/**
		* @description: 反选
		* @param {}
		* @return {undefined} undefined
		*/
		checkInvert(){
			// 如果当前选中状态是反选并且没有联赛就不予处理
			if(this.menu == "invert" && !this.list) return false
			this.$emit('confirm', 0)
			this.list && this.list.forEach(item =>{
				if(!this.active_tournament.includes(item.id)){
					this.active_tournament.push(item.id)
				} else {
					this.active_tournament.splice(this.active_tournament.indexOf(item.id), 1)
				}
			})
			this.menu = "invert"
			this.isAllSelect = 0;
		},

		/**
		* @description: 热门
		* @return {}
		* @param {n} 1 初始化联赛选中状态 0 正常处理
		*/
		checkHot(n){
			this.$emit('confirm', 0)
			this.menu = 'hot'
			this.initSport = n;
			if (n == 1) {
				this.is_hot = false;
				this.is_select = false;
				this.init = true;
				this.active_tournament.length = 0
				this.checkAll();
				this.input_val = this.$root.$t("select.all")
			} else {
				this.init = false;
				this.is_hot = !this.is_hot
				this.$emit("search_hot", Number(this.is_hot))
			}
		},
		/**
		 * @description: 展开联赛下拉框
		 * @return {undefined} undefined
		 */
		show_menu(){
			this.isShow = !this.isShow
		},
		
		/**
		 * @description: 勾选联赛
		 * @param {}
		 * @return {undefined} undefined
		 */
		choose(item, index){
			if(this.active_tournament.includes(item.id)){
				this.active_tournament.splice(this.active_tournament.indexOf(item.id), 1)
			} else {
				this.active_tournament.push(item.id)
			}
			// 是否全部选中
			let allSelect = this.list.every(item => this.active_tournament.includes(item.id));
			this.menu = allSelect ? 'all' : ''
		},

		/**
		* @description: 取消并收起联赛下拉框
		*/
		cancel(){
			this.$emit('confirm', 0)
			this.isShow = false
		},
		/**
		* @description: 确认
		*/
		confrim(){
			this.$emit('confirm', 1);
			if( this.isSearch ){
				this.is_select = true
				this.input_val = this.$root.$t("select.filter")
			} else {
				// 点击筛选确认按钮时，如果输入框值为空（全部）则查询全部
				if(this.active_tournament.length == (this.list ? this.list.length : 0) && !this.is_hot){
					this.is_select = false
					this.input_val = this.$root.$t("select.all")//全部
				} else {
					this.is_select = true
					this.input_val = this.$root.$t("select.filter") //已筛选
				}
			}
			// 点击确认的时候，上一次选中的联赛换成最新选中的联赛
			if (this.selectedIds.length) {
				this.active_tournament = _.cloneDeep(this.selectedIds)
			}
			this.isShow = false;
			this.$emit("select_submit", {ids: this.active_tournament, isHot: Number(this.is_hot), cur_type: this.menu});
		},
	},
	computed:{
		// ...mapGetters(['get_global_click']),
		versions_class(){
			return `versions-${window.env.config.DEFAULT_VERSION_NAME}`
		}
	},
	created(){
		this.input_val = this.$root.$t("select.all")
		this.$root.$on("show_select", this.cancel)
		this.$root.$on('init_select', this.checkHot)
	},
	watch:{
		list:{
			handler(res){
				// 是否有已选中联赛
				let _no_active = this.active_tournament.length == 0;
				// 当前是不是反选
				let is_invert = this.menu == 'invert';
				// 如果当前没有已选中的联赛，就清空备用数据
				if (_no_active) {
					this.selectedIds.length = 0;
				}
				// 如果有已选中联赛并且当前是切换球种，就清空选中
				if (!_no_active && this.initSport == 1) {
					_no_active = true;
					// this.active_tournament.length = 0;
					this.selectedIds.length = 0;
				}
				let tournamentName, {tid} = this.$route.query;
				let active_item = null;
				if (res && res.length) {
					// 如果条件有变，就清空已选中id
					if (_no_active
							|| this.isTimeChanged
							|| this.is_hot
							|| this.itemAllSelect == 'all') {
						this.active_tournament.length = 0;
					}
					res.filter((item, i) =>{
						if (this.input_val == this.$root.$t("select.all")) {
							this.copy_list[i] = item;
							this.copy_id[i] = item.id;
						}
						// 如果没有已选中的联赛
						// 或者时间有变化
						// 或者当前为热门并且是全部选中状态
						// 或者当前是全部选中状态，就重新全部选中
						if (_no_active
								|| this.isTimeChanged
								|| this.is_hot
								|| this.itemAllSelect == 'all') {
							// 当前不是反选才进行全选操作
							if (!is_invert || this.menu == '') {
								if (!this.active_tournament.includes(item.id)) {
									this.active_tournament.push(item.id)
								}
							}
						}
						if(tid == item.id) {
							tournamentName = item.tournamentName;
							return true;
						}
						return item.tournamentName == this.option 
					});
				}
				this.targetSport = false;
				// 如果是跳转过来的则需要带上条件			
				if(tournamentName && !this.init) {
					this.active_tournament = [tid];
					this.option = tournamentName;
					this.active = tid;
					this.is_select = true;
					this.menu = "";
					this.targetSport = true; // 跳转过来的
					this.input_val = this.$root.$t("select.filter") //已筛选
					this.isShow = false
					this.$emit("select_submit", {ids: this.active_tournament, isHot: Number(this.is_hot), cur_type: this.menu});
				} else if(active_item && active_item.length){
					this.option = active_item[0].tournamentName
					this.active = active_item[0].id
				} else if(!tid){
					if (this.isAllSelect && this.itemAllSelect == 'all') {
						this.menu = 'all';
						this.active = ""
					} else {
						this.menu = "";
					}
				}
			},
			immediate: true
		},
		sport_id:{
			handler(res){
				this.is_select = false
				this.menu = "all"
				this.input_val = this.$root.$t("select.all")//全部
			}
		},
		hideSelect: {
			handler(n) {
				this.isShow = false;
			}
		},
		// 全局点击事件
		get_global_click(){
			this.isShow = false
		},
		active_tournament: {
			handler(arr) {
				let allSelect = this.list.every(item => arr.includes(item.id))
				// 热门全部选中和部分选中要区分开来
				if (this.is_hot) {
					this.itemAllSelect = allSelect ? this.list.length == arr.length ? 'all' : 'part' : 'part';
				} else  {
					this.itemAllSelect = allSelect ? 'all' : 'part';
				}
			},
			deep: true
		}
	},
	destroyed(){
		this.$root.$off("show_select", this.cancel)
		this.$root.$off('init_select', this.checkHot)
		clearTimeout(this.timer);
		this.active_tournament = null;
	}
}
</script>

<style lang="scss" scoped>
.y-select {
  position: relative;

  /*************** 下拉框展示框 *************** -S*/
  .y-field-control {
    border: 1px solid #d0d8de;
    border-radius: 2px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 15px;
    cursor: pointer;
  }
}
.input {
  position: relative;
  top: 0;
  right: 5px;
  width: 120px;
  height: 26px;
  border: none;
  outline: medium;
  background: transparent;
  color: #5a6074;

  /*************** 下拉选项 *************** -S*/
}
.select-content {
  position: absolute;
  top: 33px;
  left: 0;
  min-width: 321px;
  height: 314px;

  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
  background: #ffffff;

  z-index: 2;
  display: flex;
  flex-direction: column;
  .top-btn {
    display: flex;
    align-items: center;
    height: 34px;
    padding: 0 15px;
    color: #333333;
    font-size: 12px;
    font-weight: 500;
    border: 1px solid #d0d8de;
    border-radius: 2px 2px 0 0;
    .btn-item {
      margin-right: 17px;
      cursor: pointer;
      display: flex;
      align-content: center;
      span {
        line-height: 14px;
      }
      .radio-checked,
      .y-checkbox {
        width: 14px;
        height: 14px;
        margin-right: 5px;
        background-size: 100%;
        background-repeat: no-repeat;
      }
    }
  }
  .wrap-item {
    padding: 0px 15px;
    min-height: 34px;
    cursor: pointer;
    display: flex;
    align-items: center;
    border-left: var(--qq--theme-bd-y-select);
    border-right: var(--qq--theme-bd-y-select);
    .select-item {
      border: none;
    }
    &:hover {
      background-color: #e3e9ee;
    }
    .y-checkbox {
      width: 14px;
      height: 14px;
      margin-right: 8px;
      background-size: 100%;
      background-repeat: no-repeat;
    }
    &.checked {
      background: red;
    }
  }
  .btn-confrim {
    border: 1px solid #d0d8de;
    display: flex;
    color: #333333;
    font-size: 13px;
    height: 34px;

    span {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .cancel {
      border-right: 1px solid #d0d8de;
    }
  }
  ::v-deep .q-scrollarea__thumb {
    background-color: rgba(60, 63, 76, 0.3) !important;
    width: 8px;
    border-radius: 4px;
  }
}
</style>