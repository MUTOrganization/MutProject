import dayjs from "dayjs";

export class OrderData{
    constructor({
        id,
        orderNo,
        orderDate,
        codDate,
        createBy,
        upsaleUser,
        salesName,
        salesNickname,
        ownerId,
        customerOwnerId,
        ownerName,
        customerId,
        customerName,
        customerPhone,
        adminAmount,
        upsaleAmount,
        paymentType,
        orderCount,
        orderStatus,
    }){
        this.id = id;
        this.orderNo = orderNo;
        this.orderDate = dayjs(orderDate)
        this.orderDateStr = dayjs(orderDate).format('YYYY-MM-DD');
        this.codDate = codDate ? dayjs(codDate) : null;
        this.codDateStr = codDate ? dayjs(codDate).format('YYYY-MM-DD') : '';
        this.createBy = createBy;
        this.upsaleUser = upsaleUser;
        this.salesName = salesName;
        this.salesNickname = salesNickname;
        this.ownerId = ownerId;
        this.ownerName = ownerName;
        this.customerOwnerId = customerOwnerId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.adminAmount = Number(adminAmount);
        this.upsaleAmount = upsaleAmount ? Number(upsaleAmount) : null
        this.paymentType = paymentType;
        this.orderCount = Number(orderCount);
        this.isPaid = codDate != null
        this.orderStatus = orderStatus;
    }
}