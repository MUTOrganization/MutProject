import React, { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardBody, Select, SelectItem, Checkbox, Input, Button, Textarea, Tooltip, Chip, Tabs, Tab, Divider, RadioGroup, Radio } from "@nextui-org/react";
import { useAppContext } from "../../../../contexts/AppContext";
import { toastSuccess, toastWarning, AlertQuestion, toastError } from '../../../../component/Alert'
import { URLS } from "../../../../config";
import fetchProtectedData from "../../../../../utils/fetchData";
import lodash from 'lodash';
import SetCommissionTab from "./SetCommissionTab";
import { SaveIcon } from "lucide-react";

function SetCommission({ departmentData, depLoading }) {
  const { currentUser } = useAppContext();
  const [isExtraChecked, setIsExtraChecked] = useState(false);
  const [isGeneralChecked, setIsGeneralChecked] = useState(true);
  /** @type {[[{ id: Number, minAmount: Number, maxAmount: Number, percentage: String }]]} */
  const [formsCommission, setFormsCommission] = useState([{ id: 0, minAmount: 0, maxAmount: 1, percentage: 0 }]);
  /** @type {[[{ id: Number, minAmount: Number, maxAmount: Number, baht: String }]]} */
  const [formsIncentive, setFormsIncentive] = useState([{ id: 0, minAmount: 0, maxAmount: 1, baht: 0 }]);
  const [selectedDepartment, setSelectedDepartments] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [passedProb, setPassedProb] = useState('')

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [oldCommissionSetting, setOldCommissionSetting] = useState(null);
  const [oldIncentiveSetting, setOldIncentiveSetting] = useState(null);

  const [isCommissionEdit, setIsCommissionEdit] = useState(false);
  const [isIncentiveEdit, setIsIncentiveEdit] = useState(false);

  const [formPercentageValidate, setFormPercentageValidate] = useState([]);
  const [formIncentiveValidate, setFormIncentiveValidate] = useState([]);

  const [selectedCommissionSource, setSelectedCommissionSource] = useState('SALE');
  const [selectedIncentiveSource, setSelectedIncentiveSource] = useState('SALE');

  const [tabActive, setTabActive] = useState('commission');

  const allFormsValid = useMemo(() => {
    return formPercentageValidate.every(form => form.maxCurrent == false) && formIncentiveValidate.every(form => form.maxCurrent == false)
  }, [formPercentageValidate, formIncentiveValidate])

  useEffect(() => {
    setIsLoading(depLoading);
  }, [depLoading])

  const handleSelectedDepartment = (id) => {
    const findDep = departmentData.find(e => e.id == id)
    if (findDep) {
      setSelectedDepartments(findDep)
    }
    setSelectedRole(null);
  }

  const handleSelectedRole = (id) => {
    const findRole = selectedDepartment.roles.find(e => e.id == id)
    if (findRole) {
      setSelectedRole(findRole)
    }
  }

  // useEffect(() => {
  //   if (passedProb === '') {
  //     resetFormState();
  //   } else if (selectedDepartment && selectedRole && passedProb) {
  //     fetchCommissionData();
  //   }
  // }, [selectedDepartment, selectedRole, passedProb]);

  const resetFormState = () => {
    setIsCommissionEdit(false);
    setIsIncentiveEdit(false);
    setSelectedCommissionSource('SALE');
    setSelectedIncentiveSource('SALE');
    setOldCommissionSetting(null);
    setOldIncentiveSetting(null);
  };
  const clearForms = () => {
    setFormsCommission([{ id: 0, minAmount: 0, maxAmount: 1, percentage: 0 }]);
    setFormsIncentive([{ id: 0, minAmount: 0, maxAmount: 1, baht: 0 }]);
  }
  const clearValidation = () => {
    setFormPercentageValidate([]);
    setFormIncentiveValidate([]);
  }
  useEffect(() => {
    fetchCommissionSettingData();
  }, [selectedDepartment, selectedRole, passedProb]);

  const fetchCommissionSettingData = async (specific) => {
    if (specific == 'commission') {
      setIsCommissionEdit(false);
      setSelectedCommissionSource('SALE');
      setOldCommissionSetting(null);
      setFormsCommission([{ id: 0, minAmount: 0, maxAmount: 1, percentage: 0 }]);
      setFormPercentageValidate([]);
    }
    if (specific == 'incentive') {
      setIsIncentiveEdit(false);
      setSelectedIncentiveSource('SALE');
      setOldIncentiveSetting(null);
      setFormsIncentive([{ id: 0, minAmount: 0, maxAmount: 1, baht: 0 }]);
      setFormIncentiveValidate([]);

    }
    if (!specific) {
      clearValidation();
      clearForms()
      resetFormState();
    }


    if (!selectedDepartment || !selectedRole || passedProb === '') {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetchProtectedData.post(`${URLS.setting.getCommission}`, {
        roleId: selectedRole.id,
        prob_status: passedProb,
      });

      const commissionSetting = response.data.find(e => e.is_incentive == 0)
      const incentiveSetting = response.data.find(e => e.is_incentive == 1)
      if (commissionSetting) {
        setOldCommissionSetting(commissionSetting);
        const tierList = commissionSetting.tier_list;
        setFormsCommission(tierList.percentage.map((tier, index) => ({
          id: index,
          minAmount: tier.minAmount,
          maxAmount: tier.maxAmount,
          percentage: tier.percentage,
        })));
        setSelectedCommissionSource(commissionSetting.type);
        setIsCommissionEdit(true);
      }
      if (incentiveSetting) {
        setOldIncentiveSetting(incentiveSetting);
        const tierList = incentiveSetting.tier_list;
        setFormsIncentive(tierList.baht.map((tier, index) => ({
          id: index,
          minAmount: tier.minAmount,
          maxAmount: tier.maxAmount,
          baht: tier.baht,
        })));
        setSelectedIncentiveSource(incentiveSetting.type);
        setIsIncentiveEdit(true);
      }
    } catch (error) {
      console.error('Error fetching commission data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleValidateForm(formsCommission, 'percentage')
  }, [formsCommission])

  useEffect(() => {
    handleValidateForm(formsIncentive, 'baht')
  }, [formsIncentive])


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
    type === 'percentage' ? setFormPercentageValidate(_formValidate) : setFormIncentiveValidate(_formValidate)
  }

  

  const saveSetting = async (type) => {
    const tierList = type === 'commission'
      ? { percentage: formsCommission.map((e, index) => index === formsCommission.length - 1 ? { ...e, maxAmount: "9999999999999" } : e) }
      : { baht: formsIncentive.map((e, index) => index === formsIncentive.length - 1 ? { ...e, maxAmount: "9999999999999" } : e) };

    const selectedSource = type === 'commission' ? selectedCommissionSource : selectedIncentiveSource;
    const oldSetting = type === 'commission' ? oldCommissionSetting : oldIncentiveSetting;
    const isEdit = type === 'commission' ? isCommissionEdit : isIncentiveEdit;

    const payload = {
      department: selectedDepartment.name,
      ownerId: currentUser.businessId,
      roleId: selectedRole.id,
      role: selectedRole.name,
      prob: passedProb,
      tier_list: tierList,
      isIncentive: type === 'commission' ? '0' : '1',
      type: selectedSource
    };
    if (isEdit && oldSetting) {
      const id = oldSetting.id;
      await fetchProtectedData.put(`${URLS.setting.updateCommission}/${id}`, { tier_list: tierList, type: selectedSource });
    } else {
      await fetchProtectedData.post(`${URLS.setting.addCommission}`, payload)
    }
  };

  const handleSubmitClick = (type) => {
    setIsModalOpen(true);
  }

  const handleSubmit = async () => {
    try {
      await Promise.all([saveSetting('commission'), saveSetting('incentive')]);
      fetchCommissionSettingData();
      toastSuccess('บันทึกข้อมูลสำเร็จ');
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error ใน handleSubmit", err);
      toastError('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  }
  const isEdited = tabActive === 'commission' ? isCommissionEdit : isIncentiveEdit;
  return (
    <section className="w-full">
      <Card className="flex p-4" shadow="none" radius="sm">
        <CardHeader className="flex justify-between">
          <div className="text-base font-bold">การตั้งค่า Commission</div>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-4">
            {/* Section */}
            {/* <div className="flex flex-wrap items-center md:flex-nowrap gap-8">
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
            </div> */}
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
                          selectedKeys={selectedDepartment ? [String(selectedDepartment?.id)] : []}
                          isLoading={isLoading}
                          onChange={(event) => handleSelectedDepartment(event.target.value)}
                          scrollShadowProps={{
                            isEnabled: false
                          }}
                          disallowEmptySelection
                        >
                          {departmentData.map((dep, index) =>
                            <SelectItem key={String(dep.id)}
                              endContent={dep.isHq == 1 && <Chip color="warning" variant="flat">สำนักงานใหญ่</Chip>}
                              value={dep.name}
                            >
                              {dep.name}
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
                          selectedKeys={selectedRole ? [String(selectedRole?.id)] : []}
                          onChange={(e) => handleSelectedRole(e.target.value)}
                          scrollShadowProps={{
                            isEnabled: false
                          }}
                          disallowEmptySelection
                          isDisabled={!selectedDepartment}
                        >
                          {selectedDepartment ?
                            selectedDepartment.roles.map((role) =>
                              <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
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
                      <div className="flex ms-10 mt-6 font-bold">กรุณาเลือกตำแหน่ง</div>
                      :
                      <div>
                        <Divider className="mt-4" />
                        <div className="mt-4">
                          <Tabs variant="underlined" color="primary"
                            onSelectionChange={(key) => setTabActive(key)}
                            selectedKey={tabActive}
                          >
                            <Tab key="commission" title="commission"></Tab>
                            <Tab key="incentive" title="incentive"></Tab>
                          </Tabs>
                          <div className="my-4 px-4">
                            {
                              tabActive === 'commission' ?
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
                                :
                                <SetCommissionTab
                                  type={'incentive'}
                                  forms={formsIncentive}
                                  setForm={setFormsIncentive}
                                  formValidate={formIncentiveValidate}
                                  selectedData={{
                                    department: selectedDepartment,
                                    role: selectedRole,
                                    passedProb: passedProb
                                  }}
                                  selectedSource={selectedIncentiveSource}
                                  setSelectedSource={setSelectedIncentiveSource}
                                />
                            }
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
            {/* {isExtraChecked && (
              <div className="flex flex-col gap-2">
                <h3 className="text-md font-bold mb-2">รายละเอียด</h3>
                <div className="flex items-center gap-4">
                  <p className="text-start text-sm">
                    เป็นการให้ค่าตอบแทนพนักงานแบบรายเดือนโดยใช้นโยบายค่าคอมมิชชัน คำนวณค่าคอมมิชชันมีตัวชี้วัด 2 รูปแบบ คือ 1. จำนวน คือ พนักงานทำงานตามที่กำหนดได้ ครบจำนวน จะได้ค่าตอบแทนที่มากของจำนวนเงินนั้น เช่น ทำงานครบตั้งแต่ 1 - 50 จำนวน จะได้รับ 100 บาท 2. บาท คือ พนักงานทำงานครบตามจำนวนเงินที่กำหนดจะได้รับค่าตอบแทนเป็นบาท เช่น ขายของได้ 10,000 บาท จะได้รับเงิน 100 บาท หากมีข้อสงสัยสามารถติดต่อทีมงาน HOPEFUL-CRM เพื่สอบถามรายละเอียดเพิ่มเติม
                  </p>
                </div>
                <div className="text-start text-sm mt-2">
                  <Textarea
                    variant="bordered"
                    placeholder="กรุณาเขียนเงื่อนไขที่ต้องการจะใช้ในการคำนวณ"
                    disableAnimation
                    disableAutosize
                    classNames={{
                      input: "resize-y min-h-[40px]",
                    }}
                    isDisabled
                  />
                </div>
                <div className="flex justify-end">
                    <Button
                        color="primary"
                        className="text-white font-bold"
                        onPress={() => setIsModalOpen(true)}
                        isDisabled={!allFormsValid}
                    >
                        {isEdit ? 'แก้ไขข้อมูล' : 'บันทึกข้อมูล'}
                    </Button>
                </div>
                <div className="flex justify-end">
                  <Button
                    color="primary"
                    className="text-white font-bold"
                    onPress={() => setIsModalOpen(true)}
                    disabled={!selectedDepartment || !selectedRole || (!isPercentageChecked && !isBahtChecked)}
                  >
                    {isEdit ? 'แก้ไขข้อมูล' : 'บันทึกข้อมูล'}
                  </Button>
                </div>
              </div>
            )} */}
            

          </div>
        </CardBody>
      </Card>
      <AlertQuestion
        title={tabActive === 'commission' ? "ยืนยันการแก้ไขข้อมูล" : "ยืนยันการบันทึกข้อมูล"}
        content={`คุณแน่ใจหรือไม่ว่าต้องการ${isEdited ? "แก้ไข" : "บันทึก"}ข้อมูล?`}
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
