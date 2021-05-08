<template>
  <div class="add">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="申请时间" prop="applicationtime">
        <el-date-picker
          v-model="ruleForm.applicationtime"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="申请类型" prop="type">
        <el-radio-group v-model="ruleForm.type">
          <el-radio label="进入校园"></el-radio>
          <el-radio label="离开校园"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="理由" prop="reason">
        <el-input type="textarea" v-model="ruleForm.reason"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >提交申请</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    var validatetime = (rule, value, callback) => {
      let choseday = new Date(value).getTime();
      let today = new Date().getTime();
      if (value === "") {
        callback(new Error("请选择日期"));
      } else if (today > choseday) {
        callback(new Error("无法当天申请，以及申请以往的日期"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        applicationtime: "",
        type: "",
        reason: "",
      },
      rules: {
        applicationtime: [
          {
            validator: validatetime,
            trigger: "change",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择申请类型",
            trigger: "change",
          },
        ],
        reason: [
          { required: true, message: "请填写申请理由", trigger: "blur" },
          {
            min: 5,
            max: 20,
            message: "长度在 5 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.applicationtime = datachange(
            this.ruleForm.applicationtime
          );
          console.log(this.ruleForm);

          this.axios({
            method: "post",
            url: "/saveapplication",
            data: this.ruleForm,
            headers: {
              Authorization: this.$store.state.token,
            },
          }).then((data) => {
            console.log(data);
            if (data.data.code == 200) {
              this.ruleForm = {
                applicationtime: "",
                type: "",
                reason: "",
              };
              this.$message({
                message: data.data.message,
                type: "success",
              });
            } else {
              this.$message({
                message: "提交申请失败",
                type: "error",
              });
            }
          });
          //   alert("submit!");
        } else {
          this.$message({
            message: "请输入正确格式",
            type: "error",
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
 
};

// 时间处理
function datachange(val) {
  let data = new Date();
  let hour = data.getHours();
  let minutes = data.getMinutes();
  let seconds = data.getSeconds();
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  let time = ` ${hour}:${minutes}:${seconds}`;
  return val + time;
}
</script>
<style lang="less">
.add {
  padding: 0px 40px;
  margin: 0 auto;
  width: 400px;
  textarea {
    resize: none;
    height: 100px;
    font-size: 16px;
  }
}
</style>