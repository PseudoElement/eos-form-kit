import React, {
    useContext,
     useMemo
 } from "react";
 import { Form, Input } from "@eos/rc-controls";
 import IField from "./IField";
 import { IDataService } from "./LookupComponents/AjaxSelect";
 import DisplayTableRow from "./LookupComponents/DisplayTableRow";
 import { FormContext, IFormContext } from "../Context/Context";
 import { Rule } from "rc-field-form/lib/interface";
 import { BaseField } from "./BaseField";
 import { IColumn   } from "./FieldLookupMulti";

 /**
  * Настройки Мульти Лукап поля.
  */
 export interface ILookupMultiRow extends IField {
     /** Функция для обработки запроса */
     dataService: IDataService;
     /**
      * Текст при отсутсвии элементов
      */
     notFoundContent?: string;
     // /**
     //  * Колонки таблицы
     //  */
     // tableColumns?: ITableColumn[];
     otherColumns?: IColumn[];
     /**Оторажать шапку таблицы*/
     showHeader?: boolean;
     /**Имя столбца по умолчанию */
     defaultColumnLabel: string;
     /**Имя модального окна */
     modalWindowTitle?: string;
     /**Индекс столбца по умолчанию */
     defaultColumnIndex?: number;
     /**Разешить дублирование данных.*/
     allowDuplication?: boolean;
    /**Разешить редактирование столбца по умолчанию.*/
    disabledDefaultColumn?: boolean;
    /**Спрятать столбец по умолчанию.*/
    hideDefaultColumn?: boolean;
    /**Текст для тулы добавления строки.*/
    addRowToolbarTitle?: string; 
    /**Текст для тулы удаления строк.*/
    deleteRowsToolbarTitle?: string;
    /**Текст для сообщения при добавлении существующей записи.*/
    addRowToolbarWarning?: string;
    /**Текст для модального окна при удалении записи.*/
    deleteRowsToolbarWarning?: string;
 }
 
 /**
  * Мульти Лукап с редактированием полей.
  */
 export const LookupMultiRow = React.forwardRef<any, ILookupMultiRow>((props: ILookupMultiRow, ref) => {
     const memoLookupMulti = useMemo(() => {
         return (<BaseField
             ref={ref}
             field={props}
             getNewField={getNew}
             getEditField={getEdit}
             getDisplayField={getDisplay}
         />);
     }, [props.mode]);
 
     return memoLookupMulti;
 
     function getNew(props: ILookupMultiRow, ref: any, rules?: Rule[]) {
         const context: IFormContext = useContext(FormContext);
         return (
             <div>
                 <Form.Item label={props.label} name={props.name} style={{ display: "none" }} rules={rules}>
                     <Input ref={ref}/>
                 </Form.Item>
                 <Form.Item name={props.name} rules={rules}>
                     <DisplayTableRow
                         rules={rules}
                         label={props.label || ''}
                         required={props.required}
                         name={props.name}
                         disabledDefaultColumn={props.disabledDefaultColumn}
                         hideDefaultColumn={props.hideDefaultColumn}
                         allowDuplication={props.allowDuplication}
                         addRowToolbarTitle={props.addRowToolbarTitle}
                         deleteRowsToolbarTitle={props.deleteRowsToolbarTitle}
                         addRowToolbarWarning={props.addRowToolbarWarning}
                         deleteRowsToolbarWarning={props.deleteRowsToolbarWarning}
                         defaultColumnIndex={props.defaultColumnIndex}
                         modalWindowTitle={props.modalWindowTitle}
                         defaultColumnLabel={props.defaultColumnLabel}
                         showHeader={props.showHeader}
                         mode={props.mode}
                         dataService={props.dataService}
                         notFoundContent={props.notFoundContent}
                         type={props.type}
                         otherColumns={props.otherColumns}
                         onDataChange={(row: any) => {
                             context.setFieldValue(props.name || '', row)
                         }}
                     />
                 </Form.Item>
             </div>
         );
     }
     function getEdit(props: ILookupMultiRow, ref: any, rules?: Rule[]) {
         return getNew(props, ref, rules);
     }
     function getDisplay(props: ILookupMultiRow, ref: any, rules?: Rule[]) {
         return getNew(props, ref, rules);
     }
 });