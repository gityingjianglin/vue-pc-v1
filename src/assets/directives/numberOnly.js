// 只能输入数字  v-numberOnly

export default {
  bind(el) {
    el.addEventListener('input', function(e) {
      const input = e.target;
      const newValue = input.value.replace(/\D/g, '');
      input.value = newValue;
      input.dispatchEvent(new Event('input')); // 触发 input 事件更新 v-model 的值
    });
  }
}