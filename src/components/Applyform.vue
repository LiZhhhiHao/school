<template>
  <div class="applyform">
    <el-table ref="filterTable" :data="td" style="width: 100%">
      <el-table-column
        prop="userRealname"
        label="学生姓名"
        sortable
        column-key="userRealname"
      >
      </el-table-column>
      <el-table-column prop="userClass" label="班级"> </el-table-column>
      <el-table-column prop="userSpecialty" label="专业"> </el-table-column>
      <el-table-column prop="userDepartment" label="学部"> </el-table-column>
      <el-table-column prop="reason" label="原因"> </el-table-column>
      <el-table-column prop="type" label="类型"> </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag :type="checktype(scope.row.status)">{{
            applystatus(scope.row)
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creatdate" label="创建申请时间"> </el-table-column>
      <el-table-column prop="applicationtime" label="申请进出校日期">
      </el-table-column>
    
    </el-table>
  </div>
</template>

<script>
// import { Loading } from "element-ui";
export default {
  props: ["tabledatas", "pagenum", "pagesizes"],
  data() {
    return {
      table: this.tabledatas,
      formLabelWidth: "120px",
    };
  },
  computed: {
    td() {
      return this.tabledatas;
    },
  },
  watch: {
    td() {},
  },
  methods: {
    applystatus(row) {
      //  row 0：已撤回；1：待班主任审核；2,3,4：未通过，5：通过
      // console.log(row.status);
      if (row.status == 0) {
        return "已撤回";
      } else if (row.status == 1) {
        return "有待班主任审核";
      } else if (row.status == 2) {
        return "有待辅导员审核";
      } else if (row.status == 3) {
        return "有待学部部长审核";
      } else if (row.status == 4) {
        return "未通过";
      } else {
        return "通过";
      }
    },

    checktype(status) {
      if (status == 0) {
        return "danger";
      } else if (status == 2 || status == 3 || status == 1) {
        return "info";
      } else if (status == 4) {
        return "warning";
      } else {
        return "success";
      }
      //    :type="scope.row.status === 0 ? 'danger' : 'success'"
      //          <el-tag>标签一</el-tag>
      // <el-tag type="success">标签二</el-tag>
      // <el-tag type="info">标签三</el-tag>
      // <el-tag type="warning">标签四</el-tag>
      // <el-tag type="danger
    },
   
  },
  created() {},
};
</script>
<style lang="less">
.applyform .connection .el-form-item__content {
  display: flex;
  .ins {
    width: 200px;
  }
}
.difs {
  height: 40vh;
}
</style>