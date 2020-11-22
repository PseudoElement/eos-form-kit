import { FormMode } from "../ClientForms/FormMode";
import fields from "./Fields";

export interface IFieldApi {
    focus?(): void;
    disable?(): void;
    enable?(): void;
}

/**Базовые настройки поля. */
export default interface IField {
    /**Тип отрисовки поля. */
    mode: FormMode;
    type: keyof typeof fields;

    /**Отображаемое наименование поля. */
    label?: string;
    /**Имя поля в форме при посте */
    name?: string;
    /**Обязательность поля. */
    required?: boolean | undefined;
    /**Сообщение об обязательности поля. */
    requiredMessage?: string | undefined;
    /**Недоступно ли поле. */
    disabled?: boolean;
    /**Значение по умолчанию. */
    value?: string;
}