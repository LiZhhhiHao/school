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
              v-for="(sli, sidx) in sidelis"
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
        <el-header> {{ isCollapse }} </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
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
.mainpage {
  .el-container {
    .el-header,
    .el-footer {
      background-color: #b3c0d1;
      color: #333;
      text-align: center;
      line-height: 60px;
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
        .el-menu{
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

    .el-main {
      background-color: #e9eef3;
      color: #333;
      text-align: center;
      line-height: 160px;
    }
  }
}
</style>
<script>
export default {
  name: "Mainpage",
  data() {
    return {
      isCollapse: false,
    };
  },
  computed: {
    sidelis() {
      return this.$store.state.sidelis;
    },
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>