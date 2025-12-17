// Awareness data from Google Trends - Updated Dec 8, 2025

export interface DailyAwarenessData {
  date: string;
  td_bank: number;
  pnc: number;
  citizens: number;
  us_bancorp: number;
  truist: number;
  chase_bank?: number;
  capital_one?: number;
  citibank?: number;
  bank_of_america?: number;
}

export interface RegionalAwarenessData {
  region: string;
  td_bank: number;
  pnc: number;
  citizens: number;
  us_bancorp: number;
  truist: number;
  chase_bank?: number;
  capital_one?: number;
  citibank?: number;
  bank_of_america?: number;
}

// Regional Banks Awareness - Daily (Nov 9 to Dec 7)
export const regionalBanksDailyData: DailyAwarenessData[] = [
  { date: '2025-11-09', td_bank: 35, pnc: 46, citizens: 16, us_bancorp: 50, truist: 28 },
  { date: '2025-11-10', td_bank: 51, pnc: 84, citizens: 29, us_bancorp: 74, truist: 53 },
  { date: '2025-11-11', td_bank: 52, pnc: 81, citizens: 29, us_bancorp: 79, truist: 31 },
  { date: '2025-11-12', td_bank: 51, pnc: 83, citizens: 29, us_bancorp: 78, truist: 29 },
  { date: '2025-11-13', td_bank: 49, pnc: 87, citizens: 30, us_bancorp: 79, truist: 30 },
  { date: '2025-11-14', td_bank: 51, pnc: 93, citizens: 29, us_bancorp: 82, truist: 31 },
  { date: '2025-11-15', td_bank: 45, pnc: 70, citizens: 26, us_bancorp: 70, truist: 21 },
  { date: '2025-11-16', td_bank: 34, pnc: 48, citizens: 16, us_bancorp: 49, truist: 15 },
  { date: '2025-11-17', td_bank: 47, pnc: 84, citizens: 27, us_bancorp: 73, truist: 27 },
  { date: '2025-11-18', td_bank: 45, pnc: 79, citizens: 29, us_bancorp: 77, truist: 33 },
  { date: '2025-11-19', td_bank: 50, pnc: 85, citizens: 29, us_bancorp: 81, truist: 36 },
  { date: '2025-11-20', td_bank: 48, pnc: 85, citizens: 28, us_bancorp: 75, truist: 31 },
  { date: '2025-11-21', td_bank: 47, pnc: 91, citizens: 29, us_bancorp: 78, truist: 31 },
  { date: '2025-11-22', td_bank: 45, pnc: 68, citizens: 23, us_bancorp: 65, truist: 25 },
  { date: '2025-11-23', td_bank: 33, pnc: 44, citizens: 16, us_bancorp: 46, truist: 20 },
  { date: '2025-11-24', td_bank: 49, pnc: 85, citizens: 28, us_bancorp: 78, truist: 36 },
  { date: '2025-11-25', td_bank: 50, pnc: 91, citizens: 32, us_bancorp: 81, truist: 37 },
  { date: '2025-11-26', td_bank: 56, pnc: 90, citizens: 31, us_bancorp: 86, truist: 39 },
  { date: '2025-11-27', td_bank: 28, pnc: 41, citizens: 14, us_bancorp: 48, truist: 14 },
  { date: '2025-11-28', td_bank: 52, pnc: 84, citizens: 29, us_bancorp: 74, truist: 24 },
  { date: '2025-11-29', td_bank: 43, pnc: 68, citizens: 23, us_bancorp: 62, truist: 25 },
  { date: '2025-11-30', td_bank: 36, pnc: 51, citizens: 18, us_bancorp: 47, truist: 20 },
  { date: '2025-12-01', td_bank: 57, pnc: 100, citizens: 34, us_bancorp: 90, truist: 43 },
  { date: '2025-12-02', td_bank: 52, pnc: 91, citizens: 32, us_bancorp: 80, truist: 40 },
  { date: '2025-12-03', td_bank: 52, pnc: 95, citizens: 32, us_bancorp: 81, truist: 38 },
  { date: '2025-12-04', td_bank: 48, pnc: 91, citizens: 32, us_bancorp: 78, truist: 40 },
  { date: '2025-12-05', td_bank: 51, pnc: 92, citizens: 30, us_bancorp: 80, truist: 40 },
  { date: '2025-12-06', td_bank: 49, pnc: 75, citizens: 26, us_bancorp: 63, truist: 31 },
  { date: '2025-12-07', td_bank: 34, pnc: 48, citizens: 16, us_bancorp: 45, truist: 18 }
];

