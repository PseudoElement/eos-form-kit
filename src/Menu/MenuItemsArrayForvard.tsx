import { Menu } from '@eos/rc-controls'
import React, { Fragment, useContext, useEffect } from 'react'
import { IMenuProps } from '.'
import { FormContext } from '../Context/Context'
import { IControlRenderProps } from '../EosTable/types'
import { MenuItemGen } from './MenuItem'
import { IMenuItem } from './types'

const MenuIemsArray = React.forwardRef(({ menuItems, refApi, fetchControlRender, fetchCondition }: IMenuProps, ref: any) => {
    const context = useContext(FormContext)
    useEffect(() => {

    }, [context])
    const items = (toolsList: IMenuItem[]) => {
        return (toolsList
            .map(menuItem => {
                const disableHandler = menuItem.handlers?.find(m => m.type === "disabled")
                //const onClickHandler = menuItem.handlers?.find(m => m.type === "onClick")

                const disableFunc = disableHandler && fetchCondition && fetchCondition(disableHandler.handlerName);
                //const onClickFunc = onClickHandler && fetchAction && fetchAction(onClickHandler.handlerName);
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
                    return <MenuItemGen ref={ref} key={menuItem.key} title={menuItem.title} render={menuItem.render}></MenuItemGen>
                }
            })
        )
    }

    return <Fragment>{items(menuItems)}</Fragment>
})

export { MenuIemsArray }