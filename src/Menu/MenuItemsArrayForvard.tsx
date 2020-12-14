import { Menu } from '@eos/rc-controls'
import React, { useContext, useEffect } from 'react'
import { IMenuProps } from '.'
import { IControlRenderProps } from '..'
import { FormContext } from '../Context/Context'
import { MenuItemGen } from './MenuItem'
import { IMenuItem } from './types'

const MenuIemsArray = ({ menuItems, refApi, fetchAction, fetchControlRender, fetchCondition }: IMenuProps) => {
    const context = useContext(FormContext)
    useEffect(()=>{
        
    },[context])
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
                    return <MenuItemGen key={menuItem.key} title={menuItem.title} render={menuItem.render} onClick={onClickFunc && (() => onClickFunc({ refApi, menuItem }))}></MenuItemGen>
                }
            })
        )
    }

    return items(menuItems)
}

export { MenuIemsArray }