// Top 5 Banks Awareness - Daily (Nov 9 to Dec 7)
export const top5BanksDailyData: DailyAwarenessData[] = [
  { date: '2025-11-09', td_bank: 8, chase_bank: 65, capital_one: 41, citibank: 18, bank_of_america: 37 },
  { date: '2025-11-10', td_bank: 11, chase_bank: 90, capital_one: 54, citibank: 25, bank_of_america: 56 },
  { date: '2025-11-11', td_bank: 11, chase_bank: 91, capital_one: 52, citibank: 24, bank_of_america: 57 },
  { date: '2025-11-12', td_bank: 11, chase_bank: 91, capital_one: 53, citibank: 25, bank_of_america: 57 },
  { date: '2025-11-13', td_bank: 11, chase_bank: 93, capital_one: 57, citibank: 26, bank_of_america: 56 },
  { date: '2025-11-14', td_bank: 11, chase_bank: 92, capital_one: 57, citibank: 27, bank_of_america: 59 },
  { date: '2025-11-15', td_bank: 10, chase_bank: 83, capital_one: 47, citibank: 23, bank_of_america: 50 },
  { date: '2025-11-16', td_bank: 8, chase_bank: 62, capital_one: 41, citibank: 20, bank_of_america: 33 },
  { date: '2025-11-17', td_bank: 10, chase_bank: 85, capital_one: 52, citibank: 25, bank_of_america: 54 },
  { date: '2025-11-18', td_bank: 10, chase_bank: 82, capital_one: 51, citibank: 24, bank_of_america: 53 },
  { date: '2025-11-19', td_bank: 11, chase_bank: 85, capital_one: 51, citibank: 25, bank_of_america: 55 },
  { date: '2025-11-20', td_bank: 11, chase_bank: 83, capital_one: 52, citibank: 26, bank_of_america: 52 },
  { date: '2025-11-21', td_bank: 10, chase_bank: 89, capital_one: 46, citibank: 25, bank_of_america: 52 },
  { date: '2025-11-22', td_bank: 10, chase_bank: 75, capital_one: 42, citibank: 22, bank_of_america: 46 },
  { date: '2025-11-23', td_bank: 7, chase_bank: 56, capital_one: 37, citibank: 18, bank_of_america: 30 },
  { date: '2025-11-24', td_bank: 11, chase_bank: 84, capital_one: 51, citibank: 25, bank_of_america: 52 },
  { date: '2025-11-25', td_bank: 11, chase_bank: 87, capital_one: 53, citibank: 27, bank_of_america: 56 },
  { date: '2025-11-26', td_bank: 12, chase_bank: 92, capital_one: 52, citibank: 26, bank_of_america: 55 },
  { date: '2025-11-27', td_bank: 6, chase_bank: 55, capital_one: 37, citibank: 17, bank_of_america: 33 },
  { date: '2025-11-28', td_bank: 11, chase_bank: 87, capital_one: 53, citibank: 22, bank_of_america: 53 },
  { date: '2025-11-29', td_bank: 9, chase_bank: 74, capital_one: 47, citibank: 21, bank_of_america: 43 },
  { date: '2025-11-30', td_bank: 8, chase_bank: 65, capital_one: 45, citibank: 20, bank_of_america: 36 },
  { date: '2025-12-01', td_bank: 13, chase_bank: 100, capital_one: 63, citibank: 30, bank_of_america: 64 },
  { date: '2025-12-02', td_bank: 11, chase_bank: 96, capital_one: 60, citibank: 29, bank_of_america: 62 },
  { date: '2025-12-03', td_bank: 12, chase_bank: 90, capital_one: 57, citibank: 31, bank_of_america: 62 },
  { date: '2025-12-04', td_bank: 11, chase_bank: 91, capital_one: 57, citibank: 27, bank_of_america: 57 },
  { date: '2025-12-05', td_bank: 11, chase_bank: 89, capital_one: 53, citibank: 26, bank_of_america: 62 },
  { date: '2025-12-06', td_bank: 11, chase_bank: 76, capital_one: 47, citibank: 23, bank_of_america: 50 },
  { date: '2025-12-07', td_bank: 8, chase_bank: 58, capital_one: 42, citibank: 18, bank_of_america: 35 }
];

