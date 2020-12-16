import { FilterType } from "../types/IFilterType";

export function compareMaps(map1: Map<string, FilterType>, map2: Map<string, FilterType>) {
  if (map1.size !== map2.size) {
    return false;
  }
  let compare = true
  map1.forEach((valueMap1, key) => {
    if (compare) {
      const valueMap2 = map2.get(key);
      if (!deepEqual(valueMap1, valueMap2) || (valueMap2 === undefined && !map2.has(key))) {
        compare = false
      }
    }
  })
  return compare
}

export function compareArrays(array1: any[] | undefined, array2: any[] | undefined) {
  const arr1 = (array1 && [...array1]) || []
  const arr2 = (array2 && [...array2]) || []  
  if (arr1.length !== arr2.length) {
    return false;
  }  
  return arr1.every((valueArr1, index) => deepEqual(valueArr1, arr2[index]))
}

export function deepEqual(object1: any, object2: any) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      areObjects && !deepEqual(val1, val2) ||
      !areObjects && val1 !== val2
    ) {
      return false;
    }
  }

  return true;
}

function isObject(object: any) {
  return object != null && typeof object === 'object';
}