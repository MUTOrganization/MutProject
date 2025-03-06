import { useEffect, useState } from "react"
import lodash from 'lodash';
import { SearchMatchScore } from "../../utils/search";
import { Input } from "@nextui-org/react";
import { SearchIcon } from "./Icons";


export default function SearchBox({
    className = null, label, placeholder = '', data,
    searchRules, onChange, removeZeroScore = true, onBeforeSearch,
    valueState, onTextChange = () => {}, variant = 'faded'
}) {

    if (!data) throw new Error("data is undefined");
    if (!searchRules) throw new Error("searchRules is undefined");
    if (!onChange) throw new Error("onChange is undefined");

    const isControlled = valueState !== undefined;

    const [searchText, setSearchText] = useState(valueState ?? '');
    //ชื่อ แผนก หรือตำแหน่ง
    const default_class = "input input-bordered input-sm w-48"

    function handleSearch(text) {
        if (!isControlled) {
            setSearchText(text);
            onTextChange(text);
        } else {
            onTextChange(text);
        }
        if (data.length === 0) {
            onChange([]);
            return;
        }
        if (text.length === 0) {
            let copy = lodash.cloneDeep(data);
            copy.forEach(e => e.score = undefined);
            if (onBeforeSearch) {
                copy = onBeforeSearch(copy);
            }
            onChange(copy);
            return;
        }
        let copyData = lodash.cloneDeep(data);
        if (onBeforeSearch) {
            copyData = onBeforeSearch(copyData);
        }
        const rules = searchRules.map(field => {
            const [fieldName, weight] = Array.isArray(field) ? field : [field, 1]
            return {
                fieldName,
                weight
            }
        })

        let result = SearchMatchScore(copyData, text, rules)
        if (removeZeroScore) result = result.filter(e => e.score > 0)
        onChange(result)
    }

    return (
        <Input
            type="search"
            size="sm"
            label={label}
            value={isControlled ? valueState : searchText}
            variant={variant}
            placeholder={placeholder}
            onChange={(e) => handleSearch(e.target.value)}
            startContent={<SearchIcon />}
        />
    )
}