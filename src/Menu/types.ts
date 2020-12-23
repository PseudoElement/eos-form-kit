import { IRender } from "../EosTable/types/ITableSettings";
import { ScopeEosComponentsStore } from "../Hooks/useEosComponentsStore";

export interface IMenuItem {
    key: string
    title?: string
    description?: string
    render: IMenuRender
    children?: IMenuItem[]
    fold?: boolean
    handlers?: MenuItemHandler[]
}


export interface IMenuRender extends Omit<IRender, "renderType"> {
    renderType: MenuRenderTypes
}

export type MenuRenderTypes = "Icon" | "Button" | "CheckableButton" | "QuickSearch"

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
    renderType: MenuRenderTypes
}

export interface IEosMenuButtonApi {
    setChecked: (checked?: boolean) => void
    setDisabled: (disabled?: boolean) => void
    setVisible: (visibled?: boolean) => void
}

export interface IMenuProps {
    menuItems: IMenuItem[]
    refApi: any   
    scopeEosComponentsStore?: ScopeEosComponentsStore
    overflowMenuDisabled?: boolean
    ellipsis?: boolean
    triggerSubMenuAction?: 'click' | 'hover'
  }
