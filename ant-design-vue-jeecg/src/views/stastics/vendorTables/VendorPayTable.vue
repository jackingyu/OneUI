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
      <template slot="goToVendorPayDetail" slot-scope="text, record, index">
        <a :href="`/purchase/payment?id=${record.id}`" style="width:80px">{{record.id}}</a>
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
  name: 'VendorPayTable',
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
        // {
        //   title: '供应商名称',
        //   align: 'center',
        //   dataIndex: 'vendorId_dictText'
        // },
        {
          title: '付款单号',
          align: 'center',
          dataIndex: 'id',
          scopedSlots: { customRender: 'goToVendorPayDetail' }
        },
        {
          title: '付款方式',
          align: 'center',
          dataIndex: 'paymentMethodCode_dictText'
        },
        {
          title: '付款金额',
          align: 'center',
          dataIndex: 'paymentAmount'
        },
        {
          title: '付款日期',
          align: 'center',
          dataIndex: 'paymentDate',
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
      this.url.list = sloter(Rest.GET_VENDOR_PAY_REPORT.url, year, customerId)
      this.loadData()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@assets/less/common.less';
</style>
