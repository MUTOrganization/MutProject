import { toastSuccess, toastWarning } from "@/component/Alert";
import { URLS } from "../../../config";
import { Accordion, AccordionItem, Button, Card, CardBody, CardHeader, Input, Textarea, Spinner } from "@nextui-org/react";
import { ChevronDown, ChevronLeft, CircleMinus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import fetchProtectedData from "../../../../utils/fetchData"
import moment from "moment";
import { useAppContext } from "../../../contexts/AppContext";

function MasterSettingOKR() {
    // เกรดทั้งหมด
    const grade = ["A", "B", "C", "D", "F"];

    const { currentUser } = useAppContext();

    // ตัวแปรสำหรับการเลือกเกรด
    const [selectedGrade, setSelectedGrade] = useState(["A", "B", "C", "D", "F"]);

    // ตัแปรโครงสร้างข้อมูล benefit
    const [benefit, setBenefit] = useState([]);

    // เพิ่ม state สำหรับเก็บข้อมูล grade score
    const [gradeScores, setGradeScores] = useState([
        { grade: 'A', min: 91, max: 100 },
        { grade: 'B', min: 81, max: 90 },
        { grade: 'C', min: 71, max: 80 },
        { grade: 'D', min: 61, max: 70 },
        { grade: 'F', min: 0, max: 60 }
    ]);

    // เพิ่ม state สำหรับ loading
    const [isLoading, setIsLoading] = useState(false);

    //#region Func สำหรับบันทึกข้อมูลจาก form input ที่เพิ่มหัวข้อและคำอธิบาย
    //Func Save value grade input
    //Func สำหรับบันทึกข้อมูลจาก form input ที่เพิ่มหัวข้อและคำอธิบาย
    const handleSaveBenefit = (grade, befId, field, value) => {
        setBenefit(prev => {
            return prev.map(item => {
                if (item.grade === grade) {
                    return { ...item, benefit: item.benefit.map(bf => bf.id === befId ? { ...bf, [field]: value } : bf) };
                }
                return item;
            });
        });
    }
    //Func สำหรับเพิ่มหัวข้อและคำอธิบาย
    const handleAddItemBenefit = (grade) => {
        setBenefit(prev => {
            const existingGradeIndex = prev.findIndex(item => item.grade === grade);

            if (existingGradeIndex === -1) {
                return [...prev, {
                    grade: grade,
                    benefit: [{
                        id: 1,
                        title: "",
                        description: ""
                    }]
                }];
            } else {
                const updatedBenefit = [...prev];
                const nextId = updatedBenefit[existingGradeIndex].benefit.length + 1;
                updatedBenefit[existingGradeIndex].benefit.push({
                    id: nextId,
                    title: "",
                    description: ""
                });
                return updatedBenefit;
            }
        });
    };

    //Func สำหรับลบหัวข้อและคำอธิบาย
    const handleDeleteItemBenefit = (grade, bfId) => {
        setBenefit(prev => {
            return prev.map(item => {
                if (item.grade === grade) {
                    return {
                        ...item,
                        benefit: item.benefit.filter(bf => bf.id !== bfId)
                    };
                }
                return item;
            }).filter(item => item.benefit.length > 0);
        });
    };
    //#endregion

    //#region Fetch API
    const fetchUpdateGradeScores = async (gradeData) => {
        try {
            const response = await fetchProtectedData.post(URLS.okr.updateGradeSetting, {
                businessId: currentUser.businessId,
                year: moment().year(),
                grades: gradeData,
                userName: currentUser.userName,
            });

            if (response.status === 200) {
                toastSuccess('บันทึกข้อมูลเรียบร้อย');
                return true;
            }
            return false;
        } catch (error) {
            toastWarning('เกิดข้อผิดพลาด', error?.message || 'ไม่สามารถบันทึกข้อมูลได้');
            return false;
        }
    }

    // เพิ่มฟังก์ชันสำหรับดึงข้อมูล
    const fetchGradeSettings = async () => {
        setIsLoading(true);
        try {
            const response = await fetchProtectedData.get(URLS.okr.getGradeSetting, {
                params: {
                    businessId: currentUser.businessId,
                    year: moment().year()
                }
            });

            if (response.status === 200) {
                const data = response.data;

                if (data && data.length > 0) {
                    // จัดการข้อมูล gradeScores
                    const formattedGradeScores = data.map(item => ({
                        grade: item.grade,
                        min: parseFloat(item.minPercent),
                        max: parseFloat(item.maxPercent)
                    }));
                    setGradeScores(formattedGradeScores);

                    // จัดการข้อมูล benefit
                    const formattedBenefits = data
                        .filter(item => item.benefit && item.benefit.length > 0)
                        .map(item => ({
                            grade: item.grade,
                            benefit: item.benefit.map((b, index) => ({
                                id: index + 1,
                                title: b.title || '',
                                description: b.description || ''
                            }))
                        }));
                    setBenefit(formattedBenefits);
                } else {
                    // ตั้งค่าเริ่มต้นถ้าไม่มีข้อมูล
                    const defaultGradeScores = [
                        { grade: 'A', min: 91, max: 100 },
                        { grade: 'B', min: 81, max: 90 },
                        { grade: 'C', min: 71, max: 80 },
                        { grade: 'D', min: 61, max: 70 },
                        { grade: 'F', min: 0, max: 60 }
                    ];
                    setGradeScores(defaultGradeScores);
                }
            }
        } catch (error) {
            toastWarning('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลได้');
        } finally {
            setIsLoading(false);
        }
    };

    // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ component mount
    useEffect(() => {
        fetchGradeSettings();
    }, []);
    //#endregion

    // แก้ไขฟังก์ชัน calculateGradeRanges
    const calculateGradeRanges = () => {
        
        let newGradeScores = [...gradeScores];

        // กำหนดค่าเริ่มต้นสำหรับทุกเกรด
        newGradeScores = [
            { grade: 'A', min: 91, max: 100 },
            { grade: 'B', min: 81, max: 90 },
            { grade: 'C', min: 71, max: 80 },
            { grade: 'D', min: 61, max: 70 },
            { grade: 'F', min: 0, max: 60 }
        ];

        // ตรวจสอบและปรับค่าให้อยู่ในช่วง 0-100
        newGradeScores = newGradeScores.map(item => ({
            ...item,
            min: Math.max(0, Math.min(100, item.min)),
            max: Math.max(0, Math.min(100, item.max))
        }));

        return newGradeScores;
    };

    // แก้ไขฟังก์ชัน handleGradeScoreChange
    const handleGradeScoreChange = (grade, field, value, isAutoCalculate = false) => {
        if (value === '') {
            setGradeScores(prev =>
                prev.map(item =>
                    item.grade === grade ? { ...item, [field]: '' } : item
                )
            );
            return;
        }

        let newValue = parseInt(value);
        if (newValue > 100) newValue = 100;
        if (newValue < 0) newValue = 0;

        if (isAutoCalculate) {
            // คำนวณคะแนนอัตโนมัติสำหรับทุกเกรด
            const newGradeScores = calculateGradeRanges(grade, newValue, field);
            setGradeScores(newGradeScores);
        } else {
            // อัพเดทเฉพาะเกรดที่กำลังแก้ไข
            setGradeScores(prev =>
                prev.map(item => {
                    if (item.grade === grade) {
                        if (grade === 'F') {
                            if (field === 'min') {
                                return item; // ไม่อนุญาตให้แก้ไข min ของเกรด F
                            }
                            return { ...item, max: newValue, min: 0 }; // อนุญาตให้แก้ไข max ได้
                        }
                        return { ...item, [field]: newValue };
                    }
                    return item;
                })
            );
        }
    };

    // เพิ่มปุ่มสำหรับคำนวณอัตโนมัติ
    const handleAutoCalculate = (grade, field, value) => {
        handleGradeScoreChange(grade, field, value, true);
    };

    // แก้ไขฟังก์ชัน validateGradeScores
    const validateGradeScores = () => {
        // ตรวจสอบว่ากรอกข้อมูลครบไหม
        const incompleteGrades = gradeScores.filter(item => {
            if (item.grade === 'F') return false;
            return item.min === '' || item.max === '';
        });

        if (incompleteGrades.length > 0) {
            return { isValid: false, message: 'กรุณากรอกข้อมูลให้ครบทุกเกรด' };
        }

        // ตรวจสอบว่า min ต้องน้อยกว่า max สำหรับเกรดอื่นๆ
        const invalidRanges = gradeScores.filter(item => {
            if (item.grade === 'F') return false;
            return parseInt(item.min) >= parseInt(item.max);
        });

        if (invalidRanges.length > 0) {
            return { isValid: false, message: 'ค่าต่ำสุดต้องน้อยกว่าค่าสูงสุด' };
        }

        // ตรวจสอบว่าช่วงคะแนนไม่ทับซ้อนกัน
        for (let i = 0; i < gradeScores.length - 1; i++) {
            const current = gradeScores[i];
            const next = gradeScores[i + 1];

            if (parseInt(next.max) >= parseInt(current.min)) {
                return { isValid: false, message: 'ช่วงคะแนนของแต่ละเกรดต้องไม่ทับซ้อนกัน' };
            }
        }

        // ตรวจสอบว่าช่วงคะแนนครบ 100
        const maxScore = Math.max(...gradeScores.map(item => parseInt(item.max)));
        const minScore = Math.min(...gradeScores.map(item => parseInt(item.min)));
        
        if (maxScore !== 100) {
            return { isValid: false, message: 'คะแนนสูงสุดต้องเป็น 100' };
        }

        if (minScore !== 0) {
            return { isValid: false, message: 'คะแนนต่ำสุดต้องเป็น 0' };
        }

        // ตรวจสอบว่าไม่มีช่วงคะแนนที่หายไป
        for (let i = 0; i < gradeScores.length - 1; i++) {
            const current = gradeScores[i];
            const next = gradeScores[i + 1];

            if (parseInt(next.max) + 1 !== parseInt(current.min)) {
                return { 
                    isValid: false, 
                    message: `มีช่วงคะแนนที่หายไประหว่างเกรด ${next.grade} และ ${current.grade}` 
                };
            }
        }

        return { isValid: true };
    };


    const handleSaveGradeScores = async () => {
        const validation = validateGradeScores();
        if (!validation.isValid) {
            toastWarning('ข้อมูลไม่ถูกต้อง', validation.message);
            return;
        }

        setIsLoading(true);
        try {
            const grade = gradeScores.map(item => ({
                grade: item.grade,
                minPercent: parseInt(item.min),
                maxPercent: parseInt(item.max),
                benefit: JSON.stringify(benefit.find(b => b.grade === item.grade)?.benefit || []),
            }));

            const updateSuccess = await fetchUpdateGradeScores(grade);
            if (updateSuccess) {
                // อัพเดท state โดยตรงแทนที่จะเรียก API ใหม่
                setGradeScores(prev => 
                    prev.map(item => ({
                        ...item,
                        min: parseInt(item.min),
                        max: parseInt(item.max)
                    }))
                );
            }
        } catch (error) {
            toastWarning('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Card className="p-4" shadow="none">
            <CardHeader>
                <p className="text-lg font-bold">ตั้งค่า OKR</p>
            </CardHeader>
            <CardBody className="p-10 flex flex-col items-start justify-start space-y-6 w-full">
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <p className="text-lg font-semibold">เกณฑ์การให้คะแนน OKR</p>
                        <Button
                            size="md"
                            variant="flat"
                            color="secondary"
                            onPress={() => {
                                // ใช้ค่าเริ่มต้นในการคำนวณ
                                handleAutoCalculate('A', 'min', 90);
                            }}
                            isDisabled={isLoading}
                        >
                            คำนวณอัตโนมัติ
                        </Button>
                    </div>
                    <Button
                        size="md"
                        variant="solid"
                        color="primary"
                        onPress={handleSaveGradeScores}
                        isLoading={isLoading}
                    >
                        บันทึกข้อมูล
                    </Button>
                </div>
                {isLoading ? (
                    <div className="w-full h-[200px] flex items-center justify-center">
                        <Spinner label="กำลังโหลดข้อมูล..." />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 w-full">
                        {grade.map((g) => (
                            <Card
                                key={g}
                                className={`p-4 border-1 h-fit border-gray-300 hover:border-primary ${selectedGrade.includes(g) ? 'border-primary' : ''}`}
                                shadow="none"
                            >
                                <div className="flex items-center justify-between space-x-4">
                                    <div
                                        className="flex-1 cursor-pointer"
                                        onClick={() => {
                                            if (selectedGrade.includes(g)) {
                                                setSelectedGrade(selectedGrade.filter(grade => grade !== g));
                                            } else {
                                                setSelectedGrade([...selectedGrade, g]);
                                            }
                                        }}
                                    >
                                        <span className={`text-2xl font-semibold select-none`}>
                                            เกรด {g}
                                        </span>
                                    </div>
                                    {g === 'F' ? (
                                        <>
                                            <span className="text-sm">ต่ำกว่า</span>
                                            <Input
                                                size="sm"
                                                type="text"
                                                variant="bordered"
                                                placeholder="60"
                                                className="w-24"
                                                maxLength={3}
                                                value={gradeScores.find(item => item.grade === g)?.max}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                                    handleGradeScoreChange(g, 'max', value);
                                                }}
                                                endContent={<span className="text-sm text-black font-bold border-l-1 border-gray-300 pl-2">% </span>}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <Input
                                                size="sm"
                                                type="text"
                                                variant="bordered"
                                                placeholder="0"
                                                className="w-24"
                                                maxLength={3}
                                                value={gradeScores.find(item => item.grade === g)?.min}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                                    handleGradeScoreChange(g, 'min', value);
                                                }}
                                                endContent={<span className="text-sm text-black font-bold border-l-1 border-gray-300 pl-2">% </span>}
                                            />
                                            <span className="text-lg">-</span>
                                            <Input
                                                size="sm"
                                                type="text"
                                                variant="bordered"
                                                placeholder="100"
                                                className="w-24"
                                                maxLength={3}
                                                value={gradeScores.find(item => item.grade === g)?.max}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                                    handleGradeScoreChange(g, 'max', value);
                                                }}
                                                endContent={<span className="text-sm text-black font-bold border-l-1 border-gray-300 pl-2">% </span>}
                                            />
                                        </>
                                    )}

                                    <div
                                        className="cursor-pointer"
                                        onClick={() => {
                                            if (selectedGrade.includes(g)) {
                                                setSelectedGrade(selectedGrade.filter(grade => grade !== g));
                                            } else {
                                                setSelectedGrade([...selectedGrade, g]);
                                            }
                                        }}>
                                        <div className={`transition-transform duration-300 ${selectedGrade.includes(g) ? '-rotate-90' : ''}`}>
                                            <ChevronLeft />
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${selectedGrade.includes(g) ? 'max-h-[400px] ' : 'max-h-0'
                                        }`}
                                >
                                    <div className="border-t-1 border-gray-300  mt-6 h-[400px]">
                                        <div className="w-full flex items-center justify-end my-4">
                                            <Button size="md" variant="solid" color="primary" onPress={() => handleAddItemBenefit(g)}>เพิ่มหัวข้อ</Button>
                                        </div>

                                        <div className="h-[350px] overflow-y-auto scrollbar-hide">
                                            {benefit.filter(item => item.grade === g).map((item) => (
                                                <div key={`${item.grade}-container`}>
                                                    {item.benefit.map((benefit) => (
                                                        <div key={`${item.grade}-${benefit.id}`} className="space-y-2 mx-10 mb-10">
                                                            <div className="flex items-center justify-start space-x-4 text-nowrap">
                                                                <Input
                                                                    label="หัวข้อ"
                                                                    labelPlacement="outside-left"
                                                                    variant="bordered"
                                                                    placeholder="หัวข้อ"
                                                                    size="md"
                                                                    className="w-full"
                                                                    classNames={{
                                                                        label: "text-md font-semibold",
                                                                        clearButton: "text-red-500"
                                                                    }}
                                                                    value={benefit.title}
                                                                    onChange={(e) => handleSaveBenefit(item.grade, benefit.id, "title", e.target.value)}
                                                                />
                                                                <Button isIconOnly variant="flat" color="danger" size="sm" onPress={() => handleDeleteItemBenefit(item.grade, benefit.id)}>
                                                                    <Trash2 />
                                                                </Button>
                                                            </div>
                                                            <div className="">
                                                                <Textarea
                                                                    placeholder="คำอธิบาย"
                                                                    size="md"
                                                                    className="w-full"
                                                                    variant="bordered"
                                                                    value={benefit.description}
                                                                    onChange={(e) => handleSaveBenefit(item.grade, benefit.id, "description", e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </CardBody>
        </Card>
    );
}

export default MasterSettingOKR;

