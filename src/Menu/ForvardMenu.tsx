import { FabIcon, Menu } from '@eos/rc-controls'
import React, { useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { IControlRenderProps } from '../EosTable/types'
import {
  useEosComponentsStore
} from '../Hooks/useEosComponentsStore'
import { IEosMenuApi, IEosMenuButtonApi, IMenuItem, IMenuProps, MenuItemHandlerType } from './types'
import { ForvardEosMenuItem } from './ForvardEosMenuItem'

const EosMenu = React.forwardRef<any, IMenuProps>(
  (
    {
      refApi,      
      menuItems,
      overflowMenuDisabled,
      ellipsis,
      triggerSubMenuAction
    }: IMenuProps,
    ref: React.MutableRefObject<IEosMenuApi>
  ) => {

    const {
      fetchActionFromStore,
      fetchConditionFromStore,
      fetchControlFromStore
    } = useEosComponentsStore()


    const getConditionValue = useCallback((typeCondition: MenuItemHandlerType, menuItemName: string | IMenuItem) => {
      let menuItem: IMenuItem | undefined = menuItemName as IMenuItem
      if (!menuItem.key) {
        menuItem = menuItems.find(m => m.key === menuItemName)
      }
      if (menuItem) {
        const conditionHandlerName = menuItem.handlers?.find((m) => m.type === typeCondition)
        const conditionHandler = conditionHandlerName && fetchConditionFromStore(conditionHandlerName.handlerName)
        const conditionValue = conditionHandler && conditionHandler({ refApi, menuItem })
        return conditionValue
      }
      return undefined
    }, [refApi, menuItems])

    const currentRef = ref ?? useRef<IEosMenuApi>()
    useImperativeHandle(currentRef, (): IEosMenuApi => {
      const api: IEosMenuApi = {
        setButtonDisabled: (name: string, disabled?: boolean) => {
          if (disabled === undefined) {
            return menuButtonsApi.get(name)?.current?.setDisabled(getConditionValue("disabled", name))
          }
          return menuButtonsApi.get(name)?.current?.setDisabled(disabled)

        },
        setButtonVisible: (name: string, visible?: boolean) => {
          if (visible === undefined) {
            return menuButtonsApi.get(name)?.current?.setDisabled(getConditionValue("visible", name))
          }
          return menuButtonsApi.get(name)?.current?.setVisible(visible)
        },
        setButtonChecked: (name: string, checked?: boolean) => {
          if (checked === undefined) {
            return menuButtonsApi.get(name)?.current?.setDisabled(getConditionValue("checked", name))
          }
          return menuButtonsApi.get(name)?.current?.setChecked(checked)
        }
      }
      return api
    })

    const [menuButtonsApi, setMenuButtonsApi] = useState<Map<string, React.MutableRefObject<IEosMenuButtonApi | undefined>>>(new Map())



    return useMemo(
      () => (
        <Menu
          triggerSubMenuAction={triggerSubMenuAction}
          ellipsis={ellipsis}
          overflowMenuDisabled={overflowMenuDisabled}
          mode='horizontal'
          overflowedIndicator={<FabIcon />}
        >
          {getItems(menuItems)}
        </Menu>
      ),
      []
    )

    function getItems(toolsList: IMenuItem[]) {
      return toolsList.map((menuItem) => {
        const onClickHandler = menuItem.handlers?.find((m) => m.type === 'onClick')
        const onClickFunc = onClickHandler && fetchActionFromStore(onClickHandler.handlerName)
        const Component = fetchControlFromStore(menuItem.render.renderType)
        const disable = getConditionValue("disabled", menuItem)
        const visible = getConditionValue("visible", menuItem)
        const checked = getConditionValue("checked", menuItem)

        const props: IControlRenderProps = {
          renderArgs: menuItem.render.renderArgs,
          refApi: refApi
        }

        if (menuItem.children) {
          return (
            <Menu.SubMenu
              icon={Component && <Component {...props} />}
              key={menuItem.key}
              title={menuItem.title}
              disabled={disable}
              morePanelElement={menuItem.fold}
            >
              {getItems(menuItem.children)}
            </Menu.SubMenu>
          )
        } else {
          const refButton = useRef<IEosMenuButtonApi>()
          setMenuButtonsApi((prev) => {
            const map = new Map(prev)
            map.set(menuItem.key, refButton)
            return map
          })
          return (
            <Menu.Item
              title={menuItem.title}
              key={menuItem.key}
              //onClick={onClickFunc && (() => onClickFunc({ refApi, menuItem }))}
              morePanelElement={menuItem.fold}
              icon={<ForvardEosMenuItem
                renderType={menuItem.render.renderType}
                title={menuItem.render.renderArgs?.titleButton}
                disabled={disable}
                checked={checked}
                visible={visible}
                iconName={menuItem.render.renderArgs?.iconName}
                type={menuItem.render.renderArgs?.typeButton}
                name={menuItem.key}
                ref={refButton}
                onClickItem={onClickFunc && (() => onClickFunc({ refApi, menuItem }))}
              />}
            >
            </Menu.Item>
          )
        }
      })
    }
  }
)

EosMenu.displayName = 'EosMenu'

export default EosMenu
