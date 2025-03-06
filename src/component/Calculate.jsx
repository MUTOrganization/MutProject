export const calculatePercentageChange = (current, previous) => {
  return ((current - previous) / previous) * 100;
};

export function calculateVAT(amount, vatRate) {
  if (typeof amount !== "number" || typeof vatRate !== "number") {
    throw new Error("ทั้ง amount และ vatRate ต้องเป็นตัวเลข");
  }
  const vatAmount = amount * (vatRate / 100);
  return amount + vatAmount;
}





export function calculateCloseRate(orders, inbox) {
  return inbox ? ((orders / inbox) * 100).toFixed(2) : 0;
};

export const calculateTotals = (data, fields) => {
  return parseFloat(
    data
      .reduce(
        (sum, row) =>
          sum +
          fields.reduce(
            (fieldSum, field) => fieldSum + (parseFloat(row[field]) || 0),
            0
          ),
        0
      )
      .toFixed(2)
  );
};

export const formatNumberToK = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2).replace(/\.0$/, "") + "b";
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(2).replace(/\.0$/, "") + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2).replace(/\.0$/, "") + "K";
  }
  return num.toString();
};

// Sales data calculations
export const calculateSalesTotals = (salesData, salesDataAgo) => {
  const totalSaleThismonth = calculateTotals(salesData, ["sale", "upsale"]);
  const totalSaleAgomonth = calculateTotals(salesDataAgo, ["sale", "upsale"]);
  const totalNewSaleThismonth = calculateTotals(salesData, [
    "adminNew",
    "upsaleNew",
  ]);
  const totalNewSaleAgoMonth = calculateTotals(salesDataAgo, [
    "adminNew",
    "upsaleNew",
  ]);
  const totalOldSaleThismonth = calculateTotals(salesData, [
    "adminOld",
    "upsaleOld",
  ]);
  const totalOldSaleAgoMonth = calculateTotals(salesDataAgo, [
    "adminOld",
    "upsaleOld",
  ]);

  const totalSaleAdminThisMonth = calculateTotals(salesData, ["roleSsales"]);

  const totalNewSaleAdminThisMonth = calculateTotals(salesData, ["salesAdminNew"]);
  const totalOldSaleAdminThisMonth = calculateTotals(salesData, ["salesAdminOld"]);

  const totalNewSaleAdminAgoMonth = calculateTotals(salesDataAgo, ["salesAdminNew"]);
  const totalOldSaleAdminAgoMonth = calculateTotals(salesDataAgo, ["salesAdminOld"]);

  const totalSaleCRMThisMonth = calculateTotals(salesData, [
    "roleCsales",
    "roleCupsales",
    "roleSupsales",
  ]);
  const totalSaleAdminAgoMonth = calculateTotals(salesDataAgo, ["roleSsales"]);
  const totalSaleCRMAgoMonth = calculateTotals(salesDataAgo, [
    "roleCsales",
    "roleCupsales",
    "roleSupsales",
  ]);


  const percentageNewSaleAdmin = calculatePercentageChange(
    totalNewSaleAdminThisMonth,
    totalNewSaleAdminAgoMonth
  );

  const percentageOldSaleAdmin = calculatePercentageChange(
    totalOldSaleAdminThisMonth,
    totalOldSaleAdminAgoMonth
  );

  const percentageAdminSaleTotal = calculatePercentageChange(
    totalSaleAdminThisMonth,
    totalSaleAdminAgoMonth
  );
  const percentageCRMSaleTotal = calculatePercentageChange(
    totalSaleCRMThisMonth,
    totalSaleCRMAgoMonth
  );
  const percentageSaleTotal = calculatePercentageChange(
    totalSaleThismonth,
    totalSaleAgomonth
  );
  const percentageNewcusSaleTotal = calculatePercentageChange(
    totalNewSaleThismonth,
    totalNewSaleAgoMonth
  );
  const percentageOldcusSaleTotal = calculatePercentageChange(
    totalOldSaleThismonth,
    totalOldSaleAgoMonth
  );

  const isIncresseSaleTotal = percentageSaleTotal > 0;
  const isIncresseCRM = percentageCRMSaleTotal > 0;
  const isIncresseAdmin = percentageAdminSaleTotal > 0;
  const isIncresseNewcusSaleTotal = percentageNewcusSaleTotal > 0;
  const isIncresseOldcusSaleTotal = percentageOldcusSaleTotal > 0;

  const isIncressNewSaleAdmin = percentageNewSaleAdmin > 0;
  const isIncressOldSaleAdmin = percentageOldSaleAdmin > 0;

  return {
    totalNewSaleAdminThisMonth,
    totalOldSaleAdminThisMonth,
    totalSaleThismonth,
    totalSaleAgomonth,
    totalNewSaleThismonth,
    totalNewSaleAgoMonth,
    totalOldSaleThismonth,
    totalOldSaleAgoMonth,
    totalSaleAdminThisMonth,
    totalSaleCRMThisMonth,
    totalSaleAdminAgoMonth,
    totalSaleCRMAgoMonth,
    percentageOldSaleAdmin,
    percentageNewSaleAdmin,
    percentageAdminSaleTotal,
    percentageCRMSaleTotal,
    percentageSaleTotal,
    percentageNewcusSaleTotal,
    percentageOldcusSaleTotal,
    isIncresseCRM,
    isIncresseAdmin,
    isIncresseSaleTotal,
    isIncresseNewcusSaleTotal,
    isIncresseOldcusSaleTotal,
    isIncressNewSaleAdmin,
    isIncressOldSaleAdmin
  };
};

