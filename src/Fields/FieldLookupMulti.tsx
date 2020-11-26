import React, { useState } from "react";
import { Collapse, Menu, Modal, Form, PlusIcon, BinIcon, ArrowVDownIcon, ArrowVTopIcon, Badge } from "@eos/rc-controls";
import IField from "./IField";
import { Select as AjaxSelect, IDataService } from "./LookupComponents/AjaxSelect";
import { FieldsHelper } from "./FieldsHelper";
import { FormMode } from "../ClientForms/FormMode";
import DisplayTable, { ITableRow } from "./LookupComponents/DisplayTable";

export interface ITableMenuTool {
    key: string | number;
    component?: JSX.Element;
    title?: string;
    onClick?: () => void;
    hiddenTitle?: boolean;
    disabled?: boolean;
    children?: ITableMenuTool[];
    inMoreBlock?: boolean;
};

export interface ITableColumn {
    title: string,
    dataIndex: string,
    key: string | number,
};

export interface IMultilookupRow {
    key: string | number;
    name?: string;
};

/**
 * Настройки МультиЛукап поля.
 */
export interface ILookupMulti extends IField {
    /** Функция для обработки запроса */
    dataService: IDataService;

    /**Вызовется, когда значение поля изменится. */
    onChange?(item?: any): void;

    /**
     * Передача formInst
     */
    form?: any;

    /**
     * Текст при отсутсвии элементов
     */
    notFoundContent?: string;

    /**
     * Колонки таблицы
     */
    tableColumns?: ITableColumn[];
}

/**
 * МультиЛукап поле.
 */
export const LookupMulti = React.forwardRef<any, ILookupMulti>((props: ILookupMulti, ref) => {
    //const [isLoading, setIsLoading] = useState<boolean>(false);
    const [lookupVisible, setLookupVisible] = useState<boolean>(false);
    const [multiLookupRows, setMultieLookupRows] = useState<ITableRow[]>([]);
    const [currentRow, setCurrentRow] = useState<ITableRow>();
    const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
    const [row, setRow] = useState<ITableRow>();

    const rowSelection = {
        preserveSelectedRowKeys: false,
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys: (string | number)[]) => {
            setSelectedRowKeys(selectedRowKeys);
        }
    };

    console.log(rowSelection);

    let rules = [];
    if (props.required)
        rules.push(FieldsHelper.getRequiredRule(props.requiredMessage));
    

    /**
     * Создание записи в таблице
     */
    const newMultiLookupRow = () => {
        setLookupVisible(true);
    };

    /**
     * Удаление записей в таблице
     */
    const DeleteMultiLookupLookupRows = () => {
        let newMultiLookupRows = multiLookupRows.filter(({ key }) => key && !(~selectedRowKeys.indexOf(key)));
        setMultieLookupRows(newMultiLookupRows);
    };

    const isDisplay = () => {
        return FormMode.display === props.mode;
    };

    const getMenuItemsList = (toolsList: ITableMenuTool[]) => {
        return (
            toolsList.map(({ component, onClick, disabled, title, children, key, hiddenTitle, inMoreBlock }) => {
                if (children) return (
                    <Menu.SubMenu
                        icon={component}
                        morePanelElement={inMoreBlock}
                        title={hiddenTitle ? title : undefined}
                        key={key}
                        disabled={disabled}
                    >
                        {getMenuItemsList(children)}
                    </Menu.SubMenu>
                )
                return (
                    <Menu.Item title={hiddenTitle ? title : undefined} key={key} onClick={onClick} disabled={disabled} morePanelElement={inMoreBlock}>
                        {component}
                        {!hiddenTitle && <span className="costil-margin" style={{ marginLeft: 1 }}>{title}</span>}
                    </Menu.Item>
                );
            })
        );
    };

    const menu = [
        {
            component: <PlusIcon />,
            title: 'PlusIcon',
            disabled: isDisplay(),
            onClick: newMultiLookupRow,
            hiddenTitle: true,
            key: 'PlusIcon'
        },
        {
            component: <BinIcon />,
            title: 'BinIcon',
            disabled: isDisplay(),
            onClick: DeleteMultiLookupLookupRows,
            hiddenTitle: true,
            key: 'BinIcon'
        },
        {
            component: <ArrowVTopIcon />,
            title: 'ArrowVTopIcon',
            disabled: isDisplay(),
            onClick: newMultiLookupRow,
            hiddenTitle: true,
            key: 'ArrowVTopIcon'
        },
        {
            component: <ArrowVDownIcon />,
            title: 'ArrowVDownIcon',
            disabled: isDisplay(),
            onClick: newMultiLookupRow,
            hiddenTitle: true,
            key: 'ArrowVDownIcon'
        }
    ];

    

    return (
        <div>
            <Collapse
                key={'1'}
                expandIconPosition={'right'}
                ghost
                bordered={true}
            >
                <Collapse.Panel
                    key={'1'}
                    forceRender={true}
                    header={
                        <div
                            style={{
                                borderBottom: '1px solid #E6E6E6'
                            }}
                        >
                            <Badge count={0} type="text">Особенности</Badge>
                        </div>
                    }
                >
                    <Form.Item label={props.label} name={props.name} >
                                <DisplayTable
                                    tableMenu={getMenuItemsList(menu)}
                                    rowSelection={rowSelection}
                                    ref={ref}
                                    columns={props.tableColumns}
                                    selectedRow={row}
                                    onChange={props.onChange}
                                />

                                {/* <Table
                                    rowSelection={rowSelection}
                                    columns={props.tableColumns}
                                    dataSource={props.value}
                                    showHeader={false}
                                /> */}
                    </Form.Item>
                </Collapse.Panel>
            </Collapse>

            <Modal
                visible={lookupVisible}
                onCancel={() => setLookupVisible(false)}
                onOk={() => {
                    setRow(currentRow);
                    setLookupVisible(false);
                    }
                }
            >
                <Form.Item label={props.label} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                    <AjaxSelect
                        dataService={props.dataService}
                        ref={ref}
                        form={props.form}
                        required={props.required}
                        onChange={(row) => setCurrentRow(row)}
                        notFoundContent={props.notFoundContent}
                    />
                </Form.Item>
            </Modal>
        </div>
    );
});