<template>
  <div>
    <!-- <div class="newuser">
      <el-button type="primary" @click="outerVisible = true"
        >新增角色</el-button
      >
    </div> -->
    <el-dialog title="外层 Dialog" :visible.sync="outerVisible">
      <el-dialog
        width="30%"
        title="内层 Dialog"
        :visible.sync="innerVisible"
        append-to-body
      >
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="innerVisible = true"
          >打开内层 Dialog</el-button
        >
      </div>
    </el-dialog>
    <Roletable :tabledatas="allRoles"> </Roletable>
  </div>
</template>
<style lang="less">
.newuser {
  display: flex;
  margin-bottom: 20px;
}
</style>
<script>
import Roletable from "../../../components/Roletable.vue";
export default {
  data() {
    return {
      allRoles: [],
      pagenum: 1,
      total: 0,
      pageSize: 5,
      outerVisible: false,
      innerVisible: false,
    };
  },
  components: {
    Roletable,
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.axios({
        method: "post",
        url: "/findUserList",
        headers: {
          Authorization: this.$store.state.token,
        },
        data: {
          pageNum: this.pagenum,
          pageSize: val,
        },
      }).then((data) => {
        if (data.data.code == 200) {
          console.log(data);
          this.userPage = data.data.result.userPage;
        }
      });
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.axios({
        method: "post",
        url: "/findUserList",
        headers: {
          Authorization: this.$store.state.token,
        },
        data: {
          pageNum: this.pagenum,
          pageSize: this.pageSize,
        },
      }).then((data) => {
        if (data.data.code == 200) {
          console.log(data);
          this.userPage = data.data.result.userPage;
        }
      });
    },
    prevpage(val) {
      this.pagenum = val - 1;
      this.axios({
        method: "post",
        url: "/findUserList",
        headers: {
          Authorization: this.$store.state.token,
        },
        data: {
          pageNum: this.pagenum,
          pageSize: this.pageSize,
        },
      }).then((data) => {
        if (data.data.code == 200) {
          console.log(data);
          this.userPage = data.data.result.userPage;
        }
      });
    },
    nextpage(val) {
      this.pagenum = val + 1;
      this.axios({
        method: "post",
        url: "/findUserList",
        headers: {
          Authorization: this.$store.state.token,
        },
        data: {
          pageNum: this.pagenum + 1,
          pageSize: this.pageSize,
        },
      }).then((data) => {
        if (data.data.code == 200) {
          console.log(data);
          this.userPage = data.data.result.userPage;
        }
      });
    },
  },
  created() {
    this.axios({
      method: "post",
      url: "/findallroles",
      headers: {
        Authorization: this.$store.state.token,
      },
      data: {
        pageNum: this.pagenum,
        pageSize: 5,
      },
    }).then((data) => {
      if (data.data.code == 200) {
        this.allRoles = data.data.result.allRoles.slice(0, 5);
        console.log(this.allRoles);
        this.total = this.allRoles.length;
      }
    });
  },
  
};
</script>