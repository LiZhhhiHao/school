<template>
  <div class="roletable">
    <!-- <button @click="test" >1111</button> -->
    <!-- <el-button @click="resetDateFilter">清除日期过滤器</el-button>
    <el-button @click="clearFilter">清除所有过滤器</el-button> -->
    <el-table ref="filterTable" :data="td" style="width: 100%">
      <el-table-column
        prop="id"
        label="角色ID"
        sortable
        width="180"
        column-key="id"
        :filters="id_filter"
        :formatter="IDpilus"
      >
      </el-table-column>
      <el-table-column prop="name" label="角色名" width="180">
      </el-table-column>
      <el-table-column
        prop="available"
        label="能否修改"
        width="200"
        :formatter="changstring"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
            编辑</el-button
          >

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
    <el-dialog :visible.sync="dialogFormVisible" append-to-body center>
      <div class="difs" v-loading="loading" v-if="form == ''"></div>
      <el-form :model="form" v-if="form != ''" ref="informations">
        <el-form-item label="角色ID" :label-width="formLabelWidth">
          {{ form.id }}
        </el-form-item>
        <el-form-item label="角色名" :label-width="formLabelWidth">
          {{ form.name }}
        </el-form-item>
        <el-form-item label="菜单&权限" required>
          <div v-for="(menu, _index) in allPermission" :key="menu.name">
            <span style="width: 100px; display: inline-block">
              <el-button
                :type="
                  isMenuNone(_index)
                    ? ''
                    : isMenuAll(_index)
                    ? 'success'
                    : 'primary'
                "
                size="mini"
                style="width: 80px"
                @click="checkAll(_index)"
                >{{ menu.name }}</el-button
              >
            </span>
            <div style="display: inline-block; margin-left: 20px">
              <el-checkbox-group v-model="form.permissions">
                <el-checkbox
                  v-for="perm in menu.children"
                  :label="perm.id"
                  :key="perm.id"
                  @change="checkRequired(perm, _index)"
                >
                  <span :class="{ requiredPerm: perm.requiredPerm === 1 }">{{
                    perm.name
                  }}</span>
                </el-checkbox>
              </el-checkbox-group>
              <!-- <span  v-for="perm in menu.children"  :key="perm.id"> {{perm.name}}</span> -->
            </div>
          </div>
          <p style="color: #848484">说明:红色权限为对应菜单内的必选权限</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="savedata">取 消</el-button> -->
        <el-button @click="notsure">取 消</el-button>
        <el-button type="primary" @click.native="getdata('informations', scope)"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["tabledatas"],

  data() {
    return {
      table: this.tabledatas,
      allPermission: [],
      id_filter: [],
      rolename_filter: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        id: "",
        name: "",
        permissions: "",
      },
      roles: [],
      formLabelWidth: "120px",
      visible: false,
      loading: false,
      editObj: "",
    };
  },
  computed: {
    td() {
      return this.tabledatas;
    },
  },
  watch: {
    td() {
      // console.log(this.td);
      this.id_filter = [];
      this.td.forEach((element) => {
        // console.log(element);
        this.id_filter.push({ text: element.id, value: element.id });
      });
    },
  },
  methods: {
    //   ID+1
    IDpilus(row) {
      return Number(row.id);
    },
    //   格式化文字
    changstring(row) {
      //   console.log(row.available);
      return row.available === "1" ? "可修改" : "不可修改";
    },
    // },
    // 判断角色显示对应select
    select_type(id) {
      return id == "3" ? false : id == "4" ? false : true;
    },

    // 点击编辑获取对应用户信息
    handleEdit(index, row) {
      this.axios({
        method: "post",
        url: "/loadMyPermissions",
        data: {
          id: row.id,
        },
        headers: {
          Authorization: this.$store.state.token,
        },
      }).then((data) => {
        // console.log(data);
        if (data.data.code == 200) {
          this.Management = data.data.result;
          //   console.log(this.Management);
          this.loading = false;
          // loadingInstance.close();
          this.form = {
            id: row.id,
            name: row.name,
            permissions: [],
          };
          for (let i = 0; i < this.Management.length; i++) {
            let perm = this.Management[i];
            this.form.permissions.push(perm.id);
          }
        }
      });
      console.log(this.form);
      //   console.log(row.id);
      //   this.editObj = row;
      //   this.form = "";
      //   this.loading = true;
      this.dialogFormVisible = true;
    },
    // 获取表单数据并修改用户数据
    getdata(informations) {
      // console.log(this.form.id);
      this.$refs[informations].validate((valid) => {
        if (valid) {
          // alert('submit!');
          if (this.form.specoalty === "") {
            this.$notify.error({
              title: "保存失败",
              message: "学部未填写",
            });
          } else if (this.form.department === "") {
            this.$notify.error({
              title: "保存失败",
              message: "专业未填写",
            });
          } else if (this.form.classname === "") {
            this.$notify.error({
              title: "保存失败",
              message: "班级未填写",
            });
          } else {
            this.axios({
              method: "post",
              url: "/changeUser",
              data: this.form,
              headers: {
                Authorization: this.$store.state.token,
              },
            }).then((data) => {
              // console.log(data);
              if (data.data.code == 200) {
                // row.
                // console.log(this.editObj);
                this.editObj.realname = this.form.realname;
                this.editObj.username = this.form.username;
                this.editObj.rolename = this.form.rolename;
                this.editObj.roleId = this.form.roleId;
                this.editObj.email = this.form.email;
                this.$notify({
                  title: "修改成功",
                  message: "已经保存成功",
                  type: "success",
                });
              } else {
                this.$notify.error({
                  title: "保存失败",
                  message: "填写格式不规范",
                });
              }
            });
            this.dialogFormVisible = false;
            console.log(this.form);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 点击取消
    notsure() {
      this.spe = "";
      this.clas = "";
      this.dep = "";
      this.dialogFormVisible = false;
    },

    checkAll(_index) {
      //点击菜单   相当于全选按钮
      let v = this;
      //   console.log(_index);
      if (v.isMenuAll(_index)) {
        //如果已经全选了,则全部取消
        v.noPerm(_index);
      } else {
        //如果尚未全选,则全选
        v.allPerm(_index);
      }
    },
    isMenuAll(_index) {
      //判断本级菜单内的权限是否全选了
      let menu = this.allPermission[_index].children;
      //   console.log(menu);
      let result = true;
      for (let j = 0; j < menu.length; j++) {
        if (this.form.permissions.indexOf(menu[j].id) < 0) {
          result = false;
          break;
        }
      }
      return result;
    },
    allPerm(_index) {
      //全部选中
      let menu = this.allPermission[_index].children;
      for (let j = 0; j < menu.length; j++) {
        this.addUnique(menu[j].id, this.form.permissions);
      }
    },
    noPerm(_index) {
      //全部取消选中
      let menu = this.allPermission[_index].children;
      for (let j = 0; j < menu.length; j++) {
        let idIndex = this.form.permissions.indexOf(menu[j].id);
        if (idIndex > -1) {
          this.form.permissions.splice(idIndex, 1);
        }
      }
    },
    checkRequired(_perm, _index) {
      //本方法会在勾选状态改变之后触发
      let permId = _perm.id;
      if (this.form.permissions.indexOf(permId) > -1) {
        //选中事件
        //如果之前未勾选本权限,现在勾选完之后,form里就会包含本id
        //那么就要将必选的权限勾上
        this.makeReuqiredPermissionChecked(_index);
      } else {
        //取消选中事件
        if (_perm.requiredPerm === 1) {
          //如果是必勾权限,就把本菜单的权限全部移出
          //(其实也可以提示用户本权限是菜单里的必选,请先取消勾选另外几个权限,交互太麻烦,此处就直接全部取消选中了)
          this.noPerm(_index);
        }
      }
    },
    makeReuqiredPermissionChecked(_index) {
      //将本菜单必选的权限勾上
      let menu = this.allPermission[_index].children;
      for (let j = 0; j < menu.length; j++) {
        let perm = menu[j];
        if (perm.requiredPerm === 1) {
          //找到本菜单的必选权限,将其勾上
          this.addUnique(perm.id, this.form.permissions);
        }
      }
    },
    isMenuNone(_index) {
      //判断本级菜单内的权限是否一个都没选
      let menu = this.allPermission[_index].children;
      //   console.log(menu);
      let result = true;
      for (let j = 0; j < menu.length; j++) {
        // console.log(this.form.permissions);
        if (this.form.permissions.indexOf(menu[j].id) > -1) {
          result = false;
          break;
        }
      }
      return result;
    },

    addUnique(val, arr) {
      //数组内防重复地添加元素
      let _index = arr.indexOf(val);
      if (_index < 0) {
        arr.push(val);
      }
    },
  },
  created() {
    // 获取所有角色
    // this.td = this.tabledatas;
    this.axios({
      method: "post",
      url: "/findallroles",
      headers: {
        Authorization: this.$store.state.token,
      },
    }).then((data) => {
      // console.log(data);
      this.roles = data.data.result.allRoles;
      //   this.roles = this.roles.slice(1, 5);
      this.roles.pop();
      this.roles.shift();
      //   console.log(this.roles);
      this.roles.forEach((ele) => {
        // console.log(ele);
        this.rolename_filter.push({ text: ele.name, value: ele.name });
      });
    });
    // 获取所有权限
    this.axios({
      method: "post",
      url: "/findRoles",
      headers: {
        Authorization: this.$store.state.token,
      },
    }).then((data) => {
      console.log("获取所有权限");
      console.log(data.data.result.allMenuAndPermissions);
      this.allPermission = data.data.result.allMenuAndPermissions;
      //   this.roles = this.roles.slice(1, 5);
      //   console.log(this.allPermission);
    });
  },
};
</script>
<style lang="less">
.roletable .connection .el-form-item__content {
  display: flex;
  .ins {
    width: 200px;
  }
}
.difs {
  height: 40vh;
}
</style>