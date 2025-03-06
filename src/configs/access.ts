export type ACCES_STR =
    | 'dashboard_own_view' | 'dashboard_all_view'
    | 'access_view' | 'access_manage_all' | 'access_manage_own'
    | 'userRole_view' | 'userRole_edit' | 'roleManage_view' | 'roleManage_manage_all' | 'roleManage_manage_own'
    | 'commission_own_view' | 'commission_dep_view' | 'commission_own_all' | 'view_manager_sale' | 'view_commission';

export const ACCESS = {
    dashboard: {
        dashboard_own_view: 'dashboard_own_view',
        dashboard_all_view: 'dashboard_all_view',
        view_manager_sale: 'view_manager_sale',
        summary_veiw: 'summary_veiw',
        dashboard_stat_sale: 'dashboard_stat_sale',
        view_dashboard_sale: 'view_dashboard_sale',
        stat_platform: 'stat_platform',
        dashboard_crm: 'dashboard_crm',
        dashboardNiceCall: 'dashboardNiceCall'
    },
    access_manage: {
        access_view: 'access_view',
        access_manage_all: 'access_manage_all',
        access_manage_own: 'access_manage_own'
    },
    role_manage: {
        userRole_view: 'userRole_view',
        userRole_edit: 'userRole_edit',
        roleManage_view: 'roleManage_view',
        roleManage_manage_all: 'roleManage_manage_all',
        roleManage_manage_own: 'roleManage_manage_own'
    },
    // commission_stat: {
    //     commission_own_view: 'commission_own_view',
    //     commission_dep_view: 'commission_dep_view',
    //     commission_own_all: 'commission_own_all',
    // },
    topup: {
        topup: 'topup',
        topup_own_view: 'topup_own_view',
        settingImage: 'topup_setting_image',
    },
    ads: {
        adsDashboardView: 'adsDashboard_view',
        access_all_ads: 'access_all_ads'
    },
    hopeful_hero: {
        hopefulVote: 'hopeful_vote',
        redeemReward: 'redeem_reward',
        manageRewardProducts: 'manage_reward_products',
        manageReward: 'manage_reward',
        manageFormPage: 'manage_form_page',
        heroUpdateScore: 'hero_update_score',
        heroSummaryVotes: 'hero_votes_summary',
        Award_View: 'Award_View',
        Award_Dashboard: 'Award_Dashboard_View'
    },
    order_stock: {
        orderStock: 'order_stock',
        orderCost: 'view_order_cost',
        orderStockAgents: 'view_order_agents'
    },
    talkTime: {
        talkTimeDashBoardView: 'talkTimeDashboard_View'
    },
    dashboardCEO: {
        ceo_view: 'dashboard_ceo_view'
    },

    orderManagement: {
        orderManage_all: 'orderInfomation_all',
        orderManage_own: 'orderInfomation_own_all'
    },
    topup_manage: {
        topup_view: 'topup_view',
        topup_approve: 'topup_appprove',
        topup_status_change: 'topup_status_change'
    },
    department_members_manage: 'department_members_manage',
    permissionsPage: {
        managePages: 'adsPages_manage'
    },
    team: {
        leader: 'team_leader',
        manager: 'team_manager',
        member_manager: 'team_member_manage',
        team_view_all: 'team_view_all_team'
    },
    sale: {
        dashBoardSale: 'dashboard_sale',
        rankingSale: 'ranking_sale',
        panCakeView: 'pancake_view',
    },
    kpi: {
        targetManage: 'kpi_main_target_manage',
        assign: 'kpi_assign',
        assignmentApprove: 'kpi_assignment_approve',
        kpiApproveProgress: 'kpi_approved_progress',
        dashBoard: {
            view: 'kpi_dashboard_view_all'
        }
    },
    commissonSetting: {
        commission: 'comission_setting',
    },
    commisson: {
        commissionView: 'view_commission',
        commissionAllVeiw: 'all_commission_view',
        commissionOwnVeiw: 'own_commission_view',
        commissionTeamView: 'team_commission_view',
        commissionOwnerAgentView: 'owner_agent_commission_view',
        confirmCommission: 'Cf_commission_Manages',
        confirmCommission_TeamView: 'Cf_commission_Teams',
        confirmCommission_BySelf: 'Cf_commission_BySelf',
        confirmCommission_AllUser: 'Cf_commission_AllUser',
        confirmCommission_CutoffDate: 'Cf_commission_CutoffDate'
    },
    settings: {
        settings_all: 'settings_all',
        svgExporter: 'svg_exporter',
        codCutoff: 'setting_cod_cutoff'
    },
    department: {
        view: 'department_manage_view',
        manage: 'department_manage_manage',
    },
    userManage: {
        view: 'user_manage_view',
        probationManage: 'user_manage_probation_manage',
    },
    kpiDashBoard: {
        view: 'kpi_dashboard_view',
    },
    management: {
        management_all: 'management_all',
    },
    expenses: {
        expenses_all: 'expenses_all',
        expenses_summary: 'expenses_summary',
        expenses_ads: 'expenses_ads',
        expenses_other: 'expenses_other'

    },
    agentManage: {
        view: 'agent_view',
        manage: 'agent_manage',
        manageDefault: 'agent_manage_default',
    },
    deductReturn: {
        deduct: 'deduct_fines',
        deduct_view_all: 'deduct_view_all',
        deduct_view_all_agent: 'deduct_view_all_agent'
    },
    TransactionHistory: {
        viewOwner: 'trx_view_owner',
    },
    pancake: {
        manage_pancake: 'manage_pancake',
    },
    home: {
        manage_home: 'manage_home',
        home_news: 'home_news',
        home_map: 'home_map',
        home_lernnig: 'home_lernnig'
    },
    document_product: {
        edit_documents: 'edit_documents',
        view_document_product: 'view_document_product'
    },
    dashboard_crm: {
        crm_dashboard: 'crm_dashboard',
        crm_view_all: 'crm_view_all',
        crm_own_team: 'crm_own_team',
        compared_access: 'compared_access',
        view_all_ranking: 'view_all_ranking',
        view_agent_sale: 'view_agent_sale',
    },
    dashboard_talk_time: {
        dashboard_talk_time: 'dashboard_talk_time',
        talk_time_view_all: 'talk_time_view_all',
        compared_talk_time_access: 'compared_talk_time_access',
        view_all_talk_time_ranking: 'view_all_talk_time_ranking',
    },
    dashboard_overview: {
        dashboard_overview: 'dashboard_overview',
    },
    dashboard_rfm: {
        dashboard_rfm: 'dashboard_rfm'

    },
    admin_content: {
        admin_content: 'admin_content'
    },
    OKR: {
        okr_personalprofile: 'okr_profile',
        okr_dashboard: 'okr_dashboard',
    }


}