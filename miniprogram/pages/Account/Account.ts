import { Manager } from "../../core/Module";
import { UserCard } from "./UserCard";
import { MainFunction } from "./MainFunction";
import { FunctionList } from "./FunctionList";
import { Mask } from "../../modular/Mask/Mask";
import {Popups} from "../../modular/Popups/Popups"

(async () => {

    // 初始化页面
    const { manager, query } = await Manager.PageAsync();

    // 添加蒙版 Modular
    const mask = manager.addModule(Mask, "mask");

    const popups = manager.addModule(Popups,"popups")

    // 添加 UserCard Modular
    manager.addModule(UserCard, "userCard", { mask, popups });

    // 添加 MainFunction Modular
    manager.addModule(MainFunction, "mainFunction");

    // 添加 FunctionList Modular
    manager.addModule(FunctionList, "functionList");

    // 初始化全部 Modular
    await manager.loadAllModule(query);
})();