<template>
  <a-modal
    :width="800"
    :visible="visible"
    :footer="null"
    @ok="handleOk"
    @cancel="handleCancel"
    okText="打印"
    cancelText="取消"
  >
    <section ref="print" id="printContent">
      <slot></slot>
    </section>
    <div class="no-print" style="text-align: right;margin-top:2rem">
      <a-button v-print="'#printContent'" ghost type="primary">打印</a-button>
    </div>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
export default {
  name: 'PrintModal',
  data() {
    return {
      visible: false
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show(val) {
      this.visible = val
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {},
    handleCancel() {
      this.close()
    }
  }
}
</script>