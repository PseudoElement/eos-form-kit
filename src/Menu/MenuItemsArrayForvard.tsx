import { Menu } from '@eos/rc-controls'
import React from 'react'
import { IMenuProps } from '.'
import { IControlRenderProps } from '..'
import { MenuItem } from './MenuItem'
import { IMenuItem } from './types'

const MenuIemsArray = ({ menuItems, refApi, fetchAction, fetchControlRender, fetchCondition }: IMenuProps) => {
    const items = (toolsList: IMenuItem[]) => {
        return (toolsList
            .map(menuItem => {
                const disableHandler = menuItem.handlers?.find(m => m.type === "disabled")
                const onClickHandler = menuItem.handlers?.find(m => m.type === "onClick")

                const disableFunc = disableHandler && fetchCondition && fetchCondition(disableHandler.handlerName);
                const onClickFunc = onClickHandler && fetchAction && fetchAction(onClickHandler.handlerName);
                const Component = fetchControlRender && fetchControlRender(menuItem.render.renderType);

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
                    return <MenuItem key={menuItem.key} title={menuItem.title} render={menuItem.render} onClick={onClickFunc && (() => onClickFunc({ refApi, menuItem }))}></MenuItem>
                }
            })
        )
    }

    return items(menuItems)
}

export { MenuIemsArray }