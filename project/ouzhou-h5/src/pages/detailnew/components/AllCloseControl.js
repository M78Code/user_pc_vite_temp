import { reactive, ref } from "vue";


/** @type {{[topKey:string]:boolean}}} */
export const UnfoldCache={}

export default reactive({
  unfold: true
})
