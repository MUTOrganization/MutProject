import React, { useState, useEffect } from "react";
import { ImageSlider } from "../../components/ImageSlider";
import { Button } from "@nextui-org/react";
import { SearchIcon } from "@/component/Icons";
import { HorizontalItemSection } from "./component/HorizontalItemSection";
import StudioHome from "./component/StudioHome";
import NewsContent from "./component/NewsContent";
import { useLists } from "../Hopeful/utils/fetchData/fetchList";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const { lists, isLoading } = useLists();
  const [updatelist, setUpdatelist] = useState([]);

  useEffect(() => {
    // ถ้ามี lists อยู่
    if (lists && lists.length > 0) {
      // ทำการ map list แต่ละรายการ
      const filteredLists = lists.map((oneList) => {
        // กรองเฉพาะ groups ที่ group_status = 1 แล้วเรียงตาม group_date จากล่าสุดไปหาเก่าสุด
        const filteredGroups = (oneList.groups || [])
          .filter((group) => group.group_status === 1)
          .sort((a, b) => new Date(b.group_date) - new Date(a.group_date));

        // คืนค่า list เดิม แต่แทนที่ groups ด้วย filteredGroups
        return {
          ...oneList,
          groups: filteredGroups,
        };
      });

      // เซตค่า filteredLists ลงใน updatelist
      setUpdatelist(filteredLists);
    }
  }, [lists]);

  console.log(lists);

  const images = ["/img/product.jpg"];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="space-y-7">
        <section>
          <ImageSlider images={images} />
        </section>
        <div className="space-y-10 p-5">
          <section className="flex md:flex-row flex-col md:justify-between justify-center">
            <div className="flex md:flex-row flex-col px-10 justify-center items-center md:justify-between space-x-5 mb-5">
              <div>
                <h1 className="font-prompt md:text-6xl text-center text-3xl ">
                  Hopeful Content
                </h1>
              </div>
              <div>
                <Button
                  onPress={() => navigate("/content-studio")}
                  className="w-full sm:w-auto bg-black text-white text-lg font-medium px-6 py-3 "
                >
                  เข้าชมห้องสตูดิโอ
                </Button>
              </div>
            </div>
            {/* <div className="md:w-[340px] px-8 rounded-2xl flex justify-center items-center">
              <Input
                classNames={{
                  label: "text-black/50 dark:text-white/90",
                  input: [
                    "bg-transparent",
                    "text-black/90 dark:text-white/90",
                    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                  ],
                  innerWrapper: "bg-transparent",
                  inputWrapper: [
                    "shadow-xl",
                    "bg-default-200/50",
                    "dark:bg-default/60",
                    "backdrop-blur-xl",
                    "backdrop-saturate-200",
                    "hover:bg-default-200/70",
                    "dark:hover:bg-default/70",
                    "group-data-[focus=true]:bg-default-200/50",
                    "dark:group-data-[focus=true]:bg-default/60",
                    "!cursor-text",
                  ],
                }}
                placeholder="ค้นหา"
                radius="sm"
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">
                      <SearchIcon className="text-black/50 mb-0.5 pointer-events-none flex-shrink-0" />
                    </span>
                  </div>
                }
              />
            </div> */}
          </section>
          <section className="flex justify-center">
            <div className="max-w-full">
              {updatelist.map((list) => {
                // ถ้า list ไม่มี groups หรือ groups เป็น array ว่าง อาจข้ามไป
                if (!list.groups || list.groups.length === 0) return null;

                return (
                  <section className="flex justify-start" key={list.list_id}>
                    <div className="max-w-full ">
                      <HorizontalItemSection
                        title={list.list_name}
                        linkAllText="ทั้งหมด"
                        linkAllUrl={`/content-hopeful/list/${list.list_id}`}
                        items={list.groups} // <-- ส่ง array ของ group object ตรง ๆ
                        list_id={list.list_id}
                      />
                    </div>
                  </section>
                );
              })}
            </div>
          </section>
          {/* Studio */}
          <section className="flex justify-center">
            <div className="max-w-full">
              <StudioHome />
            </div>
          </section>
          {/* News */}
          <section className="w-full md:flex md:justify-center">
            <NewsContent />
          </section>
        </div>
      </div>
    </>
  );
}

export default Home;
