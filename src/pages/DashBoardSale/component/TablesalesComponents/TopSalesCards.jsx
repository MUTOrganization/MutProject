import { useState } from "react";
import { Card, CardBody, Image, Switch, Spinner } from "@nextui-org/react";

export default function TopSalesCards({ data, isLoading }) {
  const topSales = [...data].sort((a, b) => b.sales - a.sales);

  const [viewModes, setViewModes] = useState(topSales.map(() => true));

  const toggleViewMode = (index) => {
    setViewModes((prev) => {
      const newModes = [...prev];
      newModes[index] = !newModes[index];
      return newModes;
    });
  };
  const formatCurrencyNoDollars = (amount) => {
    if (amount === undefined || amount === null) return "N/A";

    const number = Number(amount);
    const formattedNumber = number
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return `${formattedNumber}`;
  };
  const getRankStyle = (index) => {
    switch (index) {
      case 0:
        return { color: "#d4af37", icon: "👑", backgroundColor: "#f9f7f1" };
      case 1:
        return { color: "#b2b2b2", icon: "👑", backgroundColor: "#f2f2f2" };
      case 2:
        return { color: "#cd7f32", icon: "👑", backgroundColor: "#f9f3f1" };
      default:
        return {};
    }
  };

  const getUserInfo = (name) => {
    const user = data.find((user) => user.sales_name === name);
    return user
      ? { nickName: user.sales_name, img: user.img }
      : { nickName: name, img: "" };
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/80"; // Fallback image if the URL fails
  };
  

  return (
    <>
     <div
      style={{ justifyContent: "center", gap: "20px" }}
      className="grid lg:grid-cols-3 grid-cols-1 lg:hidden"
    >
      {topSales.map((item, index) => {
        const rankStyle = getRankStyle(index);
        const { nickName, img } = getUserInfo(item.sales_name);
        const viewSales = viewModes[index];

        return (
          <Card
            key={item.sales_name}
            shadow="none"
            radius="sm"
            className="w-full h-[250px] p-2 relative"
          >
            <CardBody style={{ textAlign: "left" }}>
              {isLoading ? (
                <Spinner
                  color="primary"
                  className="flex justify-center items-center"
                />
              ) : (
                <>
                  <div className="absolute top-2 right-2 space-x-3">
                    <span></span>
                    {viewSales ? "ยอดขาย" : "ออเดอร์"}
                    <Switch
                      checked={viewSales}
                      onChange={() => toggleViewMode(index)}
                      size="sm"
                      thumbIcon={({ isSelected }) =>
                        isSelected ? <span>📦</span> : <span>💰</span>
                      }
                    ></Switch>
                  </div>
                  <div>
                    <span style={{ color: rankStyle.color }}>
                      {`อันดับที่ ${index + 1}`} {rankStyle.icon}
                    </span>
                    <div>{nickName}</div>
                  </div>
                  <div className="flex justify-between mt-3 ">
                    <div className="flex flex-col justify-center items-center space-y-2">
                      <Image
                        src={
                          img ||
                          "https://nextui.org/images/hero-card-complete.jpeg"
                        }
                        alt={nickName}
                        width={120}
                        height={120}
                        style={{ borderRadius: "10px", marginRight: "10px" }}
                        onError={handleImageError}
                      />
                      <span className="text-center text-sm">
                        ทักใหม่ : {formatCurrencyNoDollars(item.newInbox)} ทัก
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 mt-4 gap-4 sm:gap-8 items-start">
                      {viewSales ? (
                        <>
                          <div className="grid grid-flow-col  lg:grid-flow-row items-start gap-3 min-w-[80px] sm:min-w-[120px]">
                            <div className="flex flex-col justify-center items-center">
                              <span>
                                ยอดขายรวม
                              </span>
                              <span>{`฿ ${formatCurrencyNoDollars(item.sales)}`}</span>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                              <span>ยอดขายลูกค้าใหม่</span>
                              <span>{`฿ ${formatCurrencyNoDollars(item.SalesNew)}`}</span>
                            </div>
                          </div>

                          <div className="grid grid-flow-col lg:grid-flow-row   items-start gap-3 min-w-[80px] sm:min-w-[120px]">
                            <div className="flex flex-col justify-center items-center">
                              <span>ค่าแอด</span>
                              <span>{`฿ ${formatCurrencyNoDollars(item.totalAdsAmount)}`}</span>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                              <span>ยอดขายลูกค้าเก่า</span>
                              <span>{`฿ ${formatCurrencyNoDollars(item.SalesOld)}`}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="grid grid-flow-col lg:grid-flow-row   items-start gap-3 min-w-[80px] sm:min-w-[120px]">
                            <div className="flex flex-col justify-center items-center">
                              <span>ออเดอร์ลูกค้าใหม่</span>
                              <span>{`฿${formatCurrencyNoDollars(item.newcus)}`}</span>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                              <span>ออเดอร์รวม</span>
                              <span>{`฿${formatCurrencyNoDollars(item.totalOrder)}`}</span>
                            </div>
                          </div>

                          <div className="grid grid-flow-col  lg:grid-flow-row  items-start gap-3 min-w-[80px] sm:min-w-[120px]">
                            <div className="flex flex-col justify-center items-center">
                              <span>ออเดอร์ลูกค้าเก่า</span>
                              <span>{`฿${formatCurrencyNoDollars(item.oldcus)}`}</span>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                              <span>% ปิดการขายรวม</span>
                              <span>{`${parseFloat((item.totalOrder / item.newInbox) * 100).toFixed(2)} %`}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        );
      })}
    </div>
    <div
      style={{ justifyContent: "center", gap: "20px" }}
      className="lg:grid lg:grid-cols-3 grid-cols-1 hidden"
    >
      {topSales.slice(0,3).map((item, index) => {
        const rankStyle = getRankStyle(index);
        const { nickName, img } = getUserInfo(item.sales_name);
        const viewSales = viewModes[index];

        return (
          <Card
            key={item.sales_name}
            shadow="none"
            radius="sm"
            className="w-full h-[250px] p-2 relative"
          >
            <CardBody style={{ textAlign: "left" }}>
              {isLoading ? (
                <Spinner
                  color="primary"
                  className="flex justify-center items-center"
                />
              ) : (
                <>
                  <div className="absolute top-2 right-2 space-x-3">
                    <span></span>
                    {viewSales ? "ยอดขาย" : "ออเดอร์"}
                    <Switch
                      checked={viewSales}
                      onChange={() => toggleViewMode(index)}
                      size="sm"
                      thumbIcon={({ isSelected }) =>
                        isSelected ? <span>📦</span> : <span>💰</span>
                      }
                    ></Switch>
                  </div>
                  <div>
                    <span style={{ color: rankStyle.color }}>
                      {`อันดับที่ ${index + 1}`} {rankStyle.icon}
                    </span>
                    <div>{nickName}</div>
                  </div>
                  <div className="flex justify-between mt-3 ">
                    <div className="flex flex-col justify-center items-center space-y-2">
                      <Image
                        src={
                          img ||
                          "https://nextui.org/images/hero-card-complete.jpeg"
                        }
                        alt={nickName}
                        width={120}
                        height={120}
                        style={{ borderRadius: "10px", marginRight: "10px" }}
                        onError={handleImageError}
                      />
                      <span className="text-center text-sm">
                        ทักใหม่ : {formatCurrencyNoDollars(item.newInbox)} ทัก
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 mt-4 gap-4 sm:gap-8 items-start">
                      {viewSales ? (
                        <>
                          <div className="grid grid-flow-col  lg:grid-flow-row items-start gap-3 min-w-[80px] sm:min-w-[120px]">
                            <div className="flex flex-col justify-center items-center">
                              <span>
                                ยอดขายรวม
                              </span>
                              <span>{`฿ ${formatCurrencyNoDollars(item.sales)}`}</span>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                              <span>ยอดขายลูกค้าใหม่</span>
                              <span>{`฿ ${formatCurrencyNoDollars(item.SalesNew)}`}</span>
                            </div>
                          </div>

                          <div className="grid grid-flow-col lg:grid-flow-row   items-start gap-3 min-w-[80px] sm:min-w-[120px]">
                            <div className="flex flex-col justify-center items-center">
                              <span>ค่าแอด</span>
                              <span>{`฿ ${formatCurrencyNoDollars(item.totalAdsAmount)}`}</span>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                              <span>ยอดขายลูกค้าเก่า</span>
                              <span>{`฿ ${formatCurrencyNoDollars(item.SalesOld)}`}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="grid grid-flow-col lg:grid-flow-row   items-start gap-3 min-w-[80px] sm:min-w-[120px]">
                            <div className="flex flex-col justify-center items-center">
                              <span>ออเดอร์ลูกค้าใหม่</span>
                              <span>{`฿${formatCurrencyNoDollars(item.newcus)}`}</span>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                              <span>ออเดอร์รวม</span>
                              <span>{`฿${formatCurrencyNoDollars(item.totalOrder)}`}</span>
                            </div>
                          </div>

                          <div className="grid grid-flow-col  lg:grid-flow-row  items-start gap-3 min-w-[80px] sm:min-w-[120px]">
                            <div className="flex flex-col justify-center items-center">
                              <span>ออเดอร์ลูกค้าเก่า</span>
                              <span>{`฿${formatCurrencyNoDollars(item.oldcus)}`}</span>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                              <span>% ปิดการขายรวม</span>
                              <span>{`${parseFloat((item.totalOrder / item.newInbox) * 100).toFixed(2)} %`}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        );
      })}
    </div>
    </>
  );
}
