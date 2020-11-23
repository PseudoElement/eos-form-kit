import React, { forwardRef, ReactNode } from "react";
import { FormMode } from "../FormMode";
import DispFormTitle from "./DispFormTitle";
import EditFormTitle from "./EditFormTitle";

/**API компонента отображения заголовка формы. */
export interface IFormTitleApi {
    /**Показывает иконку @. */
    showLeftIcon(): void;
    /**Скрывает иконку @. */
    hideLeftIcon(): void;
    /**Устанавливает наименование заголовка. */
    setTitle(title?: string): void;
}

/**Настройки компонента отображения заголовка формы. */
export interface IFormTitle {
    mode: FormMode;
    /**Компонент заголовка формы. */
    formTitle?: ReactNode | ReactNode[];
    title?: string;

    /**Включает отрисовку иконки @ перед наименованием. */
    enableLeftIcon?: boolean;
    /**При включенной отрисовке левой иконки @ перед наименование изначальная её скрытость. */
    isHiddenLeftIcon?: boolean;
    /**Текст по наведению на иконку @ перед наименованием */
    leftIconTitle?: string;
    onCancelClick?(event: any): void;
    onEditClick?(event: any): void;
    
    disableEditButton?: boolean;
    disableCloseButton?: boolean;
}

/**Компонент отображения заголовка формы. */
const FormTitle = forwardRef<any, IFormTitle>((props: IFormTitle, ref: any) => {
    return (
        <React.Fragment>
            {props.formTitle ?
                props.formTitle :
                (
                    props.mode === FormMode.display
                        ? <DispFormTitle
                            ref={ref}
                            title={props.title ?? ""}
                            onCancelClick={props.onCancelClick}
                            onEditClick={props.onEditClick}
                            enableLeftIcon={props.enableLeftIcon}
                            isHiddenLeftIcon={props.isHiddenLeftIcon}
                            leftIconTitle={props.leftIconTitle}                            
                            disableEditButton={props.disableEditButton}
                            disableCloseButton={props.disableCloseButton}
                        />
                        : <EditFormTitle
                            ref={ref}
                            title={props.title ?? ""}
                            onCancelClick={props.onCancelClick}
                            enableLeftIcon={props.enableLeftIcon}
                            isHiddenLeftIcon={props.isHiddenLeftIcon}
                            leftIconTitle={props.leftIconTitle}
                        />)}
        </React.Fragment>
    );
});
export default FormTitle;
