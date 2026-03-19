// Mock data for the UI prototype — no backend needed

class MockData {
  // Worker profile
  static const String workerName = 'Ravi Kumar';
  static const String workerId = 'GS-28471';
  static const String workerCity = 'Chennai';
  static const String workerZone = 'Adyar';

  // Earnings
  static const double todayEarnings = 847.0;
  static const double weekEarnings = 3420.0;
  static const double monthEarnings = 14850.0;
  static const double avgWeeklyIncome = 4200.0;
  static const double avgHourlyIncome = 70.0;

  // Platform split
  static const Map<String, double> platformEarnings = {
    'Swiggy': 2150.0,
    'Zomato': 890.0,
    'Zepto': 380.0,
  };

  // Weekly earnings history (last 7 days)
  static const List<double> weeklyDailyEarnings = [
    620, 780, 430, 910, 540, 847, 0
  ];

  static const List<String> weekDays = [
    'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
  ];

  // Insurance
  static const double weeklyPremium = 45.0;
  static const double coverageCeiling = 2940.0;
  static const bool isCovered = true;
  static const int policyDaysRemaining = 4;
  static const double basePremium = 25.0;
  static const double zoneRiskAdjustment = 12.0;
  static const double weatherAdjustment = 8.0;

  // Claims history
  static const List<Map<String, dynamic>> claimsHistory = [
    {
      'date': '12 Mar 2026',
      'type': 'Heavy Rainfall',
      'amount': 420.0,
      'status': 'Paid',
      'hours': 6.0,
    },
    {
      'date': '28 Feb 2026',
      'type': 'Severe AQI',
      'amount': 350.0,
      'status': 'Paid',
      'hours': 5.0,
    },
    {
      'date': '15 Feb 2026',
      'type': 'Flooding',
      'amount': 560.0,
      'status': 'Paid',
      'hours': 8.0,
    },
  ];

  // Wallet
  static const double walletBalance = 385.0;
  static const double autoDeductionPerDay = 10.0;

  // Stability Score
  static const int stabilityScore = 62;
  static const double earningsConsistency = 68.0;
  static const double riskExposure = 55.0;
  static const double insuranceUtil = 80.0;
  static const double savingsBehavior = 45.0;

  // Work Decision
  static const int decisionScore = 72;
  static const String decisionLabel = 'GO';
  static const double demandScore = 78.0;
  static const double weatherSafety = 65.0;
  static const double coverageBonus = 80.0;
  static const double historicalStability = 60.0;

  // Boost recommendations
  static const List<Map<String, dynamic>> boostZones = [
    {
      'zone': 'Velachery',
      'score': 92,
      'peakTime': '7:30 - 9:30 PM',
      'estimatedBoost': '+28%',
      'distance': '3.2 km',
    },
    {
      'zone': 'T. Nagar',
      'score': 85,
      'peakTime': '12:00 - 2:00 PM',
      'estimatedBoost': '+22%',
      'distance': '5.1 km',
    },
    {
      'zone': 'Anna Nagar',
      'score': 78,
      'peakTime': '6:00 - 8:00 PM',
      'estimatedBoost': '+18%',
      'distance': '8.4 km',
    },
    {
      'zone': 'Mylapore',
      'score': 71,
      'peakTime': '11:00 AM - 1:00 PM',
      'estimatedBoost': '+15%',
      'distance': '2.8 km',
    },
  ];

  // Risk zones for heatmap
  static const List<Map<String, dynamic>> riskZones = [
    {'zone': 'Adyar', 'risk': 65, 'label': 'Moderate', 'rain': '12mm'},
    {'zone': 'Velachery', 'risk': 35, 'label': 'Low', 'rain': '2mm'},
    {'zone': 'T. Nagar', 'risk': 25, 'label': 'Low', 'rain': '0mm'},
    {'zone': 'Mylapore', 'risk': 72, 'label': 'High', 'rain': '28mm'},
    {'zone': 'Anna Nagar', 'risk': 18, 'label': 'Low', 'rain': '0mm'},
    {'zone': 'Guindy', 'risk': 55, 'label': 'Moderate', 'rain': '8mm'},
    {'zone': 'Porur', 'risk': 82, 'label': 'High', 'rain': '35mm'},
    {'zone': 'Tambaram', 'risk': 90, 'label': 'Critical', 'rain': '42mm'},
  ];

  // Wallet transactions
  static const List<Map<String, dynamic>> walletTransactions = [
    {'date': 'Today', 'desc': 'Auto-save from earnings', 'amount': 10.0, 'type': 'credit'},
    {'date': 'Yesterday', 'desc': 'Weekly premium paid', 'amount': -45.0, 'type': 'debit'},
    {'date': 'Yesterday', 'desc': 'Auto-save from earnings', 'amount': 10.0, 'type': 'credit'},
    {'date': '17 Mar', 'desc': 'Auto-save from earnings', 'amount': 10.0, 'type': 'credit'},
    {'date': '16 Mar', 'desc': 'Auto-save from earnings', 'amount': 10.0, 'type': 'credit'},
    {'date': '15 Mar', 'desc': 'Claim payout received', 'amount': 420.0, 'type': 'credit'},
    {'date': '14 Mar', 'desc': 'Auto-save from earnings', 'amount': 10.0, 'type': 'credit'},
  ];

  // Weekly forecast
  static const List<Map<String, dynamic>> weekForecast = [
    {'day': 'Thu', 'risk': 30, 'rain': '2mm', 'demand': 'High'},
    {'day': 'Fri', 'risk': 45, 'rain': '8mm', 'demand': 'Medium'},
    {'day': 'Sat', 'risk': 75, 'rain': '25mm', 'demand': 'Low'},
    {'day': 'Sun', 'risk': 60, 'rain': '15mm', 'demand': 'Medium'},
    {'day': 'Mon', 'risk': 20, 'rain': '0mm', 'demand': 'High'},
    {'day': 'Tue', 'risk': 15, 'rain': '0mm', 'demand': 'High'},
    {'day': 'Wed', 'risk': 35, 'rain': '5mm', 'demand': 'High'},
  ];
}
