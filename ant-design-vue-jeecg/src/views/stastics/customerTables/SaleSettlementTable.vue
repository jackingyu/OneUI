<template>
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
      <template slot="goToSettlementDetail" slot-scope="text, record, index">
        <a :href="`/sales/settlement?id=${record.id}`" style="width:80px">{{record.id}}</a>
      </template>
    </a-table>
  </div>
  <!-- table区域-end -->
</template>

<script>
import { putAction } from '@/api/manage'
import Rest, { sloter } from '@/config/api-mapper.js'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import moment from 'moment'
//供应商付款表
export default {
  name: 'SaleSettlementTable',
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
          title: '结算单号',
          align: 'center',
          dataIndex: 'id',
          scopedSlots: { customRender: 'goToSettlementDetail' }
        },
        {
          title: '项目名称',
          align: 'center',
          dataIndex: 'projectId_dictText'
        },
        {
          title: '欠款',
          align: 'center',
          dataIndex: 'lateFee'
        },
        {
          title: '中标总价',
          align: 'center',
          dataIndex: 'bidAmount'
        },
        {
          title: '结算总价',
          align: 'center',
          dataIndex: 'settlementAmount'
        },
        {
          title: '结算日期',
          align: 'center',
          dataIndex: 'settlementTime',
          customRender: function(value, record) {
            return moment(value).format('YYYY-MM-DD')
          }
        }
      ],
      url: {
        list: 0
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    loadTable(year, customerId) {
      this.url.list = sloter(Rest.GET_CUSTOMER_SALES_BILLING_REPORT.url, year, customerId)
      this.loadData()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@assets/less/common.less';
</style>
