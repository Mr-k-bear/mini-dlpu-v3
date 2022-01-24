import { Manager } from "../../core/Module";
import { UserCard } from "./UserCard";
import { MainFunction } from "./MainFunction";
import { FunctionList } from "./FunctionList";
import { PopupLayer } from "../../modular/PopupLayer";
import { TestLayerA } from "./TestLayerA";

(async () => {

    // 初始化页面
    const { manager, query } = await Manager.PageAsync();

    // 添加弹出层 Modular
    const popupLayer: PopupLayer<"layerA" | "layerB"> = manager.addModule(PopupLayer, "mask") as any;

    // 添加 UserCard Modular
    const userCard = manager.addModule(UserCard, "userCard");

    //#region test layer
    popupLayer.initLayers(["layerA", "layerB"]);
    const testLayerA = manager.addModule(TestLayerA, "testLayerA");
    userCard.on("clickChangeTheme", () => {
        popupLayer.emit("show", "layerA");
    })
    testLayerA.on("click", () => {
        popupLayer.emit("show", "layerB");
    })
    //#endregion

    // 添加 MainFunction Modular
    manager.addModule(MainFunction, "mainFunction");

    // 添加 FunctionList Modular
    manager.addModule(FunctionList, "functionList");

    // 初始化全部 Modular
    await manager.loadAllModule(query);
})();