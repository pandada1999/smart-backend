<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <div>
          <!-- 首页user信息 -->
          <el-card shadow="hover">
            <div class="userCard">
              <el-avatar :size="150" :src="imgUrl" />
              <div class="userInfo">
                <p class="important-font">{{ name }}</p>
                <p class="secondary-font">
                  您好，欢迎使用 SMART 神经网络鲁棒性评估平台。
                  您可以在侧边栏查看您的模型列表，或上传您的测试模型。
                </p>
              </div>
            </div>
            <div class="login-info">
              <p>登陆时间：{{ value }}</p>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="16">
        <div style="height: 200px"></div>
        <div class="last-image" style="padding: 0 100px">
          <img src="@/icons/index.gif">
        </div>

      </el-col>
    </el-row>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import * as echarts from 'echarts'
export default {
  name: 'Index',
  computed: {
    ...mapGetters([
      'name',
      'avatar'
    ])
  },
  data() {
    var formatDateTime = function(date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      var h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      var minute = date.getMinutes()
      minute = minute < 10 ? ('0' + minute) : minute
      var second = date.getSeconds()
      second = second < 10 ? ('0' + second) : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    }
    return {
      imgUrl: require('@/icons/avatar.jpg'),
      // imgUrl: require(this.avatar),
      value: formatDateTime(new Date())

    }
  }, methods: {
    // 柱状图
    initBarEcharts() {
      // 新建一个promise对象
      const p = new Promise((resolve) => {
        resolve()
      })
      // 然后异步执行echarts的初始化函数
      p.then(() => {
        //	此dom为echarts图标展示dom
        const myChart = echarts.init(this.$refs.barEcharts)
        const option = {
          title: {
            text: '销售表'
          },
          tooltip: {},
          legend: {
            data: ['今日销量', '昨日销量']
          },
          xAxis: {
            data: ['华为', 'vivo', 'oppo', 'ipone', '小米', '三星']
          },
          yAxis: {},
          series: [
            {
              name: '今日销量',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20]
            },
            {
              name: '昨日销量',
              type: 'bar',
              data: [10, 18, 34, 8, 12, 21]
            }
          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      })
    },
    // 饼图
    initPieEcharts() {
      const p = new Promise((resolve) => {
        resolve()
      })
      // 然后异步执行echarts的初始化函数
      p.then(() => {
        const myChart = echarts.init(this.$refs.pieEcharts)
        const option = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '0%',
            left: 'left'
          },
          series: [
            {
              name: '订单信息',
              type: 'pie',
              radius: ['20%', '65%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'left'
              },
              labelLine: {
                show: false
              },
              data: [
                { value: 1048, name: '成交订单量' },
                { value: 735, name: '退款订单量' },
                { value: 580, name: '浏览量' },
                { value: 484, name: '加购量' },
                { value: 300, name: '预购量' }
              ]
            }
          ]
        }
        myChart.setOption(option)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 30px;

  .userCard {
    height: 180px;
    display: flex;
    border-bottom: 2px solid #DCDFE6;
    border-radius: 2px;
  }
  .userInfo{
    width: 65%;
    text-align: justify;
    padding: 0 0 0 6%;
  }
  .important-font{
    font-weight: 900;
    font-size: 25px;
    //margin-bottom: 15%;
  }
  .secondary-font{
    color: #909399;
  }
  .login-info{
    height: 40px;
    text-align: left;
    color: #909399;
  }

  .tableInfo{
    margin: 20px 0 0 0;
  }

  .last-image{
    text-align: right;
  }

}
</style>

