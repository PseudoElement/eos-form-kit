import { Menu } from '@eos/rc-controls';
import React from 'react'
import { IControlRenderProps } from '../types/IControlRenderProps';
import { FetchAction, FetchCondition, FetchControlRender } from '../types/ITableProvider';
import { IMenuItem } from '../types/ITableSettings';

interface IGenMenuItemProps {
    menuItems: IMenuItem[]
    fetchControl?: FetchControlRender
    fetchAction?: FetchAction
    fetchCondition?: FetchCondition
    refApi: any
}

function GenMenuItems({ fetchAction, fetchCondition, fetchControl, menuItems, refApi }: IGenMenuItemProps) {
    const items = (toolsList: IMenuItem[]) => {
        return (toolsList
            .map(menuItem => {
                const disableHandler = menuItem.handlers?.find(m => m.type === "disabled")
                const onClickHandler = menuItem.handlers?.find(m => m.type === "onClick")

                const disableFunc = disableHandler && fetchCondition && fetchCondition(disableHandler.handlerName);
                const onClickFunc = onClickHandler && fetchAction && fetchAction(onClickHandler.handlerName);
                const Component = fetchControl && fetchControl(menuItem.render.renderType);

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

// function MenuGen({ fetchAction, fetchCondition, fetchControl, menuItems, refApi }: IGenMenuItemProps) {

//     const buttonRefs = useMemo(() => Array(menuItems.length).fill(0).map(i => React.createRef()), [])

//     const items = menuItems.map((menuItem, index) => {
//         const disableHandler = menuItem.handlers?.find(m => m.type === "disabled")
//                 const onClickHandler = menuItem.handlers?.find(m => m.type === "onClick")

//                 const disableFunc = disableHandler && fetchCondition && fetchCondition(disableHandler.handlerName);
//                 const onClickFunc = onClickHandler && fetchAction && fetchAction(onClickHandler.handlerName);
//                 const Component = fetchControl && fetchControl(menuItem.render.renderType);

//                 const props: IControlRenderProps = {
//                     renderArgs: menuItem.render.renderArgs,
//                     refApi: refApi
//                 }
//         return <Menu.Item
//                     ref={buttonRefs[index]}
//                         title={menuItem.title}
//                         key={menuItem.key}
//                         onClick={onClickFunc && (() => onClickFunc(refApi))}
//                         disabled={disableFunc && disableFunc(refApi)}
//                         morePanelElement={menuItem.fold}>
//                         {Component && <Component {...props} />}                        
//                     </Menu.Item>
//     })

//     const items = (toolsList: IMenuItem[]) => {
//         return (toolsList
//             .map(menuItem => {
//                 const disableHandler = menuItem.handlers?.find(m => m.type === "disabled")
//                 const onClickHandler = menuItem.handlers?.find(m => m.type === "onClick")

//                 const disableFunc = disableHandler && fetchCondition && fetchCondition(disableHandler.handlerName);
//                 const onClickFunc = onClickHandler && fetchAction && fetchAction(onClickHandler.handlerName);
//                 const Component = fetchControl && fetchControl(menuItem.render.renderType);

//                 const props: IControlRenderProps = {
//                     renderArgs: menuItem.render.renderArgs,
//                     refApi: refApi
//                 }
//                 // return <MenuItem key={menuItem.key}
//                 //     itemKey={menuItem.key}
//                 //     title={menuItem.title}
//                 //     Component={Component}
//                 //     componentArgs={props}
//                 //     morePanelElement={menuItem.fold}
//                 //     onClick={onClickFunc && (() => onClickFunc(refApi))}
//                 //     disabled={disableFunc && disableFunc(refApi)} />

//                 if (menuItem.children) {
//                     return <Menu.SubMenu
//                         icon={Component && <Component {...props} />}
//                         key={menuItem.key}
//                         title={menuItem.title}
//                         disabled={disableFunc && (disableFunc(refApi))}
//                         morePanelElement={menuItem.fold}>
//                         {items(menuItem.children)}
//                     </Menu.SubMenu>
//                 }
//                 else {
//                     return <Menu.Item
//                     ref={buttonRefs}
//                         title={menuItem.title}
//                         key={menuItem.key}
//                         onClick={onClickFunc && (() => onClickFunc(refApi))}
//                         disabled={disableFunc && disableFunc(refApi)}
//                         morePanelElement={menuItem.fold}>
//                         {Component && <Component {...props} />}                        
//                     </Menu.Item>
//                     // <MenuItem onClick={onClickFunc} key={menuItem.key} ChildComponent={Component} menuItemSetting={menuItem} refApi={refApi} disabledFunc={disableFunc} />
//                 }
//             })
//         )
//     }
//     return <Menu>{items(menuItems)}</Menu>
// }

export default GenMenuItems


// interface MenuItemProps {
//     ChildComponent?: FC<IControlRenderProps>
//     onClick?: (refApi: any) => Promise<void> | void
//     disabledFunc?: (refApi: any) => boolean
//     visible?: (refApi: any) => boolean
//     menuItemSetting: IMenuItem
//     refApi: any
// }

// function MenuItem({ ChildComponent, onClick, disabledFunc, visible, menuItemSetting, refApi }: MenuItemProps) {
//     const props: IControlRenderProps = {
//         renderArgs: menuItemSetting.render.renderArgs,
//         refApi: refApi
//     }
//     const [disabled, setDisabled] = useState<boolean>(false)
//     useEffect(() => {
//         disabledFunc && setDisabled(() => disabledFunc(refApi))
//     }, [refApi, disabledFunc])

//     const item = (
//         <Menu.Item
//             title={menuItemSetting.title}
//             key={menuItemSetting.key}
//             onClick={onClick && (() => onClick(refApi))}
//             disabled={disabled}
//             morePanelElement={menuItemSetting.fold}>
//             {ChildComponent && <ChildComponent {...props} />}
//         </Menu.Item>
//     )
//     return React.useMemo(() => item, [disabled])
// }


// interface MenuItemApi {
//     disabled?: boolean
// }
// const MenuContext = React.createContext<MenuItemApi | undefined>(undefined)

// interface MenuItemProps {
//     itemKey: string
//     title?: string
//     morePanelElement?: boolean
//     Component: React.FC
//     componentArgs: any
//     disabled?: boolean
//     onClick: (() => void | Promise<void>) | undefined
// }
// const MenuItem = ({ itemKey, title, morePanelElement, Component, componentArgs, onClick, disabled }: MenuItemProps) => {
//     //const menuItemContext = useContext(MenuContext)
//     const item = (
//         <Menu.Item
//             title={title}
//             key={itemKey}
//             onClick={onClick}
//             disabled={disabled}
//             morePanelElement={morePanelElement}>
//             {Component && <Component {...componentArgs} />}
//         </Menu.Item>
//     )
//     return item
// }

// const MemoMenuItem = ({ itemKey, title, morePanelElement, Component, componentArgs, onClick, disabled }: MenuItemProps) => {
//     const item = <MenuItem itemKey={itemKey} title={title} morePanelElement={morePanelElement} Component={Component} componentArgs={componentArgs} onClick={onClick}></MenuItem>

//     return( 
//     //<MenuContext.Provider value={
//     //    { disabled: disabled }
//     //}>
//         {item}
//     //</MenuContext.Provider>
//     )
// }