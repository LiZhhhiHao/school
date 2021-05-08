<template>
  <div class="mastertable">
    <el-table ref="filterTable" :data="td" style="width: 100%">
      <el-table-column
        prop="userRealname"
        label="学生姓名"
        sortable
        column-key="userRealname"
      >
      </el-table-column>
      <el-table-column prop="userSpecialty" label="专业"> </el-table-column>
      <el-table-column prop="userDepartment" label="学部"> </el-table-column>
      <el-table-column prop="reason" label="原因"> </el-table-column>
      <el-table-column prop="type" label="类型"> </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag :type="checktype(scope.row.status)">{{
            applystatus(scope.row)
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creatdate" label="创建申请时间"> </el-table-column>
      <el-table-column prop="applicationtime" label="申请进出校日期">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            slot="reference"
            @click="checkstu(scope.$index, scope.row)"
            >审批</el-button
          >
          <el-button
            size="mini"
            type=""
            @click="showcheck(scope.row)"
            v-if="$store.state.userinformation.role !== 2"
            >查阅</el-button
          >
          <!-- @click="checkstu(scope.$index, scope.row)" -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗 -->
    <el-dialog
      title="审批"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
      ref="dialog"
    >
      <!-- :rules="rules" -->
      <el-form :model="form" v-if="form != ''" ref="form" class="signfrom">
        <el-form-item label="留言" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.opinion"></el-input>
        </el-form-item>
        <el-form-item label="审批是否通过" :label-width="formLabelWidth">
          <el-select v-model="form.atatus" placeholder="请选择是否通过">
            <el-option label="不通过" value="1"></el-option>
            <el-option label="通过" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签名" :label-width="formLabelWidth">
          <!-- <el-input v-model="form.signature" autocomplete="off"></el-input> -->
          <div class="fakeimg" v-if="signname == ''"></div>
          <img :src="signname" v-if="signname !== ''" />
        </el-form-item>
      </el-form>
      <el-button @click="sign" class="signin" plain>电子签名</el-button>
      <el-dialog
        width="30%"
        title="电子签名"
        :visible.sync="innerVisible"
        append-to-body
        :before-close="closesign"
      >
        <!-- <div class="difs" v-loading="loading"></div> -->
        <div class="sign" v-loading="loading">
          <div ref="canvas" class="canvas">
            <canvas ref="signname"></canvas>
          </div>
          <p ref="clearCanvas" class="clearCanvas">清除</p>
          <p ref="saveCanvas" class="saveCanvas" @click="savename">保存</p>
        </div>
        <!-- <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogFormVisible = false"
            >确 定</el-button
          >
          <el-button @click="innerVisible = false">取 消</el-button>
        </div> -->
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendcheck">确 定</el-button>
        <el-button @click="notcheck">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 查阅弹窗 -->
    <el-dialog
      title="查阅申请"
      :visible.sync="checkFormVisible"
      append-to-body
      width="30%"
      center
    >
      <div class="formtitles">班主任查阅记录</div>
      <el-form :model="checkform">
        <el-form-item label="申请创建时间">
          {{ checkform.auditdate }}
        </el-form-item>
        <el-form-item label="审批通过人">
          {{ checkform.realname }}
        </el-form-item>
        <el-form-item label="审批留言">
          {{ checkform.opinion }}
        </el-form-item>
        <el-form-item label="审批状态">
          {{ checkform.atatus }}
        </el-form-item>
        <el-form-item label="电子签名">
          <img :src="checkform.signature" v-if="checkform.signature != ''" />
        </el-form-item>
      </el-form>
      <div class="formtitles" v-if="$store.state.userinformation.role !== 3">
        辅导员查阅记录
      </div>
      <el-form
        :model="checkform2"
        v-if="$store.state.userinformation.role !== 3"
      >
        <el-form-item label="申请创建时间">
          {{ checkform2.auditdate }}
        </el-form-item>
        <el-form-item label="审批通过人">
          {{ checkform2.realname }}
        </el-form-item>
        <el-form-item label="审批留言">
          {{ checkform2.opinion }}
        </el-form-item>
        <el-form-item label="审批状态">
          {{ checkform2.atatus }}
        </el-form-item>
        <el-form-item label="电子签名">
          <img :src="checkform2.signature" v-if="checkform2.signature != ''" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import { Loading } from "element-ui";
export default {
  props: ["tabledatas", "pagenum", "pagesizes"],

  data() {
    return {
      table: this.tabledatas,
      formLabelWidth: "120px",
      centerDialogVisible: false,
      innerVisible: false,
      signname: "",
      loading: true,
      form: {
        applicationId: "",
        opinion: "",
        signature: "",
        atatus: "",
      },
      checkFormVisible: false,
      checkform: {
        auditdate: "",
        realname: "",
        opinion: "",
        signature: "",
        atatus: "",
      },
      checkform2: {
        auditdate: "",
        realname: "",
        opinion: "",
        signature: "",
        atatus: "",
      },
    };
  },
  computed: {
    td() {
      return this.tabledatas;
    },
  },
  watch: {
    td() {},
  },
  methods: {
    applystatus(row) {
      //  row 0：已撤回；1：待班主任审核；2,3,4：未通过，5：通过
      // console.log(row.status);
      if (row.status == 0) {
        return "已撤回";
      } else if (row.status == 1) {
        return "有待班主任审核";
      } else if (row.status == 2) {
        return "有待辅导员审核";
      } else if (row.status == 3) {
        return "有待学部部长审核";
      } else if (row.status == 4) {
        return "未通过";
      } else {
        return "通过";
      }
    },

    checktype(status) {
      if (status == 0) {
        return "danger";
      } else if (status == 1) {
        return "info";
      } else if (status == 2) {
        return "info";
      } else if (status == 3) {
        return "info";
      } else if (status == 4) {
        return "warning";
      } else {
        return "success";
      }
      //    :type="scope.row.status === 0 ? 'danger' : 'success'"
      //          <el-tag>标签一</el-tag>
      // <el-tag type="success">标签二</el-tag>
      // <el-tag type="info">标签三</el-tag>
      // <el-tag type="warning">标签四</el-tag>
      // <el-tag type="danger
    },

    // 查看审批详情
    checkstu(idx, row) {
      this.signname = "";
      this.form = {
        applicationId: "",
        opinion: "",
        signature: "",
        atatus: "",
      };
      // console.log(idx);
      // console.log(row.id);
      // let tmp = row.id
      // this.form.applicationId = tmp.toString();
      this.form.applicationId = row.id;
      // this.form.applicationId;
      this.centerDialogVisible = true;
    },
    // 发送审批
    sendcheck() {
      // console.log(this.form);
      this.axios({
        method: "post",
        url: "/saveaudit",
        data: this.form,
        headers: {
          Authorization: this.$store.state.token,
        },
      }).then((data) => {
        // console.log(data);
        if (data.data.code == 200) {
          this.$parent.getpage(this.pagenum, this.pagesizes);
          this.$message({
            message: data.data.message,
            type: "success",
          });
        } else {
          this.$message({
            message: "发送审批数据错误错误",
            type: "error",
          });
        }
        this.centerDialogVisible = false;
      });
    },

    notcheck() {
      this.centerDialogVisible = false;
      this.signname = "";
    },

    // -----
    // 电子签名
    sign() {
      this.innerVisible = true;
      // console.log(this.$refs);
      setTimeout(() => {
        // console.log(this.$parent.$parent.$parent.$parent.$el);
        // console.log(this.$refs.dialog.$refs.dialog);
        new lineCanvas({
          el: this.$refs.canvas, //绘制canvas的父级div
          clearEl: this.$refs.clearCanvas, //清除按钮
          saveEl: this.$refs.saveCanvas, //保存按钮
          canvas: this.$refs.signname,
          dialog: this.$refs.dialog.$refs.dialog,
          //linewidth:1,//线条粗细，选填
          //color:"black",//线条颜色，选填
          //background:"#ffffff"//线条背景，选填
        });
        this.loading = false;
      }, 100);
    },
    savename() {
      setTimeout(() => {
        this.signname = localStorage.getItem("savename");
        this.form.signature = localStorage.getItem("savename");
        // console.log(this.signname);
        this.innerVisible = false;
        this.loading = true;
      }, 100);
    },
    closesign(done) {
      // console.log(done);
      this.$confirm("确认关闭？")
        .then(() => {
          this.innerVisible = false;
          this.loading = true;
          done();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    lineCanvas() {},
    showcheck(row) {
      this.checkFormVisible = true;
      console.log(row);
      this.axios({
        method: "post",
        url: "/historical",
        headers: {
          Authorization: this.$store.state.token,
        },
        data: { applicationbillId: row.id },
      }).then((data) => {
        if (data.data.code ==200) {
          this.checkform.auditdate = data.data.result[0].auditdate;
          this.checkform.realname = data.data.result[0].realname;
          this.checkform.opinion = data.data.result[0].opinion;
          this.checkform.atatus = data.data.result[0].atatus;
          this.checkform.signature = data.data.result[0].signature;
          if (data.data.result[1] !== "") {
            this.checkform2.auditdate = data.data.result[1].auditdate;
            this.checkform2.realname = data.data.result[1].realname;
            this.checkform2.opinion = data.data.result[1].opinion;
            this.checkform2.atatus = data.data.result[1].atatus;
            this.checkform2.signature = data.data.result[1].signature;
          }
        }else{
          this.$message({
            message: "获取查阅信息失败",
            center: true,
            type: "error",
          });
        }
      });
    },
  },
  created() {},
  // mounted() {
  //   this.screenWidth = document.body.clientWidth;
  //   this.screenHeight = document.body.clientHeight;
  //   window.onresize = () => {
  //     return (() => {
  //       this.screenWidth = document.body.clientWidth;
  //       this.screenHeight = document.body.clientHeight;
  //     })();
  //   };
  // },
};

// window.onload = function () {
// new lineCanvas({
//   el: document.getElementById("canvas"), //绘制canvas的父级div
//   clearEl: document.getElementById("clearCanvas"), //清除按钮
//   saveEl: document.getElementById("saveCanvas"), //保存按钮
//   //linewidth:1,//线条粗细，选填
//   //color:"black",//线条颜色，选填
//   //background:"#ffffff"//线条背景，选填
// });
// };
// var that = this;
// console.log(window);
function lineCanvas(obj) {
  this.linewidth = 1;
  this.color = "#000000";
  this.background = "#fff";
  for (var i in obj) {
    this[i] = obj[i];
  }
  this.canvas = obj.canvas;
  this.cxt = this.canvas.getContext("2d");
  this.canvas.width = 400;
  this.canvas.height = 200;
  this.cxt.fillStyle = this.background;
  this.cxt.fillRect(0, 0, this.canvas.width, this.canvas.width);
  this.cxt.strokeStyle = this.color;
  this.cxt.lineWidth = this.linewidth;
  this.cxt.lineCap = "round";
  this.flag = false;
  //开始绘制
  this.canvas.addEventListener(
    "mousedown",
    function (e) {
      this.cxt.beginPath();
      e.preventDefault(); //阻止在canvas画布上签名的时候页面跟着滚动
      this.flag = true;
    }.bind(this),
    false
  );
  //绘制中
  this.canvas.addEventListener(
    "mousemove",
    function (e) {
      let delleft = this.dialog.offsetLeft + this.el.offsetLeft;
      let deltop = this.dialog.offsetTop + this.el.offsetTop;
      // console.log(this.dialog.offsetLeft);
      // console.log(delleft);
      // console.log(deltop);
      if (this.flag == true) {
        this.cxt.lineTo(e.clientX - delleft, e.clientY - deltop);
        this.cxt.stroke();
        if (
          e.clientX >= delleft + this.canvas.width ||
          e.clientY >= deltop + this.canvas.height ||
          e.clientX <= delleft ||
          e.clientY <= deltop
        ) {
          // console.log(111);
          this.flag = false;
        }
      }
    }.bind(this),
    false
  );
  //结束绘制
  this.canvas.addEventListener(
    "mouseup",
    function () {
      this.flag = false;
      this.cxt.closePath();
    }.bind(this),
    false
  );
  //清除画布
  this.clearEl.addEventListener(
    "click",
    function () {
      this.cxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.cxt.fillStyle = this.background;
      this.cxt.fillRect(0, 0, this.canvas.width, this.canvas.width);
    }.bind(this),
    false
  );
  //保存图片，直接转base64
  this.saveEl.addEventListener(
    "click",
    function () {
      // var reader = new FileReader();
      var imgBase64 = this.canvas.toDataURL();
      // var img = this.canvas.dataURLtoFile();
      // var img = dataURLtoFile(imgBase64, "img.png");
      // console.log(img);
      // console.log(imgBase64);
      // console.log(reader.readAsDataURL(img));
      // reader.readAsDataURL(img);
      localStorage.setItem("savename", imgBase64);
    }.bind(this),
    false
  );
}
// function dataURLtoFile(dataurl, filename) {
//   console.log("转文件");
//   var arr = dataurl.split(","),
//     mime = arr[0].match(/:(.*?);/)[1],
//     bstr = atob(arr[1]),
//     n = bstr.length,
//     u8arr = new Uint8Array(n);
//   while (n--) {
//     u8arr[n] = bstr.charCodeAt(n);
//   }
//   return new File([u8arr], filename, { type: mime });
// }
</script>
<style lang="less">
.signin {
  margin: 0 auto;
  width: 80%;
  height: 50px;
  display: flex;
  font-size: 20px;
  align-items: center;
  justify-content: center;
}
.signfrom {
  img,
  .fakeimg {
    width: 100%;
    height: 100px;
    border: 1px solid #c0c4cc;
    user-select: none;
  }
}
.mastertable .connection .el-form-item__content {
  display: flex;
  .ins {
    width: 200px;
  }
}
.difs {
  height: 40vh;
}
.canvas {
  width: 400px;
  height: 200px;
  position: relative;
  margin: 0 auto;
  margin-bottom: 20px;
}
.canvas canvas {
  display: block;
  border: 1px solid #ccc;
  /*margin:0auto;*/
  /*transform:translate(-50%,-50%);*/
}
.clearCanvas {
  width: 50%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  border: 1px solid #dedede;
  z-index: 1;
  cursor: pointer;
}
.saveCanvas {
  width: 50%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  position: absolute;
  bottom: 0;
  right: 0;
  border: 1px solid #dedede;
  z-index: 1;
  cursor: pointer;
}
.formtitles {
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  margin-bottom: 20px;
}
</style>