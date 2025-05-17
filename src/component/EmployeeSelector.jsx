import { Autocomplete, AutocompleteItem } from "@heroui/react";
import UserProfileAvatar from "./UserProfileAvatar";

export default function EmployeeSelector({employeeList, selectedEmployee, onSelected, label}) {
    function handleSelected(key) {
        if(key) {
            onSelected(key)
        }
    }

    return(
        <Autocomplete
            aria-label="employee-selector"
            variant="bordered"
            label={label}
            selectedKey={String(selectedEmployee)}
            onSelectionChange={(key) => handleSelected(key)}
        >
            <AutocompleteItem key="all">ทั้งหมด</AutocompleteItem>
            {employeeList.map((employee) => (
                <AutocompleteItem key={employee.username}>
                    {employee.username}
                </AutocompleteItem>
            ))}
        </Autocomplete>

    )
}
