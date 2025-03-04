import React, { useState } from "react";
import { URLS } from "../../../config";
import { toastError, toastSuccess } from "../../../component/Alert";
import fetchProtectedData from "../../../../utils/fetchData";
import { EditIcon } from "../../../component/Icons";
import { Textarea } from "@nextui-org/input";
import { ACCESS } from "../../../configs/access";
import { useAppContext } from "../../../contexts/AppContext";

function Profile({ profileData, fetchMenuList, subtopicId, menuList }) {
  const currentData = useAppContext();
  const [editing, setEditing] = useState(false);
  const [newBio, setNewBio] = useState(profileData?.bio || "");

  const defaultImage = "/img/logosidebar.png"; // URL to a gray placeholder image

  if (!profileData) {
    return (
      <div className="p-4">
        <p className="text-gray-500 italic">
          No profile data available for this subtopic.
        </p>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("subtopic_id", subtopicId);
      formData.append(
        "author",
        JSON.stringify({
          ...profileData,
          bio: newBio,
        })
      );

      const response = await fetchProtectedData.put(
        `${URLS.DOCUMENTPRODUCT}/update-SubTopic`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        toastSuccess("Bio updated successfully!");
        setEditing(false);
        await fetchMenuList();
      } else {
        toastError("Failed to update bio.");
      }
    } catch (error) {
      toastError("An error occurred while updating bio.");
      console.error("Error updating bio:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <div className="flex font-extrabold">
          <p>โปรไฟล์</p>
        </div>
        {currentData.accessCheck.haveAny([
          ACCESS.document_product.edit_documents,
        ]) && (
          <EditIcon
            onClick={() => setEditing(true)}
            className="hover:cursor-pointer hover:text-warning"
          />
        )}
      </div>

      <div className="flex items-center justify-center mb-4">
        <img
          src={profileData.profileImage || defaultImage}
          alt={profileData.name || "Profile"}
          className="w-24 h-24 rounded-full mr-4 "
          onError={(e) => {
            e.target.src = defaultImage; // Fallback if image fails to load
          }}
        />
      </div>

      <div className="flex items-center justify-center">
        <h2 className="text-xl font-bold">
          {profileData.name || profileData.businessName || "Hopeful.co.th"}
        </h2>
      </div>
      <div className="flex items-center justify-center">
        <p className="text-gray-600 italic">{profileData.nickname || ""}</p>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-semibold "></h3>
        </div>

        {editing ? (
          <div>
            <Textarea
              label="รายละเอียด"
              variant="bordered"
              isClearable
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              className=" w-full mb-2"
              rows="4"
              placeholder="Enter a short biography..."
              onClear={() => setNewBio("")}
            />
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            {profileData.bio ? (
              <Textarea
                isReadOnly
                value={profileData.bio}
                className="max-w-xs"
                defaultValue="เพราะวิธีคิดสำคัญกว่าวิธีการ"
                label="รายละเอียด"
                variant="flat"
              />
            ) : (
              <em className="flex justify-center items-center font-thin">
                เพราะวิธีคิดสำคัญกว่าวิธีการ
              </em>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-end">
        {profileData.lastUpdated && (
          <small className="text-gray-500">
            อัพเดต: {new Date(profileData.lastUpdated).toLocaleString()}
          </small>
        )}
      </div>
    </div>
  );
}

export default Profile;
