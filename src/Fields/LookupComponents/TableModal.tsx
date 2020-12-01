import React, { useState, useRef, useImperativeHandle  } from "react";
import { Modal, Form} from "@eos/rc-controls";
import IField from "../IField";
import { Select as AjaxSelect, IDataService } from "./AjaxSelect";
import { ITableRow } from "./DisplayTable";

/**
 * Настройки Модального окна.
 */
export interface ITableModal extends IField {
    /** Функция для обработки запроса */
    dataService: IDataService;

    /**Вызовется, когда значение поля изменится. */
    onChange?(item?: any): void;

    /**
     * Передача formInst
     */
    form?: any;

    /**
     * Текст при отсутсвии элементов
     */
    notFoundContent?: string;

    onFinish?(row: ITableRow | undefined): void;
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
    const [currentRow, setCurrentRow] = useState<ITableRow>();

    const selfRef = useRef();
    useImperativeHandle(ref ?? selfRef, (): ITableModalApi => {
        const api: ITableModalApi = {
            showModal() {
                setLookupVisible(true);
            }
        }
        return api;
    });

    const tableModalApi = useRef<ITableModalApi>();
    return (
        <div>
            <Modal
                visible={lookupVisible}
                onCancel={() => setLookupVisible(false)}
                onOk={() => {
                    if (props.onFinish) props.onFinish(currentRow);
                    setLookupVisible(false); 
                }}
            >
                <Form.Item>
                    <AjaxSelect
                        ref={tableModalApi}
                        dataService={props.dataService}
                        form={props.form}
                        required={props.required}
                        onChange={(row) => setCurrentRow(row)}
                        notFoundContent={props.notFoundContent}
                    />
                </Form.Item>
            </Modal>
        </div>
    );
});