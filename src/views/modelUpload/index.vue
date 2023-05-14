<template>
  <div class="app-container">
    <div style="width: auto;margin-left: 10%; margin-right: 15%" >
      <div style="margin-bottom: 50px;text-align: center">
        <h1> 模型白盒评估参数 </h1>
      </div>

      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        size="large"
      >

        <el-form-item label="评估名称: " prop="testname">
          <el-input v-model="form.testname" placeholder="请输入评估名称，不超过 15 个字"/>
        </el-form-item>

        <el-form-item label="模型选择: ">
          <template>
            <el-radio-group v-model="form.model">
              <el-radio :label="1">内置 MNIST 数据集</el-radio>
              <el-radio :label='2'>内置 CIFAR-10 数据集</el-radio>
              <el-radio :label="9">
                <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  multiple
                  :limit="3"
                  :on-exceed="handleExceed"
                  :file-list="fileList">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </el-radio>
            </el-radio-group>
          </template>

        </el-form-item>

        <el-form-item label="数据集: ">
          <el-col :span="11">
            <el-date-picker v-model="form.dataset" type="date" placeholder="Pick a date" style="width: 100%;" />
          </el-col>
          <el-col :span="2" class="line">-</el-col>
        </el-form-item>

        <el-form-item label="攻击库: " prop="attacks">
          <el-checkbox-group v-model="form.attacks">
            <el-col :span="6" style="text-align: left"><el-checkbox label="1">FGSM</el-checkbox></el-col>
            <el-col :span="6" style="text-align: left"><el-checkbox label="2">PGD</el-checkbox></el-col>
            <el-col :span="6" style="text-align: left"><el-checkbox label="3">DeepFool</el-checkbox></el-col>
            <el-col :span="6" style="text-align: left"><el-checkbox label="4">C&W</el-checkbox></el-col>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="评估指标: " prop="indexes">
          <el-checkbox-group v-model="form.indexes">
            <el-col :span="6" style="text-align: left"><el-checkbox label="1" disabled>SMART</el-checkbox></el-col>
            <el-col :span="6" style="text-align: left"><el-checkbox label="2">CA</el-checkbox></el-col>
            <el-col :span="6" style="text-align: left"><el-checkbox label="3">CLEVER</el-checkbox></el-col>
            <el-col :span="6" style="text-align: left"><el-checkbox label="4">ER</el-checkbox></el-col>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="评估备注: " prop="comment">
          <el-input type="textarea" v-model="form.comment" placeholder="请添加本次评估的备注，最长不超过 150 字。"></el-input>
        </el-form-item>

        <el-form-item>
          <el-col :span="4">
            <el-button type="primary" @click="onSubmit('form')">创建测试</el-button>
          </el-col>
          <el-col :span="4">
            <el-popover
              placement="top"
              width="160"
              v-model="visible">
              <p>确定要清空表单吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="onCancel">确定</el-button>
              </div>
              <el-button slot="reference">清空表单</el-button>
            </el-popover>
          </el-col>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import { modelTestWhite } from '@/api/model'
export default {
  data() {
    return {
      visible: false,
      form: {
        testname: '',
        model: 'MNIST',
        dataset: '',
        attacks: ['1', '2', '3', '4'],
        indexes: ['1', '2', '3', '4'],
        comment: '',
        fileList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
          { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }]
      },
      rules: {
        testname: [
          { required: true, message: '请输入评估名称', trigger: 'blur' },
          { min: 0, max: 15, message: '评估名称不超过 15 个字', trigger: 'blur' }
        ],
        comment: [
          { required: false, max: 150, message: '评估名称不超过 15 个字', trigger: 'blur' }
        ],
        attacks: [
          { type: 'array', required: true, message: '请至少选择一种攻击', trigger: 'change' }
        ],
        indexes: [
          { type: 'array', required: true, message: '请至少选择一个指标', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`)
    },
    // 提交表单
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            message: '测试已提交，测试完成后将通过邮件通知您测试结果。',
            type: 'success'
          })
          modelTestWhite(this.form).then(response => {
            console.log(response.data)
            setTimeout(() => {
              // 路由跳转
              this.$router.push('/dashboard')
            }, 1000)
          }).catch(err => {
            console.log(err.response.data.message)
          })
        } else {
          this.$message({
            message: '测试数据有误，请修改！',
            type: 'error'
          })
        }
      })
    },
    // 清空表单
    onCancel() {
      this.$message({
        message: '本次填写数据已清空!',
        type: 'warning'
      })
      this.empty()
    },
    empty() {
      // eslint-disable-next-line no-sequences
      this.form.testname = '',
      this.form.attacks = ['1', '2', '3', '4'],
      this.form.indexes = ['1', '2', '3', '4'],
      this.form.comment = '',
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.line{
  text-align: center;
}
/* reset element-ui css */

.formStar {
  font-family: "PingFangSC-Semibold", "PingFang SC Semibold", "PingFang SC",
  sans-serif;
  font-weight: 200;
  font-style: normal;
  font-size: 12px;
  color: #fb0404;
  padding: 5px;
}
.formLabel {
  font-size: 20px;
  color: #333333;
  font-family: "MicrosoftYaHeiLight", "微软雅黑 Light", "微软雅黑", sans-serif;
  font-weight: 200;
  line-height: 30px;
}
</style>

