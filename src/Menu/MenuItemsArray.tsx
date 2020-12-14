import { Menu } from '@eos/rc-controls'
import React from 'react'
import { IMenuProps } from '.'
import { IControlRenderProps } from '..'

import { IMenuItem } from './types'

const MenuIemsArray = ({ menuItems, refApi, fetchAction, fetchControlRender, fetchCondition, contextButtons }: IMenuProps) => {
    const items = (toolsList: IMenuItem[]) => {
        return (toolsList
            .map(menuItem => {
                const disableHandler = menuItem.handlers?.find(m => m.type === "disabled")
                const onClickHandler = menuItem.handlers?.find(m => m.type === "onClick")

                const disableFunc = disableHandler && fetchCondition && fetchCondition(disableHandler.handlerName);
                const onClickFunc = onClickHandler && fetchAction && fetchAction(onClickHandler.handlerName);
                const Component = fetchControlRender && fetchControlRender(menuItem.render.renderType);
                const disable = contextButtons?.find(b => b.name === menuItem.key)?.disabled || (disableFunc && (disableFunc({ refApi, menuItem })))

                const props: IControlRenderProps = {
                    renderArgs: menuItem.render.renderArgs,
                    refApi: refApi
                }

                if (menuItem.children) {
                    return <Menu.SubMenu
                        icon={Component && <Component {...props} />}
                        key={menuItem.key}
                        title={menuItem.title}
                        disabled={disable}
                        morePanelElement={menuItem.fold}>
                        {items(menuItem.children)}
                    </Menu.SubMenu>
                }
                else {
                    return <Menu.Item
                        title={menuItem.title}
                        key={menuItem.key}
                        onClick={onClickFunc && (() => onClickFunc({ refApi, menuItem }))}
                        disabled={disable}
                        morePanelElement={menuItem.fold}>
                        {Component && <Component {...props} />}
                    </Menu.Item>
                }
            })
        )
    }

    return items(menuItems)
}

export { MenuIemsArray }