/**
 * 
 * @param {Number | String} totalNetIncome 
 * @param {{
 *      roleId,
 *      departmentName,
 *      roleName,
 *      probStatus
 * }} config 
 * @param {*} settingData 
 * @returns 
 */
export const calculateCommission = (netIncome, config, settingData) => {
    const totalNetIncome = parseFloat(netIncome || 0);
    if (isNaN(totalNetIncome) || totalNetIncome === 0) {
        return 0;
    }
    const setting = settingData.find(
        (setting) =>
            setting.roleId == config.roleId &&
            setting.prob_status == config.probStatus
    );

    if (!setting || !Array.isArray(setting.tier_list?.percentage)) {
        return 0;
    }

    for (const payment of setting.tier_list.percentage) {
        const maxAmount = parseInt(payment.maxAmount, 10);
        const minAmount = parseInt(payment.minAmount, 10);
        const percentage = parseFloat(payment.percentage) / 100;

        if (maxAmount === 0 && minAmount === 0) {
            return totalNetIncome * percentage;
        }

        if (totalNetIncome >= minAmount && totalNetIncome <= maxAmount) {
            return totalNetIncome * percentage;
        }
    }

    return 0;
};

export const calculateIncentive = (netIncome, config, settingData) => {
    const totalNetIncome = parseFloat(netIncome || 0);
    if (isNaN(totalNetIncome) || totalNetIncome === 0) {
        return 0;
    }
    
};