// Order data calculations
export const calculateOrderTotals = (salesData, salesDataAgo) => {

  //ADD ON
  const orderSaleNewThismonth = calculateTotals(salesData, ["orderSaleNew"]);
  const orderSaleOldThismonth = calculateTotals(salesData, ["orderSaleOld"]);
  const orderSaleTotalThismonth = orderSaleNewThismonth + orderSaleOldThismonth;

  const orderSaleNewAgo = calculateTotals(salesDataAgo, ["orderSaleNew"]);
  const orderSaleOldAgo = calculateTotals(salesDataAgo, ["orderSaleOld"]);
  const orderSaleTotalAgo = orderSaleNewAgo + orderSaleOldAgo;


  const compareSaleorder = orderSaleTotalThismonth - orderSaleTotalAgo;
  const compareSaleorNew = orderSaleNewThismonth - orderSaleNewAgo;
  const compareSaleorOld = orderSaleOldThismonth - orderSaleOldAgo;

  const isIncreasecompareorderSales = compareSaleorder > 0;
  const isIncreasecompareorderSalesNew = compareSaleorNew > 0;
  const isIncreasecompareorderSalesOld = compareSaleorOld > 0;
  //ADD ON
  const orderNewcustotalThismonth = calculateTotals(salesData, ["newcusOrder"]);
  const orderOldcustotalThismonth = calculateTotals(salesData, ["oldcusOrder"]);
  const upsaleTotalThisMonth = calculateTotals(salesData, ["upsale"]);
  const orderUpsalecustotalThismonth = calculateTotals(salesData, [
    "upsaleOrder",
  ]);
  const orderTotalThismonth =
    orderNewcustotalThismonth + orderOldcustotalThismonth;

  const orderNewcustotalAgomonth = calculateTotals(salesDataAgo, [
    "newcusOrder",
  ]);
  const orderOldcustotalAgomonth = calculateTotals(salesDataAgo, [
    "oldcusOrder",
  ]);
  const upsaleTotalAgoMonth = calculateTotals(salesDataAgo, ["upsale"]);
  const orderUpsalecustotalAgomonth = calculateTotals(salesDataAgo, [
    "upsaleOrder",
  ]);
  const percentageUpsaleTotal = calculatePercentageChange(
    upsaleTotalThisMonth,
    upsaleTotalAgoMonth
  );

  const orderTotalAgo = orderNewcustotalAgomonth + orderOldcustotalAgomonth;

  const compareordertotal = orderTotalThismonth - orderTotalAgo;
  const compareorderNewcus =
    orderNewcustotalThismonth - orderNewcustotalAgomonth;
  const compareorderOldcus =
    orderOldcustotalThismonth - orderOldcustotalAgomonth;
  const compareupsaleOrder =
    orderUpsalecustotalThismonth - orderUpsalecustotalAgomonth;

  const isIncreasecompareorderTotal = compareordertotal > 0;
  const isIncreasecompareorderNewcus = compareorderNewcus > 0;
  const isIncreasecompareorderOldcus = compareorderOldcus > 0;
  const isIncreasecompareUpsalesOrder = compareupsaleOrder > 0;
  const isIncresseUpsaleTotal = percentageUpsaleTotal > 0;

  const customer = calculateTotals(salesData, ["customer"]);

  return {
    orderSaleNewThismonth,
    orderSaleOldThismonth,
    orderSaleTotalThismonth,
    orderNewcustotalThismonth,
    orderOldcustotalThismonth,
    upsaleTotalThisMonth,
    orderUpsalecustotalThismonth,
    orderTotalThismonth,
    orderNewcustotalAgomonth,
    orderOldcustotalAgomonth,
    upsaleTotalAgoMonth,
    orderUpsalecustotalAgomonth,
    percentageUpsaleTotal,
    orderTotalAgo,
    compareordertotal,
    compareorderNewcus,
    compareorderOldcus,
    compareupsaleOrder,
    compareSaleorder,
    compareSaleorNew,
    compareSaleorOld,
    isIncreasecompareorderSalesNew,
    isIncreasecompareorderSalesOld,
    isIncreasecompareorderSales,
    isIncreasecompareorderTotal,
    isIncreasecompareorderNewcus,
    isIncreasecompareorderOldcus,
    isIncreasecompareUpsalesOrder,
    isIncresseUpsaleTotal,
    customer,
  };
};

