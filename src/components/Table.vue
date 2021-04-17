<template>
  <div>
    <!-- <button @click="test" >1111</button> -->
    <!-- <el-button @click="resetDateFilter">清除日期过滤器</el-button>
    <el-button @click="clearFilter">清除所有过滤器</el-button> -->
    <el-table ref="filterTable" :data="td" style="width: 100%">
      <el-table-column
        prop="id"
        label="用户ID"
        sortable
        width="180"
        column-key="id"
        :filters="id_filter"
        :filter-method="filterHandler"
      >
      </el-table-column>
      <el-table-column prop="realname" label="用户名" width="180">
      </el-table-column>
      <el-table-column prop="username" label="账号" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"> </el-table-column>

      <el-table-column
        prop="rolename"
        label="角色"
        width="100"
        :filters="rolename_filter"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            :type="
              scope.row.roleId == 1
                ? 'info'
                : scope.row.roleId == 2
                ? 'success'
                : scope.row.roleId == 3
                ? 'warning'
                : 'danger'
            "
            disable-transitions
          >
            {{ scope.row.rolename }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
            编辑</el-button
          >
          <el-dialog :visible.sync="dialogFormVisible" center>
            <div class="difs" v-loading="loading" v-if="form == ''"></div>
            <el-form :model="form" v-if="form != ''">
              <el-form-item label="用户ID" :label-width="formLabelWidth">
                {{ form.id }}
              </el-form-item>
              <el-form-item label="用户名" :label-width="formLabelWidth" prop="realname">
                <el-input v-model="form.realname" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="账号" :label-width="formLabelWidth" prop="username">
                <el-input v-model="form.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
                <el-input v-model="form.email" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="角色" :label-width="formLabelWidth">
                <el-select v-model="form.roleId" placeholder="请选择角色">
                  <el-option
                    v-for="(role, index) in roles"
                    :key="index"
                    :label="role.name"
                    :value="role.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="学院"
                :label-width="formLabelWidth"
                class="connection"
                prop="department"
              >
                <div class="ins">{{ form.department }}</div>
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
                :label-width="formLabelWidth"
                v-if="form.roleId != '4'"
                prop="specoalty"
              >
                <div class="ins">{{ form.specoalty }}</div>
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
                :label-width="formLabelWidth"
                v-if="select_type(form.roleId)"
                prop="classname"
              >
                <div class="ins">{{ form.classname }}</div>
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
                <!-- {{ form.classname }} -->
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <!-- <el-button @click="savedata">取 消</el-button> -->
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="getdata">确 定</el-button>
            </div>
          </el-dialog>
          <!-- <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          > -->
          <el-popover
            placement="top"
            title="确认删除吗？"
            width="200"
            trigger="click"
            v-model="scope.row.visible"
          >
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                @click="scope.row.visible = false"
                >取消</el-button
              >
              <el-button type="primary" size="mini" @click="delrow(scope)"
                >确定</el-button
              >
            </div>
            <el-button size="mini" type="danger" slot="reference"
              >删除</el-button
            >
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import { Loading } from "element-ui";
export default {
  props: ["tabledatas"],

  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("年龄不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 18) {
            callback(new Error("必须年满18岁"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      table: this.tabledatas,
      id_filter: [],
      rolename_filter: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {},
      roles: [],
      formLabelWidth: "120px",
      visible: false,
      departments: [],
      specoaltys: [],
      classname: [],
      dep: "",
      spe: "",
      clas: "",
      loading: false,
       rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          age: [
            { validator: checkAge, trigger: 'blur' }
          ]
        }
    };
  },
  computed: {
    td() {
      return this.tabledatas;
    },

    // specoaltys() {
    //   if (this.form.specoalty != undefined) {
    //     // console.log(1);
    //     let current = this.departments.filter((item) => {
    //       return item.name == e;
    //     });
    //     // console.log(current[0]);
    //     return current[0].children;
    //     // console.log(this.specoalty );
    //   } else {
    //   }
    // },
  },
  watch: {
    td() {
      // console.log(this.td);
      this.id_filter = [];
      this.td.forEach((element) => {
        // console.log(element);
        this.id_filter.push({ text: element.id, value: element.id });
      });
      // console.log(this.id_filter);
    },
    // "form.department": {
    //   deep: true,
    //   handler(e) {
    //     // console.log(e);
    //     // if (this.form.specoalty != undefined) {
    //     // console.log(1);
    //     let current = this.departments.filter((item) => {
    //       return item.name == e;
    //     });
    //     // console.log(current[0]);
    //     // this.form.specoalty = current[0].children[0].name;
    //     this.specoaltys = current[0].children;
    //     // console.log(this.specoaltys);
    //     // }
    //   },
    // },
    // "form.specoalty": {
    //   deep: true,
    //   handler(el) {
    //     // console.log(el);
    //     let current = this.specoaltys.filter((item) => {
    //       return item.name == el;
    //     });
    //     // console.log(current[0]);
    //     // this.form.classname = current[0].children[0].name;
    //     this.classname = current[0].children;
    //   },
    // },
  },
  methods: {
    // test(){
    //   // this.tabledatas=[];
    // console.log(this.table);

    // },
    // 判断角色显示对应select
    select_type(id) {
      return id == "3" ? false : id == "4" ? false : true;
    },
    // 筛选数据
    filterTag(value, row) {
      return row.rolename === value;
    },
    // 筛选数据
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    getdep(e, num) {
      if (num == 0) {
        this.form.department = e;
        let current = this.departments.filter((item) => {
          return item.name == e;
        });
        this.specoaltys = current[0].children;
        this.spe = "";
        this.clas = "";
        // console.log(this.clas);
        this.classname = "";
        this.form.specoalty = "";
        this.form.classname = "";
      } else if (num == 1) {
        this.form.specoalty = e;
        let current = this.specoaltys.filter((item) => {
          return item.name == e;
        });
        this.classname = current[0].children;
        this.clas = "";
        this.form.classname = "";
      } else {
        this.form.classname = e;
      }
      // console.log(e);
      // console.log(1);
    },
    // 点击编辑获取对应用户信息
    handleEdit(index, row) {
      // let loadingInstance = Loading.service({
      //   lock: true,
      //   target: ".difs",
      // });
      // console.log(index, row.id);
      this.form = "";
      this.loading = true;
      this.axios({
        method: "post",
        url: "/findUserById",
        data: {
          id: row.id,
        },
      }).then((data) => {
        if (data.data.code == 200) {
          let users = data.data.result.userCustom;
          this.form = {
            id: users.id,
            department: users.department,
            specoalty: users.specialty,
            realname: users.realname,
            username: users.username,
            email: users.email,
            rolename: users.rolename,
            roleId: users.roleId,
            classname: users.classname,
          };
          // console.log(users);
          // console.log(this.form);
          this.loading = false;
          // loadingInstance.close();
        }
      });

      this.dialogFormVisible = true;
    },
    // 获取表单数据并修改用户数据
    getdata() {
      console.log(this.form.id);
      this.axios({
        method: "post",
        url: "/changeUser",
        data: this.form,
      }).then((data) => {
        console.log(data);
        if (data.data.code == 200) {
          this.$notify({
            title: "保存成功",
            message: "已经保存成功",
            type: "success",
          });
          // this.axios({
          //   method: "post",
          //   url: "/findallroles",
          //   headers: {
          //     Authorization: this.$store.state.token,
          //   },
          //   data: {
          //     // pageNum:1,
          //     // pageSize:5
          //   },
          // }).then((data) => {
          //   if (data.data.code == 200) {
          //     // console.log(data);
          //     this.tabledatas = data.data.result.allRoles;
          //     // console.log(this.allRoles);
          //   }
          // });
        } else {
          this.$notify.error({
            title: "保存失败",
            message: "填写格式不规范",
          });
        }
      });
      this.dialogFormVisible = false;
    },
    // 点击取消是否保存数据
    // savedata() {
    //   this.$confirm("是否保留信息?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //   })
    //     .then(() => {
    //       this.dialogFormVisible = false;
    //       this.$message({
    //         type: "info",
    //         message: "已保留数据",
    //       });
    //     })
    //     .catch(() => {
    //       this.dialogFormVisible = false;
    //       this.$message({
    //         type: "info",
    //         message: "数据已还原",
    //       });
    //     });
    // },
    // 删除用户
    delrow(scope) {
      let idx = this.td.findIndex((ele) => {
        return ele.id == scope.row.id;
      });
      this.td.splice(idx, 1);

      this.axios.post("/deleuser", { id: scope.row.id }).then((data) => {
        if (data.data.code == 200) {
          this.$message({
            message: data.data.message,
            type: "success",
          });
        } else {
          this.$message({
            message: "删除失败",
            type: "fail",
          });
        }
        // console.log(data);
      });
      // console.log(scope.row.id);
      // console.log(this.td);
      scope.row.visible = false;
    },
  },
  created() {
    // 获取所有角色
    // this.td = this.tabledatas;
    this.axios({
      method: "post",
      url: "/findallroles",
    }).then((data) => {
      // console.log(data);
      this.roles = data.data.result.allRoles;
      // console.log(this.roles.slice(1, 5));
      this.roles = this.roles.slice(1, 5);
      // console.log(this.roles);
      this.roles.forEach((ele) => {
        // console.log(ele);
        this.rolename_filter.push({ text: ele.name, value: ele.name });
      });
    });
    this.axios({
      method: "post",
      url: "/findDepartment",
    }).then((data) => {
      // console.log(data.data.children);
      this.departments = data.data.children;
      // console.log(this.departments);
    });
  },
};
</script>
<style lang="less">
.connection .el-form-item__content {
  display: flex;
  .ins {
    width: 200px;
  }
}
.difs {
  height: 40vh;
}
</style>