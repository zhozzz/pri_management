/*
 * @Description:
 * @Author:
 * @Date: 2019-08-22 10:17:42
 * @LastEditors  : zhuhao
 * @LastEditTime : 2019-12-31 15:48:59
 */
import {
    Select,
    Option,
    OptionGroup,
    Input,
    Tree,
    Dialog,
    Row,
    Col,
    Button,
    Form,
    FormItem,
    Table,
    TableColumn,
    Header,
    Main,
    Aside,
    Container,
    Pagination,
    Drawer,
    Transfer,
    MessageBox,
    Switch,
    Radio,
    Message,
    DatePicker,
    TimePicker,
    TimeSelect,
    InputNumber,
    Card,
    Divider,
    Tag,
    Cascader,
    Slider,
    Carousel,
    CarouselItem,
    Popover,
    CheckboxButton,
    Checkbox,
    Upload,
    CheckboxGroup,
    Calendar,
    ButtonGroup,
    Tabs,
    TabPane,
    Tooltip,
    Timeline,
    Badge,
    Scrollbar,
    TimelineItem,
    Loading,
    Notification,
    Collapse,
    RadioGroup,
    CollapseItem,
    Image,
    RadioButton
} from 'element-ui'
const element = {
    install: function (Vue) {
        Vue.use(Select)
        Vue.use(Option)
        Vue.use(OptionGroup)
        Vue.use(Input)
        Vue.use(Tree)
        Vue.use(Dialog)
        Vue.use(Row)
        Vue.use(Col)
        Vue.use(Button)
        Vue.use(Form)
        Vue.use(FormItem)
        Vue.use(Table)
        Vue.use(TableColumn)
        Vue.use(TimePicker)
        Vue.use(Header)
        Vue.use(Main)
        Vue.use(Aside)
        Vue.use(Container)
        Vue.use(Pagination)
        Vue.use(Drawer)
        Vue.use(Transfer)
        Vue.use(Switch)
        Vue.use(Radio)
        Vue.use(DatePicker)
        Vue.use(TimeSelect)
        Vue.use(TimePicker)
        Vue.use(InputNumber)
        Vue.use(Slider)
        Vue.use(Card)
        Vue.use(Divider)
        Vue.use(Tag)
        Vue.use(Cascader)
        Vue.use(Carousel)
        Vue.use(CarouselItem)
        Vue.use(Popover)
        Vue.use(CheckboxGroup)
        Vue.use(CheckboxButton)
        Vue.use(Upload)
        Vue.use(Tooltip)
        Vue.use(Calendar)
        Vue.use(ButtonGroup)
        Vue.use(Tabs)
        Vue.use(TabPane)
        Vue.use(Timeline)
        Vue.use(TimelineItem)
        Vue.use(Checkbox)
        Vue.use(Scrollbar)
        Vue.use(Badge)
        Vue.use(Loading)
        Vue.use(Collapse)
        Vue.use(RadioGroup)
        Vue.use(CollapseItem)
        Vue.use(Image)
        Vue.use(RadioButton)

        Vue.prototype.$confirm = MessageBox.confirm
        Vue.prototype.$prompt = MessageBox.prompt
        Vue.prototype.$msgbox = MessageBox
        Vue.prototype.$message = Message
        Vue.prototype.$notify = Notification
    }
}
export default element
