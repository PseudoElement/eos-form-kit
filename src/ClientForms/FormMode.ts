/**Тип отрисовки полей и формы. */
export enum FormMode {
    /**
     * Создание.
     */
    new = 0,
    /**
     * Редактирование.
     */
    edit = 1,
    /**
     * Просмотр.
     */
    display = 2,
}

/**
 * Парсит строковое представление из url в тип ортисовки полей и формы.
 * @param value Строковое представление из urlтипа ортисовки полей и формы.
 */
export function parseFormMode(value?: string):FormMode {
    switch (value) {
        case "edit":
            return FormMode.edit;
        case "disp":
            return FormMode.display;
        case "new":
        default:
            return FormMode.new;
    }
}