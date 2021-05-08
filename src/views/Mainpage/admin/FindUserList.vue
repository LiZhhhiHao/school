<template>
  <div>
    <div class="newuser">
      <el-button type="primary" @click="outerVisible = true"
        >新增用户</el-button
      >
    </div>
    <el-dialog title="新增用户" :visible.sync="outerVisible">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="realname">
          <el-input v-model="ruleForm.realname"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" required>
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" class="connection" prop="roleId">
          <el-select v-model="ruleForm.roleId" placeholder="请选择角色">
            <el-option
              v-for="(role, index) in roles"
              :key="index"
              :label="role.name"
              :value="role.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学院" class="connection" prop="department">
          <!-- <div class="ins">{{ ruleForm.department }}</div> -->
          <el-select
            v-model="dep"
            placeholder="请选择学院"
            @change="getdep($event, 0)"
          >
            <el-option
              v-for="(department, index) in departments"
              :key="index"
              :label="department.name"
              :value="department.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          class="connection"
          label="专业"
          v-if="ruleForm.roleId != '4'"
          prop="specoalty"
        >
          <!-- <div class="ins">{{ ruleForm.specoalty }}</div> -->
          <el-select
            v-model="spe"
            placeholder="请选择专业"
            @change="getdep($event, 1)"
          >
            <el-option
              v-for="(specoalty, index) in specoaltys"
              :key="index"
              :label="specoalty.name"
              :value="specoalty.name"
            ></el-option>
          </el-select>
          <!-- {{form.specoalty}} -->
        </el-form-item>
        <el-form-item
          class="connection"
          label="班级"
          prop="classname"
          v-if="ruleForm.roleId == '1' || ruleForm.roleId == '2'"
        >
          <!-- v-if="select_type(ruleForm.roleId)" -->
          <!-- <div class="ins">{{ ruleForm.classname }}</div> -->
          <el-select
            v-model="clas"
            placeholder="请选择班级"
            @change="getdep($event, 2)"
          >
            <el-option
              v-for="(cla, index) in classname"
              :key="index"
              :label="cla.name"
              :value="cla.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >立即创建</el-button
          >
          <el-button @click="cancel">取 消</el-button>
        </el-form-item>
      </el-form>
      <el-dialog
        width="30%"
        title="再次确认"
        :visible.sync="innerVisible"
        append-to-body
      >
        <div>请再次确认添加用户信息</div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="sendruleForm">确认</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <Table :tabledatas="userPage.list" :pagenum="pagenum" :pagesizes="pageSize">
    </Table>
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
import Table from "../../../components/Table.vue";
export default {
  data() {
    var validateEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱"));
      } else if (
        !/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(
          value
        )
      ) {
        console.log(value);
        callback(new Error("请输入正确邮箱格式"));
      } else {
        callback();
      }
    };
    return {
      userPage: [],
      pagenum: 1,
      total: 0,
      pageSize: 5,
      outerVisible: false,
      innerVisible: false,
      roles: [],
      departments: [],
      specoaltys: [],
      classname: [],
      dep: "",
      spe: "",
      clas: "",
      ruleForm: {
        // id: 12,
        username: "",
        realname: "",
        email: "",
        roleId: "",
        classname: "",
        specoalty: "",
        department: "",
      },
      rules: {
        realname: [
          { required: true, message: "输入账号", trigger: "blur" },
          { min: 3, message: "长度在 3 到 5 个字符(汉字)", trigger: "blur" },
        ],
        username: [
          { required: true, message: "输入用户名", trigger: "blur" },
          { min: 3, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        email: [
          {
            validator: validateEmail,
            trigger: "change",
          },
        ],
        roleId: {
          required: true,
          message: "请选择角色",
          trigger: "change",
        },
        classname: [
          {
            // type: "date",
            required: true,
            message: "请选择班级",
            trigger: "change",
          },
        ],
        specoalty: [
          {
            required: true,
            message: "请选择专业",
            trigger: "change",
          },
        ],
        department: [
          {
            // type: "array",
            required: true,
            message: "请选择学院",
            trigger: "change",
          },
        ],
      },
    };
  },
  components: {
    Table,
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert("submit!");
          this.innerVisible = true;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    sendruleForm() {
      this.outerVisible = false;
      this.innerVisible = false;
      // console.log(this.ruleForm);
      //  headers: {
      //   Authorization: this.$store.state.token,
      // },
      // this.axios.post("/saveUser",this.ruleForm).then(data=>{
      this.axios({
        method: "post",
        url: "/saveUser",
        headers: {
          Authorization: this.$store.state.token,
        },
        data: this.ruleForm,
      }).then((data) => {
        // console.log(data.data);
        if (data.data.code == 200) {
          this.$message({
            // message: data.data.message,
            message: "新增用户成功",
            type: "success",
          });
        } else {
          this.$message({
            // message: data.data.message,
            message: "新增用户失败",
            type: "error",
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getdep(e, num) {
      if (num == 0) {
        this.ruleForm.department = e;
        let current = this.departments.filter((item) => {
          return item.name == e;
        });
        this.specoaltys = current[0].children;
        this.spe = "";
        this.clas = "";
        // console.log(this.clas);
        this.classname = "";
        this.ruleForm.specoalty = "";
        this.ruleForm.classname = "";
      } else if (num == 1) {
        this.ruleForm.specoalty = e;
        let current = this.specoaltys.filter((item) => {
          return item.name == e;
        });
        this.classname = current[0].children;
        this.clas = "";
        this.ruleForm.classname = "";
      } else {
        this.ruleForm.classname = e;
      }
    },
    cancel() {
      this.outerVisible = false;
      console.log(this.$refs["ruleForm"]);
      this.$refs["ruleForm"].clearValidate();
      this.ruleForm = {
        username: "",
        realname: "",
        email: "",
        roleId: "",
        classname: "",
        specoalty: "",
        department: "",
      };
    },
    getpage(pagenum, pageSize) {
      this.axios({
        method: "post",
        url: "/findUserList",
        headers: {
          Authorization: this.$store.state.token,
        },
        data: {
          pageNum: pagenum,
          pageSize: pageSize,
        },
      }).then((data) => {
        if (data.data.code == 200) {
          // console.log(data);
          this.userPage = data.data.result.userPage;
          this.total = this.userPage.total;
        }
      });
    },
  },
  created() {
    this.axios({
      method: "post",
      url: "/findUserList",
      headers: {
        Authorization: this.$store.state.token,
      },
      data: {
        pageNum: this.pagenum,
        pageSize: 5,
      },
    }).then((data) => {
      if (data.data.code == 200) {
        // console.log(data);
        this.userPage = data.data.result.userPage;
        this.total = this.userPage.total;
      }
    });
    this.axios({
      method: "post",
      url: "/findallroles",
      headers: {
        Authorization: this.$store.state.token,
      },
    }).then((data) => {
      // console.log(data);
      this.roles = data.data.result.allRoles;
      this.roles.pop();
      this.roles.pop();
      this.roles.shift();
      console.log(this.roles);
      // console.log(this.roles.slice(1, 5));
      // this.roles.shift();
    });
    this.axios({
      method: "post",
      url: "/findDepartment",
      headers: {
        Authorization: this.$store.state.token,
      },
    }).then((data) => {
      console.log(data.data.children);
      this.departments = data.data.children;
      // console.log(this.departments);
    });
  },
  
};
</script>