FINAL BUILD PROMPT — MONTHLY SAVINGS MANAGEMENT SYSTEM

You are a senior PHP full-stack developer, database architect, UI/UX designer, and data visualization engineer.

Build a complete, polished, production-ready Monthly Savings Management System.

The application is for a group of people who save money every month.

---

1. TECHNOLOGY REQUIREMENTS

The application must use:

- PHP 8.2+
- SQLite
- PDO
- HTML5
- CSS3
- Vanilla JavaScript

Do NOT use:

- Laravel
- Symfony
- React
- Vue
- Angular
- Node.js
- npm
- Vite
- Composer
- MySQL
- PostgreSQL

The application must be deployable on a normal PHP hosting/server.

---

2. FILE STRUCTURE

Keep the application simple.

Main application:

index.php

SQLite database:

savings.sqlite

The SQLite database must be automatically created if it doesn't exist.

The PHP application should initialize the database and tables automatically on first run.

The UI, CSS, JavaScript, and PHP backend can all remain inside:

index.php

No build process should be required.

---

3. DATABASE

Use SQLite through PDO.

Example:

$pdo = new PDO('sqlite:' . __DIR__ . '/savings.sqlite');

Enable:

PRAGMA foreign_keys = ON;

Use prepared statements everywhere.

Do NOT concatenate user input into SQL queries.

---

4. DATABASE SCHEMA

Create at minimum these tables.

members

CREATE TABLE members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    monthly_amount INTEGER NOT NULL DEFAULT 10000,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

payments

CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    month TEXT NOT NULL,
    amount INTEGER NOT NULL,
    amount_input TEXT,
    paid INTEGER NOT NULL DEFAULT 1,
    paid_at TEXT,
    note TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,

    FOREIGN KEY (member_id)
        REFERENCES members(id)
        ON DELETE CASCADE,

    UNIQUE(member_id, month)
);

settings

CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT
);

Add appropriate indexes for:

payments.member_id
payments.month
payments.paid

---

5. FINAL MEMBER LIST

The final group contains exactly 16 people.

Use these members:

1. Ko chit ko
2. zaw Oo
3. Kyaw myint aye
4. toewaoo
5. min min Aung
6. Kyaw Kyaw Htet
7. arkar
8. min khant kyaw1
9. min khant kyaw2
10. win Myat tun
11. sai zaw zaw
12. Wai moe
13. Hein thiha
14. bobo Aung
15. win moe Aung
16. Aung myo thant

IMPORTANT:

These are two different people:

min khant kyaw1
min khant kyaw2

They must have different database IDs.

Never use member name as the primary key.

Example:

ID 8  → min khant kyaw1
ID 9  → min khant kyaw2

Their payment histories must remain completely independent.

---

6. REMOVED MEMBERS

Do NOT include these members in the new default list:

Wai Yan Phyo
Wai Lin tun
chit photo Aung

If these members already exist in an older database, do NOT silently delete historical records.

Handle migration safely.

---

7. DEFAULT MONTHLY AMOUNT

Default monthly amount:

10,000 MMK

The application should display this naturally in Myanmar:

၁သောင်း ကျပ်

and English:

10,000 MMK

Make the default amount configurable.

---

8. CUSTOM MEMBER MONTHLY AMOUNT

Every member can have an individual monthly target.

Example:

Ko chit ko       → ၁သောင်း
zaw Oo           → ၂သောင်း
Kyaw myint aye   → ၅သောင်း

If no custom amount is specified, use the global default amount.

The dashboard's expected amount MUST calculate the sum of each active member's expected monthly amount.

Do NOT simply calculate:

16 × default amount

if members have different monthly amounts.

---

9. MONTHLY PAYMENT SYSTEM

Each member normally has one payment record per month.

Example:

member_id = 8
month = 2026-09
amount = 10000

The database UNIQUE constraint:

UNIQUE(member_id, month)

must prevent accidental duplicate monthly payments.

If a payment already exists, allow the user to edit it instead of creating a duplicate.

---

10. AMOUNT INPUT — VERY IMPORTANT

