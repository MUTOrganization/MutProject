import React, { useState } from 'react';
import { Input, Button, Checkbox } from '@nextui-org/react';
import { useTransfer } from '../../../Components/TransferContext';
import { SmilelyColorIcon } from '../../../../../component/Icons'

function Remark({ onConfirmSelection }) {
    const [searchTerm, setSearchTerm] = useState('');
    const { selectedRemark, setSelectedRemark, remarks } = useTransfer();

    const handleRemarkSelect = (type) => {
        setSelectedRemark((prevRemark) => (prevRemark === type ? null : type));
    };

    const handleConfirm = () => {
        onConfirmSelection(selectedRemark);
    };

    const filteredRemarks = remarks.filter((remark) =>
        remark.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="space-y-4">
                <div className="flex flex-row space-x-2">
                    <Input
                        clearable
                        underlined
                        placeholder="ค้นหาหมายเหตุ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                    <Button
                        className="text-blue-500 font-semibold justify-self-end"
                        variant="light"
                        onPress={handleConfirm}
                    >
                        ยืนยัน
                    </Button>
                </div>

                <div className="flex flex-col">
                    <section className="overflow-y-auto h-[100vh] pb-64 space-y-4 scrollbar-hide">
                        {filteredRemarks.map((remark, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-start border-b pb-2 cursor-pointer px-2"
                                onPress={() => handleRemarkSelect(remark.type)}
                            >
                                <div className="flex flex-col space-y-1">
                                    <p className="text-lg font-semibold">{remark.type}</p>
                                    <p className="text-gray-500 text-sm">{remark.description}</p>
                                </div>
                                <Checkbox
                                    isSelected={selectedRemark === remark.type}
                                    onChange={(e) => e.stopPropagation()}
                                    color="primary"
                                />
                            </div>
                        ))}
                        {filteredRemarks.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <SmilelyColorIcon className="mb-4" width={32} height={32} />
                                <p className="text-gray-500">ไม่พบข้อมูล</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Remark;
