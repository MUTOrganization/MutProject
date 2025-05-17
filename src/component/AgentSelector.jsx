import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    ModalFooter,
    Card,
    Autocomplete,
    AutocompleteItem
} from "@heroui/react";
import { useEffect, useState } from "react";
import SearchBox from "./SearchBox";
import { ConfirmCancelButtons } from "./Buttons";
import { useAppContext } from "../contexts/AppContext";
import { HFRefresh } from "./Icons";

function AgentSelector() {
    const {selectedAgent, setSelectedAgentFromId, agentList} = useAppContext().agent;

    function handleSelecteAgent(agent) {
        if(agent){
            setSelectedAgentFromId(agent);
        }
    }


    return (
        <div>
            <div className="w-full h-full">
                <Autocomplete
                    aria-label="agent-selector"
                    label="เลือกตัวแทน"
                    variant="bordered"
                    selectedKey={String(selectedAgent?.id)}
                    onSelectionChange={(key) => {
                        handleSelecteAgent(key)
                    }}
                >
                    {agentList.map((agent) => (
                        <AutocompleteItem key={agent.id}>{`${agent.name}`}</AutocompleteItem>
                    ))}

                </Autocomplete>
            </div>
        </div>
    )
}


export default AgentSelector;