Users must be able to enter amounts in multiple formats.

Support:

Arabic numbers

10000
50000
100000
150000

Comma numbers

10,000
50,000
100,000
150,000

Myanmar digits

၁၀၀၀၀
၅၀၀၀၀
၁၀၀၀၀၀
၁၅၀၀၀၀

Myanmar monetary text

၁သောင်း
၂သောင်း
၅သောင်း
၁သိန်း
၂သိန်း
၁သိန်းခွဲ
၂သိန်းခွဲ
၁သိန်း ၅သောင်း
၁သိန်း၅သောင်း
၂သိန်း ၅ထောင်

---

11. MYANMAR AMOUNT PARSER

Implement a robust parser:

parseMyanmarAmount(input)

Examples:

၁သောင်း
→ 10,000

၂သောင်း
→ 20,000

၅သောင်း
→ 50,000

၁သိန်း
→ 100,000

၂သိန်း
→ 200,000

၁သိန်းခွဲ
→ 150,000

၂သိန်းခွဲ
→ 250,000

၁သိန်း ၅သောင်း
→ 150,000

၁သိန်း၅သောင်း
→ 150,000

၂သိန်း ၅ထောင်
→ 205,000

Also support:

10k
50k
100k
1 lakh

where reasonably unambiguous.

---

12. MYANMAR DIGIT CONVERSION

Support:

၀၁၂၃၄၅၆၇၈၉

and convert to:

0123456789

For example:

၁၀၀,၀၀၀

must become:

100000

before calculation.

---

13. SUPPORTED MYANMAR UNITS

Support:

ရာ
ထောင်
သောင်း
သိန်း
သန်း
ကုဋေ

Examples:

၁ထောင်
= 1,000

၅ထောင်
= 5,000

၁သောင်း
= 10,000

၅သောင်း
= 50,000

၁သိန်း
= 100,000

၂သိန်း
= 200,000

၁သန်း
= 1,000,000

---

14. "ခွဲ" SUPPORT

Support:

၁သိန်းခွဲ
၂သိန်းခွဲ
၅သောင်းခွဲ

Interpret as:

၁သိန်းခွဲ  = 150,000
၂သိန်းခွဲ  = 250,000
၅သောင်းခွဲ = 75,000

General rule:

X unit ခွဲ = X unit + half of that unit

Handle this correctly.

---

15. LIVE AMOUNT PREVIEW

When entering:

၁သိန်းခွဲ

show immediately:

၁၅၀,၀၀၀ ကျပ်

and in English:

150,000 MMK

Invalid input:

⚠ Amount could not be understood

Never save an invalid amount.

---

16. STORE NUMERIC VALUES

Always store the parsed amount as an INTEGER.

Example:

{
    "amount": 150000,
    "amount_input": "၁သိန်းခွဲ"
}

The numeric value is authoritative.

The original input is optional and only for display/history.

All calculations must use:

amount

not the original text.

---

17. AMOUNT FORMATTERS

Implement:

formatMoney(amount)

and:

formatMyanmarAmount(amount)

Examples:

10,000
→ ၁၀,၀၀၀ ကျပ်

100,000
→ ၁ သိန်း ကျပ်

150,000
→ ၁ သိန်းခွဲ ကျပ်

200,000
→ ၂ သိန်း ကျပ်

250,000
→ ၂ သိန်းခွဲ ကျပ်

1,000,000
→ ၁ သန်း ကျပ်

Also provide exact numeric display:

၁၅၀,၀၀၀ ကျပ်

The user should be able to switch between:

Exact Number
Myanmar Unit
Auto

---

18. ADVANCED DASHBOARD

The dashboard is the most important part of the application.

Create a premium financial dashboard.

Show:

Total Members

16

Active Members

16

Total Saved — All Time

Calculate the sum of ALL paid payments.

Display BOTH:

၁၂၅၀၀၀၀ ကျပ်

and:

၁၂ သိန်း ၅ သောင်း ကျပ်

or the most natural equivalent.

English:

1,250,000 MMK

---

19. CURRENT MONTH DASHBOARD

