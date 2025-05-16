const BASE_URL_LOCAL = "http://localhost:3001/api/v1/";
const BASE_URL_PROD = "https://one-server.hopeful.co.th/api/v1/";

export const BASE_URL = BASE_URL_LOCAL;




export const URLS = {
  STATSPLATFORM: `${BASE_URL}/statPlatform`,
  LOGIN: `${BASE_URL}/auth/login`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  SETTING: `${BASE_URL}/settings`,
  GETUSERDATA: `${BASE_URL}/auth/getUserData`,
  REFRESHTOKEN: `${BASE_URL}/auth/refreshToken`,
  REFRESHTOKENWIHTDATA: `${BASE_URL}/auth/refreshTokenWithData`,
  ADSFORM: `${BASE_URL}/adsform`,
  STATSSALE: `${BASE_URL}/sale`,
  OTHEREXPENSES: `${BASE_URL}/otherExpenses`,
  RETURNORDER: `${BASE_URL}/commission/get-returnOrder`,
  PENALTYDEDUCTION: `${BASE_URL}/commission/penaltyDeduction`,
  DOCUMENTPRODUCT: `${BASE_URL}/documentProduct`,
  DASHBOARDNIGHTCORE: `${BASE_URL}/dashboardPurchase`,

  EXCHANGE_HQ_TOKEN: `${BASE_URL}/auth/exchangeHQToken`,
  VERIFY_HQ_TOKEN: `https://hopeful-hq-server.hopeful.co.th/protected/token/hq`,

  weOne: {
    createQuest: `${BASE_URL}/weOne/add-weOne-Quest`,
    getQuestUser: `${BASE_URL}/weOne/get-weOne-Quest`,
    acceptQuestUser: `${BASE_URL}/weOne/accept-weOne-Quest`,
    inActiveQuest: `${BASE_URL}/weOne/weOne-Inactive-Quest`,

    completedQuestUser: `${BASE_URL}/weOne/complete-weOne-Quest`,
    updateQuestUser: `${BASE_URL}/weOne/update-weOne-Quest`,
    cancelQuestUser: `${BASE_URL}/weOne/return-weOne-Quest`,
    getQuestHistory: `${BASE_URL}/weOne/get-all-weOne-Quest`,
    getUserPoints: `${BASE_URL}/weOne/get-user-points`,
    getPendingQuest: `${BASE_URL}/weOne/get-weOne-pendingQuest`,
    getApproveQuest: `${BASE_URL}/weOne/approve-weOne-Quest`,
    getLatestTransfers: `${BASE_URL}/weOne/weOne-latest-transfers`,
    getNotifications: `${BASE_URL}/weOne/weOne-Notifications`,
    readNotification: `${BASE_URL}/weOne/weOne-Notifications-read`,
    confirmTransfer: `${BASE_URL}/weOne/weOne-Transfer`,

    createForm: `${BASE_URL}/weOne/weOne-Quest-Settings`,
    getForm: `${BASE_URL}/weOne/weOne-Get-Settings`,

    getReward: `${BASE_URL}/weOne/weOne-get-reward`,
    redeemReward: `${BASE_URL}/weOne/weOne-redeem-reward`,

    getRanking: `${BASE_URL}/weOne/weOne-Get-Ranking`,
    getTransferHistory: `${BASE_URL}/weOne/weOne-transfers-history`,
    inActiveForm: `${BASE_URL}/weOne/weOne-Inactive-Setting`,
  },

  users: {
    getByUsername: `${BASE_URL}/users/getByUsername`,
    getAll: `${BASE_URL}/users/getAll`,
    getCustom: `${BASE_URL}/users/getCustom`,
    getBalance: `${BASE_URL}/users/balance`,
    getByAllAccess: `${BASE_URL}/users/getByAccess/all`,
    getByAnyAccess: `${BASE_URL}/users/getByAccess/any`,
    changeRole: `${BASE_URL}/users/changeRole`,
    getHaveKpiUser: `${BASE_URL}/users/getHaveKpiUser`,
    getNoKpiUser: `${BASE_URL}/users/getNoKpiUser`,
    editUserProbs: `${BASE_URL}/users/editUserProbations`,
    updateWorkStartDate: `${BASE_URL}/users/updateWorkStartDate`,
    getManageUsers: `${BASE_URL}/users/getManageUsers`,
  },

  agent: {
    getAll: `${BASE_URL}/agents/getAll`,
    getAgentAccess: `${BASE_URL}/agents/getAgentAccess`,
    editAccess: `${BASE_URL}/access/editAgentAccess`,
    getOwnAgent: `${BASE_URL}/agents/getAgentByCustomerOwnerId`,
  },
  access: {
    add: `${BASE_URL}/access/add`,
    addGroup: `${BASE_URL}/access/addGroup`,
    edit: `${BASE_URL}/access/edit`,
    editAgentAccess: `${BASE_URL}/access/editAgentAccess`,
    delete: `${BASE_URL}/access/delete`,
    getAll: `${BASE_URL}/access/getAll`,
    getAllGroup: `${BASE_URL}/access/getAllGroup`,
    getById: `${BASE_URL}/access/getById`,
  },
  roles: {
    add: `${BASE_URL}/roles/create`,
    getall: `${BASE_URL}/roles/getAll`,
    delete: `${BASE_URL}/roles/delete`,
    getByDep: `${BASE_URL}/roles/getByDep`,
    getByAccess: `${BASE_URL}/roles/getByAccess`,
    updateLevel: `${BASE_URL}/roles/updateLevel`,
    updateLevelHq: `${BASE_URL}/roles/updateLevelHq`,
    getBaseRoleId: `${BASE_URL}/roles/getBaseRoleId`, // GET query {roleId}
  },

  roleAccess: {
    getByRoleId: `${BASE_URL}/roleAccess/getAccessByRoleId`,
    update: `${BASE_URL}/roleAccess/update`,
    getByUsername: `${BASE_URL}/roleAccess/getAccessByUsername`,
    multiAdd: `${BASE_URL}/roleAccess/addMultiple`,
    getAccessMultiRole: `${BASE_URL}/roleAccess/getAccessMultiRole`,
    updateHq: `${BASE_URL}/roleAccess/updateHq`,
    addHq: `${BASE_URL}/roleAccess/addHq`,
    deleteHq: `${BASE_URL}/roleAccess/deleteHq`,
  },
  departments: {
    getById: `${BASE_URL}/departments/getById`, //ex /departments/getById/1
    getall: `${BASE_URL}/departments/getAll`, // params : {businessId : **}
    getWithRoles: `${BASE_URL}/departments/getWithRoles`,
    add: `${BASE_URL}/departments/addDepartment`,
    edit: `${BASE_URL}/departments/editDepartment`,
    delete: `${BASE_URL}/departments/deleteDepartment`,
    getHqDepartments: `${BASE_URL}/departments/getHqDepartments`,
  },

  department_template: {
    createDepartment: `${BASE_URL}/departmentTemplates/createDepartment`,
    updateDepartment: `${BASE_URL}/departmentTemplates/updateDepartment`,
    deleteDepartment: `${BASE_URL}/departmentTemplates/deleteDepartment`,
    getDepartment: `${BASE_URL}/departmentTemplates/getDepartments`,
    createRole: `${BASE_URL}/departmentTemplates/createRole`,
    updateRole: `${BASE_URL}/departmentTemplates/updateRole`,
    deleteRole: `${BASE_URL}/departmentTemplates/deleteRole`,
    updateRoleAccess: `${BASE_URL}/departmentTemplates/updateRoleAccess`,
  },

  home_news: {
    getNews: `${BASE_URL}/homeManage/get-news`,
    getNewById: `${BASE_URL}/homeManage/get-news-id`,
    getNewsAll: `${BASE_URL}/homeManage/get-news-hq`,
    addNews: `${BASE_URL}/homeManage/add-news`,
    updateNews: `${BASE_URL}/homeManage/update-news`,
    deleteNews: `${BASE_URL}/homeManage/delete-news`,
  },

  home_education: {
    getEducation: `${BASE_URL}/homeManage/get-education`,
    getEducationById: `${BASE_URL}/homeManage/get-education-id`,
    addEducation: `${BASE_URL}/homeManage/add-education`,
    updatEeducation: `${BASE_URL}/homeManage/update-education`,
    deletEeducation: `${BASE_URL}/homeManage/delete-education`,
  },

  commission: {
    getAgentData: `${BASE_URL}/commission/get-agents`,
    getUserByOwnerId: `${BASE_URL}/commission/get-user`,
    Box1: `${BASE_URL}/commission/merged-amountLiftAdmin`,
    Box2: `${BASE_URL}/commission/get-totalOrder`,
    Box3: `${BASE_URL}/commission/get-shippingCost`,
    Box4: `${BASE_URL}/commission/get-mergedShippingCost`,
    Box5: `${BASE_URL}/paymentStatus/merged-status`,
    Box6: `${BASE_URL}/orderStatus/mergedOrder-status`,
    commissionTable: `${BASE_URL}/commission/get-mergedCommissionTable`,
    getFullYear: `${BASE_URL}/commission/getFullYearCommissionAllUser`,
    confirmCommission: `${BASE_URL}/commission`,
    getConfirmedCommission: `${BASE_URL}/commission/getConfirmedCommission`,
    getCommission: `${BASE_URL}/commission/getCommission`,
  },

  setting: {
    departments: `${BASE_URL}/settings/getDepartments`,
    updateCommission: `${BASE_URL}/settings/update-commissionSetting`,
    addCommission: `${BASE_URL}/settings/commissionSetting`,
    getCommission: `${BASE_URL}/settings/get-commissionSetting`,
    getCommissionSettingByBusiness: `${BASE_URL}/settings/getCommissionSettingByBusiness`,
    getCodCutoff: `${BASE_URL}/settings/getCodCutOffSettings`,
    updateCodCutoff: `${BASE_URL}/settings/updateCodCutOffSettings`,
    getAllCodCutoff: `${BASE_URL}/settings/getAllCodCutOffSettings`,
    addAdvancedCodCutoff: `${BASE_URL}/settings/addAdvancedCodCutOffSettings`,
  },

  dashboardCrm: {
    getCrmData: `${BASE_URL}/dashboardCrm/get-data`,
    getTalkTime: `${BASE_URL}/dashboardCrm/get-talk-time`,
    getTalkTimeChart: `${BASE_URL}/dashboardCrm/get-talk-time-chart`,
    getLeaderData: `${BASE_URL}/dashboardCrm/get/leader`,
    getRanking: `${BASE_URL}/dashboardCrm/get-ranking`,
  },

  summary: {
    Box1: `${BASE_URL}/summary/get-totalAmount`,
    Box2: `${BASE_URL}/summary/get-totalorder`,
    Box3: `${BASE_URL}/summary/get-merged-ads`,
    Box4: `${BASE_URL}/summary/get-total-inbox`,
    OrderRanking: `${BASE_URL}/summary/get-order-stat`,
    PlatformStat: `${BASE_URL}/summary/get-platform-stat`,
    TableMergedData: `${BASE_URL}/summary/get-merged-summary`,
    listAgent: `${BASE_URL}/summary/get-listAgent`,
  },

  teams: {
    getById: `${BASE_URL}/teams/getById`, //ex /teams/getById/{teamId}
    getAll: `${BASE_URL}/teams`,
    getMembers: `${BASE_URL}/teams/getMembers`,
    create: `${BASE_URL}/teams/create`,
    edit: `${BASE_URL}/teams/edit`,
    delete: `${BASE_URL}/teams/delete`, //DELETE /:teamId
    getMembersSale: `${BASE_URL}/teams/getMemberDetails/sale`, //ex /teams/getMemberDetails/sale/{teamId},
    getNotInTeamUsers: `${BASE_URL}/teams/getNotInTeamUsers`, //ex /teams/getNoTeamUsers/{depId}/{teamId}
    addMembers: `${BASE_URL}/teams/addMembers`, //POST BODY {teamId, usernames: [], createBy}
    removeMembers: `${BASE_URL}/teams/removeMembers`, //PUT BODY {teamId, usernames}
    getByLeader: `${BASE_URL}/teams/getByLeader`, //GET /:manager
    getByManager: `${BASE_URL}/teams/getByManager`, //
    getLeaders: `${BASE_URL}/teams/getLeaders`,
    addLeaders: `${BASE_URL}/teams/addLeaders`, //POST BODY {manager, leaders: []}
    removeLeaders: `${BASE_URL}/teams/removeLeaders`, //DELETE BODY {manager, leaders: []}
    getTeamByAgent: `${BASE_URL}/teams/getTeamByAgent`, //GET QUERY {businessId}
  },

  wallet: {
    getAllTopUpOrder: `${BASE_URL}/wallet/getAllTopUp`,
    getAllExpenses: `${BASE_URL}/wallet/getAllExpenses`, //GET query {username , monthCommission , fineType} ใส่หรือไม่ใส่ก็ได้
    topUp: `${BASE_URL}/wallet/topup`,
    manageTopup: `${BASE_URL}/wallet/manage`,
    topUpHistory: `${BASE_URL}/wallet/history`,
    topUpUpdateStatus: `${BASE_URL}/wallet/updateStatus`,
    editTopUp: `${BASE_URL}/wallet/editTopUp`, //POST BODY {trx,amount}
    cancelTopup: `${BASE_URL}/wallet/cancelTopUp`, // POST BODY {trx , status }
    settingImageTopUp: `${BASE_URL}/wallet/settingImageTopUp`, //POST BODY {image , businessId}
    getSettingImageTopUp: `${BASE_URL}/wallet/getSettingTopUpImage`, //GET QUERY {buinessId}
    setTopUpTransaction: `${BASE_URL}/wallet/setTopUpTransactionByAdmin`, //POST BODY { username, amount, confirmBy, status = 1, businessId }
    setBalance: `${BASE_URL}/wallet/setBalanceByAdmin`, //POST BODY { username, amount, updateBy }
    setFineLogs: `${BASE_URL}/wallet/setFineLogsByAdmin`, //POST BODY { businessId, finedUser, amount, fineType = 0 }
  },

  order: {
    getAll: `${BASE_URL}/order/getOrders`,
    //GET query parameters { orderNo,paymentType,paymentStatus,startDate,endDate,ownerId,status,createBy,upsaleUser,statusFineImposed} ไม่ใส่จะเอาทั้งหมด ของเดือนปัจุบันตั้งแต่ วันที่ 1-30/31
    refundReturnOrder: `${BASE_URL}/order/refundReturnOrder`, //POST body parameters { orderId,username,balance}
    getFinedOrder: `${BASE_URL}/order/getFinedOrders`, //GET query parameters { orderId}
    getOrderDetails: `${BASE_URL}/order/getOrderDetails`, //POST body parameters { createBy, upsaleUser, orderDateStart, orderDateEnd, paymentType, ownerId, customerOwnerId, status, finedStatus }
  },

  settingPenalty: {
    getAll: `${BASE_URL}/settingPenalty/getAll`, //GET params {businessId} ไม่ต้องใส่ก็ได้
    settingPenalty: `${BASE_URL}/settingPenalty/settingPenalty`, //POST body parameters {type Array[] businessId ,fineSetting , createBy , updateBy}
    getAllAgentPenalty: `${BASE_URL}/settingPenalty/getAllAgentPenalty`, //GET
  },
  overView: {
    getOverviewData: `${BASE_URL}/overView/overViewData`,
    getOverviewConfigData: `${BASE_URL}/overView/overViewData/Config/get/data`,
    getOverviewConfigSetting: `${BASE_URL}/overView/overViewData/Config/get`,
    getAllSetting: `${BASE_URL}/overView/overViewData/Setting`,
    createSettingForm: `${BASE_URL}/overView/overViewData/Setting/Create`,
    updateSettingForm: `${BASE_URL}/overView/overViewData/Setting/Update`,
    updateSettingConfig: `${BASE_URL}/overView/overViewData/Config/Update`,
  },

  award: {
    getMedals: `${BASE_URL}/awards/getMedals`, // GET query {id, businessId, name} - optional
    addMedal: `${BASE_URL}/awards/addMedal`, // POST body {name, image, businessId, createBy}
    updateMedal: `${BASE_URL}/awards/updateMedal`, // PUT params id && body {name, image, updateBy}
    updateMedalTier: `${BASE_URL}/awards/updateMedalTier`, //PUT BODY {medals}
    deleteMedal: `${BASE_URL}/awards/deleteMedal`, // DELETE params id

    getAwardById: `${BASE_URL}/awards/getAwardById`, // GET params {id}
    getAwardsByRole: `${BASE_URL}/awards/getAwardsByRole`, // GET query {year,roleId}
    getAwards: `${BASE_URL}/awards/getAwards`, // GET query {businessId,year,medalId}
    addAward: `${BASE_URL}/awards/addAward`, // POST body {medalId,awardTitle,awardDesc,image,year,businessId,createBy}
    updateAward: `${BASE_URL}/awards/updateAward`, // PUT params id && body {medalId,awardTitle,awardDesc,image,updateBy}
    deleteAward: `${BASE_URL}/awards/deleteAward`, // DELETE params id

    getConditions: `${BASE_URL}/awards/getConditions`, // GET query {businessId,baseRole,year}
    getAdsCondition: `${BASE_URL}/awards/getAdsCondition`, // GET query {businessId,baseRole,year}
    addCondition: `${BASE_URL}/awards/addCondition`, // POST body {baseRole,conditionRoleLevel,condition,medalId,year,type,businessId,createBy}
    updateAdsCondition: `${BASE_URL}/awards/updateAdsCondition`, // PUT body {baseRole,condition,year}
    updateCondition: `${BASE_URL}/awards/updateCondition`, // PUT params id && body {baseRole,conditionRoleLevel,condition,medalId,type,updateBy}
    deleteAdsCondition: `${BASE_URL}/awards/deleteAdsCondition`, // DELETE body {year}
    deleteCondition: `${BASE_URL}/awards/deleteCondition`, // DELETE params id

    updateMultipleCondition: `${BASE_URL}/awards/updateMultipleCondition`, // PUT body {baseRole,conditionRoleLevel,condition,medalId,type,updateBy}
    deleteMultipleCondition: `${BASE_URL}/awards/deleteMultipleCondition`, // DELETE body {baseRole,year}

    getCurrentAward: `${BASE_URL}/awards/getCurrentAward`, // GET query {year,userName}
    getUserAwards: `${BASE_URL}/awards/getUserAwards`, // GET query {year,userName}
    getAllYears: `${BASE_URL}/awards/getAllYears`, // GET query {businessId}
    getCurrentAward: `${BASE_URL}/awards/getCurrentAward`, // GET query {year,userName}
    getUserAwards: `${BASE_URL}/awards/getUserAwards`, // GET query {year,userName}
    getAllYears: `${BASE_URL}/awards/getAllYears`, // GET query {businessId}
  },

  okr: {
    getGradeSetting: `${BASE_URL}/okr/getGradeSettings`, // GET query {businessId,year}

    updateGradeSetting: `${BASE_URL}/okr/updateGradeSetting`, // POST body {businessId , year ,grades}
  },

  googleCloud: {
    topUp: `https://storage.googleapis.com/hopeful-wellness/topup/`,
    settingImageTopUp: `https://storage.googleapis.com/hopeful-wellness/settingTopUp/`,
    medal: `https://storage.googleapis.com/hopeful-wellness/medals/`,
    award: `https://storage.googleapis.com/hopeful-wellness/award/`,
  },

  WebContent: {
    //fetch All List
    getList: `${BASE_URL}/hopefulContent/get/ListContent`,
    // List
    createList: `${BASE_URL}/hopefulContent/create/list`,
    updateList: `${BASE_URL}/hopefulContent/update/list`,
    deleteList: `${BASE_URL}/hopefulContent/delete/list`,
    // Group
    createGroup: `${BASE_URL}/hopefulContent/create/group`,
    updateGroup: `${BASE_URL}/hopefulContent/update/group`,
    deleteGroup: `${BASE_URL}/hopefulContent/delete/group`,
    // Items
    createItem: `${BASE_URL}/hopefulContent/create/item`,
    updateItem: `${BASE_URL}/hopefulContent/update/item`,
    deleteItem: `${BASE_URL}/hopefulContent/delete/item`,
    //fetch All booking
    getBookings: `${BASE_URL}/hopefulContent/get/bookings`,

    createBookings: `${BASE_URL}/hopefulContent/create/booking`,
    updateBooking: `${BASE_URL}/hopefulContent/update/booking`,
    deleteBooking: `${BASE_URL}/hopefulContent/delete/booking`,
    accessBooking: `${BASE_URL}/hopefulContent/acess/booking`,

    createWebhook: `${BASE_URL}/hopefulContent/create/webhook`,
    getCoupon: `${BASE_URL}/hopefulContent/get/coupon`,
    allCoupon: `${BASE_URL}/hopefulContent/get/all/coupons`,
    useCoupon: `${BASE_URL}/hopefulContent/redeem/coupon`,

    getRate: `${BASE_URL}/hopefulContent/get/rate`,
    createRate: `${BASE_URL}/hopefulContent/create/rate`,

    getNews: `${BASE_URL}/hopefulContent/get/all/news`,
    createNews: `${BASE_URL}/hopefulContent/create/news`,
    updateNews: `${BASE_URL}/hopefulContent/update/news`,
    deleteNews: `${BASE_URL}/hopefulContent/delete/news`,

    getCase: `${BASE_URL}/hopefulContent/get/case`,
    createCase: `${BASE_URL}/hopefulContent/create/case`,
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
