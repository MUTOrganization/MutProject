import React, { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Button,
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@nextui-org/react";
import { HFRefresh } from "@/component/Icons";

function AgentRanking({ data, isLoading }) {

  const [selectedAgents, setSelectedAgents] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("selectedAgents") || "[]";
      return JSON.parse(stored);
    }
    return [];
  });

  const currentRanking =
    data?.currentMonthAgentRanking?.currentMonthAgentRanking || [];
  const lastMonthRanking =
    data?.lastMonthAgentRanking?.lastMonthAgentRanking || [];

  const lastMonthRankMap = lastMonthRanking.reduce((map, item, index) => {
    if (item.agent_code) {
      map[item.agent_code] = index + 1;
    }
    return map;
  }, {});

  const allRanking = useMemo(() => {
    return currentRanking.map((currentItem, index) => {
      const lastRank = lastMonthRankMap[currentItem.agent_code] ?? null;
      const currentRank = index + 1;
      const change = lastRank !== null ? lastRank - currentRank : null;
      return {
        ...currentItem,
        last_rank: lastRank,
        current_rank: currentRank,
        change,
      };
    });
  }, [currentRanking, lastMonthRankMap]);

  const agentCodes = useMemo(() => {
    const codes = allRanking
      .map((item) => item.agent_code || item.agent_id)
      .filter(Boolean);

    const uniqueCodes = [...new Set(codes)];
    uniqueCodes.sort((a, b) => a.localeCompare(b));
    return uniqueCodes;
  }, [allRanking]);

  if (isLoading) {
    return (
      <div>
        <h2 className="text-lg font-bold mb-1">อันดับตัวแทน</h2>
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const filteredRanking = allRanking.filter(
    (sale) => !selectedAgents.includes(sale.agent_code || sale.agent_id)
  );

  const finalRanking = filteredRanking.map((sale, index) => {
    const newCurrentRank = index + 1;
    const newChange =
      sale.last_rank !== null ? sale.last_rank - newCurrentRank : null;

    return {
      ...sale,
      current_rank: newCurrentRank,
      change: newChange,
    };
  });

  const handleReset = () => {
    setSelectedAgents([]);
  };

  const handleSave = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedAgents", JSON.stringify(selectedAgents));
    }
  };

  return (
    <div>
      <div className="flex flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-bold mb-4">อันดับตัวแทน</h2>

        <Popover placement="top" showArrow={true}>
          <PopoverTrigger>
            <Button variant="flat" color="primary">
              เลือก & ซ่อนตัวแทน
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="p-4 flex flex-col gap-3">
              <Select
                placeholder="ซ่อนตัวแทนที่เลือก"
                selectionMode="multiple"
                variant="bordered"
                className="w-48"
                selectedKeys={new Set(selectedAgents)}
                onSelectionChange={(keys) => setSelectedAgents([...keys])}
              >
                {agentCodes.map((agent) => (
                  <SelectItem key={agent}>{agent}</SelectItem>
                ))}
              </Select>

              <div className="flex gap-2">
                <Button
                  color="primary"
                  variant="flat"
                  onPress={handleReset}
                  startContent={<HFRefresh size={16} />}
                >
                  ล้างการเลือก
                </Button>

                <Button
                  color="success"
                  variant="flat"
                  onPress={handleSave}
                >
                  บันทึก
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 text-md font-medium text-gray-500 mb-4">
        <p>รหัสตัวแทน</p>
        <p className="text-right">อันดับ</p>
      </div>

      <ScrollArea className="h-[400px] w-full px-4">
        <ul className="divide-y divide-gray-200">
          {finalRanking.map((sale, index) => {
            let lastRankText = "-";
            if (sale.last_rank !== null) {
              lastRankText = `เคยอยู่อันดับ ${sale.last_rank}`;
            }

            let changeText = "";
            if (sale.change !== null) {
              if (sale.change > 0) {
                changeText = `▲ ขึ้นมาจากอันดับ ${sale.last_rank}`;
              } else if (sale.change < 0) {
                changeText = `▼ ลงมาจากอันดับ ${sale.last_rank}`;
              } else {
                changeText = "อันดับเดิม";
              }
            }

            return (
              <li key={index} className="flex items-center justify-between py-4">
                <div className="flex flex-col gap-y-1">
                  <div className="flex items-center gap-x-2">
                    <p className="text-md font-medium text-gray-900">
                      {sale.agent_code || sale.agent_id}
                    </p>
                    <p className="text-md text-gray-500">
                      {sale.nick_name || "-"}
                    </p>
                  </div>
                  {sale.last_rank !== null && (
                    <p className="text-sm text-gray-500">{lastRankText}</p>
                  )}
                </div>

                <div className="flex flex-col items-end">
                  <p className="text-md font-medium text-gray-900">
                    {sale.current_rank}
                  </p>
                  {sale.change !== null && (
                    <p className="text-sm">
                      {sale.change > 0 ? (
                        <span className="text-green-600 font-semibold">
                          {changeText}
                        </span>
                      ) : sale.change < 0 ? (
                        <span className="text-red-600 font-semibold">
                          {changeText}
                        </span>
                      ) : (
                        <span className="text-gray-400">{changeText}</span>
                      )}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </div>
  );
}

export default AgentRanking;