For selected month, show:

Expected
Collected
Remaining
Paid Members
Unpaid Members
Collection Rate

Example:

Expected
၁၆၀,၀၀၀ ကျပ်

Collected
၁၂၀,၀၀၀ ကျပ်

Remaining
၄၀,၀၀၀ ကျပ်

Paid
12 / 16

Unpaid
4

Collection Rate
75%

All values must update dynamically.

---

20. MONTHLY TOTALS — VERY IMPORTANT

Create a dashboard section:

Monthly Savings Overview

Display EVERY month that has payment data.

Example:

January 2026
Collected: ၁ သိန်း ၅ သောင်း
Exact: ၁၅၀,၀၀၀ ကျပ်

February 2026
Collected: ၂ သိန်း
Exact: ၂၀၀,၀၀၀ ကျပ်

March 2026
Collected: ၂ သိန်း ၅ သောင်း
Exact: ၂၅၀,၀၀၀ ကျပ်

Each month must show BOTH:

Text/unit representation

၂ သိန်း ၅ သောင်း ကျပ်

Exact number

၂၅၀,၀၀၀ ကျပ်

---

21. MONTHLY CHART

Create an advanced interactive chart.

X-axis:

Months

Y-axis:

Amount

Show collected amount for every month.

Example:

Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep

Hover/tap a month should show:

September 2026

Collected:
၁ သိန်း ၅ သောင်း ကျပ်

Exact:
150,000 MMK

Paid:
15 / 16

Collection:
93.75%

---

22. YEARLY TOTAL

Add:

This Year

Calculate total savings for the selected year.

Display:

၁၅ သိန်း ၅ သောင်း ကျပ်

and:

1,550,000 MMK

Allow year selection:

2024
2025
2026
2027

---

23. ALL-TIME TOTAL

Add a prominent card:

All-Time Savings

This must include all paid payments across all years.

Show:

Exact:
၁,၅၅၀,০০০ ကျပ်

Text:
၁၅ သိန်း ၅ သောင်း ကျပ်

The exact numeric amount and human-readable amount must always match.

---

24. MEMBER CONTRIBUTION DASHBOARD

Show ranking:

Top Contributors

Example:

1. Ko chit ko
   ၅ သိန်း

2. zaw Oo
   ၄ သိန်း

3. Kyaw myint aye
   ၃ သိန်း ၅ သောင်း

Show:

- Total saved
- Number of paid months
- Average monthly contribution
- Payment rate

---

25. PAYMENT STATUS CHART

Create:

Paid
Unpaid

donut/pie visualization.

Example:

Paid     12
Unpaid    4

Also show percentage.

---

26. EXPECTED VS COLLECTED

Create a comparison chart:

Expected
Collected
Remaining

for the selected month.

---

27. SAVINGS TREND

Create a trend chart for:

Monthly collected amount

Allow:

3 months
6 months
12 months
All time

---

28. MONTHLY SAVINGS PAGE

Create a dedicated page for monthly payments.

Top controls:

← Previous
September 2026
Next →

and a month picker.

Show all active members.

Example:

Member
Monthly Target
Paid Amount
Status
Paid Date
Action

---

29. QUICK PAYMENT

Each unpaid member should have:

[ Pay Now ]

Clicking opens a modal.

Fields:

Member
Month
Amount
Payment Date
Note

Amount input supports:

၁သောင်း
10000
၁၀,၀၀၀

Show live parsed amount.

---

30. BULK PAYMENT

Allow selecting multiple members.

Example:

☑ Ko chit ko
☑ zaw Oo
☑ Kyaw myint aye
☐ toewaoo

Then:

[ Mark Selected as Paid ]

Use each member's configured monthly amount by default.

Allow the user to review before saving.

---

31. MEMBER MANAGEMENT

Members page must support:

- Add member
- Edit member
- Deactivate
- Reactivate
- Search
- Sort
- Filter
- View profile
- Set monthly amount

Member card:

Avatar
Name
Monthly Target
Total Saved
Paid Months
Payment Rate
Current Month Status

---

32. MEMBER PROFILE

