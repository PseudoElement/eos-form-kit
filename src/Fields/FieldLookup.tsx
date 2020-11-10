// import React from "react";
// import { Form } from "eos-webui-controls";
// import { FormMode } from "../ClientForms/FormMode";
// import { FieldsHelper } from "./FieldsHelper";
// import IField from "./IField";
// import AjaxSelect, { GetOptionItems, IGetRequestData, IGetDataService } from "./LookupComponents/AjaxSelect";
// import DisplayInput from "./LookupComponents/DisplayInput";

// /**
//  * Структура и описание пропсов IFieldLookup на основе IField
//  */
// export interface IFieldLookup extends IField {
//     /**
//      * useLazyQuery
//      */
//     getDataService?: IGetDataService;

//     /**
//      * Функция для проставки параметров запроса
//      */
//     getData?: IGetRequestData;

//     /**
//      * Функция для проставки элементов списка
//      */
//     getOptionItems?: GetOptionItems;

//     /**
//      * Объект для отображения текста о количестве элементов
//      */
//     optionsAmountInfo?: any;

//     /**
//      * Передача formInst
//      */
//     form?: any;

//         /**
//      * Ограничения на максимальную длину поля
//      */
//     maxLength?: number;

//     /**
//      * Текст при отсутсвии элементов
//      */
//     notFoundContent?: string;

//     resultName?:string;
//     resultObject?: string;
//     resultKey?: string;
//     searchField?: string;
// }

// /**
//  * Лукап поле.
//  */
// const FieldLookup = React.forwardRef<any, IFieldLookup>((props: IFieldLookup, ref) => {
//     let rules = [];
//     if (props.required)
//         rules.push(FieldsHelper.getRequiredRule(props.requiredMessage));
//     if (props.maxLength)
//         rules.push({ max: props.maxLength });

//     switch (props.mode) {
//         case FormMode.display:
//             return (
//                 <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }}>
//                     <DisplayInput ref={ref} />
//                 </Form.Item>
//             );
//         case FormMode.new:
//         case FormMode.edit:
//         default:
//             return (
//                 <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>                    
//                     <AjaxSelect
//                         getDataService={props.getDataService}
//                         ref={ref}
//                         maxLength={props.maxLength}
//                         form={props.form}
//                         getData={props.getData}
//                         fieldName={props.name}
//                         getOptionItems={props.getOptionItems}
//                         required={props.required}
//                         optionsAmountInfo={props.optionsAmountInfo}
//                     />
//                 </Form.Item>
//             );
//     }
// });
// export default FieldLookup;