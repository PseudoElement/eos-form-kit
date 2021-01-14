import { DatePicker, Form } from "@eos/rc-controls";
import React from "react";
import moment from 'moment';
import IField from "./IField";
import { FormMode } from "../ClientForms/FormMode";
import { BaseField } from "./BaseField";
import { Rule } from "rc-field-form/lib/interface";


const DATE_MOMENT_PATTERN = "DD.MM.yyyy";

/**Настройки поля типа "Дата". */
export interface IDateTime extends IField {
    /**Тип отрисовки поля. */
    dateTimeMode?: DateTimeMode;
    /**Минимально допустимая для выбора дата. */
    minDate?: moment.Moment | number;
    /**Максимально допустимая дата. */
    maxDate?: moment.Moment | number;
}

/**Режим работы поля типа "Дата". */
export enum DateTimeMode {
    /**Выбор полноценной даты без времени. */
    default = 0,
    /**Только год. */
    year = 1
}


/**Поле типа "Дата". */
export const DateTime = React.forwardRef<any, IDateTime>((props: IDateTime, ref) => {
    return (<BaseField
        ref={ref}
        field={props}
        getNewField={getNew}
        getEditField={getEdit}
        getDisplayField={getDisplay}
    />);

    function getNew(props: IDateTime, ref: any, rules?: Rule[]) {
        return (
            <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules} >
                <DatePicker
                    format={props.dateTimeMode !== DateTimeMode.year ? DATE_MOMENT_PATTERN : undefined}
                    ref={ref}
                    picker={getPickerMode(props.dateTimeMode)}
                    required={props.required}
                    //width={"100%"}
                    style={{ width: "100%" }}
                    disabledDate={(e) => {
                        if (props.minDate || props.maxDate) {
                            if (props.dateTimeMode === DateTimeMode.year) {
                                const year = e.year();
                                if (props.minDate && props.maxDate)
                                    return year < props.minDate || year > props.maxDate;
                                else if (props.minDate)
                                    return year < props.minDate;
                                else if (props.maxDate)
                                    return year > props.maxDate;
                            }
                            else {

                            }
                        }
                        return false;
                    }}
                />
            </Form.Item>
        );
    }
    function getEdit(props: IDateTime, ref: any, rules?: Rule[]) {
        return getNew(props, ref, rules);
    }
    function getDisplay(props: IDateTime, ref: any, rules?: Rule[]) {
        return (
            <Form.Item label={props.label} name={props.name} style={{ textTransform: "uppercase", marginBottom: "0px" }} rules={rules} >
                <DatePicker
                    disabled={true}
                    inputReadOnly={true}
                    format={props.dateTimeMode !== DateTimeMode.year ? DATE_MOMENT_PATTERN : undefined}
                    ref={ref}
                    picker={getPickerMode(props.dateTimeMode)}
                    required={props.required}
                    //width={"100%"}
                    style={{ width: "100%" }}
                    disabledDate={(e) => {
                        if (props.minDate || props.maxDate) {
                            if (props.dateTimeMode === DateTimeMode.year) {
                                const year = e.year();
                                if (props.minDate && props.maxDate)
                                    return year < props.minDate || year > props.maxDate;
                                else if (props.minDate)
                                    return year < props.minDate;
                                else if (props.maxDate)
                                    return year > props.maxDate;
                            }
                            else {

                            }
                        }
                        return false;
                    }}
                />
            </Form.Item>
        );
    }
});

/**Возвращает значение поля типа "Дата". */
export function getFieldValueForClientRender(mode: FormMode, value?: any, dateTimeMode?: DateTimeMode) {
    switch (mode) {
        case FormMode.display:
            // return parseDateForDispForm(value, dateTimeMode);
            return parseDateForEditForm(value, dateTimeMode);
        case FormMode.new:
        case FormMode.edit:
            return parseDateForEditForm(value, dateTimeMode);
    }

}

function parseDateForEditForm(value?: string | moment.Moment | number, dateTimeMode?: DateTimeMode): moment.Moment | undefined {
    if (value) {
        if (dateTimeMode == DateTimeMode.year) {
            const momentValue = moment().year(value as number);
            return momentValue;
        }
        else {
            let dateObject = null;
            if (moment.isMoment(value)) {
                dateObject = value as moment.Moment;
            }
            else {
                dateObject = moment(value);
            }
            return dateObject;
        }
    }
    else {
        return undefined;
    }
}

function getPickerMode(mode?: DateTimeMode) {
    switch (mode) {
        case DateTimeMode.year:
            return "year";
        default:
            return undefined;
    }
}