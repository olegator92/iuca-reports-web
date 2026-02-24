/**
 * Compute the Friday–Thursday work-week bounds that contain the given date.
 * Returns ISO yyyy-MM-dd strings.
 */
export const getWorkWeekBounds = (date: Date): { weekStart: string; weekEnd: string } => {
    // day: 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
    // Days to subtract to reach the most recent Friday:
    // Fri(5)→0, Sat(6)→1, Sun(0)→2, Mon(1)→3, Tue(2)→4, Wed(3)→5, Thu(4)→6
    const day = date.getDay();
    const daysToFriday = (day + 2) % 7;

    const friday = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() - daysToFriday));
    const thursday = new Date(Date.UTC(friday.getUTCFullYear(), friday.getUTCMonth(), friday.getUTCDate() + 6));

    return {
        weekStart: friday.toISOString().split("T")[0],
        weekEnd: thursday.toISOString().split("T")[0]
    };
};

/**
 * Offset a work week by ±n weeks.
 * Pass -1 for previous week, +1 for next week.
 */
export const offsetWorkWeek = (weekStart: string, weeks: number): { weekStart: string; weekEnd: string } => {
    const [y, m, d] = weekStart.split("-").map(Number);
    const friday = new Date(Date.UTC(y, m - 1, d + weeks * 7));
    const thursday = new Date(Date.UTC(friday.getUTCFullYear(), friday.getUTCMonth(), friday.getUTCDate() + 6));

    return {
        weekStart: friday.toISOString().split("T")[0],
        weekEnd: thursday.toISOString().split("T")[0]
    };
};
