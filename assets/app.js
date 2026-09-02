/* ======================================================================
   Monthly Savings Manager — Application logic
   ====================================================================== */
(function () {
'use strict';

// ----------------------- State / Storage --------------------------------
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} },
};
const CFG = window.__APP__ || {};
const state = {
  lang: LS.get('lang', CFG.defaultLang || 'mm'),
  theme: LS.get('theme', CFG.defaultTheme || 'system'),
  mode: LS.get('mode', CFG.defaultMode || 'both'),
  month: LS.get('month', yyyymm(new Date())),
  year: parseInt(LS.get('year', String(new Date().getFullYear())), 10),
  route: 'dashboard',
  routeParam: null,
  auth: false,
  cache: {},
};

// ----------------------- i18n -------------------------------------------
const T = {
  mm: {
    'app.title': 'လစဉ်စုဆောင်းငွေ စီမံခန့်ခွဲမှု',
    'app.subtitle': 'အဖွဲ့လိုက် စုဆောင်ငွေ စီမံခန့်ခွဲသူ',
    'login.subtitle': 'စီမံခန့်ခွဲသူ လော့ဂ်အင်',
    'login.password': 'စီမံခန့်ခွဲသူ စကားဝှက်',
    'login.submit': 'လော့ဂ်အင်',
    'login.guest': 'ဧည့်သည်အဖြစ် ဆက်လက်ကြည့်ရှုမည်',
    'login.hint': 'မူလ - admin123 — Settings တွင် ပြောင်းပါ။',
    'login.invalid': 'စကားဝှက် မှားယွင်းနေပါသည်',
    'login.required_title': 'စီမံခန့်ခွဲသူ လော့ဂ်အင် လိုအပ်ပါသည်',
    'login.required_msg': 'ဒေတာ ပြင်ဆင်ရန် စီမံခန့်ခွဲသူ အကောင့်ဖြင့် ဝင်ရောက်ပါ။',
    'login.locked_banner': 'ဤစာမျက်နှာကို ကြည့်ရှုနိုင်သည်။ ပြင်ဆင်ရန် စီမံခန့်ခွဲသူ လော့ဂ်အင် လိုအပ်ပါသည်။',
    'admin.logout': 'ထွက်ရန်',
    'admin.signed_in_as': 'စီမံခန့်ခွဲသူ',
    'admin.change_password': 'စကားဝှက် ပြောင်းရန်',
    'admin.current_password': 'လက်ရှိ စကားဝှက်',
    'admin.new_password': 'စကားဝှက် အသစ်',
    'admin.password_changed': 'စကားဝှက် ပြောင်းပြီး',
    'spend.title': 'စုစုပေါင်းမှ ကုန်ကျစရိတ် နုတ်ယူမည်',
    'spend.amount': 'ပမာဏ',
    'spend.date': 'ရက်စွဲ',
    'spend.reason': 'အကြောင်းအရင်း / ဘာအတွက် သုံးသည်',
    'spend.confirm': 'ကုန်ကျစရိတ် မှတ်တမ်းတင်မည်',
    'spend.add': '+ Spend',
    'spend.saved': 'ကုန်ကျစရိတ် မှတ်တမ်းတင်ပြီး',
    'spend.deleted': 'ကုန်ကျစရိတ် ဖျက်ပြီး',
    'spend.balance': 'လက်ကျန် ရငွေ',
    'spend.list': 'ကုန်ကျစရိတ် မှတ်တမ်း',
    'spend.empty': 'ကုန်ကျစရိတ် မှတ်တမ်း မရှိသေးပါ',
    'spend.total': 'စုစုပေါင်း ကုန်ကျစရိတ်',
    'spend.insufficient': 'လက်ကျန် မလုံလောက်ပါ',
    'spend.kpi.total': 'စုစုပေါင်း ကုန်ကျစရိတ်',
    'spend.kpi.this_month': 'ယခုလ ကုန်ကျစရိတ်',
    'spend.kpi.this_year': 'ယခုနှစ် ကုန်ကျစရိတ်',
    'spend.kpi.avg_per_month': 'ပျမ်းမျှ လစဉ်ကုန်ကျစရိတ်',
    'spend.kpi.of_collected': 'စုဆောင်ငွေ၏',
    'spend.kpi.remaining': 'လက်ကျန်',
    'expenses.title': 'ကုန်ကျစရိတ်များ',
    'expenses.summary': 'အကျဉ်းချုပ်',
    'nav.dashboard': 'ပင်မမျက်နှာပြင်',
    'nav.monthly':   'လစဉ်ပေးချေမှု',
    'nav.members':   'အဖွဲ့ဝင်များ',
    'nav.expenses': 'ကုန်ကျစရိတ်များ',
    'nav.reports':   'အစီရင်ခံစာ',
    'nav.calendar':  'ပြက္ခဒိန်',
    'nav.backup':    'အရန်သိမ်းခြင်း',
    'nav.settings':  'ဆက်တင်များ',
    'action.quick_pay': '+ အမြန်ပေးချေ',
    'action.save': 'သိမ်းမည်',
    'action.cancel': 'ပယ်ဖျက်',
    'action.confirm': 'အတည်ပြု',
    'action.edit': 'ပြင်ဆင်',
    'action.delete': 'ဖျက်မည်',
    'action.add': 'ထည့်သွင်း',
    'action.search': 'ရှာဖွေ',
    'action.export': 'ထုတ်ယူမည်',
    'action.import': 'ပြန်လည်ထည့်သွင်း',
    'action.bulk_pay': 'အများပြုလုပ်',
    'action.mark_paid': 'ပေးပြီးဟု မှတ်မည်',
    'action.mark_unpaid': 'မပေးရသေးဟု မှတ်မည်',
    'action.activate': 'ပြန်လည်ဖွင့်',
    'action.deactivate': 'ပိတ်ထား',

    'field.member': 'အဖွဲ့ဝင်',
    'field.month': 'လ',
    'field.amount': 'ပမာဏ',
    'field.paid_at': 'ပေးချေသည့်ရက်',
    'field.note': 'မှတ်ချက်',
    'field.name': 'အမည်',
    'field.monthly_amount': 'လစဉ် ပမာဏ',
    'field.active': 'အသုံးပြုနိုင်',
    'field.year': 'နှစ်',
    'field.status': 'အခြေအနေ',
    'field.type': 'အမျိုးအစား',
    'field.search': 'ရှာဖွေရန်',

    'dashboard.title': 'ပင်မမျက်နှာပြင်',
    'dashboard.kpi.members': 'စုစုပေါင်း အဖွဲ့ဝင်',
    'dashboard.kpi.active':  'အသုံးပြုနေသော အဖွဲ့ဝင်',
    'dashboard.kpi.this_month': 'ယခုလ စုဆောင်ငွေ',
    'dashboard.kpi.all_time': 'စုစုပေါင်း စုဆောင်ငွေ',
    'dashboard.expected': 'မျှော်မှန်း',
    'dashboard.collected': 'စုဆောင်ပြီး',
    'dashboard.remaining': 'ကျန်ရှိ',
    'dashboard.surplus': 'ပိုငွေ',
    'dashboard.paid': 'ပေးပြီး',
    'dashboard.unpaid': 'မပေးရသေး',
    'dashboard.rate': 'စုဆောင်နှုန်း',
    'dashboard.trend': 'လစဉ်စုဆောင်ငွေ ခြေရာခံ',
    'dashboard.donut': 'ပေးပြီး / မပေးရသေး',
    'dashboard.bar': 'မျှော်မှန်း / စုဆောင် / ကျန်',
    'dashboard.top': 'ထိပ်ဆုံး အလှူရှင်များ',
    'dashboard.top_sub': 'ထိပ်ဆုံး ၃ ဦး',
    'dashboard.monthly_totals': 'လအလိုက် စုဆောင်ငွေ',
    'dashboard.expected_compared': 'မျှော်မှန်းနှင့် စုဆောင်နှိုင်းယှဉ်ချက်',
    'dashboard.this_year': 'ယခုနှစ် စုစုပေါင်း',
    'dashboard.member_status': 'ယခုလ အဖွဲ့ဝင် အခြေအနေ',
    'dashboard.year_total': 'ယခုနှစ် စုစုပေါင်း',

    'monthly.title': 'လစဉ် ပေးချေမှု',
    'monthly.prev': '← ယခင်',
    'monthly.next': 'နောက် →',
    'monthly.table.member': 'အဖွဲ့ဝင်',
    'monthly.table.target': 'လစဉ် ပမာဏ',
    'monthly.table.amount': 'ပေးချေပမာဏ',
    'monthly.table.status': 'အခြေအနေ',
    'monthly.table.paid_at': 'ပေးချေသည့်ရက်',
    'monthly.table.action': 'လုပ်ဆောင်ချက်',
    'monthly.summary': 'အကျဉ်းချုပ်',
    'monthly.select_all': 'အားလုံးရွေးမည်',

    'members.title': 'အဖွဲ့ဝင်များ',
    'members.add': '+ အဖွဲ့ဝင်အသစ်',
    'members.search_ph': 'အမည်ဖြင့် ရှာဖွေ…',
    'members.filter.all': 'အားလုံး',
    'members.filter.active': 'အသုံးပြုနေ',
    'members.filter.inactive': 'ပိတ်ထား',
    'members.total_saved': 'စုစုပေါင်း စုဆောင်',
    'members.paid_months': 'ပေးပြီးလ',
    'members.rate': 'ပေးနိုင်နှုန်း',
    'members.current_status': 'ယခုလ',
    'members.empty': 'အဖွဲ့ဝင် မရှိသေးပါ',

    'member.title': 'အဖွဲ့ဝင်',
    'member.profile': 'အဖွဲ့ဝင် အသေးစိတ်',
    'member.history': 'ပေးချေမှု မှတ်တမ်း',
    'member.expected': 'လစဉ် ပမာဏ',
    'member.total_saved': 'စုစုပေါင်း',
    'member.paid_months': 'ပေးပြီးလ',
    'member.unpaid_months': 'မပေးရသေးလ',
    'member.rate': 'ပေးနိုင်နှုန်း',
    'member.avg': 'ပျမ်းမျှ',

    'reports.title': 'အစီရင်ခံစာ',
    'reports.tab.all_month': 'လအလိုက်',
    'reports.tab.yearly': 'နှစ်အလိုက်',
    'reports.tab.member': 'အဖွဲ့ဝင်အလိုက်',
    'reports.col.month': 'လ',
    'reports.col.expected': 'မျှော်မှန်း',
    'reports.col.collected': 'စုဆောင်',
    'reports.col.remaining': 'ကျန်',
    'reports.col.surplus': 'ပိုငွေ',
    'reports.col.paid': 'ပေးပြီး',
    'reports.col.unpaid': 'မပေးရသေး',
    'reports.col.rate': 'နှုန်း',
    'reports.col.member': 'အဖွဲ့ဝင်',
    'reports.col.total': 'စုစုပေါင်း',
    'reports.col.avg': 'ပျမ်းမျှ',
    'reports.col.year': 'နှစ်',
    'reports.chart.title': 'ခြုံငုံသုံးသပ်ချက်',
    'reports.list.title': 'အသေးစိတ်',
    'reports.kpi.collected': 'စုစုပေါင်း စုဆောင်',
    'reports.kpi.expected': 'စုစုပေါင်း မျှော်မှန်း',
    'reports.kpi.surplus': 'စုစုပေါင်း ပိုငွေ',
    'reports.kpi.rate': 'ပျမ်းမျှ နှုန်း',
    'reports.kpi.healthy': 'ကောင်းမွန်နေသည်',
    'reports.kpi.watch': 'သတိပြုရန်',

    'calendar.title': 'ပြက္ခဒိန်',
    'calendar.empty': 'ဤလတွင် ပေးချေမှု မရှိသေးပါ',

    'settings.title': 'ဆက်တင်များ',
    'settings.general': 'ယေဘုယျ',
    'settings.default_amount': 'မူလ လစဉ်ပမာဏ',
    'settings.group_name': 'အဖွဲ့အမည်',
    'settings.display_mode': 'ပမာဏ ပြသမှု',
    'settings.display.exact': 'တိကျသော ဂဏန်း',
    'settings.display.units': 'မြန်မာ ယူနစ်',
    'settings.display.both': 'နှစ်မျိုးလုံး',
    'settings.display.auto': 'အလိုအလျောက်',
    'settings.theme': 'အသွင်အပြင်',
    'settings.theme.light': 'အလင်း',
    'settings.theme.dark':  'မှောင်',
    'settings.theme.system': 'စနစ်',
    'settings.language': 'ဘာသာစကား',
    'settings.saved': 'ဆက်တင်များ သိမ်းပြီး',

    'backup.title': 'အရန်သိမ်းခြင်း',
    'backup.export_json': 'JSON ထုတ်ယူ',
    'backup.export_sqlite': 'SQLite ထုတ်ယူ',
    'backup.export_csv': 'CSV (ပေးချေမှုများ) ထုတ်ယူ',
    'backup.import_json': 'JSON ပြန်လည်ထည့်သွင်း',
    'backup.mode': 'ထည့်သွင်းမှု ပုံစံ',
    'backup.merge': 'ပေါင်းစပ်',
    'backup.replace': 'အစားထိုး',
    'backup.warning': 'သတိ - "အစားထိုး" ပြုလုပ်ပါက လက်ရှိ ဒေတာများ ဖျက်ပစ်ပါမည်',
    'backup.imported': 'ပြန်လည်ထည့်သွင်းပြီး',

    'payment.title': 'ပေးချေမှု မှတ်တမ်းတင်',
    'payment.saved': 'ပေးချေမှု သိမ်းပြီး',
    'payment.deleted': 'ပေးချေမှု ဖျက်ပြီး',
    'member.added': 'အဖွဲ့ဝင် ထည့်သွင်းပြီး',
    'member.updated': 'အဖွဲ့ဝင် ပြင်ဆင်ပြီး',
    'member.deleted': 'အဖွဲ့ဝင် ဖျက်ပြီး',
    'amount.invalid': '⚠ ပမာဏကို နားလည်မရပါ',
    'bulk.title': 'အများပြုလုပ်',
    'bulk.confirm': 'ရွေးထားသည်များ ပေးပြီးဟု မှတ်မည်',
    'bulk.amount_label': 'ပမာဏ (ဗလာထားပါက အဖွဲ့ဝင်၏ လစဉ်ပမာဏကို အသုံးပြုမည်)',
    'bulk.saved': 'ပေးချေပြီး {n} ဦး',

    'confirm.title': 'အတည်ပြု',
    'empty.nothing': 'ဒေတာ မရှိသေးပါ',
    'pagination.prev': 'ယခင်',
    'pagination.next': 'နောက်',
    'common.all': 'အားလုံး',
    'common.paid': 'ပေးပြီး',
    'common.unpaid': 'မပေးရသေး',
    'common.yes': 'ဟုတ်ကဲ့',
    'common.no': 'မဟုတ်ပါ',
    'common.from': 'မှ',
    'common.to': 'သို့',
    'common.none': '—',
    'status.paid': 'ပေးပြီး',
    'status.unpaid': 'မပေးရသေး',
    'common.loading': 'ခဏစောင့်ပါ…',
    'common.refresh': 'ပြန်လည်ရယူ',
  },
  en: {
    'app.title': 'Monthly Savings',
    'app.subtitle': 'Group savings manager',
    'login.subtitle': 'Admin sign-in',
    'login.password': 'Admin password',
    'login.submit': 'Sign in',
    'login.guest': 'Continue as Guest',
    'login.hint': 'Default: admin123 — change it in Settings.',
    'login.invalid': 'Incorrect password',
    'login.required_title': 'Admin login required',
    'login.required_msg': 'Please sign in as admin to make changes.',
    'login.locked_banner': 'View-only. Sign in as admin to edit data.',
    'admin.logout': 'Sign out',
    'admin.signed_in_as': 'Admin',
    'admin.change_password': 'Change password',
    'admin.current_password': 'Current password',
    'admin.new_password': 'New password',
    'admin.password_changed': 'Password changed',
    'spend.title': 'Spend from total',
    'spend.amount': 'Amount',
    'spend.date': 'Date',
    'spend.reason': 'Reason / what was it spent on',
    'spend.confirm': 'Record Spend',
    'spend.add': '+ Spend',
    'spend.saved': 'Spend recorded',
    'spend.deleted': 'Spend deleted',
    'spend.balance': 'Available balance',
    'spend.list': 'Spend history',
    'spend.empty': 'No spend records yet',
    'spend.total': 'Total spent',
    'spend.insufficient': 'Insufficient balance',
    'spend.kpi.total': 'Total Spent',
    'spend.kpi.this_month': 'Spent This Month',
    'spend.kpi.this_year': 'Spent This Year',
    'spend.kpi.avg_per_month': 'Avg. Monthly Spend',
    'spend.kpi.of_collected': 'of collected',
    'spend.kpi.remaining': 'Remaining',
    'expenses.title': 'Expenses',
    'expenses.summary': 'Summary',
    'nav.dashboard': 'Dashboard',
    'nav.monthly':   'Monthly',
    'nav.members':   'Members',
    'nav.expenses': 'Expenses',
    'nav.reports':   'Reports',
    'nav.calendar':  'Calendar',
    'nav.backup':    'Backup',
    'nav.settings':  'Settings',
    'action.quick_pay': '+ Quick Pay',
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.confirm': 'Confirm',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.add': 'Add',
    'action.search': 'Search',
    'action.export': 'Export',
    'action.import': 'Import',
    'action.bulk_pay': 'Bulk Pay',
    'action.mark_paid': 'Mark Paid',
    'action.mark_unpaid': 'Mark Unpaid',
    'action.activate': 'Activate',
    'action.deactivate': 'Deactivate',

    'field.member': 'Member',
    'field.month': 'Month',
    'field.amount': 'Amount',
    'field.paid_at': 'Paid Date',
    'field.note': 'Note',
    'field.name': 'Name',
    'field.monthly_amount': 'Monthly Amount',
    'field.active': 'Active',
    'field.year': 'Year',
    'field.status': 'Status',
    'field.type': 'Type',
    'field.search': 'Search',

    'dashboard.title': 'Dashboard',
    'dashboard.kpi.members': 'Total Members',
    'dashboard.kpi.active':  'Active Members',
    'dashboard.kpi.this_month': 'This Month',
    'dashboard.kpi.all_time': 'All-Time Savings',
    'dashboard.expected': 'Expected',
    'dashboard.collected': 'Collected',
    'dashboard.remaining': 'Remaining',
    'dashboard.surplus': 'Surplus',
    'dashboard.paid': 'Paid',
    'dashboard.unpaid': 'Unpaid',
    'dashboard.rate': 'Collection Rate',
    'dashboard.trend': 'Monthly Savings Trend',
    'dashboard.donut': 'Paid vs Unpaid',
    'dashboard.bar': 'Expected vs Collected',
    'dashboard.top': 'Top Contributors',
    'dashboard.top_sub': 'Top 3',
    'dashboard.monthly_totals': 'Monthly Savings Overview',
    'dashboard.expected_compared': 'Expected vs Collected (current month)',
    'dashboard.this_year': 'This Year',
    'dashboard.member_status': 'Members — This Month',
    'dashboard.year_total': 'This Year Total',

    'monthly.title': 'Monthly Payments',
    'monthly.prev': '← Previous',
    'monthly.next': 'Next →',
    'monthly.table.member': 'Member',
    'monthly.table.target': 'Monthly Target',
    'monthly.table.amount': 'Paid Amount',
    'monthly.table.status': 'Status',
    'monthly.table.paid_at': 'Paid Date',
    'monthly.table.action': 'Action',
    'monthly.summary': 'Summary',
    'monthly.select_all': 'Select all',

    'members.title': 'Members',
    'members.add': '+ Add Member',
    'members.search_ph': 'Search by name…',
    'members.filter.all': 'All',
    'members.filter.active': 'Active',
    'members.filter.inactive': 'Inactive',
    'members.total_saved': 'Total Saved',
    'members.paid_months': 'Paid Months',
    'members.rate': 'Payment Rate',
    'members.current_status': 'This Month',
    'members.empty': 'No members yet',

    'member.title': 'Member',
    'member.profile': 'Member Profile',
    'member.history': 'Payment History',
    'member.expected': 'Monthly Target',
    'member.total_saved': 'Total Saved',
    'member.paid_months': 'Paid Months',
    'member.unpaid_months': 'Unpaid Months',
    'member.rate': 'Payment Rate',
    'member.avg': 'Average',

    'reports.title': 'Reports',
    'reports.tab.all_month': 'All Months',
    'reports.tab.yearly': 'Yearly',
    'reports.tab.member': 'Members',
    'reports.col.month': 'Month',
    'reports.col.expected': 'Expected',
    'reports.col.collected': 'Collected',
    'reports.col.remaining': 'Remaining',
    'reports.col.surplus': 'Surplus',
    'reports.col.paid': 'Paid',
    'reports.col.unpaid': 'Unpaid',
    'reports.col.rate': 'Rate',
    'reports.col.member': 'Member',
    'reports.col.total': 'Total',
    'reports.col.avg': 'Average',
    'reports.col.year': 'Year',
    'reports.chart.title': 'Overview',
    'reports.list.title': 'Breakdown',
    'reports.kpi.collected': 'Total Collected',
    'reports.kpi.expected': 'Total Expected',
    'reports.kpi.surplus': 'Total Surplus',
    'reports.kpi.rate': 'Average Rate',
    'reports.kpi.healthy': 'On track',
    'reports.kpi.watch': 'Needs attention',

    'calendar.title': 'Calendar',
    'calendar.empty': 'No payment activity this month',

    'settings.title': 'Settings',
    'settings.general': 'General',
    'settings.default_amount': 'Default Monthly Amount',
    'settings.group_name': 'Group Name',
    'settings.display_mode': 'Amount Display',
    'settings.display.exact': 'Exact',
    'settings.display.units': 'Myanmar Units',
    'settings.display.both': 'Both',
    'settings.display.auto': 'Auto',
    'settings.theme': 'Theme',
    'settings.theme.light': 'Light',
    'settings.theme.dark':  'Dark',
    'settings.theme.system': 'System',
    'settings.language': 'Language',
    'settings.saved': 'Settings saved',

    'backup.title': 'Backup & Restore',
    'backup.export_json': 'Export JSON',
    'backup.export_sqlite': 'Export SQLite',
    'backup.export_csv': 'Export CSV (Payments)',
    'backup.import_json': 'Import JSON',
    'backup.mode': 'Import mode',
    'backup.merge': 'Merge',
    'backup.replace': 'Replace',
    'backup.warning': 'Warning: "Replace" will erase current data',
    'backup.imported': 'Import completed',

    'payment.title': 'Record Payment',
    'payment.saved': 'Payment saved',
    'payment.deleted': 'Payment deleted',
    'member.added': 'Member added',
    'member.updated': 'Member updated',
    'member.deleted': 'Member deleted',
    'amount.invalid': '⚠ Amount could not be understood',
    'bulk.title': 'Bulk Payment',
    'bulk.confirm': 'Mark Selected as Paid',
    'bulk.amount_label': 'Amount (leave blank to use each member’s monthly target)',
    'bulk.saved': 'Saved {n} payments',

    'confirm.title': 'Confirm',
    'empty.nothing': 'No data yet',
    'pagination.prev': 'Previous',
    'pagination.next': 'Next',
    'common.all': 'All',
    'common.paid': 'Paid',
    'common.unpaid': 'Unpaid',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.from': 'From',
    'common.to': 'To',
    'common.none': '—',
    'status.paid': 'Paid',
    'status.unpaid': 'Unpaid',
    'common.loading': 'Loading…',
    'common.refresh': 'Refresh',
  },
};
function t(k) { return (T[state.lang] && T[state.lang][k]) || (T.en[k] || k); }
function trAll(root) {
  (root || document).querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    el.textContent = t(k);
  });
  (root || document).querySelectorAll('[data-i18n-ph]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph')));
  });
  (root || document).querySelectorAll('[data-i18n-title]').forEach(el => {
    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
  });
}

