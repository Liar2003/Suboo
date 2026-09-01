IMPORTANT REQUIREMENT UPDATES

Update the previously specified Monthly Savings Management App with the following requirements.

1. Correct Member List

The two members below are DIFFERENT PEOPLE:

min khant kyaw1
min khant kyaw2

They must NEVER be merged.

Use unique internal IDs for every member.

The final default member list is:

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
12. Wai Lin tun
13. Wai Yan Phyo
14. Wai moe
15. Hein thiha
16. bobo Aung
17. chit photo Aung

There are currently 17 members.

Do NOT invent additional members.

Each member must have a unique ID, for example:

member_001
member_002
...
member_017

The member's display name is NOT the unique identifier.

This is important because similar names may exist.

---

2. Myanmar Number / Amount Input

The application MUST support entering savings amounts using:

Arabic numerals

10000
50000
100000
150000

Comma-separated numbers

10,000
50,000
100,000
150,000

Myanmar digits

၁၀၀၀၀
၅၀၀၀၀
၁၀၀၀၀၀
၁၅၀၀၀၀

Myanmar text amounts

The user should be able to type amounts naturally using Myanmar monetary expressions.

Examples:

၁သောင်း
၁သိန်း
၅သောင်း
၂သောင်း
၂သိန်း
၁သိန်းခွဲ
၁သိန်း ၅သောင်း
၁သိန်း၅သောင်း
၂သိန်း ၅ထောင်

The application must parse these into numeric MMK values.

Examples:

၁သောင်း       → 10,000
၂သောင်း       → 20,000
၅သောင်း       → 50,000
၁သိန်း        → 100,000
၂သိန်း        → 200,000
၁သိန်းခွဲ      → 150,000
၁သိန်း ၅သောင်း → 150,000
၂သိန်း ၅ထောင် → 205,000

---

3. Amount Parser

Create a robust JavaScript function such as:

parseMyanmarAmount(input)

It should return a numeric amount.

For example:

parseMyanmarAmount("၁သောင်း")
// 10000

parseMyanmarAmount("၁သိန်း")
// 100000

parseMyanmarAmount("၁သိန်းခွဲ")
// 150000

parseMyanmarAmount("၁သိန်း ၅သောင်း")
// 150000

parseMyanmarAmount("10,000")
// 10000

Also support normal English expressions where reasonably possible:

10k
50k
100k
1 lakh

At minimum, fully support Myanmar monetary expressions.

---

4. Myanmar Digits Conversion

Implement conversion between Myanmar digits and Arabic digits.

Myanmar:

၀၁၂၃၄၅၆၇၈၉

Arabic:

0123456789

Example:

၁၀၀,၀၀၀ → 100000

The parser should normalize the input before calculating.

---

5. Amount Units

Support these Myanmar units:

ရာ
ထောင်
သောင်း
သိန်း
သိန်းခွဲ
သန်း
ကုဋေ

Examples:

၅ရာ       → 500
၁ထောင်    → 1,000
၅ထောင်    → 5,000
၁သောင်း    → 10,000
၅သောင်း    → 50,000
၁သိန်း     → 100,000
၂သိန်း     → 200,000
၁သန်း      → 1,000,000

Support combinations:

၁သိန်း ၂သောင်း ၅ထောင်

Result:

125,000

Also support:

၂သိန်း ၅သောင်း

Result:

250,000

---

6. "ခွဲ" Support

Myanmar users commonly say:

၁သိန်းခွဲ
၂သိန်းခွဲ
၅သောင်းခွဲ

Interpret:

၁သိန်းခွဲ  = 150,000
၂သိန်းခွဲ  = 250,000
၅သောင်းခွဲ = 55,000

General rule:

X unit ခွဲ = X unit + half of that unit

Do not confuse "ခွဲ" with a literal decimal.

---

7. Amount Input UI

The payment form should have an amount input such as:

Amount
[ ၁သောင်း                     ]

Below it, show a live parsed preview:

= 10,000 MMK

If the user types:

၁သိန်းခွဲ

show:

= 150,000 MMK

If the input is invalid:

⚠ Amount could not be understood

Do not save invalid amounts.

---

8. Amount Display

Internally store payment amounts as numeric values.

Example:

{
  "amount": 10000
}

Do NOT store the raw text as the primary amount.

Optionally preserve the original input:

{
  "amount": 10000,
  "amountInput": "၁သောင်း"
}

