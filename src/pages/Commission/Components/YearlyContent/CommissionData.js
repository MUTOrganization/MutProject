import lodash from "lodash";
export class CommissionData {
    constructor({
        month,
        monthIndex,
        adminIncome,
        adminPaidIncome,
        adminUnpaid,
        adminDelivery,
        orderCount,
        adminPaidOrderCount,
        adminPaidNextMonthOrderCount,
        adminUnpaidOrderCount,
        upsaleIncome,
        upsalePaidIncome,
        upsaleUnpaid,
        upsaleDelivery,
        upsaleOrderCount,
        upsalePaidOrderCount,
        upsalePaidNextMonthOrderCount,
        upsaleUnpaidOrderCount,
        adminLiftIncome,
        adminLiftDelivery,
        upsaleLiftIncome,
        upsaleLiftDelivery,
        adminNextLiftIncome,
        adminNextLiftDelivery,
        upsaleNextLiftIncome,
        upsaleNextLiftDelivery,
        oldCustomerOrderCount,
        newCustomerOrderCount,
        paymentTypes,
        orderStatus,
        finedAmount,
        commission,
        incentive, 
        teamCommissionData
    },
    ) {
        //String เดือน //2024-5
        this.month = !month ? 'all' : month;
        //Number เดือนเริ่มที่ 0 //เดือนมกราคม = 0
        this.monthIndex = !monthIndex ? 0 : Number(monthIndex);

        //ยอดขายแอดมิน เป็นยอดขายของเดือนนั้นๆ โดยไม่สน CODDate 
        this.adminIncome = !adminIncome ? 0 : Number(adminIncome);
        //ยอดขายอัพเซล เป็นยอดขายของเดือนนั้นๆ โดยไม่สน CODDate 
        this.upsaleIncome = !upsaleIncome ? 0 : Number(upsaleIncome);

        //ยอดเงินเข้าแอดมิน เป็นยอดเงินเข้าที่ CODDate อยู่ในเดือนเดียวกับ orderDate
        this.adminPaidIncome = !adminPaidIncome ? 0 : Number(adminPaidIncome);
        //ยอดเงินเข้าอัพเซล เป็นยอดเงินเข้าที่ CODDate อยู่ในเดือนเดียวกับ orderDate
        this.upsalePaidIncome = !upsalePaidIncome ? 0 : Number(upsalePaidIncome);

        //ยอดเงินเข้าแอดมินที่ยังไม่ชำระเงิน CODDate = null 
        this.adminUnpaid = !adminUnpaid ? 0 : Number(adminUnpaid);
        //ยอดเงินเข้าอัพเซลที่ยังไม่ชำระเงิน CODDate = null 
        this.upsaleUnpaid = !upsaleUnpaid ? 0 : Number(upsaleUnpaid);

        //ยอดยกแอดมิน
        this.adminLiftIncome = !adminLiftIncome ? 0 : Number(adminLiftIncome);
        //ยอดยกอัพเซล
        this.upsaleLiftIncome = !upsaleLiftIncome ? 0 : Number(upsaleLiftIncome);

        //ยอดยกไปเดือนหน้าแอดมิน
        this.adminNextLiftIncome = !adminNextLiftIncome ? 0 : Number(adminNextLiftIncome);
        //ยอดยกไปเดือนหน้าอัพเซล
        this.upsaleNextLiftIncome = !upsaleNextLiftIncome ? 0 : Number(upsaleNextLiftIncome);

        //จำนวนออเดอร์ที่ขายในเดือนนั้นๆ ไม่สน CODDate
        this.orderCount = !orderCount ? 0 : Number(orderCount);
        //จำนวนออเดอร์ที่มีอัพเซลที่ขายในเดือนนั้นๆ ไม่สน CODDate
        this.upsaleOrderCount = !upsaleOrderCount ? 0 : Number(upsaleOrderCount);

        //จำนวนออเดอร์ที่ชำระเงินแล้ว ที่ CODDate อยู่ในเดือนเดียวกับ orderDate
        this.adminPaidOrderCount = !adminPaidOrderCount ? 0 : Number(adminPaidOrderCount);
        //จำนวนออเดอร์ที่มีอัพเซลที่ชำระเงินแล้ว ที่ CODDate อยู่ในเดือนเดียวกับ orderDate
        this.upsalePaidOrderCount = !upsalePaidOrderCount ? 0 : Number(upsalePaidOrderCount)

        //จำนวนออเดอร์ที่ชำระเงินแล้ว ที่ CODDate อยู่ในเดือนถัดไปจาก orderDate
        this.adminPaidNextMonthOrderCount = !adminPaidNextMonthOrderCount ? 0 : Number(adminPaidNextMonthOrderCount);
        //จำนวนออเดอร์ที่มีอัพเซลที่ชำระเงินแล้ว ที่ CODDate อยู่ในเดือนถัดไปจาก orderDate
        this.upsalePaidNextMonthOrderCount = !upsalePaidNextMonthOrderCount ? 0 : Number(upsalePaidNextMonthOrderCount);

        //จำนวนออเดอร์ที่ยังไม่ชำระเงิน ที่ CODDate = null
        this.adminUnpaidOrderCount = !adminUnpaidOrderCount ? 0 : Number(adminUnpaidOrderCount);
        //จำนวนออเดอร์ที่มีอัพเซลที่ยังไม่ชำระเงิน ที่ CODDate = null
        this.upsaleUnpaidOrderCount = !upsaleUnpaidOrderCount ? 0 : Number(upsaleUnpaidOrderCount);

        //ยอดค่าส่งแอดมิน
        this.adminDelivery = !adminDelivery ? 0 : Number(adminDelivery);
        //ยอดค่าส่งอัพเซล
        this.upsaleDelivery = !upsaleDelivery ? 0 : Number(upsaleDelivery);

        //ยอดยกค่าส่งแอดมิน
        this.adminLiftDelivery = !adminLiftDelivery ? 0 : Number(adminLiftDelivery);
        //ยอดยกค่าส่งอัพเซล
        this.upsaleLiftDelivery = !upsaleLiftDelivery ? 0 : Number(upsaleLiftDelivery);

        //ยอดยกค่าส่งไปเดือนหน้าแอดมิน
        this.adminNextLiftDelivery = !adminNextLiftDelivery ? 0 : Number(adminNextLiftDelivery);
        //ยอดยกค่าส่งไปเดือนหน้าอัพเซล
        this.upsaleNextLiftDelivery = !upsaleNextLiftDelivery ? 0 : Number(upsaleNextLiftDelivery);
        //จำนวนออเดอร์ลูกค้าเก่า
        this.oldCustomerOrderCount = !oldCustomerOrderCount ? 0 : Number(oldCustomerOrderCount);
        //จำนวนออเดอร์ลูกค้าใหม่
        this.newCustomerOrderCount = !newCustomerOrderCount ? 0 : Number(newCustomerOrderCount);
        //เงินได้แบบแยกประเภทค่าใชจ่าย
        /** @type {[{type: String, income: Number, paidIncome: Number, orderCount: Number, paidOrderCount: Number}]} */
        this.paymentTypes = !paymentTypes ? [] : paymentTypes;

        //ยอดขายและออดเดอร์ แยกตามสถานะออเดอร์
        //#region orderStatus type
        /** 
         * @type {{
         *      wait: {
         *          amount: Number,
         *          count: Number,
         *      },
         *      onDelivery: {
        *          amount: Number,
        *          count: Number,
        *      },
        *      finished: {
        *          amount: Number,
        *          count: Number,
        *      },
        *      returned: {
        *          amount: Number,
        *          count: Number,
        *      },
        *      upsaleReturned: {
        *          amount: Number,
        *          count: Number,
        *      },
         * }}
         * 
        */
        //#endregion orderStatus type
        this.orderStatus = !orderStatus ? {
            wait: {
                amount: 0,
                count: 0,
            },
            onDelivery: {
                amount: 0,
                count: 0,
            },
            finished: {
                amount: 0,
                count: 0,
            },
            returned: {
                amount: 0,
                count: 0,
            },
            upsaleReturned: {
                amount: 0,
                count: 0,
            },
        } : orderStatus
        //ค่าปรับ
        this.finedAmount = !finedAmount ? 0 : Number(finedAmount);

        //ยอดเงินเข้าแอดมินรวม เงินเข้า + ยอดยก
        const totalAdminIncome = Number(adminPaidIncome) + Number(adminLiftIncome);
        this.totalAdminIncome = totalAdminIncome || 0;

        //ยอดเงินเข้าอัพเซลรวม เงินเข้า + ยอดยก
        const totalUpsaleIncome = Number(upsalePaidIncome) + Number(upsaleLiftIncome);
        this.totalUpsaleIncome = totalUpsaleIncome || 0;

        //ยอดค่าส่งแอดมินรวม ค่าส่ง + ยอดยก
        const totalAdminDelivery = Number(adminDelivery) + Number(adminLiftDelivery);
        this.totalAdminDelivery = totalAdminDelivery || 0;

        //ยอดค่าส่งอัพเซลรวม ค่าส่ง + ยอดยก
        const totalUpsaleDelivery = Number(upsaleDelivery) + Number(upsaleLiftDelivery)
        this.totalUpsaleDelivery = totalUpsaleDelivery || 0;

        //ยอดเงินเข้ารวม รวมแอดมิน + รวมอัพเซล
        const totalIncome = totalAdminIncome + totalUpsaleIncome;
        this.totalIncome = totalIncome || 0;

        //ยอดค่าส่งรวม รวมแอดมิน + รวมอัพเซล
        const totalDelivery = totalAdminDelivery + totalUpsaleDelivery;
        this.totalDelivery = totalDelivery || 0;

        //ยอดเงินเข้าสุทธิ เงินเข้า - ค่าส่ง
        this.netIncome = (totalIncome - totalDelivery - finedAmount) || 0;

        //สามารถใส่ commission ด้วยตัวเองได้ ถ้าใส่จะไม่คิด commission ข้างล่าง
        if (commission || commission == 0) {
            this.commission = Number(commission);
        } else {
            this.commission = 0
        }

        if (incentive || incentive == 0) {
            this.incentive = Number(incentive);
        } else {
            this.incentive = 0
        }

        /**
         * @type {{
         *  teamPaidIncome: Number,
         *  teamLiftIncome: Number,
         *  teamDelivery: Number,
         *  teamFined: Number,
         *  teamNetIncome: Number,
         * }}
         */
        if(teamCommissionData) {
            this.teamCommissionData = teamCommissionData;
        }
    }
}

