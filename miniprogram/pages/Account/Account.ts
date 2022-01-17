import { Manager } from "../../core/Module";
import { UserCard } from "./UserCard";
import { MainFunction } from "./MainFunction";
import { FunctionList } from "./FunctionList";

Manager.Page((manager) => {
    manager.addModule(UserCard, "userCard");
    manager.addModule(MainFunction, "mainFunction");
    manager.addModule(FunctionList, "functionList");
});