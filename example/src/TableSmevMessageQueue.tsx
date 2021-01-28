import React from 'react'
import { ApolloClient, ApolloProvider, InMemoryCache, useApolloClient, gql } from "@apollo/react-hooks";
import { EosTable, ITableProvider, EosTableTypes, EosTableHelper } from "eos-webui-formgen"
import { Layout } from '@eos/rc-controls';

const TableSmevMessageQueue = () => {
    const client = new ApolloClient({
        uri: './smevdispatcher/Gql/Query',
        cache: new InMemoryCache()
    })
    return <ApolloProvider client={client}><TableMessageQueue /></ApolloProvider>
}

const TableMessageQueue = () => {
    const apolloClient = useApolloClient();

    const provider = GetProvider()
    return <Layout style={{ height: "calc(100vh - 70px)" }}><EosTable initTableState={{tableView:"default"}} provider={provider} /></Layout>


    function GetProvider() {
        const tableProvider: ITableProvider = {
            transformFilterToExpressionFragment: (filterTypeName: EosTableTypes.FilterTypeName, tableState: EosTableTypes.ITableState, tableSettings: EosTableTypes.ITableSettings) => {
                switch (filterTypeName) {
                    case "quickSearchFilter":
                        return tableSettings.quickSearchFilter
                            && EosTableHelper.generateQuickSearchFilterFragment_OldStyle(tableSettings.quickSearchFilter, tableState.filterValueObjects?.quickSearchFilter)
                    default:
                        return undefined
                }
            },
            fetchAction: (name: string) => {
                switch (name) {
                    case "stop":
                        return (props: EosTableTypes.IHandlerProps) => {
                            const tableApi = props.refApi as EosTableTypes.ITableApi
                            if (tableApi) {
                                const state = tableApi.getCurrentTableState()
                                tableApi.setTableState({
                                    ...state,
                                    quickSearchMode: false
                                })
                            }
                        }
                    default:
                        return undefined
                }
            },
            tableSettingLoad: () => {
                return new Promise((resolve) => {
                    const setting: EosTableTypes.ITableSettings = {
                        tableId: "SmevRequests",
                        typeName: "SmevRequest",
                        typePluralName: "SmevRequests",
                        keyFields: ["isnRequest"],
                        visual: {
                            resizable: true,
                            dragable: true
                        },
                        columns: [
                            {
                                name: "status",
                                title: "Статус",
                                description: "Статус запроса",
                                fields: [{ displayName: "Статус", apiField: "status" }],
                            },
                            {
                                name: "smevRequestType",
                                title: "Тип сведений",
                                fields: [{ displayName: "Тип сведений", apiField: "smevRequestType", child: { alias: "title", displayName: "Наименование", apiField: "name", sortable: true } }],
                                columnRender: {
                                    renderType: "ReferenceDisplay"
                                },
                                sortable: true
                            },
                            {
                                name: "clientSystem",
                                title: "Внешняя система",
                                fields: [{ displayName: "Внешняя система", apiField: "clientSystem", child: { displayName: "Наименование", apiField: "name", sortable: true } }],                                
                                sortable: true,
                                columnRender: {
                                    renderType: "ReferenceDisplay"
                                },
                            },
                            {
                                name: "externalId",
                                title: "Номер во внешней системе",
                                fields: [{ displayName: "Номер во внешней системе", apiField: "externalId" }],
                            },
                            {
                                name: "createDate",
                                title: "Время создания",
                                fields: [{ displayName: "Время создания", apiField: "createDate" }],
                                columnRender: {
                                    renderType: "DateTimeDisplay"
                                }
                            },
                            {
                                name: "updateDate",
                                title: "Время изменения статуса",
                                fields: [{ displayName: "Время изменения статуса", apiField: "updateDate" }],
                                columnRender: {
                                    renderType: "DateTimeDisplay"
                                }
                            },
                            {
                                name: "nextTryTime",
                                title: "Плановое время",
                                fields: [{ displayName: "Плановое время", apiField: "nextTryTime" }],
                                columnRender: {
                                    renderType: "DateTimeDisplay"
                                }
                            },
                            {
                                name: "tryCount",
                                title: "Число попыток",
                                fields: [{ displayName: "Число попыток", apiField: "tryCount" }],
                            },
                            {
                                name: "smevRequestAttachments",
                                title: "Примечание",
                                fields: [{ displayName: "Вложения", apiField: "smevRequestAttachments", child: { displayName: "Наименование файла", apiField: "filename" } },
                                { displayName: "Вложения", apiField: "smevRequestAttachments", child: { displayName: "Ссылка", apiField: "fileLink" } }],
                                columnRender: {
                                    renderType: "LinksDisplay",
                                    renderArgs: {
                                        array: "smevRequestAttachments",
                                        name: "filename",
                                        link: "fileLink"
                                    }
                                }
                            }
                        ],
                        menu: [{
                            key: "send",
                            render: {
                                renderType: "Icon",
                                renderArgs: {
                                    iconName: "PlayIcon",

                                }
                            }, title: "Отправить"
                        },
                        {
                            key: "stop",
                            render: {
                                renderType: "Icon",
                                renderArgs: {
                                    iconName: "StopIcon",

                                }
                            },
                            handlers: [{
                                type: "onClick",
                                handlerName: "stop"
                            }],
                            title: "Выйти из режима поиска"
                        },
                        {
                            key: "delete",
                            render: {
                                renderType: "Icon",
                                renderArgs: {
                                    iconName: "BinForeverIcon",

                                }
                            }, title: "Удалить"
                        },
                        {
                            key: "restore",
                            render: {
                                renderType: "Icon",
                                renderArgs: {
                                    iconName: "RepairIcon",

                                }
                            }, title: "Восстановить"
                        },
                        {
                            key: "import",
                            render: {
                                renderType: "Icon",
                                renderArgs: {
                                    iconName: "DownloadIcon",

                                }
                            }, title: "Импорт"
                        },
                        {
                            key: "export",
                            render: {
                                renderType: "Icon",
                                renderArgs: {
                                    iconName: "ShareIcon"
                                }
                            },
                            children: [
                                {
                                    key: "saveSelected",
                                    render: {
                                        renderType: "Icon",
                                        renderArgs: {
                                            iconName: "SaveFloppyIcon",
                                            type: "link"
                                        }
                                    },
                                    title: "Сохранить выбранное",
                                },
                                {
                                    key: "saveAll",
                                    render: {
                                        renderType: "Icon",
                                        renderArgs: {
                                            iconName: "SaveFloppyIcon",
                                            type: "link"
                                        }
                                    },
                                    title: "Сохранить все",
                                },
                                {
                                    key: "exportSelected",
                                    render: {
                                        renderType: "Icon",
                                        renderArgs: {
                                            iconName: "ShareIcon",
                                            type: "link"
                                        }
                                    },
                                    title: "Экспортировать выбранное",
                                }
                            ]
                        },
                        {
                            key: "register",
                            render: {
                                renderType: "Icon",
                                renderArgs: {
                                    iconName: "PlusIcon",

                                }
                            }, title: "Зарегистрировать"
                        },


                        {
                            key: "get",
                            //priority: 8,
                            render: {
                                renderType: "Icon",
                                renderArgs: {
                                    iconName: "ProcessIcon"
                                }
                            },
                            children: [
                                {
                                    key: "getResults",
                                    //priority: 1,
                                    render: {
                                        renderType: "Icon",
                                        renderArgs: {
                                            iconName: "ProcessIcon",
                                            type: "link"
                                        }
                                    },
                                    title: "Получить результаты",
                                },
                                {
                                    key: "getRequests",
                                    //priority: 2,
                                    render: {
                                        renderType: "Icon",
                                        renderArgs: {
                                            iconName: "ProcessIcon",
                                            type: "link"
                                        }
                                    },
                                    title: "Получить запросы",
                                }
                            ]
                        },
                        {
                            key: "deletedVisible",
                            render: {
                                renderType: "CheckableButton",
                                renderArgs: {
                                    iconName: "HideIcon",

                                }
                            }, title: "Показать логически удаленные"
                        },],
                        rightMenu: [
                            {
                                key: "QuickSearch",
                                render: {
                                    renderType: "QuickSearch",
                                    renderArgs: {
                                        mode: "classif"
                                    }
                                },
                                title: "Быстрый поиск",
                            }
                        ],
                        quickSearchFilter: [{ apiField: "smevRequestType", child: { apiField: "name" } }],
                    }
                    return resolve(setting)
                })
            },
            tableUserSettingLoad: () => {
                return new Promise((resolve) => {
                    const setting: EosTableTypes.ITableUserSettings = {
                        tableId: "",
                        filterVisible: false,
                        pageSize: 10,
                        ellipsisRows: 3,
                        highlightingRows: true,
                        defaultSort: [{
                            smevRequestType: {
                                name: "Asc"
                            }
                        }, {
                            clientSystem: {
                                name: "Desc"
                            }
                        }],
                        columns: [
                            {
                                name: "status",
                                visible: true,
                                width: 80
                            },
                            {
                                name: "smevRequestType",
                                visible: true,
                                width: 200
                            },
                            {
                                name: "clientSystem",
                                visible: true,
                                width: 300
                            },
                            {
                                name: "externalId",
                                visible: true,
                                width: 300
                            },
                            {
                                name: "createDate",
                                visible: true,
                                width: 200
                            },
                            {
                                name: "updateDate",
                                visible: true,
                                width: 200
                            },
                            {
                                name: "nextTryTime",
                                visible: true,
                                width: 200
                            },
                            {
                                name: "tryCount",
                                visible: true,
                                width: 150
                            },
                            {
                                name: "smevRequestAttachments",
                                visible: true,
                                width: 400
                            }
                        ]
                    }
                    return resolve(setting)
                })

            },
            fetchData: (tableState: EosTableTypes.ITableState, tableSettings: EosTableTypes.ITableSettings, userSettings: EosTableTypes.ITableUserSettings, onlyKeysForSelectedAll?: boolean) => {
                const { query, variables } = EosTableHelper.generatePreparedQuery(tableState, tableSettings, userSettings, onlyKeysForSelectedAll)
                return new Promise<EosTableTypes.ITableData>((resolve, reject) => {
                    apolloClient.query({
                        errorPolicy: 'all',
                        //fetchPolicy: "no-cache",
                        query: gql`${query}`,
                        variables: {
                            ...variables
                        }
                    })
                        .then((result) => {
                            const { data, errors } = result;
                            if (errors)
                                return reject(errors)
                            const returnData = data[Object.keys(data)[0]];
                            const tableData: EosTableTypes.ITableData = {
                                records: returnData.items,
                                totalCount: returnData.totalCount
                            }
                            return resolve(tableData)
                        })
                        .catch((errors) => reject(errors));
                })
            }
        }

        return tableProvider
    }
}
export { TableSmevMessageQueue }
