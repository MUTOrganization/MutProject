import React, { useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Spinner
} from '@nextui-org/react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrencyNoDollars, formatCurrencyNoDollars2Fixed } from '@/pages/DashboardOverView/utils/currencyUtils';

function getMedalData(rank) {
  if (rank === 1) {
    return { bgColor: "bg-[#fefbf0]", textColor: "text-[#f6a55a]", medalEmoji: '🥇' };
  } else if (rank === 2) {
    return { bgColor: "bg-[#f4f9fb]", textColor: "text-[#acb1b8]", medalEmoji: '🥈' };
  } else if (rank === 3) {
    return { bgColor: "bg-[#F4E0D3]", textColor: "text-[#8B5E30]", medalEmoji: '🥉' };
  }
  return { bgColor: "bg-[#ebefff]", textColor: "text-[#8c8ccd]", medalEmoji: '' };
}

function getRankChange(oldRank, newRank) {
  if (!oldRank) {
    return { arrow: '', color: 'text-gray-500', diff: 'New' };
  }
  const diffVal = oldRank - newRank;
  if (diffVal > 0) {
    return { arrow: '▲', color: 'text-green-600', diff: diffVal };
  } else if (diffVal < 0) {
    return { arrow: '▼', color: 'text-red-600', diff: Math.abs(diffVal) };
  }
  return { arrow: '', color: 'text-gray-500', diff: 0 };
}

