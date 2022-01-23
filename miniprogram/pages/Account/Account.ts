import { Manager } from "../../core/Module";
import { UserCard } from "./UserCard";
import { MainFunction } from "./MainFunction";
import { FunctionList } from "./FunctionList";
import { PopupLayer } from "../../modular/PopupLayer";

(async () => {

    // 初始化页面
    const { manager, query } = await Manager.PageAsync();

    // 添加蒙版 Modular
    const popupLayer: PopupLayer<"a" | "b"> = manager.addModule(PopupLayer, "mask") as any;
    popupLayer.emit("show", "a");

    // 添加 UserCard Modular
    manager.addModule(UserCard, "userCard");

    // 添加 MainFunction Modular
    manager.addModule(MainFunction, "mainFunction");

    // 添加 FunctionList Modular
    manager.addModule(FunctionList, "functionList");

    // 初始化全部 Modular
    await manager.loadAllModule(query);
})();