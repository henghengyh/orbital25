import { getISOWeek, getISOWeekYear } from "date-fns";

export const mockUser1 = {
    _id: '123',
    name: 'testuser',
    email: 'unit@test.com',
    accountCreatedOn: '2025-07-14T00:00:00Z',
    emailVerificationCode: 'ABC123',
    profilePhoto: null,
    profileInfo: {
        bio: 'Coffee lover. Laxing.',
        favouriteDestination: 'Taiwan, China, USA',
        gender: 'Male',
        dateOfBirth: '2003-01-01T00:00:00Z',
        location: 'Singapore',
    },
    friendsWith: ['456', '789'],
    emailSignUp: true,
};
export const mockUser2 = {
    _id: '456',
    name: 'janedoe',
    email: 'jane.doe@example.com',
    accountCreatedOn: '2025-06-10T00:00:00Z',
    emailVerificationCode: 'XYZ789',
    profilePhoto: null,
    profileInfo: {
        bio: 'World explorer and foodie.',
        favouriteDestination: 'Japan, France, Italy',
        gender: 'Female',
        dateOfBirth: '2000-05-15T00:00:00Z',
        location: 'New York, USA',
    },
    friendsWith: ['123'],
    emailSignUp: true,
};
export const mockUser3 = {
    _id: '789',
    name: 'alexwander',
    email: 'alex@wanderlust.dev',
    accountCreatedOn: '2024-12-01T00:00:00Z',
    emailVerificationCode: 'LMN456',
    profilePhoto: null,
    profileInfo: {
        bio: 'Digital nomad and writer.',
        favouriteDestination: 'Portugal, Peru, South Africa',
        gender: 'Male',
        dateOfBirth: '2005-09-30T00:00:00Z',
        location: 'Lisbon, Portugal',
    },
    friendsWith: ['123', '456'],
    emailSignUp: false,
};

export const mockItinerary = [
    {
        _id: "1",
        user: "testuser",
        collaborators: [],
        tripName: "Test Trip",
        destination: "Singapore",
        imageNumber: 3,
        startDate: "2025-07-13",
        endDate: "2025-07-13",
        numberOfPeople: 1,
        activities: [],
        notes: "mock itinerary",
    },
    {
        _id: "2",
        user: "testuser",
        collaborators: [mockUser2, mockUser3],
        tripName: "Weekend Getaway",
        destination: "Kuala Lumpur",
        imageNumber: 5,
        startDate: "2025-08-01",
        endDate: "2025-08-03",
        numberOfPeople: 2,
        activities: [
            {
                _id: "2a",
                activityName: "Bus Ride",
                date: "2025-08-01",
                startTime: "09:00",
                endTime: "13:00",
                type: "Transport",
                notes: "Express coach from Singapore",
            },
            {
                _id: "2b",
                activityName: "Check-in Hotel",
                date: "2025-08-01",
                startTime: "14:00",
                endTime: "14:30",
                type: "Transport",
                notes: "Hilton KL",
            },
            {
                _id: "2c",
                activityName: "Dinner at Jalan Alor",
                date: "2025-08-02",
                startTime: "19:00",
                endTime: "20:30",
                type: "Meal",
                notes: "Try satay and char kway teow",
            }
        ],
        notes: "Relaxing city trip"
    },
    {
        _id: "3",
        user: "testuser",
        collaborators: [],
        tripName: "Nature Retreat",
        destination: "Bali",
        imageNumber: 8,
        startDate: "2025-09-10",
        endDate: "2025-09-15",
        numberOfPeople: 4,
        activities: [
            {
                _id: "3a",
                activityName: "Flight to Bali",
                date: "2025-09-10",
                startTime: "10:00",
                endTime: "14:00",
                type: "Transport",
                notes: "Flight SQ938",
            },
            {
                _id: "3b",
                activityName: "Ubud Rice Terrace Tour",
                date: "2025-09-11",
                startTime: "09:00",
                endTime: "12:00",
                type: "Sightseeing",
                notes: "Photography session",
            },
            {
                _id: "3c",
                activityName: "Beach Day",
                date: "2025-09-13",
                startTime: "11:00",
                endTime: "17:00",
                type: "Leisure",
                notes: "Seminyak beach",
            }
        ],
        notes: "Escape from city life",
    },
];

