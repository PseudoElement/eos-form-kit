import { Menu } from '@eos/rc-controls';
import React from 'react'
import { ITableSettings } from '../types/ITableSettings';
import { ITableApi } from '..//types/ITableApi'
import { FetchAction, FetchCondition, FetchControlRender } from '../types/ITableProvider';
import { IMenuItem } from '../../Menu/types';

export function generateGridMenu(fetchControl: FetchControlRender,
    fetchAction: FetchAction,
    fetchCondition: FetchCondition,
    tableSettings: ITableSettings,
    refApi: ITableApi
) {
    if (!tableSettings.menu) {
        return
    }
    const menuItems = (toolsList: IMenuItem[]) => {
        return (toolsList//.sort((a, b) => a.priority - b.priority)
            .map(menuItem => {
                const disableHandlerArr = menuItem.handlers?.filter(m => m.type === "disabled")
                const onClickHandlerArr = menuItem.handlers?.filter(m => m.type === "onClick")

                const disableHandlerName = disableHandlerArr?.length
                    ? disableHandlerArr[0].handlerName
                    : `disable.${menuItem.key}.${tableSettings.tableId}`
                const onClickHandlerName = onClickHandlerArr?.length
                    ? onClickHandlerArr[0].handlerName
                    : `${menuItem.key}.${tableSettings.tableId}`

                const disableFunc = fetchCondition(disableHandlerName);
                const onClickHandler = fetchAction(onClickHandlerName);
                const Component = fetchControl(menuItem.render.renderType);

                const props = {
                    ...menuItem.render.renderArgs,
                    //ref: ref as React.MutableRefObject<ITableApi>
                }

                if (menuItem.children) {
                    return <Menu.SubMenu
                        icon={Component && <Component {...props} />}
                        key={menuItem.key}
                        title={menuItem.title}
                        disabled={disableFunc && disableFunc({refApi, menuItem})}
                        morePanelElement={menuItem.fold}
                    >
                        {menuItems(menuItem.children)}
                    </Menu.SubMenu>
                }
                else {
                    return <Menu.Item
                        title={menuItem.title}
                        key={menuItem.key}
                        onClick={onClickHandler && (() => onClickHandler({refApi, menuItem}))}
                        disabled={disableFunc && disableFunc({refApi, menuItem})}
                        morePanelElement={menuItem.fold}
                    >
                        {Component && <Component {...props} />}
                    </Menu.Item>
                }
            })
        )
    }

    return menuItems(tableSettings.menu);
}