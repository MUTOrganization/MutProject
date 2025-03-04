const BASE_URL_LOCAL = "http://localhost:3001/api/v1";
const BASE_URL_PROD = "https://one-server.hopeful.co.th/api/v1";

export const URLS = {
  STATSPLATFORM: `${BASE_URL_PROD}/statPlatform`,
  LOGIN: `${BASE_URL_PROD}/auth/login`,
  LOGOUT: `${BASE_URL_PROD}/auth/logout`,
  SETTING: `${BASE_URL_PROD}/settings`,
  GETUSERDATA: `${BASE_URL_PROD}/auth/getUserData`,
  REFRESHTOKEN: `${BASE_URL_PROD}/auth/refreshToken`,
  REFRESHTOKENWIHTDATA: `${BASE_URL_PROD}/auth/refreshTokenWithData`,
  ADSFORM: `${BASE_URL_PROD}/adsform`,
  STATSSALE: `${BASE_URL_PROD}/sale`,
  OTHEREXPENSES: `${BASE_URL_PROD}/otherExpenses`,
  RETURNORDER: `${BASE_URL_PROD}/commission/get-returnOrder`,
  PENALTYDEDUCTION: `${BASE_URL_PROD}/commission/penaltyDeduction`,
  DOCUMENTPRODUCT: `${BASE_URL_PROD}/documentProduct`,
  DASHBOARDNIGHTCORE: `${BASE_URL_PROD}/dashboardPurchase`,

  EXCHANGE_HQ_TOKEN: `${BASE_URL_PROD}/auth/exchangeHQToken`,
  VERIFY_HQ_TOKEN: `https://hopeful-hq-server.hopeful.co.th/protected/token/hq`,

  weOne: {
    createQuest: `${BASE_URL_PROD}/weOne/add-weOne-Quest`,
    getQuestUser: `${BASE_URL_PROD}/weOne/get-weOne-Quest`,
    acceptQuestUser: `${BASE_URL_PROD}/weOne/accept-weOne-Quest`,
    inActiveQuest: `${BASE_URL_PROD}/weOne/weOne-Inactive-Quest`,

    completedQuestUser: `${BASE_URL_PROD}/weOne/complete-weOne-Quest`,
    updateQuestUser: `${BASE_URL_PROD}/weOne/update-weOne-Quest`,
    cancelQuestUser: `${BASE_URL_PROD}/weOne/return-weOne-Quest`,
    getQuestHistory: `${BASE_URL_PROD}/weOne/get-all-weOne-Quest`,
    getUserPoints: `${BASE_URL_PROD}/weOne/get-user-points`,
    getPendingQuest: `${BASE_URL_PROD}/weOne/get-weOne-pendingQuest`,
    getApproveQuest: `${BASE_URL_PROD}/weOne/approve-weOne-Quest`,
    getLatestTransfers: `${BASE_URL_PROD}/weOne/weOne-latest-transfers`,
    getNotifications: `${BASE_URL_PROD}/weOne/weOne-Notifications`,
    readNotification: `${BASE_URL_PROD}/weOne/weOne-Notifications-read`,
    confirmTransfer: `${BASE_URL_PROD}/weOne/weOne-Transfer`,

    createForm: `${BASE_URL_PROD}/weOne/weOne-Quest-Settings`,
    getForm: `${BASE_URL_PROD}/weOne/weOne-Get-Settings`,

    getReward: `${BASE_URL_PROD}/weOne/weOne-get-reward`,
    redeemReward: `${BASE_URL_PROD}/weOne/weOne-redeem-reward`,

    getRanking: `${BASE_URL_PROD}/weOne/weOne-Get-Ranking`,
    getTransferHistory: `${BASE_URL_PROD}/weOne/weOne-transfers-history`,
    inActiveForm: `${BASE_URL_PROD}/weOne/weOne-Inactive-Setting`,
  },

  users: {
    getByUsername: `${BASE_URL_PROD}/users/getByUsername`,
    getAll: `${BASE_URL_PROD}/users/getAll`,
    getCustom: `${BASE_URL_PROD}/users/getCustom`,
    getBalance: `${BASE_URL_PROD}/users/balance`,
    getByAllAccess: `${BASE_URL_PROD}/users/getByAccess/all`,
    getByAnyAccess: `${BASE_URL_PROD}/users/getByAccess/any`,
    changeRole: `${BASE_URL_PROD}/users/changeRole`,
    getHaveKpiUser: `${BASE_URL_PROD}/users/getHaveKpiUser`,
    getNoKpiUser: `${BASE_URL_PROD}/users/getNoKpiUser`,
    editUserProbs: `${BASE_URL_PROD}/users/editUserProbations`,
    updateWorkStartDate: `${BASE_URL_PROD}/users/updateWorkStartDate`,
    getManageUsers: `${BASE_URL_PROD}/users/getManageUsers`,
  },

  agent: {
    getAll: `${BASE_URL_PROD}/agents/getAll`,
    getAgentAccess: `${BASE_URL_PROD}/agents/getAgentAccess`,
    editAccess: `${BASE_URL_PROD}/access/editAgentAccess`,
    getOwnAgent: `${BASE_URL_PROD}/agents/getAgentByCustomerOwnerId`,
  },
  access: {
    add: `${BASE_URL_PROD}/access/add`,
    addGroup: `${BASE_URL_PROD}/access/addGroup`,
    edit: `${BASE_URL_PROD}/access/edit`,
    editAgentAccess: `${BASE_URL_PROD}/access/editAgentAccess`,
    delete: `${BASE_URL_PROD}/access/delete`,
    getAll: `${BASE_URL_PROD}/access/getAll`,
    getAllGroup: `${BASE_URL_PROD}/access/getAllGroup`,
    getById: `${BASE_URL_PROD}/access/getById`,
  },
  roles: {
    add: `${BASE_URL_PROD}/roles/create`,
    getall: `${BASE_URL_PROD}/roles/getAll`,
    delete: `${BASE_URL_PROD}/roles/delete`,
    getByDep: `${BASE_URL_PROD}/roles/getByDep`,
    getByAccess: `${BASE_URL_PROD}/roles/getByAccess`,
    updateLevel: `${BASE_URL_PROD}/roles/updateLevel`,
    updateLevelHq: `${BASE_URL_PROD}/roles/updateLevelHq`,
    getBaseRoleId: `${BASE_URL_PROD}/roles/getBaseRoleId`, // GET query {roleId}
  },

  roleAccess: {
    getByRoleId: `${BASE_URL_PROD}/roleAccess/getAccessByRoleId`,
    update: `${BASE_URL_PROD}/roleAccess/update`,
    getByUsername: `${BASE_URL_PROD}/roleAccess/getAccessByUsername`,
    multiAdd: `${BASE_URL_PROD}/roleAccess/addMultiple`,
    getAccessMultiRole: `${BASE_URL_PROD}/roleAccess/getAccessMultiRole`,
    updateHq: `${BASE_URL_PROD}/roleAccess/updateHq`,
    addHq: `${BASE_URL_PROD}/roleAccess/addHq`,
    deleteHq: `${BASE_URL_PROD}/roleAccess/deleteHq`,
  },
  departments: {
    getById: `${BASE_URL_PROD}/departments/getById`, //ex /departments/getById/1
    getall: `${BASE_URL_PROD}/departments/getAll`, // params : {businessId : **}
    getWithRoles: `${BASE_URL_PROD}/departments/getWithRoles`,
    add: `${BASE_URL_PROD}/departments/addDepartment`,
    edit: `${BASE_URL_PROD}/departments/editDepartment`,
    delete: `${BASE_URL_PROD}/departments/deleteDepartment`,
    getHqDepartments: `${BASE_URL_PROD}/departments/getHqDepartments`,
  },

  department_template: {
    createDepartment: `${BASE_URL_PROD}/departmentTemplates/createDepartment`,
    updateDepartment: `${BASE_URL_PROD}/departmentTemplates/updateDepartment`,
    deleteDepartment: `${BASE_URL_PROD}/departmentTemplates/deleteDepartment`,
    getDepartment: `${BASE_URL_PROD}/departmentTemplates/getDepartments`,
    createRole: `${BASE_URL_PROD}/departmentTemplates/createRole`,
    updateRole: `${BASE_URL_PROD}/departmentTemplates/updateRole`,
    deleteRole: `${BASE_URL_PROD}/departmentTemplates/deleteRole`,
    updateRoleAccess: `${BASE_URL_PROD}/departmentTemplates/updateRoleAccess`,
  },

  home_news: {
    getNews: `${BASE_URL_PROD}/homeManage/get-news`,
    getNewById: `${BASE_URL_PROD}/homeManage/get-news-id`,
    getNewsAll: `${BASE_URL_PROD}/homeManage/get-news-hq`,
    addNews: `${BASE_URL_PROD}/homeManage/add-news`,
    updateNews: `${BASE_URL_PROD}/homeManage/update-news`,
    deleteNews: `${BASE_URL_PROD}/homeManage/delete-news`,
  },

  home_education: {
    getEducation: `${BASE_URL_PROD}/homeManage/get-education`,
    getEducationById: `${BASE_URL_PROD}/homeManage/get-education-id`,
    addEducation: `${BASE_URL_PROD}/homeManage/add-education`,
    updatEeducation: `${BASE_URL_PROD}/homeManage/update-education`,
    deletEeducation: `${BASE_URL_PROD}/homeManage/delete-education`,
  },

  commission: {
    getAgentData: `${BASE_URL_PROD}/commission/get-agents`,
    getUserByOwnerId: `${BASE_URL_PROD}/commission/get-user`,
    Box1: `${BASE_URL_PROD}/commission/merged-amountLiftAdmin`,
    Box2: `${BASE_URL_PROD}/commission/get-totalOrder`,
    Box3: `${BASE_URL_PROD}/commission/get-shippingCost`,
    Box4: `${BASE_URL_PROD}/commission/get-mergedShippingCost`,
    Box5: `${BASE_URL_PROD}/paymentStatus/merged-status`,
    Box6: `${BASE_URL_PROD}/orderStatus/mergedOrder-status`,
    commissionTable: `${BASE_URL_PROD}/commission/get-mergedCommissionTable`,
    getFullYear: `${BASE_URL_PROD}/commission/getFullYearCommissionAllUser`,
    confirmCommission: `${BASE_URL_PROD}/commission`,
    getConfirmedCommission: `${BASE_URL_PROD}/commission/getConfirmedCommission`,
    getCommission: `${BASE_URL_PROD}/commission/getCommission`,
  },

  setting: {
    departments: `${BASE_URL_PROD}/settings/getDepartments`,
    updateCommission: `${BASE_URL_PROD}/settings/update-commissionSetting`,
    addCommission: `${BASE_URL_PROD}/settings/commissionSetting`,
    getCommission: `${BASE_URL_PROD}/settings/get-commissionSetting`,
    getCommissionSettingByBusiness: `${BASE_URL_PROD}/settings/getCommissionSettingByBusiness`,
    getCodCutoff: `${BASE_URL_PROD}/settings/getCodCutOffSettings`,
    updateCodCutoff: `${BASE_URL_PROD}/settings/updateCodCutOffSettings`,
    getAllCodCutoff: `${BASE_URL_PROD}/settings/getAllCodCutOffSettings`,
    addAdvancedCodCutoff: `${BASE_URL_PROD}/settings/addAdvancedCodCutOffSettings`,
  },

  dashboardCrm: {
    getCrmData: `${BASE_URL_PROD}/dashboardCrm/get-data`,
    getTalkTime: `${BASE_URL_PROD}/dashboardCrm/get-talk-time`,
    getTalkTimeChart: `${BASE_URL_PROD}/dashboardCrm/get-talk-time-chart`,
    getLeaderData: `${BASE_URL_PROD}/dashboardCrm/get/leader`,
    getRanking: `${BASE_URL_PROD}/dashboardCrm/get-ranking`,
  },

  summary: {
    Box1: `${BASE_URL_PROD}/summary/get-totalAmount`,
    Box2: `${BASE_URL_PROD}/summary/get-totalorder`,
    Box3: `${BASE_URL_PROD}/summary/get-merged-ads`,
    Box4: `${BASE_URL_PROD}/summary/get-total-inbox`,
    OrderRanking: `${BASE_URL_PROD}/summary/get-order-stat`,
    PlatformStat: `${BASE_URL_PROD}/summary/get-platform-stat`,
    TableMergedData: `${BASE_URL_PROD}/summary/get-merged-summary`,
    listAgent: `${BASE_URL_PROD}/summary/get-listAgent`,
  },

  teams: {
    getById: `${BASE_URL_PROD}/teams/getById`, //ex /teams/getById/{teamId}
    getAll: `${BASE_URL_PROD}/teams`,
    getMembers: `${BASE_URL_PROD}/teams/getMembers`,
    create: `${BASE_URL_PROD}/teams/create`,
    edit: `${BASE_URL_PROD}/teams/edit`,
    delete: `${BASE_URL_PROD}/teams/delete`, //DELETE /:teamId
    getMembersSale: `${BASE_URL_PROD}/teams/getMemberDetails/sale`, //ex /teams/getMemberDetails/sale/{teamId},
    getNotInTeamUsers: `${BASE_URL_PROD}/teams/getNotInTeamUsers`, //ex /teams/getNoTeamUsers/{depId}/{teamId}
    addMembers: `${BASE_URL_PROD}/teams/addMembers`, //POST BODY {teamId, usernames: [], createBy}
    removeMembers: `${BASE_URL_PROD}/teams/removeMembers`, //PUT BODY {teamId, usernames}
    getByLeader: `${BASE_URL_PROD}/teams/getByLeader`, //GET /:manager
    getByManager: `${BASE_URL_PROD}/teams/getByManager`, //
    getLeaders: `${BASE_URL_PROD}/teams/getLeaders`,
    addLeaders: `${BASE_URL_PROD}/teams/addLeaders`, //POST BODY {manager, leaders: []}
    removeLeaders: `${BASE_URL_PROD}/teams/removeLeaders`, //DELETE BODY {manager, leaders: []}
    getTeamByAgent: `${BASE_URL_PROD}/teams/getTeamByAgent`, //GET QUERY {businessId}
  },

  wallet: {
    getAllTopUpOrder: `${BASE_URL_PROD}/wallet/getAllTopUp`,
    getAllExpenses: `${BASE_URL_PROD}/wallet/getAllExpenses`, //GET query {username , monthCommission , fineType} ใส่หรือไม่ใส่ก็ได้
    topUp: `${BASE_URL_PROD}/wallet/topup`,
    manageTopup: `${BASE_URL_PROD}/wallet/manage`,
    topUpHistory: `${BASE_URL_PROD}/wallet/history`,
    topUpUpdateStatus: `${BASE_URL_PROD}/wallet/updateStatus`,
    editTopUp: `${BASE_URL_PROD}/wallet/editTopUp`, //POST BODY {trx,amount}
    cancelTopup: `${BASE_URL_PROD}/wallet/cancelTopUp`, // POST BODY {trx , status }
    settingImageTopUp: `${BASE_URL_PROD}/wallet/settingImageTopUp`, //POST BODY {image , businessId}
    getSettingImageTopUp: `${BASE_URL_PROD}/wallet/getSettingTopUpImage`, //GET QUERY {buinessId}
    setTopUpTransaction: `${BASE_URL_PROD}/wallet/setTopUpTransactionByAdmin`, //POST BODY { username, amount, confirmBy, status = 1, businessId }
    setBalance: `${BASE_URL_PROD}/wallet/setBalanceByAdmin`, //POST BODY { username, amount, updateBy }
    setFineLogs: `${BASE_URL_PROD}/wallet/setFineLogsByAdmin`, //POST BODY { businessId, finedUser, amount, fineType = 0 }
  },

  order: {
    getAll: `${BASE_URL_PROD}/order/getOrders`,
    //GET query parameters { orderNo,paymentType,paymentStatus,startDate,endDate,ownerId,status,createBy,upsaleUser,statusFineImposed} ไม่ใส่จะเอาทั้งหมด ของเดือนปัจุบันตั้งแต่ วันที่ 1-30/31
    refundReturnOrder: `${BASE_URL_PROD}/order/refundReturnOrder`, //POST body parameters { orderId,username,balance}
    getFinedOrder: `${BASE_URL_PROD}/order/getFinedOrders`, //GET query parameters { orderId}
    getOrderDetails: `${BASE_URL_PROD}/order/getOrderDetails`, //POST body parameters { createBy, upsaleUser, orderDateStart, orderDateEnd, paymentType, ownerId, customerOwnerId, status, finedStatus }
  },

  settingPenalty: {
    getAll: `${BASE_URL_PROD}/settingPenalty/getAll`, //GET params {businessId} ไม่ต้องใส่ก็ได้
    settingPenalty: `${BASE_URL_PROD}/settingPenalty/settingPenalty`, //POST body parameters {type Array[] businessId ,fineSetting , createBy , updateBy}
    getAllAgentPenalty: `${BASE_URL_PROD}/settingPenalty/getAllAgentPenalty`, //GET
  },
  overView: {
    getOverviewData: `${BASE_URL_PROD}/overView/overViewData`,
    getOverviewConfigData: `${BASE_URL_PROD}/overView/overViewData/Config/get/data`,
    getOverviewConfigSetting: `${BASE_URL_PROD}/overView/overViewData/Config/get`,
    getAllSetting: `${BASE_URL_PROD}/overView/overViewData/Setting`,
    createSettingForm: `${BASE_URL_PROD}/overView/overViewData/Setting/Create`,
    updateSettingForm: `${BASE_URL_PROD}/overView/overViewData/Setting/Update`,
    updateSettingConfig: `${BASE_URL_PROD}/overView/overViewData/Config/Update`,
  },

  award: {
    getMedals: `${BASE_URL_PROD}/awards/getMedals`, // GET query {id, businessId, name} - optional
    addMedal: `${BASE_URL_PROD}/awards/addMedal`, // POST body {name, image, businessId, createBy}
    updateMedal: `${BASE_URL_PROD}/awards/updateMedal`, // PUT params id && body {name, image, updateBy}
    updateMedalTier: `${BASE_URL_PROD}/awards/updateMedalTier`, //PUT BODY {medals}
    deleteMedal: `${BASE_URL_PROD}/awards/deleteMedal`, // DELETE params id

    getAwardById: `${BASE_URL_PROD}/awards/getAwardById`, // GET params {id}
    getAwardsByRole: `${BASE_URL_PROD}/awards/getAwardsByRole`, // GET query {year,roleId}
    getAwards: `${BASE_URL_PROD}/awards/getAwards`, // GET query {businessId,year,medalId}
    addAward: `${BASE_URL_PROD}/awards/addAward`, // POST body {medalId,awardTitle,awardDesc,image,year,businessId,createBy}
    updateAward: `${BASE_URL_PROD}/awards/updateAward`, // PUT params id && body {medalId,awardTitle,awardDesc,image,updateBy}
    deleteAward: `${BASE_URL_PROD}/awards/deleteAward`, // DELETE params id

    getConditions: `${BASE_URL_PROD}/awards/getConditions`, // GET query {businessId,baseRole,year}
    getAdsCondition: `${BASE_URL_PROD}/awards/getAdsCondition`, // GET query {businessId,baseRole,year}
    addCondition: `${BASE_URL_PROD}/awards/addCondition`, // POST body {baseRole,conditionRoleLevel,condition,medalId,year,type,businessId,createBy}
    updateAdsCondition: `${BASE_URL_PROD}/awards/updateAdsCondition`, // PUT body {baseRole,condition,year}
    updateCondition: `${BASE_URL_PROD}/awards/updateCondition`, // PUT params id && body {baseRole,conditionRoleLevel,condition,medalId,type,updateBy}
    deleteAdsCondition: `${BASE_URL_PROD}/awards/deleteAdsCondition`, // DELETE body {year}
    deleteCondition: `${BASE_URL_PROD}/awards/deleteCondition`, // DELETE params id

    updateMultipleCondition: `${BASE_URL_PROD}/awards/updateMultipleCondition`, // PUT body {baseRole,conditionRoleLevel,condition,medalId,type,updateBy}
    deleteMultipleCondition: `${BASE_URL_PROD}/awards/deleteMultipleCondition`, // DELETE body {baseRole,year}

    getCurrentAward: `${BASE_URL_PROD}/awards/getCurrentAward`, // GET query {year,userName}
    getUserAwards: `${BASE_URL_PROD}/awards/getUserAwards`, // GET query {year,userName}
    getAllYears: `${BASE_URL_PROD}/awards/getAllYears`, // GET query {businessId}
    getCurrentAward: `${BASE_URL_PROD}/awards/getCurrentAward`, // GET query {year,userName}
    getUserAwards: `${BASE_URL_PROD}/awards/getUserAwards`, // GET query {year,userName}
    getAllYears: `${BASE_URL_PROD}/awards/getAllYears`, // GET query {businessId}
  },

  okr : {
    getGradeSetting : `${BASE_URL_LOCAL}/okr/getGradeSettings`, // GET query {businessId,year}

    updateGradeSetting : `${BASE_URL_LOCAL}/okr/updateGradeSetting`, // POST body {businessId , year ,grades}
  },

  googleCloud: {
    topUp: `https://storage.googleapis.com/hopeful-wellness/topup/`,
    settingImageTopUp: `https://storage.googleapis.com/hopeful-wellness/settingTopUp/`,
    medal: `https://storage.googleapis.com/hopeful-wellness/medals/`,
    award: `https://storage.googleapis.com/hopeful-wellness/award/`,
  },

  WebContent: {
    //fetch All List
    getList: `${BASE_URL_PROD}/hopefulContent/get/ListContent`,
    // List
    createList: `${BASE_URL_PROD}/hopefulContent/create/list`,
    updateList: `${BASE_URL_PROD}/hopefulContent/update/list`,
    deleteList: `${BASE_URL_PROD}/hopefulContent/delete/list`,
    // Group
    createGroup: `${BASE_URL_PROD}/hopefulContent/create/group`,
    updateGroup: `${BASE_URL_PROD}/hopefulContent/update/group`,
    deleteGroup: `${BASE_URL_PROD}/hopefulContent/delete/group`,
    // Items
    createItem: `${BASE_URL_PROD}/hopefulContent/create/item`,
    updateItem: `${BASE_URL_PROD}/hopefulContent/update/item`,
    deleteItem: `${BASE_URL_PROD}/hopefulContent/delete/item`,
    //fetch All booking
    getBookings: `${BASE_URL_PROD}/hopefulContent/get/bookings`,

    createBookings: `${BASE_URL_PROD}/hopefulContent/create/booking`,
    updateBooking: `${BASE_URL_PROD}/hopefulContent/update/booking`,
    deleteBooking: `${BASE_URL_PROD}/hopefulContent/delete/booking`,
    accessBooking: `${BASE_URL_PROD}/hopefulContent/acess/booking`,

    createWebhook: `${BASE_URL_PROD}/hopefulContent/create/webhook`,
    getCoupon: `${BASE_URL_PROD}/hopefulContent/get/coupon`,
    allCoupon: `${BASE_URL_PROD}/hopefulContent/get/all/coupons`,
    useCoupon: `${BASE_URL_PROD}/hopefulContent/redeem/coupon`,

    getRate: `${BASE_URL_PROD}/hopefulContent/get/rate`,
    createRate: `${BASE_URL_PROD}/hopefulContent/create/rate`,

    getNews: `${BASE_URL_PROD}/hopefulContent/get/all/news`,
    createNews: `${BASE_URL_PROD}/hopefulContent/create/news`,
    updateNews: `${BASE_URL_PROD}/hopefulContent/update/news`,
    deleteNews: `${BASE_URL_PROD}/hopefulContent/delete/news`,

    getCase: `${BASE_URL_PROD}/hopefulContent/get/case`,
    createCase: `${BASE_URL_PROD}/hopefulContent/create/case`,
  },
};