// ads cal
export const calculateAdPercentages = (ads, adsAgo, sale, saleAgo, vatRate) => {
  const yesterdayTotal = calculateVAT(
    parseFloat(
      ads.reduce((sum, row) => sum + parseFloat(row.ads), 0).toFixed(2)
    ),
    vatRate
  );

  const beforeyesterdayTotal = calculateVAT(
    parseFloat(
      adsAgo.reduce((sum, row) => sum + parseFloat(row.ads), 0).toFixed(2)
    ),
    vatRate
  );
  // %Ads

  const SalePercentAdsNewcus = parseFloat(
    sale
      .reduce(
        (sum, row) =>
          sum + parseFloat(row.adminNew) + (parseFloat(row.upsaleNew) || 0),
        0
      )
      .toFixed(2)
  );

  const SalePercentAdsNewcusAgo = parseFloat(
    saleAgo
      .reduce(
        (sum, row) =>
          sum + parseFloat(row.adminNew) + (parseFloat(row.upsaleNew) || 0),
        0
      )
      .toFixed(2)
  );

  const SalePercentAdsroleS = parseFloat(
    sale
      .reduce(
        (sum, row) =>
          sum +
          parseFloat(row.roleSsales) +
          (parseFloat(row.roleSupsales) || 0),
        0
      )
      .toFixed(2)
  );

  const SalePercentAdsroleSAgo = parseFloat(
    saleAgo
      .reduce(
        (sum, row) =>
          sum +
          parseFloat(row.roleSsales) +
          (parseFloat(row.roleSupsales) || 0),
        0
      )
      .toFixed(2)
  );

  const SalePercentAdsTotal = parseFloat(
    sale
      .reduce(
        (sum, row) =>
          sum + parseFloat(row.sale) + (parseFloat(row.upsale) || 0),
        0
      )
      .toFixed(2)
  );

  const SalePercentAdsTotalAgo = parseFloat(
    saleAgo
      .reduce(
        (sum, row) =>
          sum + parseFloat(row.sale) + (parseFloat(row.upsale) || 0),
        0
      )
      .toFixed(2)
  );

  const percentageMonth = calculatePercentageChange(
    yesterdayTotal,
    beforeyesterdayTotal
  );

  const percentAdsTotal =
    parseFloat(yesterdayTotal / SalePercentAdsTotal) * 100;
  const percentAdsNewcus =
    parseFloat(yesterdayTotal / SalePercentAdsNewcus) * 100;
  const percentAdsOldcus =
    parseFloat(yesterdayTotal / SalePercentAdsroleS) * 100;

  const percentAdsTotalAgo =
    parseFloat(beforeyesterdayTotal / SalePercentAdsTotalAgo) * 100;

  const percentAdsNewcusAgo =
    parseFloat(beforeyesterdayTotal / SalePercentAdsNewcusAgo) * 100;
  const percentAdsOldcusAgo =
    parseFloat(beforeyesterdayTotal / SalePercentAdsroleSAgo) * 100;

  const isIncreasecomparepercentAdsTotal = percentAdsTotal > 0;
  const isIncreasecomparepercentAdsNewcus = percentAdsNewcus > 0;
  const isIncreasecomparepercentAdsOldcus = percentAdsOldcus > 0;

  const isIncreasecomparepercentAdsTotalAgo = percentAdsTotalAgo > 0;
  const isIncreasecomparepercentAdsNewcusAgo = percentAdsNewcusAgo > 0;
  const isIncreasecomparepercentAdsOldcusAgo = percentAdsOldcusAgo > 0;

  const percentcompareAdsTotal = parseFloat(
    percentAdsTotal - percentAdsTotalAgo
  );
  const percentcompareAdsNewcus = parseFloat(
    percentAdsNewcus - percentAdsNewcusAgo
  );
  const percentcompareAdsOldcus = parseFloat(
    percentAdsOldcus - percentAdsOldcusAgo
  );
  const isIncreasecomparepercentageMonth = percentageMonth > 0;
  const isIncreasecompareAdsTotal = percentcompareAdsTotal > 0;
  const isIncreasecompareAdsNewcus = percentcompareAdsNewcus > 0;
  const isIncreasecompareAdsOldcus = percentcompareAdsOldcus > 0;

  return {
    percentageMonth,
    isIncreasecomparepercentageMonth,
    isIncreasecompareAdsTotal,
    isIncreasecompareAdsNewcus,
    isIncreasecompareAdsOldcus,
    percentcompareAdsTotal,
    percentcompareAdsNewcus,
    percentcompareAdsOldcus,
    SalePercentAdsTotal,
    SalePercentAdsNewcus,
    SalePercentAdsroleS,
    yesterdayTotal,
    beforeyesterdayTotal,
    percentAdsTotal,
    percentAdsNewcus,
    percentAdsOldcus,
    percentAdsTotalAgo,
    percentAdsNewcusAgo,
    percentAdsOldcusAgo,
    SalePercentAdsTotalAgo,
    isIncreasecomparepercentAdsTotal,
    isIncreasecomparepercentAdsNewcus,
    isIncreasecomparepercentAdsOldcus,
    isIncreasecomparepercentAdsTotalAgo,
    isIncreasecomparepercentAdsNewcusAgo,
    isIncreasecomparepercentAdsOldcusAgo,
  };
};

