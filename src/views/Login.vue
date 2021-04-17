<template>
  <div class="login_wrap">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-position="left"
      class="login"
    >
      <h2>登录</h2>
      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="form.username"
          :maxlength="20"
          name="username"
          placeholder="请输入用户名"
          type="text"
        >
          <i class="el-icon-user el-input__icon" slot="prefix"> </i>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-tooltip
          v-model="capsTooltip"
          :tabindex="-1"
          content="大写锁定已打开"
          manual
          placement="left"
        >
        </el-tooltip>

        <el-input
          ref="password"
          v-model="form.password"
          :key="passwordType"
          :type="passwordType"
          :maxlength="20"
          name="password"
          placeholder="请输入密码"
          @keyup.enter.native="login"
        >
          <i class="el-icon-unlock el-input__icon" slot="prefix"> </i>
        </el-input>
      </el-form-item>
      <el-button
        :loading="loading"
        class="submit-btn"
        type="primary"
        @click="login"
      >
        {{ loading ? "登 录 中..." : "登 录" }}
      </el-button>
    </el-form>
  </div>
</template>
<style lang="less">
.login_wrap {
  display: flex;
  min-height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .login {
    width: 30vw;
    border: 1px solid #ccc;
    padding: 2rem;
    border-radius: 2rem;
    h2 {
      font-weight: bold;
      margin-bottom: 2rem;
      font-size: 3vw;
      letter-spacing: 2rem;
      text-indent: 2rem;
    }
    .el-button {
      width: 100%;
    }
  }
}
</style>
<script>
export default {
  name: "LoginForm",
  data() {
    return {
      loading: false,
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "change" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
        ],
      },
      passwordType: "password",
      capsTooltip: false,
    };
  },
  methods: {
    login() {
      if (this.loading) return;
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        this.axios({
          method: "post",
          url: "/login",
          data: {
            username: this.form.username,
            password: this.form.password,
          },
        }).then((data) => {
          this.loading = false;
          if (data.data.code == 200) {
            this.$message({
              message: "登陆成功",
              type: "success",
              center: true,
            });
            this.$router.push("/mainpage");
            this.$store.commit("settoken", data.data.result.token);
          } else if (data.data.code == 400) {
          this.loading = false;
            this.$message({
              message: data.data.message,
              center: true,
            });
          }
        });
      });
    },
    // success() {
    //   const redirect = this.$route.query.redirect || "/";
    //   //由于清除消息时会造成卡顿，所以延迟0.2s跳转
    //   window.setTimeout(() => this.$router.replace(redirect), 200);
    // },
    capsLockTip({ keyCode }) {
      if (keyCode === 20) this.capsTooltip = !this.capsTooltip;
    },
    addCapsLockEvent() {
      window.addEventListener("keyup", this.capsLockTip);
    },
    removeEvent() {
      window.removeEventListener("keyup", this.addCapsLockEvent);
    },
  },
  mounted() {
    this.addCapsLockEvent();
    this.$once("hook:beforeDestroy", this.removeEvent);
  },
};
</script>