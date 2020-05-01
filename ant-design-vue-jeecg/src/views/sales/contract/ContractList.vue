<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="12">
            <a-form-item label="客户名称">
              <j-input placeholder="请输入客户名称" v-model="queryParam.customerName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="12">
            <!-- <a-form-item label="合同类型">
              <j-dict-select-tag
                v-model="queryParam.contractTypeCode"
                placeholder="请选择合同类型"
                dictCode="sales_settlement_type"
              />
            </a-form-item> -->
            <a-form-item label="项目名称">
            <a-select
              v-model="queryParam.projectId"
              placeholder="请选择项目"
              :filterOption="false"
              :showSearch="true"
              @search="fetchProjectList"
            >
              <a-select-option
                v-for="(project, index) in FormFieldOptions.projects"
                :key="index"
                :value="project.id"
              >{{project.projectName}}</a-select-option>
            </a-select>
          </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        bordered
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="date" slot-scope="text, record">{{record.beginDate + '~' + record.endDate}}</span>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <!-- <a-divider type="vertical" /> -->
          <a-dropdown v-if="false">
            <a class="ant-dropdown-link">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <!-- <project-modal ref="modalForm" @ok="modalFormOk"></project-modal> -->
  </a-card>
</template>

<script>
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
// import ProjectModal from './modules/ProjectModal'
import { putAction } from '@/api/manage'
import { createMaterial, updateMaterial, frozenBatch } from '@/api/api'
import Rest from '@/config/api-mapper.js'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import FormFieldMixin from '@/mixins/FormFieldMixin'
export default {
  name: 'ContractList',
  mixins: [JeecgListMixin,FormFieldMixin],
  components: {
    // ProjectModal,
    JInput
  },
  data() {
    return {
      description: '',
      queryParam: {},
      materialGroups: [],
      oneTimeFlags: [],
      FieldsSet: {
        project: {
          key: 'projects',
          funcName: 'GetProjects',
          params: {}
        }
      },
      columns: [
        {
          title: '项目名称',
          align: 'center',
          dataIndex: 'projectId_dictText'
        },
        {
          title: '客户名称',
          align: 'center',
          width: 100,
          dataIndex: 'customerId_dictText'
        },
        {
          title: '中标总价',
          align: 'center',
          dataIndex: 'bidAmount'
        },
        {
          title: '合同金额',
          align: 'center',
          dataIndex: 'contractAmount'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 170
        }
      ],
      url: {
        list: Rest.GET_SALECONTRACTS.url
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    initDictConfig() {
      initDictOptions('material_group').then(res => {
        if (res.success) {
          this.materialGroups = res.result
        }
      })
      initDictOptions('material_property').then(res => {
        if (res.success) {
          this.oneTimeFlags = res.result
        }
      })
    },
    fetchProjectList(word) {
      this.request({
        ...this.FieldsSet.project,
        params: {
          projectName: word ? `*${word}*` : ''
        }
      })
    },
    handleEdit(record) {
      this.$router.push({
        path: '/sales/contract',
        query: {
          id: record.id
        }
      })
    },
    handleAdd() {
      this.$router.push({ path: '/sales/contract' })
    },
    handleDelete(id) {}
  }
}
</script>
<style lang="scss" scoped>
@import '~@assets/less/common.less';
</style>
