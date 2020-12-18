import React, { useState, useRef, useImperativeHandle  } from "react";
import { Modal, Form} from "@eos/rc-controls";
import IField from "../IField";
import { Select as AjaxSelect, IDataService, IOptionItem } from "./AjaxSelect";
import { IValue } from "../FieldLookupMulti";

/**
 * Настройки Модального окна.
 */
export interface ITableModal extends IField {
    /** Функция для обработки запроса */
    dataService: IDataService;

    /**Вызовется, когда значение поля изменится. */
    onChange?(item?: any): void;

    /**
     * Текст при отсутсвии элементов
     */
    notFoundContent?: string;

    onFinish?(row: IValue | undefined): void;
    /**Имя модального окна */
    modalWindowTitle?: string;
}

export interface ITableModalApi {
    /**Показывает модальное окно @. */
    showModal(): void;
}

/**
 * Модальное окно для мультилукапа
 */
export const TableModal = React.forwardRef<any, ITableModal>((props: ITableModal, ref) => {
    const [lookupVisible, setLookupVisible] = useState<boolean>(false);
    const [currentRow, setCurrentRow] = useState<IValue>();
    const [ajaxSelectValue, setAjaxSelectValue] = useState<IOptionItem | undefined>(undefined);

    const selfRef = useRef();
    useImperativeHandle(ref ?? selfRef, (): ITableModalApi => {
        const api: ITableModalApi = {
            showModal() {
                setLookupVisible(true);
            }
        }
        return api;
    });

    //const tableModalApi = useRef<ITableModalApi>();
    return (
        <div>
            <Modal
            title={props.modalWindowTitle ?? ''}
                visible={lookupVisible}
                onCancel={() => {
                    setAjaxSelectValue({key: '', value: ''});
                    setLookupVisible(false)
                }}
                onOk={() => {
                    if (props.onFinish) props.onFinish(currentRow);
                    setAjaxSelectValue({key: '', value: ''});
                    setLookupVisible(false); 
                }}
            >
                <Form.Item>
                    <AjaxSelect
                        value={ajaxSelectValue}
                        ref={ref}
                        dataService={props.dataService}
                        required={props.required}
                        onChange={(row) => setCurrentRow(row)}
                        notFoundContent={props.notFoundContent}
                    />
                </Form.Item>
            </Modal>
        </div>
    );
});