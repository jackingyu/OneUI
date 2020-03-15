<template>
  <div>
    <div class="welcome content">
      <h1>欢迎登入测试系统</h1>
      <div class="desc">系统正在开发中...</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'welcome',
  data() {
    return {
      text: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.welcome {
  min-height: 500px;
  background: white;
  height: 80%;
  align-items: center;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .img {
    display: inline-block;
    padding-right: 52px;
    zoom: 1;
    img {
      height: 360px;
      max-width: 430px;
    }
  }
  .content {
    display: inline-block;
    flex: auto;
    h1 {
      color: #434e59;
      font-size: 72px;
      font-weight: 600;
      line-height: 72px;
      margin-bottom: 24px;
    }
    .desc {
      color: rgba(0, 0, 0, 0.45);
      font-size: 20px;
      line-height: 28px;
      margin-bottom: 16px;
    }
  }
}

.mobile {
  .exception {
    margin-top: 30px;
    .img {
      padding-right: unset;

      img {
        height: 40%;
        max-width: 80%;
      }
    }
  }
}
</style>