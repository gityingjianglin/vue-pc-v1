import { Button, Option, Select, Switch, MessageBox, Message, Scrollbar, RadioGroup, Radio, Loading, Popover, Table, TableColumn, Input, Row, Col, Dialog, Drawer, Form, FormItem, Cascader, Autocomplete, Checkbox, CheckboxGroup, Pagination, DatePicker, TimePicker, Upload, Tooltip, Tabs, TabPane, DropdownMenu, DropdownItem, Dropdown } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
const element = {
    install: function(Vue) {
        Vue.use(Button)
        Vue.use(Switch)
        Vue.use(Select)
        Vue.use(Option)
        Vue.use(Scrollbar)
        Vue.use(RadioGroup)
        Vue.use(Radio)
        Vue.use(Loading)
        Vue.use(Popover)
        Vue.use(Table)
        Vue.use(TableColumn)
        Vue.use(Input)
        Vue.use(Row)
        Vue.use(Col)
        Vue.use(Dialog)
        Vue.use(Drawer)
        Vue.use(Form)
        Vue.use(FormItem)
        Vue.use(Cascader)
        Vue.use(Autocomplete)
        Vue.use(Checkbox)
        Vue.use(CheckboxGroup)
        Vue.use(Pagination)
        Vue.use(DatePicker)
        Vue.use(TimePicker)
        Vue.use(Upload)
        Vue.use(Tooltip)
        Vue.use(Tabs)
        Vue.use(TabPane)
        Vue.use(DropdownMenu)
        Vue.use(DropdownItem)
        Vue.use(Dropdown)
       	// 往vue实例原型里添加消息提示，方便全局调用
        Vue.prototype.$msgbox = MessageBox
        Vue.prototype.$alert = MessageBox.alert
        Vue.prototype.$confirm = MessageBox.confirm
        Vue.prototype.$message = Message
        //使用：this.$message('这是一条消息提示');
    }
}
export default element
