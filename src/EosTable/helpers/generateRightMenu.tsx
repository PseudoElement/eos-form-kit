import React, { Fragment } from 'react'
import { IControlRenderProps } from '../types/IControlRenderProps';
import { ITableApi } from '../types/ITableApi';
import { FetchAction, FetchCondition, FetchControlRender } from '../types/ITableProvider';
import { IMenuItem, ITableSettings } from '../types/ITableSettings';

interface GenerateRightMenuProps{
    tableSettings: ITableSettings
    refApi: ITableApi
    fetchControl?: FetchControlRender
    fetchAction?: FetchAction
    fetchCondition?: FetchCondition
}

export function GenerateRightMenu({
    tableSettings,
    refApi,
    fetchControl} : GenerateRightMenuProps
) {  
    const menuItems = (toolsList: IMenuItem[]) => {
        return (toolsList//.sort((a, b) => a.priority - b.priority)
            .map(menuItem => {
                //const disableFunc = fetchCondition(menuItem.disableConditionName || `disable.${menuItem.key}.${tableSettings.tableId}`);
                //const onClickHandler = fetchAction(menuItem.actionName || `${menuItem.key}.${tableSettings.tableId}`);
                const Component = fetchControl && fetchControl(menuItem.render.renderType);
                
                const props: IControlRenderProps = { 
                    renderArgs: menuItem.render.renderArgs,
                    refApi: refApi
                }

                return Component && <Component key={menuItem.key} {...props} />
            })
        )
    }

    return <Fragment>
        {tableSettings.rightMenu && menuItems(tableSettings.rightMenu)}
    </Fragment>
}