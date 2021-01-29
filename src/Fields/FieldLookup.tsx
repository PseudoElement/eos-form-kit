import React, { useContext, useMemo } from "react";
import { Form, SmartInput } from "@eos/rc-controls";
import IField from "./IField";
import { Select as AjaxSelect, IDataService } from "./LookupComponents/AjaxSelect";
import { InlineSelect as AjaxInlineSelect} from "./LookupComponents/AjaxInlineSelect"
import DisplayInput from "./LookupComponents/DisplayInput";
import { Rule } from "rc-field-form/lib/interface";
import { BaseField } from "./BaseField";
import { FormContext, IFormContext } from "../Context/Context";
import useHistorySlim from './../Hooks/useHistorySlim';

/**
 * Настройки лукап поля.
 */
export interface ILookup extends IField {
    /** Функция для обработки запроса */
    dataService: IDataService;

    /**Вызовется, когда значение поля изменится. */
    onChange?(item?: any): void;

    /** Текст при отсутсвии элементов */
    notFoundContent?: string;

    resultName?: string;
    resultObject?: string;
    resultKey?: string;
    searchField?: string;
    /** параметр ручного ввода, по умолчанию разрешен */
    manualInputAllowed?: boolean;

    /** параметр показа инфотекста (о результатах), по умолчанию показывать */
    showResultInfoText?: boolean;

    /** инфотекст */
    resultInfoText?: string;

    /** инлайн мод */
    inlineMode?: boolean;

    /** обработка изменения значения !!!ТОЛЬКО ДЛЯ ИНЛЙАН МОДА!!! */
    onValueSelected?(item?: any): void;

    /** Событие при клике на кнопку */
    onButtonClick?(): void;

    /** наименование зачения свойства 
     * значения берутся из useHistorySlim().getStateByName( "LookupDialogResult" )
     * в настройки лукап поля необходимо передать keyProperty
     * в настройки лукап поля необходимо передать loadData2Async в dataService
    */
    valueProperty?: string;
    
    /** наименование ключа свойства 
     * значения берутся из useHistorySlim().getStateByName( "LookupDialogResult" )
     * в настройки лукап поля необходимо передать valueProperty
     * в настройки лукап поля необходимо передать loadData2Async в dataService
    */
    keyProperty?: string;
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

/** Лукап поле. */
export const Lookup = React.forwardRef<any, ILookup>((props: ILookup, ref) => {
    /** значение, полученное из выбора в справочнике, значение из useBackUrlHistory().toBack(значение) */
    let tempUseHistorySlimState = useHistorySlim().getStateByName( "LookupDialogResult" );
    /** если значение из справочника не получено, то будет undefined для предотвращения перерисовки */
    let receivedValue = tempUseHistorySlimState !== null && tempUseHistorySlimState !== undefined ? tempUseHistorySlimState : undefined;

    const memoLookup = useMemo(() => {   
        return (<BaseField
            ref={ref}
            field={props}
            getNewField={getNew}
            getEditField={getEdit}
            getDisplayField={getDisplay}
        />);
    }, [props.mode, props.label, props.name, receivedValue])

    return memoLookup;

    function getNew(props: ILookup, ref: any, rules?: Rule[]) {
        const ctx: IFormContext = useContext(FormContext);
        // реф поставлен на инпут для установления фокуса при незаполненном поле
        if (props.inlineMode === true && props.onValueSelected) {
            return (
                <React.Fragment>
                    <Form.Item label={props.label} name={props.name} style={{ display: "none" }} rules={rules}>
                        <SmartInput ref={ref}/>
                    </Form.Item>
                    <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                        <AjaxInlineSelect
                            dataService={props.dataService}
                            ref={ref}
                            onValueSelected={props.onValueSelected}
                            notFoundContent={props.notFoundContent}
                            manualInputAllowed={props.manualInputAllowed}
                            resultInfoText={props.resultInfoText}
                            showResultInfoText={props.showResultInfoText}
                            onButtonClick={props.onButtonClick}
                        />
                    </Form.Item>
                </React.Fragment>
            );
        }
        else {
            return (
                <React.Fragment>
                    <Form.Item label={props.label} name={props.name} style={{ display: "none" }} rules={rules}>
                        <SmartInput ref={ref}/>
                    </Form.Item>
                    <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                        <AjaxSelect
                            dataService={props.dataService}
                            ref={ref}
                            ctx={ctx}
                            fieldName={props?.name}
                            required={props.required}
                            onChange={props.onChange}
                            notFoundContent={props.notFoundContent}
                            manualInputAllowed={props.manualInputAllowed}
                            resultInfoText={props.resultInfoText}
                            showResultInfoText={props.showResultInfoText}
                            onButtonClick={props.onButtonClick}
                            valueProperty={props?.valueProperty}
                            keyProperty={props?.keyProperty}
                            receivedValue={receivedValue}
                        />
                    </Form.Item>
                </React.Fragment>
            );
        }

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
});