import axiosInstance from "./axiosInstance";

export const getInitials = (name) => {
    if (!name) return '';

    const names = name.split(' ');
    let initials = '';

    for (let i = 0; i < Math.min(names.length, 2); i++) {
        initials += names[i][0].toUpperCase();
    }

    return initials;
}

/** regex breakdown: (email is of format xxx@xxx.xxx)
 * ^ — Start of the string
 * [^\s@]+ — One or more characters that are not whitespace (\s) or @
 * @ — The @ symbol
 * [^\s@]+ — One or more characters that are not whitespace or @ (domain name part before the dot)
 * \. — Literal dot . (escaped as \.)
 * [^\s@]+ — One or more characters that are not whitespace or @ (domain suffix, like com, org, etc.)
 * $ — End of the string
 */
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const styleAmount = (amount) => {
    return !amount ? 0 : amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const formatDate = (date) => {
    if (!date) return "";
    return date.slice(0, 10);
};

export const getRate = async (currency) => {
    const cached = JSON.parse(localStorage.getItem("exchangeRates") || "{}");
    const now = Date.now();

    if (cached.rates && (now - cached.timestamp) < 24 * 60 * 60 * 1000) return cached.rates[currency]?.value;

    try {
        const res = await axiosInstance.post('/budget/currency');
        const response = res.data;

        localStorage.setItem("exchangeRates", JSON.stringify({
            rates: response,
            timestamp: now,
        }));
        return response[currency]?.value;
    } catch (err) {
        console.error("Failed to get currency", err);
        return null;
    }
};

export const convertToSGD = async (amount, currency) => {
    if (currency === "SGD") return Number(amount);
    const rate = await getRate(currency);
    return Number(amount) / rate;
};