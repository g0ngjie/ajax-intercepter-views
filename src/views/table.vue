<template>
  <div class="response-container">
    <el-button type="primary" @click="handleCreate">{{
      $t("create")
    }}</el-button>
    <section class="tags">
      <Tag @initList="initList" />
    </section>
    <section class="tips">
      <el-alert :title="$t('errTips')" type="error" :closable="false" />
    </section>
    <Modal ref="modal" @putData="putData" @editData="editData" />
    <!-- 搜索栏 -->
    <section>
      <el-form :inline="true" :model="searchForm">
        <el-form-item :label="$t('search.match.name')">
          <el-input
            v-model="searchForm.match"
            clearable
            :placeholder="$t('search.match.placeholder')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('search.remark.name')">
          <el-input
            v-model="searchForm.remark"
            clearable
            :placeholder="$t('search.remark.placeholder')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">{{
            $t("search.btn.search")
          }}</el-button>
          <el-button @click="handleReset">{{
            $t("search.btn.reset")
          }}</el-button>
        </el-form-item>
      </el-form>
    </section>
    <!-- 表格 -->
    <el-table :data="tableData" stripe>
      <el-table-column :label="$t('table.columns.switch')" width="80">
        <template slot-scope="{ row }">
          <el-switch v-model="row.switchOn" @change="handleSwitch" />
        </template>
      </el-table-column>
      <el-table-column
        prop="match"
        :label="$t('table.columns.match')"
        show-overflow-tooltip
      />
      <el-table-column
        prop="override"
        :label="$t('table.columns.res')"
        show-overflow-tooltip
      />
      <el-table-column
        prop="remark"
        :label="$t('table.columns.remark')"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('table.columns.tag')"
        :formatter="fmtTag"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('table.columns.options')"
        align="center"
        width="150"
      >
        <template slot-scope="{ row }">
          <el-button @click="handleEdit(row)" plain>{{
            $t("table.btn.edit")
          }}</el-button>
          <el-button type="danger" @click="handleDel(row)" plain>{{
            $t("table.btn.del")
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Modal from "./modal";
import { confirmFunc } from "@/common/index";
import { arrayToObject, deepClone, typeIs } from "@alrale/common-lib";
import { getRoutes, getTags, setRoutes } from "@/common/store";
import { noticeRoutes } from "@/common/notice";
import Tag from "./tag";

export default {
  components: {
    Modal,
    Tag,
  },
  data() {
    return {
      searchForm: {},
      tableData: [],
      // tag ORM
      tagMapping: {},
    };
  },
  methods: {
    // 获取tag名称
    fmtTag({ tagId }) {
      const map = this.tagMapping;
      if (typeIs(map) === "object" && tagId) {
        // 可能存在tag被删除找不到name
        return map[tagId]?.name;
      }
    },
    handleSearch() {
      const { match, remark } = this.searchForm;
      if (!match && !remark) return;
      const newList = [];
      if (match) {
        this.tableData.forEach((item) => {
          if (item.match && item.match.includes(match)) newList.push(item);
        });
      }
      if (remark) {
        this.tableData.forEach((item) => {
          if (item.remark && item.remark.includes(remark)) newList.push(item);
        });
      }
      this.tableData = newList;
    },
    handleReset() {
      this.searchForm = {};
      this.initList();
    },
    handleCreate() {
      this.$refs.modal.open();
    },
    handleEdit(row) {
      const newRow = deepClone(row);
      this.$refs.modal.open(newRow);
    },
    handleSwitch() {
      this.modifyNotice(this.tableData);
    },
    async handleDel({ id }) {
      const { ok } = await confirmFunc({ message: this.$t("confirMsg") });
      if (ok) {
        const newList = [];
        this.tableData.forEach((item) => {
          if (item.id != id) newList.push(item);
        });
        this.tableData = newList;
        this.modifyNotice(newList);
      }
    },
    putData(row) {
      this.tableData.push(row);
      this.modifyNotice(this.tableData);
    },
    editData(row) {
      const newList = [];
      this.tableData.forEach((item) => {
        if (item.id == row.id) newList.push(row);
        else newList.push(item);
      });
      this.tableData = newList;
      this.modifyNotice(newList);
    },
    // 通知
    modifyNotice(proxy_routes) {
      setRoutes(proxy_routes);
      noticeRoutes(proxy_routes);
    },
    async initList() {
      const tags = await getTags();
      this.tagMapping = arrayToObject("id", tags);
      const routes = await getRoutes();
      if (typeIs(tags) === "array") {
        if (tags.length === 0) {
          this.tableData = routes;
          return;
        } else {
          // 如果不为启用状态，展示全部
          const emptyHits = [];
          for (let k = 0; k < tags.length; k++) {
            const { used } = tags[k];
            if (used) emptyHits.push(used);
          }
          if (emptyHits.length === 0) {
            this.tableData = routes;
            return;
          }
        }
        // 过滤 tag
        const newTables = [];
        for (let i = 0; i < routes.length; i++) {
          const routeData = routes[i];
          for (let j = 0; j < tags.length; j++) {
            const { used, id } = tags[j];
            if (used && routeData.tagId === id) {
              newTables.push(routeData);
              break;
            }
          }
        }
        this.tableData = newTables;
      } else this.tableData = routes;
    },
  },
  mounted() {
    this.initList();
  },
};
</script>

<style lang="scss" scoped>
.tips {
  margin: 10px 0;
}
.tags {
  margin: 10px 0;
}
</style>