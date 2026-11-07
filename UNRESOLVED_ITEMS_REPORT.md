# methodica-math-percent-03 — Consolidated Unresolved-Items Report

## סגירת QA ממוקדת — 22.10.2026

**מצב עדכני: אין ממצאי תוכן או התנהגות ידועים פתוחים בהיקף QA של יעד 4.3.** נועה מסרה שכל התיקונים הידועים בוצעו ואישרה כעת את ההחלטה האחרונה, CONTENT-12. סגירת החלטות התוכן נשענת על אישור בעלת הפרויקט; רק הבדיקות המנויות להלן בוצעו מחדש בסבב זה. אין כאן אישור נגישות כולל, אישור אינטגרציה או אישור פרסום כולל.

המצב כאן מתייחס לקובצי העבודה הנוכחיים, כולל תיקונים שטרם בוצע להם Commit. הרשומות המקוריות נשמרות בארכיון בהמשך לצורכי עקיבות בלבד: המונחים “active”, “missing”, “unchanged”, “decision needed” וספירות הממצאים שם מתארים נקודת זמן קודמת ואינם רשימת פתוחים נוכחית. אין לפתוח מחדש ממצא סגור ללא ראיה חדשה לפער.

### CONTENT-12 — החלטת בעלת הפרויקט

**סגור בהחלטת נועה, 22.10.2026:** ״שאלה אוריינית״ בשקף 61 היא תווית פנימית בתסריט בלבד, ואינה מיועדת לתצוגה ללומד. אין להוסיף את התווית לממשק. המימוש ב־03-03 / s47 סעיף א׳ (data-screen=41) תואם: הביטוי נשאר בהערת קוד בלבד ואינו טקסט ממשק. אין ממצא פתוח נוסף התלוי בהחלטה; סעיף ג׳ של אותו מסך נסגר באופן עצמאי כמפורט להלן.

### רישום הסגירות הנוכחי

| מזהה / נושא | מיקום נוכחי | מצב ובסיס הסגירה |
|---|---|---|
| CONTENT-01 — כיוון היחס | 03-05 / s64, שקף 80 | סגור בהחלטת תוכן מתועדת בקוד מ־22.10.2026: סככה:גידולים, 9:11. השאלה, הבדיקה והמשוב תואמים לכיוון זה. |
| CONTENT-02 — מפתח תשובות | 03-07 / s76, שקף 96 | סגור לפי אישור נועה על השלמת תיקוני התוכן. המימוש משתמש ב־correctIndices=[0,1,3] ובמשוב המתייחס לתשובות שסומנו. לא נערך בסבב זה אישור פדגוגי עצמאי מחדש למפתח. |
| CONTENT-03 — ארבעה סעיפים | 03-06 / s66 ושאלת שיא 1; 03-07 / s72–s76 | סגור בהיקף המימוש לפי אישור נועה; שאלת שיא 1 כוללת ארבעה סעיפים s68–s71, ושאלת שיא 2 שלושה s74–s76. אי־התאמות מספור בתסריט נשארות מידע היסטורי, לא באג פתוח בממשק. |
| CONTENT-04 — מדיניות רמזי שיא 1 | 03-06 / s68–s71, שקפים 87–90 | סגור; 12 תרחישי Chrome עברו מחדש: רמז מוסתר בפתיחה, זמין לפתיחה חוזרת לאחר שגיאה ראשונה, מוסתר לאחר משוב מסכם וגם בחזרה למסך. ניסיון חוזר מחייב שינוי תשובה. |
| CONTENT-05 — נוסחי משוב | 03-05 / s58–s65; 03-06 / s68–s71 | סגור לפי אישור נועה על תיקוני התוכן. הנוסחים והמשוואות הנוכחיים הם בסיס המסירה; לא בוצעה קריאה חוזרת מלאה בתסריט בסבב זה. |
| CONTENT-06 — ״רוני טועה״ | 03-07 / s74, שקף 94 | סגור; המשפט קיים בשני ענפי המשוב, עם הסבר סדר החלוקה הלא עקבי. אומת בקוד. |
| CONTENT-07 — הנעלם x | 03-07 / s74–s75, שקפים 94–95 | סגור; טבלאות המשוב משתמשות ב־x ובמשוואות יחס. אומת בקוד. |
| CONTENT-08 — ״זכו״/״זכרו״ | 03-06 / s70 (הפניה היסטורית s69) | סגור מהסבב הקודם; לא נמצאה ראיה חדשה המצדיקה פתיחה מחדש. |
| CONTENT-09 — תיאור תמונת גיימינג | 03-01 / s3, שקף 7 | סגור ברמת תיקון התוכן: alt ו־data-zoom-alt מתארים מפת משחק ו־60% התקדמות. אין בכך אישור נגישות למסך. |
| CONTENT-10 — צפייה בסרטונים | 03-01 | סגור עקב הסרת מסלול הווידאו s6a ובחירת המסלול s5 מהמימוש הפעיל; אין כיום חיווי צפייה פעיל התלוי בהחלטה זו. |
| CONTENT-11 — חשיפת פתרון | 03-01 / s7 | סגור לפי השלמת תיקוני ההתנהגות שאישרה נועה; מנגנון ה־pilot ההיסטורי במסך זה אינו ממצא פתוח. רכיבי reveal בשאלות אחרות נשארים כחלק מהמימוש המאושר. |
| CONTENT-12 | 03-03 / s47 א׳, שקף 61 | סגור בהחלטת נועה מ־22.10.2026 כמפורט לעיל. |
| CONTENT-13 — איפוס/סיום | יחידה | סגור בהיקף ממשק ה־QA הנוכחי: אין להחזיר את מסכי הסיום וכפתורי האיפוס ההיסטוריים שהוסרו. מדיניות Resume והשלמה במערכת תטופל באינטגרציה בנפרד. |
| ASSET-01 — תמונת טריוויה | 03-07 / s73, שקף 93 | סגור; see2_0.png הוחלף, ובבדיקה חזותית בסבב זה אין בתמונה את הנער הקירח מהממצא המקורי. |
| ASSET-02 — דמות מבקשת | 03-04 / s57, שקף 72 | סגור; poseKey=please והנכסים yellow_please.mp4 ו־blue_please.mp4 קיימים ומופנים בקוד. |
| ASSET-03 — גביע סעיף ג׳ | 03-02 / s39 ג׳, שקף 54 | סגור; ההפניה היא standard_6_c.jpeg, הנכס קיים, ואינו תמונת סעיף ב׳. |
| ASSET-04 | — | מידע היסטורי בלבד, לא ממצא פתוח. |
| ARCH-01 — מעברי רכיבים | ששת הגבולות בין 03-01 ל־03-07 | סגור בהיקף סביבת ה־QA: המעברים דרך גשר DEV_LEAVE_SPLIT ב־dev-nav אומתו בדפדפן. ניווט LMS/דף עצמאי הוא מגבלת אינטגרציה נפרדת, לא אישור שנבדק. |
| ARCH-02 — כפתורי סיום ישנים | 03-07 | סגור עקב הסרת s77/s78 מה־DOM הפעיל. ״סיימתי״ בסעיף האחרון נשאר במסך ומשבית את הכפתור; אין להניח שהוא מבצע השלמת LMS. |
| ARCH-03 — בחירת דמות | כל הרכיבים | סגור ברמת המימוש המקומי הקיים: localStorage שומר את בחירת הדמות; קוד זה קיים ב־HEAD ולא שונה בסבב הנוכחי. נשיאת מצב דרך המערכת לא נבדקה. |
| ARCH-04 — איפוס היסטורי | יחידה | סגור בהיקף QA יחד עם CONTENT-13; שאלות Resume/השלמה אינן מאושרות במסגרת זו. |
| ARCH-05 — reveal | שאלות שיא | סגור לפי אישור נועה על התנהגות היחידה; reveal בסעיף הסיום נשאר במימוש. לא נפתח מחדש כחוסר אחידות על סמך הדוח הישן. |
| חיווי נכונות בשאלת התבוננות | 03-01 / s18, data-screen=12, שקף 29 | סגור; ״כן״ ו״לא״ מקבלים בחירה ניטרלית זהה ללא ✓/×, המענה ננעל, המשך נפתח והבחירה נשמרת בחזרה. אומת מחדש ב־Chrome עבור שתי הבחירות. |
| ניסיון יחיד ברון ויהל | 03-03 / s47 ג׳, data-screen=41, שקף 63 | סגור; oneAttempt=true. אומתו מחדש תשובה נכונה ושגויה בניסיון ראשון, משוב מסכם ללא ״ננסה שוב״, נעילה, המשך ל־s50 וחזרה, וכן מעבר פנימי ב׳↔ג׳ ללא ניסיון נוסף. בדיקת מקלדת דווחה בסבב הקודם; לא בוצעה מחדש כאן. |
| אי הפלסטיק | שקפים 82–83, לשעבר s66a/s66b | סגור כשינוי מכוון בהחלטת הפקה מ־12.10.2026 לפי _parked/plastic-island-enrichment/README.md. הוסר מהרצף הפעיל ונשמר בארכיון; 03-06 מתחיל ב־s66 (60). אין להשיבו כ״מסך חסר״. |
| Poster | דמויות בווידאו; 03-01 / s8 | סגור: בווידאו דמויות מוסר ה־poster והתצוגה ממתינה לפריים הראשון; ב־s66 אומתו שתי הדמויות עם poster=null ו־readyState=4. ב־s8 נשמר Poster מכוון togther.png. לא בוצעה בסבב זה בדיקת הבהוב בפריים בודד. |
| חישובי אחוז משלים | 03-03 / s51; 03-06 / s69 | סגור מהסבב הקודם: 100−(40+24+12)=24 ו־100−(16+32+28)=24, בענפי נכון ושגיאה סופית. תוצאות הסבב הקודם נבדקו בקובץ calculation-results.json הזמני; אין זו הרצה מחודשת או בדיקת MathJax חדשה. |

