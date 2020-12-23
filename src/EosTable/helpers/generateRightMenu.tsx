import React, { Fragment } from 'react'
import { useEosComponentsStore } from '../../Hooks/useEosComponentsStore';
import { IMenuItem } from '../../Menu/types';
import { IControlRenderProps } from '../types/IControlRenderProps';
import { ITableApi } from '../types/ITableApi';
import { FetchAction, FetchCondition, FetchControlRender } from '../types/ITableProvider';
import { ITableSettings } from '../types/ITableSettings';

interface GenerateRightMenuProps {
    tableSettings: ITableSettings
    refApi: ITableApi
    fetchControl?: FetchControlRender
    fetchAction?: FetchAction
    fetchCondition?: FetchCondition
}

export function GenerateRightMenu({
    tableSettings,
    refApi,
    fetchControl }: GenerateRightMenuProps
) {

    const { fetchControlFromStore } = useEosComponentsStore()

    const menuItems = (toolsList: IMenuItem[]) => {
        return (toolsList
            .map(menuItem => {

                const Component = (fetchControl && fetchControl(menuItem.render.renderType)) || fetchControlFromStore(menuItem.render.renderType)

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