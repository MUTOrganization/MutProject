import React, { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardBody, Select, SelectItem, Checkbox, Input, Button, Textarea, Tooltip, Chip, Tabs, Tab, Divider, RadioGroup, Radio } from "@heroui/react";
import { useAppContext } from "@/contexts/AppContext";
import { toastSuccess, AlertQuestion, toastError } from '@/component/Alert'
import fetchProtectedData from "@/utils/fetchData";
import SetCommissionTab from "./SetCommissionTab";
import { SaveIcon } from "lucide-react";
import settingComService from "@/services/settingComService";

function SetCommission({ departmentData, depLoading }) {
  const { currentUser } = useAppContext();
  const [isExtraChecked, setIsExtraChecked] = useState(false);
  const [isGeneralChecked, setIsGeneralChecked] = useState(true);
  /** @type {[[{ id: Number, minAmount: Number, maxAmount: Number, percentage: String }]]} */
  const [formsCommission, setFormsCommission] = useState([{ id: 0, minAmount: 0, maxAmount: 1, percentage: 0 }]);
  const [selectedDepartment, setSelectedDepartments] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [passedProb, setPassedProb] = useState('')

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [oldCommissionSetting, setOldCommissionSetting] = useState(null);

  const [isCommissionEdit, setIsCommissionEdit] = useState(false);

  const [formPercentageValidate, setFormPercentageValidate] = useState([]);

  const [selectedCommissionSource, setSelectedCommissionSource] = useState('SALE');

  const allFormsValid = useMemo(() => {
    return formPercentageValidate.every(form => form.maxCurrent == false)
  }, [formPercentageValidate])

  useEffect(() => {
    setIsLoading(depLoading);
  }, [depLoading])

  const handleSelectedDepartment = (id) => {
    const findDep = departmentData.find(e => e.departmentId == id)
    if (findDep) {
      setSelectedDepartments(findDep)
    }
    setSelectedRole(null);
  }

  const handleSelectedRole = (id) => {
    const findRole = selectedDepartment.roles.find(e => e.roleId == id)
    if (findRole) {
      setSelectedRole(findRole)
    }
  }


  const resetFormState = () => {
    setIsCommissionEdit(false);
    setSelectedCommissionSource('SALE');
    setOldCommissionSetting(null);
  };

  const clearForms = () => {
    setFormsCommission([{ id: 0, minAmount: 0, maxAmount: 1, percentage: 0 }]);
  }

  const clearValidation = () => {
    setFormPercentageValidate([]);
  }

  useEffect(() => {
    fetchCommissionSettingData();
  }, [selectedDepartment, selectedRole, passedProb]);

  const fetchCommissionSettingData = async () => {
    // if (specific == 'commission') {
    //   setIsCommissionEdit(false);
    //   setSelectedCommissionSource('SALE');
    //   setOldCommissionSetting(null);
    //   setFormsCommission([{ id: 0, minAmount: 0, maxAmount: 1, percentage: 0 }]);
    //   setFormPercentageValidate([]);
    // }

    // if (!specific) {
    //   clearValidation();
    //   clearForms()
    //   resetFormState();
    // }

    clearValidation();
    clearForms()
    resetFormState();


    if (!selectedDepartment || !selectedRole || passedProb === '') {
      return;
    }

    setIsLoading(true);
    try {
      const data = await settingComService.getCommissionSetting(selectedRole.roleId, passedProb)
      setOldCommissionSetting(data);
      const tierList = data.rates;

      setFormsCommission(tierList.map((tier, index) => ({
        id: index,
        minAmount: tier.minAmount,
        maxAmount: tier.maxAmount,
        percentage: tier.percentage,
      })));
      setIsCommissionEdit(true);
    } catch (error) {
      if (!error.response.status == 404) {
        toastError('เกิดข้อผิดพลาดในการดึงข้อมูล', 'โปรดลองใหม่อีกครั้ง');
        console.error('Error fetching commission data');
      }

    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleValidateForm(formsCommission, 'percentage')
  }, [formsCommission])



  const handleValidateForm = (forms, type) => {
    let prevForm = null
    const _formValidate = [];
    forms.forEach((form, index) => {
      const id = form.id;
      const currMin = form.minAmount;
      const currMax = Number(form.maxAmount)

      _formValidate.push({
        id: id,
        minPrev: false,
        minCurrent: false,
        maxCurrent: false,
        maxNext: false
      })

      const findValidate = _formValidate.find(e => e.id === id);

      if (prevForm) {
        const prevMax = Number(prevForm.maxAmount)
        if (currMin <= prevMax) {
          findValidate['minPrev'] = true;
        }
      }
      if (currMin >= currMax && index !== forms.length - 1) {
        findValidate['minCurrent'] = true;
        findValidate['maxCurrent'] = true;
      }
      const nextForm = forms[index + 1];
      if (nextForm) {
        const nextMin = Number(nextForm.minAmount);
        if (currMax >= nextMin) {
          findValidate['maxNext'] = true;
        }
      }
      prevForm = form;
    })
    setFormPercentageValidate(_formValidate)
  }



  const saveSetting = async () => {
    const tierList = { percentage: formsCommission.map((e, index) => index === formsCommission.length - 1 ? { ...e, maxAmount: "9999999999999" } : e) }

    const rates = tierList.percentage.map(e => {
      return {
        minAmount: e.minAmount,
        maxAmount: e.maxAmount,
        percentage: e.percentage
      }
    })

    const oldSetting = oldCommissionSetting;


    if (isCommissionEdit && oldSetting) {
      await settingComService.updateCommissionSetting(selectedRole.roleId, passedProb, rates)
    } else {
      await settingComService.addCommissionSetting(selectedRole.roleId, passedProb, rates)
    }

  };

  const handleSubmitClick = () => {
    setIsModalOpen(true);
  }

  const handleSubmit = async () => {
    try {
      await saveSetting()
      fetchCommissionSettingData();
      toastSuccess('บันทึกข้อมูลสำเร็จ');
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error ใน handleSubmit", err);
      toastError('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  }


  return (
    <section className="w-full">
      <Card className="flex p-4" shadow="none" radius="sm">
        <CardHeader className="flex justify-between">
          <div className="text-base font-bold">การตั้งค่า Commission</div>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-4">
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
                          aria-label="แผนก"
                          variant="bordered"
                          className="min-w-[300px]"
                          selectedKeys={selectedDepartment ? [String(selectedDepartment?.departmentId)] : []}
                          isLoading={isLoading}
                          onChange={(event) => handleSelectedDepartment(event.target.value)}
                          scrollShadowProps={{
                            isEnabled: false
                          }}
                          disallowEmptySelection
                        >
                          {departmentData.map((dep, index) =>
                            <SelectItem key={String(dep.departmentId)}
                              endContent={dep.isHq == 1 && <Chip color="warning" variant="flat">สำนักงานใหญ่</Chip>}
                              value={dep.departmentName}
                            >
                              {dep.departmentName}
                            </SelectItem>
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
                          isLoading={isLoading}
                          className="min-w-[300px]"
                          aria-label="ตำแหน่ง"
                          selectedKeys={selectedRole ? [String(selectedRole?.roleId)] : []}
                          onChange={(e) => handleSelectedRole(e.target.value)}
                          scrollShadowProps={{
                            isEnabled: false
                          }}
                          disallowEmptySelection
                          isDisabled={!selectedDepartment}
                        >
                          {selectedDepartment ?
                            selectedDepartment.roles.map((role) =>
                              <SelectItem key={role.roleId} value={role.roleName}>{role.roleName}</SelectItem>
                            )
                            :
                            <SelectItem />
                          }
                        </Select>
                      </div>
                      <div className="flex flex-col w-full md:w-auto">
                        <div className="mb-2">
                          ผ่านการทดลองงาน
                        </div>
                        <Select
                          label="สถานะการทำงาน"
                          variant="bordered"
                          className="min-w-[300px]"
                          selectedKeys={[passedProb]}
                          onChange={(e) => setPassedProb(e.target.value)}
                          scrollShadowProps={{
                            isEnabled: false
                          }}
                          disallowEmptySelection
                          isDisabled={!selectedRole || !selectedDepartment}
                        >
                          <SelectItem key={0} value={0}>ทดลองงาน</SelectItem>
                          <SelectItem key={1} value={1}>ผ่านการทดลองงาน</SelectItem>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Company Section */}

                {/* Tab Section */}
                <div className="min-h-[300px]">
                  {
                    !(selectedDepartment && selectedRole && passedProb !== '') ?
                      <div className="w-full h-full p-10 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-lg ">กรุณาเลือกข้อมูล</div>
                        <div className="text-sm text-gray-500">เลือกแผนกและตำแหน่งเพื่อตั้งค่า Commission</div>
                      </div>
                      :
                      <div>
                        <Divider className="mt-4" />
                        <div className="mt-4">
                          <div className="my-4 px-4">
                            <SetCommissionTab
                              type={'commission'}
                              forms={formsCommission}
                              setForm={setFormsCommission}
                              formValidate={formPercentageValidate}
                              selectedData={{
                                department: selectedDepartment,
                                role: selectedRole,
                                passedProb: passedProb
                              }}
                              selectedSource={selectedCommissionSource}
                              setSelectedSource={setSelectedCommissionSource}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end mt-8 me-8">
                          <Button
                            color={'primary'}
                            startContent={<SaveIcon />}
                            className="text-white font-bold"
                            onPress={handleSubmitClick}
                            isDisabled={!allFormsValid}
                          >
                            {`บันทึกการตั้งค่า`}
                          </Button>
                        </div>
                      </div>
                  }
                </div>
              </>
            )}

          </div>
        </CardBody>
      </Card>
      <AlertQuestion
        title={"ยืนยันการแก้ไขข้อมูล"}
        content={`คุณแน่ใจหรือไม่ว่าต้องการ${isCommissionEdit ? "แก้ไข" : "บันทึก"}ข้อมูล?`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => handleSubmit()}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        isLoading={isLoading}
      />
    </section>
  );
}

export default SetCommission;