// ----------------------- Myanmar amount helpers (mirror of PHP) --------
const MM_DIGIT_MAP = {'၀':'0','၁':'1','၂':'2','၃':'3','၄':'4','၅':'5','၆':'6','၇':'7','၈':'8','၉':'9'};
const EN_TO_MM = {'0':'၀','1':'၁','2':'၂','3':'၃','4':'၄','5':'၅','6':'၆','7':'၇','8':'၈','9':'၉'};
function mmToEn(s) { return s.replace(/[၀-၉०-९]/g, c => MM_DIGIT_MAP[c] || c); }
function enToMm(s) { return s.replace(/[0-9]/g, d => EN_TO_MM[d]); }

function parseMyAmount(raw) {
  if (raw == null) return null;
  const orig = String(raw).trim();
  if (!orig) return null;
  let work = mmToEn(orig);
  work = work.replace(/ကျပ်|MMK|mmk/gi, '');

  const mmUnits = ['ကုဋေ','သန်း','သိန်း','သောင်း','ထောင်','ရာ','ခွဲ'];
  let hasMmUnit = false;
  for (const u of mmUnits) if (work.indexOf(u) !== -1) { hasMmUnit = true; break; }

  const m1 = work.match(/^(-?\d+(?:\.\d+)?)\s*k$/i);
  if (m1) return Math.round(parseFloat(m1[1]) * 1000);
  const m2 = work.match(/^(-?\d+(?:\.\d+)?)\s*(?:lakh|la)$/i);
  if (m2) return Math.round(parseFloat(m2[1]) * 100000);
  const m3 = work.match(/^(-?\d+(?:\.\d+)?)\s*(?:m|million)$/i);
  if (m3) return Math.round(parseFloat(m3[1]) * 1000000);

  if (!hasMmUnit) {
    const digits = work.replace(/[^\d.\-]/g, '');
    if (digits && /^-?\d+(?:\.\d+)?$/.test(digits)) return Math.round(parseFloat(digits));
  }
  if (!hasMmUnit) return null;

  const units = { 'ကုဋေ': 1e12, 'သန်း': 1e6, 'သိန်း': 1e5, 'သောင်း': 1e4, 'ထောင်': 1e3, 'ရာ': 100 };
  let norm = work.replace(/[,\s၊]+/g, ' ');
  for (const u of Object.keys(units)) {
    norm = norm.split(u).join(' ' + u + ' ');
  }
  norm = norm.split('ခွဲ').join(' ခွဲ ');
  norm = norm.replace(/\s+/g, ' ').trim();
  const tokens = norm.length ? norm.split(/\s+/) : [];
  if (!tokens.length) return null;
  let total = 0; let i = 0;
  while (i < tokens.length) {
    const tok = tokens[i];
    if (tok === '' || tok === '-') { i++; continue; }
    if (/^-?\d+(\.\d+)?$/.test(tok)) {
      const num = parseFloat(tok);
      let unit = 1;
      if (i + 1 < tokens.length && units.hasOwnProperty(tokens[i+1])) { unit = units[tokens[i+1]]; i += 2; } else { i++; }
      const half = (i < tokens.length && tokens[i] === 'ခွဲ');
      if (half) { i++; total += num * unit + unit * 0.5; } else { total += num * unit; }
    } else if (units.hasOwnProperty(tok)) {
      const unit = units[tok]; i++;
      const half = (i < tokens.length && tokens[i] === 'ခွဲ');
      if (half) { i++; total += unit + unit * 0.5; } else { total += unit; }
    } else { i++; }
  }
  return total > 0 ? Math.round(total) : null;
}

