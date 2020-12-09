
import React, { ReactElement, ReactNode } from "react";
import { Form, Icon, InfoIcon, Input, Tooltip } from "@eos/rc-controls";
import { Rule } from "rc-field-form/lib/interface"

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

    /**
     * Возвращает однострочное поле для формы просмотра.
     * @param label Отображаемое наименование поля.
     * @param name Имя поля, по которому будет взято значение из initialValues родительской формы.
     * @param value Значение поля, которое проставится, если name не передать.
     * @param suffix suffix для input'а.
     * @param defaultValue значение input'а по умолчанию.
     * @param onChange Вызовется, когда значение поля изменится.
     */
    static getDisplayField(label?: string, name?: string, value?: string, suffix?: ReactNode, defaultValue?: string,  onChange?: any) {
        return (
            <Form.Item label={label} name={name} style={{ marginBottom: 0, textTransform: "uppercase" }}>
                <Input readOnly={true} style={{ width: "100%" }} defaultValue={defaultValue} value={value} suffix={suffix} onChange={onChange}/>
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
            <Tooltip placement="bottom" title={text}>
                <Icon style={{ color: DEFAULT_ICONS_COLOR }} component={icon ?? <InfoIcon />} />
            </Tooltip>);
        return suffix;
    }
}

export { FieldsHelper };