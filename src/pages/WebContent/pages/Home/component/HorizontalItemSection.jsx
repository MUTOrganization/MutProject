import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@nextui-org/react";

/**
 * @param {Object} props
 * @param {string} props.title - ข้อความหัวข้อ Section
 * @param {string} props.linkAllText - ข้อความลิงก์ "ทั้งหมด" หรืออื่นๆ
 * @param {string} props.linkAllUrl - URL สำหรับลิงก์ "ทั้งหมด"
 * @param {Array}  props.items - อาเรย์ของ group object ที่ต้องการแสดง
 *   เช่น [{ group_id, list_id, group_image, group_name }, ...]
 */
export function HorizontalItemSection({
  title = "โฆษณา",
  linkAllText = "ทั้งหมด",
  linkAllUrl = "#",
  items = [],
  list_id,
}) {
  const navigate = useNavigate();

  // ตัด items ให้เหลือแค่ 4 ชิ้น
  const limitedItems = items.slice(0, 4);

  return (
    <div className="w-full mb-6">
      {/* ส่วนหัวข้อและลิงก์ "ทั้งหมด" */}
      <div className="flex items-center justify-between mb-2">
        <a href={linkAllUrl} className="font-bold text-lg hover:text-xl">
          {title}
        </a>
        <a href={linkAllUrl} className="text-blue-500 hover:underline text-sm">
          {linkAllText}
        </a>
      </div>

      {/* Mobile Layout: Horizontal Scroll (md:hidden) */}
      <div className="md:hidden grid grid-flow-col auto-cols-[24rem] gap-5 overflow-x-auto">
        {limitedItems.map((group, idx) => (
          <Card
            isPressable
            key={idx}
            className="shrink-0 w-76 h-64 flex items-center justify-center rounded cursor-pointer "
            onPress={() =>
              navigate(
                `/content-hopeful/list/${list_id}/group/${group.group_id}`
              )
            }
          >
            {group.group_image ? (
              <img
                src={group.group_image}
                alt={group.group_name}
                className="object-cover w-full h-full rounded"
              />
            ) : (
              <div className="text-white">No Image</div>
            )}
          </Card>
        ))}
      </div>
      
      <div className="hidden md:flex gap-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 ">
          {limitedItems.map((group, idx) => (
            <Card
            shadow="sm"
              key={idx}
              isPressable
              className=" flex items-center justify-center rounded cursor-pointer h-72 h md:w-[400px]"
              onPress={() =>
                navigate(
                  `/content-hopeful/list/${list_id}/group/${group.group_id}`
                )
              }
            >
              {group.group_image ? (
                <img
                  src={group.group_image}
                  alt={group.group_name}
                  className="object-cover w-full h-full rounded"
                />
              ) : (
                <div className="text-white">No Image</div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