function formatMoney(n) { return Number(n || 0).toLocaleString('en-US'); }
function formatMoneyMm(n) { return enToMm(Number(n || 0).toLocaleString('en-US')); }

function formatMmUnits(n, withKyat = true) {
  n = Math.max(0, Math.floor(n || 0));
  const suffix = withKyat ? ' ကျပ်' : '';
  if (n === 0) return '၀' + suffix;
  const kyat  = n % 1000; let x = Math.floor(n/1000);
  const thou  = x % 100; x = Math.floor(x/100);
  const lakh  = x % 100; x = Math.floor(x/100);
  const mil   = x % 100; x = Math.floor(x/100);
  const bil   = x;
  const parts = [];
  const push = (numEn, unit) => {
    if (parseInt(numEn,10) > 0) parts.push(enToMm(numEn) + (unit !== '' ? ' ' + unit : ''));
  };
  push(String(bil), 'ကုဋေ');
  push(String(mil), 'သန်း');
  if (lakh > 0) {
    const l = lakh, t = thou, k = kyat;
    if (l >= 1 && t === 50 && k === 0) parts.push(enToMm(String(l)) + ' သိန်းခွဲ');
    else {
      push(String(l), 'သိန်း');
      let rem = t * 1000 + k;
      if (rem >= 10000) { push(String(Math.floor(rem/10000)), 'သောင်း'); rem = rem % 10000; }
      if (rem >= 1000)  { push(String(Math.floor(rem/1000)), 'ထောင်'); rem = rem % 1000; }
      if (rem >= 100)   { push(String(Math.floor(rem/100)), 'ရာ'); rem = rem % 100; }
      if (rem > 0) push(String(rem), '');
    }
  } else {
    let rem = thou * 1000 + kyat;
    if (rem >= 10000) { push(String(Math.floor(rem/10000)), 'သောင်း'); rem = rem % 10000; }
    if (rem >= 1000)  { push(String(Math.floor(rem/1000)), 'ထောင်'); rem = rem % 1000; }
    if (rem >= 100)   { push(String(Math.floor(rem/100)), 'ရာ'); rem = rem % 100; }
    if (rem > 0) push(String(rem), '');
  }
  return (parts.length ? parts.join(' ') : '၀') + suffix;
}

function formatAmount(n) {
  if (n == null || isNaN(n)) return '—';
  const v = Number(n);
  switch (state.mode) {
    case 'exact': return { en: formatMoney(v), mm: formatMoneyMm(v) };
    case 'units': return { en: '', mm: formatMmUnits(v) };
    case 'auto': {
      if (v >= 100000) return { en: formatMoney(v), mm: formatMmUnits(v) };
      return { en: formatMoney(v), mm: formatMoneyMm(v) };
    }
    case 'both':
    default: return { en: formatMoney(v) + ' MMK', mm: formatMmUnits(v) };
  }
}

function amountHTML(n, opts = {}) {
  const { tag = 'span', title } = opts;
  const a = formatAmount(n);
  if (state.mode === 'exact') {
    return `<${tag} class="amt-exact"${title?` title="${title}"`:''}>${state.lang === 'mm' ? a.mm : a.en}</${tag}>`;
  }
  if (state.mode === 'units') {
    return `<${tag} class="amt-units amount-text"${title?` title="${title}"`:''}>${a.mm}</${tag}>`;
  }
  // both / auto
  return `<${tag} class="amt-stack"${title?` title="${title}"`:''}>
    <span class="amt-exact">${state.lang === 'mm' ? a.mm : a.en}</span>
    <span class="amt-units amount-text">${a.mm}</span>
  </${tag}>`;
}

// ----------------------- Date helpers -----------------------------------
function yyyymm(d) { return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0'); }
function parseYyyymm(s) { const [y,m] = s.split('-').map(Number); return new Date(y, m-1, 1); }
function addMonth(s, delta) {
  const d = parseYyyymm(s); d.setMonth(d.getMonth()+delta);
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0');
}
function monthName(s, lang) {
  const d = parseYyyymm(s);
  const mm = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const mmMM = ['ဇန်နဝါရီ','ဖေဖော်ဝါရီ','မတ်','ဧပြီ','မေ','ဇွန်','ဇူလိုင်','သြဂုတ်','စက်တင်ဘာ','အောက်တိုဘာ','နိုဝင်ဘာ','ဒီဇင်ဘာ'];
  return (lang === 'mm' ? mmMM : mm)[d.getMonth()] + ' ' + d.getFullYear();
}
function shortMonthName(s, lang) {
  const d = parseYyyymm(s);
  const mm = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const mmMM = ['ဇန်','ဖေ','မတ်','ဧပြီ','မေ','ဇွန်','ဇူ','သြ','စက်','အောက်','နို','ဒီ'];
  return (lang === 'mm' ? mmMM : mm)[d.getMonth()];
}

// ----------------------- API -------------------------------------------
async function api(action, params = {}, method = 'GET', body = null) {
  const url = new URL(location.href);
  url.search = '';
  url.searchParams.set('api', action);
  for (const [k, v] of Object.entries(params || {})) {
    if (v != null) url.searchParams.set(k, v);
  }
  const opt = { method, headers: { 'Accept': 'application/json' }, credentials: 'same-origin' };
  if (body && method !== 'GET') {
    opt.headers['Content-Type'] = 'application/json';
    opt.body = JSON.stringify(body);
  }
  let r;
  try {
    r = await fetch(url, opt);
  } catch (e) {
    // Network error or aborted request — give a clearer message
    throw new Error('Network error');
  }
  const ct = (r.headers.get('content-type') || '').toLowerCase();
  if (!ct.includes('application/json')) {
    // Server returned HTML or empty (route mismatch / crash). Try to give a useful hint.
    let body = '';
    try { body = (await r.text()).slice(0, 200); } catch (_) {}
    console.error('[api] Non-JSON response for', action, 'status=', r.status, 'body=', body);
    throw new Error('Bad response from server');
  }
  const j = await r.json().catch(() => ({ success: false, error: 'Bad response' }));
  if (r.status === 401 || (j && j.error === 'auth_required')) {
    state.auth = false;
    showLogin();
    throw new Error('auth_required');
  }
  if (!j.success) throw new Error(j.error || 'Request failed');
  return j.data;
}

// Write action: triggers the login overlay if not authed; resolves true if the user became authed.
async function ensureAuth() {
  if (state.auth) return true;
  try {
    const s = await api('auth_status');
    if (s && s.auth) { state.auth = true; hideLogin(); return true; }
  } catch (e) {}
  showLogin();
  return false;
}

// ----------------------- DOM helpers ------------------------------------
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k === 'on' && typeof v === 'object') for (const [ev, fn] of Object.entries(v)) e.addEventListener(ev, fn);
    else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
    else if (v === true) e.setAttribute(k, '');
    else if (v != null && v !== false) e.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return e;
}
function escapeHTML(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// ----------------------- Toast -----------------------------------------
function toast(msg, kind = 'good', ms = 2400) {
  const root = $('#toast-root');
  const node = el('div', { class: 'toast ' + kind }, msg);
  root.appendChild(node);
  setTimeout(() => { node.style.opacity = '0'; setTimeout(() => node.remove(), 200); }, ms);
}

// ----------------------- Modal -----------------------------------------
function openModal(content, opts = {}) {
  const root = $('#modal-root');
  root.innerHTML = '';
  if (typeof content === 'string') root.innerHTML = content;
  else root.appendChild(content);
  root.classList.add('open');
  trAll(root);
  if (opts.onOpen) opts.onOpen(root);
  const closer = () => closeModal();
  root.addEventListener('click', e => { if (e.target === root) closer(); });
  root.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closer));
  return { root, close: closer };
}
function closeModal() { const r = $('#modal-root'); r.classList.remove('open'); r.innerHTML = ''; }

function confirmModal(message, onYes) {
  const tpl = $('#tpl-confirm-modal').content.cloneNode(true);
  tpl.querySelector('[data-confirm-msg]').textContent = message;
  const m = openModal(tpl);
  m.root.querySelector('[data-confirm-ok]').addEventListener('click', () => { m.close(); onYes && onYes(); });
}

// ----------------------- Format binding in forms ------------------------
function bindAmountPreview(input, preview) {
  if (!input) return;
  const update = () => {
    const v = input.value.trim();
    if (!v) { preview.textContent = ''; preview.className = 'amount-preview'; return; }
    const n = parseMyAmount(v);
    if (n == null) { preview.className = 'amount-preview err'; preview.textContent = t('amount.invalid'); }
    else { preview.className = 'amount-preview ok'; const a = formatAmount(n); preview.innerHTML = (state.lang === 'mm' ? a.mm : a.en); }
  };
  input.addEventListener('input', update);
  update();
}

// ----------------------- Topbar month/year pickers ----------------------
function setupTopbar() {
  const mp = $('#month-picker'), yp = $('#year-picker');
  // Build month options: previous 24 months
  const now = new Date();
  const opts = [];
  for (let i = -24; i <= 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth()+i, 1);
    opts.push(yyyymm(d));
  }
  mp.innerHTML = '';
  for (const m of opts) {
    const o = document.createElement('option');
    o.value = m;
    o.textContent = monthName(m, state.lang);
    if (m === state.month) o.selected = true;
    mp.appendChild(o);
  }
  mp.addEventListener('change', () => { state.month = mp.value; LS.set('month', state.month); route(); });

  // Years: current ± 5
  yp.innerHTML = '';
  const yr = now.getFullYear();
  for (let y = yr - 5; y <= yr + 1; y++) {
    const o = document.createElement('option');
    o.value = String(y); o.textContent = String(y);
    if (y === state.year) o.selected = true;
    yp.appendChild(o);
  }
  yp.addEventListener('change', () => { state.year = parseInt(yp.value, 10); LS.set('year', String(state.year)); route(); });
}

// ----------------------- Auth UI ---------------------------------------
function showLogin() {
  const ls = $('#login-screen');
  if (ls) ls.hidden = false;
  document.body.classList.add('locked');
  // Clear any stale error so the user doesn't see a leftover message
  const errEl = $('#login-error');
  if (errEl) { errEl.textContent = ''; errEl.hidden = true; }
  const pw = ls && ls.querySelector('input[name=password]');
  if (pw) pw.value = '';
  // Focus the password field next tick
  setTimeout(() => { const f = ls && ls.querySelector('input[name=password]'); if (f) f.focus(); }, 30);
}
function hideLogin() {
  const ls = $('#login-screen');
  if (ls) ls.hidden = true;
  document.body.classList.remove('locked');
}
function setAuthUi() {
  // Toggle admin-only affordances
  $$('.admin-only').forEach(b => b.disabled = !state.auth);
  // Topbar sign-in / out button
  const btn = $('#auth-btn');
  if (btn) {
    btn.textContent = state.auth ? t('admin.logout') : t('login.submit');
    btn.classList.toggle('primary-btn', !state.auth);
    btn.classList.toggle('ghost-btn', state.auth);
  }
  // Locked banner
  $$('.locked-banner').forEach(b => b.remove());
  if (!state.auth) {
    const banner = el('div', { class: 'locked-banner' },
      el('span', {}, '🔒 ' + t('login.locked_banner')),
      el('button', { class: 'ghost-btn', on: { click: showLogin } }, t('login.submit'))
    );
    const c = $('#content'); if (c) c.prepend(banner);
  }
}
async function doLogin(password) {
  // Clear any stale error before attempting
  const errEl = $('#login-error');
  if (errEl) { errEl.textContent = ''; errEl.hidden = true; }
  try {
    await api('login', {}, 'POST', { password });
    state.auth = true;
    hideLogin();
    setAuthUi();
    toast(t('login.submit'), 'good', 1200);
    route();
    return true;
  } catch (e) {
    const msg = (e && e.message && e.message !== 'auth_required' && e.message !== 'Bad response' && e.message !== 'Request failed')
      ? e.message : t('login.invalid');
    if (errEl) { errEl.textContent = msg; errEl.hidden = false; }
    return false;
  }
}
async function doLogout() {
  try { await api('logout', {}, 'POST'); } catch (e) {}
  state.auth = false;
  showLogin();
  setAuthUi();
}
function bindLoginForm() {
  const form = $('#login-form');
  if (form) form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pw = form.querySelector('input[name=password]').value;
    const ok = await doLogin(pw);
    if (ok) form.querySelector('input[name=password]').value = '';
  });
  const guest = $('#guest-btn');
  if (guest) guest.addEventListener('click', () => enterAsGuest());
}
function enterAsGuest() {
  state.auth = false;
  hideLogin();
  setAuthUi();
  if (!location.hash) location.hash = '#/dashboard';
  route();
}

