
export default {
  methods: {
    back(path) {
      this.$router.replace({
        path: path
      })
    },
    resetForm() {
      if (this.form) {
        this.form.resetFields()
      }
    }
  }
}