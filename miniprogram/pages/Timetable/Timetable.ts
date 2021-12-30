import { Manager} from "../../core/Module";
import { StatusBar } from "./StatusBar";
import { TestCore } from "./TestCore";

/**
 * 此页面使用 Manager 进行模块化管理
 * 若要添加先功能请先定义 Modular 并添加至 Manager
 */
Manager.Page((manager)=>{
    manager.addModule(StatusBar, "statusBar");
    manager.addModule(TestCore, "testCore");
})