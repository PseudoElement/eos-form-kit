import { ROW_KEYS_DELIMITER } from "../types/TextConstants";

export function getRowKey(record: any, keyColumns: string[]) {
    return keyColumns.map((keyColumn) => {
        return record[keyColumn]
    }).join(ROW_KEYS_DELIMITER);
}

export function getRecordsByKeys(records: any[], keyValues: string[], keyColumns: string[]) {
    const filterRecords = keyValues.map((keyValue) => {
        const valueArray = keyValue.toString().split(ROW_KEYS_DELIMITER)
        const record = records.find((record) => {
            return  keyColumns.every((key, index) => {
                return record[key].toString() === valueArray[index]
            })            
        })
        return record
    })   
    return filterRecords
}

export function getRecordsByKeysStr(records: any[], keyValues: string[], keyColumn: string) {
    const filterRecords = keyValues.map((keyValue) => {
        return records.find((record) => record[keyColumn].toString() === keyValue)        
    })
    return filterRecords
}