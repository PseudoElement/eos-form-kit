import React, { useContext, useMemo } from "react";
import { Form } from "@eos/rc-controls";
import IField from "./IField";
import { Select as AjaxSelect, IDataService } from "./LookupComponents/AjaxSelect";
import DisplayInput from "./LookupComponents/DisplayInput";
import { Rule } from "rc-field-form/lib/interface";
import { BaseField } from "./BaseField";
import { FormContext, IFormContext } from "../Context/Context";

/**
 * Настройки лукап поля.
 */
export interface ILookup extends IField {
    /** Функция для обработки запроса */
    dataService: IDataService;

    /**Вызовется, когда значение поля изменится. */
    onChange?(item?: any): void;

    /**
     * Текст при отсутсвии элементов
     */
    notFoundContent?: string;

    resultName?: string;
    resultObject?: string;
    resultKey?: string;
    searchField?: string;
}
/**
 * Функция, через которую надо прогонять значение лукапа при сохранении формы. 
 * Иногда лукап возвращается как объект и форма падает при сохранении, если ожидалась строка или число.
 * @param value 
 */
export function getFieldValueForPost(value: any) {
    //  Проверка не работает.
    // if (value && value.key && value.value) {
    if (Object.prototype.toString.call(value) === "[object Object]") {
        // console.error("Поле лукап вернуло объект, где key: " + value.key + " value: " + value.value);
        return value.key;
    }
    else
        return value;
}

/**
 * Лукап поле.
 */
export const Lookup = React.forwardRef<any, ILookup>((props: ILookup, ref) => {
    const memoLookup = useMemo(() => {
        function getNew(props: ILookup, ref: any, rules?: Rule[]) {
            const ctx: IFormContext = useContext(FormContext)
            return (
                <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                    <AjaxSelect
                        dataService={props.dataService}
                        ref={ref}
                        ctx={ctx}
                        fieldName={props.name}
                        required={props.required}
                        onChange={props.onChange}
                        notFoundContent={props.notFoundContent}
                    />
                </Form.Item>
            );
        }

        function getEdit(props: ILookup, ref: any, rules?: Rule[]) {
            return getNew(props, ref, rules);
        }
        function getDisplay(props: ILookup, ref: any, rules?: Rule[]) {
            return (
                <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                    <DisplayInput ref={ref} />
                </Form.Item>
            );
        }

        return (<BaseField
            ref={ref}
            field={props}
            getNewField={getNew}
            getEditField={getEdit}
            getDisplayField={getDisplay}
        />);
    }, [props.mode, props.label, props.name])

    return memoLookup;
});