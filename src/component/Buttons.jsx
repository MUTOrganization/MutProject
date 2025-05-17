import React from "react";
import { Button } from "@heroui/react";

// PrimaryButton Component
export const PrimaryButton = ({
  onPress,
  text = "Click Me",
  size = "md",
  color = "primary", // Default color to 'primary'
  fullWidth = false,
  radius = "",
  className,
  isLoading,
  endContent,
  variant = "solid",
  isDisabled,
}) => {
  return (
    <Button
      auto
      color={color}
      size={size}
      radius={radius}
      onPress={onPress}
      fullWidth={fullWidth}
      isLoading={isLoading}
      className={className}
      variant={variant}
      endContent={endContent}
      isDisabled={isDisabled}
    >
      {text}
    </Button>
  );
};

export const IconButton = ({
  onPress,
  text = "",
  size = "md",
  color = "primary", // Default color to 'primary'
  fullWidth = false,
  radius = "",
  className,
  variant = "solid",
  isLoading,
  isDisabled
}) => {
  return (
    <Button
      isLoading={isLoading}
      auto
      color={color}
      size={size}
      radius={radius}
      onPress={onPress}
      fullWidth={fullWidth}
      className={className}
      variant={variant}
      isIconOnly
      isDisabled={isDisabled}
    >
      {text}
    </Button>
  );
};

// ConfirmCancelButtons Component
export const ConfirmCancelButtons = ({
  onConfirm,
  onCancel,
  isLoading,
  isDisabledCancel = false,
  confirmText = "ตกลง",
  cancelText = "ยกเลิก",
  cancelColor = "error",
  confirmColor = "success",
  size = "md", // Default size to 'md'
}) => {
  return (
    <div className="flex space-x-4">
      <Button
        auto
        color={cancelColor}
        size={size}
        radius="sm"
        variant="light"
        isDisabled={isDisabledCancel}
        onPress={onCancel}
        className={`text-black hover:bg-custom-redlogin hover:text-white`}
      >
        {cancelText}
      </Button>
      <Button
        auto
        color={confirmColor}
        size={size}
        radius="sm"
        onPress={onConfirm}
        isLoading={isLoading}
        variant="solid"
        className={`${confirmColor === "success" ? "bg-green-500 text-white" : ""}`}
      >
        {confirmText}
      </Button>
    </div>
  );
};

export default { PrimaryButton, ConfirmCancelButtons };