// ----------------------- Sidebar / theme / lang ------------------------
function applyTheme() {
  let th = state.theme;
  if (th === 'system') th = (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', th);
}
function applyLang() {
  document.documentElement.setAttribute('lang', state.lang);
  trAll();
  setupTopbar();
}
function setupShell() {
  applyTheme();
  applyLang();
  // Sidebar drawer
  const sidebar = $('#sidebar');
  const backdrop = $('#sidebar-backdrop');
  const isMobile = () => matchMedia('(max-width: 900px)').matches;
  const closeDrawer = () => { sidebar.classList.remove('open'); backdrop.hidden = true; document.body.classList.remove('no-scroll'); };
  const openDrawer = () => { sidebar.classList.add('open'); backdrop.hidden = false; document.body.classList.add('no-scroll'); };
  $('#sidebar-toggle').addEventListener('click', () => {
    if (sidebar.classList.contains('open')) closeDrawer(); else openDrawer();
  });
  backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
  window.addEventListener('resize', () => { if (!isMobile()) closeDrawer(); });
  // Auto-close on any nav click within the drawer
  sidebar.querySelectorAll('a.nav-item, a.bottom-nav').forEach(a => a.addEventListener('click', () => { if (isMobile()) closeDrawer(); }));
  // Bottom-nav: close any open modal/drawer on tap
  $$('.bottom-nav a').forEach(a => a.addEventListener('click', () => closeDrawer()));

  $('#lang-toggle').addEventListener('click', () => {
    state.lang = state.lang === 'mm' ? 'en' : 'mm';
    LS.set('lang', state.lang);
    api('settings', {}, 'POST', { language: state.lang }).catch(() => {});
    applyLang(); route();
  });
  $('#theme-toggle').addEventListener('click', () => {
    const order = ['light','dark','system'];
    const idx = order.indexOf(state.theme);
    state.theme = order[(idx + 1) % order.length];
    LS.set('theme', state.theme);
    api('settings', {}, 'POST', { theme: state.theme }).catch(() => {});
    applyTheme();
  });
  $('#quick-pay').addEventListener('click', async () => { if (await ensureAuth()) openPaymentModal(); });
  $('#auth-btn').addEventListener('click', () => { if (state.auth) doLogout(); else showLogin(); });
  // Global search
  const g = $('#global-search');
  const r = $('#search-results');
  let to;
  g.addEventListener('input', () => {
    clearTimeout(to);
    to = setTimeout(async () => {
      const q = g.value.trim();
      if (!q) { r.hidden = true; r.innerHTML = ''; return; }
      try {
        const data = await api('search', { q });
        r.innerHTML = '';
        if (data.members.length) {
          r.appendChild(el('div', { class: 'sr-section' }, t('nav.members')));
          for (const m of data.members) {
            r.appendChild(el('div', { class: 'sr-item' },
              el('span', {}, m.name),
              el('span', { class: 'muted' }, amountHTML(m.monthly_amount))
            )).addEventListener('click', () => { location.hash = '#/members/' + m.id; r.hidden = true; g.value = ''; });
          }
        }
        if (data.payments.length) {
          r.appendChild(el('div', { class: 'sr-section' }, 'Payments'));
          for (const p of data.payments) {
            r.appendChild(el('div', { class: 'sr-item' },
              el('span', {}, `${p.member_name} • ${p.month}`),
              el('span', { class: 'muted' }, p.paid == 1 ? amountHTML(p.amount) : t('status.unpaid'))
            )).addEventListener('click', () => { location.hash = '#/members/' + p.member_id; r.hidden = true; g.value = ''; });
          }
        }
        r.hidden = !(data.members.length || data.payments.length);
      } catch (e) { r.hidden = true; }
    }, 180);
  });
  document.addEventListener('click', e => { if (!e.target.closest('.search-wrap')) { r.hidden = true; } });

  // Hash routing
  window.addEventListener('hashchange', route);
  setupTopbar();
  bindLoginForm();
}

// ----------------------- Routing --------------------------------------
function parseRoute() {
  const h = (location.hash || '#/dashboard').slice(1);
  const parts = h.split('/').filter(Boolean);
  return { name: parts[0] || 'dashboard', param: parts[1] || null };
}
function setActiveNav(name) {
  $$('.nav-item, .bottom-nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-route') === name);
  });
}
function setTitle(text) { $('#page-title').textContent = text; }

async function route() {
  const { name, param } = parseRoute();
  state.route = name; state.routeParam = param;
  setActiveNav(name);
  // Always close the mobile drawer when navigating
  const sb = $('#sidebar'); const bd = $('#sidebar-backdrop');
  if (sb) sb.classList.remove('open');
  if (bd) bd.hidden = true;
  document.body.classList.remove('no-scroll');
  const c = $('#content');
  c.classList.remove('fade-in');
  c.innerHTML = '<div class="empty">' + t('common.loading') + '</div>';
  try {
    if (name === 'dashboard')      await renderDashboard();
    else if (name === 'monthly')   await renderMonthly();
    else if (name === 'members')   await renderMembers();
    else if (name === 'member')    await renderMember(param);
    else if (name === 'expenses')  await renderExpenses();
    else if (name === 'reports')   await renderReports();
    else if (name === 'calendar')  await renderCalendar();
    else if (name === 'backup')    await renderBackup();
    else if (name === 'settings')  await renderSettings();
    else { c.innerHTML = '<div class="empty">404</div>'; setTitle('404'); }
    c.classList.add('fade-in');
    trAll(c);
    setAuthUi();
  } catch (e) {
    console.error(e);
    const msg = (e && e.message) || 'Unknown error';
    c.innerHTML = `<div class="empty">
      <div>${escapeHTML(msg)}</div>
      <button class="ghost-btn" style="margin-top:10px" id="route-retry">Retry</button>
    </div>`;
    const retry = $('#route-retry');
    if (retry) retry.addEventListener('click', () => route());
  }
}

// ----------------------- Dashboard ------------------------------------
function avgPerMonth(d) {
  // Average monthly spending across the months that have any spend record.
  // Falls back to 0 when we have no spend history.
  if (!d || !d.trend || !d.recent_expenses || !d.recent_expenses.length) return 0;
  const months = new Set();
  for (const e of d.recent_expenses) {
    if (e.spent_at) months.add(e.spent_at.slice(0, 7));
  }
  if (!months.size) return 0;
  return Math.round((d.all_time_spent || 0) / months.size);
}