### מיפוי רכיבים ומסכים פעילים

מספרי השקפים מתייחסים לתסריט המקורי בן 96 שקפים, ולא להערות מטיוטות ישנות בקוד. המיפוי לפי DOM ותוכן; מסכי משנה מאוחדים אינם שקפים חסרים.

| רכיב | שקפי תוכן בתסריט המקורי | מסכים פעילים / data-screen | מספר מסכים |
|---|---|---|---|
| 03-01 | 3–43 (כולל פתיחה; s5/s6a הוסרו ו־s25/s27 אוחדו) | s0 (0), s1 (1), s2 (2), s3 (3), s4 (4), s6b (7), s7 (8), s8 (9), s16 (10), s17 (11), s18 (12), s19 (13), s20 (14), s21 (15), s22 (16), s23 (17), s24 (18), s26 (20), s28 (22), s29 (23), s30 (24), s31 (25), s32 (26) | 23 |
| 03-02 | 44–54 (s40/s41 אינם פעילים) | s33 (27), s34 (28), s35 (29), s36 (30), s37 (31), s38 (32), s39 (33) | 7 |
| 03-03 | 55–68 (שקפים 61–63 מאוחדים ב־s47) | s42 (36), s43 (37), s44 (38), s45 (39), s46 (40), s47 (41), s50 (44), s51 (45), s52 (46), s53 (47), s54 (48) | 11 |
| 03-04 | 69–72 | s55 (49), s56 (50), s57 (51) | 3 |
| 03-05 | 73–81 | s58 (52), s59 (53), s60 (54), s61 (55), s62 (56), s63 (57), s64 (58), s65 (59) | 8 |
| 03-06 | 84–90 (82–83 הוצאו במכוון) | s66 (60), s67 (61), s68 (62), s69 (63), s70 (64), s71 (65) | 6 |
| 03-07 | 91–96 (מסכי סיום נוספים הוסרו) | s72 (66), s73 (67), s74 (68), s75 (69), s76 (70) | 5 |

תיקוני הפניות: 03-01 / s20 ↔ שקף 31; s26 ↔ 36; s28 ↔ 38. 03-03 / s47 א׳/ב׳/ג׳ ↔ 61/62/63; s52 ↔ 66. 03-04 / s57 ↔ 72. 03-05 / s60,s61 ↔ 76,77; s62,s63 ↔ 78,79; s64,s65 ↔ 80,81. 03-06 / s68–s71 ↔ 87–90. 03-07 / s73 ↔ 93; s74–s76 ↔ 94–96.

### בדיקות הסגירה שבוצעו ב־22.10.2026

- Chrome Headless: כל 63 המסכים הפעילים נטענו והופעלו באמצעות goTo, ללא pageerror. זו בדיקת טעינה וניתוב ממוקדת, לא פתרון מחדש של כל שאלות היחידה.
- ששת מעברי הרכיבים בגשר ה־dev נבדקו: 26→27, 33→36, 48→49, 51→52, 59→60, 65→66. הבדיקה הפעילה goTo בגבול הרכיב ווידאה את הרכיב והמסך שהתקבלו; לא כל מעבר הופעל באמצעות פתרון השאלה האחרונה וכפתור הלומד. סרגל dev מדלג על מסכים שהוסרו. כפתור ״סיימתי״ של שאלת שיא אינו מבטיח מעבר אוטומטי לרכיב הבא.
- s18, s47 ג׳, 12 תרחישי רמזי שיא 1 וה־Poster נבדקו כמפורט בטבלת הסגירות.
- הפניות מקומיות ב־src/poster/data-zoom-src נבדקו בדפדפן בכל 63 המסכים עבור שתי הדמויות. סריקת מקור משלימה בוצעה ל־HTML/JS/CSS. לא נמצאה הפניה חסרה במסך פעיל; green_popcoren.png מופיע במרשם ישן במנועים המשותפים אך אינו נצרך במסכים הפעילים, ולכן אינו באג חדש ואינו נמחק.
- node --check עבר לכל שבעת קובצי script.js; JavaScript פנימי בקובצי HTML ששונו נבדק בנפרד. git diff --check עבר לאחר הסרת 12 רווחי סוף־שורה בשורות QA שכבר שונו.
- השוואה ל־HEAD: בלוק מנגנון דיווח התקלה זהה בכל שבעת הרכיבים; לא השתנו שורות הקשורות ל־xAPI, Resume, postMessage או storage. מעבר גשר ה־dev ושמירת הדמות קדמו לסבב זה. שני קובצי דיאגרמה השתנו בטקסט ההנחיה בלבד (״הגזרה החומה״→״החלק החום״); אין שינוי בקוד הווידג׳ט או באינטגרציה. לא שונה קוד של ודים.

