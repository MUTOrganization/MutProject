import { createContext, useContext, useEffect, useState } from "react";
import { CommissionData } from "./Components/YearlyContent/CommissionData";
import fetchProtectedData from "@/utils/fetchData";
import { URLS } from "../../config";
import { toastError } from "../../component/Alert";
import { useAppContext } from "../../contexts/AppContext";
import { endOfMonth, startOfMonth, today } from "@internationalized/date";
import { OrderData } from "./OrderData";

class OrderFilter {
    constructor(){
        /** @type {{start: CalendarDate, end: CalendarDate}} */
        this.dateRange = {start: startOfMonth(today()), end: endOfMonth(today())}
        this.selectedOwnAgent = null
        this.selectedAgent = null
        this.orderNo = ''
        this.customerName = ''
        this.salesName = null
        this.upsaleName = null
        this.paymentStatus = 'all'
        this.orderStatus = {'C': true, 'CALLED': true, 'FINISH': true, 'O': true, 'TRANSIT': true, 'W': true, 'RETURN': true}
    }
}

const CommissionContext = createContext({
    /** @type {CommissionData} */
    commData: [],

    setCommData: (data) => {}, 

    /** @type {[{username: String, probStatus: Number, depId: String, depName: String, roleId: String, roleName: String, data: CommissionData}]} */
    usersCommData: [],

    setUsersCommData: (data) => {},

    /** @type {[CommissionData]} */
    commYearlyData: [],

    setcommYearlyData: (data) => {},

    settingData: [],

    setSettingData: (settingData) => {},

    isSettingLoading: false,

    /** @type {[OrderData]} */
    orderList: [],
    setOrderList: (data) => {},
    refreshOrderList: async () => {},
    loadOrder: false,
    orderFilter: new OrderFilter(),
    setOrderFilter: () => {},
});

export default function CommissionContextProvider({children}){
    const {currentUser, agent} = useAppContext();
    const [commData, setCommData] = useState(new CommissionData({}, {}));
    const [usersCommData, setUsersCommData] = useState([]);
    const [settingData, setSettingData] = useState([]);
    const [isSettingLoading, setIsSettingLoading] = useState(false);
    const [isSettingLoaded, setIsSettingLoaded] = useState(false);

    const [orderFilter, setOrderFilter] = useState(new OrderFilter());
    const [orderList, setOrderList] = useState([]);
    const [loadOrder, setLoadOrder] = useState(false);

    useEffect(() => {
        fetchSettingData();
    },[agent.selectedAgent])

    const fetchOrderList = async (page, size, controller) => {
        let total = 0;
        if(!orderFilter.dateRange) return 0;
        try{
            setLoadOrder(true);
            const response = await fetchProtectedData.post(URLS.order.getOrderDetails, {
                orderNo: orderFilter.orderNo,
                createBy: orderFilter.salesName,
                upsaleUser: orderFilter.upsaleName,
                orderDateStart: orderFilter.dateRange.start.toString(),
                orderDateEnd: orderFilter.dateRange.end.toString(),
                customerOwnerId: agent.selectedAgent.id,
                ownerId: orderFilter.selectedOwnAgent,
                customerName: orderFilter.customerName,
                paymentStatus: orderFilter.paymentStatus === 'all' ? null : orderFilter.paymentStatus,
                orderStatus: Object.entries(orderFilter.orderStatus).filter(([key, value]) => value).map(([key, value]) => key ),
                page,
                size
            }, {
                signal: controller?.signal
            });

            setOrderList(response.data.data.map(e => new OrderData(e)));
            total = response.data.pagination.total;
            setLoadOrder(false);
            return total;
        }catch(err){
            if (err.name === 'CanceledError') {
                console.log('Abort');
                return 'abort';
            }
            console.error('fetch order data error', err);
            toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
            return 0
        }
    }

    const fetchSettingData = async () => {
        setIsSettingLoading(true);
        try {
            const response = await fetchProtectedData.get(`${URLS.setting.getCommissionSettingByBusiness}`,
                {
                    params: { businessId: agent.selectedAgent.id}
                }
            );

            setSettingData(response.data);
            setIsSettingLoaded(true);
        } catch (error) {
            toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
            console.error('error fetching data', error);
        } finally {
            setIsSettingLoading(false);
        }
    };

    const value = {
        settingData,
        setSettingData,
        commData,
        setCommData,
        usersCommData,
        setUsersCommData,
        isSettingLoading,
        isSettingLoaded,
        orderList,
        refreshOrderList: fetchOrderList,
        loadOrder,
        orderFilter,
        setOrderFilter
    }
    return <CommissionContext.Provider value={value}>{children}</CommissionContext.Provider>
}

export const useCommissionContext = () => useContext(CommissionContext)