Show:

Member Name

Monthly Target
Total Saved
Paid Months
Unpaid Months
Payment Rate
Average Monthly Saving

Then show complete history.

Example:

September 2026
၁သောင်း
10,000 MMK
Paid

August 2026
၁သောင်း
10,000 MMK
Paid

July 2026
Unpaid

Include contribution chart.

---

33. REPORTS

Create advanced Reports.

Filters:

Year
Month
Member
Status

Reports:

Monthly Report

Expected
Collected
Remaining
Paid Members
Unpaid Members
Collection Rate

Yearly Report

Show all 12 months.

Member Report

Show:

Member
Total Saved
Paid Months
Unpaid Months
Average
Payment Rate

---

34. ALL-MONTH TABLE

Create a table:

Month | Expected | Collected | Remaining | Paid | Unpaid | Rate

Example:

Jan 2026 | 160,000 | 150,000 | 10,000 | 15 | 1 | 93.75%
Feb 2026 | 160,000 | 160,000 | 0 | 16 | 0 | 100%
Mar 2026 | 160,000 | 130,000 | 30,000 | 13 | 3 | 81.25%

Each amount should have a human-readable Myanmar representation available.

---

35. SEARCH

Global search:

- Member names
- Notes
- Payment records

Case-insensitive.

Fast enough for thousands of records.

---

36. CALENDAR

Create monthly calendar view.

Show payment activity.

Clicking a month/day should allow viewing related records.

---

37. EXPORT

Implement:

CSV

Export:

- All payments
- Monthly report
- Member report

JSON

Export all database data into a backup file.

---

38. IMPORT / RESTORE

Allow JSON backup import.

Workflow:

Select file
↓
Validate
↓
Preview
↓
Confirm
↓
Restore

Support:

Replace

and:

Merge

where practical.

Never silently destroy current data.

---

39. SQLITE BACKUP

Add a button:

Download SQLite Backup

Create a safe database backup.

If PHP hosting permits file download, allow downloading:

savings-backup-YYYY-MM-DD.sqlite

Also provide JSON backup because it is more portable.

---

40. LANGUAGE

Support:

🇲🇲 Myanmar
🇬🇧 English

All UI strings must be translated.

Use:

translations = {
    mm: {},
    en: {}
};

Do not hardcode UI strings throughout JavaScript.

Translate:

- Navigation
- Dashboard
- Buttons
- Forms
- Errors
- Toasts
- Reports
- Settings
- Dialogs
- Empty states

Member names must remain unchanged.

---

41. THEME

Support:

Light
Dark
System

Persist preference.

Use a modern premium financial dashboard aesthetic.

---

42. RESPONSIVE DESIGN

Must work on:

360px
390px
768px
1024px
1440px+

Mobile UI must be excellent.

Use:

- responsive cards
- mobile navigation
- bottom navigation or hamburger
- touch-friendly controls
- responsive charts
- mobile-friendly modals

---

43. UI STYLE

Design should feel like a modern fintech application.

Use:

- clean cards
- modern typography
- subtle gradients
- smooth shadows
- rounded corners
- professional spacing
- good contrast
- tasteful animations

Do NOT make it look like an old PHP admin dashboard.

---

44. ANIMATIONS

Use subtle animations:

- KPI number count-up
- card entrance
- modal transitions
- toast notifications
- progress bars
- chart animation
- page transitions

Keep performance high.

---

45. TOAST NOTIFICATIONS

Implement:

✓ Payment saved
✓ Member added
✓ Member updated
✓ Data saved
✓ Backup created
✓ Restore completed
⚠ Invalid amount
✕ Failed to save

Translate them.

---

46. API ARCHITECTURE

Because the application is one PHP file, implement lightweight AJAX endpoints.

For example:

?api=dashboard
?api=members
?api=payments
?api=save_payment
?api=delete_payment
?api=save_member
?api=delete_member
?api=settings
?api=export

You may choose a cleaner API structure.

Use JSON responses.

Example:

{
    "success": true,
    "data": {}
}

Use POST for mutations.

Use prepared SQL statements.