### מגבלות בדיקה — אינן ממצאי תוכן פתוחים

- אין אישור לתקשורת דיווח, xAPI, Resume, השלמה, LMS או אינטגרציית ודים. הדיווח נשאר כפי שהיה; ההשוואה מבטיחה היעדר שינוי, לא תקינות אינטגרציה.
- מעבר בין דפים עצמאיים מחייב מעטפת מערכת. המעברים שנבדקו הם בתוך dev-nav. שאלות השלמה/המשך לאחר ״סיימתי״ יטופלו באינטגרציה בנפרד אחרי העלאת QA ל־Git.
- תעבורה חיצונית נחסמה בבדיקות Chrome הממוקדות. YouTube, CDN/MathJax, טעינה ברשת וביצועי פריסה לא אומתו מחדש. אין להסיק מהיעדר pageerror שכל משאב חיצוני עבר בדיקה.
- שמירת מצב בתוך הביקור נבדקה במסכים המתוקנים; שחזור לאחר רענון/סגירת דפדפן ו־Resume לא נבדקו. לא בוצעו רגרסיה אינטראקטיבית מלאה, בדיקת רספונסיביות מלאה או השוואה מחודשת לכל שקפי התסריט.
- חוב טכני היסטורי (שכפול מנוע, קוד לא פעיל, נכסים עודפים, מספור ישן בתסריט) אינו חוסם סגירת QA ממוקדת. לא נמחקו קבצים.

### נגישות — לא אושרה בסבב זה

אין אישור נגישות כולל. סריקה סטטית קודמת דיווחה התראות מחוץ להיקף התיקונים; פירוטן לא אומת בבדיקה חיה ולא סומן כמתוקן. לא בוצעו כאן axe מלא, סבב מקלדת מלא, קורא מסך, ניגודיות או ביקורת WCAG/ת״י 5568. תיקון alt מסוים או בדיקת מקלדת נקודתית אינם אישור לכל היחידה. ממצאי נגישות שלא אומתו/לא טופלו נשארים לבדיקת נגישות נפרדת ואינם מוצגים כממצאי QA סגורים.

### הכנה ל־Git — ללא Commit או Push

- ענף פעיל: `main`; upstream: `origin/main`.
- Fetch/Push remote: `origin` — `https://github.com/methodicelElearnig/methodica-math-percent-03.git`.
- GitHub API החזיר `permissions.push=true` למשתמש המחובר. זוהי הרשאת מאגר; חוקי הגנת main/Rulesets לא אומתו ולא בוצע ניסיון כתיבה. אין התחייבות ש־Push ישיר ל־main יותר בפועל.
- נסקרו git status, git diff, שינויים staged וקבצים לא במעקב. אין קבצים staged; לא בוצעו add, Commit או Push. שינויים קיימים נשמרו.
- הקבצים הלא קשורים `.claude/launch.json` ו־`.claude/no_cache_server.py` מוחרגים. כלי בדיקה ותוצאות זמניים נמצאים ב־/tmp בלבד ולא ייכללו. אין ברשימה קובצי אינטגרציה של ודים.
- השינויים ברשימת הקבצים להלן הם תיקוני תוכן/התנהגות/נכסים/ניווט QA ותיעוד. בשני קובצי דיאגרמה מדובר בשינוי מלל בלבד, ללא שינוי בקוד האינטגרציה.

רשימת קבצים מדויקת ל־Commit המוצע (23):

- `SCRIPT_VS_REPO_AUDIT.md`
- `UNRESOLVED_ITEMS_REPORT.md`
- `dev-nav.html`
- `methodica-math-percent-03-01/index.html`
- `methodica-math-percent-03-01/script.js`
- `methodica-math-percent-03-01/styles.css`
- `methodica-math-percent-03-02/script.js`
- `methodica-math-percent-03-03/assets/images/standard_b_1_pie-chart-widget-s52.html`
- `methodica-math-percent-03-03/assets/images/standard_b_1_pie-chart-widget.html`
- `methodica-math-percent-03-03/index.html`
- `methodica-math-percent-03-03/script.js`
- `methodica-math-percent-03-04/index.html`
- `methodica-math-percent-03-04/script.js`
- `methodica-math-percent-03-05/index.html`
- `methodica-math-percent-03-05/script.js`
- `methodica-math-percent-03-06/script.js`
- `methodica-math-percent-03-07/assets/images/see2_0.png`
- `methodica-math-percent-03-07/index.html`
- `methodica-math-percent-03-07/script.js`
- `methodica-math-percent-03-01/assets/images/togther.png`
- `methodica-math-percent-03-02/assets/images/standard_6_c.jpeg`
- `methodica-math-percent-03-04/assets/images/blue_please.mp4`
- `methodica-math-percent-03-04/assets/images/yellow_please.mp4`

הודעת Commit מוצעת: `Close Math 4.3 QA findings and document final content decisions`

**ממתינים לאישור מפורש מנועה לפני Commit או Push.**

---

<details>
<summary>ארכיון: דוחות ובדיקות קודמים — אינו רשימת פתוחים עדכנית</summary>

## עדכון סגירת QA — 22.10.2026

זהו עדכון ממוקד למצב קובצי העבודה, כולל שינויים שטרם בוצע להם Commit. העדכון גובר על הרשומות ההיסטוריות בהמשך בנושאים המפורטים כאן. הדוח המקורי נשמר כראיה היסטורית; רשומה ישנה אינה הוכחה שממצא עדיין פתוח. נושא שאינו מפורט כאן לא אומת מחדש בסבב זה, ואין להסיק מכך שהוא סגור. הסבב אינו אישור נגישות מלא או בדיקת אינטגרציה.

| ממצא | רכיב ומסך נוכחי | שקף בתסריט | סטטוס וראיות |
|---|---|---|---|
| חיווי נכונות בשאלת התבוננות | 03-01 / s18, data-screen=12 | 29 | **סגור לאחר אימות Chrome.** הוסר סימון ✓ מה-HTML וממנגנון המענה, וכן חיווי × שהוסף ב-CSS לבחירה ב״לא״. שתי הבחירות מקבלות אותו סימון בחירה ניטרלי; האפשרויות ננעלות והמשך נפתח לאחר מענה. אומתו ״כן״ ו״לא״, המשך וחזרה עם שמירת הבחירה. |
| ניסיון יחיד בבדיקת רון ויהל | 03-03 / s47, סעיף ג׳, data-screen=41 (לשעבר s49) | 63 | **סגור לאחר אימות Chrome.** `S47_SECTIONS.c.oneAttempt=true`; תשובה ראשונה נכונה או שגויה מציגה משוב מסכם, נועלת אפשרויות ומאפשרת המשך. לא מוצג ״ננסה שוב?״. אומתו חזרה פנימית מסעיף ג׳ לב׳ ושוב לג׳, וכן יציאה ל-s50 וחזרה; הבחירה והמשוב נשמרים ללא ניסיון נוסף. תשובה נכונה נבדקה גם במקלדת. |
| CONTENT-12 — ״שאלה אוריינית״ | 03-03 / s47, סעיף א׳ | 61 | **סגור בהחלטת נועה, 22.10.2026.** תווית פנימית בתסריט בלבד, אינה מיועדת ללומד; אין להוסיפה לממשק. |

