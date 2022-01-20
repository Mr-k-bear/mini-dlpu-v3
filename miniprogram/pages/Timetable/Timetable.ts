import { Manager} from "../../core/Module";
import { StatusBar } from "./StatusBar";
import { TestCore } from "./TestCore";

/**
 * 此页面使用 Manager 进行模块化管理
 * 若要添加先功能请先定义 Modular 并添加至 Manager
 */
(async () => {

    // 初始化页面
    const { manager, query } = await Manager.PageAsync();

    // 添加 StatusBar Modular
    manager.addModule(StatusBar, "statusBar");
    
    // 添加 TestCore Modular
    manager.addModule(TestCore, "testCore");

    // 初始化全部 Modular
    await manager.loadAllModule(query);
})()