async function renderDashboard() {
  setTitle(t('dashboard.title'));
  const c = $('#content');
  const d = await api('dashboard', { month: state.month, year: state.year });
  const cm = d.current, tot = d.all_time, yr = d.year_total, ms = d.members;
  const spent = d.all_time_spent || 0;
  const avail = d.available || 0;
  const spentMonth = cm.spent || 0;
  const spentYear = d.year_spent || 0;
  // Spend ratio (spent vs all-time collected) — helps at a glance
  const spendRatio = tot > 0 ? Math.min(100, Math.round(spent * 10000 / tot) / 100) : 0;

  c.innerHTML = `
    <section class="kpis">
      <div class="kpi">
        <div class="kpi-ico">◉</div>
        <div class="kpi-label">${t('dashboard.kpi.members')}</div>
        <div class="kpi-value" data-count="${ms.total}">0</div>
        <div class="kpi-sub">${t('dashboard.kpi.active')}: <strong>${ms.active}</strong></div>
      </div>
      <div class="kpi kpi-grad-1">
        <div class="kpi-ico">▤</div>
        <div class="kpi-label">${t('dashboard.kpi.this_month')} • ${monthName(d.month, state.lang)}</div>
        <div class="kpi-value">${formatAmount(cm.collected).en}</div>
        <div class="kpi-sub amount-text">${formatAmount(cm.collected).mm}</div>
      </div>
      <div class="kpi kpi-grad-2">
        <div class="kpi-ico">▦</div>
        <div class="kpi-label">${t('dashboard.this_year')} ${d.year}</div>
        <div class="kpi-value">${formatAmount(yr).en}</div>
        <div class="kpi-sub amount-text">${formatAmount(yr).mm}</div>
      </div>
      <div class="kpi kpi-grad-3">
        <div class="kpi-ico">◈</div>
        <div class="kpi-label">${t('spend.balance')} / ${t('dashboard.kpi.all_time')}</div>
        <div class="kpi-value">${formatAmount(avail).en}</div>
        <div class="kpi-sub amount-text">${formatAmount(avail).mm}</div>
      </div>
    </section>

    <section class="kpis spend-cards" style="margin-top:14px">
      <div class="kpi kpi-grad-spend">
        <div class="kpi-head">
          <div class="kpi-ico">↘</div>
          <div class="kpi-label">${t('spend.kpi.total')}</div>
        </div>
        <div class="kpi-value">${formatAmount(spent).en}</div>
        <div class="kpi-sub amount-text">${formatAmount(spent).mm}</div>
        <div class="kpi-progress" title="${spendRatio}% ${t('spend.kpi.of_collected')}">
          <div class="kpi-progress-fill" style="width:${spendRatio}%"></div>
          <span class="kpi-progress-label">${spendRatio}% ${t('spend.kpi.of_collected')}</span>
        </div>
      </div>
      <div class="kpi kpi-grad-spend">
        <div class="kpi-head">
          <div class="kpi-ico">▦</div>
          <div class="kpi-label">${t('spend.kpi.this_month')} • ${shortMonthName(d.month, state.lang)}</div>
        </div>
        <div class="kpi-value">${formatAmount(spentMonth).en}</div>
        <div class="kpi-sub amount-text">${formatAmount(spentMonth).mm}</div>
        <div class="kpi-progress">
          <div class="kpi-progress-fill kpi-progress-fill-warn" style="width:${cm.collected > 0 ? Math.min(100, Math.round(spentMonth * 10000 / cm.collected) / 100) : 0}%"></div>
          <span class="kpi-progress-label">${cm.collected > 0 ? Math.min(100, Math.round(spentMonth * 10000 / cm.collected) / 100) : 0}% ${t('spend.kpi.of_collected')}</span>
        </div>
      </div>
      <div class="kpi kpi-grad-spend">
        <div class="kpi-head">
          <div class="kpi-ico">▤</div>
          <div class="kpi-label">${t('spend.kpi.this_year')} ${d.year}</div>
        </div>
        <div class="kpi-value">${formatAmount(spentYear).en}</div>
        <div class="kpi-sub amount-text">${formatAmount(spentYear).mm}</div>
        <div class="kpi-progress">
          <div class="kpi-progress-fill kpi-progress-fill-accent" style="width:${yr > 0 ? Math.min(100, Math.round(spentYear * 10000 / yr) / 100) : 0}%"></div>
          <span class="kpi-progress-label">${yr > 0 ? Math.min(100, Math.round(spentYear * 10000 / yr) / 100) : 0}% ${t('spend.kpi.of_collected')}</span>
        </div>
      </div>
      <div class="kpi kpi-grad-spend">
        <div class="kpi-head">
          <div class="kpi-ico">✦</div>
          <div class="kpi-label">${t('spend.kpi.avg_per_month')}</div>
        </div>
        <div class="kpi-value">${formatAmount(avgPerMonth(d)).en}</div>
        <div class="kpi-sub amount-text">${formatAmount(avgPerMonth(d)).mm}</div>
        <div class="kpi-progress">
          <div class="kpi-progress-fill kpi-progress-fill-good" style="width:${d.available && tot > 0 ? Math.min(100, Math.round(d.available * 10000 / tot) / 100) : 0}%"></div>
          <span class="kpi-progress-label">${t('spend.kpi.remaining')}: ${formatAmount(avail).en}</span>
        </div>
      </div>
    </section>

    <section class="row-grid" style="margin-top:16px">
      <div class="chart-card">
        <div class="chart-head">
          <h3>${t('dashboard.trend')}</h3>
          <div class="chart-tabs" id="trend-tabs">
            <button data-range="1">1M</button>
            <button data-range="3">3M</button>
            <button data-range="6">6M</button>
            <button data-range="12">12M</button>
            <button data-range="all" class="active">${t('common.all')}</button>
          </div>
        </div>
        <svg class="chart" id="trend-chart" viewBox="0 0 600 280" preserveAspectRatio="none"></svg>
      </div>
      <div class="chart-card">
        <div class="chart-head"><h3>${t('spend.list')}</h3>
          <button class="primary-btn admin-only" id="spend-btn" type="button">${t('spend.add')}</button>
        </div>
        <div class="list" id="spend-list">
          ${(d.recent_expenses && d.recent_expenses.length) ? '' : `<div class="empty" style="margin:0">${t('spend.empty')}</div>`}
        </div>
        ${(d.recent_expenses && d.recent_expenses.length) ? `<div class="muted" style="margin-top:8px;text-align:right">${t('spend.total')}: ${amountHTML(spent)}</div>` : ''}
      </div>
    </section>

    <section class="row-grid" style="margin-top:16px">
      <div class="chart-card">
        <div class="chart-head"><h3>${t('dashboard.expected_compared')}</h3></div>
        <svg class="chart" id="bar" viewBox="0 0 600 220" preserveAspectRatio="none"></svg>
      </div>
      <div class="chart-card">
        <div class="chart-head">
          <h3>${t('dashboard.top')}</h3>
          <span class="muted" style="font-size:12px">${t('dashboard.top_sub')}</span>
        </div>
        <div class="list" id="top-list"></div>
      </div>
    </section>

    <section class="row-grid" style="margin-top:16px">
      <div class="chart-card">
        <div class="chart-head"><h3>${t('dashboard.monthly_totals')}</h3></div>
        <div class="table-wrap"><table class="t" id="monthly-totals-table"></table></div>
      </div>
      <div class="chart-card">
        <div class="chart-head"><h3>${t('dashboard.member_status')}</h3></div>
        <div class="table-wrap"><table class="t" id="member-status-table"></table></div>
      </div>
    </section>
  `;

  // KPIs count-up
  $$('[data-count]').forEach(n => countUp(n, parseInt(n.getAttribute('data-count'), 10)));

  // Trend chart
  let range = 'all';
  const drawTrend = () => {
    const data = (range === 'all') ? d.trend : d.trend.slice(-parseInt(range, 10));
    drawLineChart($('#trend-chart'), data.map(x => ({ x: x.month, y: x.collected, label: monthName(x.month, state.lang), extra: { paid: x.paid_cnt, total: x.total_cnt } })), { yLabel: 'MMK' });
  };
  drawTrend();
  $$('#trend-tabs button').forEach(b => b.addEventListener('click', () => {
    $$('#trend-tabs button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    range = b.getAttribute('data-range');
    drawTrend();
  }));

  // Donut (the previous donut was in the trend row; we replaced with spend list)
  // (The donut is no longer in this layout — keeps trend chart wider)

  // Spend list (recent)
  const sl = $('#spend-list');
  if (d.recent_expenses && d.recent_expenses.length) {
    for (const e of d.recent_expenses) {
      const a = formatAmount(e.amount);
      const dt = (e.spent_at || '').slice(0, 10);
      sl.appendChild(el('div', { class: 'list-item' },
        el('div', { class: 'rank', html: '↘' }),
        el('div', {},
          el('div', { class: 'name' }, e.reason || '—'),
          el('div', { class: 'meta' }, dt)
        ),
        el('div', { class: 'amt' },
          el('div', { class: 'amt-exact' }, state.lang === 'mm' ? a.mm : a.en),
          el('div', { class: 'amt-units amount-text' }, a.mm),
        )
      ));
    }
  }
  // Spend button
  const sb = $('#spend-btn');
  if (sb) sb.addEventListener('click', async () => { if (await ensureAuth()) openSpendModal(avail); });

  // Expected vs Collected bar
  drawGroupedBar($('#bar'), [
    { label: t('dashboard.expected'), value: cm.expected, color: 'var(--primary-2)' },
    { label: t('dashboard.collected'), value: Math.min(cm.collected, cm.expected), color: 'var(--good)' },
    { label: t('dashboard.remaining'), value: cm.remaining, color: 'var(--bad)' },
  ], { yLabel: 'MMK' });

  // Top contributors (top 3 only — keep the dashboard compact)
  const top = $('#top-list'); top.innerHTML = '';
  d.top.slice(0, 3).forEach((m, i) => {
    const a = formatAmount(m.total);
    top.appendChild(el('div', { class: 'list-item' },
      el('div', { class: 'rank' }, String(i+1)),
      el('div', {},
        el('div', { class: 'name' }, m.name),
        el('div', { class: 'meta' }, m.paid_months + ' ' + (state.lang === 'mm' ? 'လ' : 'months'))
      ),
      el('div', { class: 'amt' },
        el('div', { class: 'amt-exact' }, state.lang === 'mm' ? a.mm : a.en),
        el('div', { class: 'amt-units amount-text' }, a.mm)
      )
    ));
  });

  // Monthly totals table
  const mt = $('#monthly-totals-table');
  mt.innerHTML = `<thead><tr>
    <th>${t('reports.col.month')}</th>
    <th class="num">${t('reports.col.collected')}</th>
    <th class="num">${t('reports.col.expected')}</th>
    <th class="num">${t('reports.col.remaining')}</th>
    <th class="center">${t('reports.col.rate')}</th>
  </tr></thead><tbody></tbody>`;
  const tbody = mt.querySelector('tbody');
  for (const r of d.trend.slice().reverse()) {
    const exp = ms.expected; const rem = Math.max(0, exp - r.collected);
    const rate = exp ? Math.round(Math.min(r.collected, exp) * 10000 / exp) / 100 : 0;
    tbody.appendChild(el('tr', {},
      el('td', {}, monthName(r.month, state.lang)),
      el('td', { class: 'num', html: amountHTML(r.collected) }),
      el('td', { class: 'num', html: amountHTML(exp) }),
      el('td', { class: 'num', html: amountHTML(rem) }),
      el('td', { class: 'center' }, rate + '%'),
    ));
  }

  // Member status table (current month)
  const mst = $('#member-status-table');
  mst.innerHTML = `<thead><tr>
    <th>${t('monthly.table.member')}</th>
    <th class="num">${t('monthly.table.target')}</th>
    <th class="num">${t('monthly.table.amount')}</th>
    <th class="center">${t('monthly.table.status')}</th>
    <th class="center">${t('monthly.table.action')}</th>
  </tr></thead><tbody></tbody>`;
  const mstb = mst.querySelector('tbody');
  for (const m of d.member_status) {
    const tr = el('tr', {},
      el('td', {}, m.name),
      el('td', { class: 'num', html: amountHTML(m.expected) }),
      el('td', { class: 'num', html: amountHTML(m.amount) }),
      el('td', { class: 'center', html: m.paid ? `<span class="badge paid">${t('status.paid')}</span>` : `<span class="badge unpaid">${t('status.unpaid')}</span>` }),
      el('td', { class: 'center' },
        m.paid
          ? el('button', { class: 'ghost-btn admin-only', on: { click: async () => { if (await ensureAuth()) openPaymentModal({ member_id: m.id, month: d.month, unpaid: true }); } } }, t('action.mark_unpaid'))
          : el('button', { class: 'primary-btn admin-only', on: { click: async () => { if (await ensureAuth()) openPaymentModal({ member_id: m.id, month: d.month }); } } }, t('action.mark_paid'))
      )
    );
    mstb.appendChild(tr);
  }
}

// ----------------------- Monthly page ---------------------------------
async function renderMonthly() {
  setTitle(t('monthly.title'));
  const c = $('#content');
  const data = await api('dashboard', { month: state.month, year: state.year });
  const ms = data.member_status;
  const cm = data.current;
  c.innerHTML = `
    <div class="spread" style="margin-bottom:14px">
      <div class="row">
        <button class="ghost-btn" id="m-prev">${t('monthly.prev')}</button>
        <strong style="font-size:18px">${monthName(state.month, state.lang)}</strong>
        <button class="ghost-btn" id="m-next">${t('monthly.next')}</button>
      </div>
      <div class="row">
        <button class="ghost-btn" id="bulk-pay-btn">${t('action.bulk_pay')}</button>
      </div>
    </div>
    <div class="row-grid-3" style="margin-bottom:14px">
      <div class="section"><div class="muted">${t('dashboard.expected')}</div><div style="font-size:22px;font-weight:800">${formatAmount(cm.expected).en}</div><div class="amount-text muted">${formatAmount(cm.expected).mm}</div></div>
      <div class="section"><div class="muted">${t('dashboard.collected')}</div><div style="font-size:22px;font-weight:800">${formatAmount(cm.collected).en}</div><div class="amount-text muted">${formatAmount(cm.collected).mm}</div></div>
      <div class="section"><div class="muted">${t('dashboard.remaining')} / ${t('dashboard.surplus')}</div><div style="font-size:22px;font-weight:800">${formatAmount(cm.remaining).en} ${cm.surplus ? '+'+formatAmount(cm.surplus).en : ''}</div><div class="amount-text muted">${formatAmount(cm.remaining).mm} ${cm.surplus ? '+'+formatAmount(cm.surplus).mm : ''}</div></div>
    </div>
    <div class="table-wrap">
      <table class="t" id="month-table">
        <thead><tr>
          <th><label class="checkbox"><input type="checkbox" id="m-select-all"> <span class="muted">${t('monthly.select_all')}</span></label></th>
          <th>${t('monthly.table.member')}</th>
          <th class="num">${t('monthly.table.target')}</th>
          <th class="num">${t('monthly.table.amount')}</th>
          <th class="center">${t('monthly.table.status')}</th>
          <th>${t('monthly.table.paid_at')}</th>
          <th class="center">${t('monthly.table.action')}</th>
        </tr></thead>
        <tbody></tbody>
      </table>
    </div>
  `;
  $('#m-prev').addEventListener('click', () => { state.month = addMonth(state.month, -1); LS.set('month', state.month); $('#month-picker').value = state.month; route(); });
  $('#m-next').addEventListener('click', () => { state.month = addMonth(state.month, 1); LS.set('month', state.month); $('#month-picker').value = state.month; route(); });
  $('#bulk-pay-btn').addEventListener('click', async () => { if (await ensureAuth()) openBulkModal(); });
  const tbody = $('#month-table tbody');
  for (const m of ms) {
    const tr = el('tr', {},
      el('td', {}, el('input', { type: 'checkbox', 'data-mid': String(m.id) })),
      el('td', {}, m.name),
      el('td', { class: 'num', html: amountHTML(m.expected) }),
      el('td', { class: 'num', html: amountHTML(m.amount) }),
      el('td', { class: 'center', html: m.paid ? `<span class="badge paid">${t('status.paid')}</span>` : `<span class="badge unpaid">${t('status.unpaid')}</span>` }),
      el('td', { class: 'muted' }, m.paid ? (data.member_status.find(x=>x.id===m.id) ? '' : '') : ''),
      el('td', { class: 'center' },
        m.paid
          ? el('div', { class: 'row' },
              el('button', { class: 'ghost-btn admin-only', on: { click: async () => { if (await ensureAuth()) openPaymentModal({ member_id: m.id, month: state.month }); } } }, t('action.edit')),
              el('button', { class: 'danger-btn admin-only', on: { click: () => deletePaymentFor(m.id, state.month) } }, t('action.delete'))
            )
          : el('button', { class: 'primary-btn admin-only', on: { click: async () => { if (await ensureAuth()) openPaymentModal({ member_id: m.id, month: state.month }); } } }, t('action.mark_paid'))
      )
    );
    tbody.appendChild(tr);
  }
  $('#m-select-all').addEventListener('change', e => {
    $$('#month-table tbody input[type=checkbox]').forEach(c => c.checked = e.target.checked);
  });
}

async function deletePaymentFor(memberId, month) {
  const list = await api('payments', { member_id: memberId, month });
  if (!list.items.length) return;
  const id = list.items[0].id;
  confirmModal(t('action.delete') + '?', async () => {
    await api('delete_payment', {}, 'POST', { id });
    toast(t('payment.deleted'), 'good');
    route();
  });
}

// ----------------------- Members list ---------------------------------
async function renderMembers() {
  setTitle(t('members.title'));
  const c = $('#content');
  const params = new URLSearchParams(location.hash.split('?')[1] || '');
  const q = params.get('q') || '';
  const af = params.get('active') || '';
  c.innerHTML = `
    <div class="spread" style="margin-bottom:14px">
      <div class="row" style="gap:8px">
        <input id="m-search" class="select" placeholder="${t('members.search_ph')}" value="${escapeHTML(q)}" style="min-width:240px;background:var(--bg-soft);border:1px solid var(--line);padding:8px 10px;border-radius:10px">
        <select id="m-filter" class="select">
          <option value="">${t('members.filter.all')}</option>
          <option value="1" ${af==='1'?'selected':''}>${t('members.filter.active')}</option>
          <option value="0" ${af==='0'?'selected':''}>${t('members.filter.inactive')}</option>
        </select>
      </div>
      <button class="primary-btn" id="add-member">${t('members.add')}</button>
    </div>
    <div id="members-grid" class="member-grid"></div>
  `;
  $('#add-member').addEventListener('click', async () => { if (await ensureAuth()) openMemberModal(); });
  $('#m-search').addEventListener('input', debounce(() => load(), 200));
  $('#m-filter').addEventListener('change', () => load());

  async function load() {
    const grid = $('#members-grid');
    grid.innerHTML = '<div class="empty">' + t('common.loading') + '</div>';
    const data = await api('members', { q: $('#m-search').value, active: $('#m-filter').value });
    if (!data.items.length) { grid.innerHTML = '<div class="empty">' + t('members.empty') + '</div>'; return; }
    grid.innerHTML = '';
    const dash = await api('dashboard', { month: state.month, year: state.year });
    const statusMap = new Map(dash.member_status.map(x => [x.id, x]));
    for (const m of data.items) {
      const sm = statusMap.get(m.id) || { paid: false, expected: m.monthly_amount, amount: 0 };
      const rate = m.paid_months > 0 ? Math.min(100, Math.round(m.paid_months * 100 / Math.max(1, m.paid_months + 1))) : 0; // approx
      const a = formatAmount(m.total_saved);
      const card = el('div', { class: 'member-card' },
        el('div', { class: 'avatar' }, (m.name || '?').trim().charAt(0).toUpperCase()),
        el('div', { style: { flex: '1', minWidth: '0' } },
          el('div', { class: 'spread' },
            el('div', {},
              el('div', { style: { fontWeight: '700' } }, m.name),
              el('div', { class: 'muted', style: { fontSize: '12px' } },
                m.active ? `<span class="tag">Active</span>` : `<span class="tag" style="background:#fee2e2;color:#991b1b">Inactive</span>`,
                ' • ID ', String(m.id)
              )
            ),
            el('div', {},
              el('div', { class: 'amt-exact' }, state.lang === 'mm' ? a.mm : a.en),
              el('div', { class: 'amt-units amount-text' }, a.mm),
            ),
          ),
          el('div', { class: 'member-meta', style: { marginTop: '8px' } },
            el('div', {}, t('members.total_saved') + ': ', el('strong', {}, formatMoney(m.total_saved))),
            el('div', {}, t('members.paid_months') + ': ', el('strong', {}, String(m.paid_months))),
            el('div', {}, t('field.monthly_amount') + ': ', el('strong', { html: amountHTML(m.monthly_amount) })),
            el('div', {}, t('members.current_status') + ': ', el('strong', { html: sm.paid ? `<span class="badge paid">${t('status.paid')}</span>` : `<span class="badge unpaid">${t('status.unpaid')}</span>` })),
          ),
          el('div', { class: 'member-actions' },
            el('button', { class: 'ghost-btn', on: { click: () => location.hash = '#/member/' + m.id } }, t('action.edit')),
            el('button', { class: 'ghost-btn admin-only', on: { click: async () => { if (await ensureAuth()) openMemberModal(m); } } }, t('member.title')),
            el('button', { class: 'ghost-btn admin-only', on: { click: () => toggleMember(m.id) } }, m.active ? t('action.deactivate') : t('action.activate')),
            el('button', { class: 'danger-btn admin-only', on: { click: () => deleteMember(m.id, m.name) } }, t('action.delete')),
          )
        )
      );
      grid.appendChild(card);
    }
  }
  load();
}

async function toggleMember(id) {
  if (!await ensureAuth()) return;
  await api('members', { action: 'toggle' }, 'POST', { id });
  route();
}
async function deleteMember(id, name) {
  if (!await ensureAuth()) return;
  confirmModal(t('action.delete') + ' ' + name + '?', async () => {
    await api('members', { action: 'delete' }, 'POST', { id });
    toast(t('member.deleted'), 'good');
    route();
  });
}

// ----------------------- Member profile -------------------------------
async function renderMember(id) {
  setTitle(t('member.profile'));
  const c = $('#content');
  const data = await api('member', { id });
  const m = data.member, tot = data.totals;
  c.innerHTML = `
    <div class="row-grid-31">
      <div class="section">
        <div class="row" style="gap:12px">
          <div class="avatar" style="width:64px;height:64px;font-size:24px">${escapeHTML((m.name||'?').charAt(0).toUpperCase())}</div>
          <div>
            <div style="font-size:20px;font-weight:800">${escapeHTML(m.name)}</div>
            <div class="muted">ID #${m.id} • ${m.active ? t('field.active') : t('action.deactivate')}</div>
          </div>
        </div>
        <div class="row-grid-3" style="margin-top:14px">
          <div class="section"><div class="muted">${t('member.expected')}</div><div style="font-weight:800;font-size:18px">${formatAmount(m.monthly_amount).en}</div><div class="amount-text muted">${formatAmount(m.monthly_amount).mm}</div></div>
          <div class="section"><div class="muted">${t('member.total_saved')}</div><div style="font-weight:800;font-size:18px">${formatAmount(tot.total_saved).en}</div><div class="amount-text muted">${formatAmount(tot.total_saved).mm}</div></div>
          <div class="section"><div class="muted">${t('member.avg')}</div><div style="font-weight:800;font-size:18px">${formatAmount(tot.avg).en}</div><div class="amount-text muted">${formatAmount(tot.avg).mm}</div></div>
        </div>
        <div class="progress" style="margin-top:12px"><span style="width:${Math.min(100, tot.rate)}%"></span></div>
        <div class="muted" style="margin-top:6px">${t('member.paid_months')}: <strong>${tot.paid_months}</strong> / ${tot.expected_months} • ${t('member.rate')}: <strong>${tot.rate}%</strong></div>
        <div class="member-actions">
          <button class="ghost-btn" id="m-edit">${t('action.edit')}</button>
          <button class="ghost-btn" id="m-toggle">${m.active ? t('action.deactivate') : t('action.activate')}</button>
          <button class="danger-btn" id="m-del">${t('action.delete')}</button>
        </div>
      </div>
      <div class="section">
        <h3>${t('member.profile')}</h3>
        <div class="muted">${t('field.note')}: ${m.note ? escapeHTML(m.note) : '—'}</div>
        <svg class="chart" id="m-chart" viewBox="0 0 400 200" preserveAspectRatio="none" style="margin-top:8px"></svg>
      </div>
    </div>
    <div class="section" style="margin-top:16px">
      <h3>${t('member.history')}</h3>
      <div class="table-wrap"><table class="t" id="m-history">
        <thead><tr>
          <th>${t('reports.col.month')}</th>
          <th class="center">${t('monthly.table.status')}</th>
          <th class="num">${t('monthly.table.amount')}</th>
          <th>${t('monthly.table.paid_at')}</th>
          <th>${t('field.note')}</th>
          <th class="center">${t('monthly.table.action')}</th>
        </tr></thead>
        <tbody></tbody>
      </table></div>
    </div>
  `;
  $('#m-edit').addEventListener('click', async () => { if (await ensureAuth()) openMemberModal(m); });
  $('#m-toggle').addEventListener('click', async () => { if (await ensureAuth()) { await api('members', { action: 'toggle' }, 'POST', { id }); route(); } });
  $('#m-del').addEventListener('click', () => deleteMember(m.id, m.name));

  drawLineChart($('#m-chart'), data.months.map(x => ({ x: x.month, y: x.paid ? x.amount : 0, label: monthName(x.month, state.lang), extra: { paid: x.paid, expected: x.expected } })), { yLabel: 'MMK' });

  const tb = $('#m-history tbody');
  for (const row of data.months) {
    const tr = el('tr', {},
      el('td', {}, monthName(row.month, state.lang)),
      el('td', { class: 'center', html: row.paid ? `<span class="badge paid">${t('status.paid')}</span>` : `<span class="badge unpaid">${t('status.unpaid')}</span>` }),
      el('td', { class: 'num', html: amountHTML(row.paid ? row.amount : row.expected) }),
      el('td', { class: 'muted' }, row.paid ? (row.paid_at || '') : ''),
      el('td', { class: 'muted' }, row.note ? escapeHTML(row.note) : ''),
      el('td', { class: 'center' },
        row.paid
          ? el('div', { class: 'row' },
              el('button', { class: 'ghost-btn admin-only', on: { click: async () => { if (await ensureAuth()) openPaymentModal({ id: row.id, member_id: m.id, month: row.month, amount: row.amount, paid_at: row.paid_at, note: row.note }); } } }, t('action.edit')),
              el('button', { class: 'danger-btn admin-only', on: { click: () => deletePayment(row.id) } }, t('action.delete'))
            )
          : el('button', { class: 'primary-btn admin-only', on: { click: async () => { if (await ensureAuth()) openPaymentModal({ member_id: m.id, month: row.month }); } } }, t('action.mark_paid'))
      )
    );
    tb.appendChild(tr);
  }
}
async function deletePayment(id) {
  if (!await ensureAuth()) return;
  confirmModal(t('action.delete') + '?', async () => {
    await api('delete_payment', {}, 'POST', { id });
    toast(t('payment.deleted'), 'good');
    route();
  });
}

// ----------------------- Expenses (spend history) -----------------------
async function renderExpenses() {
  setTitle(t('expenses.title'));
  const c = $('#content');
  const data = await api('expenses');
  const items = data.items || [];
  const total = items.reduce((a, e) => a + (e.amount || 0), 0);
  // Group by month
  const byMonth = {};
  for (const e of items) {
    const m = (e.spent_at || '').slice(0, 7);
    (byMonth[m] = byMonth[m] || []).push(e);
  }
  const months = Object.keys(byMonth).sort().reverse();

  const monthCounts = months.map(m => byMonth[m].length);
  const monthTotals = months.map(m => byMonth[m].reduce((a, e) => a + (e.amount || 0), 0));

  c.innerHTML = `
    <div class="row-grid">
      <div class="section">
        <h3>${t('expenses.summary')}</h3>
        <div class="grid" style="gap:10px">
          <div><div class="muted">${t('spend.total')}</div>
            <div style="font-size:24px;font-weight:800">${formatAmount(total).en}</div>
            <div class="amount-text muted">${formatAmount(total).mm}</div></div>
          <div class="row">
            <button class="primary-btn admin-only" id="add-spend">${t('spend.add')}</button>
          </div>
          ${months.length > 1 ? `<div class="exp-months" id="exp-months"></div>` : ''}
        </div>
      </div>
      <div class="section">
        <h3>${t('spend.list')}</h3>
        ${items.length ? `<div class="table-wrap"><table class="t" id="exp-table">
          <thead><tr>
            <th>${t('spend.date')}</th>
            <th>${t('spend.reason')}</th>
            <th>${t('field.note')}</th>
            <th class="num">${t('spend.amount')}</th>
            <th class="center">${t('monthly.table.action')}</th>
          </tr></thead><tbody></tbody>
        </table></div>` : `<div class="empty">${t('spend.empty')}</div>`}
      </div>
    </div>
  `;
  $('#add-spend').addEventListener('click', async () => {
    const dash = await api('dashboard', { month: state.month, year: state.year });
    openSpendModal(dash.available || 0);
  });
  if (items.length) {
    const tb = $('#exp-table tbody');
    for (const e of items) {
      const a = formatAmount(e.amount);
      tb.appendChild(el('tr', {},
        el('td', {}, (e.spent_at || '').slice(0, 10)),
        el('td', {}, e.reason || '—'),
        el('td', { class: 'muted' }, e.note || ''),
        el('td', { class: 'num' },
          el('div', { class: 'amt-exact' }, state.lang === 'mm' ? a.mm : a.en),
          el('div', { class: 'amt-units amount-text' }, a.mm),
        ),
        el('td', { class: 'center' },
          el('button', { class: 'danger-btn admin-only', on: { click: () => deleteExpense(e.id) } }, t('action.delete'))
        )
      ));
    }
  }
  if (months.length > 1) {
    const ml = $('#exp-months');
    if (ml) {
      months.forEach((m, i) => {
        const a = formatAmount(monthTotals[i]);
        ml.appendChild(el('div', { class: 'list-item' },
          el('div', { class: 'rank' }, '▤'),
          el('div', {},
            el('div', { class: 'name' }, monthName(m, state.lang)),
            el('div', { class: 'meta' }, monthCounts[i] + ' ' + (state.lang === 'mm' ? 'ခု' : 'items'))
          ),
          el('div', { class: 'amt' },
            el('div', { class: 'amt-exact' }, state.lang === 'mm' ? a.mm : a.en),
            el('div', { class: 'amt-units amount-text' }, a.mm)
          )
        ));
      });
    }
  }
}

async function deleteExpense(id) {
  if (!await ensureAuth()) return;
  confirmModal(t('action.delete') + '?', async () => {
    await api('expenses', { action: 'delete' }, 'POST', { id });
    toast(t('spend.deleted'), 'good');
    route();
  });
}

// ----------------------- Reports ---------------------------------------
async function renderReports() {
  setTitle(t('reports.title'));
  const c = $('#content');
  let tab = 'all_month';
  c.innerHTML = `
    <div class="chart-head" style="margin-bottom:12px">
      <h3>${t('reports.title')}</h3>
      <div class="chart-tabs" id="rep-tabs">
        <button data-tab="all_month" class="active">${t('reports.tab.all_month')}</button>
        <button data-tab="yearly">${t('reports.tab.yearly')}</button>
        <button data-tab="member">${t('reports.tab.member')}</button>
      </div>
    </div>
    <div id="rep-kpis" class="kpis"></div>
    <div class="row-grid" style="margin-top:16px">
      <div class="chart-card">
        <div class="chart-head"><h3>${t('reports.chart.title')}</h3></div>
        <svg class="chart" id="rep-chart" viewBox="0 0 600 240" preserveAspectRatio="none"></svg>
      </div>
      <div class="chart-card">
        <div class="chart-head"><h3>${t('reports.list.title')}</h3></div>
        <div class="list" id="rep-list"></div>
      </div>
    </div>
  `;
  $$('#rep-tabs button').forEach(b => b.addEventListener('click', () => {
    $$('#rep-tabs button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    tab = b.getAttribute('data-tab');
    draw();
  }));

  function makeSparkline(values, color) {
    const W = 120, H = 36;
    const max = Math.max(1, ...values);
    const min = Math.min(0, ...values);
    const range = Math.max(1, max - min);
    const step = values.length > 1 ? W / (values.length - 1) : W;
    let d = '';
    values.forEach((v, i) => {
      const x = i * step;
      const y = H - 4 - ((v - min) / range) * (H - 8);
      d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
    });
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', W); svg.setAttribute('height', H);
    svg.classList.add('spark');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d.trim());
    path.setAttribute('fill', 'none'); path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '2'); path.setAttribute('stroke-linejoin', 'round'); path.setAttribute('stroke-linecap', 'round');
    svg.appendChild(path);
    return svg;
  }

  function renderKpis(rows) {
    const kpis = $('#rep-kpis'); kpis.innerHTML = '';
    if (!rows.length) { kpis.style.display = 'none'; return; }
    kpis.style.display = '';
    let totalCollected = 0, totalExpected = 0, totalSurplus = 0;
    rows.forEach(r => { totalCollected += r.collected || 0; totalExpected += r.expected || 0; totalSurplus += r.surplus || 0; });
    const overallRate = totalExpected > 0 ? Math.round(Math.min(totalCollected, totalExpected) * 10000 / totalExpected) / 100 : 0;
    const cards = [
      { label: t('reports.kpi.collected'), value: totalCollected, color: 'var(--good)' },
      { label: t('reports.kpi.expected'), value: totalExpected, color: 'var(--primary-2)' },
      { label: t('reports.kpi.surplus'), value: totalSurplus, color: 'var(--warn)' },
      { label: t('reports.kpi.rate'), value: overallRate, isPercent: true, color: 'var(--accent)' },
    ];
    cards.forEach(c => {
      const a = formatAmount(c.isPercent ? c.value : c.value);
      const v = c.isPercent ? c.value + '%' : a.en;
      const u = c.isPercent ? null : a.mm;
      kpis.appendChild(el('div', { class: 'kpi' },
        el('div', { class: 'kpi-ico' }, '◈'),
        el('div', { class: 'kpi-label' }, c.label),
        el('div', { class: 'kpi-value', style: 'color:' + c.color }, v),
        u ? el('div', { class: 'kpi-sub amount-text' }, u) : el('div', { class: 'kpi-sub muted' }, overallRate >= 80 ? t('reports.kpi.healthy') : t('reports.kpi.watch'))
      ));
    });
  }

  function draw() {
    const kpisEl = $('#rep-kpis');
    const chartEl = $('#rep-chart');
    const listEl = $('#rep-list');
    listEl.innerHTML = '<div class="empty">' + t('common.loading') + '</div>';
    (async () => {
      const data = await api('reports', { type: tab });
      renderKpis(data.rows || []);
      if (tab === 'all_month') {
        const rows = (data.rows || []).slice().reverse();
        drawGroupedBar(chartEl, rows.map(r => ({
          label: shortMonthName(r.month, state.lang),
          value: r.collected,
          color: r.collected >= r.expected ? 'var(--good)' : (r.collected > 0 ? 'var(--warn)' : 'var(--bad)')
        })));
        listEl.innerHTML = '';
        rows.slice().reverse().forEach(r => {
          const rate = r.expected > 0 ? Math.round(Math.min(r.collected, r.expected) * 10000 / r.expected) / 100 : 0;
          listEl.appendChild(el('div', { class: 'list-item' },
            el('div', { class: 'rank' }, shortMonthName(r.month, state.lang)),
            el('div', {},
              el('div', { class: 'name' }, monthName(r.month, state.lang)),
              el('div', { class: 'meta' },
                r.paid + ' ' + t('status.paid') + ' · ' +
                r.unpaid + ' ' + t('status.unpaid') + ' · ' +
                rate + '%')
            ),
            (() => { const sp = makeSparkline([r.expected, r.collected], 'var(--primary-2)'); sp.style.marginLeft = 'auto'; return sp; })(),
            el('div', { class: 'amt' },
              el('div', { class: 'amt-exact' }, state.lang === 'mm' ? formatAmount(r.collected).mm : formatAmount(r.collected).en),
              el('div', { class: 'amt-units amount-text muted' },
                r.surplus > 0 ? '+' + formatAmount(r.surplus).en : r.remaining > 0 ? '-' + formatAmount(r.remaining).en : formatAmount(0).en)
            )
          ));
        });
        if (!rows.length) listEl.innerHTML = `<div class="empty">${t('empty.nothing')}</div>`;
      } else if (tab === 'yearly') {
        const rows = data.rows || [];
        drawGroupedBar(chartEl, rows.map(r => ({ label: r.year, value: r.collected, color: 'var(--primary-2)' })));
        listEl.innerHTML = '';
        rows.forEach(r => {
          listEl.appendChild(el('div', { class: 'list-item' },
            el('div', { class: 'rank' }, r.year),
            el('div', {},
              el('div', { class: 'name' }, r.year),
              el('div', { class: 'meta' }, r.paid + ' ' + t('status.paid'))
            ),
            (() => { const sp = makeSparkline([r.collected], 'var(--primary-2)'); sp.style.marginLeft = 'auto'; return sp; })(),
            el('div', { class: 'amt' },
              el('div', { class: 'amt-exact' }, state.lang === 'mm' ? formatAmount(r.collected).mm : formatAmount(r.collected).en),
              el('div', { class: 'amt-units amount-text muted' }, formatAmount(r.collected).mm)
            )
          ));
        });
        if (!rows.length) listEl.innerHTML = `<div class="empty">${t('empty.nothing')}</div>`;
      } else {
        const rows = (data.rows || []).slice().sort((a, b) => b.total - a.total);
        const max = Math.max(1, ...rows.map(r => r.total));
        drawGroupedBar(chartEl, rows.slice(0, 8).map(r => ({ label: r.name, value: r.total, color: 'var(--accent)' })));
        listEl.innerHTML = '';
        rows.forEach((r, i) => {
          const pct = Math.round(r.total / max * 100);
          listEl.appendChild(el('div', { class: 'list-item' },
            el('div', { class: 'rank' }, String(i + 1)),
            el('div', {},
              el('div', { class: 'name' }, r.name),
              el('div', { class: 'meta' }, r.paid_months + ' ' + t('member.paid_months') + ' · ' +
                (r.avg ? formatAmount(r.avg).en + ' ' + t('reports.col.avg') : '-'))
            ),
            (() => {
              const wrap = el('div', { class: 'rep-bar', style: 'margin-left:auto' });
              const inner = el('div', { class: 'rep-bar-fill' });
              inner.style.width = pct + '%';
              wrap.appendChild(inner);
              return wrap;
            })(),
            el('div', { class: 'amt' },
              el('div', { class: 'amt-exact' }, state.lang === 'mm' ? formatAmount(r.total).mm : formatAmount(r.total).en),
              el('div', { class: 'amt-units amount-text muted' }, formatAmount(r.total).mm)
            )
          ));
        });
        if (!rows.length) listEl.innerHTML = `<div class="empty">${t('empty.nothing')}</div>`;
      }
    })();
  }
  draw();
}

