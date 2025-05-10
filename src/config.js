const BASE_URL_LOCAL = "http://localhost:3001/api/v1";
const BASE_URL_PROD = "https://one-server.hopeful.co.th/api/v1";

export const URLS = {
  STATSPLATFORM: `${BASE_URL_LOCAL}/statPlatform`,
  LOGIN: `${BASE_URL_LOCAL}/auth/login`,
  LOGOUT: `${BASE_URL_LOCAL}/auth/logout`,
  SETTING: `${BASE_URL_LOCAL}/settings`,
  GETUSERDATA: `${BASE_URL_LOCAL}/auth/getUserData`,
  REFRESHTOKEN: `${BASE_URL_LOCAL}/auth/refreshToken`,
  REFRESHTOKENWIHTDATA: `${BASE_URL_LOCAL}/auth/refreshTokenWithData`,
  ADSFORM: `${BASE_URL_LOCAL}/adsform`,
  STATSSALE: `${BASE_URL_LOCAL}/sale`,
  OTHEREXPENSES: `${BASE_URL_LOCAL}/otherExpenses`,
  RETURNORDER: `${BASE_URL_LOCAL}/commission/get-returnOrder`,
  PENALTYDEDUCTION: `${BASE_URL_LOCAL}/commission/penaltyDeduction`,
  DOCUMENTPRODUCT: `${BASE_URL_LOCAL}/documentProduct`,
  DASHBOARDNIGHTCORE: `${BASE_URL_LOCAL}/dashboardPurchase`,

  EXCHANGE_HQ_TOKEN: `${BASE_URL_LOCAL}/auth/exchangeHQToken`,
  VERIFY_HQ_TOKEN: `https://hopeful-hq-server.hopeful.co.th/protected/token/hq`,

  weOne: {
    createQuest: `${BASE_URL_LOCAL}/weOne/add-weOne-Quest`,
    getQuestUser: `${BASE_URL_LOCAL}/weOne/get-weOne-Quest`,
    acceptQuestUser: `${BASE_URL_LOCAL}/weOne/accept-weOne-Quest`,
    inActiveQuest: `${BASE_URL_LOCAL}/weOne/weOne-Inactive-Quest`,

    completedQuestUser: `${BASE_URL_LOCAL}/weOne/complete-weOne-Quest`,
    updateQuestUser: `${BASE_URL_LOCAL}/weOne/update-weOne-Quest`,
    cancelQuestUser: `${BASE_URL_LOCAL}/weOne/return-weOne-Quest`,
    getQuestHistory: `${BASE_URL_LOCAL}/weOne/get-all-weOne-Quest`,
    getUserPoints: `${BASE_URL_LOCAL}/weOne/get-user-points`,
    getPendingQuest: `${BASE_URL_LOCAL}/weOne/get-weOne-pendingQuest`,
    getApproveQuest: `${BASE_URL_LOCAL}/weOne/approve-weOne-Quest`,
    getLatestTransfers: `${BASE_URL_LOCAL}/weOne/weOne-latest-transfers`,
    getNotifications: `${BASE_URL_LOCAL}/weOne/weOne-Notifications`,
    readNotification: `${BASE_URL_LOCAL}/weOne/weOne-Notifications-read`,
    confirmTransfer: `${BASE_URL_LOCAL}/weOne/weOne-Transfer`,

    createForm: `${BASE_URL_LOCAL}/weOne/weOne-Quest-Settings`,
    getForm: `${BASE_URL_LOCAL}/weOne/weOne-Get-Settings`,

    getReward: `${BASE_URL_LOCAL}/weOne/weOne-get-reward`,
    redeemReward: `${BASE_URL_LOCAL}/weOne/weOne-redeem-reward`,

    getRanking: `${BASE_URL_LOCAL}/weOne/weOne-Get-Ranking`,
    getTransferHistory: `${BASE_URL_LOCAL}/weOne/weOne-transfers-history`,
    inActiveForm: `${BASE_URL_LOCAL}/weOne/weOne-Inactive-Setting`,
  },

  users: {
    getByUsername: `${BASE_URL_LOCAL}/users/getByUsername`,
    getAll: `${BASE_URL_LOCAL}/users/getAll`,
    getCustom: `${BASE_URL_LOCAL}/users/getCustom`,
    getBalance: `${BASE_URL_LOCAL}/users/balance`,
    getByAllAccess: `${BASE_URL_LOCAL}/users/getByAccess/all`,
    getByAnyAccess: `${BASE_URL_LOCAL}/users/getByAccess/any`,
    changeRole: `${BASE_URL_LOCAL}/users/changeRole`,
    getHaveKpiUser: `${BASE_URL_LOCAL}/users/getHaveKpiUser`,
    getNoKpiUser: `${BASE_URL_LOCAL}/users/getNoKpiUser`,
    editUserProbs: `${BASE_URL_LOCAL}/users/editUserProbations`,
    updateWorkStartDate: `${BASE_URL_LOCAL}/users/updateWorkStartDate`,
    getManageUsers: `${BASE_URL_LOCAL}/users/getManageUsers`,
  },

  agent: {
    getAll: `${BASE_URL_LOCAL}/agents/getAll`,
    getAgentAccess: `${BASE_URL_LOCAL}/agents/getAgentAccess`,
    editAccess: `${BASE_URL_LOCAL}/access/editAgentAccess`,
    getOwnAgent: `${BASE_URL_LOCAL}/agents/getAgentByCustomerOwnerId`,
  },
  access: {
    add: `${BASE_URL_LOCAL}/access/add`,
    addGroup: `${BASE_URL_LOCAL}/access/addGroup`,
    edit: `${BASE_URL_LOCAL}/access/edit`,
    editAgentAccess: `${BASE_URL_LOCAL}/access/editAgentAccess`,
    delete: `${BASE_URL_LOCAL}/access/delete`,
    getAll: `${BASE_URL_LOCAL}/access/getAll`,
    getAllGroup: `${BASE_URL_LOCAL}/access/getAllGroup`,
    getById: `${BASE_URL_LOCAL}/access/getById`,
  },
  roles: {
    add: `${BASE_URL_LOCAL}/roles/create`,
    getall: `${BASE_URL_LOCAL}/roles/getAll`,
    delete: `${BASE_URL_LOCAL}/roles/delete`,
    getByDep: `${BASE_URL_LOCAL}/roles/getByDep`,
    getByAccess: `${BASE_URL_LOCAL}/roles/getByAccess`,
    updateLevel: `${BASE_URL_LOCAL}/roles/updateLevel`,
    updateLevelHq: `${BASE_URL_LOCAL}/roles/updateLevelHq`,
    getBaseRoleId: `${BASE_URL_LOCAL}/roles/getBaseRoleId`, // GET query {roleId}
  },

  roleAccess: {
    getByRoleId: `${BASE_URL_LOCAL}/roleAccess/getAccessByRoleId`,
    update: `${BASE_URL_LOCAL}/roleAccess/update`,
    getByUsername: `${BASE_URL_LOCAL}/roleAccess/getAccessByUsername`,
    multiAdd: `${BASE_URL_LOCAL}/roleAccess/addMultiple`,
    getAccessMultiRole: `${BASE_URL_LOCAL}/roleAccess/getAccessMultiRole`,
    updateHq: `${BASE_URL_LOCAL}/roleAccess/updateHq`,
    addHq: `${BASE_URL_LOCAL}/roleAccess/addHq`,
    deleteHq: `${BASE_URL_LOCAL}/roleAccess/deleteHq`,
  },
  departments: {
    getById: `${BASE_URL_LOCAL}/departments/getById`, //ex /departments/getById/1
    getall: `${BASE_URL_LOCAL}/departments/getAll`, // params : {businessId : **}
    getWithRoles: `${BASE_URL_LOCAL}/departments/getWithRoles`,
    add: `${BASE_URL_LOCAL}/departments/addDepartment`,
    edit: `${BASE_URL_LOCAL}/departments/editDepartment`,
    delete: `${BASE_URL_LOCAL}/departments/deleteDepartment`,
    getHqDepartments: `${BASE_URL_LOCAL}/departments/getHqDepartments`,
  },

  department_template: {
    createDepartment: `${BASE_URL_LOCAL}/departmentTemplates/createDepartment`,
    updateDepartment: `${BASE_URL_LOCAL}/departmentTemplates/updateDepartment`,
    deleteDepartment: `${BASE_URL_LOCAL}/departmentTemplates/deleteDepartment`,
    getDepartment: `${BASE_URL_LOCAL}/departmentTemplates/getDepartments`,
    createRole: `${BASE_URL_LOCAL}/departmentTemplates/createRole`,
    updateRole: `${BASE_URL_LOCAL}/departmentTemplates/updateRole`,
    deleteRole: `${BASE_URL_LOCAL}/departmentTemplates/deleteRole`,
    updateRoleAccess: `${BASE_URL_LOCAL}/departmentTemplates/updateRoleAccess`,
  },

  home_news: {
    getNews: `${BASE_URL_LOCAL}/homeManage/get-news`,
    getNewById: `${BASE_URL_LOCAL}/homeManage/get-news-id`,
    getNewsAll: `${BASE_URL_LOCAL}/homeManage/get-news-hq`,
    addNews: `${BASE_URL_LOCAL}/homeManage/add-news`,
    updateNews: `${BASE_URL_LOCAL}/homeManage/update-news`,
    deleteNews: `${BASE_URL_LOCAL}/homeManage/delete-news`,
  },

  home_education: {
    getEducation: `${BASE_URL_LOCAL}/homeManage/get-education`,
    getEducationById: `${BASE_URL_LOCAL}/homeManage/get-education-id`,
    addEducation: `${BASE_URL_LOCAL}/homeManage/add-education`,
    updatEeducation: `${BASE_URL_LOCAL}/homeManage/update-education`,
    deletEeducation: `${BASE_URL_LOCAL}/homeManage/delete-education`,
  },

  commission: {
    getAgentData: `${BASE_URL_LOCAL}/commission/get-agents`,
    getUserByOwnerId: `${BASE_URL_LOCAL}/commission/get-user`,
    Box1: `${BASE_URL_LOCAL}/commission/merged-amountLiftAdmin`,
    Box2: `${BASE_URL_LOCAL}/commission/get-totalOrder`,
    Box3: `${BASE_URL_LOCAL}/commission/get-shippingCost`,
    Box4: `${BASE_URL_LOCAL}/commission/get-mergedShippingCost`,
    Box5: `${BASE_URL_LOCAL}/paymentStatus/merged-status`,
    Box6: `${BASE_URL_LOCAL}/orderStatus/mergedOrder-status`,
    commissionTable: `${BASE_URL_LOCAL}/commission/get-mergedCommissionTable`,
    getFullYear: `${BASE_URL_LOCAL}/commission/getFullYearCommissionAllUser`,
    confirmCommission: `${BASE_URL_LOCAL}/commission`,
    getConfirmedCommission: `${BASE_URL_LOCAL}/commission/getConfirmedCommission`,
    getCommission: `${BASE_URL_LOCAL}/commission/getCommission`,
  },

  setting: {
    departments: `${BASE_URL_LOCAL}/settings/getDepartments`,
    updateCommission: `${BASE_URL_LOCAL}/settings/update-commissionSetting`,
    addCommission: `${BASE_URL_LOCAL}/settings/commissionSetting`,
    getCommission: `${BASE_URL_LOCAL}/settings/get-commissionSetting`,
    getCommissionSettingByBusiness: `${BASE_URL_LOCAL}/settings/getCommissionSettingByBusiness`,
    getCodCutoff: `${BASE_URL_LOCAL}/settings/getCodCutOffSettings`,
    updateCodCutoff: `${BASE_URL_LOCAL}/settings/updateCodCutOffSettings`,
    getAllCodCutoff: `${BASE_URL_LOCAL}/settings/getAllCodCutOffSettings`,
    addAdvancedCodCutoff: `${BASE_URL_LOCAL}/settings/addAdvancedCodCutOffSettings`,
  },

  dashboardCrm: {
    getCrmData: `${BASE_URL_LOCAL}/dashboardCrm/get-data`,
    getTalkTime: `${BASE_URL_LOCAL}/dashboardCrm/get-talk-time`,
    getTalkTimeChart: `${BASE_URL_LOCAL}/dashboardCrm/get-talk-time-chart`,
    getLeaderData: `${BASE_URL_LOCAL}/dashboardCrm/get/leader`,
    getRanking: `${BASE_URL_LOCAL}/dashboardCrm/get-ranking`,
  },

  summary: {
    Box1: `${BASE_URL_LOCAL}/summary/get-totalAmount`,
    Box2: `${BASE_URL_LOCAL}/summary/get-totalorder`,
    Box3: `${BASE_URL_LOCAL}/summary/get-merged-ads`,
    Box4: `${BASE_URL_LOCAL}/summary/get-total-inbox`,
    OrderRanking: `${BASE_URL_LOCAL}/summary/get-order-stat`,
    PlatformStat: `${BASE_URL_LOCAL}/summary/get-platform-stat`,
    TableMergedData: `${BASE_URL_LOCAL}/summary/get-merged-summary`,
    listAgent: `${BASE_URL_LOCAL}/summary/get-listAgent`,
  },

  teams: {
    getById: `${BASE_URL_LOCAL}/teams/getById`, //ex /teams/getById/{teamId}
    getAll: `${BASE_URL_LOCAL}/teams`,
    getMembers: `${BASE_URL_LOCAL}/teams/getMembers`,
    create: `${BASE_URL_LOCAL}/teams/create`,
    edit: `${BASE_URL_LOCAL}/teams/edit`,
    delete: `${BASE_URL_LOCAL}/teams/delete`, //DELETE /:teamId
    getMembersSale: `${BASE_URL_LOCAL}/teams/getMemberDetails/sale`, //ex /teams/getMemberDetails/sale/{teamId},
    getNotInTeamUsers: `${BASE_URL_LOCAL}/teams/getNotInTeamUsers`, //ex /teams/getNoTeamUsers/{depId}/{teamId}
    addMembers: `${BASE_URL_LOCAL}/teams/addMembers`, //POST BODY {teamId, usernames: [], createBy}
    removeMembers: `${BASE_URL_LOCAL}/teams/removeMembers`, //PUT BODY {teamId, usernames}
    getByLeader: `${BASE_URL_LOCAL}/teams/getByLeader`, //GET /:manager
    getByManager: `${BASE_URL_LOCAL}/teams/getByManager`, //
    getLeaders: `${BASE_URL_LOCAL}/teams/getLeaders`,
    addLeaders: `${BASE_URL_LOCAL}/teams/addLeaders`, //POST BODY {manager, leaders: []}
    removeLeaders: `${BASE_URL_LOCAL}/teams/removeLeaders`, //DELETE BODY {manager, leaders: []}
    getTeamByAgent: `${BASE_URL_LOCAL}/teams/getTeamByAgent`, //GET QUERY {businessId}
  },

  wallet: {
    getAllTopUpOrder: `${BASE_URL_LOCAL}/wallet/getAllTopUp`,
    getAllExpenses: `${BASE_URL_LOCAL}/wallet/getAllExpenses`, //GET query {username , monthCommission , fineType} ใส่หรือไม่ใส่ก็ได้
    topUp: `${BASE_URL_LOCAL}/wallet/topup`,
    manageTopup: `${BASE_URL_LOCAL}/wallet/manage`,
    topUpHistory: `${BASE_URL_LOCAL}/wallet/history`,
    topUpUpdateStatus: `${BASE_URL_LOCAL}/wallet/updateStatus`,
    editTopUp: `${BASE_URL_LOCAL}/wallet/editTopUp`, //POST BODY {trx,amount}
    cancelTopup: `${BASE_URL_LOCAL}/wallet/cancelTopUp`, // POST BODY {trx , status }
    settingImageTopUp: `${BASE_URL_LOCAL}/wallet/settingImageTopUp`, //POST BODY {image , businessId}
    getSettingImageTopUp: `${BASE_URL_LOCAL}/wallet/getSettingTopUpImage`, //GET QUERY {buinessId}
    setTopUpTransaction: `${BASE_URL_LOCAL}/wallet/setTopUpTransactionByAdmin`, //POST BODY { username, amount, confirmBy, status = 1, businessId }
    setBalance: `${BASE_URL_LOCAL}/wallet/setBalanceByAdmin`, //POST BODY { username, amount, updateBy }
    setFineLogs: `${BASE_URL_LOCAL}/wallet/setFineLogsByAdmin`, //POST BODY { businessId, finedUser, amount, fineType = 0 }
  },

  order: {
    getAll: `${BASE_URL_LOCAL}/order/getOrders`,
    //GET query parameters { orderNo,paymentType,paymentStatus,startDate,endDate,ownerId,status,createBy,upsaleUser,statusFineImposed} ไม่ใส่จะเอาทั้งหมด ของเดือนปัจุบันตั้งแต่ วันที่ 1-30/31
    refundReturnOrder: `${BASE_URL_LOCAL}/order/refundReturnOrder`, //POST body parameters { orderId,username,balance}
    getFinedOrder: `${BASE_URL_LOCAL}/order/getFinedOrders`, //GET query parameters { orderId}
    getOrderDetails: `${BASE_URL_LOCAL}/order/getOrderDetails`, //POST body parameters { createBy, upsaleUser, orderDateStart, orderDateEnd, paymentType, ownerId, customerOwnerId, status, finedStatus }
  },

  settingPenalty: {
    getAll: `${BASE_URL_LOCAL}/settingPenalty/getAll`, //GET params {businessId} ไม่ต้องใส่ก็ได้
    settingPenalty: `${BASE_URL_LOCAL}/settingPenalty/settingPenalty`, //POST body parameters {type Array[] businessId ,fineSetting , createBy , updateBy}
    getAllAgentPenalty: `${BASE_URL_LOCAL}/settingPenalty/getAllAgentPenalty`, //GET
  },
  overView: {
    getOverviewData: `${BASE_URL_LOCAL}/overView/overViewData`,
    getOverviewConfigData: `${BASE_URL_LOCAL}/overView/overViewData/Config/get/data`,
    getOverviewConfigSetting: `${BASE_URL_LOCAL}/overView/overViewData/Config/get`,
    getAllSetting: `${BASE_URL_LOCAL}/overView/overViewData/Setting`,
    createSettingForm: `${BASE_URL_LOCAL}/overView/overViewData/Setting/Create`,
    updateSettingForm: `${BASE_URL_LOCAL}/overView/overViewData/Setting/Update`,
    updateSettingConfig: `${BASE_URL_LOCAL}/overView/overViewData/Config/Update`,
  },

  award: {
    getMedals: `${BASE_URL_LOCAL}/awards/getMedals`, // GET query {id, businessId, name} - optional
    addMedal: `${BASE_URL_LOCAL}/awards/addMedal`, // POST body {name, image, businessId, createBy}
    updateMedal: `${BASE_URL_LOCAL}/awards/updateMedal`, // PUT params id && body {name, image, updateBy}
    updateMedalTier: `${BASE_URL_LOCAL}/awards/updateMedalTier`, //PUT BODY {medals}
    deleteMedal: `${BASE_URL_LOCAL}/awards/deleteMedal`, // DELETE params id

    getAwardById: `${BASE_URL_LOCAL}/awards/getAwardById`, // GET params {id}
    getAwardsByRole: `${BASE_URL_LOCAL}/awards/getAwardsByRole`, // GET query {year,roleId}
    getAwards: `${BASE_URL_LOCAL}/awards/getAwards`, // GET query {businessId,year,medalId}
    addAward: `${BASE_URL_LOCAL}/awards/addAward`, // POST body {medalId,awardTitle,awardDesc,image,year,businessId,createBy}
    updateAward: `${BASE_URL_LOCAL}/awards/updateAward`, // PUT params id && body {medalId,awardTitle,awardDesc,image,updateBy}
    deleteAward: `${BASE_URL_LOCAL}/awards/deleteAward`, // DELETE params id

    getConditions: `${BASE_URL_LOCAL}/awards/getConditions`, // GET query {businessId,baseRole,year}
    getAdsCondition: `${BASE_URL_LOCAL}/awards/getAdsCondition`, // GET query {businessId,baseRole,year}
    addCondition: `${BASE_URL_LOCAL}/awards/addCondition`, // POST body {baseRole,conditionRoleLevel,condition,medalId,year,type,businessId,createBy}
    updateAdsCondition: `${BASE_URL_LOCAL}/awards/updateAdsCondition`, // PUT body {baseRole,condition,year}
    updateCondition: `${BASE_URL_LOCAL}/awards/updateCondition`, // PUT params id && body {baseRole,conditionRoleLevel,condition,medalId,type,updateBy}
    deleteAdsCondition: `${BASE_URL_LOCAL}/awards/deleteAdsCondition`, // DELETE body {year}
    deleteCondition: `${BASE_URL_LOCAL}/awards/deleteCondition`, // DELETE params id

    updateMultipleCondition: `${BASE_URL_LOCAL}/awards/updateMultipleCondition`, // PUT body {baseRole,conditionRoleLevel,condition,medalId,type,updateBy}
    deleteMultipleCondition: `${BASE_URL_LOCAL}/awards/deleteMultipleCondition`, // DELETE body {baseRole,year}

    getCurrentAward: `${BASE_URL_LOCAL}/awards/getCurrentAward`, // GET query {year,userName}
    getUserAwards: `${BASE_URL_LOCAL}/awards/getUserAwards`, // GET query {year,userName}
    getAllYears: `${BASE_URL_LOCAL}/awards/getAllYears`, // GET query {businessId}
    getCurrentAward: `${BASE_URL_LOCAL}/awards/getCurrentAward`, // GET query {year,userName}
    getUserAwards: `${BASE_URL_LOCAL}/awards/getUserAwards`, // GET query {year,userName}
    getAllYears: `${BASE_URL_LOCAL}/awards/getAllYears`, // GET query {businessId}
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
    getList: `${BASE_URL_LOCAL}/hopefulContent/get/ListContent`,
    // List
    createList: `${BASE_URL_LOCAL}/hopefulContent/create/list`,
    updateList: `${BASE_URL_LOCAL}/hopefulContent/update/list`,
    deleteList: `${BASE_URL_LOCAL}/hopefulContent/delete/list`,
    // Group
    createGroup: `${BASE_URL_LOCAL}/hopefulContent/create/group`,
    updateGroup: `${BASE_URL_LOCAL}/hopefulContent/update/group`,
    deleteGroup: `${BASE_URL_LOCAL}/hopefulContent/delete/group`,
    // Items
    createItem: `${BASE_URL_LOCAL}/hopefulContent/create/item`,
    updateItem: `${BASE_URL_LOCAL}/hopefulContent/update/item`,
    deleteItem: `${BASE_URL_LOCAL}/hopefulContent/delete/item`,
    //fetch All booking
    getBookings: `${BASE_URL_LOCAL}/hopefulContent/get/bookings`,

    createBookings: `${BASE_URL_LOCAL}/hopefulContent/create/booking`,
    updateBooking: `${BASE_URL_LOCAL}/hopefulContent/update/booking`,
    deleteBooking: `${BASE_URL_LOCAL}/hopefulContent/delete/booking`,
    accessBooking: `${BASE_URL_LOCAL}/hopefulContent/acess/booking`,

    createWebhook: `${BASE_URL_LOCAL}/hopefulContent/create/webhook`,
    getCoupon: `${BASE_URL_LOCAL}/hopefulContent/get/coupon`,
    allCoupon: `${BASE_URL_LOCAL}/hopefulContent/get/all/coupons`,
    useCoupon: `${BASE_URL_LOCAL}/hopefulContent/redeem/coupon`,

    getRate: `${BASE_URL_LOCAL}/hopefulContent/get/rate`,
    createRate: `${BASE_URL_LOCAL}/hopefulContent/create/rate`,

    getNews: `${BASE_URL_LOCAL}/hopefulContent/get/all/news`,
    createNews: `${BASE_URL_LOCAL}/hopefulContent/create/news`,
    updateNews: `${BASE_URL_LOCAL}/hopefulContent/update/news`,
    deleteNews: `${BASE_URL_LOCAL}/hopefulContent/delete/news`,

    getCase: `${BASE_URL_LOCAL}/hopefulContent/get/case`,
    createCase: `${BASE_URL_LOCAL}/hopefulContent/create/case`,
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
