<template>
  <div>
    <Mastertable
      :tabledatas="userPage.list"
      :pagenum="pagenum"
      :pagesizes="pageSize"
    >
    </Mastertable>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[5, 6, 7, 8]"
      :page-size="5"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @prev-click="prevpage"
      @next-click="nextpage"
    >
    </el-pagination>
  </div>
</template>
<style lang="less">
.newuser {
  display: flex;
  margin-bottom: 20px;
}
</style>
<script>
import Mastertable from "../../../components/Mastertable.vue";
export default {
  data() {
    return {
      userPage: [],
      pagenum: 1,
      total: 0,
      pageSize: 5,
    };
  },
  components: {
    Mastertable,
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.axios({
        method: "post",
        url: "/audit",
        headers: {
          Authorization: this.$store.state.token,
        },
        data: {
          pageNum: this.pagenum,
          pageSize: val,
        },
      }).then((data) => {
        if (data.data.code == 200) {
          //   console.log(data);
          this.userPage = data.data.result;
        }
      });
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.axios({
        method: "post",
        url: "/audit",
        headers: {
          Authorization: this.$store.state.token,
        },
        data: {
          pageNum: this.pagenum,
          pageSize: this.pageSize,
        },
      }).then((data) => {
        if (data.data.code == 200) {
          //   console.log(data);
          this.userPage = data.data.result;
        }
      });
    },
    prevpage(val) {
      this.pagenum = val - 1;
      this.axios({
        method: "post",
        url: "/audit",
        headers: {
          Authorization: this.$store.state.token,
        },
        data: {
          pageNum: this.pagenum,
          pageSize: this.pageSize,
        },
      }).then((data) => {
        if (data.data.code == 200) {
          // console.log(data);
          this.userPage = data.data.result;
        }
      });
    },
    nextpage(val) {
      this.pagenum = val + 1;
      this.axios({
        method: "post",
        url: "/audit",
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
          this.userPage = data.data.result;
        }
      });
    },
    getpage(num, size) {
      this.axios({
        method: "post",
        url: "/audit",
        headers: {
          Authorization: this.$store.state.token,
        },
        data: {
          pageNum: num,
          pageSize: size,
        },
      }).then((data) => {
        if (data.data.code == 200) {
          //   console.log(data);
          this.userPage = data.data.result;
        }
      });
    },
  },
  created() {
    this.axios({
      method: "post",
      url: "/audit",
      headers: {
        Authorization: this.$store.state.token,
      },
      data: {
        pageNum: this.pagenum,
        pageSize: this.pageSize,
      },
    }).then((data) => {
      // console.log(data);
      this.userPage = data.data.result;
      // console.log(this.userPage.list);
      this.total = this.userPage.total;
      // console.log(this.total);
    });
  },
  
};
</script>