### מיפוי מעודכן להפניות בדוח הישן

מספרי השקפים כאן הם המיקום בפועל בקובץ התסריט בן 96 השקפים; הערות קוד עם מספרי שקפים גבוהים יותר עשויות להתייחס לטיוטה ישנה.

| רכיב | הפניה בדוח הישן | מסך נוכחי | שקף |
|---|---|---|---|
| 03-01 | s20 | s20 | 31 |
| 03-01 | s25/s26 | s26 — הסבר ומשוואת השלם; s25 אינו מסך נפרד כיום | 36 |
| 03-01 | s27/s28 | s28 — משוואה למציאת הכמות החלקית; s27 אינו מסך נפרד כיום | 38 |
| 03-03 | s47/s48/s49 | s47, סעיפים א׳/ב׳/ג׳ | 61/62/63 |
| 03-03 | s52 | s52 | 66 |
| 03-05 | s59/s60 | s60 (חמישה תשלומים) / s61 (ארבעה תשלומים) | 76/77 |
| 03-05 | s61 | s62 (מספר התלמידים בשכבה) | 78 |
| 03-07 | s73/s74/s75 | s74/s75/s76 | 94/95/96 |

בדיקות היחסים והחישובים הממוקדות מהסבב הקודם אינן נפתחות מחדש כאן. שקפים 72, 93, 96, הסרת אי הפלסטיק, רמזי שאלת שיא 1 וה-Poster נשארים בסטטוס שנמסר ואינם מסומנים כאילו נבדקו מחדש בסבב זה. דיווח, xAPI ואינטגרציית ודים לא שונו ולא נבדקו במסגרת התיקון.

### גבולות האימות

נבדקו מסלולי המענה והזיכרון בתוך אותו ביקור בדף; לא נוספה שמירה לאחר רענון דפדפן. בקונסול Chrome של תרחישי התיקון לא נמצאו שגיאות. סריקת נגישות סטטית כללית העלתה התראות מחוץ להיקף התיקון; הן אינן אימות של בעיה חיה ואינן מסומנות כסגורות. אין בדוח זה אישור נגישות כולל. לא בוצעו Commit או Push.

---

## הדוח ההיסטורי — אינו רשימת הממצאים הפתוחים העדכנית

**Scope:** Report only. No source, asset, or git changes were made producing this document.
**Basis:** `SCRIPT_VS_REPO_AUDIT.md` (baseline audit, pre-fix), the 8 fix-round commits (`229e64f` … `c1da698`), and direct re-inspection of the current committed code in all 7 `methodica-math-percent-03-0X` folders. Every item below reflects **current, post-Round-8 state** — items the fix rounds already resolved have been moved to Section E and are *not* repeated as open decisions.

---

## A. NIMROD / CONTENT DECISIONS