export const calculateMyAds = (ads, adsAgo, sale, saleAgo, vatRate) => {
  const myyesterdayTotal = calculateVAT(
    parseFloat(
      ads.reduce((sum, row) => sum + parseFloat(row.ads), 0).toFixed(2)
    ),
    vatRate
  );
  const mybeforeyesterdayTotal = calculateVAT(
    parseFloat(
      adsAgo.reduce((sum, row) => sum + parseFloat(row.ads), 0).toFixed(2)
    ),
    vatRate
  );
  // %Ads
  const mySalePercentAdsNewcus = parseFloat(
    sale
      .reduce(
        (sum, row) =>
          sum + parseFloat(row.SalesNew) + (parseFloat(row.upsaleNew) || 0),
        0
      )
      .toFixed(2)
  );

  const mySalePercentAdsNewcusAgo = parseFloat(
    saleAgo
      .reduce(
        (sum, row) =>
          sum + parseFloat(row.SalesNew) + (parseFloat(row.upsaleNew) || 0),
        0
      )
      .toFixed(2)
  );

  const mySalePercentAdsroleS = parseFloat(
    sale
      .reduce(
        (sum, row) =>
          sum +
          parseFloat(row.admin), 0
      )
      .toFixed(2)
  );

  const mySalePercentAdsroleSAgo = parseFloat(
    saleAgo
      .reduce(
        (sum, row) =>
          sum +
          parseFloat(row.admin),
        0
      )
      .toFixed(2)
  );

  const mySalePercentAdsTotal = parseFloat(
    sale
      .reduce(
        (sum, row) =>
          sum + parseFloat(row.admin) + (parseFloat(row.upsale) || 0),
        0
      )
      .toFixed(2)
  );

  const mySalePercentAdsTotalAgo = parseFloat(
    saleAgo
      .reduce(
        (sum, row) =>
          sum + parseFloat(row.admin) + (parseFloat(row.upsale) || 0),
        0
      )
      .toFixed(2)
  );

  const mypercentageMonth = calculatePercentageChange(
    myyesterdayTotal,
    mybeforeyesterdayTotal
  );

  const mypercentAdsTotal =
    parseFloat(myyesterdayTotal / mySalePercentAdsTotal) * 100;
  const mypercentAdsNewcus =
    parseFloat(myyesterdayTotal / mySalePercentAdsNewcus) * 100;
  const mypercentAdsOldcus =
    parseFloat(myyesterdayTotal / mySalePercentAdsroleS) * 100;

  const mypercentAdsTotalAgo =
    parseFloat(mybeforeyesterdayTotal / mySalePercentAdsTotalAgo) * 100;
  const mypercentAdsNewcusAgo =
    parseFloat(mybeforeyesterdayTotal / mySalePercentAdsNewcusAgo) * 100;
  const mypercentAdsOldcusAgo =
    parseFloat(mybeforeyesterdayTotal / mySalePercentAdsroleSAgo) * 100;

  const myisIncreasecomparepercentAdsTotal = mypercentAdsTotal > 0;
  const myisIncreasecomparepercentAdsNewcus = mypercentAdsNewcus > 0;
  const myisIncreasecomparepercentAdsOldcus = mypercentAdsOldcus > 0;

  const myisIncreasecomparepercentAdsTotalAgo = mypercentAdsTotalAgo > 0;
  const myisIncreasecomparepercentAdsNewcusAgo = mypercentAdsNewcusAgo > 0;
  const myisIncreasecomparepercentAdsOldcusAgo = mypercentAdsOldcusAgo > 0;

  const mypercentcompareAdsTotal = parseFloat(
    mypercentAdsTotal - mypercentAdsTotalAgo
  );
  const mypercentcompareAdsNewcus = parseFloat(
    mypercentAdsNewcus - mypercentAdsNewcusAgo
  );
  const mypercentcompareAdsOldcus = parseFloat(
    mypercentAdsOldcus - mypercentAdsOldcusAgo
  );
  const myisIncreasecomparepercentageMonth = mypercentageMonth > 0;
  const myisIncreasecompareAdsTotal = mypercentcompareAdsTotal > 0;
  const myisIncreasecompareAdsNewcus = mypercentcompareAdsNewcus > 0;
  const myisIncreasecompareAdsOldcus = mypercentcompareAdsOldcus > 0;

  return {
    mypercentageMonth,
    myisIncreasecomparepercentageMonth,
    myisIncreasecompareAdsTotal,
    myisIncreasecompareAdsNewcus,
    myisIncreasecompareAdsOldcus,
    mypercentcompareAdsTotal,
    mypercentcompareAdsNewcus,
    mypercentcompareAdsOldcus,
    mySalePercentAdsTotal,
    mySalePercentAdsNewcus,
    mySalePercentAdsroleS,
    myyesterdayTotal,
    mybeforeyesterdayTotal,
    mypercentAdsTotal,
    mypercentAdsNewcus,
    mypercentAdsOldcus,
    mypercentAdsTotalAgo,
    mypercentAdsNewcusAgo,
    mypercentAdsOldcusAgo,
    myisIncreasecomparepercentAdsTotal,
    myisIncreasecomparepercentAdsNewcus,
    myisIncreasecomparepercentAdsOldcus,
    myisIncreasecomparepercentAdsTotalAgo,
    myisIncreasecomparepercentAdsNewcusAgo,
    myisIncreasecomparepercentAdsOldcusAgo,
  };
};


