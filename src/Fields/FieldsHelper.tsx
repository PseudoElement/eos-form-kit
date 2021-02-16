
import React, { ReactElement, ReactNode } from "react";
import { Form, Icon, InfoIcon, SmartInput, SmartTooltip } from "@eos/rc-controls";
import { Rule } from "rc-field-form/lib/interface";
import { IOptionItem, IOtherValue } from "../Fields/LookupComponents/AjaxSelect";

export const DEFAULT_ICONS_COLOR = "#2196f3";
const INTEGER_RULE_TYPE = "integer";

/**Класс-помощник для работы с полями. */
class FieldsHelper {
    /**Возвращает правило обязательности поля. */
    static getRequiredRule(requiredErrorText?: string): Rule {
        const rule: Rule = { required: true, message: requiredErrorText };
        return rule;
    }
    /**Возвращает правило целочисленного поля. */
    static getIntegerRule(): Rule {
        const rule: Rule = { type: INTEGER_RULE_TYPE, message: "Не является целым числом!" };
        return rule;
    }
    /**Возвращает правило мультилукапа. */
    static getMultilookupRowRule(): Rule {
        const rule: Rule =
            {
              type: "array",
              message: "Поле заполненно не до конца!",
              validator(rule: Rule, value: IOptionItem[]) {
                rule = rule
                let emptyField;
                
                if(value) {
                    emptyField = value.find((e: IOptionItem) => {
                        return ((e.value === '') || 
                        e?.other?.find((e: IOtherValue) => e.value?.trim() === ''));
                    });
                }
                if (!emptyField) {
                  return Promise.resolve();
                }
  
                return Promise.reject('Поле заполненно не до конца!');
              }
            };

        return rule;
    }

    /**
     * Возвращает однострочное поле для формы просмотра.
     * @param label Отображаемое наименование поля.
     * @param name Имя поля, по которому будет взято значение из initialValues родительской формы.
     * @param value Значение поля, которое проставится, если name не передать.
     * @param suffix suffix для input'а.
     * @param defaultValue значение input'а по умолчанию.
     * @param onChange Вызовется, когда значение поля изменится.
     * @param isSuffixVisible Отображать ли суффикс.
     */
    static getDisplayField(label?: string, name?: string, value?: string, suffix?: ReactNode, defaultValue?: string,  onChange?: any, isSuffixVisible?: boolean) {
        return (
            <Form.Item label={label} name={name} style={{ marginBottom: 0, textTransform: "uppercase" }}>
                <SmartInput readOnly={true} width={"100%"} defaultValue={defaultValue} value={value} iconType={(suffix === undefined) ? "none" : undefined} suffix={suffix} onChange={onChange} hideSuffix={!isSuffixVisible}/>
            </Form.Item>
        );
    }

    /**
     * Возвращает suffix для input'а.
     * @param text Дополнительный текст понаведению на ионку.
     * @param icon Иконка, если не определна, то InfoIcon.
     */
    static getInputSuffix(text: string, icon?: ReactElement): ReactNode {
        const suffix: ReactNode = (
            <SmartTooltip placement="bottom" title={text}>
                <Icon style={{ color: DEFAULT_ICONS_COLOR }} component={icon ?? <InfoIcon />} />
            </SmartTooltip>);
        return suffix;
    }
}

export { FieldsHelper };