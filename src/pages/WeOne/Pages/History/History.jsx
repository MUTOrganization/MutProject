import React, { useEffect, useState } from "react";
import Layout from "../../Components/Layout";
import { LeftArrowIcon } from "../../../../component/Icons";
import { useNavigate } from "react-router-dom";
import fetchProtectedData from "../../../../../utils/fetchData";
import { useAppContext } from "../../../../contexts/AppContext";
import { Button } from "@nextui-org/react";
import { URLS } from "../../../../config";

function History() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ income: 0, expense: 0, total: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const currentData = useAppContext();

    const fetchTransactionHistory = async () => {
        try {
            setIsLoading(true);
            const response = await fetchProtectedData.get(
                `${URLS.weOne.getTransferHistory}`,
                {
                    params: {
                        username: currentData.currentUser.userName,
                    },
                }
            );
            const { data } = response.data;

            const income = data.reduce(
                (acc, group) =>
                    acc +
                    group.items
                        .filter((item) => item.type === "received")
                        .reduce((sum, item) => sum + item.points, 0),
                0
            );

            const expense = data.reduce(
                (acc, group) =>
                    acc +
                    group.items
                        .filter((item) => item.type === "sent")
                        .reduce((sum, item) => sum + Math.abs(item.points), 0),
                0
            );

            setSummary({
                income,
                expense,
                total: income - expense,
            });

            setTransactions(data);
        } catch (error) {
            console.error("Error fetching transaction history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactionHistory();
    }, []);

    return (
        <Layout>
            <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Button isIconOnly variant="light" className="flex-shrink-0" onPress={() => navigate(-1)}>
                        <LeftArrowIcon width={16} />
                    </Button>
                    <h2 className="text-xl font-bold flex-grow text-center">ประวัติการรับโอนคะแนน</h2>
                    <span className="w-8"></span>
                </div>

                {/* Summary Section */}
                <section>
                    <div className="bg-gray-100 p-4 rounded-lg shadow">
                        <div className="flex justify-around items-center">
                            <div className="text-center">
                                <p className="text-blue-600 font-bold text-2xl">
                                    {summary.income}
                                </p>
                                <p className="text-gray-500 text-sm">ได้รับ</p>
                            </div>
                            <div className="border-l border-gray-300 h-8"></div>
                            <div className="text-center">
                                <p className="text-red-500 font-bold text-2xl">
                                    {summary.expense}
                                </p>
                                <p className="text-gray-500 text-sm">เสียไป</p>
                            </div>
                            <div className="border-l border-gray-300 h-8"></div>
                            <div className="text-center">
                                <p className="text-black font-bold text-2xl">
                                    {summary.total}
                                </p>
                                <p className="text-gray-500 text-sm">รวมทั้งหมด</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Transaction Section */}
                <div className="flex flex-col h-[calc(100vh-200px)] overflow-hidden">
                    <section className="flex-grow space-y-4 overflow-y-auto pb-16 scrollbar-hide">
                        {transactions.map((transaction, index) => (
                            <div key={index} className="space-y-2">
                                <p className="text-gray-600 font-semibold">
                                    {transaction.date}
                                </p>
                                <div className="">
                                    {transaction.items
                                        .filter((item) => item.type === "received")
                                        .map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between items-center py-2"
                                            >
                                                <p>
                                                    รับจาก{" "}
                                                    <span className="text-blue-600">
                                                        {item.counterparty}
                                                    </span>
                                                    , {item.reason}
                                                </p>
                                                <p className="font-bold text-green-600">
                                                    +{item.points}
                                                </p>
                                            </div>
                                        ))}

                                    {transaction.items
                                        .filter((item) => item.type === "sent")
                                        .map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between items-center py-2"
                                            >
                                                <p>
                                                    โอนให้{" "}
                                                    <span className="text-blue-600">
                                                        {item.counterparty}
                                                    </span>
                                                    , {item.reason}
                                                </p>
                                                <p className="font-bold text-red-500">
                                                    -{Math.abs(item.points)}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                                {index < transactions.length - 1 && (
                                    <div className="border-b-2 border-dashed border-gray-200" />
                                )}
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </Layout>
    );
}

export default History;
