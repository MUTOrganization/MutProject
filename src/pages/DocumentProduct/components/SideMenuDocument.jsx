import React, { useState, useEffect } from "react";

import {
  Card,
  Accordion,
  AccordionItem,
  Button,
  Input,
  Tooltip,
  Chip,
  Switch,
} from "@nextui-org/react";
import {
  toastError,
  toastSuccess,
  toastWarning,
} from "../../../component/Alert";
import {
  EditIcon,
  DeleteIcon,
  UpIcon,
  DownIcon,
  PlusIcon,
  DotIcon,
  SaveAsIcon,
} from "../../../component/Icons";
import fetchProtectedData from "../../../../utils/fetchData";
import { URLS } from "../../../config";
import { ACCESS } from "../../../configs/access";
import { useAppContext } from "../../../contexts/AppContext";

function SideMenuDocument({
  menuList,
  setMenuList,
  onSubtopicClick,
  activeSubtopic,
  activeHeading,
  user,
  fetchMenuList,
}) {
  const currentData = useAppContext();
  const [editMode, setEditMode] = useState(false);
  const [newHeading, setNewHeading] = useState("");
  const [newSubtopic, setNewSubtopic] = useState("");
  const [editingHeading, setEditingHeading] = useState(null);
  const [editingSubtopic, setEditingSubtopic] = useState({
    heading: null,
    subtopic: null,
  });
  const [expandedHeading, setExpandedHeading] = useState(null);

  useEffect(() => {
    if (menuList.length > 0 && !expandedHeading) {
      setExpandedHeading(menuList[0].topic_id);
    }
  }, [menuList, expandedHeading]);

  useEffect(() => {
    if (expandedHeading) {
      document
        .getElementById(expandedHeading)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [expandedHeading]);

  // Add a new main topic (heading)
  const addHeading = async () => {
    if (!newHeading.trim()) {
      toastError("ชื่อหัวข้อหลักไม่สามารถว่างได้!");
      return;
    }

    const newHeadingObject = {
      topic: newHeading,
      order: menuList.length + 1,
    };

    try {
      const response = await fetchProtectedData.post(
        `${URLS.DOCUMENTPRODUCT}/add-Topic`,
        newHeadingObject
      );

      if (response.status === 200 || response.status === 201) {
        toastSuccess(`หัวข้อหลัก "${newHeadingObject.topic}" ถูกเพิ่มสำเร็จ!`);
        fetchMenuList(); // เรียก fetchMenuList เพื่อดึงข้อมูลใหม่
        setNewHeading("");
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error adding new heading:", error);
      toastError("เกิดข้อผิดพลาดในการเพิ่มหัวข้อหลัก");
    }
  };

  const addSubtopic = async (headingId, subtopicTitle) => {
    if (!subtopicTitle.trim()) {
      toastError("ชื่อหัวข้อย่อยไม่สามารถว่างได้!");
      return;
    }

    try {
      const targetHeading = menuList.find(
        (heading) => heading.topic_id === headingId
      );
      if (!targetHeading) {
        toastError("ไม่พบหัวข้อหลักที่เลือก!");
        return;
      }

      // Check for duplicate subtopicTitle
      if (Object.keys(targetHeading.subtopics).includes(subtopicTitle)) {
        toastError("ชื่อหัวข้อย่อยนี้มีอยู่แล้ว!");
        return;
      }

      const formData = new FormData();
      formData.append("document_product_id", headingId);
      formData.append("head_subtopic", subtopicTitle);
      formData.append("content", "");
      formData.append("order", Object.keys(targetHeading.subtopics).length + 1);

      formData.append(
        "author",
        JSON.stringify({
          name: user.name || "",
          businessName: user.businessName || "",
          nickname: user.nickname || "",
          bio: "",
          profileImage: user.displayImgUrl || "",
          businessId: user.businessId,
        })
      );

      const response = await fetchProtectedData.post(
        `${URLS.DOCUMENTPRODUCT}/add-SubTopic`,
        formData
      );

      if (response.status === 200 || response.status === 201) {
        fetchMenuList();

        toastSuccess(`หัวข้อย่อย "${subtopicTitle}" ถูกสร้างสำเร็จ!`);
        setNewSubtopic(""); // Clear input after addition
      } else {
        console.error("Unexpected response status:", response.status);
        toastError("ไม่สามารถเพิ่มหัวข้อย่อยได้");
      }
    } catch (error) {
      console.error("Error adding new subtopic:", error);
      toastError("เกิดข้อผิดพลาดในการเพิ่มหัวข้อย่อย");
    }
  };

  // Delete a heading
  const deleteHeading = async (topicId) => {
    try {
      // Send a DELETE request to the server with topicId as a query parameter
      const response = await fetchProtectedData.delete(
        `${URLS.DOCUMENTPRODUCT}/delete-Topic?topicId=${topicId}`
      );

      if (response.status === 200 || response.status === 204) {
        fetchMenuList();

        toastSuccess(`หัวข้อหลักถูกลบสำเร็จ!`);
      } else {
        console.error("Unexpected response status:", response.status);
        toastError("ไม่สามารถลบหัวข้อหลักได้");
      }
    } catch (error) {
      console.error("Error deleting heading:", error);
      toastError("เกิดข้อผิดพลาดในการลบหัวข้อหลัก");
    }
  };

  // Delete a subtopic
  const deleteSubtopic = async (subtopicId) => {
    try {
      // เรียก API เพื่อลบหัวข้อย่อย
      const response = await fetchProtectedData.delete(
        `${URLS.DOCUMENTPRODUCT}/delete-SubTopic?subtopicId=${subtopicId}`
      );

      if (response.status === 200) {
        // อัปเดต State menuList หลังจากลบสำเร็จ
        fetchMenuList();

        toastSuccess(`หัวข้อย่อยถูกลบสำเร็จ!`);
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error deleting subtopic:", error);
      toastError("เกิดข้อผิดพลาดในการลบหัวข้อย่อย");
    }
  };

  // Edit a heading
  const editHeading = async (headingId, newTitle) => {
    if (!newTitle.trim()) {
      toastError("ชื่อหัวข้อหลักไม่สามารถว่างได้!"); // Notify for empty input
      return;
    }

    try {
      // Prepare the API request body
      const body = {
        topicId: headingId,
        topic: newTitle,
      };

      // Send the request to update the topic
      const response = await fetchProtectedData.put(
        `${URLS.DOCUMENTPRODUCT}/update-Topic`,
        body
      );

      if (response.status === 200) {
        fetchMenuList();
        toastSuccess(`หัวข้อหลัก "${newTitle}" ถูกแก้ไขสำเร็จ!`);
        setEditingHeading(null); // Exit edit mode
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating topic:", error);
      toastError("เกิดข้อผิดพลาดในการแก้ไขหัวข้อหลัก");
    }
  };

  const handleStatusToggle = async (headingId, newStatus) => {
    // ตรวจสอบว่า ID ของหัวข้อมีค่าหรือไม่
    if (!headingId) {
      toastError("ไม่พบ ID ของหัวข้อหลัก!"); // แจ้งเตือนเมื่อไม่มี ID
      return;
    }
    try {
      const statusValue = newStatus ? 1 : 0;
      const payload = {
        status: statusValue,
        topicId: headingId,
      };
      const response = await fetchProtectedData.put(
        `${URLS.DOCUMENTPRODUCT}/update-Topic`,
        payload
      );
      if (response.status === 200) {
        fetchMenuList();
        const action = newStatus ? "เปิด" : "ปิด";
        toastSuccess(`หัวข้อถูก ${action} เรียบร้อย`);
        setEditingHeading(null);
      } else {
        toastError(`เกิดข้อผิดพลาด: สถานะตอบกลับ ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating topic:", error);
      toastError("เกิดข้อผิดพลาดในการแก้ไขหัวข้อหลัก");
    }
  };

  // Edit a subtopic
  const editSubtopic = async (heading, oldSubtopic, newSubtopic) => {
    // Validate the new subtopic name
    if (!newSubtopic.trim()) {
      toastError("ชื่อหัวข้อย่อยไม่สามารถว่างได้!");
      return;
    }

    const targetHeading = menuList.find((item) => item.topic === heading.topic);

    // Validate the target heading exists
    if (!targetHeading) {
      toastError("ไม่พบหัวข้อหลักที่ต้องการแก้ไข!");
      return;
    }

    const { subtopics } = targetHeading;
    const targetSubtopic = Object.entries(subtopics).find(
      ([key]) => key === oldSubtopic
    );

    // Validate the target subtopic exists
    if (!targetSubtopic) {
      toastError("ไม่พบหัวข้อย่อยที่ต้องการแก้ไข!");
      return;
    }

    const subtopicId = targetSubtopic[1]?.subtopic_id;

    // Validate new subtopic name does not already exist
    if (subtopics[newSubtopic] && oldSubtopic !== newSubtopic) {
      toastError("ชื่อหัวข้อย่อยนี้มีอยู่แล้ว!");
      return;
    }

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append("subtopic_id", subtopicId);
      formData.append("head_subtopic", newSubtopic);

      // Send the API request
      const response = await fetchProtectedData.put(
        `${URLS.DOCUMENTPRODUCT}/update-SubTopic`,
        formData
      );

      if (response.status === 200) {
        // Update the local state
        fetchMenuList();

        toastSuccess(
          `หัวข้อย่อย "${oldSubtopic}" ถูกแก้ไขเป็น "${newSubtopic}" สำเร็จ!`
        );
        setEditingSubtopic({ heading: null, subtopic: null }); // Exit edit mode
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error updating subtopic:", error);
      toastError("เกิดข้อผิดพลาดในการแก้ไขหัวข้อย่อย");
    }
  };

  const moveHeading = async (index, direction) => {
    setMenuList((prev) => {
      const newMenuList = [...prev];
      const targetIndex = index + direction;

      // ตรวจสอบว่าดัชนีเป้าหมายอยู่ในขอบเขต
      if (targetIndex >= 0 && targetIndex < newMenuList.length) {
        // สลับตำแหน่งใน UI
        [newMenuList[index], newMenuList[targetIndex]] = [
          newMenuList[targetIndex],
          newMenuList[index],
        ];

        // อัปเดต `order` ใน State
        newMenuList[index].order = index + 1;
        newMenuList[targetIndex].order = targetIndex + 1;

        // ส่งคำขออัปเดต order ไปยัง API สำหรับหัวข้อที่มีการเปลี่ยนแปลง
        const updateOrders = async () => {
          try {
            // อัปเดต order ของหัวข้อแรก
            await fetchProtectedData.put(
              `${URLS.DOCUMENTPRODUCT}/update-Topic`,
              {
                topicId: newMenuList[index].topic_id,
                order: newMenuList[index].order,
              }
            );

            // อัปเดต order ของหัวข้อที่ถูกสลับ
            await fetchProtectedData.put(
              `${URLS.DOCUMENTPRODUCT}/update-Topic`,
              {
                topicId: newMenuList[targetIndex].topic_id,
                order: newMenuList[targetIndex].order,
              }
            );

            toastSuccess("ลำดับหัวข้อถูกอัปเดตสำเร็จ!");
          } catch (error) {
            console.error("Error updating topic order:", error);
            toastError("เกิดข้อผิดพลาดในการอัปเดตลำดับหัวข้อ");
          }
        };

        updateOrders();
      }

      return newMenuList.sort((a, b) => a.order - b.order); // เรียงลำดับใหม่ตาม `order`
    });
  };

  const moveSubtopic = async (heading, index, direction) => {
    setMenuList((prevMenuList) => {
      const updatedMenuList = [...prevMenuList];
      const targetHeading = updatedMenuList.find(
        (item) => item.topic === heading.topic
      );

      if (!targetHeading) {
        toastError("ไม่พบหัวข้อหลักที่ต้องการจัดเรียง!");
        return prevMenuList;
      }

      const subtopicsArray = Object.entries(targetHeading.subtopics);

      // ตรวจสอบว่าดัชนีเป้าหมายอยู่ในขอบเขต
      const targetIndex = index + direction;
      if (targetIndex >= 0 && targetIndex < subtopicsArray.length) {
        // สลับตำแหน่งหัวข้อย่อยใน UI
        [subtopicsArray[index], subtopicsArray[targetIndex]] = [
          subtopicsArray[targetIndex],
          subtopicsArray[index],
        ];

        // อัปเดต `order` ใน State
        subtopicsArray.forEach(([key, value], i) => {
          value.order = i + 1;
        });

        // แปลงกลับเป็น Object และอัปเดตใน State
        targetHeading.subtopics = Object.fromEntries(subtopicsArray);
      }

      return updatedMenuList;
    });

    try {
      // ส่งคำขอไปยัง API เพื่ออัปเดตลำดับ
      const updatedSubtopics = Object.entries(heading.subtopics);
      for (const [_, subtopic] of updatedSubtopics) {
        const formData = new FormData();
        formData.append("subtopic_id", subtopic.subtopic_id);
        formData.append("order", subtopic.order);

        const response = await fetchProtectedData.put(
          `${URLS.DOCUMENTPRODUCT}/update-SubTopic`,
          formData
        );

        if (response.status !== 200) {
          throw new Error(
            `Error updating subtopic ID: ${subtopic.subtopic_id}`
          );
        }
      }

      toastSuccess("ลำดับหัวข้อย่อยถูกอัปเดตสำเร็จ!");
    } catch (error) {
      console.error("Error updating subtopic order:", error);
      toastError("เกิดข้อผิดพลาดในการอัปเดตลำดับหัวข้อย่อย");
    }
  };

  // Render subtopics
  const renderSubtopics = (heading, subtopics) => {
    const subtopicEntries = Object.entries(subtopics);

    return (
      <>
        {subtopicEntries.map(([subtopicKey, subtopicValue], index) => (
          <li
            key={subtopicValue.subtopic_id || subtopicKey}
            className="mb-2 flex items-center"
          >
            {/* Subtopic Name */}
            {editMode &&
              editingSubtopic.heading === heading.topic &&
              editingSubtopic.subtopic === subtopicKey ? (
              <Input
                defaultValue={subtopicValue.head_subtopic || subtopicKey}
                onBlur={(e) => {
                  const newSubtopic = e.target.value.trim();
                  if (newSubtopic) {
                    editSubtopic(heading, subtopicKey, newSubtopic); // Call editSubtopic with new name
                  } else {
                    toastError("ชื่อหัวข้อย่อยไม่สามารถว่างได้!");
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const newSubtopic = e.target.value.trim();
                    if (newSubtopic) {
                      editSubtopic(heading, subtopicKey, newSubtopic); // Call editSubtopic with new name
                    } else {
                      toastError("ชื่อหัวข้อย่อยไม่สามารถว่างได้!");
                    }
                  }
                }}
                autoFocus
                className="mr-2"
              />
            ) : (
              <span
                onClick={() => {
                  if (!editMode) {
                    onSubtopicClick(
                      heading.topic,
                      subtopicKey,
                      subtopicValue.content
                    ); // Pass subtopic details to parent
                  } else {
                    setEditingSubtopic({
                      heading: heading.topic,
                      subtopic: subtopicKey,
                    }); // Enter edit mode
                  }
                }}
                className={`cursor-pointer flex-grow ${!editMode &&
                    activeSubtopic === subtopicKey &&
                    activeHeading === heading.topic
                    ? "text-primary font-bold"
                    : "text-gray-500 hover:text-black"
                  }`}
              >
                <div className="flex items-center space-x-3 ml-3">
                  <DotIcon />
                  <span>{subtopicValue.head_subtopic || subtopicKey}</span>
                </div>
              </span>
            )}

            {/* Action Buttons */}
            {editMode && (
              <>
                {/* Move Up */}
                <UpIcon
                  className="ml-2 hover:cursor-pointer w-3 h-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSubtopic(heading, index, -1);
                  }}
                  disabled={index === 0}
                />
                {/* Move Down */}
                <DownIcon
                  className="ml-2 hover:cursor-pointer w-3 h-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSubtopic(heading, index, 1);
                  }}
                  disabled={index === subtopicEntries.length - 1}
                />
                {/* Delete */}
                <Tooltip content="Delete Subtopic">
                  <DeleteIcon
                    className="ml-2 hover:cursor-pointer hover:text-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSubtopic(subtopicValue.subtopic_id);
                    }}
                  />
                </Tooltip>
              </>
            )}
          </li>
        ))}
        {editMode && (
          <li className="mt-4 flex items-center">
            <Input
              placeholder="เพิ่มชื่อเรื่องใหม่"
              value={newSubtopic}
              onChange={(e) => setNewSubtopic(e.target.value)}
              className="mr-2"
              variant="underlined"
              size="sm"
            />
            <Tooltip content="เพิ่มชื่อเรื่อง" className="text-green-500">
              <span>
                <PlusIcon
                  onClick={() => {
                    if (!newSubtopic.trim()) {
                      toastError("ชื่อหัวข้อย่อยไม่สามารถว่างได้!");
                      return;
                    }
                    const headingTitle = heading.topic_id; // Get the heading title
                    const subtopicTitle = newSubtopic; // Get the input value for the new subtopic

                    addSubtopic(headingTitle, subtopicTitle); // Call the function
                    setNewSubtopic(""); // Clear the input after addition
                  }}
                  className="hover:cursor-pointer hover:text-green-500"
                >
                  เพิ่ม
                </PlusIcon>
              </span>
            </Tooltip>
          </li>
        )}
      </>
    );
  };
  console.log(menuList);

  // Render main topics
  const renderHeadings = () => {
    return menuList.map((heading, index) => (
      <AccordionItem
        key={heading.topic_id}
        aria-label={`${heading.topic} Menu`}
        title={
          editMode && editingHeading === heading.topic_id ? (
            <Input
              variant="bordered"
              defaultValue={heading.topic}
              onBlur={(e) => {
                const newTitle = e.target.value.trim();
                if (newTitle) {
                  editHeading(heading.topic_id, newTitle); // Save the new title
                } else {
                  toastError("ชื่อหัวข้อหลักไม่สามารถว่างได้!");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const newTitle = e.target.value.trim();
                  if (newTitle) {
                    editHeading(heading.topic_id, newTitle); // Save the new title on Enter
                  } else {
                    toastError("ชื่อหัวข้อหลักไม่สามารถว่างได้!");
                  }
                }
              }}
              autoFocus
              className="mr-2"
            />
          ) : (
            <div className="flex items-center justify-between">
              {/* Move Up and Down Icons - Positioned Before the Title */}
              {editMode && (
                <div className="flex items-center space-x-2">
                  <Tooltip content="เลื่อนหัวข้อขึ้น">
                    <span>
                      <UpIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          moveHeading(index, -1);
                        }}
                        disabled={index === 0}
                        className="hover:cursor-pointer w-3 h-3 hover:text-primary"
                      />
                    </span>
                  </Tooltip>
                  <Tooltip content="เลื่อนหัวข้อลง">
                    <span>
                      <DownIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          moveHeading(index, 1);
                        }}
                        disabled={index === menuList.length - 1}
                        className="hover:cursor-pointer w-3 h-3 hover:text-primary"
                      />
                    </span>
                  </Tooltip>
                </div>
              )}
              {/* Title */}
              <span className={`flex-grow text-left ${editMode ? "ml-4" : ""}`}>
                {heading.topic}
              </span>
              {heading.status === 0 && (
                <Chip
                  className="items-center text-white"
                  size="sm"
                  color="warning"
                >
                  ปรับปรุง
                </Chip>
              )}

              {/* Edit and Delete Icons - Positioned After the topic */}
              {editMode && (
                <div className="flex items-center space-x-2">
                  <Tooltip content="แก้ไขหัวข้อ">
                    <span>
                      <EditIcon
                        className="hover:cursor-pointer hover:text-warning"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent Accordion toggling
                          setEditingHeading(heading.topic_id); // Set the current heading to edit
                        }}
                      />
                    </span>
                  </Tooltip>
                  <Tooltip content="ลบหัวข้อ">
                    <span>
                      <DeleteIcon
                        className="hover:cursor-pointer hover:text-danger"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent Accordion toggling
                          deleteHeading(heading.topic_id); // Delete the heading
                        }}
                      />
                    </span>
                  </Tooltip>
                  <Tooltip content="เปิด / ปิด">
                    <span>
                      <>{console.log(heading.status === 1)}</>
                      <Switch
                        className="hover:cursor-pointer hover:text-danger"
                        size="sm"
                        isSelected={heading.status === 1} // แสดงสถานะปัจจุบัน
                        onChange={(e) => {
                          e.stopPropagation(); // ป้องกันการ toggle อื่น ๆ
                          handleStatusToggle(
                            heading.topic_id,
                            e.target.checked
                          ); // ส่ง ID และสถานะ (true/false)
                        }}
                      />
                    </span>
                  </Tooltip>
                </div>
              )}
            </div>
          )
        }
        expanded={editMode || expandedHeading === heading.topic_id} // Expand in edit mode or toggle on click
        onPress={() => {
          if (!editMode) {
            setExpandedHeading(
              expandedHeading === heading.topic_id ? null : heading.topic_id
            ); // Toggle expanded heading
          }
        }}
        isDisabled={
          heading.status === 0 &&
          !currentData.accessCheck.haveAny([
            ACCESS.document_product.edit_documents,
          ])
        }
      >
        <ul>{renderSubtopics(heading, heading.subtopics)}</ul>
      </AccordionItem>
    ));
  };

  return (
    <section
      className={`max-h-screen ${editMode ? `w-1/4` : `w-1/6`} overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}
    >
      <Card className="px-3 pt-4" shadow="none" radius="sm">
        {currentData.accessCheck.haveAny([
          ACCESS.document_product.edit_documents,
        ]) && (
            <div className="flex justify-between items-center pt-4 pr-4">
              <Chip color="success" variant="dot">
                <span className="text-xs font-light">
                  แอดมิน : {user.nickname || user.name}
                </span>
              </Chip>
              {editMode ? (
                <Tooltip content="บันทึก">
                  <span>
                    <SaveAsIcon
                      onClick={() => setEditMode((prev) => !prev)}
                      color={editMode ? "primary" : "secondary"}
                      className="hover:cursor-pointer hover:text-green-500"
                    />
                  </span>
                </Tooltip>
              ) : (
                <Tooltip content="แก้ไข">
                  <span>
                    <EditIcon
                      onClick={() => setEditMode((prev) => !prev)}
                      color={editMode ? "primary" : "secondary"}
                      className="hover:cursor-pointer hover:text-warning"
                    />
                  </span>
                </Tooltip>
              )}
            </div>
          )}
        <Accordion showDivider={false} className="w-full">
          {renderHeadings()}
        </Accordion>
        {editMode && (
          <div className="mt-4 flex items-center space-y-4 pb-6">
            <Input
              variant="underlined"
              placeholder="เพิ่มหัวข้อใหม่"
              value={newHeading}
              onChange={(e) => setNewHeading(e.target.value)}
              className="mr-2"
              size="sm"
            />
            <Tooltip content="เพิ่มหัวข้อ" className="text-green-500">
              <span>
                <PlusIcon
                  onClick={addHeading}
                  className="hover:cursor-pointer hover:text-green-500"
                >
                  Add Heading
                </PlusIcon>
              </span>
            </Tooltip>
          </div>
        )}
      </Card>
    </section>
  );
}

export default SideMenuDocument;