export const mockExpenses = [
    {
        itineraryId: "2",
        title: "Hotel Stay at Traders Hotel",
        date: "2025-08-01",
        amount: 320,
        currency: "MYR",
        type: "accommodation",
        whoPaid: "John",
        notes: "2-night stay with breakfast"
    },
    {
        itineraryId: "2",
        title: "Petronas Towers Entry",
        date: "2025-08-02",
        amount: 40,
        currency: "MYR",
        type: "activities",
        whoPaid: "Jane",
        notes: "Observation deck tickets"
    },
    {
        itineraryId: "2",
        title: "Street Food at Jalan Alor",
        date: "2025-08-03",
        amount: 65,
        currency: "MYR",
        type: "food",
        whoPaid: "John",
        notes: "Dinner for 2 including drinks"
    },
    {
        itineraryId: "2",
        title: "Souvenirs from Central Market",
        date: "2025-08-01",
        amount: 120,
        currency: "MYR",
        type: "gift",
        whoPaid: "Jane",
        notes: "Local crafts and souvenirs"
    },
    {
        itineraryId: "2",
        title: "Laundry Service",
        date: "2025-08-02",
        amount: 30,
        currency: "MYR",
        type: "others",
        whoPaid: "John",
        notes: "Hotel laundry charges"
    },
    {
        itineraryId: "2",
        title: "Shopping at Pavilion Mall",
        date: "2025-08-02",
        amount: 250,
        currency: "MYR",
        type: "shopping",
        whoPaid: "Jane",
        notes: "Clothes and accessories"
    },
    {
        itineraryId: "2",
        title: "Grab ride to Batu Caves",
        date: "2025-08-03",
        amount: 25,
        currency: "MYR",
        type: "transport",
        whoPaid: "John",
        notes: "Taxi fare for 2 people"
    },
];

export const mockWeeklyOverview = (startOfWeek, mockExpenses) => {
    const typesOfExpenses = ["accommodation", "activities", "food", "gift", "others", "shopping", "transport"];

    const days = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(date.getDate() + i);
        const isoDate = date.toISOString().split("T")[0];

        const dayData = { date: isoDate };
        typesOfExpenses.forEach(type => (dayData[type] = 0));
        return dayData;
    });

    const groupedByWeek = {};

    mockExpenses
        .forEach(e => {
            const date = new Date(e.date);
            const week = getISOWeek(date);
            const year = getISOWeekYear(date);
            const key = `${year}-${week}`;

            if (!groupedByWeek[key]) {
                groupedByWeek[key] = {
                    _id: { year, week },
                    transactions: [],
                };
            }

            groupedByWeek[key].transactions.push({
                date: e.date,
                amount: e.amount,
                type: e.type,
            });
        });

    const weeklyOverview = Object.values(groupedByWeek)
        .sort((a, b) => {
            if (b._id.year !== a._id.year) return b._id.year - a._id.year;
            return b._id.week - a._id.week;
        })
        .slice(0, 1);


    // tabulate all expenses for each day in the week
    weeklyOverview[0].transactions.forEach(tx => {
        const txDate = new Date(tx.date).toISOString().split("T")[0];
        const matchingDay = days.find(d => d.date === txDate);
        if (!matchingDay) return;

        const type = typesOfExpenses.includes(tx.type) ? tx.type : "others";
        matchingDay[type] += tx.amount;
    });

    return days;
};

export const mockBreakdown = (mockExpenses) => {
    return Object.values(
        mockExpenses
            .reduce((acc, curr) => {
                const { type, amount } = curr;
                if (!acc[type]) {
                    acc[type] = { type, totalAmount: 0 };
                }
                acc[type].totalAmount += amount;
                return acc;
            }, {})
    ).sort((a, b) => b.type.localeCompare(a.type));
};

export const mockSplitExpenses = (mockExpenses) => {
    const splitExpenses = Object.values(
        mockExpenses
            .reduce((acc, curr) => {
                const whoPaid = curr.whoPaid.trim().toLowerCase();
                if (!acc[whoPaid]) {
                    acc[whoPaid] = { whoPaid, totalAmount: 0 };
                }
                acc[whoPaid].totalAmount += curr.amount;
                return acc;
            }, {})
    ).sort((a, b) => a.whoPaid.localeCompare(b.whoPaid));

    const reorderSplit = (splitExpenses) => {
        if (!splitExpenses || splitExpenses.length <= 0) return [];

        const totalExpenses = splitExpenses.reduce((total, curr) => curr.totalAmount + total, 0);
        const costPerPerson = totalExpenses / splitExpenses.length;

        const balance = splitExpenses.map(e => ({
            name: e.whoPaid,
            netBalance: e.totalAmount - costPerPerson,
        }));

        let creditors = balance.filter(e => e.netBalance > 0).sort((a, b) => b.netBalance - a.netBalance);
        let debtors = balance.filter(e => e.netBalance < 0).sort((a, b) => b.netBalance - a.netBalance);

        const settlement = [];
        let credIdx = 0;
        let debtIdx = 0;

        while (credIdx < creditors.length && debtIdx < debtors.length) {
            const creditor = creditors[credIdx];
            const debtor = debtors[debtIdx];
            const amt = Math.min(creditor.netBalance, Math.abs(debtor.netBalance));

            settlement.push({
                from: debtor.name,
                to: creditor.name,
                amount: Math.round(amt * 100) / 100,
            });

            creditor.netBalance -= amt;
            debtor.netBalance += amt;

            if (creditor.netBalance < 0.01) credIdx++;
            if (Math.abs(debtor.netBalance) < 0.01) debtIdx++;
        }

        return settlement.sort((a, b) => b.amount - a.amount);
    };

    return { splitExpenses: splitExpenses, settlement: reorderSplit(splitExpenses) };
};