// !!! ไม่ใช้แล้ว ไปเพื่มใน Sidebar ทีเดียว
// export const menuPath = {
//   home: "/home",
//   setting: "/setting",
//   management: "/management",
//   dev: "/dev",
//   DashboardSummary: "/Dashboard-Summary",
//   ExpenseReport: "/ExpenseReport",
//   DashboardStatsPlatform: "/Dashboard-StatsPlatform",
//   DashBoardSale: "/Dashboard-Sale",
//   DashBoardAds: "/Dashboard-Ads",
//   DashBoardCRM: "/Dashboard-CRM",
//   Commission: "/Commission",
//   HistoryTopup: '/HistoryTopUp',
//   ConfirmCommssion: '/ConfirmCommission',
//   TransactionHistory: '/TransactionHistory',
// }

// export const menuText = {
//   home: "หน้าแรก",
//   setting: "การตั้งค่า",
//   management: "การจัดการ",
//   dev: "Dev Hopeful",
//   DashboardSummary: "Summary",
//   ExpenseReport: "ค่าใช้จ่าย",
//   DashboardStatsPlatform: "StatsPlatform",
//   DashBoardSale: "Dashboar Sale",
//   DashBoardAds: "Dashboard Ads",
//   DashBoardCRM: "Dashboard CRM",
//   Commission: "คอมมิชชัน",
//   HistoryTopup: 'เติมเงิน',
//   ConfirmCommssion: 'ยืนยันค่าคอม',
//   TransactionHistory: 'ประวัติการทำธุรกรรม',
// }
