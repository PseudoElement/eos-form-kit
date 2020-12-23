import { Menu } from '@eos/rc-controls';
import React from 'react'
import { IMenuItem } from '../../Menu/types';
import { IControlRenderProps } from '../types/IControlRenderProps';
import { FetchAction, FetchCondition, FetchControlRender } from '../types/ITableProvider';

interface IGenMenuItemProps {
    menuItems: IMenuItem[]
    fetchControl?: FetchControlRender
    fetchAction?: FetchAction
    fetchCondition?: FetchCondition
    refApi: any
    fetchControlFromStore: FetchControlRender
    fetchActionFromStore: FetchAction
    fetchConditionFromStore: FetchCondition
}

function GenMenuItems({ fetchAction, fetchCondition, fetchControl, menuItems, refApi, fetchControlFromStore, fetchActionFromStore, fetchConditionFromStore }: IGenMenuItemProps) {
    
    const items = (toolsList: IMenuItem[]) => {
        return (toolsList
            .map(menuItem => {
                const disableHandler = menuItem.handlers?.find(m => m.type === "disabled")
                const onClickHandler = menuItem.handlers?.find(m => m.type === "onClick")                

                const disableFunc = disableHandler && ((fetchCondition && fetchConditionFromStore(disableHandler.handlerName)) || (fetchConditionFromStore(disableHandler.handlerName)))
                const onClickFunc = onClickHandler && ((fetchAction && fetchAction(onClickHandler.handlerName)) || (fetchActionFromStore(onClickHandler.handlerName)))
                const Component = (fetchControl && fetchControl(menuItem.render.renderType)) || (fetchControlFromStore(menuItem.render.renderType))

                const props: IControlRenderProps = {
                    renderArgs: menuItem.render.renderArgs,
                    refApi: refApi
                }

                if (menuItem.children) {
                    return <Menu.SubMenu
                        icon={Component && <Component {...props} />}
                        key={menuItem.key}
                        title={menuItem.title}
                        disabled={disableFunc && (disableFunc({ refApi, menuItem }))}
                        morePanelElement={menuItem.fold}>
                        {items(menuItem.children)}
                    </Menu.SubMenu>
                }
                else {
                    return <Menu.Item
                        title={menuItem.title}
                        key={menuItem.key}
                        onClick={onClickFunc && (() => onClickFunc({ refApi, menuItem }))}
                        disabled={disableFunc && disableFunc({ refApi, menuItem })}
                        morePanelElement={menuItem.fold}>
                        {Component && <Component {...props} />}
                    </Menu.Item>
                }
            })
        )
    }

    return items(menuItems)
}

export default GenMenuItems