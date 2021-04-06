import { initMixin } from "./init";

function Vue(options) {
    //options 为传入的选项
    this._init(options)
}
initMixin(Vue);

export default Vue;