// ----------------------- Calendar --------------------------------------
async function renderCalendar() {
  setTitle(t('calendar.title'));
  const c = $('#content');
  const data = await api('payments', { month: state.month });
  const byDay = {};
  for (const p of data.items) {
    if (!p.paid_at) continue;
    const d = p.paid_at.slice(0, 10);
    byDay[d] = (byDay[d] || 0) + 1;
  }
  const d = parseYyyymm(state.month);
  const last = new Date(d.getFullYear(), d.getMonth()+1, 0).getDate();
  c.innerHTML = `
    <div class="chart-card">
      <div class="chart-head">
        <div class="row">
          <button class="ghost-btn" id="c-prev">${t('monthly.prev')}</button>
          <strong>${monthName(state.month, state.lang)}</strong>
          <button class="ghost-btn" id="c-next">${t('monthly.next')}</button>
        </div>
        <div class="muted">${Object.values(byDay).reduce((a,b)=>a+b,0)} ${state.lang === 'mm' ? 'ကြိမ်' : 'payments'}</div>
      </div>
      <div class="cal" id="cal-grid">
        ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(n => `<div class="cal-cell head">${n}</div>`).join('')}
        ${Array(new Date(d.getFullYear(), d.getMonth(), 1).getDay()).fill('<div class="cal-cell"></div>').join('')}
        ${Array.from({length: last}, (_, i) => {
          const day = i+1;
          const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          const cnt = byDay[ds] || 0;
          return `<div class="cal-cell"><div class="day">${day}</div>${cnt ? `<span class="pip paid">${cnt} ${state.lang==='mm'?'ကြိမ်':''}</span>` : ''}</div>`;
        }).join('')}
      </div>
    </div>
  `;
  $('#c-prev').addEventListener('click', () => { state.month = addMonth(state.month, -1); LS.set('month', state.month); $('#month-picker').value = state.month; route(); });
  $('#c-next').addEventListener('click', () => { state.month = addMonth(state.month, 1); LS.set('month', state.month); $('#month-picker').value = state.month; route(); });
}

