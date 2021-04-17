import { Button, Option, Select, Switch, MessageBox, Message, Dialog, Form, FormItem, Input, Icon, Tooltip, Loading, Container, Header, Main, Footer, Aside, Submenu, Row, Col, Menu, MenuItem, MenuItemGroup, RadioGroup, RadioButton, Table, TableColumn, Tag, Popover, Popconfirm, Notification } from 'element-ui'
const element = {
    install: function (Vue) {
        Vue.use(Switch)
        Vue.use(Select)
        Vue.use(Option)
        Vue.use(Form)
        Vue.use(FormItem);
        Vue.use(Button)
        Vue.use(Dialog)
        Vue.use(Input);
        Vue.use(Icon);
        Vue.use(Tooltip);
        Vue.use(Container);
        Vue.use(Header);
        Vue.use(Main);
        Vue.use(Footer);
        Vue.use(Aside);
        Vue.use(Submenu);
        Vue.use(Row);
        Vue.use(Col);
        Vue.use(Menu);
        Vue.use(MenuItem);
        Vue.use(MenuItemGroup);
        Vue.use(RadioGroup);
        Vue.use(RadioButton);
        Vue.use(Table);
        Vue.use(TableColumn);
        Vue.use(Tag);
        Vue.use(Popover);
        Vue.use(Popconfirm);
        Vue.component(Message.name, Message)
        Vue.use(Loading.directive);
        // 往vue实例原型里添加消息提示，方便全局调用
        Vue.prototype.$loading = Loading.service;
        Vue.prototype.$msgbox = MessageBox;
        Vue.prototype.$alert = MessageBox.alert;
        Vue.prototype.$confirm = MessageBox.confirm;
        Vue.prototype.$prompt = MessageBox.prompt;
        Vue.prototype.$notify = Notification;
        Vue.prototype.$message = Message;
        //使用：this.$message('这是一条消息提示');
    }
}
export default element
