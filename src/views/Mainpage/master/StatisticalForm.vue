<template>
  <div>
    <div class="changecharts">
      <el-form :inline="true" :model="typeform" class="demo-form-inline" ref="types">
        <el-form-item
          label="搜索专业"
          v-if="this.$store.state.userinformation.role == 4"
          prop="fspecoalty"
        >
          <el-select
            v-model="typeform.fspecoalty"
            placeholder="搜索专业"
            @change="getcla"
          >
            <el-option
              v-for="(spe, idx) in specoalty"
              :key="idx"
              :label="spe.name"
              :value="spe.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="搜索班级"
          v-if="
            this.$store.state.userinformation.role == 3 ||
            this.$store.state.userinformation.role == 4
          "
          prop="fclassname"

        >
          <el-select v-model="typeform.fclassname" placeholder="搜索班级">
            <el-option
              v-for="(cla, idx) in classname"
              :key="idx"
              :label="cla.name"
              :value="cla.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="搜索时间区间" prop="time">
          <el-date-picker
            v-model="typeform.time"
            type="datetimerange"
            align="right"
            :clearable="true"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '24:00:00']"
            
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="搜索特定学生" prop="student">
          <el-input
            v-model="typeform.student"
            placeholder="学生名字"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
        <el-button @click="resetForm('types')">重置</el-button>
      </el-form>
    </div>
    <Applyform
      :tabledatas="userPage.list"
      :pagenum="pagenum"
      :pagesizes="pageSize"
    >
    </Applyform>
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
    <div v-if="statistics !== ''" class="box" ref="box"></div>
  </div>
