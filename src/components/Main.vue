<template>
    <div class="body">
<!--      <div>-->
<!--        <left></left>-->
<!--      </div>-->
      <div>
        <router-view></router-view>
      </div>
<!--      <div class="login" v-show="!connectFlag">-->
<!--        <div class = "login-body">-->
<!--          <el-form size="small" ref="userValidateForm">-->
<!--            <el-tag>用户登陆</el-tag>-->
<!--            <el-form-item-->
<!--              prop="userJID"-->
<!--              label="JID号">-->
<!--              <el-input placeholder="请输入用户名JID"-->
<!--                        v-model="userJid"-->
<!--                        clearable></el-input>-->
<!--            </el-form-item>-->

<!--            <el-form-item-->
<!--              prop="userJID"-->
<!--              label="密码">-->
<!--              <el-input placeholder="请输入用户密码"-->
<!--                        v-model="userPassword"-->
<!--                        type="password"-->
<!--                        clearable></el-input>-->
<!--            </el-form-item>-->

<!--            <el-form-item>-->
<!--              <el-button type="primary" @click="connecting()">登陆</el-button>-->
<!--              <el-button @click="resetForm('userValidateForm')">重置</el-button>-->
<!--            </el-form-item>-->
<!--          </el-form>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div style="position:fixed; left:1rem; top:1rem; z-index: 9;">-->
<!--        <el-row>-->
<!--          <el-button style="margin-right: 1rem" type="success">用户名称：{{userJid}}</el-button>-->
<!--          <el-button style="margin-right: 1rem" type="success">登陆状态：{{connectCode}}</el-button>-->
<!--        </el-row>-->
<!--      </div>-->
<!--      <div style="position:fixed; left:2rem; top:4rem; z-index: 7;">-->
<!--        <el-row style="right:1rem">-->
<!--          <el-button v-on:click="showTaskWindow" type="danger">已处理卫星列表</el-button>-->
<!--        </el-row>-->
<!--      </div>-->
<!--      <div style="position:fixed; right:1rem; top:1rem; z-index: 8;">-->
<!--                <el-table-->
<!--                  :data="SatelliteData"-->
<!--                  style="width: 100%"-->
<!--                  max-height="250">-->
<!--                  <el-table-column-->
<!--                    prop="satellite"-->
<!--                    label="影像名称"-->
<!--                    width="120">-->
<!--                  </el-table-column>-->
<!--                  <el-table-column-->
<!--                    prop="position"-->
<!--                    label="位置"-->
<!--                    width="120">-->
<!--                  </el-table-column>-->
<!--                  <el-table-column-->
<!--                    label="执行"-->
<!--                    width="120">-->
<!--                    <template slot-scope="scope">-->
<!--                      <el-button @click="MakeTask(scope.$index)"-->
<!--                      type="text">-->
<!--                      处理任务-->
<!--                      </el-button>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                </el-table>-->
<!--      </div>-->
<!--      <div style="position:fixed; left:1rem; top:10rem; z-index: 8;">-->
<!--        <el-button style="margin-right: 1rem" type="success" @click="TestTile()">测试</el-button>-->
<!--      </div>-->
<!--      <el-container class="task" v-show="taskSendFlag">-->
<!--        <el-row id="flow" style="width: 100%; margin: auto; padding-left: 1rem; padding-right: 1rem">-->
<!--          <el-steps :active="taskActiveCode" simple>-->
<!--            <el-step title="发起请求" icon="el-icon-edit" ></el-step>-->
<!--            <el-step title="数据预处理" icon="el-icon-s-tools"></el-step>-->
<!--            <el-step title="图像增强" icon = "el-icon-picture-outline"></el-step>-->
<!--            <el-step title="影像生成" icon = "el-icon-cloudy"></el-step>-->
<!--            <el-step title="目标识别" icon = "el-icon-picture"></el-step>-->
<!--          </el-steps>-->
<!--        </el-row>-->
<!--      </el-container>-->
<!--      <Window :show="WindowPopUpShow" :title="WindowPopUpTitle" :data="taskData" @closed="closeTasksWindow">-->
<!--      </Window>-->
    </div>
</template>

<script>
import CesiumMap from './CesiumMap'
import Window from './UserTaskWindow'
import TaskDetail from './TaskDetail'
import left from './Left'
String.format = function (src) {
  if (arguments.length === 0) return null

  var args = Array.prototype.slice.call(arguments, 1)

  return src.replace(/\{(\d+)\}/g, function (m, i) {
    return args[i]
  })
}
export default {
  components: {left, CesiumMap, Window, TaskDetail},
  name: 'Main',

  mounted () {
  },
  methods: {

    TestTile () {
      this.tileUrl = 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806'
      this.tileShow = true
    },
    resetForm (formName) {
      console.log('reset')
      this.$refs[formName].resetFields()
    },
    showTaskWindow: function () {
      this.WindowPopUpShow = true
    },
    closeTasksWindow: function () {
      this.WindowPopUpShow = false
    }
  },
  data () {
    return {
      conn: null,
      connectFlag: true,
      processTaskId: 0,
      taskSendFlag: false,
      taskActiveCode: 1,
      connectCode: '未连接',
      userJid: 'wz@127.0.0.1',
      userPassword: '123456',
      serverJid: 'admin@127.0.0.1',
      BOSH_SERVER: 'http://127.0.0.1:7070/http-bind/',
      SatelliteData: [],
      taskData: [{id: 1,
        data: [{'status': 0, 'url': 'http://127.0.0.1:8000/GFData/imgSrcData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806.png'}, {'status': 1, 'url': 'imgEnData/test.png'},
          {'status': 2, 'url': 'imgTailData/test.png'}, {'status': 3, 'url': 'imgDeTailData/test.png'}]}],
      taskFlowList: ['fileserver@desktop-98tu7o0', 'imgenhance@desktop-98tu7o0', 'fileserver@desktop-98tu7o0'],
      tileUrl: 'http://localhost:8000/GFData/tileData/GF1_PMS2_E113.8_N30.5_20190524_L1A0004018806',
      tileShow: true,
      WindowPopUpTitle: '已完成任务列表',
      WindowPopUpShow: false,
      WindowContent: '',
      showCesiumFlag: true,
      showTaskFlag: false,
      showUserFlag: false
    }
  }
}
</script>

<style scoped>
  .body{
    position: absolute;
    width: 100%;
  }
  .login{
    position: fixed;
    z-index: 2;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.7);
  }
  .login-body{
    width: 25rem;
    margin-top: 15rem;
    margin-left: auto;
    margin-right: auto;
    padding: 0.5rem;
    background-color: #21abe5;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); border-radius: 1rem
  }
  .task{
    position: fixed;
    z-index: 11;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
  }
</style>
