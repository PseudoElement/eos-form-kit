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

export enum MenuRenderTypes {
    Icon = "Icon",
    Button = "Button",
    CheckableButton = "CheckableButton",
    QuickSearch = "QuickSearch",
    ShowFilter = "ShowFilter",
    Divider = "Divider"
}

interface MenuItemHandler {
    type: MenuItemHandlerType
    handlerName: string
}

export type MenuItemHandlerType = "disabled" | "onClick" | "checked" | "visible"

export interface IEosMenuApi {
    setButtonDisabled: (name: string, disabled?: boolean) => void
    setButtonChecked: (name: string, checked?: boolean) => void
    setButtonVisible: (name: string, visible?: boolean) => void
}

export interface IEosMenuButtonProps {
    name: string
    disabled?: boolean
    onClickItem?: () => void
    checked?: boolean
    iconName?: string
    title?: string
    type?: 'primary' | 'link' | 'default'
    visible?: boolean
    component?: React.FC
    renderType: string
}

export interface IEosMenuButtonApi {
    setChecked: (checked?: boolean) => void
    setDisabled: (disabled?: boolean) => void
    setVisible: (visibled?: boolean) => void
}

export interface IMenuProps {
    menuItems: IMenuItem[]
    refApi: any       
    overflowMenuDisabled?: boolean
    ellipsis?: boolean
    triggerSubMenuAction?: 'click' | 'hover'
  }
