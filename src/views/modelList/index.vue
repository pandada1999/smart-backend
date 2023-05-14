<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit stripe highlight-current-row style="font-size: medium">

      <el-table-column align="center" label="ID" width="60">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>

      <el-table-column label="评估备注" width="120" align="center" >
        <template slot-scope="scope">
          {{ scope.row.testname }}
        </template>
      </el-table-column>

      <el-table-column label="模型" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.model }}
        </template>
      </el-table-column>

      <el-table-column label="数据集" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.dataset }}
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="测试结果" align="center">
        <el-table-column label="SMART score" align="center" >
          <template slot-scope="scope">
            {{ scope.row.resultSmart }}
          </template>
        </el-table-column>
        <el-table-column label="Clean Accuracy" align="center">
          <template slot-scope="scope">
            {{ scope.row.resultAcc }}
          </template>
        </el-table-column>
        <el-table-column label="CLEVER score" align="center">
          <template slot-scope="scope">
            {{ scope.row.resultClever }}
          </template>
        </el-table-column>
        <el-table-column label="ER" align="center">
          <template slot-scope="scope">
            {{ scope.row.resultEr }}
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { modelList } from '@/api/model'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      modelList().then(response => {
        this.listLoading = false
        this.list = response.data
      })
    }
  }
}
</script>