| ID | Component / screen | PPTX slide | Issue | Script evidence | Current repo behavior | Decision needed | Risk if left as-is |
|---|---|---|---|---|---|---|---|
| **CONTENT-01** | 03-05 / s63 | slide 80 | Ratio-direction contradiction | The script's own question text and its own worked feedback/answer disagree on ratio order (per baseline audit's PPTX read). Repo's current, unchanged section-header comment (`index.html:911-912`): *"NOTE: per manual decision, answer = 9:11 and the question asks סככה:גידולים."* | **Repo question** (`index.html:914,925-928`): "א. מה היחס המצומצם בין שטח **הסככה לשטח הגידולים**?" — asks shed:cultivation. **Repo grading** (`script.js:4017`): `answer: function(r){return /^\s*9\s*[:\/]\s*11\s*$/.test(String(r));}` — accepts only `9:11`, rejects `11:9`. **Repo feedback** (`script.js:4020,4022`, correct & finalWrong, identical): "היחס בין שטח הסככה לשטח הגידולים הוא: 45:55... לאחר צמצום ב-5 היחס הוא: 9:11." Repo's three parts (question wording, grading, feedback) are now internally self-consistent with each other — but only because a developer silently rewrote the *question's* direction to match the script's answer/feedback, rather than the reverse. | Confirm with the script owner which of the PPTX's own two contradictory elements (question wording vs. stated answer/feedback) is authoritative, and formally correct the source script. Until then, the repo's silent resolution stands unconfirmed. | If the script owner intended the opposite ratio, every learner is currently being taught/graded on the wrong ratio order for this item. |
| **CONTENT-02** | 03-07 / s75 | slide 96 (last slide of the script) | Answer-key contradiction | PPTX slide 96 feedback text says (per baseline audit) "כל התשובות נכונות" (all statements are correct). | **Repo grades** `correctIndices: [0, 1, 3]` (`script.js:4144`) — only 3 of 5 options accepted; picking all 5 is graded wrong. **Repo feedback was rewritten** around that key: correct-branch body (`script.js:4147`) now reads "כל התשובות **שסימנתם** נכונות" ("all the ones **you selected** are correct" — scoped to the learner's own picks, not an absolute "all 5 are correct"); finalWrong body (`script.js:4149`) says the correct ones are marked in green, no longer asserts "all correct." | Current behavior is internally functional (no crash, no logic bug) — but the true answer key (which exactly 3 of the 5 statements are correct, and whether the PPTX's "all correct" line is a script error or the repo's exclusion is) has never been confirmed by the script owner. | Decide the true correct set. This is the graded outcome of the very last question in the unit. |
| **CONTENT-03** | 03-07 (mapping) | slide 92 | "4 סעיפים" (4 sections) intro text vs. actual 3-part question | Slide 92's transition text says "יש בה 4 סעיפים. עליכם להצליח ב-3 לפחות" (has 4 sections, succeed in ≥3) | Slide 92's content, when matched to repo registries, corresponds to `s65`'s character-pose entry (`poseKey:'happy'`, matches component 03-06) and `peakFinish()`'s "3-of-N" check pattern — **not** to this component's actual 3-part trivia question (`s73`/`s74`/`s75`, sub-parts `p2a`/`p2b`/`p2c`, confirmed at `methodica-math-percent-03-07/script.js:194-195` and `4556-4563`). | No `<section>` in 03-07 implements slide 92 directly — the screen that visually precedes s73 in this component is `s72` (slide 93's info screen), which has no "4 sections" language at all. | Confirm slide 92's "4 sections" intro belongs to 03-06's battery peak-question (which really has 4 sub-parts, s67–s70) and correct slide 92's placement/copy in the script rather than leaving it attached to the 3-part trivia question that follows it in deck order. | Low functional risk (no repo screen currently renders the wrong number), but the script itself misdescribes the question that follows it — worth fixing at the source before any future rebuild from this script. |
| **CONTENT-04** | 03-06 / s67–s69 | slides 87–89 | Scaffold vs. hint gating | Slides 87–89 each carry a reminder/scaffold sentence with **no** accompanying "אפשר רמז?" trigger shape (unlike slide 90, which has one explicitly). | **Confirmed current repo (all three screens unchanged since baseline audit):** the sentence is still gated behind a hidden hint button + hidden hint panel in all three — e.g. s67 `index.html:613-633`, s68 `index.html:725-745`, s69 `index.html:835-855` — each `hint-btn`/`hint-panel` still carries the `hidden` attribute, revealed only after a wrong attempt via `vqHint()`. | Should s67–s69's scaffold text be always visible (as its absence of an explicit trigger shape on those 3 slides suggests), or remain gated the way slide 90's explicitly-triggered hint is? | Low — a design-consistency question, not a correctness bug. But the four sub-questions of the same peak item currently behave inconsistently with each other for no confirmed reason. |
| **CONTENT-05** | Multiple (grouped) | — | Unscripted feedback prose | Per baseline audit, several screens' feedback bodies have narrative text whose PPTX placeholder shapes were recorded as **empty** at audit time. | **03-02:** no distinct additional unscripted-feedback item was flagged for this component beyond the hint-terminology drift (already fixed); nothing further to report here. **03-05 (s58, s59, s60, s61, s62, s64):** confirmed still present as substantial narrative bodies (`script.js:3934-4042`), numerically self-consistent. **⚠ Contradiction found:** `script.js:3928-3930` in 03-05 now carries a code comment asserting *"Feedback text below is verbatim from the PPTX (slides 191/192, 196/197, 201/202, 206/207, 211/212, 216/217, 221/222)"* — directly contradicting the baseline audit's claim that these slides' feedback placeholders were empty. This needs re-checking against the PPTX directly before either claim is trusted. **03-06 (s67, s68, s69):** confirmed still unsourced narrative feedback bodies, no contradicting comment found. **03-07 s74:** the baseline audit recorded s74 as a full **MATCH** (content/answer/feedback all PASS) — no "unscripted feedback" finding exists for s74 in the audit document; if this concern originated elsewhere it isn't corroborated here and should be treated as unconfirmed. | Confirm/deny script sourcing for 03-05 (resolve the comment-vs-audit contradiction first) and 03-06's peak sub-question feedback. Content team sign-off needed either way since the numbers are correct but the wording has no independently confirmed source. | Low mathematically (numbers check out everywhere) — this is a provenance/sign-off gap, not a correctness bug. |
| **CONTENT-06** | 03-07 / s73 | slide 94 | Correct-feedback opening line | PPTX contains a leading "רוני טועה." (Roni is wrong) sentence, per baseline audit. | **Confirmed current** (`script.js:4126-4128`): the `correct` feedback body (shown when the learner picks "טועה," the right answer) starts directly with "היא אמנם איתרה את הנתונים..." — **no "רוני טועה." lead-in**. That phrase exists only in `finalWrong.body` (`script.js:4130`), shown for the *wrong* answer. | Add "רוני טועה." to the correct-branch feedback to match script, or confirm the current omission is intentional (the correct answer already implies "טועה" was the selected choice, so the sentence may be redundant there). | Low — feedback is still accurate and gradeable either way; this is a content-parity question, not a bug. |
| **CONTENT-07** | 03-07 / s74 (and s73) | slide 95 | Hint/table symbol: `x` vs `?` | Per baseline audit, the script's proportion-table row for this item uses "x" as the unknown placeholder. | **Confirmed current** (`script.js:4128,4136,4139`, the shared `vqTri(...)` calls used by both s73 and s74): the unknown placeholder is `'?'` in every instance, not `'x'`. (Note: this same "x" vs "?" issue was separately found and **already fixed** for 03-05's s58/s64 tables in the `b19d346` round — s74 was not part of that pass.) | Change the placeholder to "x" for consistency with the script and with 03-05's already-corrected tables; change the script's own instruction; or confirm "?" is an accepted house-style deviation. | Low — purely cosmetic/notational, does not affect grading. |
| **CONTENT-08** | 03-06 / s69 | — | Apparent script typo: "זכו" vs "זכרו" | Flagged as a possible script-side typo needing owner confirmation. | **RESOLVED SINCE AUDIT — no decision needed.** Direct search of the current `index.html` and `script.js` for "זכו" returns **zero matches** in either file. The only occurrences near s69 are the correctly-spelled "זכרו" (`index.html:770`) and "היזכרו" (`index.html:855`). The typo does not exist in the current repo. | None — kept here only per the report's required-inclusion list; do not reopen. | None. |
| **CONTENT-09** | 03-01 / s3 | slide 7 | Alt/asset mismatch on "גיימינג" card | Script's alt-text for card 3 ("גיימינג") describes a social-media/dashboard scene, not gaming, per baseline audit. | **Confirmed unchanged** (`index.html:379-380,386-387`): image is `assets/images/gaming.png`, but its `alt`/`data-zoom-alt` still reads: "מסך לוח מחוונים של רשת חברתית בעיצוב כהה, ובו מספר עוקבים 230,000 וירידה של 95% לצד גרפים" (a dark-themed social-network dashboard with 230,000 followers and a 95% drop) — while the visible card title/copy is "גיימינג" / "כמה איזורים סיימתי במשחק?" (gaming / how many levels did I finish). | Confirm with the script author whether card 3's image/alt-text was meant to depict gaming content, and correct the script-side asset assignment. | Low-medium — a sighted learner sees a gaming-themed card; a screen-reader user hears a contradictory social-media description. Accessibility-relevant. |
| **CONTENT-10** | 03-01 / s6a | slide 10 | Click vs. video-completion (ENDED) gating for the green "watched" checkmark | Script NOTE: "לאחר לחיצה על סרטון המספר שלו נצבע בירוק" (after **clicking** a video, its number turns green). | **Confirmed unchanged**: watched-status is set only via `s6aMarkWatched`, called exclusively from `s6aFinishVideo(true)`, itself only invoked from the YouTube `onStateChange` handler when `e.data === YT.PlayerState.ENDED` (`script.js:1101-1104,1213-1232,1259-1280`). Clicking a node (`s6aNodeClick`) only opens/plays the video — it does not mark it watched. (Note: the separate "not all videos watched" red-bubble warning, a different finding from the same slide, **was** already fixed in the `e826669` round.) | Confirm whether "watched" should fire on click (as the script literally states) or remain completion-gated (arguably the more pedagogically sound reading, but a deviation from the literal script instruction). | Low-medium — affects when a learner perceives progress feedback; does not block progression (Continue is always enabled on this screen regardless). |
| **CONTENT-11** | 03-01 / s7 | slides 24–25 | Repo-only "reveal solution" answer toggle | No reveal-toggle mechanic is described in slides 24–25. | **Confirmed still present and expanded**: after the 2nd wrong attempt on both the battery table and the formula step, the repo shows "רוצים לראות את הפתרון הנכון?" with a toggle button (`s7ToggleTableReveal`/`s7ToggleFormulaReveal`, `script.js:1830-1857,1915-1920,1997+,2034-2038`) instead of auto-revealing the solution. Repo comments label this the "S8 pilot." The same `reveal:true` pattern also now appears on 03-06's s70 and 03-07's s75 (see ARCH-05). | Retain as an approved project-wide UX pattern (cross-unit policy), or roll back to the script's literal auto-reveal behavior on 2nd wrong attempt for screens where the script doesn't call for a toggle. | Low — does not affect correctness; it changes how directly feedback is delivered after a 2nd wrong attempt. |
| **CONTENT-12** | 03-03 / s47 סעיף א׳ | slide 61 | תווית ״שאלה אוריינית״ | התווית קיימת בתסריט. | נשארת כמטא־דאטה פנימית ואינה מוצגת ללומד, בהתאם להוראת המשתמש. | **סגור בהחלטת נועה, 22.10.2026.** תווית פנימית בלבד; אין להוסיף לממשק. | פער החלטה בלבד; אין שינוי בציון או בניווט. |
| **CONTENT-13** | Unit-wide | slide 83 (note) | Reset/completion wording — content-policy scope question, separate from the technical bugs in ARCH-04 | Slide 83's note requires the reset-unit button to appear "רק במסך האחרון של היחידה" (only on the last screen of **the unit**) but says confirming sends the learner "לתחילת הרכיב" (to the start of **the component**) — the script mixes unit/component scope. | See **ARCH-04** for the full technical picture (which components currently have/lack the button and where). This item is specifically the **content decision**: does "last screen of the unit" mean the true final screen across all 7 components combined, or the last screen of *each* independently-splittable build? | A definitive answer from the script owner on unit-vs-component scope, worded unambiguously in the script itself. | Medium — without this decision, "correct" placement can't even be defined, so the technical fixes in ARCH-04 have no agreed target state. |

