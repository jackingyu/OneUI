<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form :form="jform" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="12">
            <a-form-item label="客户名称">
              <a-input v-model="queryParam.customerName" placeholder="请填写客户名称" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="12">
            <a-form-item label="项目名">
              <a-input v-model="queryParam.projectName" placeholder="请填写项目名" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="12">
            <a-form-item label="结算时间">
              <a-range-picker
                v-decorator="['dateSpan']"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="settleTimeDateChange"
              />
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
        <!-- <span slot="date" slot-scope="text, record">{{record.createTime + '~' + record.endDate}}</span> -->
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
import { createMaterial, updateMaterial, getVendors } from '@/api/api'
import Rest from '@/config/api-mapper.js'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import moment from 'moment'
export default {
  name: 'SettlementList',
  mixins: [JeecgListMixin],
  components: {
    // ProjectModal,
    JInput
  },
  data() {
    return {
      description: '',
      queryParam: {},
      vendors: [],
      columns: [
        {
          title: '结算单号',
          align: 'center',
          width: 160,
          dataIndex: 'id'
        },
        {
          title: '客户名称',
          align: 'center',
          dataIndex: 'customerId_dictText'
        },
        {
          title: '结算类型',
          align: 'center',
          dataIndex: 'salesSettlementTypeCode'
        },
        {
          title: '结算总价',
          align: 'center',
          dataIndex: 'settlementAmount'
        },
        {
          title: '结算日期',
          align: 'center',
          dataIndex: 'settlementTime'
        },
        {
          title: '中标价',
          align: 'center',
          dataIndex: 'bidAmount'
        },
        {
          title: '滞纳金',
          align: 'center',
          dataIndex: 'lateFee'
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
        list: Rest.GET_SALESETTLEMENTS.url
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  mounted() {
    this.fetchVendorList()
  },
  methods: {
    fetchVendorList(word) {
      getVendors({ vendorName: word ? `*${word}*` : '' })
        .then(res => {
          if (res.success) {
            this.vendors = res.result.records
          }
        })
        .finally(() => {})
    },
    initDictConfig() {
      // initDictOptions('material_group').then(res => {
      //   if (res.success) {
      //     this.materialGroups = res.result
      //   }
      // })
    },
    settleTimeDateChange(momentArr, strArr) {
      if (momentArr.length == 0) {
        this.queryParam.settlementTime_begin = ''
        this.queryParam.settlementTime_end = ''
      } else {
        let msArr = momentArr.map(item => item.format('YYYY-MM-DD'))
        this.queryParam.settlementTime_begin = msArr[0]
        this.queryParam.settlementTime_end = msArr[1]
      }
    },
    handleEdit(record) {
      this.$router.push({
        path: '/sales/settlement',
        query: {
          id: record.id
        }
      })
    },
    handleAdd() {
      this.$router.push({ path: '/sales/settlement' })
    },
    handleDelete(id) {}
  }
}
</script>
<style lang="scss" scoped>
@import '~@assets/less/common.less';
</style>
