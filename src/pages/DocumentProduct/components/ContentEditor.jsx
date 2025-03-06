import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Editor } from "@tinymce/tinymce-react";
import ImageCarousel from "./ImageCarousel";
import {
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Tooltip,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import { SaveAsIcon } from "../../../component/Icons";
import { URLS } from "../../../config";
import fetchProtectedData from "../../../../utils/fetchData";
import {
  toastError,
  toastWarning,
  toastSuccess,
} from "../../../component/Alert";
import { AddLayerIcon, EditIcon, PlusIcon } from "../../../component/Icons";
import { ACCESS } from "../../../configs/access";
import { useAppContext } from "../../../contexts/AppContext";
function ContentEditor({
  activeHeading,
  activeSubtopic,
  activeContent,
  activeImages,
  activeDetails,
  setActiveContent,
  setActiveImages,
  subtopicId,
  fetchMenuList,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const currentData = useAppContext();
  const [details, setDetails] = useState(activeDetails || []);
  const [newDetail, setNewDetail] = useState({
    title: "",
    description: "",
    images: null,
    preview: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (activeDetails) setDetails(activeDetails);
  }, [activeDetails]);

  const handleSaveContent = async () => {
    try {
      setIsSaving(true);
      if (activeContent || activeImages) {
        const formData = new FormData();
        formData.append("subtopic_id", subtopicId);
        formData.append("content", activeContent || "");

        if (activeImages && activeImages.length > 0) {
          activeImages.forEach((image) => {
            if (typeof image === "string") {
              formData.append("images", image);
            } else if (image instanceof File) {
              formData.append("images", image);
            }
          });
        } else {
          formData.append("images", []);
        }

        try {
          await fetchProtectedData.put(
            `${URLS.DOCUMENTPRODUCT}/update-SubTopic`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          console.log("Data sent successfully");
        } catch (error) {
          console.error("Error during API request:", error);
          throw new Error("Failed to save content or images.");
        }
      }
      console.log("details", details);
      console.log("newDetail", newDetail);

      if (details && details.length > 0) {
        console.log("update details", subtopicId);

        for (const detail of details) {
          const detailFormData = new FormData();
          detailFormData.append("subtopic_id", subtopicId);
          detailFormData.append("title", detail.title.trim() || "");
          detailFormData.append("description", detail.description.trim() || "");

          if (detail.images instanceof File) {
            detailFormData.append("images", detail.images);
          }

          if (detail.detail_id) {
            // Update existing detail
            console.log("Updating detail:", detail.detail_id);
            detailFormData.append("detail_id", detail.detail_id);
            await fetchProtectedData.put(
              `${URLS.DOCUMENTPRODUCT}/update-Detail`,
              detailFormData,
              { headers: { "Content-Type": "multipart/form-data" } }
            );
          } else {
            // Add new detail
            console.log("Adding new detail");
            await fetchProtectedData.post(
              `${URLS.DOCUMENTPRODUCT}/add-Detail`,
              detailFormData,
              { headers: { "Content-Type": "multipart/form-data" } }
            );
          }
        }
      } else {
        console.log("No details to process");
      }

      await fetchMenuList();
      setEditMode(false);
      setAddMode(false);

      toastSuccess("Content and details updated successfully!");
    } catch (error) {
      console.error("Error while saving content:", error.response || error);
      toastError("Failed to save content. Please check server logs.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDetailImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setDetails((prev) =>
        prev.map((detail, i) =>
          i === index ? { ...detail, images: file, preview: objectURL } : detail
        )
      );

      return () => URL.revokeObjectURL(objectURL);
    }
  };

  const addDetail = () => {
    setDetails((prevDetails) => [
      ...prevDetails,
      {
        ...newDetail,
        preview: newDetail.images
          ? URL.createObjectURL(newDetail.images)
          : null,
      },
    ]);
    setNewDetail({ title: "", description: "", images: null, preview: null });
  };

  const deleteDetail = async (index) => {
    const detailToDelete = details[index];

    try {
      if (detailToDelete.detail_id) {
        await fetchProtectedData.delete(
          `${URLS.DOCUMENTPRODUCT}/delete-Detail?detailId=${detailToDelete.detail_id}`
        );
      }

      setDetails((prev) => prev.filter((_, i) => i !== index));
      toastSuccess("Detail deleted successfully!");
    } catch (error) {
      console.error("Failed to delete detail:", error);
      toastError("An error occurred while deleting the detail.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 p-5">
        <div className="flex items-center space-x-5">
          {/* Check if activeHeading and activeSubtopic are valid */}
          {activeHeading && activeSubtopic ? (
            <>
              <h3 className="font-semibold text-lg">
                <Breadcrumbs>
                  <BreadcrumbItem>{activeHeading}</BreadcrumbItem>
                  <BreadcrumbItem>{activeSubtopic}</BreadcrumbItem>
                </Breadcrumbs>
              </h3>
              {currentData.accessCheck.haveAny([
                ACCESS.document_product.edit_documents,
              ]) && (
                <div className="hover:text-green-500">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button auto size="sm" isIconOnly variant="like">
                        <AddLayerIcon />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Post Options">
                      <DropdownItem
                        className="text-xl  flex-shrink-0 items-center"
                        startContent={<EditIcon />}
                        key="editPost"
                        onPress={() => {
                          setEditMode((prev) => !prev);
                          setAddMode(false);
                        }}
                      >
                        {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
                      </DropdownItem>
                      <DropdownItem
                        className="text-xl  flex-shrink-0 items-center"
                        startContent={<PlusIcon />}
                        key="addContent"
                        onPress={() => {
                          setAddMode((prev) => !prev);
                          setEditMode(false);
                        }}
                      >
                        {addMode ? "Cancel Add Mode" : "Add New Content"}
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              )}
            </>
          ) : (
            <></>
          )}
        </div>

        {(editMode || addMode) && (
          <Tooltip content="Save Changes">
            <div className="flex">
              <SaveAsIcon
                className={`w-6 h-6 hover:cursor-pointer hover:text-green-500 ${
                  isSaving ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={isSaving ? null : handleSaveContent}
              />
            </div>
          </Tooltip>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto p-4 scrollbar-hide">
        {/* General Content */}
        <ImageCarousel
          activeImages={activeImages}
          setActiveImages={setActiveImages}
          editMode={editMode}
          addMode={addMode}
        />
        <div className="flex flex-col justify-center mb-6">
          {editMode || addMode ? (
            <>
              <h4 className="font-semibold mb-2">Content</h4>
              <Editor
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
                    'searchreplace', 'wordcount', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media',
                    'table', 'emoticons', 'help'
                  ],
                  toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
                    'forecolor backcolor emoticons | help',
                  menu: {
                    favs: { title: 'My Favorites', items: 'code visualaid | searchreplace | emoticons' }
                  },
                }}
                apiKey="t6z1oatlazdxziwodkrzsbk50etxw6a19basazvx36yvoam2"
                value={activeContent}
                onEditorChange={setActiveContent}
                className="mb-4"
              />
            </>
          ) : (
            <div
              className="prose mx-auto w-full"
              dangerouslySetInnerHTML={{ __html: activeContent }}
            ></div>
          )}
        </div>

        {/* Details Management */}
        <div>
          {details.map((detail, index) => (
            <div
              key={detail.detail_id || detail.tempId || index}
              className="p-4 rounded mb-4"
            >
              {/* Editable Title */}
              {editMode || addMode ? (
                <Input
                  value={detail.title || ""}
                  onChange={(e) =>
                    setDetails((prev) =>
                      prev.map((d, i) =>
                        i === index ? { ...d, title: e.target.value } : d
                      )
                    )
                  }
                  placeholder="Enter Title"
                  className="mb-2 font-bold"
                />
              ) : (
                <h5 className="font-bold">{detail.title || ""}</h5>
              )}

              {/* Detail Image */}
              {detail.preview || (detail.images && detail.images.length > 0) ? (
                <div className="flex flex-col items-center mb-4">
                  <img
                    src={
                      detail.preview ||
                      (detail.images instanceof File
                        ? URL.createObjectURL(detail.images)
                        : detail.images)
                    }
                    alt={`Detail ${index}`}
                    className={`w-64 h-64 object-cover rounded-md ${
                      editMode || addMode ? "cursor-pointer" : "cursor-default"
                    }`}
                    onClick={() =>
                      (editMode || addMode) &&
                      document
                        .getElementById(`detailImageUpload-${index}`)
                        .click()
                    } // Trigger file input on click
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {editMode || addMode ? "Click the image to replace it" : ""}
                  </p>
                  {(editMode || addMode) && (
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={`detailImageUpload-${index}`}
                      onChange={(e) => handleDetailImageUpload(e, index)}
                    />
                  )}
                </div>
              ) : (
                (editMode || addMode) && (
                  <div
                    className="border-2 border-dashed border-gray-300 p-4 text-center rounded-md mb-4 cursor-pointer"
                    onClick={() =>
                      document
                        .getElementById(`detailImageUpload-${index}`)
                        .click()
                    }
                  >
                    <p className="text-gray-500">Click to upload an image</p>
                    <input
                      id={`detailImageUpload-${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleDetailImageUpload(e, index)}
                    />
                  </div>
                )
              )}

              {/* Editable Description */}
              {editMode || addMode ? (
                <Editor
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
                    'searchreplace', 'wordcount', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media',
                    'table', 'emoticons', 'help'
                  ],
                  toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
                    'forecolor backcolor emoticons | help',
                  menu: {
                    favs: { title: 'My Favorites', items: 'code visualaid | searchreplace | emoticons' }
                  },
                }}
                  apiKey="t6z1oatlazdxziwodkrzsbk50etxw6a19basazvx36yvoam2"
                  value={detail.description || ""}
                  onEditorChange={(value) =>
                    setDetails((prev) =>
                      prev.map((d, i) =>
                        i === index ? { ...d, description: value } : d
                      )
                    )
                  }
                  className="mb-4"
                />
              ) : (
                <div
                  className="prose mx-auto w-full"
                  dangerouslySetInnerHTML={{
                    __html: detail.description || "",
                  }}
                ></div>
              )}

              {/* Delete Button */}
              {(editMode || addMode) && (
                <button
                  onClick={() => deleteDetail(index)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Delete Detail
                </button>
              )}
            </div>
          ))}

          {/* Add New Detail */}
          {addMode && (
            <div className="border p-4 rounded">
              <h4 className="font-semibold mb-2">Details</h4>
              {!isAdding ? (
                <button
                  onClick={() => setIsAdding(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Add New Detail
                </button>
              ) : (
                <div className="border p-4 rounded mt-4">
                  <h4 className="font-semibold mb-2">Add New Detail</h4>
                  <Input
                    placeholder="Enter Title"
                    value={newDetail.title}
                    onChange={(e) =>
                      setNewDetail((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="mb-2"
                  />
                  {newDetail.images ? (
                    <div className="flex flex-col items-center mb-4">
                      <img
                        src={
                          newDetail.images
                            ? URL.createObjectURL(newDetail.images)
                            : ""
                        }
                        alt="New Detail"
                        className="w-64 h-64 object-cover rounded-md cursor-pointer"
                        onClick={() =>
                          document
                            .getElementById("newDetailImageUpload")
                            .click()
                        }
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Click to replace the image
                      </p>
                      <input
                        id="newDetailImageUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setNewDetail((prev) => ({ ...prev, images: file }));
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-gray-300 p-4 text-center rounded-md mb-4"
                      onClick={() =>
                        document.getElementById("newDetailImageUpload").click()
                      }
                    >
                      <p className="text-gray-500">Click to upload an image</p>
                      <input
                        id="newDetailImageUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setNewDetail((prev) => ({ ...prev, images: file }));
                          }
                        }}
                      />
                    </div>
                  )}
                  <Editor
                      init={{
                        height: 500,
                        menubar: true,
                        plugins: [
                          'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
                          'searchreplace', 'wordcount', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media',
                          'table', 'emoticons', 'help'
                        ],
                        toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | ' +
                          'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
                          'forecolor backcolor emoticons | help',
                        menu: {
                          favs: { title: 'My Favorites', items: 'code visualaid | searchreplace | emoticons' }
                        },
                      }}
                    apiKey="t6z1oatlazdxziwodkrzsbk50etxw6a19basazvx36yvoam2"
                    value={newDetail.description}
                    onEditorChange={(value) =>
                      setNewDetail((prev) => ({ ...prev, description: value }))
                    }
                    className="mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        addDetail();
                        setIsAdding(false); // Close the form after adding
                        setNewDetail({
                          title: "",
                          description: "",
                          images: null,
                          preview: null,
                        }); // Reset the form
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setNewDetail({
                          title: "",
                          description: "",
                          images: null,
                        }); // Reset the form
                        setIsAdding(false); // Cancel adding
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dropdown Options */}
    </div>
  );
}

export default ContentEditor;