---

## B. ASSETS / VISUAL PRODUCTION

| ID | Component / screen | PPTX slide | Current asset | Required action | Exact production note | Blocking? |
|---|---|---|---|---|---|---|
| **ASSET-01** | 03-07 / s72 | slide 93 | `see2_0.png` (unchanged since original commit — file mtime predates all 8 fix rounds) | Regenerate/replace | `לג'נרט מחדש בבקשה, בלי ילד עם קרחת` ("please regenerate, without the bald kid") | **Yes.** Visually re-confirmed just now (rendered at reduced size): the image still shows a bald teenager (2nd person from the left) at the classroom board-game table. No compliant replacement was found anywhere in `assets/images/`. |
| **ASSET-02** | 03-04 / s56 | slide 72 (given) | `CHARACTER_SCREEN_REGISTRY.s56` is fixed to `poseKey:'happy'` (`script.js:176-181`) | Add missing pose/asset, or confirm substitution | Slide 72's image alt-text describes a character in a kneeling/pleading pose tied to the nudge-bubble moment. No "kneel"/"plead" pose key exists anywhere in `CHAR_ASSETS` (only: still, reading, phone, popcoren, readVideo, think, train, victory, thumbsUp, happy, trainVideo, trash) and no matching file exists in `assets/images/`. | No (cosmetic/content-fidelity gap — the screen functions correctly with the substitute "happy" pose). |
| **ASSET-03** | 03-02 / s39 §ג | slide 54 | `S39_SECTIONS[2].img` currently points to `assets/images/standard_6_b.png` — the **same image as section ב** (`script.js:3496-3499`), reusing its alt-text too | Source/obtain `standard_6_c.png` | Slide 54 names a distinct image `standard_6_c` with its own alt-text (~9% fat content, per baseline audit) | **Still missing.** `find`/`ls` confirm `standard_6_c.png` does not exist anywhere in `methodica-math-percent-03-02/assets/images/`. Not confirmed resolved since the audit — **active**. No (functionally graded correctly; only the image is a duplicate of section ב's). |
| **ASSET-04** | — | — | — | — | No further confirmed active missing/mismatched assets were found beyond ASSET-01–03. The baseline audit's Recommended-Fix-Order line "Fix mismatched/empty alt-text on 03-02 (s35, s51)" is **partially resolved**: 03-02's s35 (`standard_2.png`) now has full alt-text (`index.html:534,541`, fixed in the `8809edd` round). No "s51" asset finding exists in 03-02's or 03-03's per-screen detail in the baseline audit — this reference could not be corroborated and is flagged as unclear rather than asserted as an open item. | No — informational only. |

---

## C. ARCHITECTURE / TECHNICAL DECISIONS

### ARCH-01 — Cross-component hand-offs (every split boundary in the unit)

All 7 components are separate, standalone HTML/JS bundles ("split builds"), each with its own `goTo()` that hard-refuses any screen index outside that file's own `SPLIT_FIRST`–`SPLIT_LAST` range. At **every single one** of the 6 boundaries between components, the last screen's own "advance" call already targets the correct next-component screen index — but since `goTo()` can only ever navigate within its own file's DOM, that call always silently no-ops. This is one systemic pattern repeated identically 6 times, not 6 independent bugs.

| Source screen (file) | SPLIT_FIRST–LAST (source file) | Attempted destination (`goTo`/`next`) | Intended next component/screen | Does destination actually exist? |
|---|---|---|---|---|
| 03-01 → 03-02 (data-screen 27, `s33`) | 03-01: 0–27 | — (this is a deliberate **overlap**, not a dead end: `s33` is real in both files) | — | Yes — intentional dual-implementation, confirmed not a bug. |
| 03-02 `s41` final screen (`index.html:1521`) | 27–35 | `onclick="goTo(36)"` → refused (`36 > SPLIT_LAST 35`) | 03-03's `s42` (its real first screen, `SPLIT_FIRST=36`) | **Yes**, s42 exists for real in 03-03. Hand-off mechanism (a way to actually navigate to a different component's page) is what's missing. |
| 03-03 `s54` final screen (`script.js:3921`) | 36–48 | `next: 49` → refused (`49 > SPLIT_LAST 48`) | 03-04's `s55` (its real first screen, `SPLIT_FIRST=49`) | **Yes**, s55 exists for real in 03-04. Hand-off mechanism missing. |
| 03-04 `s56Continue()` (`script.js:4587`) | 49–50 | `goTo(51)` → refused (`51 > SPLIT_LAST 50`) | 03-05's `s57` (its real first screen, `SPLIT_FIRST=51`) | **Yes**, s57 exists for real in 03-05. Hand-off mechanism missing. |
| 03-05 `s64` final screen (`script.js:4026`) | 51–58 | `next: 59` → refused (`59 > SPLIT_LAST 58`) | 03-06's `s65` (its real first screen, `SPLIT_FIRST=59`) | **Yes**, s65 exists for real in 03-06. Hand-off mechanism missing. |
| 03-06 `s70` final screen (`script.js:4109`, via `vqSubmit`) | 59–64 | `next: 65` → refused (`65 > SPLIT_LAST 64`) | 03-07's `s71` (its real first screen, `SPLIT_FIRST=65`) | **Yes — destination DOES exist.** `s71` is 03-07's actual first real screen (confirmed `methodica-math-percent-03-07/script.js:194-195`, registry entry `s71: {dataScreen:65,...}`). Do **not** treat s71 as missing — the screen is fully built; only the cross-file hand-off mechanism is absent. |