---

47. SECURITY

Implement:

- PDO prepared statements
- SQLite foreign keys
- Input validation
- Output escaping
- JSON validation
- Request method validation
- Safe file handling
- CSRF protection if practical
- No arbitrary filesystem paths
- No SQL injection
- No unsafe HTML injection

Do not expose PHP errors to users in production.

---

48. DATABASE INITIALIZATION

On first request:

1. Create SQLite file if missing.
2. Create tables.
3. Create indexes.
4. Insert default settings.
5. Insert the 16 default members.

Do not duplicate members on every request.

Use a reliable initialization/migration mechanism.

---

49. DATABASE MIGRATIONS

Include a simple schema version mechanism.

For example:

schema_version = 1

If the database schema changes in future versions, migrations can be applied safely.

Do not destroy existing data during migrations.

---

50. NO LOCALSTORAGE AS DATABASE

IMPORTANT:

The previous version used LocalStorage.

For this final version:

SQLite is the authoritative database.

LocalStorage may ONLY be used for UI preferences such as:

language
theme
sidebar state
selected month
display mode

Do NOT store the authoritative payment/member database only in LocalStorage.

All important data must be stored in:

savings.sqlite

---

51. DASHBOARD DATA MUST COME FROM SQLITE

When loading the dashboard, PHP should calculate data from SQLite or provide the required API data.

Do not rely only on stale browser data.

The dashboard must accurately reflect the actual database.

---

52. SMART AMOUNT DISPLAY

Every important amount should be capable of displaying BOTH:

Exact

၁၅၀,၀၀၀ ကျပ်

Human-readable

၁ သိန်းခွဲ ကျပ်

For English:

150,000 MMK

Provide a global setting:

Amount Display:
• Exact
• Myanmar Units
• Both
• Auto

Recommended default:

Both

for dashboard/report screens.

---

53. DASHBOARD EXAMPLE

The dashboard should visually contain approximately:

┌─────────────────────────────────────────────┐
│ Monthly Savings Manager                     │
│ September 2026                              │
├──────────────┬──────────────┬───────────────┤
│ Members      │ This Month   │ All Time      │
│ 16           │ 150,000 MMK  │ 1,550,000 MMK│
│              │ ၁၅ သိန်း?    │ ၁၅ သိန်း၅သောင်း │
├──────────────┴──────────────┴───────────────┤
│ Collection Progress                          │
│ ███████████████████░░ 93.75%                │
├─────────────────────────────────────────────┤
│ Monthly Savings Trend                        │
│                 📈                           │
├─────────────────────────────────────────────┤
│ Monthly Totals                               │
│ Jan    ၁ သိန်း ၅ သောင်း    150,000 MMK     │
│ Feb    ၂ သိန်း              200,000 MMK     │
│ Mar    ၂ သိန်း ၅ သောင်း    250,000 MMK     │
├─────────────────────────────────────────────┤
│ Paid vs Unpaid                               │
│       ◯ Chart                                │
├─────────────────────────────────────────────┤
│ Top Contributors                             │
│ 1. Ko chit ko              500,000 MMK      │
│ 2. zaw Oo                  400,000 MMK      │
└─────────────────────────────────────────────┘

Make the actual UI significantly more polished than this ASCII example.

---

54. PERFORMANCE

The app should handle at least:

16+ members
10,000+ payments
multiple years

without noticeable slowdown.

Use SQL aggregation for dashboard totals where appropriate.

For example:

SUM(amount)
COUNT(*)
GROUP BY month

Do not load unnecessary historical data into the browser just to calculate simple totals.

---

55. IMPORTANT CALCULATION RULES

All-time total

SUM(paid payments.amount)

Monthly collected

SUM(amount)
WHERE month = selectedMonth
AND paid = 1

Monthly expected

Sum each active member's monthly target.

Remaining

expected - collected

Never return negative remaining values; if overpayment occurs, show the surplus separately.

Collection rate

collected / expected × 100

Handle zero expected amount safely.

Member total

SUM(all paid payments for member)

---

56. OVERPAYMENT SUPPORT

