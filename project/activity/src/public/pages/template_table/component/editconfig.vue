 <template>
  <q-card style="width: 700px; max-width: 80vw;">
    <q-card-section>
      <div class="text-h6">{{dialog_title}}</div>
    </q-card-section>
    <q-separator />
    <q-card-section style="max-height: 50vh" class="scroll q-gutter-md">
      <q-input
        :class="`${compute_form_item_class(disableditemarr,'id')}`"
        outlined
        dense
        :disable="compute_form_item_disabled(disableditemarr,'id')"
        v-model="editconfig_form.id"
      >
        <template v-slot:before>
          <div class="dialog-before-label">id：</div>
        </template>
      </q-input>
      <q-input outlined dense clearable v-model="editconfig_form.name">
        <template v-slot:before>
          <div class="dialog-before-label">{{$root.$t('common.name')}}<!-- 名称 -->：</div>
        </template>
      </q-input>
    </q-card-section>
    <q-separator />
    <q-card-actions align="right" class="q-pr-lg">
      <q-btn :label="$root.$t('common.cancel')" color="deep-orange" class @click="abort_dialog_form()" /><!-- 取消 -->
      <q-btn :label="$root.$t('common.confirm')" color="primary" class="q-mr-md" @click="submit_dialog_form()" /><!-- 确定 -->
    </q-card-actions>
  </q-card>
</template>
 <style lang="scss" scoped></style>
 
 
 <script>
import { api } from "src/allconfig/index.js";
import { mixins } from "src/allconfig/index.js";

const editconfig_module = {
  id: "",
  name: ""
};
export default {
  mixins: [...mixins],
  data() {
    return {
      editconfig_form: {},
      disableditemarr: ["id"]
    };
  },
  props: {
    dialog_title: "",
    dialog_name: "",
    selected_item: ""
  },
  created() {
    //  this.init_form();
  },
  methods: {
    init_form() {
      this.editconfig_form = null;
      if (this.selected_item) {
        console.log(this.selected_item);
        // 编辑
        this.init_form_when_edit();
      } else {
        // 新建
        this.init_form_when_add();
      }
    },
    init_form_when_edit() {
      let obj = this.deep_clone(editconfig_module);
      obj = Object.assign(obj, this.selected_item);
      //     console.log(obj)
      //           let obj={
      //         img_type:this.selected_item.img_type ,
      //     }

      this.init_form_base_with_module("editconfig_form", obj);
    },
    init_form_when_add() {
      this.init_form_base_with_module("editconfig_form", editconfig_module);
    },
    abort_dialog_form() {
      this.$emit("close", this.dialog_name, 0);
    },
    check_all_brfore_submit() {
      let check = false;
      if (this.editconfig_form.name) {
        check = true;
      } else {
        this.$q.dialog({
          title: this.$root.$t('common.reminder'),//"提示",
          message: this.$root.$t('common.all_mandatory'),//"所有信息均必须填写",
          cancel: true,
          persistent: true
        });
        check = false;
      }

      return check;
    },
    submit_dialog_form() {
      let check = this.check_all_brfore_submit();
      if (!check) {
        return false;
      }

      console.log(this.editconfig_form);
      this.$emit("close", this.dialog_name, 1);
    }
  }
};
</script>
 
 
 