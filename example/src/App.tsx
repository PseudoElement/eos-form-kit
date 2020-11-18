// import React from 'react'


// import "eos-webui-controls/dist/main.css";
// import { ConfigProvider } from 'eos-webui-controls';
// import { AjaxClientForm, FormMode } from "eos-webui-formgen";
// // import { IDataService } from 'eos-webui-formgen/dist/ClientForms/AjaxClientForm';


// const App = () => {
//     // const ajaxClientFormApi = useRef<IAjaxClientFormApi>();
//     const dataService: IDataService = {
//         async getContextAsync(mode: FormMode) {
//             const dispContext = {
//                 "Fields": [{ "disabled": true, "label": "inventory:fieldNames.parentName", "name": "parentName", "required": false, "requiredMessage": null, "type": "FieldText", "value": null, "additionalText": null, "allowClear": false, "maxLength": null }, { "disabled": false, "label": "inventory:fieldNames.ind", "name": "ind", "required": true, "requiredMessage": "inventory:formErrors.ind", "type": "FieldText", "value": null, "additionalText": null, "allowClear": true, "maxLength": 24 }, { "disabled": false, "label": "inventory:fieldNames.volumeNum", "name": "volumeNum", "required": false, "requiredMessage": null, "type": "FieldInteger", "value": null, "max": 32767, "min": 0, "showCounter": false }, { "disabled": false, "label": "inventory:fieldNames.keepCategory", "name": "keepCategory", "required": true, "requiredMessage": "inventory:formErrors.keepCategory", "type": "FieldSelect", "value": null, "values": [{ "key": "1", "value": "fields:keepCategory.1" }, { "key": "2", "value": "fields:keepCategory.2" }, { "key": "3", "value": "fields:keepCategory.3" }, { "key": "4", "value": "fields:keepCategory.4" }] }, { "disabled": false, "label": "inventory:fieldNames.name", "name": "name", "required": true, "requiredMessage": "inventory:formErrors.name", "type": "FieldText", "value": null, "additionalText": null, "allowClear": false, "maxLength": null }, { "disabled": false, "label": "inventory:fieldNames.note", "name": "note", "required": false, "requiredMessage": null, "type": "FieldMultiText", "value": null, "maxLength": null, "rows": null }, { "disabled": false, "label": "inventory:fieldNames.startYear", "name": "startYear", "required": true, "requiredMessage": "inventory:formErrors.startYear", "type": "FieldDateTime", "value": null, "dateTimeMode": 1, "maxDate": "2999", "minDate": "1753" }, { "disabled": false, "label": "inventory:fieldNames.endYear", "name": "endYear", "required": false, "requiredMessage": null, "type": "FieldDateTime", "value": null, "dateTimeMode": 1, "maxDate": "2999", "minDate": "1753" }],
//                 "Mode": 2,
//                 "Tabs": [{ "ClassName": null, "CustomType": null, "Disabled": false, "ForceRender": null, "Rows": [{ "Cells": [{ "Type": 0, "Fields": ["parentName"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["ind"], "Width": 8 }, { "Type": 0, "Fields": ["volumeNum"], "Width": 4 }, { "Type": 0, "Fields": ["keepCategory"], "Width": 12 }] }, { "Cells": [{ "Type": 0, "Fields": ["name"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["note"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["startYear"], "Width": 6 }, { "Type": 0, "Fields": ["endYear"], "Width": 6 }] }], "Title": "tabs:inventory" }, { "ClassName": null, "CustomType": "InventoryFiles", "Disabled": false, "ForceRender": null, "Rows": null, "Title": "tabs:files" }]
//             };
//             const editContext = {
//                 "Fields": [{ "disabled": true, "label": "inventory:fieldNames.parentName", "name": "parentName", "required": false, "requiredMessage": null, "type": "FieldText", "value": null, "additionalText": null, "allowClear": false, "maxLength": null }, { "disabled": false, "label": "inventory:fieldNames.ind", "name": "ind", "required": true, "requiredMessage": "inventory:formErrors.ind", "type": "FieldText", "value": null, "additionalText": null, "allowClear": true, "maxLength": 24 }, { "disabled": false, "label": "inventory:fieldNames.volumeNum", "name": "volumeNum", "required": false, "requiredMessage": null, "type": "FieldInteger", "value": null, "max": 32767, "min": 0, "showCounter": false }, { "disabled": false, "label": "inventory:fieldNames.keepCategory", "name": "keepCategory", "required": true, "requiredMessage": "inventory:formErrors.keepCategory", "type": "FieldSelect", "value": null, "values": [{ "key": "1", "value": "fields:keepCategory.1" }, { "key": "2", "value": "fields:keepCategory.2" }, { "key": "3", "value": "fields:keepCategory.3" }, { "key": "4", "value": "fields:keepCategory.4" }] }, { "disabled": false, "label": "inventory:fieldNames.name", "name": "name", "required": true, "requiredMessage": "inventory:formErrors.name", "type": "FieldText", "value": null, "additionalText": null, "allowClear": false, "maxLength": null }, { "disabled": false, "label": "inventory:fieldNames.note", "name": "note", "required": false, "requiredMessage": null, "type": "FieldMultiText", "value": null, "maxLength": null, "rows": null }, { "disabled": false, "label": "inventory:fieldNames.startYear", "name": "startYear", "required": true, "requiredMessage": "inventory:formErrors.startYear", "type": "FieldDateTime", "value": null, "dateTimeMode": 1, "maxDate": "2999", "minDate": "1753" }, { "disabled": false, "label": "inventory:fieldNames.endYear", "name": "endYear", "required": false, "requiredMessage": null, "type": "FieldDateTime", "value": null, "dateTimeMode": 1, "maxDate": "2999", "minDate": "1753" }],
//                 "Mode": 1,
//                 "Tabs": [
//                     {
//                         "ClassName": null, "CustomType": null, "Disabled": false, "ForceRender": null,
//                         "Rows": [{ "Cells": [{ "Type": 0, "Fields": ["parentName"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["ind"], "Width": 8 }, { "Type": 0, "Fields": ["volumeNum"], "Width": 4 }, { "Type": 0, "Fields": ["keepCategory"], "Width": 12 }] }, { "Cells": [{ "Type": 0, "Fields": ["name"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["note"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["startYear"], "Width": 6 }, { "Type": 0, "Fields": ["endYear"], "Width": 6 }] }], "Title": "tabs:inventory"
//                     },
//                     {
//                         "ClassName": null, "CustomType": "InventoryFiles", "Disabled": true, "ForceRender": null, "Rows": null, "Title": "tabs:files"
//                     }]
//             };
//             const newContext = {
//                 "Fields": [{ "disabled": true, "label": "inventory:fieldNames.parentName", "name": "parentName", "required": false, "requiredMessage": null, "type": "FieldText", "value": null, "additionalText": null, "allowClear": false, "maxLength": null }, { "disabled": false, "label": "inventory:fieldNames.ind", "name": "ind", "required": true, "requiredMessage": "inventory:formErrors.ind", "type": "FieldText", "value": null, "additionalText": null, "allowClear": true, "maxLength": 24 }, { "disabled": false, "label": "inventory:fieldNames.volumeNum", "name": "volumeNum", "required": false, "requiredMessage": null, "type": "FieldInteger", "value": null, "max": 32767, "min": 0, "showCounter": false }, { "disabled": false, "label": "inventory:fieldNames.keepCategory", "name": "keepCategory", "required": true, "requiredMessage": "inventory:formErrors.keepCategory", "type": "FieldSelect", "value": null, "values": [{ "key": "1", "value": "fields:keepCategory.1" }, { "key": "2", "value": "fields:keepCategory.2" }, { "key": "3", "value": "fields:keepCategory.3" }, { "key": "4", "value": "fields:keepCategory.4" }] }, { "disabled": false, "label": "inventory:fieldNames.name", "name": "name", "required": true, "requiredMessage": "inventory:formErrors.name", "type": "FieldText", "value": null, "additionalText": null, "allowClear": false, "maxLength": null }, { "disabled": false, "label": "inventory:fieldNames.note", "name": "note", "required": false, "requiredMessage": null, "type": "FieldMultiText", "value": null, "maxLength": null, "rows": null }, { "disabled": false, "label": "inventory:fieldNames.startYear", "name": "startYear", "required": true, "requiredMessage": "inventory:formErrors.startYear", "type": "FieldDateTime", "value": null, "dateTimeMode": 1, "maxDate": "2999", "minDate": "1753" }, { "disabled": false, "label": "inventory:fieldNames.endYear", "name": "endYear", "required": false, "requiredMessage": null, "type": "FieldDateTime", "value": null, "dateTimeMode": 1, "maxDate": "2999", "minDate": "1753" }],
//                 "Mode": 0,
//                 "Tabs": [{ "ClassName": null, "CustomType": null, "Disabled": false, "ForceRender": null, "Rows": [{ "Cells": [{ "Type": 0, "Fields": ["parentName"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["ind"], "Width": 8 }, { "Type": 0, "Fields": ["volumeNum"], "Width": 4 }, { "Type": 0, "Fields": ["keepCategory"], "Width": 12 }] }, { "Cells": [{ "Type": 0, "Fields": ["name"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["note"], "Width": 24 }] }, { "Cells": [{ "Type": 0, "Fields": ["startYear"], "Width": 6 }, { "Type": 0, "Fields": ["endYear"], "Width": 6 }] }], "Title": "tabs:inventory" }, { "ClassName": null, "CustomType": "InventoryFiles", "Disabled": true, "ForceRender": null, "Rows": null, "Title": "tabs:files" }]
//             };
//             switch (mode) {
//                 case FormMode.edit:
//                     return editContext;
//                 case FormMode.display:
//                     return dispContext;
//                 case FormMode.new:
//                 default:
//                     return newContext;
//             }
//         },
//         async getInitialValuesAsync() {
//             return {};
//         },
//         getTitle: function () {
//             return "Форма";
//         }
//     }

//     return (
//         <ConfigProvider>
//             <AjaxClientForm
//                 mode={FormMode.edit}
//                 dataService={dataService}
//                 getResourceText={name => name}
//                 onEditClick={() => {
//                     // if (props?.newEditProps?.id)
//                     //   redirect.toInventoryEdit2(props?.newEditProps?.id);
//                 }}
//                 onCancelClick={() => {
//                     // switch (mode) {
//                     //   case FormMode.edit:
//                     //     redirect.toInventoryDisp2(props?.newEditProps?.id ?? 0);
//                     //     break;
//                     //   case FormMode.new:
//                     //   case FormMode.display:
//                     //   default:
//                     //     redirect.toSuminventories();
//                     //     break;
//                     // }
//                 }}
//             />
//         </ConfigProvider>
//     );
// }

// export default App
