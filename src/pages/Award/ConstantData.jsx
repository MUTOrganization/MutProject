const RankColor = () => {
    return {
        Silver: { bc: "#e2e8f0", textColor: "#64748b" },
        Gold: { bc: "#fef3c7", textColor: "#f59e0b"},
        Platinum: { bc: "#e5e4e2", textColor: "#8a8d8f" },
        Emerald : { bc: "#d1fae5", textColor: "#10b981" },
    };
};


const TypeColor = () => {
    return {
        "OwnUser": { bc: "#e9d5ff", textColor: "#9333ea" },
        "Sale": { bc: "#fef3c7", textColor: "#f59e0b" },
        "TeamSale": { bc: "#dbeafe", textColor: "#3b82f6" },
        "Admin": { bc: "#d1fae5", textColor: "#10b981" },
        "no condition": { bc: "#fee2e2", textColor: "#ef4444" }
    };
};

export default { RankColor, TypeColor };


