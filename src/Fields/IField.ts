import { FormMode } from "../ClientForms/FormMode";
import fields from "./Fields";
// import {Mode} from "../Common/store/types/For"

//export const FIELD_NAME_STYLE: React.CSSProperties = { marginBottom: 0, textTransform: "uppercase" };

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
    disabled?: boolean;
    value?: string;
}