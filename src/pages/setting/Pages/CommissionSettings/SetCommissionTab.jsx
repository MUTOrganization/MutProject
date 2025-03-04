import { PlusIcon, SubtractIcon } from "@/component/Icons";
import NumberInput from "@/component/NumberInput";
import { cFormatter } from "@/utils/numberFormatter";
import { Radio, RadioGroup, Tooltip, Button } from "@nextui-org/react";
import { useMemo } from "react";
import lodash from "lodash";

export default function SetCommissionTab({ type, selectedData, forms, setForm, formValidate, selectedSource, setSelectedSource }) {

    const unit = type === 'commission' ? 'percentage' : 'baht'

    const handleCommissionAmountInput = (id, value) => {
        const updatedForms = forms.map(f => f.id === id ? { ...f, [unit]: value } : f);
        setForm(updatedForms);
    }
    const handleMaxAmountInput = (id, value, nextForm) => {
        const max = Number(value);
        const updatedForms = forms.map(f => {
            if (f.id === id) {
                return { ...f, maxAmount: value }
            } else if (nextForm && f.id === nextForm.id) {
                return { ...f, minAmount: String(max + 1) }
            } else {
                return f
            }
        });
        setForm(updatedForms);
    }

    const addFormPercentage = () => {
        if (true) {
            let id = 0;
            let min = 0;
            let max = 0;
            if (forms.length > 0) {
                const maxId = lodash.maxBy(forms, 'id')?.id ?? 0;
                id = maxId + 1
                const lastItem = forms[forms.length - 1]
                min = Number(lastItem.maxAmount) + 1;
                max = min + 1;
            }
            setForm(p => [
                ...p,
                { id: id, minAmount: min, maxAmount: max, [unit]: 0 }
            ]);
        }
    };
    const removeFormPercentage = (id, prevForm, nextForm) => {
        const updatedForms = forms.filter(form => form.id !== id).map((form) => {
            if (nextForm && form.id === nextForm.id) {
                form.minAmount = Number(prevForm.maxAmount) + 1;
            }
            return form;
        })
        setForm(updatedForms)
    };

    const typeText = type === 'commission' ? 'Commission' : 'Incentive'

    return (
        <div className=" w-fit">
            <h3 className="text-md font-bold">รายละเอียด</h3>
            <div className="flex items-center gap-4">
                {
                    type === 'commission' ?
                    <div className="text-start text-sm">
                        <p>เป็นการให้ค่าตอบแทนพนักงานแบบรายเดือนโดยใช้นโยบายคอมมิชชั่น โดยมีตัวชี้วัด 2 รูปแบบ คือ</p>
                        <p className="ml-4">1. ยอดเงินเข้า คือ ยอดเงินเข้าของตนเอง</p>
                        <p className="ml-4">2. ยอดเงินเข้าของทีม คือ ยอดเงินเข้ารวมของทีมที่ดูแล</p>
                        <p className="mt-2">ตัวอย่าง</p>
                        <p className="">ยอดเงินเข้าตั้งแต่ 0 - 100,000 บาท จะได้รับค่าคอมมิชชั่น 5 %</p>
                    </div>
                    :
                    <div className="text-start text-sm">
                        <p>เป็นการให้ค่าตอบแทนพนักงานแบบรายเดือนโดยใช้นโยบายอินเซนทีฟ โดยมีตัวชี้วัด 2 รูปแบบ คือ</p>
                        <p className="ml-4">1. ยอดเงินเข้า คือ ยอดเงินเข้าของตนเอง</p>
                        <p className="ml-4">2. ยอดเงินเข้าของทีม คือ ยอดเงินเข้ารวมของทีมที่ดูแล</p>
                        <p className="mt-2">ตัวอย่าง</p>
                        <p className="">ยอดเงินเข้าตั้งแต่ 0 - 100,000 บาท จะได้รับค่าตอบแทน 1,000 บาท</p>
                    </div>
                }
            </div>
            <div className="my-4 flex">
                <div className="me-4 font-bold">ตัวชี้วัด คำนวณจาก : </div>
                <RadioGroup orientation="horizontal" value={selectedSource} onValueChange={setSelectedSource}>
                    <Radio value="SALE">ยอดเงินเข้า</Radio>
                    <Radio value="TEAMSALE">ยอดเงินเข้าของทีมที่ดูแล</Radio>
                </RadioGroup>
            </div>
            <div className="flex flex-col gap-2">
                <div className="text-md mb-2 flex items-center">
                    ระดับคอมมิชชั่นของแผนก <span className="mx-2 font-bold">{selectedData?.department?.name}</span>
                    ตำแหน่ง<span className="mx-2 font-bold">{selectedData?.role?.name}</span>
                    ที่ <span className="mx-2 font-bold">{selectedData?.selectedRole?.passedProb === '0' ? 'อยู่ระหว่างทดลองงาน' : 'ผ่านการทดลองงาน'}</span>
                    <Tooltip color="primary" placement='right' content="เพิ่มเงื่อนไข" className="text-white font-bold"
                        showArrow
                        delay={0}
                        closeDelay={0}
                    >
                        <Button isIconOnly color="primary" size="sm" className="ml-2" onPress={addFormPercentage}>
                            <PlusIcon />
                        </Button>
                    </Tooltip>
                </div>
                {
                    forms.map((form, index) => {
                        const prevForm = index === 0 ? null : forms[index - 1];
                        const nextForm = index === forms.length - 1 ? null : forms[index + 1];
                        const _validate = formValidate.find(e => e.id === form.id)
                        return (
                            <div key={form.id} className="flex flex-wrap items-start gap-4">
                                <div className="flex items-start gap-2">
                                    <label className="whitespace-nowrap mt-2">ขั้นที่ {index + 1} ตั้งแต่</label>
                                    <NumberInput value={String(form.minAmount)}
                                        isDisabled={true}
                                    // isInValid={_validate?.minPrev || _validate?.minCurrent}  
                                    // errorMessage={_validate?.minPrev ? `ต้องมากกว่า ${cFormatter(prevForm?.maxAmount)}` : _validate?.minCurrent ? `ต้องน้อยกว่า ${cFormatter(form.maxAmount)}` : ''}
                                    />

                                </div>
                                <div className="flex items-start gap-2">
                                    {
                                        //ถ้าไม่ใช่แถวสุดท้าย
                                        index !== forms.length - 1 ?
                                            <>
                                                <label className="whitespace-nowrap mt-2">จนถึง</label>
                                                <NumberInput value={String(form.maxAmount)} onChange={(value) => handleMaxAmountInput(form.id, value, nextForm)}
                                                    maxDecimal={0}
                                                    isInValid={_validate?.maxCurrent}
                                                    errorMessage={_validate?.maxCurrent ? `ต้องมากกว่า ${cFormatter(form.minAmount)}` : _validate?.maxNext ? `ต้องน้อยกว่า ${cFormatter(nextForm?.minAmount)}` : ''}
                                                />
                                            </>
                                            :
                                            <label className="whitespace-nowrap mt-2 ">ขึ้นไป</label>

                                    }
                                </div>
                                <div className="flex items-start gap-2">
                                    <label className="whitespace-nowrap mt-2">จะได้</label>
                                    <NumberInput value={String(form[unit])} onChange={(value) => handleCommissionAmountInput(form.id, value)} />
                                    <label className="whitespace-nowrap mt-2">{unit === 'percentage' ? '%' : 'บาท'}</label>
                                    {index > 0 && (
                                        <Tooltip color="danger" placement='right' content="ลบเงื่อนไข" className="text-white font-bold"
                                            showArrow
                                            delay={0}
                                            closeDelay={0}
                                        >
                                            <Button isIconOnly color="danger" size="sm" className="ml-2" onPress={() => removeFormPercentage(form.id, prevForm, nextForm)}>
                                                <SubtractIcon />
                                            </Button>
                                        </Tooltip>
                                    )}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
