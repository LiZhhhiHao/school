<template>
  <div class="mainpage">
    <el-container>
      <el-aside width="unset">
        <el-row class="tac">
          <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
            <el-radio-button
              :label="false"
              v-show="isCollapse"
              class="openside"
            >
              <i class="el-icon-d-arrow-right"></i>
            </el-radio-button>
            <el-radio-button :label="true" v-show="!isCollapse">
              <i class="el-icon-d-arrow-left"></i>
              <span>收起</span>
            </el-radio-button>
          </el-radio-group>
          <el-menu
            :collapse="isCollapse"
            default-active="1"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
          >
            <el-submenu
              :index="sidx.toString()"
              v-for="(sli, sidx) in menuTree"
              :key="sidx"
              router
            >
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ sli.name }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  :index="`/mainpage${slic.url}`"
                  v-for="(slic, idx) in sli.children"
                  :key="idx"
                  >{{ slic.name }}</el-menu-item
                >
                <!-- index='/mainpage/user' -->
                <!--   :index="`${sidx.toString()}-${idx.toString()}`" -->
                <!-- :to="slic.url" -->
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-row>
      </el-aside>
      <el-container>
        <el-header>
          <div class="logos">
            <!-- 黑马logo -->
            <img src="../assets/logo.png" />
            <!-- 顶部标题 -->
            <span>进出校园管理系统</span>
          </div>
          <el-dropdown @command="handleCommand" placement="bottom">
            <span class="el-dropdown-link userin">
              {{ userinformation.realname
              }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">用户信息</el-dropdown-item>
              <el-dropdown-item command="b">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
      title="用户信息"
      :visible.sync="dialogFormVisible"
      append-to-body
      width="30%"
      center
    >
      <el-form :model="userinformation">
        <el-form-item label="账号">
          {{ userinformation.username }}
        </el-form-item>
        <el-form-item label="用户名称">
          {{ userinformation.realname }}
        </el-form-item>
        <el-form-item label="邮箱">
          {{ userinformation.email }}
        </el-form-item>
        <el-form-item label="用户角色">
          {{ usertype(userinformation.role) }}
        </el-form-item>
        <el-button type="primary" size="default" @click="innerVisible = true">
          修改用户密码
        </el-button>

        <el-dialog
          width="30%"
          title="用户密码修改"
          :visible.sync="innerVisible"
          append-to-body
          center
          :before-close="closepwd"
        >
          <!-- <el-form
            :model="numberValidateForm"
            ref="password"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item
              label="原密码"
              prop="oldPassword"
              :rules="[
                { required: true, message: '年龄不能为空' },
                { type: 'number', message: '年龄必须为数字值' },
              ]"
            >
              <el-input
                type="age"
                v-model.number="numberValidateForm.oldPassword"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="新密码"
              prop="newPassword"
              :rules="[
                { required: true, message: '年龄不能为空' },
                { type: 'number', message: '年龄必须为数字值' },
              ]"
            >
              <el-input
                type="age"
                v-model.number="numberValidateForm.newPassword"
                autocomplete="off"
              ></el-input>
            </el-form-item>
           
          </el-form> -->
          <el-form
            :model="resetForm"
            status-icon
            :rules="resetFormRules"
            ref="resetForm"
            label-width="100px"
          >
            <el-form-item label="原密码" prop="oldPassword">
              <el-input
                type="password"
                v-model="resetForm.oldPassword"
                auto-complete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input
                type="password"
                v-model="resetForm.newPassword"
                auto-complete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="renewpwd">
              <el-input
                type="password"
                v-model="resetForm.renewpwd"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="resetFormnum('resetForm')">取 消</el-button>
            <el-button type="primary" @click="sendpwd('resetForm')"
              >确 定</el-button
            >
          </div>
        </el-dialog>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div> -->
    </el-dialog>
  </div>
