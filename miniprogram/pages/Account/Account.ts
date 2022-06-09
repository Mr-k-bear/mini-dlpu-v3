import { Manager } from "../../core/Module";
import { UserCard } from "./UserCard";
import { MainFunction } from "./MainFunction";
import { FunctionList } from "./FunctionList";
import { Login } from "./Login";
import { PopupLayer } from "../../modular/PopupLayer";

(async () => {

    // 初始化页面
    const { manager, query } = await Manager.PageAsync();

    // 添加弹出层 Modular
    const popupLayer: PopupLayer<"loginLayer"> = manager.addModule(PopupLayer, "mask") as any;
    
    // 初始化弹出层
    popupLayer.initLayers(["loginLayer"]);

    // 添加 UserCard Modular
    const userCard = manager.addModule(UserCard, "userCard");

    // 添加登录模块
    const loginLayer = manager.addModule(Login, "loginLayer");

    userCard.on("clickChangeTheme", () => {
        popupLayer.emit("show", "loginLayer");
    });

    // 添加 MainFunction Modular
    manager.addModule(MainFunction, "mainFunction");

    // 添加 FunctionList Modular
    manager.addModule(FunctionList, "functionList");

    // 初始化全部 Modular
    await manager.loadAllModule(query);
})();