function RankingCardTalkTime({
  talkTimeData,
  selectedUsername,
  selectedTeam,
  findUsername,
  isLoading
}) {
  if (isLoading) {
    return <Spinner />;
  }

  const currentMonthTalk = talkTimeData?.currentMonth || [];
  const lastMonthTalk = talkTimeData?.lastMonth || [];

  const lastMonthRankMap = useMemo(() => {
    let maxCall = 0, maxTime = 0, maxAvg = 0;
    const w1 = 0.33, w2 = 0.33, w3 = 0.33;

    lastMonthTalk.forEach(item => {
      const c = parseFloat(item.totalCall || 0);
      const t = parseFloat(item.totalTime || 0);
      const a = parseFloat(item.averageTime || 0);
      if (c > maxCall) maxCall = c;
      if (t > maxTime) maxTime = t;
      if (a > maxAvg) maxAvg = a;
    });

    const withScore = lastMonthTalk.map(item => {
      const c = parseFloat(item.totalCall || 0);
      const t = parseFloat(item.totalTime || 0);
      const a = parseFloat(item.averageTime || 0);

      const callNorm = maxCall ? c / maxCall : 0;
      const timeNorm = maxTime ? t / maxTime : 0;
      const avgNorm = maxAvg ? a / maxAvg : 0;
      const score = (w1 * callNorm) + (w2 * timeNorm) + (w3 * avgNorm);
      return { ...item, score };
    }).sort((a, b) => b.score - a.score);

    const rankMap = {};
    withScore.forEach((item, index) => {
      rankMap[item.adminUser] = index + 1;
    });
    return rankMap;
  }, [lastMonthTalk]);

  const filteredData = useMemo(() => {
    let filtered = [...currentMonthTalk];
    if (selectedTeam?.length > 0) {
      filtered = filtered.filter(item => {
        const teamName = item.team || 'ยังไม่มีทีม';
        return selectedTeam.includes(teamName);
      });
    }
    if (selectedUsername?.length > 0) {
      filtered = filtered.filter(item => selectedUsername.includes(item.adminUser));
    }
    if (findUsername && typeof findUsername === 'string') {
      const lower = findUsername.toLowerCase();
      filtered = filtered.filter(item =>
        item.adminUser?.toLowerCase().includes(lower) ||
        item.name?.toLowerCase().includes(lower) ||
        item.nickName?.toLowerCase().includes(lower)
      );
    }
    return filtered;
  }, [currentMonthTalk, selectedTeam, selectedUsername, findUsername]);

  const sortedData = useMemo(() => {
    let maxCall = 0, maxTime = 0, maxAvg = 0;
    const w1 = 0.33, w2 = 0.33, w3 = 0.33;

    filteredData.forEach(item => {
      const c = parseFloat(item.totalCall || 0);
      const t = parseFloat(item.totalTime || 0);
      const a = parseFloat(item.averageTime || 0);
      if (c > maxCall) maxCall = c;
      if (t > maxTime) maxTime = t;
      if (a > maxAvg) maxAvg = a;
    });

    const withScore = filteredData.map(item => {
      const c = parseFloat(item.totalCall || 0);
      const t = parseFloat(item.totalTime || 0);
      const a = parseFloat(item.averageTime || 0);

      const callNorm = maxCall ? c / maxCall : 0;
      const timeNorm = maxTime ? t / maxTime : 0;
      const avgNorm = maxAvg ? a / maxAvg : 0;
      const score = (w1 * callNorm) + (w2 * timeNorm) + (w3 * avgNorm);

      return { ...item, performanceScore: score };
    });
    return withScore.sort((a, b) => b.performanceScore - a.performanceScore);
  }, [filteredData]);

  const topThree = sortedData.slice(0, 3);
  const otherRanks = sortedData.slice(3);

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {topThree.map((item, index) => {
          const newRank = index + 1;
          const oldRank = lastMonthRankMap[item.adminUser];
          const { bgColor, textColor, medalEmoji } = getMedalData(newRank);
          const { arrow, color, diff } = getRankChange(oldRank, newRank);

          return (
            <Card key={item.adminUser || index} shadow="none" radius="sm">
              <CardHeader className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span
                    className={`
                      inline-block rounded-full px-2 py-1 text-md font-bold
                      ${bgColor} ${textColor}
                    `}
                  >
                    อันดับที่ {newRank}
                  </span>
                  <h2 className="text-md font-semibold text-gray-700">
                    {item.adminUser}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xl ${color}`}>{arrow}</span>
                  {diff === 'New' ? (
                    <span className="text-sm text-gray-500">New</span>
                  ) : (
                    <span className={`text-sm font-bold ${color}`}>
                      {diff}
                    </span>
                  )}
                  <span className="text-3xl">{medalEmoji}</span>
                </div>
              </CardHeader>
              <CardBody>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500">
                    เคยอยู่อันดับ {oldRank ?? '-'}
                  </span>
                  {oldRank ? (
                    diff === 0 ? (
                      <span className="text-xs text-gray-400 ml-2">
                        อันดับเดิม
                      </span>
                    ) : diff === 'New' ? null : (
                      <>
                        {arrow === '▲' && (
                          <span className="text-xs text-green-600 ml-2">
                            ขึ้นมาจากอันดับ {oldRank}
                          </span>
                        )}
                        {arrow === '▼' && (
                          <span className="text-xs text-red-600 ml-2">
                            ลงมาจากอันดับ {oldRank}
                          </span>
                        )}
                      </>
                    )
                  ) : (
                    <span className="text-xs text-gray-400 ml-2">
                      ไม่เคยมีอันดับมาก่อน
                    </span>
                  )}
                </div>

                <Divider className="my-2" />
                <div className="flex items-center mb-4">
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-16 h-16 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <div
                      className="
                        w-16 h-16 bg-blue-500 text-white flex items-center justify-center
                        rounded-full mr-3 text-xl font-bold
                      "
                    >
                      {item.name?.charAt(0).toUpperCase() || ""}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-base font-semibold text-gray-800">
                      {item.name}
                    </span>
                    <div className="text-sm text-gray-500">
                      {item.nickName || "-"}
                    </div>
                  </div>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between items-center mt-2">
                  <div className="flex flex-col items-start">
                    <span className="text-lg font-bold">
                      {formatCurrencyNoDollars(item.totalCall || 0)}
                    </span>
                    <span className="text-md text-gray-500">
                      📞 จำนวนสายโทรทั้งหมด
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold">
                      {formatCurrencyNoDollars2Fixed(item.totalTime || 0)}
                    </span>
                    <span className="text-md text-gray-500">
                      ⏱️ ระยะเวลาการสนทนา (นาที)
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {otherRanks.length > 0 && (
        <ScrollArea className="h-[430px] w-full rounded-md border p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherRanks.map((item, idx) => {
              const newRank = idx + 4;
              const oldRank = lastMonthRankMap[item.adminUser];
              const { bgColor, textColor, medalEmoji } = getMedalData(newRank);
              const { arrow, color, diff } = getRankChange(oldRank, newRank);

              return (
                <Card key={item.adminUser || `rank-${newRank}`} shadow="none" radius="sm">
                  <CardBody className="flex flex-col p-4">
                    <div className="w-full flex items-center gap-2">
                      <span
                        className={`
                          inline-block rounded-full px-2 py-1 text-md font-bold
                          ${bgColor} ${textColor}
                        `}
                      >
                        อันดับที่ {newRank}
                      </span>
                      <div className="text-base font-semibold text-gray-700">
                        {item.adminUser}
                      </div>
                      <span className={`text-xl ${color}`}>{arrow}</span>
                      {diff === 'New' ? (
                        <span className="text-sm text-gray-500 ml-1">New</span>
                      ) : (
                        <span className={`text-sm font-bold ml-1 ${color}`}>
                          {diff}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-2 mt-2">
                      <span className="text-sm text-gray-500">
                        เคยอยู่อันดับ {oldRank ?? '-'}
                      </span>
                      {oldRank ? (
                        diff === 0 ? (
                          <span className="text-xs text-gray-400 ml-2">
                            อันดับเดิม
                          </span>
                        ) : diff === 'New' ? null : (
                          <>
                            {arrow === '▲' && (
                              <span className="text-xs text-green-600 ml-2">
                                ขึ้นมาจากอันดับ {oldRank}
                              </span>
                            )}
                            {arrow === '▼' && (
                              <span className="text-xs text-red-600 ml-2">
                                ลงมาจากอันดับ {oldRank}
                              </span>
                            )}
                          </>
                        )
                      ) : (
                        <span className="text-xs text-gray-400 ml-2">
                          ไม่เคยมีอันดับมาก่อน
                        </span>
                      )}
                    </div>

                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="
                          w-16 h-16 bg-blue-500 text-white flex items-center justify-center
                          rounded-full text-md font-bold
                        "
                      >
                        {item.name?.charAt(0).toUpperCase() || ""}
                      </div>
                    )}

                    <div className="mt-2 text-lg font-bold text-black">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.nickName || "-"}
                    </div>

                    <Divider className="my-2 w-full" />
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex flex-col items-start">
                        <span className="text-lg font-bold">
                          {formatCurrencyNoDollars(item.totalCall || 0)}
                        </span>
                        <span className="text-sm text-gray-500">
                          📞 จำนวนสายโทรทั้งหมด
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-bold">
                          {formatCurrencyNoDollars2Fixed(item.totalTime || 0)}
                        </span>
                        <span className="text-sm text-gray-500">
                          ⏱️ ระยะเวลาการสนทนา (นาที)
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </section>
  );
}

export default RankingCardTalkTime;
