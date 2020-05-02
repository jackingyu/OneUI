<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="8" :sm="12">
            <a-form-item label="客户名称">
              <j-input placeholder="请输入客户名称" v-model="queryParam.customerName"></j-input>
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
    <!-- <div class="table-operator" style="border-top: 5px">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
    </div>-->
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
        <span slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">查看明细</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
import { putAction } from '@/api/manage'
import { createMaterial, updateMaterial, frozenBatch } from '@/api/api'
import Rest from '@/config/api-mapper.js'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'

export default {
  name: 'CustomerReportList',
  mixins: [JeecgListMixin],
  components: {
    JInput
  },
  data() {
    return {
      description: '',
      queryParam: {},
      materialGroups: [],
      oneTimeFlags: [],
      columns: [
        {
          title: '客户名称',
          align: 'center',
          dataIndex: 'customerName'
        },
        {
          title: '财年',
          align: 'center',
          dataIndex: 'year'
        },
        {
          title: '当年开票总额',
          align: 'center',
          dataIndex: 'invoiceAmount'
        },
        {
          title: '当年收款总额',
          align: 'center',
          dataIndex: 'receivedAmount'
        },
        {
          title: '当年结算总额',
          align: 'center',
          dataIndex: 'billingAmount'
        },
        {
          title: '上年度未开票结转',
          align: 'center',
          dataIndex: 'cfUnbillingAmount',
          ellipsis: true
        },
        {
          title: '上年度欠款结转',
          align: 'center',
          dataIndex: 'cfUnreceivedAmount',
          ellipsis: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 140
        }
      ],
      url: {
        list: Rest.GET_CUSTOMER_REPORT.url
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    handleDetail(record) {
      this.$router.push({
        path: '/customer/report/detail',
        query: {
          ...record,
          year: record.year,
          vendorId: record.vendorId
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@assets/less/common.less';
</style>