export const calculateMysale = (salesData, salesDataAgo) => {
  const mytotalSaleThismonth = calculateTotals(salesData, ["admin", "upsale"]);
  const mytotalSaleAgomonth = calculateTotals(salesDataAgo, ["admin", "upsale"]);
  const mytotalNewSaleThismonth = calculateTotals(salesData, [
    "SalesNew",
    "upsaleNew",
  ]);
  const mytotalNewSaleAgoMonth = calculateTotals(salesDataAgo, [
    "SalesNew",
    "upsaleNew",
  ]);
  const mytotalOldSaleThismonth = calculateTotals(salesData, [
    "SalesOld",
    "upsaleOld",
  ]);
  const mytotalOldSaleAgoMonth = calculateTotals(salesDataAgo, [
    "SalesOld",
    "upsaleOld",
  ]);



  const mypercentageSaleTotal = calculatePercentageChange(
    mytotalSaleThismonth,
    mytotalSaleAgomonth
  );
  const mypercentageNewcusSaleTotal = calculatePercentageChange(
    mytotalNewSaleThismonth,
    mytotalNewSaleAgoMonth
  );
  const mypercentageOldcusSaleTotal = calculatePercentageChange(
    mytotalOldSaleThismonth,
    mytotalOldSaleAgoMonth
  );

  const myisIncresseSaleTotal = mypercentageSaleTotal > 0;

  const myisIncresseNewcusSaleTotal = mypercentageNewcusSaleTotal > 0;
  const myisIncresseOldcusSaleTotal = mypercentageOldcusSaleTotal > 0;

  return {
    mytotalSaleThismonth,
    mytotalSaleAgomonth,
    mytotalNewSaleThismonth,
    mytotalNewSaleAgoMonth,
    mytotalOldSaleThismonth,
    mytotalOldSaleAgoMonth,
    mypercentageSaleTotal,
    mypercentageNewcusSaleTotal,
    mypercentageOldcusSaleTotal,
    myisIncresseSaleTotal,
    myisIncresseNewcusSaleTotal,
    myisIncresseOldcusSaleTotal,
  };
};