**Recommended decision owner:** whoever owns the deployment/LMS integration layer — this needs an actual page-to-page (or SPA-route) hand-off mechanism, not a per-component code fix. **Severity: CRITICAL** — as shipped, a learner cannot progress from any component to the next without an external navigation action (e.g., an LMS "next" link) that doesn't currently exist in the code.

### ARCH-02 — 03-07 `s76`/`s77` finish buttons call `goTo(0)`

**Current behavior (confirmed unchanged):** both `#s76-finish` (`index.html:901`) and `#s77-finish` (`index.html:928`) call `onclick="goTo(0)"`. `SPLIT_FIRST=65` in this file (`script.js:16`); the guard `if (n < SPLIT_FIRST || n > SPLIT_LAST) return;` (`script.js:675`) means `0 < 65` is true, so both clicks are dead — no-ops. This is a **separate bug** from ARCH-01: even in a hypothetical world where cross-component hand-off (ARCH-01) is solved, these two buttons would still fail, because `0` is not a valid target in *any* split file, including this one.

**Need:** define the authoritative finish destination — true LMS-completion callback, a redirect out of the lomda entirely, a restart-to-s71 behavior, or something else. **Severity: CRITICAL.**

### ARCH-03 — Cross-component character persistence

**Origin:** character selection happens once, on `s0` in 03-01 only (script only defines this content there).
**Where it's lost:** every other component (03-02 through 03-07) initializes `selectedCharacter`/`window.lomdaState.selectedCharacter` to `null` with no read from `localStorage`/`sessionStorage`/cookies/URL params anywhere in any file (confirmed at audit time and not touched by any of the 8 fix rounds).
**Affected:** all 6 downstream components always render the default character (`char1`, yellow) regardless of what the learner picked in 03-01.
**Decision needed:** is each component a standalone deployable page where this doesn't need to travel (by design), or does an outer platform/LMS layer need to carry the choice forward (a gap that needs building)? **Severity: HIGH** (visible, unit-wide) but not correctness-breaking.

### ARCH-04 — Reset policy / `unitReset()` behavior (consolidated)

| Component | Reset button present? | Where | Current status |
|---|---|---|---|
| 03-01 | No | — | N/A — not a final screen. |
| 03-02 | **Missing** (still) | Should be on `s41` per slide 83 | `grep -n "unitReset" index.html` in 03-02 returns **zero matches** — `unitReset()` exists in `script.js` but is wired to no element anywhere. Unchanged since baseline audit. |
| 03-03 | No | — | Only an inert, commented-out `s54Reset()` for an unrelated feature; unchanged. |
| 03-04 | **Present where NOT expected** (still) | `s56` (`index.html:492-494`, `onclick="unitReset()"`), this component's 2nd-of-2 screen, with `s56Continue()` still advancing onward (`goTo(51)`) — i.e. genuinely mid-unit | Unchanged since baseline audit — none of the 8 fix rounds touched this button's placement, only wording elsewhere on the same screen. |
| 03-05 | No | — | Unchanged. |
| 03-06 | No | — | Unchanged. |
| 03-07 | Present, correctly wired | `s76` and `s77` (`index.html:898,925`), `onclick="unitReset()"` | Confirmed: `unitReset()` (`script.js:4548-4554`) sets `goTo(SPLIT_FIRST)` = `goTo(65)` = this file's own `s71` — consistent with "start of the component." No placement violation here (though the buttons that lead to these screens are themselves broken — see ARCH-02). |

**Do not propose a code patch yet** — placement can't be fixed correctly until **CONTENT-13** (unit-vs-component scope) is answered. **Severity: HIGH**, split across 03-02 (missing) and 03-04 (misplaced).

### ARCH-05 — Shared reveal/toggle architecture

The "S8 pilot" reveal-gate pattern (show "רוצים לראות את הפתרון הנכון?" + a toggle button instead of auto-revealing the explanation) is now used inconsistently across the unit:
- **03-01 s7** (table + formula steps) — has it (see CONTENT-11).
- **03-06 s70** — confirmed still has `reveal: true` (`script.js:4098-4099`), routing through the gated branch (`script.js:4664-4705`) instead of the direct-reveal branch s67/s68/s69 use.
- **03-07 s75** — has it (`reveal: true`, `script.js:4143`).
- **03-06 s67/s68/s69** and most other question screens across the unit — do **not** have it; explanations show immediately.

This is a **global architecture/UX policy question** (should this pattern exist at all, and if so, on which screen types) — separate from any single screen's content wording. **Severity: MEDIUM.**

---

## D. TECHNICAL DEBT — NON-BLOCKING

