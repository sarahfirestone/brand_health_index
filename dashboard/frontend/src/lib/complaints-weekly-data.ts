// Weekly complaints data - Updated Dec 8, 2025

export interface WeeklyComplaint {
  date: string;
  complaint_count: number;
  v_conf: number;
  weekly_score_0_100: number;
}

export const weeklyComplaintsData: WeeklyComplaint[] = [
  {
    date: '2025-09-28',
    complaint_count: 3,
    v_conf: 0.0234192037470726,
    weekly_score_0_100: 48.82903981264637
  },
  {
    date: '2025-10-05',
    complaint_count: 104,
    v_conf: 0.8118657298985168,
    weekly_score_0_100: 9.40671350507416
  },
  {
    date: '2025-10-12',
    complaint_count: 129,
    v_conf: 1.0,
    weekly_score_0_100: 0.0
  },
  {
    date: '2025-10-19',
    complaint_count: 109,
    v_conf: 0.8508977361436378,
    weekly_score_0_100: 7.455113192818108
  },
  {
    date: '2025-10-26',
    complaint_count: 102,
    v_conf: 0.7962529274004684,
    weekly_score_0_100: 10.187353629976581
  },
  {
    date: '2025-11-02',
    complaint_count: 91,
    v_conf: 0.7103825136612022,
    weekly_score_0_100: 14.48087431693989
  },
  {
    date: '2025-11-09',
    complaint_count: 127,
    v_conf: 0.9914129586260734,
    weekly_score_0_100: 0.42935206869633147
  },
  {
    date: '2025-11-16',
    complaint_count: 113,
    v_conf: 0.8821233411397347,
    weekly_score_0_100: 5.893832943013266
  },
  {
    date: '2025-11-23',
    complaint_count: 77,
    v_conf: 0.6010928961748634,
    weekly_score_0_100: 19.94535519125683
  },
  {
    date: '2025-11-30',
    complaint_count: 3,
    v_conf: 0.0234192037470726,
    weekly_score_0_100: 48.82903981264637
  }
];

// Helper functions
export function getLatestComplaintCount() {
  return weeklyComplaintsData[weeklyComplaintsData.length - 1].complaint_count;
}

export function getComplaintTrend() {
  const latest = weeklyComplaintsData[weeklyComplaintsData.length - 1];
  const previous = weeklyComplaintsData[weeklyComplaintsData.length - 2];
  return latest.complaint_count - previous.complaint_count;
}

export function getAverageComplaintCount() {
  const sum = weeklyComplaintsData.reduce((acc, curr) => acc + curr.complaint_count, 0);
  return Math.round(sum / weeklyComplaintsData.length);
}

// Get complaint volume score (inverse of count, normalized)
export function getComplaintVolumeScore() {
  const latest = weeklyComplaintsData[weeklyComplaintsData.length - 1];
  return 100 - latest.weekly_score_0_100;
}

