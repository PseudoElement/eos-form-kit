import React from 'react'
import { EosTable, useEosComponentsStore, ITableProvider, EosTableTypes, DefaultMenuRenders } from "eos-webui-formgen"

const TableExample = () => {

    const { addControlToStore  } = useEosComponentsStore()
    addControlToStore("Icon", DefaultMenuRenders.Icon)
    addControlToStore("MenuButton", DefaultMenuRenders.MenuButton)

    const provider = GetProvider()
    return <div style={{ height: "calc(100vh - 48px)" }}><EosTable provider={provider} /></div>
}

const GetProvider = () => {
    const tableProvider: ITableProvider = {
        tableSettingLoad: () => {
            return new Promise((resolve) => {
                const setting: EosTableTypes.ITableSettings = {
                    tableId: "test",
                    typeName: "test",
                    typePluralName: "tests",
                    columns: [
                        {
                            name: "col1",
                            title: "Колонка 1",
                            fields: [{ displayName: "Колонка 1", apiField: "col1" }]
                        },
                        {
                            name: "col2",
                            title: "Колонка 2",
                            fields: [{ displayName: "Колонка 2", apiField: "col2" }]
                        }
                    ],
                    keyFields: ["key"],
                    visual: {
                        dragable: true,
                        resizable: true,
                        isDifferentRow: true
                    },
                    menu: [{
                        key: "add",
                        render: {
                            renderType: "Icon",
                            renderArgs: {
                                iconName: "PlusIcon"
                            }
                        },
                        title: "Добавить"
                    },
                    {
                        key: "edit",
                        render: {
                            renderType: "Icon",
                            renderArgs: {
                                iconName: "EditIcon"
                            }
                        },
                        title: "Редактирвать"
                    },
                    {
                        key: "SynchroIcon",
                        render: {
                            renderType: "Icon",
                            renderArgs: {
                                iconName: "SynchroIcon"
                            }
                        },
                        title: "Обновить"
                    },
                    {
                        key: "delete",
                        render: {
                            renderType: "Icon",
                            renderArgs: {
                                iconName: "BinIcon"
                            }
                        },
                        children: [
                            {
                                key: "delete1",
                                render: {
                                    renderType: "Icon",
                                    renderArgs: {
                                        iconName: "BinIcon"
                                    }
                                },
                                title: 'Удалить'
                            }
                        ],
                    },
                    {
                        key: "delete2",
                        render: {
                            renderType: "Icon",
                            renderArgs: {
                                iconName: "BinForeverIcon"
                            }
                        },
                        children: [
                            {
                                key: "delete21",
                                render: {
                                    renderType: "Icon",
                                    renderArgs: {
                                        iconName: "BinIcon"
                                    }
                                },
                                title: 'Удалить'
                            }
                        ],
                    },
                    {
                        key: "setting",
                        render: {
                            renderType: "MenuButton",
                            renderArgs: {
                                iconName: "SettingsIcon",
                                title: "Настройки",
                                type: "link"
                            },
                        }
                    }]
                }
                return resolve(setting)
            })
        },
        tableUserSettingLoad: () => {
            return new Promise((resolve) => {
                const setting: EosTableTypes.ITableUserSettings = {
                    tableId: "test",
                    columns: [
                        {
                            name: "col1",
                            width: 300,
                            visible: true
                        },
                        {
                            name: "col2",
                            width: 400,
                            visible: true
                        }
                    ]
                }
                return resolve(setting)
            })

        },
        fetchData: () => {
            return new Promise((resolve) => {
                const data: EosTableTypes.ITableData = {
                    totalCount: 5,
                    records: [{
                        "key": 1,
                        col1: "row 1"
                    },
                    {
                        "key": 2,
                        col1: "row 2"
                    },
                    {
                        "key": 3,
                        col1: "row 3"
                    },
                    {
                        "key": 4,
                        col1: "row 4"
                    },
                    {
                        "key": 5,
                        col1: "row 5"
                    },
                    ]
                }
                return resolve(data)
            })
        }
    }

    return tableProvider
}

export { TableExample }