// ----------------------- Settings --------------------------------------
async function renderSettings() {
  setTitle(t('settings.title'));
  const c = $('#content');
  const s = await api('settings');
  c.innerHTML = `
    <div class="row-grid">
      <div class="section">
        <h3>${t('settings.general')}</h3>
        <div class="grid" style="gap:12px">
          <label class="field"><span>${t('settings.group_name')}</span>
            <input id="s-group" type="text" value="${escapeHTML(s.group_name || '')}"></label>
          <label class="field"><span>${t('settings.default_amount')}</span>
            <input id="s-default" type="text" value="${escapeHTML(s.default_amount || '10000')}">
            <div class="amount-preview" data-amount-preview></div>
          </label>
          <label class="field"><span>${t('settings.display_mode')}</span>
            <select id="s-mode">
              <option value="exact">${t('settings.display.exact')}</option>
              <option value="units">${t('settings.display.units')}</option>
              <option value="both">${t('settings.display.both')}</option>
              <option value="auto">${t('settings.display.auto')}</option>
            </select>
          </label>
          <label class="field"><span>${t('settings.theme')}</span>
            <select id="s-theme">
              <option value="light">${t('settings.theme.light')}</option>
              <option value="dark">${t('settings.theme.dark')}</option>
              <option value="system">${t('settings.theme.system')}</option>
            </select>
          </label>
          <label class="field"><span>${t('settings.language')}</span>
            <select id="s-lang">
              <option value="mm">မြန်မာ</option>
              <option value="en">English</option>
            </select>
          </label>
          <div><button class="primary-btn admin-only" id="s-save">${t('action.save')}</button></div>
        </div>
      </div>
      <div class="section">
        <h3>${t('admin.change_password')}</h3>
        <div class="grid" style="gap:12px">
          <label class="field"><span>${t('admin.current_password')}</span>
            <input id="pw-cur" type="password" autocomplete="current-password"></label>
          <label class="field"><span>${t('admin.new_password')}</span>
            <input id="pw-new" type="password" autocomplete="new-password"></label>
          <div><button class="primary-btn admin-only" id="pw-change">${t('admin.change_password')}</button></div>
        </div>
        <h3 style="margin-top:18px">${t('app.title')}</h3>
        <p class="muted">${t('app.subtitle')}</p>
        <p class="muted">v1.0 • PHP ${state.mode}</p>
      </div>
    </div>
  `;
  $('#s-mode').value = state.mode;
  $('#s-theme').value = state.theme;
  $('#s-lang').value = state.lang;
  bindAmountPreview($('#s-default'), $('#s-default').nextElementSibling);
  $('#s-save').addEventListener('click', async () => {
    if (!await ensureAuth()) return;
    const payload = {
      group_name: $('#s-group').value.trim() || 'Monthly Savings',
      default_amount: $('#s-default').value,
      display_mode: $('#s-mode').value,
      theme: $('#s-theme').value,
      language: $('#s-lang').value,
    };
    if (parseMyAmount(payload.default_amount) == null) { toast(t('amount.invalid'), 'warn'); return; }
    await api('settings', {}, 'POST', payload);
    state.mode = payload.display_mode; state.theme = payload.theme; state.lang = payload.language;
    LS.set('mode', state.mode); LS.set('theme', state.theme); LS.set('lang', state.lang);
    applyTheme(); applyLang();
    toast(t('settings.saved'), 'good');
  });
  $('#pw-change').addEventListener('click', async () => {
    if (!await ensureAuth()) return;
    const cur = $('#pw-cur').value, nw = $('#pw-new').value;
    if (!cur || !nw) { toast('Fill both fields', 'warn'); return; }
    try {
      await api('change_password', {}, 'POST', { current: cur, new: nw });
      toast(t('admin.password_changed'), 'good');
      $('#pw-cur').value = ''; $('#pw-new').value = '';
    } catch (err) { toast(err.message, 'bad'); }
  });
}

// ----------------------- Backup ----------------------------------------
async function renderBackup() {
  setTitle(t('backup.title'));
  const c = $('#content');
  c.innerHTML = `
    <div class="row-grid">
      <div class="section">
        <h3>${t('backup.title')}</h3>
        <div class="row" style="flex-wrap:wrap">
          <button class="primary-btn admin-only" id="ex-json">${t('backup.export_json')}</button>
          <button class="ghost-btn admin-only" id="ex-sqlite">${t('backup.export_sqlite')}</button>
          <button class="ghost-btn admin-only" id="ex-csv">${t('backup.export_csv')}</button>
        </div>
        <p class="muted" style="margin-top:8px">🔒 ${t('login.locked_banner')}</p>
      </div>
      <div class="section">
        <h3>${t('backup.import_json')}</h3>
        <form id="imp-form">
          <label class="field"><span>${t('backup.mode')}</span>
            <select name="mode"><option value="merge">${t('backup.merge')}</option><option value="replace">${t('backup.replace')}</option></select></label>
          <label class="field"><span>${t('field.name')}</span>
            <input type="file" name="file" accept="application/json,.json"></label>
          <p class="muted">${t('backup.warning')}</p>
          <button class="primary-btn admin-only" type="submit">${t('action.import')}</button>
        </form>
      </div>
    </div>
  `;
  async function downloadExport(fmt) {
    if (!await ensureAuth()) return;
    const url = '?api=export&format=' + encodeURIComponent(fmt);
    // Use a hidden link so the auth cookie is sent
    const a = document.createElement('a');
    a.href = url; a.download = '';
    document.body.appendChild(a); a.click(); a.remove();
  }
  $('#ex-json').addEventListener('click', () => downloadExport('json'));
  $('#ex-sqlite').addEventListener('click', () => downloadExport('sqlite'));
  $('#ex-csv').addEventListener('click', () => downloadExport('csv'));
  $('#imp-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!await ensureAuth()) return;
    const fd = new FormData(e.target);
    const file = fd.get('file');
    if (!file || !file.name) { toast('Select a file', 'warn'); return; }
    const text = await file.text();
    const mode = fd.get('mode');
    try {
      await api('import', { mode }, 'POST', { data: text });
      toast(t('backup.imported'), 'good');
      route();
    } catch (err) { toast(err.message, 'bad'); }
  });
}

// ----------------------- Modals ----------------------------------------
function openSpendModal(available) {
  const tpl = $('#tpl-spend-modal').content.cloneNode(true);
  const m = openModal(tpl);
  const form = m.root.querySelector('form');
  const amt = form.querySelector('input[name=amount]');
  const date = form.querySelector('input[name=spent_at]');
  const reason = form.querySelector('input[name=reason]');
  const note = form.querySelector('input[name=note]');
  const hint = form.querySelector('[data-balance-hint]');
  date.value = todayISO();
  amt.value = '';
  bindAmountPreview(amt, form.querySelector('[data-amount-preview]'));
  const updateHint = () => {
    const n = parseMyAmount(amt.value);
    if (n == null) { hint.textContent = ''; hint.className = 'balance-hint'; return; }
    const remaining = (available || 0) - n;
    const a = formatAmount(available || 0);
    const r = formatAmount(Math.max(0, remaining));
    if (remaining < 0) {
      hint.className = 'balance-hint err';
      hint.textContent = t('spend.insufficient') + ' (' + r.en + ')';
    } else {
      hint.className = 'balance-hint ok';
      hint.textContent = t('spend.balance') + ': ' + a.en + ' → ' + r.en;
    }
  };
  amt.addEventListener('input', updateHint);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const n = parseMyAmount(amt.value);
    if (n == null || n <= 0) { toast(t('amount.invalid'), 'warn'); return; }
    if ((available || 0) - n < 0) { toast(t('spend.insufficient'), 'warn'); return; }
    try {
      await api('expenses', { action: 'save' }, 'POST', {
        amount: amt.value, spent_at: date.value, reason: reason.value.trim(), note: note.value,
      });
      toast(t('spend.saved'), 'good');
      m.close();
      route();
    } catch (err) { toast(err.message, 'bad'); }
  });
}

