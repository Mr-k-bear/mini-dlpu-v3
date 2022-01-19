import { Manager } from "../../core/Module";
import { UserCard } from "./UserCard";
import { MainFunction } from "./MainFunction";
import { FunctionList } from "./FunctionList";
import { Mask } from "../../modular/Mask/Mask";

Manager.Page((manager) => {
    const mask = manager.addModule(Mask, "mask");
    manager.addModule(UserCard, "userCard", { mask });
    manager.addModule(MainFunction, "mainFunction");
    manager.addModule(FunctionList, "functionList");
});