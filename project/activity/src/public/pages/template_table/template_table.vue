<template>
  <div>
    <div class="row q-pa-md q-gutter-sm">
      <q-btn color="primary" label="新建网站管理" @click="add_new_item()"/>
      <q-space></q-space>
      <div class>
        <q-input outlined dense v-model="queryform_form.name">
          <template v-slot:prepend>名称：</template>
        </q-input>
      </div>
      <q-btn color="primary" label="查询" @click="tosearch_queryform()"/>
      <q-btn color="deep-orange" label="重置" @click="reset_queryform()"/>
    </div>
    <div>
      <q-table
        :title="tabletittle"
        :data="tabledata"
        :columns="tablecolumns"
        row-key="name"
        :separator="separator"
        :pagination.sync="pagination"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="desc" :props="props">{{ props.row.name }}</q-td>
            <q-td key="calories" :props="props">{{ props.row.calories }}</q-td>
            <q-td key="iron" :props="props">
              <q-badge square color="amber">{{ props.row.iron }}</q-badge>
            </q-td>
            <q-td key="action" :props="props" class="text-center">
              <q-btn
                class="q-mx-sm"
                color="primary"
                label="编辑"
                @click="edit_table_item(props.row)"
              />
              <q-btn
                class="q-mx-sm"
                color="deep-orange"
                label="删除"
                @click="remove_table_item(props.row)"
              />
            </q-td>
          </q-tr>
        </template>

        <template v-slot:bottom>
          <div class="row q-py-md justify-end q-gutter-md" style="width: 100%;">
            <div>
              <q-input
                outlined
                disable
                dense
                v-model.number="total"
                type="number"
                style="width:200px;"
              >
                <template v-slot:before>总数：</template>
              </q-input>
            </div>
            <div>
              <q-select
                outlined
                dense
                style="width:200px;"
                @input="handle_pageSize_change"
                v-model="pageSize"
                :options="pageSizeOptions"
              >
                <template v-slot:before>每页：</template>
              </q-select>
            </div>
            <div>
              <q-pagination
                v-model="currentPage"
                color="primary"
                @input="handle_currentPage_change"
                :max="maxPageNum"
                :input="true"
              ></q-pagination>
            </div>
            <div>
              <q-input
                outlined
                bottom-slots
                dense
                @input="handle_currentPage_change"
                v-model.number="currentPage"
                type="number"
                min="0"
                :max="maxPageNum"
                style="width:200px;"
              >
                <template v-slot:before>前往：</template>
                <template v-slot:after>页</template>
              </q-input>
            </div>
          </div>
        </template>
      </q-table>
    </div>

    <!-- 弹出窗口 -->
    <q-dialog
            v-model="dialog_editconfig_visiable"
      v-if="dialog_editconfig_visiable"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <editconfig
        @close="dialog_close"
        :selected_item="selected_item"
        :dialog_name="dialog_1_name"
        :dialog_title="dialog_editconfig_title"
      ></editconfig>
    </q-dialog>
  </div>
</template>
<style lang="scss" scoped></style>
<script>
import { mapGetters, mapActions } from "vuex";
import api from 'src/api/index.js';
import  mixins  from 'src/mixin/index.js'
import editconfig from "src/pages/template_table/component/editconfig.vue";
export default {
  name: "siteconfig",
  mixins: [...mixins],
  components: {
    editconfig
  },
  data() {
    return {
      queryform_form: {},
      queryform_module: {
        name: ""
      },
      tabletittle: "网站管理",
      dialog_1_name: "editconfig",
      dialog_1_title_0: "新建xx管理",
      dialog_1_title_1: "编辑xx管理",

      dialog_editconfig_visiable: false,
      dialog_editconfig_title: "",
      selected_item: "",

      tablecolumns: [
        {
          name: "desc",
          required: true,
          label: "名称",
          align: "left",
          field: row => row.name,
          format: val => `${val}`
        },
        {
          name: "calories",
          align: "center",
          label: "Calories",
          align: "center",
          field: "calories",
          sortable: true
        },
        { name: "iron", label: "Iron (%)", align: "center", field: "iron" },
        {
          name: "action",
          label: "操作",
          field: "",
          align: "center",
          style: "width: 160px"
        }
      ],
      tabledata: [
        {
          id: 1,
          name: "Frozen Yogurt",
          calories: 159,
          iron: "1%"
        },
        {
          id: 2,
          name: "Ice cream sandwich",
          calories: 237,
          iron: "1%"
        }
      ]
    };
  },

  watch: {},
  computed: {},
  methods: {
    init_tabledata() {
      this.init_tabledata_before();
      let params = {};
      params = { ...params, ...this.queryform_form };
      api.siteconfig.get_siteconfig_config(params).then(res => {
        this.resolve_tabledata_response_base(res);
      });

      // this.resolve_tabledata_response_base(res);
    },
    edit_table_item(item) {
      console.log(item);
      this.selected_item = item;
      this.init_dialog_base(this.dialog_1_name, this.dialog_1_title_1);
    },
    remove_table_item(item) {
      console.log(item);
    },
    add_new_item() {
      this.selected_item = "";
      this.init_dialog_base(this.dialog_1_name, this.dialog_1_title_0);
    },
    dialog_close(name, state) {
      // 1 ,编辑 提交了 ，0 取消操作
      console.log(name, state);
      this.close_dialog_base(name);
      if (state != 0) {
        this.init_tabledata();
      }
    }
  }
};
</script>


