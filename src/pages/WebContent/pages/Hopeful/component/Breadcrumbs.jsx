import React from "react";

const Breadcrumbs = ({ items }) => {
  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex items-center text-sm text-gray-600">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.onClick ? (
              <button onClick={item.onClick} className="text-blue-600 hover:underline">
                {item.label}
              </button>
            ) : (
              <span>{item.label}</span>
            )}
            {index < items.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
