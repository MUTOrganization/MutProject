import React from "react";
import { Card, Spinner, Tooltip, Divider, Chip } from "@nextui-org/react";
import { FacebookIcon, LineIcon } from "../../../component/Icons";
import { calculateCloseRate, calculateVAT } from "../../../component/Calculate";

const CardGrid = ({
  item,
  onViewDetails,
  vatRate,
  isLoading,
  selectedCheckboxes,
}) => {
  const formattedValue = (value) =>
    value ? new Intl.NumberFormat().format(value) : "0";

  const renderIcon = (channelName) => {
    if (!channelName) return null;
    if (channelName.startsWith("FB")) return <FacebookIcon className="text-blue-600" />;
    if (channelName.startsWith("LA")) return <LineIcon className="text-green-500" />;
    return null;
  };

  // Use saleChannelName if available, otherwise use saleChannel
  const channelName = item.saleChannelName || item.saleChannel ;

  const costAds = calculateVAT(item.ads || 0, vatRate);
  const PercentAdsTotal =
    parseFloat(
      (costAds / (parseFloat(item.sales || 0) + parseFloat(item.upsales || 0))) *
        100
    ) || 0;
  const PercentAdsSale =
    parseFloat((costAds / parseFloat(item.sales || 0)) * 100) || 0;
  const PercentAdsNew =
    parseFloat((costAds / parseFloat(item.SalesNew || 0)) * 100) || 0;

  const handleCardClick = () => {
    if (!item.saleChannelName) {
      alert("ไม่เจอรายละเอียด");
      return;
    }
    onViewDetails(channelName);
  };

  return (
    <>
      {isLoading ? (
        <Spinner color="primary" className="flex justify-center items-center" />
      ) : (
        <Tooltip
          color="primary"
          content={channelName === item.saleChannelName ? "กดเพื่อดูรายละเอียด" : "ไม่เจอรายละเอียด"}
        >
          <div
            className={`relative p-4 bg-white shadow-md rounded-md h-auto ${
              !item.saleChannelName ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            } transition-transform transform hover:scale-105`}
            onClick={item.saleChannelName ? handleCardClick : null}
          >
            <div className="flex justify-center items-center space-x-2 mb-5">
              {renderIcon(channelName)}
              <h3 className="text-lg font-bold text-black">
                {channelName}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span>ยอดขายทั้งหมด</span>
                <span className="text-green-500 font-bold">
                  ฿ {formattedValue(item.sales)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>ยอดขายใหม่</span>
                <span className="font-bold">฿ {formattedValue(item.SalesNew)}</span>
              </div>

              <Divider className="my-1" />

              <div className="flex justify-between">
                <span>ออเดอร์รวม</span>
                <span className="text-green-500 font-bold">
                  {formattedValue(item.totalorder)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>ออเดอร์ลูกค้าใหม่</span>
                <span className="font-bold">{formattedValue(item.newcus)}</span>
              </div>

              <Divider className="my-1" />

              <div className="flex justify-between">
                <span>ยอดทักใหม่</span>
                <span className="font-bold">{formattedValue(item.newInbox)}</span>
              </div>
              <div className="flex justify-between">
                <span>ยอดทักเก่า</span>
                <span className="font-bold">{formattedValue(item.oldInbox)}</span>
              </div>

              <div className="flex justify-between">
                <span>% ปิดการขายลูกค้าใหม่</span>
                <span className="font-bold">
                  {calculateCloseRate(item.newcus, item.newInbox)} %
                </span>
              </div>

              <div className="flex justify-between">
                <span>% ปิดการขายรวม</span>
                <span className="font-bold">
                  {calculateCloseRate(item.totalorder, item.totalInbox)} %
                </span>
              </div>

              <Divider className="my-1" />

              <div className="flex justify-between">
                <span>
                  % ADS รวม{" "}
                  {selectedCheckboxes.vat && <span className="text-xs">(vat 7%)</span>}
                </span>
                <span>{PercentAdsTotal.toFixed(2)} %</span>
              </div>

              <div className="flex justify-between">
                <span>
                  % ADS ของ Admin{" "}
                  {selectedCheckboxes.vat && <span className="text-xs">(vat 7%)</span>}
                </span>
                <span>{PercentAdsSale.toFixed(2)} %</span>
              </div>

              <div className="flex justify-between">
                <span>
                  % ADS ลูกค้าใหม่{" "}
                  {selectedCheckboxes.vat && <span className="text-xs">(vat 7%)</span>}
                </span>
                <span>{PercentAdsNew.toFixed(2)} %</span>
              </div>

              <div className="flex justify-between">
                <span>
                  ADS {selectedCheckboxes.vat && <span className="text-xs">(vat 7%)</span>}
                </span>
                <span>฿ {formattedValue(costAds.toFixed(2))}</span>
              </div>

              <Divider className="my-1" />
              <div className="flex justify-center">
                <Chip
                  variant="shadow"
                  radius="sm"
                  size="sm"
                  classNames={{
                    base: "bg-gradient-to-br from-blue-500 to-blue-400 border-small border-white/50 shadow-blue-500/30",
                    content: "drop-shadow shadow-black text-white",
                  }}
                >
                  ดูเเลเพจ : {item.teamAds || "ไม่มีการยิงแอด"}
                </Chip>
              </div>
            </div>
          </div>
        </Tooltip>
      )}
    </>
  );
};

export default CardGrid;
