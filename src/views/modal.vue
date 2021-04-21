<template>
  <div class="response-modal-container">
    <el-dialog
      :title="title"
      :visible.sync="isShow"
      :before-close="handleClose"
      top="1%"
      width="80%"
    >
      <el-form :model="form" ref="form">
        <el-form-item
          :label="$t('modal.form.match.name')"
          :rules="[
            {
              required: true,
              trigger: 'change',
              message: $t('modal.form.match.msg'),
            },
          ]"
          prop="match"
        >
          <el-input
            v-model="form.match"
            :placeholder="$t('modal.form.placeholder')"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('modal.form.res.name')"
          :rules="[
            {
              required: true,
              trigger: 'change',
              message: $t('modal.form.res.msg'),
            },
          ]"
          prop="override"
        >
          <el-input
            type="textarea"
            :rows="15"
            v-model="form.override"
            :placeholder="$t('modal.form.placeholder')"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('modal.form.remark.name')">
          <el-input
            v-model="form.remark"
            :placeholder="$t('modal.form.placeholder')"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t("modal.btn.cancel") }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{
          $t("modal.btn.confirm")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uniqueId } from "@alrale/common-lib";

export default {
  data() {
    return {
      isShow: false,
      form: {},
      title: "",
      isEdit: false,
    };
  },
  methods: {
    // 模态展示
    open(row) {
      if (row) {
        this.isEdit = true;
        // 编辑
        this.title = this.$t("modal.title.edit");
      } else {
        this.isEdit = false;
        // 新增
        this.title = this.$t("modal.title.create");
      }
      this.isShow = true;
      this.form = row || { remark: "" };
      this.$nextTick(() => this.$refs.form.clearValidate());
    },
    // 模态关闭
    handleClose() {
      this.isShow = false;
    },
    // 表单提交
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) this.createData();
      });
    },
    createData() {
      if (this.isEdit) this.$emit("editData", this.form);
      else
        this.$emit("putData", { ...this.form, switchOn: true, id: uniqueId() });
      this.isShow = false;
    },
  },
};
</script>