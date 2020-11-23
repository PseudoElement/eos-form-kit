import React, { useEffect, useState } from "react";
import { Collapse, Table, Menu, Modal, Form, PlusIcon, BinIcon, ArrowVDownIcon, ArrowVTopIcon, Badge } from "@eos/rc-controls";
import IField from "./IField";
import { Select as AjaxSelect, IDataService } from "./LookupComponents/AjaxSelect";
import { FieldsHelper } from "./FieldsHelper";
import { FormMode } from "../ClientForms/FormMode";

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
 * Настройки лукап поля.
 */
export interface ILookupMulti extends IField {
    /** Функция для обработки запроса */
    dataService: IDataService;

    /**
     * Передача formInst
     */
    form?: any;

    /**
     * Текст при отсутсвии элементов
     */
    notFoundContent?: string;

    tableData?: IMultilookupRow[];
    tableColumns?: ITableColumn[];

}

/**
 * Функция, через которую надо прогонять значение лукапа при сохранении формы. 
 * Иногда лукап возвращается как объект и форма падает при сохранении, если ожидалась строка или число.
 * @param value 
 */
export function getFieldValuesForPost(value: any) {
    //  Проверка не работает
    // if (value && value.key && value.value) {
    if (Object.prototype.toString.call(value[0]) === "[object Object]") {
        // console.error("Поле лукап вернуло объект, где key: " + value.key + " value: " + value.value);
        return value.map((e: IMultilookupRow) => e.key);
    }
    else
        return value;
}
/**
 * МультиЛукап поле.
 */
export const LookupMulti = React.forwardRef<any, ILookupMulti>((props: ILookupMulti, ref) => {

    const [lookupVisible, setLookupVisible] = useState<boolean>(false);
    const [multiLookupRows, setMultieLookupRows] = useState<IMultilookupRow[]>([]);
    const [currentRow, setCurrentRow] = useState<any>(undefined);
    const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);

    const rowSelection = {
        preserveSelectedRowKeys: false,
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys: any) => {
            setSelectedRowKeys(selectedRowKeys);
        }
    };

    let rules = [];
    if (props.required)
        rules.push(FieldsHelper.getRequiredRule(props.requiredMessage));

    useEffect(() => {
        if (props.tableData) setMultieLookupRows(props.tableData);
    }, [props.tableData]);

    const DeleteMultiLookupLookupRows = () => {
        let newMultiLookupRows = multiLookupRows.filter(({ key }) => !(~selectedRowKeys.indexOf(key)));
        setMultieLookupRows(newMultiLookupRows);
    };

    const newMultiLookupRow = () => {
        setLookupVisible(true);
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

    ///////////////////////////////////////// select /////////////////////////////////////

    // const onSelect = (record, selected) => {
    //     const arr = selectedRowKeys.filter(item => item !== record.id);
    //     if (selected) arr.push(record.id);
    //     setSelectedRowKeys([...arr]);
    //     setLastSelectedRowKey(record.id);
    //   };

    //////////////////////////////////////////////////////////////////////////////////////

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
            onClick: DeleteMultiLookupLookupRows,
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
                            <Badge count={multiLookupRows.length} type="text">Особенности</Badge>
                        </div>
                    }
                >
                    <Table.Menu
                        menu={getMenuItemsList(menu)}
                    >
                        <Table
                            rowSelection={rowSelection}
                            columns={props.tableColumns}
                            dataSource={multiLookupRows}
                            showHeader={false}
                        />
                    </Table.Menu>
                </Collapse.Panel>
            </Collapse>

            <Modal
                visible={lookupVisible}
                onCancel={() => setLookupVisible(false)}
                onOk={() => {
                        setMultieLookupRows([...multiLookupRows, currentRow]);
                        setLookupVisible(false);
                    }
                }
            >
                <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                    <AjaxSelect
                        dataService={props.dataService}
                        ref={ref}
                        form={props.form}
                        fieldName={props.name}
                        required={props.required}
                        notFoundContent={props.notFoundContent}
                        onChange={(row) => setCurrentRow({ key: row.key, name: row.value })}
                    />
                </Form.Item>
            </Modal>
        </div>
    );
});