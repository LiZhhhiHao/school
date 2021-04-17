<template>
  <div>
    <Table :tabledatas=allRoles>
    </Table>
  </div>
</template>
<script>
import Table from "../../components/Table.vue";
export default {
  data() {
    return {
      allRoles: [],
    };
  },
  components: {
    Table,
  },
  created() {
    this.axios({
      method: "post",
      url: "/findallroles",
      headers: {
        Authorization: this.$store.state.token,
      },
      data:{
          // pageNum:1,
          // pageSize:5
      }
    }).then((data) => {
      if (data.data.code == 200) {
        // console.log(data);
        this.allRoles = data.data.result.allRoles;
        console.log(this.allRoles);
      }
    });
  },
};
</script>