// Order data calculations
export const calculateMyorder = (salesData, salesDataAgo) => {
  const myorderNewcustotalThismonth = calculateTotals(salesData, ["newCus"]);
  const myorderOldcustotalThismonth = calculateTotals(salesData, ["oldCus"]);
  const myupsaleTotalThisMonth = calculateTotals(salesData, ["upsale"]);
  const myorderUpsalecustotalThismonth = calculateTotals(salesData, [
    "UpsaleOrder",
  ]);
  const myorderTotalThismonth =
    myorderNewcustotalThismonth + myorderOldcustotalThismonth;

  const myorderNewcustotalAgomonth = calculateTotals(salesDataAgo, [
    "newCus",
  ]);
  const myorderOldcustotalAgomonth = calculateTotals(salesDataAgo, [
    "oldCus",
  ]);
  const myupsaleTotalAgoMonth = calculateTotals(salesDataAgo, ["upsale"]);
  const myorderUpsalecustotalAgomonth = calculateTotals(salesDataAgo, [
    "UpsaleOrder",
  ]);
  const mypercentageUpsaleTotal = calculatePercentageChange(
    myupsaleTotalThisMonth,
    myupsaleTotalAgoMonth
  );

  const myorderTotalAgo = myorderNewcustotalAgomonth + myorderOldcustotalAgomonth;

  const mycompareordertotal = myorderTotalThismonth - myorderTotalAgo;
  const mycompareorderNewcus =
    myorderNewcustotalThismonth - myorderNewcustotalAgomonth;
  const mycompareorderOldcus =
    myorderOldcustotalThismonth - myorderOldcustotalAgomonth;
  const mycompareupsaleOrder =
    myorderUpsalecustotalThismonth - myorderUpsalecustotalAgomonth;

  const myisIncreasecompareorderTotal = mycompareordertotal > 0;
  const myisIncreasecompareorderNewcus = mycompareorderNewcus > 0;
  const myisIncreasecompareorderOldcus = mycompareorderOldcus > 0;
  const myisIncreasecompareUpsalesOrder = mycompareupsaleOrder > 0;
  const myisIncresseUpsaleTotal = mypercentageUpsaleTotal > 0;


  return {
    myorderNewcustotalThismonth,
    myorderOldcustotalThismonth,
    myupsaleTotalThisMonth,
    myorderUpsalecustotalThismonth,
    myorderTotalThismonth,
    myorderNewcustotalAgomonth,
    myorderOldcustotalAgomonth,
    myupsaleTotalAgoMonth,
    myorderUpsalecustotalAgomonth,
    mypercentageUpsaleTotal,
    myorderTotalAgo,
    mycompareordertotal,
    mycompareorderNewcus,
    mycompareorderOldcus,
    mycompareupsaleOrder,
    myisIncreasecompareorderTotal,
    myisIncreasecompareorderNewcus,
    myisIncreasecompareorderOldcus,
    myisIncreasecompareUpsalesOrder,
    myisIncresseUpsaleTotal,
  };
};



