import { FabIcon, Menu } from '@eos/rc-controls'
import React, { useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { IControlRenderProps } from '../EosTable/types'
import {
  useEosComponentsStore
} from '../Hooks/useEosComponentsStore'
import { IEosMenuApi, IMenuItem, IMenuProps, MenuItemHandlerType } from './types'
import { IMenuButton } from '../Context/Context'

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

    const [menuButtonsState, setMenuButtonsState] = useState<IMenuButton[]>(() => {
      let menuButtons: IMenuButton[] = []
      function setMenuButtons(menuItems: IMenuItem[]) {
        menuItems.forEach((menuItem) => {
          if (menuItem.children) {
            setMenuButtons(menuItem.children)
          }
          else {
            menuButtons.push({
              name: menuItem.key,
              checked: getConditionValue('checked', menuItem.key),
              disabled: getConditionValue('disabled', menuItem.key),
              visible: getConditionValue('visible', menuItem.key)
            })
          }
        })
      }
      setMenuButtons(menuItems)
      return menuButtons
    })

    const currentRef = ref ?? useRef<IEosMenuApi>()
    useImperativeHandle(currentRef, (): IEosMenuApi => {
      const api: IEosMenuApi = {
        setButtonDisabled: (name: string, disabled?: boolean) => {
          const newConditionValue = disabled === undefined ? getConditionValue("disabled", name) : disabled
          setMenuButtonsState((prev) => {
            const index = prev.findIndex(item => item.name === name)
            if (prev[index].disabled === newConditionValue) {
              return prev
            }
            const newMenuButtons = [...prev]
            newMenuButtons[index] = {
              ...newMenuButtons[index],
              disabled: newConditionValue
            }
            return newMenuButtons
          })
        },
        setButtonVisible: (name: string, visible?: boolean) => {
          const newConditionValue = visible === undefined ? getConditionValue("visible", name) : visible
          setMenuButtonsState((prev) => {
            const index = prev.findIndex(item => item.name === name)
            if (prev[index].visible === newConditionValue) {
              return prev
            }
            const newMenuButtons = [...prev]
            newMenuButtons[index] = {
              ...newMenuButtons[index],
              visible: newConditionValue
            }
            return newMenuButtons
          })

        },
        setButtonChecked: (name: string, checked?: boolean) => {
          const newConditionValue = checked === undefined ? getConditionValue("checked", name) : checked
          setMenuButtonsState((prev) => {
            const index = prev.findIndex(item => item.name === name)
            if (prev[index].checked === newConditionValue) {
              return prev
            }
            const newMenuButtons = [...prev]
            newMenuButtons[index] = {
              ...newMenuButtons[index],
              checked: newConditionValue
            }
            return newMenuButtons
          })
        }
      }
      return api
    })

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
      [menuButtonsState]
    )

    function getItems(toolsList: IMenuItem[]) {
      return toolsList.map((menuItem) => {
        const onClickHandler = menuItem.handlers?.find((m) => m.type === 'onClick')
        const onClickFunc = onClickHandler && fetchActionFromStore(onClickHandler.handlerName)
        const Component = fetchControlFromStore(menuItem.render.renderType)
        const buttonState = menuButtonsState.find(n => n.name === menuItem.key)
        const disable = buttonState?.disabled
        const visible = buttonState?.visible
        const checked = buttonState?.checked

        const props: IControlRenderProps = {
          renderArgs: menuItem.render.renderArgs,
          refApi: refApi,
          buttonChecked: checked
        }

        if (menuItem.children) {
          return (visible !== false &&
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
          return visible !== false && <Menu.Item
            title={menuItem.title}
            key={menuItem.key}
            onClick={onClickFunc && (() => onClickFunc({ refApi, menuItem }))}
            disabled={disable}
            morePanelElement={menuItem.fold}>
            {Component && <Component {...props} />}
          </Menu.Item>
        }
      })
    }
  }
)

EosMenu.displayName = 'EosMenu'

export default EosMenu
