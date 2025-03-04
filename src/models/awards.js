

export class AwardConditionSale {
    constructor({
        tier,
        amount,
        condition
    }) {
        /** @type {Number} ลำดับของเงื่อนไข ใช้เรียงลำดับเงื่อนไข */
        this.tier = tier;
        /** @type {Number} ยอดขายที่ต้อง */
        this.amount = amount;
        /** @type {AwardConditionSaleDetail[]} */
        this.condition = condition;
    }
}
new AwardConditionSale()

export class AwardConditionSaleDetail {
    constructor({
        months,
        awardId
    }){
        this.months = months;
        this.awardId = awardId;
    }
}

[
    { 
        "tier": 0, 
        "amount": 200000, 
        "condition": 
        [
            { "months": 8, "awardId": 1}, 
            { "months": 12, "awardId": 3}
        ] 
    }, 
    { 
        "tier": 1, 
        "amount": 280000, 
        "condition": 
        [
            { "months": 8, "awardId": 2 }, 
            { "months": 12, "awardId": 4 }
        ] 
    }
]