</template>
<style lang="less">
html,
body,
#app,
.mainpage,
.el-container {
  height: 100%;
}
.mainpage>.el-form-item {
  display: flex;
  align-content: center;
  justify-content: center;
}
.mainpage {
  .el-container {
    .el-header,
    .el-footer {
      user-select: none;
      background-color: #b3c0d1;
      color: #333;
      text-align: center;
      line-height: 60px;
    }
    .el-dropdown-link {
      cursor: pointer;
      color: #409eff;
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
    .el-header {
      height: 80px !important;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .logos {
        width: 80%;
        height: 80%;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          margin-left: 20px;
          font-size: 20px;
          font-weight: bold;
        }
        img {
          height: 100%;
        }
      }
      .userin {
        padding-right: 20px;
        font-size: 16px;
        color: #222;
        transition: color 0.5s linear;
      }
      .userin:hover {
        color: #666;
      }
    }
    .el-aside {
      background-color: #545c64;
      color: #333;
      text-align: center;
      width: unset;
      .tac {
        height: 100%;
        .el-radio-group {
          margin-top: 2rem;
        }
        .el-menu {
          border: none;
        }
        .el-radio-button__inner {
          background-color: #373e44;
          border: none;
          padding: 1vw;
        }
        .el-submenu__title {
          text-align: center;
        }
      }
      .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
      }
    }

    > .el-main {
      background-color: #e9eef3;
      color: #333;
      text-align: center;
      // line-height: 160px;
    }
  }
}
</style>
<script>
export default {
  name: "Mainpage",
  data() {
    var validateoldPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入原密码"));
      } else if (value.toString().length < 6 || value.toString().length > 18) {
        callback(new Error("密码长度为6 - 18个字符"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入新密码"));
      } else if (value.toString().length < 6 || value.toString().length > 18) {
        callback(new Error("密码长度为6 - 18个字符"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.resetForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      isCollapse: true,
      menuTree: [],
      roleis: "",
      dialogFormVisible: false,
      innerVisible: false,
      formLabelWidth: "180px",
      resetForm: {
        oldPassword: "",
        newPassword: "",
        renewpwd: "",
      },
      resetFormRules: {
        oldPassword: [
          { required: true, validator: validateoldPass, trigger: "blur" },
        ],
        newPassword: [
          { required: true, validator: validatePass, trigger: "blur" },
        ],
        renewpwd: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    userinformation: {
      get() {
        return this.$store.state.userinformation;
      },
      set(val) {
        this.$store.commit("setuser", val);
      },
    },
  },
  watch: {},
  methods: {
    usertype(role) {
      if (role == 0) {
        return "管理员";
      } else if (role == 1) {
        return "学生";
      } else if (role == 2) {
        return "班主任";
      } else if (role == 3) {
        return "辅导员";
      } else if (role == 4) {
        return "学部部长";
      }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleCommand(command) {
      if (command == "a") {
        // this.$message("click on item " + command);
        this.dialogFormVisible = true;
      } else if (command == "b") {
        // this.$message("click on item " + command);
        this.$store.commit("deltoken");
        // this.$router.push("/");
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetFormnum(formName) {
      this.$refs[formName].resetFields();
      this.innerVisible = false;
    },
    closepwd() {
      this.resetFormnum("resetForm");
    },
    sendpwd(formName) {
      console.log(this.resetForm);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios({
            method: "post",
            url: "/changePassword",
            headers: {
              Authorization: this.$store.state.token,
            },
            data: {
              oldPassword: this.resetForm.oldPassword,
              newPassword: this.resetForm.newPassword,
            },
          }).then((data) => {
            console.log(data);
            if (data.data.code == 200) {
              this.$message({
                message: data.data.message,
                center: true,
                type: "success",
              });
              // this.closepwd();
              // this.dialogFormVisible = false;
              this.$store.commit("deltoken");
            } else {
              this.$message({
                message: `原始${data.data.message},修改密码失败`,
                center: true,
                type: "error",
              });
              this.closepwd();
            }
          });
        } else {
          this.$message({
            message: "请填写正确输入密码",
            center: true,
            type: "error",
          });
        }
      });
    },
  },
  created() {
    this.userinformation = this.$store.state.userinformation;
    this.axios({
      method: "get",
      url: "/findmenutree",
      headers: {
        Authorization: this.$store.state.token,
      },
    }).then((data) => {
      console.log(data);
      if (data.data.code == 200) {
        this.menuTree = data.data.result.menuTree;
        console.log(this.menuTree);
        if (this.menuTree[0].children.length == 2) {
          this.roleis = "管理者";
        } else {
          this.roleis = "用户";
        }
      }
    });
  },
  // beforeRouteUpdate(to, from, next) {
  //   console.log(1111);
  //   let loginData = this.$store.state.token;
  //   if (loginData != "") {
  //     next();
  //   } else {
  //     next({
  //        name: 'Login',
  //       });
  //   }
  // },
};
</script>