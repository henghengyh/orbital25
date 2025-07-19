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

export const searchByDate = (day, setDateRange, setLoading, setSearched, setSearchResults) => {
    const filterItineraryByDate = async (day) => {
        if (!day || !day.from || !day.to || day.from.getTime() === day.to.getTime()) {
            setSearchResults([]);
            setSearched(false);
            return;
        };

        const toUTCDate = (day) => {
            const date = new Date(day);
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
        };

        setLoading(true);
        const start = toUTCDate(day.from);
        const end = toUTCDate(day.to);
        axiosInstance
            .get('/itineraries/filter', { params: { start, end } })
            .then(res => { setSearchResults(res.data.itineraries); setSearched(true) })
            .catch(err => console.error("Error filtering itinerary:", err.response?.data?.message || "Something went wrong"))
            .finally(() => setLoading(false));
    }

    if (!day) {
        setDateRange({ from: null, to: null });
        setSearchResults([]);
        setSearched(false);
        return;
    };

    const singleDay = day?.from && day?.to && day.from.getTime() === day.to.getTime();
    let newDay = singleDay ? { from: day?.from, to: null } : day;
    setDateRange(newDay);
    filterItineraryByDate(newDay);
    return;
};