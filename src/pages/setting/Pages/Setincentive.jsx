import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Select, SelectItem, Checkbox, Input, Button, Tooltip } from "@nextui-org/react";
import { PlusIcon, SubtractIcon } from '../../../component/Icons';
import { Toaster, toast } from 'sonner';
import axios from "axios";

function SetIncentive() {
  const [isExtraChecked, setIsExtraChecked] = useState(false);
  const [isGeneralChecked, setIsGeneralChecked] = useState(false);
  const [formsBaht, setFormsBaht] = useState([{ id: 1, minAmount: '', maxAmount: '', baht: '' }]);
  const [selectedDepartment, setSelectedDepartments] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isRoleChecked, setIsRoleChecked] = useState(false);
  const [isPassedChecked, setIsPassedChecked] = useState(false);
  const [departmentData, setDepartmentData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDepartmentData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/v1/settings/getDepartments`);
      setDepartmentData(response.data);
    } catch (error) {
      console.log('error fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentData();
  }, []);

  const handleSave = () => {
    const state = {
      isExtraChecked,
      isGeneralChecked,
      formsBaht,
      selectedDepartment
    };
    sessionStorage.setItem('checkboxState', JSON.stringify(state));
    toast.success('บันทึกข้อมูลสำเร็จ', { duration: 2500, description: 'บันทึกแล้ว' });
  };

  useEffect(() => {
    const savedState = sessionStorage.getItem('checkboxState');
    if (savedState) {
      const state = JSON.parse(savedState);
      setIsExtraChecked(state.isExtraChecked);
      setIsGeneralChecked(state.isGeneralChecked);
      setFormsBaht(state.formsBaht || [{ id: 1, minAmount: '', maxAmount: '', baht: '' }]);
      setSelectedDepartments(state.selectedDepartment || '');
      setIsRoleChecked(state.isRoleChecked);
      setIsPassedChecked(state.isPassedChecked);
    }
  }, []);

  const handleCheckboxChange = (type) => {
    if (type === 'general') {
      setIsGeneralChecked(prev => !prev);
      if (!isGeneralChecked) setIsExtraChecked(false);
    } else if (type === 'extra') {
      setIsExtraChecked(prev => !prev);
      if (!isExtraChecked) setIsGeneralChecked(false);
    }
  };

  const addFormBaht = () => {
    if (formsBaht.length < 5) {
      setFormsBaht([...formsBaht, { id: formsBaht.length + 1, minAmount: '', maxAmount: '', baht: '' }]);
    }
  };

  const removeFormBaht = (id) => {
    const updatedForms = formsBaht.filter(form => form.id !== id).map((form, index) => ({
      ...form,
      id: index + 1,
    }));
    setFormsBaht(updatedForms);
  };

  return (
    <section className="w-full">
      <Card className="flex p-4 shadow-none">
        <CardHeader className="flex justify-between">
          <div className="text-base font-bold">การตั้งค่า Incentive</div>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-4">
            {/* Employee Type and Income Type Section */}
            <div className="flex flex-wrap items-center md:flex-nowrap gap-8">
              <div className="flex flex-col w-full md:w-auto">
                <h3 className="text-md font-bold mb-2">เลือกรูปแบบ</h3>
                <div className="flex items-center gap-4">
                  <Checkbox color="primary"
                    isSelected={isGeneralChecked}
                    onChange={() => handleCheckboxChange('general')}
                  >
                    เงื่อนไขทั่วไป
                  </Checkbox>
                  <Checkbox color="primary"
                    isSelected={isExtraChecked}
                    onChange={() => handleCheckboxChange('extra')}
                  >
                    เงื่อนไขพิเศษ</Checkbox>
                </div>
              </div>
            </div>

            {isGeneralChecked && (
              <>
                {/* Company Section */}
                <div className="flex flex-wrap items-center md:flex-nowrap gap-8">
                  <div className="flex flex-col w-full md:w-auto">
                    <h3 className="text-md font-bold mb-2">ใช้กับ</h3>
                    <div className="flex flex-wrap items-center md:flex-nowrap gap-8">
                      <div className="flex flex-col w-full md:w-auto">
                        <h3 className="mb-2">แผนก</h3>
                        <Select
                          label="เลือกแผนก"
                          variant="bordered"
                          className="min-w-[300px]"
                          value={selectedDepartment}
                          isLoading={isLoading}
                          onChange={(event) => setSelectedDepartments(event.target.value)}
                          scrollShadowProps={{
                            isEnabled: false
                          }}
                        >
                          {[...new Set(departmentData.map(item => item.departmentName))].map((departmentName, index) =>
                            <SelectItem key={departmentName} value={departmentName}>{departmentName}</SelectItem>
                          )}
                        </Select>
                      </div>
                      <div className="flex flex-col w-full md:w-auto">
                        <div className="mb-2">
                          <label>ตำแหน่ง</label>
                        </div>
                        <Select
                          label="เลือกตำแหน่ง"
                          variant="bordered"
                          className="min-w-[300px]"
                          value={selectedRole}
                          isLoading={isLoading}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          scrollShadowProps={{
                            isEnabled: false
                          }}
                          isDisabled={!selectedDepartment}
                        >
                          {departmentData
                            .filter(item => item.departmentName === selectedDepartment)
                            .map((item, index) =>
                              <SelectItem key={item.roleName} value={item.roleName}>{item.roleName}</SelectItem>
                            )
                          }
                        </Select>
                      </div>
                      <div className="flex flex-col w-full md:w-auto">
                        <div className="mb-2">
                          <Checkbox color="primary"
                            checked={isPassedChecked}
                            onChange={(e) => setIsPassedChecked(e.target.checked)}
                          >ผ่านการทดลองงาน</Checkbox>
                        </div>
                        <Select
                          label="เลือกสถานะ"
                          variant="bordered"
                          className="min-w-[300px]"
                          scrollShadowProps={{
                            isEnabled: false
                          }}
                          isDisabled={!isPassedChecked}
                        >
                          <SelectItem>ทดลองงาน</SelectItem>
                          <SelectItem>ผ่านการทดลองงาน</SelectItem>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Description Section */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-md font-bold mb-2">รายละเอียด</h3>
                  <div className="flex items-center gap-4">
                    <p className="text-start text-sm">
                      เป็นการให้ค่าตอบแทนพนักงานแบบรายเดือนโดยใช้นโยบายค่าคอมมิชชัน คำนวณค่าคอมมิชชันมีตัวชี้วัด 2 รูปแบบ คือ 1. จำนวน คือ พนักงานทำงานตามที่กำหนดได้ครบจำนวน จะได้ค่าตอบแทนที่มากของจำนวนเงินนั้น เช่น ทำงานครบตั้งแต่ 1 - 50 จำนวน จะได้รับ 100 บาท 2. บาท คือ พนักงานทำงานครบตามจำนวนเงินที่กำหนดจะได้รับค่าตอบแทนเป็นบาท เช่น ขายของได้ 10,000 บาท จะได้รับเงิน 100 บาท หากมีข้อสงสัยสามารถติดต่อทีมงาน HOPEFUL-CRM เพื่สอบถามรายละเอียดเพิ่มเติม
                    </p>
                  </div>
                </div>

                {/* Baht Input Section */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-md font-bold mb-2 items-center">
                    การให้เงินของแผนก {selectedDepartment}
                    {selectedDepartment && selectedRole && ` ตำแหน่ง ${selectedRole}`}
                    <Tooltip color="primary" placement='right' content="เพิ่มเงื่อนไข" className="text-white font-bold"
                      delay={0}
                      closeDelay={0}
                      motionProps={{
                        variants: {
                          exit: {
                            opacity: 0,
                            transition: {
                              duration: 0.1,
                              ease: "easeIn",
                            }
                          },
                          enter: {
                            opacity: 1,
                            transition: {
                              duration: 0.15,
                              ease: "easeOut",
                            }
                          },
                        },
                      }}
                    >
                      <Button isIconOnly color="primary" size="sm" className="ml-2" onPress={addFormBaht}>
                        <PlusIcon />
                      </Button>
                    </Tooltip>
                  </h3>
                  {formsBaht.map((form, index) => (
                    <div key={form.id} className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap">ขั้นที่ {index + 1} ตั้งแต่</label>
                        <Input type="text" placeholder="0" variant="bordered" value={form.minAmount} onChange={(e) => {
                          const updatedForms = formsBaht.map(f => f.id === form.id ? { ...f, minAmount: e.target.value } : f);
                          setFormsBaht(updatedForms);
                        }} />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap">จนถึง</label>
                        <Input type="text" placeholder="0" variant="bordered" value={form.maxAmount} onChange={(e) => {
                          const updatedForms = formsBaht.map(f => f.id === form.id ? { ...f, maxAmount: e.target.value } : f);
                          setFormsBaht(updatedForms);
                        }} />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap">จะได้</label>
                        <Input type="text" placeholder="0" variant="bordered" value={form.baht} onChange={(e) => {
                          const updatedForms = formsBaht.map(f => f.id === form.id ? { ...f, baht: e.target.value } : f);
                          setFormsBaht(updatedForms);
                        }} />
                        <label className="whitespace-nowrap">บาท</label>
                        {index > 0 && (
                          <Tooltip color="danger" placement='right' content="ลบเงื่อนไข" className="text-white font-bold"
                            delay={0}
                            closeDelay={0}
                            motionProps={{
                              variants: {
                                exit: {
                                  opacity: 0,
                                  transition: { 
                                    duration: 0.1,
                                    ease: "easeIn",
                                  }
                                },
                                enter: {
                                  opacity: 1,
                                  transition: {
                                    duration: 0.15,
                                    ease: "easeOut",
                                  }
                                },
                              },
                            }}
                          >
                            <Button isIconOnly color="danger" size="sm" className="ml-2" onPress={() => removeFormBaht(form.id)}>
                              <SubtractIcon />
                            </Button>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <Button color="primary" className="text-white font-bold" onPress={() => handleSave()}>บันทึกข้อมูล</Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardBody>
      </Card>
      <Toaster expand={false} position="top-right" richColors />
    </section>
  );
}

export default SetIncentive;
