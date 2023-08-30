import { ref } from "vue";
// vr 请求次数
const is_vr_numer = ref(0);
// 第一场虚拟赛事
// 当列表没拉到数据时  每3秒拉一次
const virtual_list_timeout_id = ref(0);
const virtual_composable_fn = () => {
	return {
		// vr 请求次数
		is_vr_numer,
		// 第一场虚拟赛事
		// 当列表没拉到数据时  每3秒拉一次
		virtual_list_timeout_id,
	};
};
export default virtual_composable_fn;
