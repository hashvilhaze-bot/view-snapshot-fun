# השביל הזה — roadmap

## Done (round 3)
- Logo presence in header + tighter mobile menu with CTA
- Hero: open image, brand + "המסע מתחיל בך." + one-line offer + CTA
- Copy rewrite: "יש יותר מדרך אחת לפגוש את ההימלאיה", concrete language, clichés removed
- Unverifiable claims removed (no "כל לילה בבית חם")
- 27 original photos, 3–4 image gallery on every trek + experience page
- "שווה לדעת" insight boxes on treks, experiences, Nepal
- Match tool: 6 questions + reasons per direction

## Round 4 (upgrade brief)
- [x] Trek pages: "למי פחות מתאים", key points
- [x] Dedicated results view for "מה מתאים לי?" (not a list under the quiz)
- [x] Quick path for people who already know: /quote short request form
- [x] WhatsApp as a main action channel (prefilled message)
- [x] "נפאל בכמה רגעים" quick facts card (verified facts only)
- [x] "להכיר את נפאל" content layer: culture, food, festivals, a day on the trail, Manaslu vs Annapurna
- [x] Knowledge center: quick answers first, depth second
- [x] Contextual CTAs instead of one generic contact button
- [x] Trust: who accompanies in Israel / who runs it in Nepal (placeholders where unknown)
- [x] Mobile-first review of every page

## Round 5 — auth
- [x] Google Sign-In (Lovable Cloud) + /auth page + header state
- [x] Profile screen: name, photo, trip preferences (/profile)
- [x] Email + password UI on /auth — needs Email provider switched on in Cloud auth settings

## Round 6 — data spine & flow
- [x] Section renamed to "טרקים ולא רק" everywhere
- [x] 5 new trek directions (פון היל, מרדי הימאל, לנגטנג, סבב אנאפורנה, אברסט בייס קמפ) with photos
- [x] Numeric duration data (trek days + total days in Nepal) on every trek
- [x] Matching: hard filter by available days + flexibility question + ranked results + "what didn't fit"
- [x] Session memory: answers/viewed route flow into /quote ("מה שכבר ספרתם לנו")
- [x] Signed-in name & email prefilled in the quote form
- [x] Lead payload enriched (answers, recommendations, source) — same submission channel
- [x] Rafting expanded (טריסולי / בהוטה קושי / ארון)
- [x] English/LTR infrastructure built (src/lib/i18n.ts + useLocale, header/footer wired). Hebrew stays default; `ENGLISH_ENABLED = false` so no partial English is exposed. Flip it on once full EN copy exists.
- [x] Facts completed: rafting grades + seasons, gear list, walking hours, Tsum extension, Chitwan/yoga durations, festival timing
- [x] Lead integration left untouched by request (new webhook not connected to a Make scenario yet)
- [x] Make webhook connected on 2026-09-09 to `https://hook.eu1.make.com/nmdv2k2jjslg9rttlwlpah9wxs8gw14x` — quote form submits form fields + trip context
- [x] Kathmandu spelling normalised to קטמנדו site-wide

## Still missing — needs client input (do not invent)
1. WhatsApp number (international format)
2. Phone number
3. Email address
4. Israel-side contact person: name + background
5. Nepal local partner: name + background
6. Make Scenario verified as receiving and processing leads (endpoint connected; scenario flow to be confirmed by client)

## סבב 7 — שכתוב, עיצוב ו-QA (הושלם)
- שכתוב טקסטים בעמוד הבית, נפאל, טרקים, מרכז הידע, בקשת הצעה, מי אנחנו ויצירת קשר.
- אחידות כפתורים: "בואו נמצא את השביל שלכם", "בואו נדבר על השביל שלכם", "לפרטי המסלול", "לקבלת הצעה למסלול", "לקריאת המדריך".
- שאלון בשלבים: מחוון התקדמות, שאלה אחת בכל שלב, חזרה אחורה בלי לאבד תשובות, שדה הערה/מגבלה אופציונלי, שמירה בין רענונים.
- מרכז הידע: כותרת "מרכז הידע למטיילים בנפאל", תמונה וזמן קריאה לכל מדריך.
- שם אחיד "סובב מנאסלו", מספרים וגבהים בכתיב מותאם לעברית, תפריט עם "מי אנחנו".
- לוגו גדול יותר בכותרת, אזור המשתמש הפך לאייקון דיסקרטי, ריווח אחיד בין מקטעים.
- QA: נייד ומחשב, כל העמודים 200, ללא שגיאות בקונסול.

## סבב 8 — שכתוב, "מי אנחנו" ו-QA (הושלם)
- הוסרו פתיחים מומצאים/קלישאיים ("בוקר אחד תפתחו דלת...", "תוכן לקרוא, גם בלי לתכנן טיול").
- עמוד הבית: "נפאל היא הרבה יותר מטרק", תהליך בשישה שלבים עד החזרה הביתה, מקטע "מי אנחנו" מחודש.
- עמוד נפאל: כותרת ופתיח חדשים, מקטע תרבות ואוכל מנוסח מחדש.
- עמוד "מי אנחנו" נבנה מחדש: "מעטפת אחת, מהרעיון הראשון ועד החזרה הביתה", שלושה כרטיסים (מכירים אתכם כאן / ניסיון מקומי בנפאל / אתכם לאורך כל הדרך), מקטע כהה ומורחב על סוכנות שלום, שישה שלבי ליווי, תמונות אותנטיות. הוסרו הכותרות "הצד הישראלי/הנפאלי".
- מונח אחיד "בתי תה" (הוסרו טיהאוס/לודג׳ים), כולל הסבר במרכז הידע.
- פוטר: ניגודיות גבוהה, טקסט גדול יותר, הפרדה בין וואטסאפ/טלפון/אימייל לכפתור ה-CTA.
- שאלון: "המסלול שנראה הכי מתאים לפי התשובות שלכם" + הבהרה שזו נקודת פתיחה לשיחה.
- עמודי מסלולים: מסך ראשון עם תמונה, כפתור "דברו איתנו על שילובים".
- רוחב תוכן הורחב במסכים גדולים, alt ללוגו: "השביל הזה — מסעות בהתאמה אישית בהימלאיה".
- QA: 360/390/1440 ללא גלילה אופקית, כל העמודים 200, אין שגיאות קונסול. הלידים ממשיכים לוובהוק של אוהד בלבד.

### נותר פתוח (דורש אימות/החלטה שלך)
- תמונות אמיתיות של אוהד ושל צוות שלום (בינתיים לא מוצג אדם לא מזוהה כאילו הוא אוהד).
- אימות ש-Scenario ב-Make אכן מעבד את הלידים.

## מבנה רב-יעדי (בוצע)
- ניווט "יעדים" עם dropdown בדסקטופ וקיבוץ במובייל
- עמוד /destinations עם כרטיסי נפאל/בהוטן/טיבט
- עמודי בסיס /destinations/bhutan ו /destinations/tibet (ללא תוכן שלא אומת)
- רישום יעדים ב-src/lib/destinations.ts להוספת יעדים בעתיד
- פתוח: תוכן מקצועי אמיתי לבהוטן וטיבט; סיווג מאמרי מרכז ידע לפי יעד כשיהיה תוכן