// Order data calculations
export const calculateInbox = (Inbox, InboxAgo) => {
  const newInboxThismonth = calculateTotals(Inbox, ["newInbox"]);
  const newInboxAgomonth = calculateTotals(InboxAgo, ["newInbox"]);

  const oldInboxThismonth = calculateTotals(Inbox, ["oldInbox"]);
  const oldInboxAgomonth = calculateTotals(InboxAgo, ["oldInbox"]);

  const TotalInboxThismonth = calculateTotals(Inbox, ["newInbox", "oldInbox"]);
  const TotalInboxAgomonth = calculateTotals(InboxAgo, ["newInbox", "oldInbox"]);

  const compareNewInbox = newInboxThismonth - newInboxAgomonth
  const compareOldInbox = oldInboxThismonth - oldInboxAgomonth
  const compareTotalInbox = TotalInboxThismonth - TotalInboxAgomonth

  const isIncreasecompareNewInboxTotal = compareNewInbox > 0;
  const isIncreasecompareOldInboxTotal = compareOldInbox > 0;
  const isIncreasecompareTotalInboxTotal = compareTotalInbox > 0;



  return {
    newInboxThismonth,
    compareNewInbox,
    isIncreasecompareNewInboxTotal,
    oldInboxThismonth,
    compareOldInbox,
    isIncreasecompareOldInboxTotal,
    TotalInboxThismonth,
    compareTotalInbox,
    isIncreasecompareTotalInboxTotal

  };
};