This allows the UI to remember what the user originally typed.

Calculations must always use:

amount

not the text.

---

9. Total Amount Display

All dashboard totals, reports, member totals, and monthly totals must support Myanmar-friendly formatting.

Example:

၁၀,၀၀၀ ကျပ်
၁ သိန်း
၁ သိန်းခွဲ
၂ သိန်း

Provide a setting:

Amount Display

with options:

Numeric

100,000 MMK

Myanmar Digits

၁၀၀,၀၀၀ ကျပ်

Myanmar Unit

၁ သိန်း

Auto

Automatically choose a readable representation.

Default should be:

၁၀,၀၀၀ ကျပ်

when Myanmar language is selected.

For English:

100,000 MMK

---

10. Smart Myanmar Amount Formatter

Create:

formatMyanmarAmount(amount)

Examples:

1000       → ၁,၀၀၀ ကျပ်
10000      → ၁၀,၀၀၀ ကျပ်
50000      → ၅၀,၀၀၀ ကျပ်
100000     → ၁ သိန်း
150000     → ၁ သိန်းခွဲ
200000     → ၂ သိန်း
250000     → ၂ သိန်းခွဲ
1000000    → ၁ သန်း

Also provide a simpler numeric formatter:

formatMoney(amount)

which can return:

၁၀၀,၀၀၀ ကျပ်

depending on the selected language/settings.

---

11. Dashboard Total Amount

Dashboard must show real numeric totals.

Example:

Total Saved

၁၂ သိန်း ၅ သောင်း

or, if exact numeric mode is selected:

၁,၂၅၀,၀၀၀ ကျပ်

Do not simply concatenate payment input strings.

For example, if payments are:

၁သောင်း
၅သောင်း
၁သိန်း

the total must calculate:

10,000
+50,000
+100,000
-----------
160,000

and display:

၁ သိန်း ၆ သောင်း

when Myanmar unit formatting is enabled.

---

12. Expected Amount

If monthly default amount is:

၁သောင်း

and there are 17 active members:

17 × 10,000
= 170,000 MMK

Display:

၁ သိန်း ၇ သောင်း

or:

၁၇၀,၀၀၀ ကျပ်

depending on the selected display mode.

---

13. Per-Member Custom Amount

The default monthly amount may be:

၁သောင်း

but allow an individual member to have a custom amount.

Example:

Ko chit ko → ၁သောင်း
zaw Oo → ၂သောင်း
Kyaw myint aye → ၅သောင်း

The payment form should support this.

Expected amount should be calculated using each member's configured monthly amount rather than blindly multiplying every member by one global amount when custom amounts exist.

---

14. Input Examples / Quick Amount Buttons

Add quick amount buttons:

၁ထောင်
၅ထောင်
၁သောင်း
၂သောင်း
၅သောင်း
၁သိန်း
၂သိန်း

Clicking a button should populate the amount input.

Also allow free-form typing.

---

15. Validation

Test all of these:

၁သောင်း
၁သိန်း
၂သိန်း
၁သိန်းခွဲ
၂သိန်းခွဲ
၅သောင်း
၁သိန်း ၅သောင်း
၁သိန်း၅သောင်း
၂သိန်း ၅သောင်း ၅ထောင်
10,000
100000
၁၀,၀၀၀
၁၀၀,၀၀၀

Expected numeric values must be correct.

Do not accept ambiguous or unsupported text silently.

If an expression cannot be parsed reliably, show an error and ask the user to enter a valid amount.

---

16. Important Data Integrity Rule

The member name is NEVER the primary key.

For example:

min khant kyaw1
min khant kyaw2

must have different IDs and independent payment histories.

Even if two members have exactly the same display name in the future, they must still be allowed to exist as separate people.

All payment relationships must use:

memberId

not:

memberName

---

17. Final Quality Requirement

Do not implement this as a simple string replacement system.

Build a proper amount parser with:

1. Myanmar digit normalization
2. Arabic number normalization
3. Comma removal
4. Unit parsing
5. Compound amount parsing
6. "ခွဲ" handling
7. Validation
8. Numeric internal storage
9. Myanmar amount formatting
10. English amount formatting

The final application must correctly calculate all totals regardless of whether the user entered:

10000
10,000
၁၀၀၀၀
၁၀,၀၀၀
၁သောင်း

All of these should represent:

10,000 MMK

and therefore produce exactly the same dashboard/report calculations.