</template>
<script>
import Applyform from "../../../components/Applyform.vue";
export default {
  data() {
    return {
      userPage: [],
      pagenum: 1,
      total: 0,
      pageSize: 5,
      statistics: [],
      typeform: {
        time: "",
        // startTime: "",
        // endTime: "",
        student: "",
        fspecoalty: "",
        fclassname: "",
      },
      classname: [],
      specoalty: [],
    };
  },
  components: {
    Applyform,
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getstatisticalForm(this.$store.state.userinformation.role);
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getstatisticalForm(this.$store.state.userinformation.role);
    },
    prevpage(val) {
      this.pagenum = val - 1;
      this.getstatisticalForm(this.$store.state.userinformation.role);
    },
    nextpage(val) {
      this.pagenum = val + 1;
      this.getstatisticalForm(this.$store.state.userinformation.role);
    },
    getpage(num, size) {
      this.pagenum = num;
      this.pageSize = size;
      // this.getstatisticalForm()
      this.getstatisticalForm(this.$store.state.userinformation.role);
    },
    getstatisticalForm(roleId) {
      // console.log(this.typeform);
      if (this.typeform.time == null) {
        this.typeform.time[0] = "";
        this.typeform.time[1] = "";
      }
      if (roleId == 2) {
        this.axios({
          method: "post",
          url: "/statisticalForm",
          headers: {
            Authorization: this.$store.state.token,
          },
          data: {
            pageNum: this.pagenum,
            pageSize: this.pageSize,
            startTime: this.typeform.time[0],
            endTime: this.typeform.time[1],
            student: this.typeform.student,
            classname: "",
          },
        }).then((data) => {
          // console.log(data);
          this.userPage = data.data.result.page;
          // console.log(this.userPage.list);
          this.total = data.data.result.page.total;
          this.statistics = data.data.result.statistics;
          // console.log(this.total);
          // console.log(this.statistics);
        });
      } else if (roleId == 3) {
        this.axios({
          method: "post",
          url: "/statisticalForm",
          headers: {
            Authorization: this.$store.state.token,
          },
          data: {
            pageNum: this.pagenum,
            pageSize: this.pageSize,
            startTime: this.typeform.time[0],
            endTime: this.typeform.time[1],
            student: this.typeform.student,
            classname: this.typeform.fclassname,
            specialty: "",
          },
        }).then((data) => {
          // console.log(data);
          this.userPage = data.data.result.page;
          // console.log(this.userPage.list);
          this.total = data.data.result.page.total;
          this.statistics = data.data.result.statistics;
          // console.log(this.total);
        });
      } else if (roleId == 4) {
        this.axios({
          method: "post",
          url: "/statisticalForm",
          headers: {
            Authorization: this.$store.state.token,
          },
          data: {
            pageNum: this.pagenum,
            pageSize: this.pageSize,
            startTime: this.typeform.time[0],
            endTime: this.typeform.time[1],
            specialty: this.typeform.fspecoalty,
            classname: this.typeform.fclassname,
            student: this.typeform.student,
          },
        }).then((data) => {
          // console.log(data);
          this.userPage = data.data.result.page;
          // console.log(this.userPage.list);
          this.total = data.data.result.page.total;
          this.statistics = data.data.result.statistics;
          // console.log(this.total);
        });
      }
    },
    getScoreInfo() {
      // console.log(this.statistics);
      if (this.statistics !== "") {
        // console.log(this.statistics.recall);
        // console.log(this.statistics);
        // console.log(this.$refs.box);
        // console.log(this.$echarts);
        let box = this.$refs["box"];
        let charts = this.$echarts.init(box);
        let option = {
          // 标题
          title: {
            text: `分段图`,
            subtext: "分数段饼图",
            // x: "center",
            left: "center",
          },
          // 鼠标悬浮提示
          tooltip: {
            trigger: "item",
            formatter: "{a}：{b} <br/> {c}人 ({d}%)",
          },
          // 指示器
          legend: {
            orient: "vertical",
            left: "left",
            data: [
              "撤回",
              "待班主任审核",
              "待辅导员审核",
              "待学部部长审核",
              "不通过",
              "通过",
            ],
          },
          // 主要传入数据原
          series: [
            {
              name: "申请状态",
              type: "pie",
              radius: "50%",
              center: ["50%", "50%"],
              data: [
                { value: this.statistics["recall"], name: "撤回" },
                {
                  value: this.statistics["teacherAudit"],
                  name: "待班主任审核",
                },
                {
                  value: this.statistics["instructorAudit"],
                  name: "待辅导员审核",
                },
                {
                  value: this.statistics["ministerAudit"],
                  name: "待学部部长审核",
                },
                { value: this.statistics["noAudit"], name: "不通过" },
                { value: this.statistics["yesAudit"], name: "通过" },
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        };
        charts.setOption(option);
      }
    },
    onSubmit() {
      this.getstatisticalForm(this.$store.state.userinformation.role);
    },
    resetForm(formName) {
      // console.log(this.$refs[formName]);
      this.$refs[formName].resetFields();
    },
    getrelation() {
      if (this.$store.state.userinformation.role == 3) {
        this.axios({
          method: "post",
          url: "/department",
          headers: {
            Authorization: this.$store.state.token,
          },
        }).then((data) => {
          this.classname = data.data.children[0].children;
          // console.log(this.classname);
        });
      } else if (this.$store.state.userinformation.role == 4) {
        this.axios({
          method: "post",
          url: "/department",
          headers: {
            Authorization: this.$store.state.token,
          },
        }).then((data) => {
          // console.log(data);
          this.specoalty = data.data.children[0].children;
          this.classname = data.data.children[0].children[0].children;
        });
      }
    },
    getcla(val) {
      //  console.log(this.specoalty);
      let tmp = this.specoalty.find((item) => item.name == val);
      this.classname = tmp.children;
      // console.log(tmp);
      // console.log(val);
    },
  },
  watch: {
    statistics() {
      this.getScoreInfo();
    },
    typeform: {
      handler() {
        if (this.typeform.time == null) {
          this.typeform.time = ["", ""];
        }
      },
      deep: true,
      // 马上执行
      immediate: true,
    },
  },
  created() {
    this.getstatisticalForm(this.$store.state.userinformation.role);
    // this.getScoreInfo();
    this.getrelation();
  },
};
</script>
<style lang="less">
.changecharts {
  width: 100%;
}
.newuser {
  display: flex;
  margin-bottom: 20px;
}
.typeform {
  width: 100%;
}
.box {
  width: 50%;
  height: 400px;
  margin: 50px auto 0;
}
</style>