// Regional Banks - By State (Nov 9 to Dec 7 period)
export const regionalBanksRegionalData: RegionalAwarenessData[] = [
  { region: 'New Hampshire', td_bank: 57, pnc: 2, citizens: 38, us_bancorp: 3, truist: 0 },
  { region: 'New Jersey', td_bank: 54, pnc: 33, citizens: 8, us_bancorp: 3, truist: 2 },
  { region: 'Maine', td_bank: 79, pnc: 4, citizens: 8, us_bancorp: 9, truist: 0 },
  { region: 'Vermont', td_bank: 56, pnc: 2, citizens: 32, us_bancorp: 10, truist: 0 },
  { region: 'Delaware', td_bank: 25, pnc: 51, citizens: 16, us_bancorp: 4, truist: 4 },
  { region: 'Connecticut', td_bank: 61, pnc: 5, citizens: 23, us_bancorp: 9, truist: 2 },
  { region: 'New York', td_bank: 58, pnc: 9, citizens: 20, us_bancorp: 10, truist: 3 },
  { region: 'Massachusetts', td_bank: 41, pnc: 5, citizens: 46, us_bancorp: 7, truist: 1 },
  { region: 'Pennsylvania', td_bank: 16, pnc: 55, citizens: 19, us_bancorp: 3, truist: 7 },
  { region: 'Rhode Island', td_bank: 15, pnc: 2, citizens: 79, us_bancorp: 3, truist: 1 },
  { region: 'South Carolina', td_bank: 34, pnc: 15, citizens: 3, us_bancorp: 9, truist: 39 },
  { region: 'Florida', td_bank: 29, pnc: 29, citizens: 4, us_bancorp: 10, truist: 28 },
  { region: 'District of Columbia', td_bank: 18, pnc: 45, citizens: 3, us_bancorp: 13, truist: 21 },
  { region: 'Maryland', td_bank: 10, pnc: 53, citizens: 3, us_bancorp: 8, truist: 26 },
  { region: 'Virginia', td_bank: 10, pnc: 26, citizens: 3, us_bancorp: 11, truist: 50 },
  { region: 'North Carolina', td_bank: 7, pnc: 33, citizens: 2, us_bancorp: 10, truist: 48 },
  { region: 'Georgia', td_bank: 4, pnc: 26, citizens: 3, us_bancorp: 14, truist: 53 },
  { region: 'Arizona', td_bank: 5, pnc: 33, citizens: 3, us_bancorp: 57, truist: 2 },
  { region: 'Nevada', td_bank: 4, pnc: 10, citizens: 2, us_bancorp: 82, truist: 2 },
  { region: 'Illinois', td_bank: 2, pnc: 46, citizens: 2, us_bancorp: 48, truist: 2 },
  { region: 'Texas', td_bank: 5, pnc: 56, citizens: 4, us_bancorp: 24, truist: 11 },
  { region: 'Michigan', td_bank: 2, pnc: 60, citizens: 22, us_bancorp: 15, truist: 1 },
  { region: 'Tennessee', td_bank: 3, pnc: 12, citizens: 5, us_bancorp: 43, truist: 37 },
  { region: 'Washington', td_bank: 4, pnc: 8, citizens: 1, us_bancorp: 85, truist: 2 },
  { region: 'Alabama', td_bank: 2, pnc: 68, citizens: 3, us_bancorp: 9, truist: 18 },
  { region: 'California', td_bank: 4, pnc: 12, citizens: 2, us_bancorp: 80, truist: 2 },
  { region: 'Ohio', td_bank: 1, pnc: 57, citizens: 13, us_bancorp: 28, truist: 1 },
  { region: 'Louisiana', td_bank: 8, pnc: 27, citizens: 11, us_bancorp: 44, truist: 10 },
  { region: 'Colorado', td_bank: 2, pnc: 21, citizens: 2, us_bancorp: 73, truist: 2 },
  { region: 'Mississippi', td_bank: 6, pnc: 21, citizens: 20, us_bancorp: 36, truist: 17 },
  { region: 'Kansas', td_bank: 4, pnc: 11, citizens: 4, us_bancorp: 78, truist: 3 },
  { region: 'Oklahoma', td_bank: 7, pnc: 21, citizens: 12, us_bancorp: 53, truist: 7 },
  { region: 'Indiana', td_bank: 2, pnc: 69, citizens: 4, us_bancorp: 22, truist: 3 },
  { region: 'Kentucky', td_bank: 1, pnc: 50, citizens: 3, us_bancorp: 34, truist: 12 },
  { region: 'Utah', td_bank: 4, pnc: 15, citizens: 5, us_bancorp: 75, truist: 1 },
  { region: 'Minnesota', td_bank: 1, pnc: 4, citizens: 2, us_bancorp: 92, truist: 1 },
  { region: 'Oregon', td_bank: 1, pnc: 5, citizens: 1, us_bancorp: 92, truist: 1 },
  { region: 'Missouri', td_bank: 1, pnc: 18, citizens: 2, us_bancorp: 78, truist: 1 },
  { region: 'Hawaii', td_bank: 7, pnc: 19, citizens: 3, us_bancorp: 67, truist: 4 },
  { region: 'West Virginia', td_bank: 1, pnc: 26, citizens: 6, us_bancorp: 12, truist: 55 },
  { region: 'Wisconsin', td_bank: 1, pnc: 20, citizens: 4, us_bancorp: 74, truist: 1 },
  { region: 'North Dakota', td_bank: 2, pnc: 3, citizens: 1, us_bancorp: 94, truist: 0 },
  { region: 'Alaska', td_bank: 8, pnc: 17, citizens: 5, us_bancorp: 67, truist: 3 },
  { region: 'New Mexico', td_bank: 1, pnc: 27, citizens: 11, us_bancorp: 60, truist: 1 },
  { region: 'Montana', td_bank: 1, pnc: 3, citizens: 2, us_bancorp: 93, truist: 1 },
  { region: 'Arkansas', td_bank: 1, pnc: 13, citizens: 12, us_bancorp: 69, truist: 5 },
  { region: 'Nebraska', td_bank: 1, pnc: 6, citizens: 5, us_bancorp: 86, truist: 2 },
  { region: 'Iowa', td_bank: 1, pnc: 7, citizens: 3, us_bancorp: 87, truist: 2 },
  { region: 'Wyoming', td_bank: 1, pnc: 5, citizens: 2, us_bancorp: 91, truist: 1 },
  { region: 'South Dakota', td_bank: 1, pnc: 3, citizens: 2, us_bancorp: 93, truist: 1 },
  { region: 'Idaho', td_bank: 0, pnc: 6, citizens: 1, us_bancorp: 93, truist: 0 }
];

