// 只能输入数字和小数点 numberAndDot

export default {
  bind(el) {
    el.addEventListener('input', function(e) {
      const input = e.target;
      const newValue = input.value.replace(/d{1,}\.?/g, ''); // 只保留数字和小数点
      input.value = newValue;
      input.dispatchEvent(new Event('input')); // 触发 input 事件更新 v-model 的值
    });
  }
}