function openPaymentModal(prefill = {}) {
  const tpl = $('#tpl-payment-modal').content.cloneNode(true);
  const m = openModal(tpl);
  const form = m.root.querySelector('form');
  const select = form.querySelector('select[name=member_id]');
  const monthInput = form.querySelector('input[name=month]');
  const amountInput = form.querySelector('input[name=amount]');
  const paidAt = form.querySelector('input[name=paid_at]');
  const note = form.querySelector('input[name=note]');
  const preview = form.querySelector('[data-amount-preview]');

  api('members', { active: '1' }).then(d => {
    select.innerHTML = '';
    d.items.forEach(mm => {
      const o = document.createElement('option');
      o.value = mm.id; o.textContent = mm.name;
      select.appendChild(o);
    });
    if (prefill.member_id) select.value = String(prefill.member_id);
  });
  monthInput.value = prefill.month || state.month;
  amountInput.value = prefill.amount || formatMoney(10000);
  paidAt.value = prefill.paid_at || todayISO();
  note.value = prefill.note || '';
  bindAmountPreview(amountInput, preview);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const amt = parseMyAmount(amountInput.value);
    if (!prefill.unpaid && (amt == null || amt <= 0)) { toast(t('amount.invalid'), 'warn'); return; }
    const payload = {
      id: prefill.id || null,
      member_id: parseInt(select.value, 10),
      month: monthInput.value,
      amount: amountInput.value,
      paid_at: paidAt.value,
      note: note.value,
      unpaid: !!prefill.unpaid,
    };
    try {
      await api('save_payment', {}, 'POST', payload);
      toast(t('payment.saved'), 'good');
      m.close();
      route();
    } catch (err) { toast(err.message, 'bad'); }
  });
}

function openMemberModal(member) {
  const tpl = $('#tpl-member-modal').content.cloneNode(true);
  const m = openModal(tpl);
  const form = m.root.querySelector('form');
  form.querySelector('input[name=name]').value = member?.name || '';
  const amtInput = form.querySelector('input[name=monthly_amount]');
  amtInput.value = member ? formatMoney(member.monthly_amount) : formatMoney(parseInt((getSetting('default_amount') || '10000'), 10));
  form.querySelector('input[name=note]').value = member?.note || '';
  form.querySelector('input[name=active]').checked = member ? !!member.active : true;
  bindAmountPreview(amtInput, form.querySelector('[data-amount-preview]'));
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      id: member?.id || null,
      name: form.querySelector('input[name=name]').value.trim(),
      monthly_amount: amtInput.value,
      active: form.querySelector('input[name=active]').checked ? 1 : 0,
      note: form.querySelector('input[name=note]').value,
    };
    try {
      await api('members', { action: 'save' }, 'POST', payload);
      toast(member ? t('member.updated') : t('member.added'), 'good');
      m.close();
      route();
    } catch (err) { toast(err.message, 'bad'); }
  });
}

function openBulkModal() {
  const tpl = $('#tpl-bulk-modal').content.cloneNode(true);
  const m = openModal(tpl);
  const form = m.root.querySelector('form');
  const monthInput = form.querySelector('input[name=month]');
  const paidAt = form.querySelector('input[name=paid_at]');
  const amtInput = form.querySelector('input[name=amount]');
  const list = form.querySelector('[data-bulk-list]');
  const sum = form.querySelector('[data-bulk-summary]');
  monthInput.value = state.month;
  paidAt.value = todayISO();
  bindAmountPreview(amtInput, form.querySelector('[data-amount-preview]'));

  api('members', { active: '1' }).then(d => {
    list.innerHTML = '';
    d.items.forEach(mm => {
      const lab = el('label', {},
        el('input', { type: 'checkbox', value: String(mm.id), 'data-default': String(mm.monthly_amount) }),
        el('span', { style: { flex: '1' } }, mm.name),
        el('span', { class: 'muted', html: amountHTML(mm.monthly_amount) }),
      );
      lab.querySelector('input').addEventListener('change', updateSummary);
      list.appendChild(lab);
    });
    updateSummary();
  });
  function updateSummary() {
    const c = list.querySelectorAll('input:checked').length;
    sum.textContent = c + ' ' + (state.lang === 'mm' ? 'ယောက်' : 'selected');
  }
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const ids = Array.from(list.querySelectorAll('input:checked')).map(i => parseInt(i.value, 10));
    if (!ids.length) { toast('Select at least one', 'warn'); return; }
    if (amtInput.value && parseMyAmount(amtInput.value) == null) { toast(t('amount.invalid'), 'warn'); return; }
    try {
      const res = await api('bulk_pay', {}, 'POST', {
        month: monthInput.value,
        paid_at: paidAt.value,
        amount: amtInput.value,
        member_ids: ids,
      });
      toast(t('bulk.saved').replace('{n}', res.saved), 'good');
      m.close();
      route();
    } catch (err) { toast(err.message, 'bad'); }
  });
}

function getSetting(k) {
  // Read from <meta> or fallback
  return document.querySelector('meta[name="setting-' + k + '"]')?.getAttribute('content') || '';
}
function todayISO() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); }
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

// ----------------------- Charts (vanilla SVG) --------------------------
function drawLineChart(svg, data, opts = {}) {
  if (!svg) return;
  svg.innerHTML = '';
  const W = 600, H = 280, P = 36;
  if (!data.length) {
    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttribute('x', W/2); txt.setAttribute('y', H/2); txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('fill', 'currentColor'); txt.setAttribute('opacity', '.5');
    txt.textContent = t('empty.nothing');
    svg.appendChild(txt); return;
  }
  const max = Math.max(1, ...data.map(d => d.y));
  const stepX = (W - P*2) / Math.max(1, data.length - 1);
  const yScale = v => H - P - (v / max) * (H - P*2);
  const xScale = i => P + i * stepX;

  // Grid
  for (let g = 0; g <= 4; g++) {
    const y = P + g * (H - P*2) / 4;
    const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    ln.setAttribute('x1', P); ln.setAttribute('x2', W - P);
    ln.setAttribute('y1', y); ln.setAttribute('y2', y);
    ln.setAttribute('stroke', 'currentColor'); ln.setAttribute('opacity', '.08');
    svg.appendChild(ln);
    const tx = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tx.setAttribute('x', 6); tx.setAttribute('y', y + 3);
    tx.setAttribute('font-size', '10'); tx.setAttribute('fill', 'currentColor'); tx.setAttribute('opacity', '.6');
    tx.textContent = formatMoney(Math.round(max - g * (max/4)));
    svg.appendChild(tx);
  }
  // Area + line
  let dStr = '';
  data.forEach((p, i) => { dStr += (i ? 'L' : 'M') + xScale(i) + ',' + yScale(p.y) + ' '; });
  const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  area.setAttribute('d', dStr + `L${xScale(data.length-1)},${H-P} L${xScale(0)},${H-P} Z`);
  area.setAttribute('fill', 'url(#areaGrad)');
  area.setAttribute('opacity', '.18');
  svg.appendChild(area);
  // gradient def
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `<linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="var(--primary-2)"/>
    <stop offset="100%" stop-color="var(--primary-2)" stop-opacity="0"/>
  </linearGradient>`;
  svg.appendChild(defs);

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', dStr);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'var(--primary-2)');
  path.setAttribute('stroke-width', '2.5');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('stroke-linecap', 'round');
  svg.appendChild(path);

  // X labels (subset)
  const step = Math.max(1, Math.ceil(data.length / 8));
  data.forEach((p, i) => {
    if (i % step !== 0 && i !== data.length - 1) return;
    const tx = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tx.setAttribute('x', xScale(i)); tx.setAttribute('y', H - 12);
    tx.setAttribute('text-anchor', 'middle'); tx.setAttribute('font-size', '10');
    tx.setAttribute('fill', 'currentColor'); tx.setAttribute('opacity', '.7');
    tx.textContent = shortMonthName(p.x, state.lang);
    svg.appendChild(tx);
  });

  // Tooltip dots
  const tip = document.createElement('div'); tip.className = 'tooltip';
  document.body.appendChild(tip);
  data.forEach((p, i) => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', xScale(i)); c.setAttribute('cy', yScale(p.y));
    c.setAttribute('r', '4'); c.setAttribute('fill', 'var(--primary-2)');
    c.setAttribute('stroke', 'var(--bg-elev)'); c.setAttribute('stroke-width', '2');
    c.style.cursor = 'pointer';
    c.addEventListener('mousemove', (e) => {
      tip.style.opacity = '1';
      tip.style.left = (e.pageX) + 'px'; tip.style.top = (e.pageY - 8) + 'px';
      const a = formatAmount(p.y);
      tip.innerHTML = `<strong>${p.label}</strong>
        <div>${a.en} MMK</div>
        <div class="amount-text">${a.mm}</div>
        ${p.extra && p.extra.paid != null ? `<div class="muted">${t('dashboard.paid')}: ${p.extra.paid}</div>` : ''}`;
    });
    c.addEventListener('mouseleave', () => { tip.style.opacity = '0'; });
    svg.appendChild(c);
  });
}

function drawDonut(svg, paid, unpaid) {
  if (!svg) return;
  svg.innerHTML = '';
  const cx = 100, cy = 100, r = 70, ir = 46;
  const total = Math.max(1, paid + unpaid);
  const paidAngle = (paid / total) * Math.PI * 2;
  const startAngle = -Math.PI / 2;
  const endPaid = startAngle + paidAngle;
  const endUnpaid = endPaid + (unpaid / total) * Math.PI * 2;
  const arc = (a0, a1) => {
    const large = (a1 - a0) > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + ir * Math.cos(a1), yi1 = cy + ir * Math.sin(a1);
    const xi0 = cx + ir * Math.cos(a0), yi0 = cy + ir * Math.sin(a0);
    return `M${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1} L${xi1},${yi1} A${ir},${ir} 0 ${large} 0 ${xi0},${yi0} Z`;
  };
  if (unpaid > 0) {
    const p1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p1.setAttribute('d', arc(startAngle, endPaid));
    p1.setAttribute('fill', 'var(--good)');
    svg.appendChild(p1);
    const p2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p2.setAttribute('d', arc(endPaid, endUnpaid));
    p2.setAttribute('fill', 'var(--bad)');
    svg.appendChild(p2);
  } else {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r);
    c.setAttribute('fill', 'var(--good)');
    const hole = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    hole.setAttribute('cx', cx); hole.setAttribute('cy', cy); hole.setAttribute('r', ir);
    hole.setAttribute('fill', 'var(--bg-elev)');
    svg.appendChild(c); svg.appendChild(hole);
  }
  const t1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t1.setAttribute('x', cx); t1.setAttribute('y', cy + 6); t1.setAttribute('text-anchor', 'middle');
  t1.setAttribute('font-size', '24'); t1.setAttribute('font-weight', '800');
  t1.setAttribute('fill', 'currentColor');
  t1.textContent = Math.round(paid * 100 / total) + '%';
  svg.appendChild(t1);
}

function drawGroupedBar(svg, items) {
  if (!svg) return;
  svg.innerHTML = '';
  const W = 600, H = 220, P = 50;
  if (!items.length) return;
  const max = Math.max(1, ...items.map(i => i.value));
  const bw = (W - P*2) / items.length * 0.55;
  const gap = (W - P*2) / items.length;
  for (let g = 0; g <= 4; g++) {
    const y = P + g * (H - P*2) / 4;
    const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    ln.setAttribute('x1', P); ln.setAttribute('x2', W - P);
    ln.setAttribute('y1', y); ln.setAttribute('y2', y);
    ln.setAttribute('stroke', 'currentColor'); ln.setAttribute('opacity', '.08');
    svg.appendChild(ln);
    const tx = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tx.setAttribute('x', 6); tx.setAttribute('y', y + 3);
    tx.setAttribute('font-size', '10'); tx.setAttribute('fill', 'currentColor'); tx.setAttribute('opacity', '.6');
    tx.textContent = formatMoney(Math.round(max - g * (max/4)));
    svg.appendChild(tx);
  }
  items.forEach((it, i) => {
    const x = P + i * gap + (gap - bw) / 2;
    const h = (it.value / max) * (H - P*2);
    const y = H - P - h;
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x); rect.setAttribute('y', y);
    rect.setAttribute('width', bw); rect.setAttribute('height', h);
    rect.setAttribute('rx', 6); rect.setAttribute('fill', it.color);
    svg.appendChild(rect);
    const tx = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tx.setAttribute('x', x + bw/2); tx.setAttribute('y', H - 16);
    tx.setAttribute('text-anchor', 'middle'); tx.setAttribute('font-size', '11');
    tx.setAttribute('fill', 'currentColor'); tx.setAttribute('opacity', '.8');
    tx.textContent = it.label;
    svg.appendChild(tx);
    const tv = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tv.setAttribute('x', x + bw/2); tv.setAttribute('y', y - 6);
    tv.setAttribute('text-anchor', 'middle'); tv.setAttribute('font-size', '11');
    tv.setAttribute('font-weight', '700'); tv.setAttribute('fill', 'currentColor');
    tv.textContent = formatMoney(it.value);
    svg.appendChild(tv);
  });
}

function countUp(node, target) {
  const dur = 700; const start = performance.now();
  function tick(t) {
    const p = Math.min(1, (t - start) / dur);
    node.textContent = Math.round(target * (0.2 + 0.8 * (1 - Math.pow(1-p,3))));
    if (p < 1) requestAnimationFrame(tick); else node.textContent = target;
  }
  requestAnimationFrame(tick);
}

// ----------------------- Boot ------------------------------------------
async function boot() {
  setupShell();
  // Check auth status from server
  try {
    const s = await api('auth_status');
    state.auth = !!(s && s.auth);
  } catch (e) { state.auth = false; }
  if (state.auth) {
    hideLogin();
  } else {
    // Show login chooser (Sign in OR Continue as Guest)
    showLogin();
  }
  setAuthUi();
  if (!location.hash) location.hash = '#/dashboard';
  route();
}
document.addEventListener('DOMContentLoaded', boot);
})();
