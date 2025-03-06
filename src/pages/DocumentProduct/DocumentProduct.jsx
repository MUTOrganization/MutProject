import React, { useState, useEffect } from "react";
import fetchProtectedData from "../../../utils/fetchData";
import DefaultLayout from "../../layouts/default";
import SideMenuDocument from "./components/SideMenuDocument";
import ContentEditor from "./components/ContentEditor";
import Profile from "./components/Profile";
import { Card } from "@nextui-org/react";
import { useAppContext } from "../../contexts/AppContext";
import { URLS } from "../../config";

function DocumentProduct() {
  const user = useAppContext();
  const [profileData, setProfileData] = useState(null);
  const [menuList, setMenuList] = useState([]);
  const [activeHeading, setActiveHeading] = useState(null);
  const [activeSubtopic, setActiveSubtopic] = useState(null);
  const [activeContent, setActiveContent] = useState("");
  const [activeImages, setActiveImages] = useState([]);
  const [activeDetails, setActiveDetails] = useState([]);

  const fetchMenuList = async () => {
    try {
      const response = await fetchProtectedData.get(
        `${URLS.DOCUMENTPRODUCT}/get-ProductData`
      );
      if (response.status === 200) {
        const data = response.data;
  
        // Sort main topics
        const sortedTopics = data.sort((a, b) => a.order - b.order);
  
        // Sort subtopics within each topic
        const formattedTopics = sortedTopics.map((topic) => ({
          ...topic,
          subtopics: Object.entries(topic.subtopics || {})
            .sort(([, a], [, b]) => a.order - b.order)
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
        }));
  
        setMenuList(formattedTopics);
  
        // Preserve current subtopic if activeHeading and activeSubtopic are set
        if (activeHeading && activeSubtopic) {
          const heading = formattedTopics.find((item) => item.topic === activeHeading);
          const subtopic = heading?.subtopics[activeSubtopic];
  
          if (subtopic) {
            setActiveContent(subtopic.content || "");
            setActiveImages(subtopic.images || []);
            setActiveDetails(subtopic.details || []);
          }
        }
      } else {
        console.error(`Error fetching data: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching menu list:", error);
    }
  };
  console.log(menuList);
  
  // เรียกใช้ fetchMenuList ครั้งแรกเมื่อ component mount
  useEffect(() => {
    fetchMenuList();
  }, []);

  useEffect(() => {
    if (menuList.length > 0) {
      // ค้นหา Heading และ Subtopic แรก
      const firstHeading = menuList[0];
      const firstSubtopicKey = Object.keys(firstHeading.subtopics)[0]; // Subtopic key อันแรก

      // ตั้งค่า Active Heading และ Subtopic
      setActiveHeading(firstHeading.topic); // ชื่อ Heading แรก
      setActiveSubtopic(firstSubtopicKey || null); // ชื่อ Subtopic แรก (หรือ null ถ้าไม่มี Subtopic)

      // ตั้งค่าคอนเทนต์เริ่มต้น
      if (firstSubtopicKey) {
        const firstSubtopic = firstHeading.subtopics[firstSubtopicKey];
        setActiveContent(firstSubtopic?.content || ""); // คอนเทนต์ Subtopic
        setActiveImages(firstSubtopic?.images || []); // รูปภาพใน Subtopic
        setActiveDetails(firstSubtopic?.details || []); // รายละเอียดใน Subtopic
      } else {
        setActiveContent(""); // ไม่มี Subtopic ก็ตั้งเป็นค่าว่าง
        setActiveImages([]);
        setActiveDetails([]);
      }
    }
  }, [menuList]);

  useEffect(() => {
    if (menuList.length > 0 && !activeHeading) {
      const firstHeading = menuList[0];
      const firstSubtopic = Object.keys(firstHeading.subtopics)[0];

      setActiveHeading(firstHeading.topic);
      setActiveSubtopic(firstSubtopic || null);
      setActiveContent(
        firstSubtopic ? firstHeading.subtopics[firstSubtopic].content : ""
      );
      setActiveImages(
        firstSubtopic ? firstHeading.subtopics[firstSubtopic].images : []
      );
      setActiveDetails(
        firstSubtopic ? firstHeading.subtopics[firstSubtopic].details : []
      );
    }
  }, [menuList, activeHeading]);

  useEffect(() => {
    if (menuList.length > 0 && activeHeading && activeSubtopic) {
      const heading = menuList.find((item) => item.topic === activeHeading);
      const subtopic = heading?.subtopics[activeSubtopic];
  
      if (subtopic) {
        setActiveContent(subtopic.content || "");
        setActiveImages(subtopic.images || []);
        setActiveDetails(subtopic.details || []);
      }
    }
  }, [menuList, activeHeading, activeSubtopic]);
  
  

  

  useEffect(() => {
    if (activeHeading && activeSubtopic) {
      const heading = menuList.find((item) => item.topic === activeHeading);
      const subtopic = heading?.subtopics[activeSubtopic];
  
      if (subtopic) {
        // Get the last updated timestamp from subtopic
        const subtopicLastUpdated = new Date(subtopic.lastUpdated || 0);
  
        // Find the latest `lastDetailUpdated` in `subtopic.details`
        const latestDetailUpdated = subtopic.details?.reduce((latest, detail) => {
          const detailDate = new Date(detail.lastDetailUpdated);
          return detailDate > latest ? detailDate : latest;
        }, new Date(0)); // Default to epoch if no details exist
  
        // Compare the two timestamps
        const mostRecentTimestamp =
          subtopicLastUpdated > latestDetailUpdated
            ? subtopicLastUpdated
            : latestDetailUpdated;
  
        setProfileData({
          ...(subtopic.author || {}), // Include author if available
          lastUpdated: mostRecentTimestamp.toISOString(), // Use the most recent timestamp
        });
      } else {
        // If `subtopic` is undefined, set default profile data
        setProfileData({ lastUpdated: null });
      }
    }
  }, [activeHeading, activeSubtopic, menuList]);
  

  return (
    <section title="ข้อมูลสินค้า">
      <Card className="w-full min-h-full max-h-full flex overflow-hidden flex-row">
        <SideMenuDocument
          menuList={menuList}
          setMenuList={setMenuList}
          fetchMenuList={fetchMenuList}
          onSubtopicClick={(heading, subtopic, content) => {
            setActiveHeading(heading);
            setActiveSubtopic(subtopic);
            setActiveContent(content);
          }}
          activeHeading={activeHeading}
          activeSubtopic={activeSubtopic}
          user={user.currentUser}
        />
        <div className="flex-grow overflow-y-auto max-h-screen h-full p-4 w-2/3">
          <ContentEditor
            activeHeading={activeHeading}
            activeSubtopic={activeSubtopic}
            activeContent={activeContent}
            activeImages={activeImages}
            fetchMenuList={fetchMenuList}
            setActiveContent={setActiveContent}
            setActiveImages={setActiveImages}
            activeDetails={activeDetails}
            subtopicId={
              menuList.find((item) => item.topic === activeHeading)?.subtopics[
                activeSubtopic
              ]?.subtopic_id
            } // ดึง `subtopic_id` จาก menuList
          />
        </div>
        <div className="flex-grow overflow-y-auto max-h-screen h-full p-4 w-1/5">
          <Profile
            subtopicId={
              menuList.find((item) => item.topic === activeHeading)?.subtopics[
                activeSubtopic
              ]?.subtopic_id
            }
            profileData={profileData}
            fetchMenuList={fetchMenuList}
            activeHeading={activeHeading}
            activeSubtopic={activeSubtopic}
            menuList={menuList}
            user={user}
          />
        </div>
      </Card>
    </section>
  );
}

export default DocumentProduct;