/**
 * 
 * @param {[CommissionData]} data 
 */
export function sumCommissionData(data) {
    return data.reduce((prev, curr) => {
        prev.adminIncome += curr.adminIncome;
        prev.adminPaidIncome += curr.adminPaidIncome;
        prev.adminUnpaid += curr.adminUnpaid;
        prev.adminDelivery += curr.adminDelivery;
        prev.orderCount += curr.orderCount;
        prev.adminPaidOrderCount += curr.adminPaidOrderCount;
        prev.adminPaidNextMonthOrderCount += curr.adminPaidNextMonthOrderCount;
        prev.adminUnpaidOrderCount += curr.adminUnpaidOrderCount;
        prev.upsaleIncome += curr.upsaleIncome;
        prev.upsalePaidIncome += curr.upsalePaidIncome;
        prev.upsaleUnpaid += curr.upsaleUnpaid;
        prev.upsaleDelivery += curr.upsaleDelivery;
        prev.upsaleOrderCount += curr.upsaleOrderCount;
        prev.upsalePaidOrderCount += curr.upsalePaidOrderCount;
        prev.upsalePaidNextMonthOrderCount += curr.upsalePaidNextMonthOrderCount;
        prev.upsaleUnpaidOrderCount += curr.upsaleUnpaidOrderCount;
        prev.adminLiftIncome += curr.adminLiftIncome;
        prev.adminLiftDelivery += curr.adminLiftDelivery;
        prev.upsaleLiftIncome += curr.upsaleLiftIncome;
        prev.upsaleLiftDelivery += curr.upsaleLiftDelivery;
        prev.adminNextLiftIncome += curr.adminNextLiftIncome;
        prev.adminNextLiftDelivery += curr.adminNextLiftDelivery;
        prev.upsaleNextLiftIncome += curr.upsaleNextLiftIncome;
        prev.upsaleNextLiftDelivery += curr.upsaleNextLiftDelivery;
        prev.totalAdminIncome += curr.totalAdminIncome;
        prev.totalUpsaleIncome += curr.totalUpsaleIncome;
        prev.totalAdminDelivery += curr.totalAdminDelivery;
        prev.totalUpsaleDelivery += curr.totalUpsaleDelivery;
        prev.totalIncome += curr.totalIncome;
        prev.totalDelivery += curr.totalDelivery;
        prev.netIncome += curr.netIncome;
        prev.commission += curr.commission;
        prev.incentive += curr.incentive;
        prev.oldCustomerOrderCount += curr.oldCustomerOrderCount;
        prev.newCustomerOrderCount += curr.newCustomerOrderCount;
        prev.finedAmount += curr.finedAmount;
        const prevPaymentTypes = prev.paymentTypes.map(e => e.type);
        const currPaymentTypes = curr.paymentTypes.map(e => e.type);
        const allPaymentTypes = lodash.union(prevPaymentTypes, currPaymentTypes);
        allPaymentTypes.forEach(type => {
            if (!prev.paymentTypes.find(e => e.type === type)) {
                prev.paymentTypes.push({
                    type: type,
                    income: 0,
                    paidIncome: 0,
                    orderCount: 0,
                    paidOrderCount: 0
                });
            }
            const findPrev = prev.paymentTypes.find(e => e.type === type);
            const findCurr = curr.paymentTypes.find(e => e.type === type);
            if (findCurr) {
                findPrev.income += findCurr.income;
                findPrev.paidIncome += findCurr.paidIncome;
                findPrev.orderCount += findCurr.orderCount;
                findPrev.paidOrderCount += findCurr.paidOrderCount;
            }
        })
        prev.orderStatus.wait.amount += curr.orderStatus.wait.amount;
        prev.orderStatus.wait.count += curr.orderStatus.wait.count;

        prev.orderStatus.onDelivery.amount += curr.orderStatus.onDelivery.amount;
        prev.orderStatus.onDelivery.count += curr.orderStatus.onDelivery.count;

        prev.orderStatus.finished.amount += curr.orderStatus.finished.amount;
        prev.orderStatus.finished.count += curr.orderStatus.finished.count;

        prev.orderStatus.returned.amount += curr.orderStatus.returned.amount;
        prev.orderStatus.returned.count += curr.orderStatus.returned.count;

        prev.orderStatus.upsaleReturned.amount += curr.orderStatus.upsaleReturned.amount;
        prev.orderStatus.upsaleReturned.count += curr.orderStatus.upsaleReturned.count;

        if(curr.teamCommissionData) {
            if(!prev.teamCommissionData) {
                prev.teamCommissionData = {}
                prev.teamCommissionData.teamPaidIncome = 0;
                prev.teamCommissionData.teamLiftIncome = 0;
                prev.teamCommissionData.teamDelivery = 0;
                prev.teamCommissionData.teamFined = 0;
                prev.teamCommissionData.teamNetIncome = 0;
            }
            prev.teamCommissionData.teamPaidIncome += curr.teamCommissionData.teamPaidIncome;
            prev.teamCommissionData.teamLiftIncome += curr.teamCommissionData.teamLiftIncome;
            prev.teamCommissionData.teamDelivery += curr.teamCommissionData.teamDelivery;
            prev.teamCommissionData.teamFined += curr.teamCommissionData.teamFined;
            prev.teamCommissionData.teamNetIncome += curr.teamCommissionData.teamNetIncome;
        }
        return prev
    }, new CommissionData({}))
}