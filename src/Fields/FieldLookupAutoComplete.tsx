import React, { useMemo, useContext } from "react";
import { Form } from "@eos/rc-controls";
import IField from "./IField";
import { AutoComplete as AjaxAutoComplete, IDataService } from "./LookupComponents/AjaxAutoComplete";
import DisplayInput from "./LookupComponents/DisplayInput";
import { BaseField } from "./BaseField";
import { Rule } from "rc-field-form/lib/interface";
import { FormContext, IFormContext } from "../Context/Context";

/**
 * Настройки лукап поля.
 */
export interface ILookupAutoComplete extends IField {
    /** Функция для обработки запроса */
    dataService?: IDataService;

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

    /** Событие при клике на кнопку */
    onButtonClick?(): void
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
 * ЛукапАвтокомплит поле.
 */
export const LookupAutoComplete = React.forwardRef<any, ILookupAutoComplete>((props: ILookupAutoComplete, ref) => {
    const ctx: IFormContext = useContext(FormContext);

    const memoLookupAutoComplete = useMemo(() => {
        return (<BaseField
            ref={ref}
            field={props}
            getNewField={getNew}
            getEditField={getEdit}
            getDisplayField={getDisplay}
        />);
    }, [props.mode, props.label, props.name])

    return memoLookupAutoComplete;

    function getNew(props: ILookupAutoComplete, ref: any, rules?: Rule[], required?: boolean) {
        return (
            <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                <AjaxAutoComplete
                    dataService={props.dataService}
                    ref={ref}
                    ctx={ctx}
                    fieldName={props.name}
                    required={required}
                    onChange={props.onChange}
                    notFoundContent={props.notFoundContent}
                    onButtonClick={props.onButtonClick}
                />
            </Form.Item>
        );
    }
    function getEdit(props: ILookupAutoComplete, ref: any, rules?: Rule[], required?: boolean) {
        return getNew(props, ref, rules, required);
    }
    function getDisplay(props: ILookupAutoComplete, ref: any, rules?: Rule[]) {
        return (
            <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                <DisplayInput ref={ref} />
            </Form.Item>
        );
    }
});