export const calculateGroupedData = (data, adsMap, calculateCloseRate, calculateVAT, vat) => {
  return data.reduce((acc, sale) => {
    if (!acc[sale.sales_name]) {
      acc[sale.sales_name] = {
        sales_name: sale.sales_name,
        name: sale.name,
        img: sale.img,
        totalInbox: 0,
        newInbox: 0,
        oldInbox: 0,
        newcus: 0,
        oldcus: 0,
        totalOrder: 0,
        SalesNew: 0,
        SalesOld: 0,
        sales: 0,
        totalAdsAmount: 0, // Initialize totalAdsAmount
        closeNew: 0,
        closeTotal: 0,
        PercentAdsNew: 0,
        PercentAdsSale: 0,
      };
    }

    // Accumulate values
    acc[sale.sales_name].totalInbox +=
      parseInt(sale.newInbox || 0, 10) + parseInt(sale.oldInbox || 0, 10);
    acc[sale.sales_name].newInbox += parseInt(sale.newInbox || 0, 10);
    acc[sale.sales_name].oldInbox += parseInt(sale.oldInbox || 0, 10);
    acc[sale.sales_name].newcus += parseInt(sale.newcus || 0, 10);
    acc[sale.sales_name].oldcus += parseInt(sale.oldcus || 0, 10);
    acc[sale.sales_name].totalOrder +=
      parseInt(sale.newcus || 0, 10) + parseInt(sale.oldcus || 0, 10);
    acc[sale.sales_name].SalesNew += parseFloat(sale.SalesNew || 0);
    acc[sale.sales_name].SalesOld += parseFloat(sale.SalesOld || 0);
    acc[sale.sales_name].sales += parseFloat(sale.sales || 0);

    // Calculate close rates
    acc[sale.sales_name].closeNew =
      calculateCloseRate(
        acc[sale.sales_name].newcus,
        acc[sale.sales_name].newInbox
      ) || 0;

    acc[sale.sales_name].closeTotal =
      calculateCloseRate(
        acc[sale.sales_name].totalOrder,
        acc[sale.sales_name].newInbox
      ) || 0;

    // Add totalAdsAmount if it exists for the sales_name
    const adsAmount = adsMap[sale.sales_name] || 0;
    acc[sale.sales_name].totalAdsAmount = calculateVAT(adsAmount, vat);

    // Calculate percentages
    acc[sale.sales_name].PercentAdsNew =
      acc[sale.sales_name].SalesNew > 0
        ? (acc[sale.sales_name].totalAdsAmount / acc[sale.sales_name].SalesNew) * 100
        : 0;

    acc[sale.sales_name].PercentAdsSale =
      acc[sale.sales_name].sales > 0
        ? (acc[sale.sales_name].totalAdsAmount / acc[sale.sales_name].sales) * 100
        : 0;

    return acc;
  }, {});
};


export const calculateAdsForUserOrAll = (adsPerformance, users, selectUser) => {
  if (selectUser === "All") {
    // กรณี selectUser เป็น "All" ให้รวม adsAmount ของผู้ใช้ที่อยู่ใน users เท่านั้น
    const totalAdsAmount = users.reduce((total, username) => {
      return total + (adsPerformance[username] || 0);
    }, 0);

    return totalAdsAmount;
  } else {
    // กรณี selectUser เป็นผู้ใช้เฉพาะ ให้ส่งกลับ adsAmount ของผู้ใช้นั้น
    const userAdsAmount = adsPerformance[selectUser] || 0;
    return userAdsAmount;
  }
};

export const calculatePercentAdsPeruser = (dataAds, users, adsMap) => {

  const totalAdsAmount = users.reduce((total, username) => {
    return total + (adsMap[username] || 0);
  }, 0);
  const percent = (dataAds / totalAdsAmount) * 100
  return percent.toFixed(2) || 0


};

export const calculate = (oper, ...args) => {
  const numbers = args.map(num => parseFloat(num) || 0);

  if (numbers.length === 0) return "0.00";
  let result;

  if (oper === "+") {
    result = numbers.reduce((acc, num) => acc + parseFloat(num), 0);
  } else if (oper === "-") {
    result = numbers.reduce((acc, num) => acc - num);
  } else {
    return "Invalid operation";
  }

  return result;
}








