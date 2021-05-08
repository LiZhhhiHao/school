<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
html,
body,
#app,
.mainpage,
.el-container {
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
<script>
export default {
  data() {
    return {
      token: this.$store.state.token,
    };
  },
  created() {
    //在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener("beforeunload", () => {
      localStorage.setItem("messageStore", JSON.stringify(this.$store.state));
    });
    //在页面加载时读取localStorage里的状态信息
    localStorage.getItem("messageStore") &&
      this.$store.replaceState(
        Object.assign(
          this.$store.state,
          JSON.parse(localStorage.getItem("messageStore"))
        )
      );
    // replaceState这个方法呢，查了api，就是替换 store 的根状态，然后通过对象赋值assign将localStorage进行赋值
  },
  computed: {
    getToken() {
      return this.$store.state.token;
    },
  },
  watch: {
    token(val) {
      if (val == "") {
        this.$router.push("/");
      }
    },
    getToken(val) {
      // this.userIcons = val;
      if (val == "") {
        this.$router.push("/");
      }
    },
  },
};
</script>