// Top 5 Banks - By State (Nov 9 to Dec 7 period)
export const top5BanksRegionalData: RegionalAwarenessData[] = [
  { region: 'New Hampshire', td_bank: 31, chase_bank: 21, capital_one: 20, citibank: 7, bank_of_america: 21 },
  { region: 'New Jersey', td_bank: 21, chase_bank: 31, capital_one: 18, citibank: 8, bank_of_america: 22 },
  { region: 'Maine', td_bank: 26, chase_bank: 23, capital_one: 24, citibank: 9, bank_of_america: 18 },
  { region: 'Vermont', td_bank: 24, chase_bank: 27, capital_one: 24, citibank: 12, bank_of_america: 13 },
  { region: 'Delaware', td_bank: 16, chase_bank: 27, capital_one: 26, citibank: 11, bank_of_america: 20 },
  { region: 'Connecticut', td_bank: 14, chase_bank: 27, capital_one: 21, citibank: 10, bank_of_america: 28 },
  { region: 'New York', td_bank: 10, chase_bank: 40, capital_one: 19, citibank: 13, bank_of_america: 18 },
  { region: 'Massachusetts', td_bank: 12, chase_bank: 26, capital_one: 20, citibank: 8, bank_of_america: 34 },
  { region: 'Pennsylvania', td_bank: 12, chase_bank: 32, capital_one: 29, citibank: 11, bank_of_america: 16 },
  { region: 'Rhode Island', td_bank: 8, chase_bank: 27, capital_one: 21, citibank: 7, bank_of_america: 37 },
  { region: 'South Carolina', td_bank: 10, chase_bank: 24, capital_one: 24, citibank: 10, bank_of_america: 32 },
  { region: 'Florida', td_bank: 6, chase_bank: 35, capital_one: 20, citibank: 10, bank_of_america: 29 },
  { region: 'District of Columbia', td_bank: 4, chase_bank: 30, capital_one: 32, citibank: 11, bank_of_america: 23 },
  { region: 'Maryland', td_bank: 3, chase_bank: 24, capital_one: 34, citibank: 10, bank_of_america: 29 },
  { region: 'Virginia', td_bank: 2, chase_bank: 25, capital_one: 37, citibank: 10, bank_of_america: 26 },
  { region: 'North Carolina', td_bank: 2, chase_bank: 28, capital_one: 26, citibank: 11, bank_of_america: 33 },
  { region: 'Georgia', td_bank: 1, chase_bank: 31, capital_one: 26, citibank: 9, bank_of_america: 33 },
  { region: 'Arizona', td_bank: 0, chase_bank: 48, capital_one: 18, citibank: 10, bank_of_america: 24 },
  { region: 'Nevada', td_bank: 0, chase_bank: 38, capital_one: 23, citibank: 11, bank_of_america: 28 },
  { region: 'Illinois', td_bank: 0, chase_bank: 51, capital_one: 20, citibank: 12, bank_of_america: 17 },
  { region: 'Texas', td_bank: 0, chase_bank: 42, capital_one: 24, citibank: 10, bank_of_america: 24 },
  { region: 'Michigan', td_bank: 0, chase_bank: 47, capital_one: 23, citibank: 11, bank_of_america: 19 },
  { region: 'Tennessee', td_bank: 1, chase_bank: 32, capital_one: 28, citibank: 12, bank_of_america: 27 },
  { region: 'Washington', td_bank: 0, chase_bank: 40, capital_one: 18, citibank: 12, bank_of_america: 30 },
  { region: 'Alabama', td_bank: 1, chase_bank: 35, capital_one: 37, citibank: 13, bank_of_america: 14 },
  { region: 'California', td_bank: 0, chase_bank: 42, capital_one: 16, citibank: 13, bank_of_america: 29 },
  { region: 'Ohio', td_bank: 0, chase_bank: 51, capital_one: 27, citibank: 10, bank_of_america: 12 },
  { region: 'Louisiana', td_bank: 0, chase_bank: 41, capital_one: 46, citibank: 6, bank_of_america: 7 },
  { region: 'Colorado', td_bank: 0, chase_bank: 49, capital_one: 28, citibank: 10, bank_of_america: 13 },
  { region: 'Kansas', td_bank: 0, chase_bank: 31, capital_one: 30, citibank: 12, bank_of_america: 27 },
  { region: 'Mississippi', td_bank: 1, chase_bank: 31, capital_one: 42, citibank: 11, bank_of_america: 15 },
  { region: 'Oklahoma', td_bank: 0, chase_bank: 39, capital_one: 29, citibank: 11, bank_of_america: 21 },
  { region: 'Indiana', td_bank: 0, chase_bank: 53, capital_one: 25, citibank: 10, bank_of_america: 12 },
  { region: 'Kentucky', td_bank: 0, chase_bank: 44, capital_one: 32, citibank: 12, bank_of_america: 12 },
  { region: 'Utah', td_bank: 0, chase_bank: 46, capital_one: 25, citibank: 15, bank_of_america: 14 },
  { region: 'Minnesota', td_bank: 0, chase_bank: 33, capital_one: 37, citibank: 15, bank_of_america: 15 },
  { region: 'Oregon', td_bank: 0, chase_bank: 40, capital_one: 22, citibank: 12, bank_of_america: 26 },
  { region: 'Missouri', td_bank: 0, chase_bank: 31, capital_one: 29, citibank: 12, bank_of_america: 28 },
  { region: 'Hawaii', td_bank: 0, chase_bank: 39, capital_one: 25, citibank: 20, bank_of_america: 16 },
  { region: 'West Virginia', td_bank: 0, chase_bank: 43, capital_one: 35, citibank: 10, bank_of_america: 12 },
  { region: 'Wisconsin', td_bank: 0, chase_bank: 45, capital_one: 30, citibank: 14, bank_of_america: 11 },
  { region: 'North Dakota', td_bank: 0, chase_bank: 34, capital_one: 35, citibank: 17, bank_of_america: 14 },
  { region: 'Alaska', td_bank: 0, chase_bank: 19, capital_one: 21, citibank: 12, bank_of_america: 48 },
  { region: 'New Mexico', td_bank: 0, chase_bank: 32, capital_one: 26, citibank: 13, bank_of_america: 29 },
  { region: 'Montana', td_bank: 0, chase_bank: 32, capital_one: 32, citibank: 18, bank_of_america: 18 },
  { region: 'Arkansas', td_bank: 0, chase_bank: 29, capital_one: 34, citibank: 12, bank_of_america: 25 },
  { region: 'Nebraska', td_bank: 0, chase_bank: 36, capital_one: 36, citibank: 15, bank_of_america: 13 },
  { region: 'Iowa', td_bank: 0, chase_bank: 34, capital_one: 34, citibank: 16, bank_of_america: 16 },
  { region: 'Wyoming', td_bank: 0, chase_bank: 37, capital_one: 33, citibank: 12, bank_of_america: 18 },
  { region: 'South Dakota', td_bank: 0, chase_bank: 33, capital_one: 38, citibank: 17, bank_of_america: 12 },
  { region: 'Idaho', td_bank: 0, chase_bank: 40, capital_one: 27, citibank: 16, bank_of_america: 17 }
];

// Helper functions for awareness data
export function getLatestRegionalBanksAwareness() {
  return regionalBanksDailyData[regionalBanksDailyData.length - 1];
}

export function getLatestTop5BanksAwareness() {
  return top5BanksDailyData[top5BanksDailyData.length - 1];
}

// Get top states for TD Bank
export function getTopTDStates(limit: number = 10) {
  return [...regionalBanksRegionalData]
    .sort((a, b) => b.td_bank - a.td_bank)
    .slice(0, limit);
}

// Get states where TD is competitive vs top 5
export function getTDCompetitiveStates(limit: number = 10) {
  return [...top5BanksRegionalData]
    .filter(state => state.td_bank && state.td_bank > 10)
    .sort((a, b) => (b.td_bank || 0) - (a.td_bank || 0))
    .slice(0, limit);
}

