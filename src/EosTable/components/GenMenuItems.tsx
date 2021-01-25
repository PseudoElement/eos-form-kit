import { Divider, Menu } from '@eos/rc-controls';
import React from 'react'
import { IMenuItem } from '../../Menu/types';
import { IControlRenderProps } from '../types/IControlRenderProps';
import { FetchAction, FetchCondition, FetchControlRender, IHandlerProps } from '../types/ITableProvider';

export interface IGenMenuItemProps {
    menuItems: IMenuItem[]
    fetchControl?: FetchControlRender
    fetchAction?: FetchAction
    fetchCondition?: FetchCondition
    refApi: any
    fetchControlFromStore: FetchControlRender
    fetchActionFromStore: FetchAction
    fetchConditionFromStore: FetchCondition
    rowRecord?: any
    rowIndex?: number
    rowKey?: string
    dividerOrientation?: "vertical" | "horizontal",
    locale?: (key: string) => string
}

function GenMenuItems({ fetchAction,
    fetchCondition,
    fetchControl,
    menuItems,
    refApi,
    fetchControlFromStore,
    fetchActionFromStore,
    fetchConditionFromStore,
    rowRecord,
    rowIndex,
    rowKey,
    dividerOrientation = "vertical",
    locale }: IGenMenuItemProps) {

    const items = (toolsList: IMenuItem[]) => {
        return (toolsList
            .map(menuItem => {
                if (menuItem.render.renderType === "Divider")
                    return <Divider type={dividerOrientation} />

                const disableHandler = menuItem.handlers?.find(m => m.type === "disabled")
                const onClickHandler = menuItem.handlers?.find(m => m.type === "onClick")

                const disableFunc = disableHandler && ((fetchCondition && fetchCondition(disableHandler.handlerName)) || (fetchConditionFromStore(disableHandler.handlerName)))
                const onClickFunc = onClickHandler && ((fetchAction && fetchAction(onClickHandler.handlerName)) || (fetchActionFromStore(onClickHandler.handlerName)))
                const Component = (fetchControl && fetchControl(menuItem.render.renderType)) || (fetchControlFromStore(menuItem.render.renderType))

                const controlProps: IControlRenderProps = {
                    renderArgs: {
                        ...menuItem.render.renderArgs,
                        titleButton: menuItem.render.renderArgs?.titleButton
                            ? (locale
                                ? locale(menuItem.render.renderArgs.titleButton)
                                : menuItem.render.renderArgs.titleButton)
                            : undefined
                    },
                    refApi: refApi
                }

                const handlerProps: IHandlerProps = {
                    refApi,
                    menuItem,
                    rowIndex,
                    rowRecord,
                    rowKey
                }
                const title = menuItem.title ? (locale ? locale(menuItem.title) : menuItem.title) : undefined
                if (menuItem.children) {
                    return <Menu.SubMenu
                        icon={Component && <Component {...controlProps} />}
                        key={menuItem.key}
                        title={title}
                        disabled={disableFunc && (disableFunc(handlerProps))}
                        morePanelElement={menuItem.fold}>
                        {items(menuItem.children)}
                    </Menu.SubMenu>
                }
                else {
                    return <Menu.Item
                        title={title}
                        key={menuItem.key}
                        onClick={onClickFunc && (() => onClickFunc(handlerProps))}
                        disabled={disableFunc && disableFunc(handlerProps)}
                        morePanelElement={menuItem.fold}>
                        {Component && <Component {...controlProps} />}
                    </Menu.Item>
                }
            })
        )
    }

    return items(menuItems)
}

export default GenMenuItems