// Period icons and time ranges
export const PERIOD_CONFIG = {
  Morning: { icon: '\u2600\uFE0F', timeRange: '6AM - 12PM' },
  Afternoon: { icon: '\uD83C\uDF24\uFE0F', timeRange: '12PM - 5PM' },
  Evening: { icon: '\uD83C\uDF19', timeRange: '5PM - 9PM' },
  Night: { icon: '\uD83C\uDF03', timeRange: '9PM - 6AM' }
};

export const APPOINTMENT_TYPES = [
  { value: 'video_call', label: 'Video Call', icon: '\uD83D\uDCF9', description: 'Face-to-face consultation via video' },
  { value: 'voice_call', label: 'Voice Call', icon: '\uD83D\uDCDE', description: 'Audio consultation over phone' },
  { value: 'clinic_visit', label: 'Clinic Visit', icon: '\uD83C\uDFE5', description: 'In-person visit at the clinic' }
];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DAY_HEADERS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
