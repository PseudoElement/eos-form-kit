import { IRender } from "../EosTable/types/ITableSettings";

export interface IMenuItem {
    key: string
    title?: string
    description?: string
    render: IRender
    children?: IMenuItem[]
    fold?: boolean
    handlers?: MenuItemHandler[]    
}

interface MenuItemHandler {
    type: "disabled" | "onClick"
    handlerName: string
}