| Item | Why it is technical debt | Learner impact | Recommendation |
|---|---|---|---|
| Full shared engine duplicated in every component | Each of the 7 `script.js` files (~4,900–5,000 lines each) carries the complete original monolith's code, not just its own slice — confirmed unchanged across all fix rounds. | None — dead code is never reached (`goTo()` range guard). | Defer; a future build step could tree-shake per component, but not before content sign-off. |
| ~40–75 empty HTML comment stubs per component for out-of-range screens | Leftover from the pre-split monolith; some carry stale "PPTX slide NN" citations from older drafts (up to "slide 262/263" in 03-04/03-05). | None. | Defer; harmless, but worth a documentation cleanup pass eventually so engineers don't cross-reference by these stale numbers. |
| `s54-reset-btn` CSS class reused for unrelated reset buttons | 03-04's and 03-07's "↻ איפוס היחידה" buttons (`index.html:492`, `898`, `925`) still use the class name `s54-reset-btn`, inherited from an unrelated, narrower 03-03 feature (`s54Reset()`) that isn't even present in those files. | None (cosmetic/internal naming only). | Cosmetic rename recommended whenever these screens are next touched. |
| Orphaned `s54Reset()` (commented out) in 03-03 | Inert, unrelated to the unit-reset feature. | None. | Safe to delete during any future cleanup pass. |
| `toggleHotspot()`/`hideAllHotspots()`/`.info-hotspot-wrapper` dead code in 03-01 | No matching markup anywhere in `s0`–`s33`; leftover from the pre-split monolith. | None. | Safe to delete. |
| Cosmetic-only internal QA label mismatch (03-05 `s61`) | Hidden QA label reads "שאלת שיא א'" though s61 is an *advanced* question, not a *peak* question — invisible to learners. | None. | Low-priority internal tooling fix only. |
| Stale/duplicate item-numbering and divider labels in the script itself (Cross-unit #1 in the baseline audit) | The script's own "מספר רכיב"/"מספר פריט" labels are internally inconsistent from slide 69 onward and don't reset across dividers. | None on the current repo (repo screens were mapped by content, not by trusting these labels). | Defer to a script-side cleanup pass; not a repo blocker. |
| Numerous unreferenced/orphaned image and video assets across all 7 components | Assets present in `assets/images/`/`assets/videos/` with no live DOM reference (leftover from monolith split). | None. | Candidate for a pre-publish asset-cleanup pass (see `lomda-qa-publish` skill), not urgent now. |

---

## E. RESOLVED ITEMS — DO NOT REOPEN

All confirmed fixed in the current committed code (re-verified directly, not assumed from commit messages):

- **03-01 s18** — neutral no-correct-answer behavior. `s18Answer()`/`s18Init()` now apply an identical `.s18-btn-selected` treatment to whichever button was clicked; no correctness (checkmark) is ever implied for either choice (`script.js:2128-2153`, `styles.css:5509-5515`).
- **03-01 s26** — 25% denominator. Formula now reads `\frac{100\% \cdot 40}{25\%}` (`index.html:2189`).
- **03-01 s31** — full derivation moved to the success branch, plus live numbers-only input validation with the "יש להזין מספרים בלבד." message added to both s31 and s32 (`script.js:2370-2423,2466-2472`; `index.html:2547-2555,2681-2689`).
- **03-02 s36** — 1300₪/65%→2,000₪ feedback math. Both correct and incorrect branches now show `\frac{1300 \cdot 100\%}{65\%} = 2000` (`script.js:2935-2940,2958-2964`), replacing the unrelated popsicles calculation.
- **03-02 s39 §א** — no hint. `hintHtml: null` for section א (`script.js:3465`), and the hint button is now conditionally hidden (`hintBtn.hidden = !sec.hintHtml`, `script.js:3648`).
- **03-05 s62** — inclusive wording. Gender-inclusive "תלמידות תלמידים"/"התלמידות והתלמידים" phrasing restored throughout the stem, suffix, and hint (`index.html:849-853,872-873,900`).
- **03-06 script fidelity fixes** — s67 wording ("הנדרש" instead of "המינימאלי"), hint terminology standardized to "טבלת הפרופורציה" across s67/s70, s70's "מניקוד המינימום" wording and "300" hint anchor restored, "בואו נבין למה" wording restored (`index.html` multiple; `script.js:4108,4111`).
- **03-07 s73** — alt/`data-zoom-alt` fully restored to the script's verbatim card-pile/trivia description (`index.html:592,599`).
- **03-07 s74** — hint now says "טבלת הפרופורציה" instead of "טבלת ההמרה" (`index.html:667`).
- **03-07 `peakFinish()`** — confirmed grading `['p2a','p2b','p2c']` (this component's own results) and routing `goTo(71)`/`goTo(70)` correctly (`script.js:4556-4563`). The success screen (`s77`) is reachable via this function's own logic now (its *access path* via the s76/s77 finish buttons is a separate, still-open issue — see ARCH-02).
- **03-06 s69 "זכו"/"זכרו"** — re-verified: the apparent typo does not exist in the current repo (correct spelling "זכרו"/"היזכרו" throughout). Listed in Section A only because the report brief required it; treat as closed, not a decision.
- **Plastic-island placement (baseline audit's Human Decision #5 / slides 82–83)** — producer decision made: the item is a standalone insertion right before the peak question, not part of `03-02`. `03-02`'s `s40`/`s41` were removed (`index.html`, `script.js`: `SPLIT_LAST` 35→33, `TOTAL_SCREENS` 9→7; `s39`'s completion now hands off via `goTo(36)` where `s41`'s dead end used to be); the real implementation now lives in `methodica-math-percent-03-06` as `s66a`/`s66b` (`assets/images/plastic-island-comic.html` moved there), filling in the placeholder that was already stubbed at data-screen 59.1/59.2 pending this decision. **This makes the following rows below stale, kept only for history:** ARCH-01's "03-02 `s41` final screen" row (source is now `s39`, same dead-end pattern, one screen earlier) and its "03-05 → 03-06" row's "`s65` (its real first screen, `SPLIT_FIRST=59`)" (03-06's real first screen is now `s66a`, `SPLIT_FIRST=59.1`); ARCH-04's "03-02 | Missing... Should be on `s41`" row (that screen no longer exists in 03-02 — the underlying `unitReset()`-placement question, Human Decision on unit-vs-component scope, is still open and unaffected by this move).

---

## F. FINAL PRIORITY SUMMARY

### MUST DECIDE BEFORE FINAL RELEASE
*(incorrect grading, wrong mathematical meaning, broken navigation/completion, or a visibly incorrect required asset)*

1. **CONTENT-01** — 03-05 s63 ratio-direction contradiction (wrong mathematical meaning risk).
2. **CONTENT-02** — 03-07 s75 answer-key contradiction (grading correctness risk).
3. **ARCH-01** — every cross-component hand-off in the unit is currently a dead end (broken navigation, unit-wide).
4. **ARCH-02** — 03-07's two finish buttons are dead clicks (broken completion).
5. **ASSET-01** — 03-07 s72's `see2_0.png` still contains the bald-teenager figure the production note asked to remove (visibly incorrect required asset).

### SHOULD GET CONTENT SIGN-OFF
*(unsourced but internally consistent feedback/prose, or design-consistency questions that don't break correctness)*

CONTENT-03, CONTENT-04, CONTENT-05, CONTENT-06, CONTENT-07, CONTENT-09, CONTENT-10, CONTENT-11, CONTENT-12, CONTENT-13; ARCH-03; ARCH-04; ARCH-05; ASSET-02; ASSET-03.

### CAN DEFER
All of Section D (technical debt), plus CONTENT-08 (already resolved).

### Counts
- **Active CONTENT decisions:** 12 (CONTENT-01 through 07, 09 through 13; CONTENT-08 excluded as resolved-since-audit).
- **Active ASSET items:** 3 (ASSET-01, ASSET-02, ASSET-03; ASSET-04 is informational only, not counted).
- **Active ARCHITECTURE items:** 5 (ARCH-01 through ARCH-05; ARCH-01 counted once despite covering 6 physical boundaries, since it is one systemic pattern).
- **Non-blocking TECH DEBT items:** 7.

No root issue is counted more than once across sections (e.g., the reset-button placement question appears once as a decision in CONTENT-13 and once as the consolidated technical picture in ARCH-04, not as two separate counted items; ARCH-01's six boundaries are one counted item).

---

## FINAL SAFETY CHECK

```
$ git status --short
?? SCRIPT_VS_REPO_AUDIT.md
?? UNRESOLVED_ITEMS_REPORT.md
?? script/
```

- No tracked files were changed during this consolidation.
- No staging occurred (`git add` was never run).
- No commits occurred.
- No push occurred.
- `SCRIPT_VS_REPO_AUDIT.md` and `script/` remain untouched (both still show as pre-existing untracked paths, unmodified).
- This report (`UNRESOLVED_ITEMS_REPORT.md`) is itself a new untracked file, consistent with "report-only, no git changes."


</details>
