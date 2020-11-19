import React from "react";
import { Form } from "@eos/rc-controls";
import { FormMode } from "../ClientForms/FormMode";
import { FieldsHelper } from "./FieldsHelper";
import IField from "./IField";
import { Select as AjaxSelect, GetOptionItems, IGetRequestData, IGetDataService } from "./LookupComponents/AjaxSelect";
import DisplayInput from "./LookupComponents/DisplayInput";

/**
 * Настройки лукап поля.
 */
export interface ILookup extends IField {
    /**
     * useLazyQuery
     */
    getDataService?: IGetDataService;

    /**
     * Функция для проставки параметров запроса
     */
    getData?: IGetRequestData;

    /**
     * Функция для проставки элементов списка
     */
    getOptionItems?: GetOptionItems;

    /**Вызовется, когда значение поля изменится. */
    onChange?(item?: any): void;

    /**
     * Объект для отображения текста о количестве элементов
     */
    optionsAmountInfo?: any;

    /**
     * Передача formInst
     */
    form?: any;

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

    let rules = [];
    if (props.required)
        rules.push(FieldsHelper.getRequiredRule(props.requiredMessage));

    switch (props.mode) {
        case FormMode.display:
            return (
                <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }}>
                    <DisplayInput ref={ref} />
                </Form.Item>
            );
        case FormMode.new:
        case FormMode.edit:
        default:
            return (
                <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                    <AjaxSelect
                        getDataService={props.getDataService}
                        ref={ref}
                        form={props.form}
                        getData={props.getData}
                        fieldName={props.name}
                        getOptionItems={props.getOptionItems}
                        required={props.required}
                        optionsAmountInfo={props.optionsAmountInfo}
                        onChange={props.onChange}
                    />
                </Form.Item>
            );
    }
});