If:

Expected = 160,000
Collected = 170,000

do not display:

Remaining = -10,000

Instead:

Remaining = 0
Surplus = 10,000

Show the surplus clearly.

---

57. AUDIT-FRIENDLY DATA

When payments are edited, preserve:

created_at
updated_at

Show payment date.

If practical, record an edit history table:

payment_history

with:

payment_id
old_amount
new_amount
changed_at

This is preferred for a financial record application.

---

58. DEFAULT CURRENCY

Default:

MMK

Myanmar UI:

ကျပ်

English:

MMK

---

59. DEFAULT LANGUAGE

Default language:

Myanmar

Allow switching instantly without reloading where practical.

---

60. FINAL TEST DATA

Test the parser with all of these:

၁သောင်း
၂သောင်း
၅သောင်း
၁သိန်း
၂သိန်း
၁သိန်းခွဲ
၂သိန်းခွဲ
၁သိန်း ၅သောင်း
၂သိန်း ၅သောင်း
၂သိန်း ၅ထောင်
၁၀,၀၀၀
၁၀၀,၀၀၀
၁၅၀,၀၀၀
10000
100000
150000
10k
50k
100k

Verify exact numeric calculations.

---

61. FINAL TESTING CHECKLIST

Before finishing, test:

Members

- [ ] Exactly 16 default members
- [ ] min khant kyaw1 and min khant kyaw2 are separate
- [ ] Add member
- [ ] Edit member
- [ ] Deactivate
- [ ] Reactivate
- [ ] Search
- [ ] Duplicate names

Payments

- [ ] Add payment
- [ ] Edit payment
- [ ] Delete payment
- [ ] Mark paid
- [ ] Mark unpaid
- [ ] Duplicate prevention
- [ ] Different months
- [ ] Different amounts

Amount parser

- [ ] Arabic digits
- [ ] Myanmar digits
- [ ] Commas
- [ ] သောင်း
- [ ] သိန်း
- [ ] သန်း
- [ ] ခွဲ
- [ ] Compound expressions

Dashboard

- [ ] Current month
- [ ] All-time
- [ ] Yearly total
- [ ] Monthly totals
- [ ] Expected
- [ ] Collected
- [ ] Remaining
- [ ] Surplus
- [ ] Paid
- [ ] Unpaid
- [ ] Collection rate
- [ ] Charts
- [ ] Member ranking

Database

- [ ] SQLite creation
- [ ] Tables
- [ ] Foreign keys
- [ ] Unique payment constraint
- [ ] Indexes
- [ ] Prepared statements
- [ ] Migration/versioning

Reports

- [ ] Monthly
- [ ] Yearly
- [ ] Member
- [ ] All-time

Backup

- [ ] JSON export
- [ ] JSON import
- [ ] SQLite backup
- [ ] Restore confirmation

UI

- [ ] Myanmar
- [ ] English
- [ ] Dark
- [ ] Light
- [ ] Mobile
- [ ] Tablet
- [ ] Desktop

---

62. DO NOT BUILD A PROTOTYPE

This is NOT a mockup.

Do NOT provide:

TODO
coming soon
implement later
placeholder
fake chart data
fake dashboard numbers

All dashboard values must come from the SQLite database.

All buttons must actually work.

All forms must actually save.

All reports must actually calculate.

All charts must use real database data.

---

63. FINAL DELIVERABLE

Build the complete application.

Final deployment should be as simple as:

/index.php
/savings.sqlite

If "savings.sqlite" doesn't exist, "index.php" creates it automatically.

Provide:

1. Complete working "index.php"
2. SQLite database initialization
3. Database schema
4. All PHP API endpoints
5. Complete HTML
6. Complete CSS
7. Complete JavaScript
8. Myanmar/English translations
9. Myanmar amount parser
10. Myanmar amount formatter
11. Advanced dashboard
12. Monthly/yearly/all-time analytics
13. Charts
14. Reports
15. Backup/restore
16. Responsive UI
17. Installation instructions

The final result must be a real, usable Monthly Savings Management System, not a simplified example.

Build it now.