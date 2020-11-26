import React, { useState } from "react";
import { Collapse, Modal, Form, Badge } from "@eos/rc-controls";
import IField from "./IField";
import { Select as AjaxSelect, IDataService } from "./LookupComponents/AjaxSelect";
import { FieldsHelper } from "./FieldsHelper";
import DisplayTable, { ITableRow } from "./LookupComponents/DisplayTable";

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
    const [currentRow, setCurrentRow] = useState<ITableRow>();
    const [row, setRow] = useState<ITableRow>();

    let rules = [];
    if (props.required)
        rules.push(FieldsHelper.getRequiredRule(props.requiredMessage));

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
                            <Badge count={0} type="text">{props.label}</Badge>
                        </div>
                    }
                >
                    <Form.Item label={props.label} name={props.name} >
                        <DisplayTable
                            ref={ref}
                            columns={props.tableColumns}
                            selectedRow={row}
                            onChange={props.onChange}
                            onModalVisible={() => setLookupVisible(true)}
                            mode={props.mode}
                        />
                    </Form.Item>
                </Collapse.Panel>
            </Collapse>

            <Modal
                visible={lookupVisible}
                onCancel={() => setLookupVisible(false)}
                onOk={() => {
                    setRow(currentRow);
                    setLookupVisible(false);
                }}
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