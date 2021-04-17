<template>
  <div>
    <Table :tabledatas=userPage.list>
    </Table>
  </div>
</template>
<script>
import Table from "../../components/Table.vue";
export default {
  data() {
    return {
      userPage: [],
    };
  },
  components: {
    Table,
  },
  created() {
    this.axios({
      method: "post",
      url: "/findUserList",
      headers: {
        Authorization: this.$store.state.token,
      },
      data:{
          // pageNum:1,
          // pageSize:5
      }
    }).then((data) => {
      if (data.data.code == 200) {
        console.log(data);
        this.userPage = data.data.result.userPage;
      }
    });
  },
};
</script>