import React, {
   useContext,
    useMemo
} from "react";
import { Form, Input } from "@eos/rc-controls";
import IField from "./IField";
import { IDataService } from "./LookupComponents/AjaxSelect";
import DisplayTable from "./LookupComponents/DisplayTable";
import { FormContext, IFormContext } from "../Context/Context";
import { Rule } from "rc-field-form/lib/interface";
import { BaseField } from "./BaseField";

export interface ITableColumn {
    title: string,
    dataIndex: string,
    key: string | number,
    render?: any,
};

export interface IValue {
    /**Программное значение которое вернёт компонент. */
    key: any;
    /**Отображаемый текст значения для пользователя. */
    value?: string;
    /**Дополнительные столбцы. */
    other?: IOtherValue[];
};
export interface IOtherValue {
    /**Наименование поля. */
    name: any;
    /**Отображаемый текст значения для пользователя. */
    value?: string;
};

export interface IColumn {
    name: string;
    disabled?: boolean;
}

/**
 * Настройки Мульти Лукап поля.
 */
export interface ILookupMulti extends IField {
    /** Функция для обработки запроса */
    dataService: IDataService;
    /**
     * Текст при отсутсвии элементов
     */
    notFoundContent?: string;
    // /**
    //  * Колонки таблицы
    //  */
    // tableColumns?: ITableColumn[];

    otherColumns?: IColumn[];
}

/**
 * Мульти Лукап поле.
 */
export const LookupMulti = React.forwardRef<any, ILookupMulti>((props: ILookupMulti, ref) => {
    const memoLookupMulti = useMemo(() => {
        return (<BaseField
            ref={ref}
            field={props}
            getNewField={getNew}
            getEditField={getEdit}
            getDisplayField={getDisplay}
        />);
    }, [props.mode]);

    return memoLookupMulti;

    function getNew(props: ILookupMulti, ref: any, rules?: Rule[]) {
        const context: IFormContext = useContext(FormContext);
        return (
            <div>
                <Form.Item label={props.label} name={props.name} style={{ display: "none" }} rules={rules}>
                    <Input />
                </Form.Item>
                <Form.Item name={props.name} rules={rules}>
                    <DisplayTable
                        rules={rules}
                        label={props.label || ''}
                        required={props.required}
                        name={props.name}
                        ref={ref}
                        // columns={props.tableColumns}
                        mode={props.mode}
                        dataService={props.dataService}
                        notFoundContent={props.notFoundContent}
                        type={props.type}
                        otherColumns={props.otherColumns}
                        onDataChange={(row: any) => {
                            context.setFieldValue(props.name || '', row)
                        }}
                    />
                </Form.Item>
            </div>
        );
    }
    function getEdit(props: ILookupMulti, ref: any, rules?: Rule[]) {
        return getNew(props, ref, rules);
    }
    function getDisplay(props: ILookupMulti, ref: any, rules?: Rule[]) {
        return getNew(props, ref, rules);
    }
});