import { Manager } from "../../core/Module";
import { UserCard } from "./UserCard";
import { MainFunction } from "./MainFunction";
import { FunctionList } from "./FunctionList";
import { Mask } from "../../modular/Mask/Mask";
import {Popups} from "../../modular/Popups/Popups"

Manager.Page((manager) => {
    const popups = manager.addModule(Popups,"popups")
    const mask = manager.addModule(Mask, "mask");
    manager.addModule(UserCard, "userCard", { mask,popups });
    manager.addModule(MainFunction, "mainFunction");
    manager.addModule(FunctionList, "functionList");
});