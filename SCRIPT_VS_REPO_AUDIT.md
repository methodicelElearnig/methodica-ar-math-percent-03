# SCRIPT vs REPO AUDIT — methodica-math-percent-03 (יעד 4.3)

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

**Source of truth:** `script/מתמטיקה_יעד 4.3_בכתיבה_נמרוד_130826_להפקה.pptx` (96 slides, fully read including speaker notes and bold/color/yellow text runs).
**Repo audited:** components `methodica-math-percent-03-01` through `-07`, each read in full (`index.html`, `script.js`, `styles.css`, `index_dev.html`, `assets/images/`).
**Scope:** read-only audit. No repo files were modified as part of this work.

> **UPDATE (post-audit, producer decision):** Human Decision #5 (slides 82–83's
> correct position) is resolved — the plastic-island enrichment item does
> **not** belong at the end of `03-02`; it's a standalone insertion right
> before the peak question. `03-02`'s `s40`/`s41` were removed (component now
> ends at `s39`, `SPLIT_LAST` 35→33) and the content now lives for real in
> `methodica-math-percent-03-06` as `s66a`/`s66b` (data-screen 59.1/59.2,
> already stubbed there pending this decision). Every reference to `03-02
> s40/s41` or "kept in both places" below reflects the pre-fix state; see
> `UNRESOLVED_ITEMS_REPORT.md` Section E for the current one.

---

## Executive Summary

**Screens/states reviewed:** 73 real, implemented repo screens (s0/s33 … s77) across all 7 components, plus 7 structural/cross-cutting reviews of the "empty stub" ranges in each file. Every one of the 96 script slides was read and mapped (see Audit Coverage at the end).

**Match rate:** 25 screens fully match the script. 48 screens require at least one change. 0 script slides were found to be completely un-auditable.

**Findings by category** (a finding may carry more than one tag):
| ADD | CHANGE | REMOVE | LOGIC | ASSET | CONTENT | SCRIPT CHECK |
|---|---|---|---|---|---|---|
| 16 | 66 | 6 | 13 | 7 | 64 | 29 |

**Findings by severity:**
| CRITICAL | HIGH | MEDIUM | LOW |
|---|---|---|---|
| 11 | 9 | 37 | 58 |

**Headline structural discovery (applies to every component):** this is not 7 independent files with duplicated content — it is a **single shared codebase split into 7 "split builds."** Every component's `script.js` is a near-complete copy of one master engine; each `index.html` only contains real `<section>` markup for its own slice of screens (enforced by a `SPLIT_FIRST`/`SPLIT_LAST` `goTo()` guard), and every other screen — including the character-selection/hook intro that the script only defines once, under component 03-01 — exists solely as an **empty HTML comment stub** with no markup underneath, plus large blocks of matching dead JavaScript. This is the correct explanation for what first looked like "the intro is duplicated 7 times": it isn't duplicated, it's stubbed out everywhere except 03-01. See **Cross-unit finding #3**.

### Top 10 most critical gaps

1. **[03-01, s26 / slide 35-36] Wrong number in a guided-math formula.** The worked-example divides by 20% instead of the correct 25% established two slides earlier, and the displayed arithmetic is wrong even taking the wrong number at face value (100×40÷20 shown as "=160", which is actually 200). `index.html:2186,2189`.
2. **[03-02, s36 / slide 48] Feedback shows the wrong question's answer.** Both the correct and incorrect feedback for the "1300₪ = 65%, find the total" item instead display an unrelated popsicles calculation (80÷20%×100=400). `script.js:2935-2940, 2959-2964`.
3. **[03-02, s39 §א / slide 52] Hint shown where the script explicitly forbids one.** Slide 52 states "הפעם אין רמז" (no hint this time); the repo still gates a real, populated hint behind the standard hint button for this exact section. `script.js:3462-3469, 3648-3649`.
4. **[03-02, s41 / slide 83] The unit's progress-reset feature is completely missing from the one screen the script requires it on**, and that screen's own Continue button is a dead no-op (`goTo(36)`, outside this file's screen range). `index.html:1508-1524`.
5. **[03-04, s56 / slide 83 (given centrally)] The reset-progress button appears mid-unit** instead of only on a component's true last screen, contradicting the script's explicit placement rule. `index.html:492-494`.
6. **[03-07, s75] The unit's final "peak question" success path is unreachable.** `peakFinish()` grades the routing decision using a different peak question's stored results (`p1a`–`p1d`, which belong to component 03-06) instead of this component's own (`p2a`–`p2c`) — so a learner who answers this component's trivia question correctly is still routed to the failure screen. `script.js:4142-4150, 4557-4562`.
7. **[03-07, s76 & s77] Both possible final "סיימתי" (finish) buttons are dead clicks** — both call `goTo(0)`, which this split file's own range guard silently blocks. `index.html:901, 928`.
8. **[03-07, s75 / slide 96 — SCRIPT CHECK] The script contradicts itself on the last slide of the entire deck**: its own feedback text says "כל התשובות נכונות" (all statements are correct) while the same slide's answer key only accepts 3 of the 5 statements. Needs a human decision on the true correct set before this can be resolved either way.
9. **[03-05, s63 / slide 80 — SCRIPT CHECK] The script contradicts itself on a ratio question**: the visible question asks for cultivation:shed, but the script's own worked-answer computes shed:cultivation and states "9:11" — the two orders reduce to different ratios (11:9 vs 9:11). The repo silently picked one reading (documented in its own code comment) without confirmation from the script owner.
10. **[Unit-wide — SCRIPT CHECK] No "unit complete" screen exists anywhere in the current 96-slide script** (the deck ends on a plain multiple-choice question), yet `methodica-math-percent-03-07` ships a fully built closing screen ("השלמת את היחידה בהצלחה! 🤯") with zero script backing. Needs a decision: extend the script, or confirm the repo screen is intentionally carried over from an older/longer draft.

---

## Cross-unit / Global Requirements

### 1. The script's own component/item numbering is internally inconsistent
Defined in: PPTX slides 3, 44, 55, 69, 73, 84, 91 ("מספר רכיב" divider text) and every slide's "מספר פריט" label.
Relevant to: mapping every script slide to the correct repo component — foundational to this entire audit.

Verified mapping (by matching actual question text/topic to each repo folder's real content, not by trusting the printed labels):

| Repo component | Script slides | Divider says | Item numbers say |
|---|---|---|---|
| 03-01 | 3–43 | "01" ✓ correct | "01-001".."01-005" ✓ correct |
| 03-02 | 44–54, **+ 82–83** (physically relocated later in the deck) | "02" ✓ correct | mislabeled "01-006".."01-012" |
| 03-03 | 55–68 | "03" (coincidentally right) | mislabeled "02-001".."02-007" |
| 03-04 | 69–72 | "03" ✗ (repeats slide 55's value) | "03-001" (internally consistent with the wrong divider, wrong vs. true index 04) |
| 03-05 | 73–81 | "04" ✗ (should be 05) | "04-001".."04-003" |
| 03-06 | 84–90 | "04" ✗ (repeats slide 73's value, should be 06) | "04-004" (counter never resets) |
| 03-07 | 91–96 | "06" ✗ (should be 07 — "05" never appears anywhere in the deck) | "04-005" (counter never resets) |

**SCRIPT CHECK:** the item counter for slides 73–96 runs 04-001, 04-002, 04-003 (slides 73–81), then 04-004 (slide 84), then 04-005 (slide 91) — it never resets across either of the two divider slides in between. This suggests the script's author conceived of slides 73–96 as **one** component ("advanced + two peak questions"), which the repo then split into three folders (03-05/06/07). A human decision is needed on whether that 3-way split is correct, and the whole divider/item-numbering scheme should be corrected in the script before it's used for any future automated tooling.

### 2. Stale PPTX-slide-number citations throughout the repo's own HTML comments
Defined in: comments in every one of the 7 `index.html` files (e.g. "PPTX slide 45 (new script 180626)", "SCREEN 2 — Hook Question (PPTX slide 14)"; 03-04/03-05 go as high as "slide 187", "slide 262", "slide 263").
Relevant to: all 7 components.

These numbers belong to at least one, probably two, older/longer script drafts (a "new script 180626" revision, and an even longer 260+-slide draft implied by 03-04's dead stub range) — not the current 96-slide "130826" script audited here. They were not used for any comparison in this audit (all comparisons used the actual current-script slide numbers). They are, however, actively misleading to any engineer today cross-referencing repo↔script by slide number, and are worth a documentation cleanup pass independent of any content fix.

### 3. The character-selection + hook intro (script item 03-01-001/002) is real only in 03-01 — the rest are dead stubs, not duplicates
Defined in: PPTX slides 3–9 (character choice, battery/phone hook, daily-life-context montage, "how would you like to learn" method choice).
Relevant to: all 7 components.

Verified directly (`grep -n 'id="s0"'` and friends) in every folder: only `methodica-math-percent-03-01/index.html` contains real `<section>` markup for these screens. Components 03-02 through 03-07 all carry the *identical comment headers* ("SCREEN 0 — בחירת דמות", "SCREEN 1 — הצגת הדמות הנבחרת", "SCREEN 2 — Hook Question (PPTX slide 14)"…) with **empty bodies** underneath — no working `<section>` at all. `script.js` in every folder still carries large blocks of matching dead JavaScript (character registries, `resetScreenState()` branches, even `advanceFromS0()`–`advanceFromS4()` in some files) that reference DOM elements which don't exist in that file, guarded off from ever running by each file's own `goTo()` range check.

Also verified: neither `03-01/script.js` nor any other component's `script.js` reads from `localStorage`/`sessionStorage`/cookies anywhere. `selectedCharacter` is held only in an in-memory JS object, initialized to `null` in every split file except 03-01, and every consumer falls back to the default character (`char1`, yellow) when it's `null`.

**SCRIPT CHECK:** it is unresolved whether this is by design (each component is a standalone deployable page where character choice legitimately doesn't need to travel with the learner) or a genuine gap (an outer platform/LMS layer is expected to carry the choice forward, and that integration doesn't exist yet, or should exist but wasn't built). The script only defines this content once, under 03-01, and is silent on what should happen in components 02–07. Do not assume either answer — this needs a production decision.

### 4. This is a single shared codebase split into 7 "split builds," each carrying the whole engine as mostly-dead weight
Defined in: `script.js` self-documentation in every folder ("SPLIT BUILD — screens SXX–SYY only"), `index_dev.html`'s dev-navigator range, and each `goTo()`'s hard range guard.

Confirmed `SPLIT_FIRST`/`SPLIT_LAST` (data-screen index) and the corresponding real `<section>` ids per component:

| Component | data-screen range | Real screen ids |
|---|---|---|
| 03-01 | 0–27 | s0–s33 |
| 03-02 | 27–35 | s33–s41 |
| 03-03 | 36–48 | s42–s54 |
| 03-04 | 49–50 | s55–s56 |
| 03-05 | 51–58 | s57–s64 |
| 03-06 | 59–64 | s65–s70 |
| 03-07 | 65–71 | s71–s77 |

The ranges are contiguous with one exception: 03-01 and 03-02 both include data-screen 27 (`s33`, the "transition to standard practice" screen) — the only intentional-looking overlap; worth a quick confirmation that showing it from both files is deliberate. Every file otherwise carries the full original screen enumeration (s0–s77) as either dead comment stubs (no markup) or, in several files, fully-authored-but-unreachable JS configs for screens that live for real in a *different* component's file (e.g. 03-03's `script.js` contains a complete answer/feedback config for 03-04/05's advanced & peak questions; 03-05's `script.js` contains configs for 03-06's peak questions). None of this is reachable at runtime (the `goTo()` guard prevents it), so it has zero functional impact — but it is a large amount of dead weight in every single file, and it is the root cause of several of this audit's most confusing structural findings (see components 03-01, 03-03, 03-04, 03-05, 03-06, 03-07's "Repo content not mapped to script" sections).

### 5. Unit-reset feature ("↻ איפוס היחידה" / `unitReset()`) — inconsistent placement across the whole unit
Defined in: PPTX slide 83's speaker note — "כפתור אתחול יחידה מופיע רק במסך האחרון של היחידה... בלחיצה על הכפתור יופיע חלון... איפוס חלק זה יגרום למחיקת ההישגים שנצברו... בלחיצה על 'כן' הלומד מועבר לתחילת הרכיב" (the reset-unit button should appear only on the last screen of the **unit**; confirming resets progress and returns the learner to the start of "the **component**" — note the source itself mixes unit/component scope, which is itself part of the ambiguity below).

Full picture across all 7 components, now that every component report is in:

| Component | Reset button present? | Where | Assessment |
|---|---|---|---|
| 03-01 | No | — | N/A, not a final screen |
| 03-02 | **Missing** where required | Should be on s41 (slide 83, the exact slide that states this requirement) | `unitReset()` exists in `script.js` but is never wired to any element — CRITICAL |
| 03-03 | No (only an inert, commented-out `s54Reset()` for an unrelated narrower feature) | — | N/A |
| 03-04 | **Present where NOT expected** | s56, this component's 2nd-of-2 screen, with 3 more components still ahead | Violates "last screen only" — CRITICAL |
| 03-05 | No | — | N/A |
| 03-06 | No | — | N/A |
| 03-07 | Present, correctly wired | Both of its two possible outcome screens, s76 (fail) and s77 (success) | Returns to `SPLIT_FIRST` = this component's own first screen (s71) — matches a "start of the component" reading; consistent with either reading of "last screen" since these ARE 03-07's own final screens |

**SCRIPT CHECK (human decision needed):** the script's requirement was written for what reads like a single continuous unit, but the repo implements 7 independently splittable files. Does "last screen of the unit" mean the true final screen of all 7 components combined (in which case only 03-07 should ever have this button, and 03-02's absence would NOT be a bug), or does it mean the last screen of *each* standalone split build (in which case 03-02 and 03-06 are both missing a required feature)? As shipped today the implementation is inconsistent under *either* reading: 03-04 has it in a wrong (mid-unit, mid-component) position no matter which reading is correct, and 03-02 is missing it under the "each split" reading.

### 6. Proportion-table hint terminology has drifted into at least four different phrasings
Defined in: the script consistently calls the working tool "טבלת הפרופורציה" (the proportion table) in hint text across items 03-01 through 03-06.
Relevant to: 03-02 (7 occurrences), 03-03 (6 occurrences), 03-05 (4 occurrences), 03-06 (3 occurrences) — logged individually in each component's table but summarized here because the *pattern* itself, not any single instance, is the actionable item.

The repo's hint copy for the same instructional beat has drifted into at least four different, inconsistent phrasings across components: "טבלת הפרופורציה" (correct, used in some places), "טבלה" (generic "the table"), "טבלת ההמרה" ("the conversion table" — 03-02 s34), and "טבלת הערך המשולש" ("the triangle-value table" — 03-02 s35). A learner moving component-to-component sees the same tool called four different names. Recommended as one consolidated find-and-replace pass across all 7 components' `index.html` hint strings, rather than 20+ individual one-line fixes.

### 7. Duplicated "4 sections, need 3" transition boilerplate doesn't match the second peak question's actual structure
Defined in: PPTX slide 85 ("עכשיו מגיעה שאלת השיא... יש בה 4 סעיפים. עליכם להצליח ב-3 לפחות") and slide 92 ("הנה שאלת השיא... יש בה 4 סעיפים. עליכם להצליח ב-3 לפחות") — near-identical text.

Slide 85 correctly introduces the first peak question (03-06's battery-consumption question, which really does have 4 sub-parts, s67–s70, needing 3 of 4 correct — `peakFinish()`'s own logic confirms this 4-key/3-threshold check). Slide 92 introduces the *second* peak question (03-07's trivia-game question), which actually has only **3** sub-parts (s73/s74/s75, `p2a`/`p2b`/`p2c`), not 4. This looks like slide 92's intro text was copy-pasted from slide 85's template and never updated for the different question length — **SCRIPT AMBIGUITY**, flag to the script owner. (This is a separate issue from the `peakFinish()` code bug in Top-10 item #6, which is a repo defect regardless of how this text question is resolved.)

### 8. Slides 82–83 are physically out of sequence in the deck
Defined in: PPTX slides 82–83 sit between slide 81 (03-05 content) and slide 84 (03-06's divider), but their content (a "plastic/garbage island" video interstitial, item mislabeled "01-012") matches component 03-02's theme and IS implemented there (`methodica-math-percent-03-02/index.html`, text "על אי הזבל כבר שמעתם?" and an embedded `assets/images/plastic-island-comic.html`).

**SCRIPT CHECK:** flag to the production team to confirm these two slides weren't accidentally moved during PPTX editing.

---

# Per-component audit

## methodica-math-percent-03-01

Scope covered: PPTX slides 3–43 (items 03-01-001 .. 03-01-005) against `methodica-math-percent-03-01/index.html` (3181 lines), `script.js` (4969 lines), `styles.css` (8655 lines), `index_dev.html` (124 lines), and `assets/images/`. Repo screens in scope: `s0`–`s33` (data-screen 0–27, the "split build" range enforced by `SPLIT_FIRST/SPLIT_LAST` in script.js).

`index_dev.html` is a standalone dev-only screen-navigator harness (loads `index.html` in an iframe with prev/next controls). No student-facing content of its own; not compared screen-by-screen.

Per the shared briefing: HTML comments citing "PPTX slide NN" throughout this file are confirmed stale — all comparisons below use the actual slide content in the script, not those comments.

### Screen s0 — בחירת דמות (character selection)
Script slide(s): 4 | Repo: index.html:90-138, script.js:843-865 | Item: 03-01-001 | Type: TwoOptionSelection | STATUS: MATCH
Content/Interaction/Continue gating/Production notes: PASS. Asset: PASS (char-1.png/char-2.png present).

### Screen s1 — הצגת הדמות (battery/phone hook intro)
Script slide(s): 5 | Repo: index.html:143-172, script.js:870-872,91-97 | Item: 03-01-001 | Type: TransitionScreen | STATUS: MATCH
Content: PASS — heading/sub/bubble verbatim. Asset: PASS (video pose `phone` matches "טלפון נייד ביד"). Continue/Back: PASS.

### Screen s2 — Hook Question: לכמה זמן תספיק הסוללה?
Script slide(s): 6 | Repo: index.html:178-296, script.js:877-949 | Item: 03-01-001 | Type: SingleChoiceQuestion | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT/LOGIC | LOW | Fixed bubble "לא לדאוג, לתשובה נגיע בהמשך היחידה." regardless of answer | `advanceFromS2()` builds text via a helper and assigns it to a **local throwaway object**, never the DOM — dead/garbled (mojibake) code path; visible bubble is the static HTML text, which does match script | REMOVE dead code (script.js:900-907); no visible effect today | slide 6 / script.js:900-907 |

Content: PASS. Correct answer: N/A (deferred by script). Attempts: PASS. Continue gating/Back: PASS. Asset: PASS (Hook_charge phone.png, alt verbatim). Production notes: PASS.

### Screen s3 — הקשרים מהיום-יום (daily-life cards)
Script slide(s): 7 | Repo: index.html:301-411 | Item: 03-01-001 | STATUS: SCRIPT CHECK

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| SCRIPT CHECK | LOW | Card 3 "גיימינג" uses image `Hook_when_3`, alt: "מסך לוח מחוונים של רשת חברתית... מספר עוקבים 230,000 וירידה של 95%" — describes a social-media dashboard, not gaming | Repo faithfully copies this mismatched alt-text under "גיימינג" | Confirm with script author whether card 3's asset was meant to be a gaming screenshot | slide 7 / index.html:379-388 |

Content: PASS (titles verbatim). Continue/Back: PASS. Asset: PASS for cards 1-2; card 3 issue is script-side.

### Screen s4 — "היום נלמד..." transition
Script slide(s): 8 | Repo: index.html:416-446, script.js:961-967 | Item: 03-01-001 | Type: TransitionScreen | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | LOW | Heading: "היום נלמד איך למצוא את השלם (100%) כשנתון רק חלק ממנו" | "היום נלמד איך מוצאים את השלם (100%) מתוך החלק." — paraphrased | CHANGE or confirm acceptable | slide 8 / index.html:419-422 |
| CONTENT | LOW | Bubble: "זוכרים את טבלת הפרופורציה ומשוואת הפרופורציה? גם היום נשתמש בה!" | "זוכרים פרופורציה? בואו נראה איך עושים את זה באמצעותה!" — paraphrased | CHANGE or confirm acceptable | slide 8 / index.html:437-441 |

Content: FAIL (meaning preserved, wording not verbatim). Continue/Back/Asset/Production notes: PASS.

### Screen s5 — בחירת שיטת למידה
Script slide(s): 9 | Repo: index.html:452-535, script.js:1022-1045 | Item: 03-01-002 | Type: TwoOptionSelection | STATUS: MATCH
Content: PASS (subtitle "בחרו איך תרצו ללמוד:" verbatim; card labels match). Continue gating/Back/Asset/Production notes: PASS.

### Screen s6a — VideoJourneyScreen
Script slide(s): 10–11 | Repo: index.html:542-844, script.js:1012-1278 | Item: 03-01-002 | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | MEDIUM | If not all videos watched, "הבועית של הדמות משתנה **לאדום** עם הטקסט 'רגע, מה עם יתר הסרטונים? **לא חובה אבל כדאי לצפות בהם.**'" | Bubble text truncated to "רגע, מה עם יתר הסרטונים?" (missing second sentence); no color change exists anywhere in CSS | CHANGE: restore full text + add red-bubble treatment | slide 10 / script.js:1136-1143,1185-1190 |
| LOGIC | LOW | Warning condition implied as "if not all watched" | Fires as soon as ANY video opens (`s6aStarted`), never reverts | SCRIPT CHECK: confirm exact trigger timing | slide 10 / script.js:1177-1190 |
| LOGIC | LOW | "לאחר לחיצה על סרטון המספר שלו נצבע בירוק" (after clicking, turns green) | Repo marks watched only on YouTube `ENDED`, not on click | SCRIPT CHECK: confirm click vs completion; CHANGE if click-triggered is intended | slide 10 / script.js:1177-1214,1244-1262 |

Content: FAIL (bubble truncated). Interaction: PASS (no click-order restriction, matches script). Continue gating: PASS (always active, matches script). Back: PASS. Asset: PASS. Production notes: FAIL.

### Screen s6b — CarouselLearningScreen
Script slide(s): 15–23 | Repo: index.html:851-978, script.js:1284-1605 | Item: 03-01-002 | STATUS: MATCH
Content: PASS (9-step data mirrors slides 15-23 closely; numbers 50/20%/100%/250 match). Navigation: PASS — matches script's exact carousel rules (first-click-right-only, both arrows after, right disabled at end, back-inside-carousel except from first step — script.js:677-688 mirrors script slide 15 NOTE precisely). Continue gating/Back/Production notes: PASS.

### Screen s7 — GuidedPracticeScreen (battery table + formula)
Script slide(s): 24–25 | Repo: index.html:984-1216, script.js:1606-2086 | Item: 03-01-003 | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | LOW | Bubble: "נראה לי שכדאי להחליף סוללה..." | "כדאי להחליף סוללה..." (missing "נראה לי ש") | CHANGE | slide 25 / index.html:1174 |
| ADD (repo-only) | LOW | No reveal-toggle mechanic described in slides 24-25 | Repo adds "רוצים לראות את הפתרון הנכון?" reveal toggle after 2nd wrong attempt | Flag as repo-only addition (S8 pilot) | slide 24-25 / script.js:1812-1839,1979-1998 |

Content: PASS otherwise (fixed "%" and "?" as plain text, matches script). Correct answer: PASS (15%/30/100%; formula 200 min). Attempts: PASS ("צדקתי?" active only after all 3 cells filled, per-cell partial marking). Hint: PASS. Feedback: PASS (verbatim explanation paragraphs). Continue gating: PASS. Back: PASS. Asset: FAIL — `Step-by-step_1.png`/`Step-by-step_2.png` exist but referenced only inside HTML-commented-out blocks (index.html:995-999,1096-1100), unused. Production notes: PASS (live numbers-only validation with exact message "יש להזין מספרים בלבד.").

### Screen s8 — "עוד מעט נתחיל לתרגל" transition
Script slide(s): 26 | Repo: index.html:1223-1260, script.js:2095-2111 | Item: 03-01-004 | STATUS: MATCH
Content: PASS (verbatim). Continue gating/Back: PASS. Asset: PASS (togther.mp4; repo's own comment already flags substituting a generic character image for a missing "notebook/pencil" asset — pre-acknowledged, not new). Production notes: PASS.

### Screens s16–s29 — Guided voting-practice sequence
Script slide(s): 27–40 | Repo: index.html:1265-2472, script.js:2113-2207 | Item: 03-01-004 | STATUS: CHANGES REQUIRED (1 CRITICAL, 1 HIGH)

- **s16** (slide 27): MATCH — problem/question/substep verbatim.
- **s17** (slide 28): MATCH — pie-chart explanation verbatim (see cross-cutting asset finding below).
- **s18** (slide 29) — Yes/No: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| LOGIC | HIGH | "כאן ספציפית **אין חיווי כי אין תשובה נכונה**" | `s18Answer()` always reveals the checkmark (physically only inside the "כן" button) regardless of which button was clicked, implying "כן" is always correct | CHANGE: remove always-shown checkmark; neither answer should be marked correct/incorrect | slide 29 / script.js:2140-2152, index.html:1408-1428 |

- **s19** (slide 30): MATCH — 20%/30%/25% figures verbatim.
- **s20** (slide 31): MATCH — correct options ("חיסור" + "משולב חיבור וחיסור") consistent with script's two equivalent formulas shown on s21.
- **s21** (slide 32): MATCH — correct answer 25, consistent with s22.
- **s22** (slide 33): MATCH — formula and text verbatim.
- **s23** (slide 34): MATCH — correct answer 25, consistent with slide 35.
- **s24** (slide 35): MATCH — table 40/25%, ?/100% verbatim.
- **s25** (slide 36): MATCH — text verbatim.
- **s26** (slide 36 cont.) — CHANGES REQUIRED:

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT/LOGIC | CRITICAL | Correct divisor is **25%** (established on s24/slide 35, confirmed slide 33); `(100×40)/25=160` | Displayed formula divides by 20% instead of 25% — **and** the shown arithmetic is wrong on its face (100×40÷20=200, not 160) | CHANGE: fix denominator to 25% | slide 35-36 / index.html:2186,2189 |

- **s27** (slide 38): MATCH — correct answer "30 ∙ 160" confirmed by s28.
- **s28** (slide 38 cont.): MATCH — `(30×160)/100=48` verbatim/correct.
- **s29** (slide 40): MATCH — estimation text and bubble verbatim.

### Cross-cutting ASSET finding — s17/s18/s19/s20 pie chart
Script slide(s): 28–30 | Repo: index.html:1327,1386,1471-1496,1549 | Item: 03-01-004

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| ASSET | MEDIUM | Named image "Step-by-step_1", alt: "תרשים עוגה המחולק לארבעה חלקים... 25%, 30% ו-20%" (repeated slides 28-30) | `Step-by-step_1.png` exists in assets/images/ but unused here; pie is a CSS `<div>` marked `aria-hidden="true"` with no text alternative | CHANGE: use the named image w/ script alt-text, or give the CSS pie an equivalent accessible description | slides 28-30 / index.html:1327,1386,1471,1549 |

### Screen s30 — "מה נשאר לנו בראש?" transition + countdown
Script slide(s): 41 | Repo: index.html:2477-2508, script.js:2329-2342 | STATUS: MATCH — text verbatim, gating/back/production notes PASS.

### Screen s31 — ValueInputQuestion: "מה אחוז הארטיקים בטעם וניל?"
Script slide(s): 42 | Repo: index.html:2515-2637, script.js:2348-2428 | Item: 03-01-005 | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | HIGH | Script's correct-answer feedback is the **full derivation** — the script shows this same full text on both success and final-failure paths, differing only in header | Repo's success branch shows only "כל הכבוד! התשובה הנכונה היא 20%." — the full derivation appears only in the incorrect-final branch | CHANGE: success feedback should include the same full derivation the script specifies | slide 42 / script.js:2387-2397 vs 2405-2423 |
| PRODUCTION NOTE | MEDIUM | Unit-wide: numbers-only input + explicit "יש להזין מספרים בלבד." error message | `s31InputChanged()` performs no live filtering and shows no validation message | ADD: live filtering + message, matching s7's pattern | slide 42 / script.js:2370-2384 vs 1730-1739 |

Correct answer: PASS (20%). Attempts: PASS (2 attempts). Hint: PASS (verbatim). Incorrect feedback: PASS. Continue gating: PASS. Asset: PASS.

### Screen s32 — ValueInputQuestion: "כמה ארטיקים יש בגלידריה?"
Script slide(s): 43 | Repo: index.html:2644-2769, script.js:2434-2539 | Item: 03-01-005 | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| PRODUCTION NOTE | MEDIUM | Same unit-wide numbers-only + error-message requirement | `s32InputChanged()` performs no live filtering, no validation message | ADD: matching s7's pattern | slide 43 / script.js:2452-2461 |

Content: PASS ("ארטיקים" fixed suffix, per script). Correct answer: PASS (400 — consistent with 20%→80 given data). Attempts/Hint/Continue gating/Asset: PASS.

### Screen s33 — "סיימנו את שלב הלימוד..." transition + countdown
No script slide available in the assigned range (3–43) — noted only for completeness; content leads into `s34` (component 02 territory).

### Component checklist
Screens/states in script: 28 (s0–s32; s33 falls just past the assigned chunk)
Screens/states in repo: 28 in-scope (s0–s33) + 44 empty stub sections (s34–s77, out of scope)
Fully matching: ~17 | Needing changes: ~11
ADD: 2 | CHANGE: 10 | REMOVE: 2 | LOGIC: 3 | ASSET: 1 | CONTENT: 6 | SCRIPT CHECK: 3
CRITICAL: 1 | HIGH: 2 | MEDIUM: 4 | LOW: 6

### Repo content not mapped to script (this component)
- `script.js` retains full live functions for screens s34–s77 (later components) while `index.html` has only ~44 empty comment stubs for them — unreachable (`goTo()` bounded 0–27), dead weight from before the project was split into per-folder components.
- `Step-by-step_1.png`/`Step-by-step_2.png` referenced only inside commented-out `guided-visual-panel` blocks in s7 (index.html:995-999, 1096-1100) — fully unused in the live DOM.
- `toggleHotspot()`/`hideAllHotspots()`/`.info-hotspot-wrapper` in script.js:969-989 has no corresponding markup anywhere in s0–s33 — leftover from the pre-split monolith.
- s7's reveal-toggle UX ("S8 pilot") is a repo-side addition not called for by the given script text.

### Script ambiguities found (this component)
- Slide 7's "גיימינג" card image (`Hook_when_3`) has alt-text describing a social-media dashboard, not gaming content — script-side mismatch, faithfully reproduced by repo.
- Slides 38–39 use "כמות סוכריות" (candy count) in table headers where slides 35–37 of the same voting problem consistently use "כמות הצבעות" (vote count) — apparent leftover from an earlier "candy" version of the exercise; repo faithfully mirrors it.
- Slide 10's NOTE is ambiguous on exact trigger timing for the video-journey's green-checkmark ("on click" vs "on completion") and red-bubble warning.

**Summary:** 28 in-scope screens covered against script slides 3–43. Worst finding: a CRITICAL math error on screen s26 (wrong percentage used as divisor, and the arithmetic shown is wrong even at face value). Second-worst: a HIGH-severity logic violation on s18 (the script explicitly says no correctness indication should appear, but the repo always shows a checkmark), and a HIGH content gap on s31 (the full derivation is misplaced onto the wrong feedback branch).

---

## methodica-math-percent-03-02

### Structural note
`methodica-math-percent-03-02/script.js` declares itself as a **"SPLIT BUILD — screens S33–S41 only (original data-screen 27–35)"** (`SPLIT_FIRST=27`, `SPLIT_LAST=35`, `TOTAL_SCREENS=9`). `goTo(n)` hard-refuses `n < SPLIT_FIRST || n > SPLIT_LAST`. `index.html` contains exactly 9 real `<section class="screen"...>` elements (`s33`–`s41`); everything else is either an empty comment placeholder or dead JS. Maps 1:1 onto slides 44–54 (→ s33–s39) and slides 82–83 (→ s40–s41).

### Shared intro (s0–s5) — checklist line
CONFIRMED empty stubs (lines 87–249) — no `<section>` markup underneath any of them. `window.lomdaState.selectedCharacter` initializes to `null`, no persistence mechanism exists. SCRIPT CHECK: unresolved whether intentional (see Cross-unit #3).

### Screen s33 — Transition to standard practice
Script slide(s): 45 | Repo: `index.html:255-284`, `script.js:2557-2593` | Type: TransitionScreen | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | LOW | "סיימנו את שלב הלימוד, **נעבור לתרגול הראשון. יש בו**" / "6 שאלות" / "צריך לענות נכון על 4 שאלות **לפחות**." | "...**ונענה על**" / "6 שאלות" / "...4 שאלות **(66%)** לפחות." | CHANGE: restore "יש בו" phrasing; confirm the added "(66%)" is approved | slide 45 / index.html:257-261 |
| CONTENT | MEDIUM | Slide has a separate label shape "[B]תרגול סטנדרטי" | No such heading/label text exists in `#s33` | ADD: "תרגול סטנדרטי" label text | slide 45 / index.html:255-283 |

Content: FAIL · Continue gating: PASS · Back: PASS · Asset: PASS · Production notes: PASS

### Screen s34 — ValueInputQuestion 1/6 ("מצאו את השלם: 75%=150")
Script slide(s): 46 | Repo: `index.html:291-447`, `script.js:2637-2731` | Item: 03-01-006 (mislabeled) | Type: ValueInputQuestion | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | MEDIUM | Hint: "...בטבלת הפרופורציה...מה האחוז הנתון...עכשיו היעזרו בטבלת הפרופורציה!" | "בפרופורציה...בחרתם בטבלת ההמרה...מה האחוז החלקי...בטבלת ההמרה" | CHANGE: restore "טבלת הפרופורציה" / "האחוז הנתון" | slide 46 / index.html:434-439 |

Content: PASS · Correct answer: PASS (200) · Attempts: PASS · Hint: FAIL · Continue gating: PASS · Back: PASS · Asset: PASS · Production notes: PASS

### Screen s35 — ValueInputQuestion 2/6 ("פיצרייה פלורנטינה — 22=50%")
Script slide(s): 47 | Repo: `index.html:454-609`, `script.js:2739-2852` | Item: ...-007 | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | MEDIUM | Hint uses "טבלת הפרופורציה" / "האחוז הנתון" consistently | Repo uses "טבלת הערך המשולש" (a third, different term) + "האחוז החלקי" | CHANGE: standardize on script's "טבלת הפרופורציה" | slide 47 / index.html:596-602 |
| ASSET | LOW | alt-text: "מסך הזמנות דיגיטלי התלוי על קיר בפיצרייה..." | `alt=""` (empty) on `standard_2.png` | ADD: apply script's alt-text | slide 47 / index.html:533-534,541 |

Content: PASS · Correct answer: PASS (44) · Attempts: PASS · Hint: FAIL · Asset: FAIL (alt-text) · Production notes: PASS

### Screen s36 — ValueInputQuestion 3/6 ("מסיבת סוף שנה — 1300₪=65%")
Script slide(s): 48 | Repo: `index.html:616-767`, `script.js:2861-2970` | Item: ...-008 | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT/LOGIC | **CRITICAL** | Correct-answer feedback should explain 1300₪=65%→2,000₪ | Both "correct" and "final incorrect" feedback show an **unrelated calculation**: `80·100%/20%=400` labeled "ארטיקים" (popsicles) — belongs to a different question entirely. Markup also has duplicate unclosed tags | CHANGE: replace with the correct 1300/65→2,000 working in both branches; fix broken markup | slide 48 / script.js:2935-2940 & 2959-2964 |
| CONTENT | MEDIUM | Hint: "...האחוז הנתון...עכשיו הציבו בטבלת הפרופורציה!" | "...האחוז החלקי...עכשיו הציבו בטבלה!" (drops "הפרופורציה" entirely) | CHANGE: restore wording | slide 48 / index.html:756-761 |

Content: PASS · Correct answer: PASS (2,000, comma-tolerant) · Attempts: PASS · Hint: FAIL · Correct feedback: **FAIL CRITICAL** · Incorrect feedback: **FAIL CRITICAL** · Continue gating: PASS · Back: PASS · Production notes: PASS

### Screen s37 — ValueInputQuestion 4/6, two phases (pie sector %, then area)
Script slide(s): 49–50 | Repo: `index.html:778-976`, `script.js:2986-3227` | Item: ...-009 | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | MEDIUM | Phase B hint: "...האחוז הנתון...בטבלת הפרופורציה!" | "...האחוז החלקי...בטבלה!" | CHANGE: restore wording | slide 50 / index.html:961-969 |

Content: PASS · Correct answer: PASS (15%, then 300) · Attempts: PASS · Hint: PASS for Phase A, FAIL for Phase B · Asset: PASS (`standard_4_pie-chart-widget.html` embedded exactly per NOTE) · Production notes: PASS

### Screen s38 — ValueInputQuestion 5/6 (two-cell table — "מרום" volunteers)
Script slide(s): 51 | Repo: `index.html:983-1152`, `script.js:3261-3448` | Item: ...-010 | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | MEDIUM | Hint: "...האחוז הנתון...העזרו בטבלת הפרופורציה!" | "...האחוז החלקי...היעזרו בטבלה!" | CHANGE: restore wording | slide 51 / index.html:1137-1142 |

Content: PASS · Correct answer: PASS (25% and 18, both required) · Attempts: PASS · Hint: FAIL · Partial feedback: **PASS** — NOTE's two-field marking requirement correctly implemented (script.js:3312, 3384-3387) · Production notes: PASS

### Screen s39 — SingleChoiceQuestionImage 6/6, three sections (cottage cheese, שאלה אוריינית)
Script slide(s): 52–54 | Repo: `index.html:1164-1469`, `script.js:3457-3725` | Item: ...-011 | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo | Required action | Evidence |
|---|---|---|---|---|---|
| LOGIC | **CRITICAL** | Slide 52 text: "שימו לב – **הפעם אין רמז**." No hint shape on slides 52-54. | Section א wired identically to ב/ג: hint button appears after 1 wrong attempt, with real hint text supplied | REMOVE: suppress hint for section א specifically | slide 52 / script.js:3462-3469, 3648-3649 |
| ASSET | **HIGH** | Slide 54 NOTE: image "standard_6_c", alt: "...9%... שומן..." | `S39_SECTIONS[2].img` reuses section ב's image + alt-text; `standard_6_c.png` does not exist anywhere in `assets/images/` | ADD: obtain `standard_6_c.png` + correct alt-text | slide 54 / script.js:3499-3501 |

Content: PASS (all 3 sections match slides 52-54 exactly) · Correct answer: PASS · Hint: **FAIL CRITICAL for section א**; PASS for ב/ג · Asset: **FAIL** (section ג)

### Screen s40 — TransitionScreen ("who uses proportion in real life?" / plastic-island intro)
Script slide(s): 82 *(physically out of sequence)* | Repo: `index.html:1479-1505` | Item: ...-012 | STATUS: **MATCH**

Content: PASS — exact text that confirmed this slide pair belongs to 03-02. Continue gating/Back/Asset/Production notes: PASS (NOTE "הדמות שנבחרה עם שקית אשפה ביד" correctly maps to `Yellow_trash.mp4`/`Green_trash.mp4`).

### Screen s41 — VideoWatchAndContinue embed (plastic-island comic)
Script slide(s): 83 *(physically out of sequence)* | Repo: `index.html:1508-1524` | Item: ...-012 | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo | Required action | Evidence |
|---|---|---|---|---|---|
| LOGIC | **CRITICAL** | NOTE requires a "reset unit" button + Yes/No confirmation modal **on this exact screen** | `#s41` has only heading + iframe + plain "המשך" button. No reset button/modal anywhere. A `unitReset()` function exists but is never referenced from any HTML element | ADD: wire the reset-unit button + confirmation modal on `#s41` to the existing orphaned `unitReset()` | slide 83 / index.html:1508-1524; script.js:4546-4552 |
| LOGIC | **CRITICAL** | (internal consistency) | `onclick="goTo(36)"` on the Continue button — but `goTo()` refuses `n>SPLIT_LAST(35)`. Clicking "המשך" on this, the LAST screen of the split, is a **silent no-op** | CHANGE: point Continue at the real next destination, or replace with an explicit completion/hand-off action | index.html:1520-1522; script.js:16-17,672 |
| CONTENT | LOW | No heading text on slide 83 besides "חזרה" and item tag | `<h1>הרחבה — אי הפלסטיק</h1>` added, not in script | CHANGE/confirm: verify approved addition | slide 83 / index.html:1509 |

Continue gating: **FAIL CRITICAL** (destination broken) · Production notes: **FAIL CRITICAL** (reset feature entirely missing)

### Component checklist
Screens/states in script: 9 | Screens/states in repo: 9 (exact 1:1)
Fully matching: 1 (s40) | Needing changes: 8
ADD: 3 | CHANGE: 10 | REMOVE: 1 | LOGIC: 4 | ASSET: 2 | CONTENT: 9 | SCRIPT CHECK: 3
CRITICAL: 5 | HIGH: 1 | MEDIUM: 8 | LOW: 4

### Repo content not mapped to script (this component)
- Empty comment placeholders for "SCREEN 0"–"SCREEN 32" and "s42"–"s77" citing stale PPTX slide numbers that don't exist in the current script.
- `script.js` dead logic: full bodies for s0–s32, a `VQ` config with entries for s42–s77, and standalone `s56Init`/`s56Pick`/`s56Continue`/`peakFinish`/`unitReset` with no HTML counterpart in this file (`unitReset` is notable — it's exactly the feature slide 83 requires on `#s41` but is never wired there).
- Orphaned assets reachable only from dead code: `char-1.png`, `char-2.png`, `warmup.png`, `Step-by-step_1.png`, several bubble/icon SVGs, most `Yellow_*`/`Green_*` videos other than `*_trash.mp4`.

### Script ambiguities found (this component)
- Slide 83's unit-reset note is attached to content confirmed to belong to 03-02, yet it isn't the last screen of the unit (mid-deck) nor even the last functional screen of this component's own split (Continue is broken). See Cross-unit #5.
- Script explicitly says "no hint" for slide 52 (s39 section א) but is silent on sections ב/ג of the same item — repo gives all three sections a hint uniformly.

**Worst severity: CRITICAL (5 instances)** — most serious: s36's feedback shows a completely unrelated calculation instead of the actual working; s39 section א shows a hint despite an explicit script instruction that none should exist; and s41 is missing the required unit-reset feature entirely while its own Continue button is a dead no-op.

---

## methodica-math-percent-03-03

### Structural note
`index_dev.html`'s own title/dev-bar range and `script.js:16-19` (`SPLIT_FIRST=36; SPLIT_LAST=48`) plus the `goTo()` guard confirm this is a deliberate split build rendering only data-screens 36–48 (s42–s54). Screens 0–41 and 55–77 exist only as dead comment banners plus orphaned JS — including a fully authored `VQ` config for s58–s75 (component 04's advanced/peak questions) with no matching HTML at all in this file. None of it is reachable.

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| SCRIPT CHECK | MEDIUM | N/A — repo architecture question | s0–s41 and s55–s77 are empty comment stubs; `script.js` still carries full dead logic/config for all of them | Confirm with the team whether this split-build pattern is intended production architecture or whether dead code should be trimmed per component before delivery | index.html:87-234,1642-1733; script.js:16-19,157-847,3927-4150 |

### Screen s42 — warmup/launch screen before basic practice
Script slide(s): 56 | Repo: `index.html:330-365` | Type: TransitionScreen | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | LOW | "...ענו נכון על 4 שאלות ומעלה **כדי להתקדם**." (no percentage) | "...ענו נכון על 4 שאלות ומעלה **(80%)** כדי להתקדם." — repo adds "(80%)" | CHANGE: remove or confirm addition | slide 56 / index.html:337 |
| CONTENT | LOW | Slide 56 has a text box "[B]תרגול בסיסי" (section label) | No such text anywhere in repo | ADD: render label, or confirm intentional drop | slide 56 / index.html:330-364 |
| CONTENT | LOW | Slide 56 has no dialogue text (only "מקום לגיף" placeholder) | Video + speech bubble "הכל טוב, קחו רגע לנשום ובואו נמשיך יחד!" with no script source | SCRIPT CHECK: confirm source of this line | slide 56 / index.html:355-359 |

Content: FAIL · Continue gating: PASS · Back: PASS · Asset: PASS (video substituted for gif placeholder) · Production notes: PASS

### Screen s43 — Basic Q1 (Noam / video views)
Script slide(s): 57 | Repo: `index.html:368-484` | Item: 03-02-001 (mislabeled) | Type: ValueInputQuestion | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | LOW | Hint: "מהו **האחוז הנתון**?" / "עכשיו היעזרו **בטבלת הפרופורציה**!" | "מהו **האחוז החלקי**?" / "עכשיו היעזרו **בטבלה**!" | CHANGE | slide 57 / index.html:475-476 |

Content: PASS · Correct answer: PASS (500) · Attempts: PASS · Hint: FAIL · Correct/Incorrect feedback: PASS · Asset: PASS (`basic_1.png`, alt-text verbatim) · Production notes: PASS ("צפיות" fixed suffix present)

### Screen s44 — Basic Q2 (Gal / stickers)
Script slide(s): 58 | Repo: `index.html:487-595` | Item: 03-02-002 | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | LOW | "וחישבה **שזו** 35%..." | "וחישבה **שהיא השלימה** 35%..." | CHANGE | slide 58 / index.html:497-498 |
| CONTENT | LOW | Hint: "מהו **האחוז הנתון**?" / "...**בטבלת הפרופורציה**!" | "מהו **האחוז החלקי הנתון**?" / "...**בטבלה**!" | CHANGE | slide 58 / index.html:586-587 |

Content: FAIL · Correct answer: PASS (120) · Attempts: PASS · Hint: FAIL · Asset: PASS (`basic_2.png`, zoom button satisfies "זכוכית מגדלת" note) · Production notes: PASS ("מדבקות" fixed suffix)

### Screen s45 — Basic Q3 (Nir / magnets)
Script slide(s): 59 | Repo: `index.html:598-707` | Item: 03-02-003 | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | LOW | Hint: "...**בטבלת הפרופורציה**!" | "...**בטבלה**!" | CHANGE | slide 59 / index.html:699 |

Content: PASS · Correct answer: PASS (300) · Attempts: PASS · Hint: FAIL · Asset: PASS (`basic_3.png`) · Production notes: PASS ("מגנטים" fixed suffix)

### Screen s46 — Basic Q4 (Earth Day / bottles)
Script slide(s): 60 | Repo: `index.html:710-820` | Item: 03-02-004 | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | LOW | Hint: "...**בטבלת הפרופורציה**!" | "...**בטבלה**!" | CHANGE | slide 60 / index.html:812 |

Content: PASS · Correct answer: PASS (400) · Attempts: PASS · Hint: FAIL · Asset: PASS (`basic_4.png`) · Production notes: PASS ("בקבוקים" fixed suffix)

### Screen s47 — Basic Q5א (Ron & Yael / percent remaining)
Script slide(s): 61 | Repo: `index.html:823-952` | Item: 03-02-005 (§א) | Type: SingleChoiceQuestionImage | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | LOW | Slide 61 has a category tag "שאלה אוריינית" | Not rendered anywhere on `#s47` | ADD or confirm intentional omission | slide 61 / index.html:823-952 |
| PRODUCTION NOTES | LOW | NOTE: "גלילה לאורך כל סעיפי השאלה" | Not verifiable from static code | SCRIPT CHECK: verify live in browser | slide 61 / N/A |

Content: PASS · Correct answer: PASS (index 2 = 40%) · Hint: PASS (verbatim) · Asset: PASS (`basic_5.png`) · Production notes: FAIL (scroll unverified)

### Screen s48 — Basic Q5ב (Ron & Yael / total exercises)
Script slide(s): 62 | Repo: `index.html:955-1064` | Item: 03-02-005 (§ב) | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | LOW | Hint: "...**בטבלת הפרופורציה**!" | "...**בטבלה**!" | CHANGE | slide 62 / index.html:1056 |

Content: PASS · Correct answer: PASS (75) · Hint: FAIL · Asset: PASS (reuses `basic_5.png`) · Production notes: PASS ("תרגילים" fixed suffix)

### Screen s49 — Basic Q5ג (self-check yes/no)
Script slide(s): 63 | Repo: `index.html:1067-1181` | Item: 03-02-005 (§ג) | STATUS: MATCH
Content: PASS · Correct answer: PASS (index 0 = "כן") · Hint: PASS (verbatim) · Correct feedback: PASS (75·60%=45, 45+30=75) · Continue gating/Back/Asset/Production notes: PASS

### Screen s50 — TransitionScreen before Standard-B set
Script slide(s): 64 | Repo: `index.html:1184-1209` | Type: TransitionScreen | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | MEDIUM | Slide 64: "**יופי של עבודה!** [B]הנה עוד 2 תרגילים ברמת קושי גבוהה יותר." | Heading is only "הנה עוד 2 תרגילים ברמת קושי גבוהה יותר." — praise line missing | ADD: restore "יופי של עבודה!" | slide 64 / index.html:1185 |

Content: FAIL · Continue gating/Back/Asset: PASS · Production notes: PASS (speech bubble "ברור לי שתצליחו!" matches verbatim)

### Screen s51 — Standard B Q1א (hair color / percent brown)
Script slide(s): 65 | Repo: `index.html:1211-1296` | Item: 03-02-006 (§א) | Type: ValueInputQuestion + pie-chart iframe | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | LOW | "...התלמידים על **(תורשה)** גנטיקה." | "...התלמידים על גנטיקה." — "(תורשה)" dropped | ADD: restore parenthetical | slide 65 / index.html:1221 |
| PRODUCTION NOTES | LOW | NOTE: "גלילה לאורך כל סעיפי השאלה" | Not verifiable from static code | SCRIPT CHECK: verify live | slide 65 / N/A |

Content: FAIL · Correct answer: PASS (24%) · Hint: PASS (verbatim) · Asset: PASS (widget iframe matches note) · Production notes: FAIL (scroll unverified)

### Screen s52 — Standard B Q1ב (circle area)
Script slide(s): 66 | Repo: `index.html:1298-1403` | Item: 03-02-006 (§ב) | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | LOW | Hint: "...**בטבלת הפרופורציה**!" | "...**בטבלה**!" | CHANGE | slide 66 / index.html:1395 |

Content: PASS · Correct answer: PASS (index 3 = 208.3 סמ"ר) · Hint: FAIL · Asset: PASS (separate scaled widget) · Production notes: PASS

### Screen s53 — Standard B Q2א (Purim / packages needed)
Script slide(s): 67 | Repo: `index.html:1406-1516` | Item: 03-02-007 (§א) | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| FEEDBACK / CONTENT | MEDIUM | Incorrect-panel title (explicit, on-slide): "**התשובה אינה נכונה. בואו נסביר.**" | `finalWrong.title: 'זו טעות, בואו נבין יחד:'` — entirely different title | CHANGE: use exact script title | slide 67 / script.js:3912 |
| FEEDBACK / CONTENT | LOW | Body closing line: "**נחבר את** 40 משלוחי המנות שכבר נאספו **ונוסיף** 10: עליהם לאסוף 50 משלוחי מנות בסך הכל." | Paraphrased differently | CHANGE: align to exact phrasing | slide 67 / script.js:3908-3916 |
| CONTENT | LOW | Hint: "...או **בהצבה בטבלת הפרופורציה**." | "...או **בשיטת הפרופורציה**." | CHANGE | slide 67 / index.html:1508 |

Content: PASS · Correct answer: PASS (50) · Hint: FAIL · Correct feedback: PASS (title matches; body paraphrase flagged) · Incorrect feedback: FAIL (title mismatch) · Asset: PASS (`standard2_2.png`) · Production notes: PASS ("משלוחי מנות" fixed suffix)

### Screen s54 — Standard B Q2ב (Purim / ratio)
Script slide(s): 68 | Repo: `index.html:1519-1633` | Item: 03-02-007 (§ב) | STATUS: MATCH
Content: PASS (incl. speech bubble and hint verbatim, including script's own likely-typo "במתמטית" reproduced faithfully) · Correct answer: PASS (index 2 = 1:4) · Hint: PASS · Correct/Incorrect feedback: PASS (verbatim) · Continue gating/Back/Asset: PASS

Note: a fully commented-out "↻ התחל מחדש" reset button (`s54Reset()`) exists at index.html:1618-1620, scoped only to the Standard-B set. Inert, unrelated to the central `unitReset()` finding.

### Component checklist
Screens/states in script: 13 | Screens/states in repo: 13
Fully matching: 2 (s49, s54) | Needing changes: 11
ADD: 4 | CHANGE: 15 | REMOVE: 0 | LOGIC: 0 | ASSET: 0 | CONTENT: 17 | SCRIPT CHECK: 3
CRITICAL: 0 | HIGH: 0 | MEDIUM: 3 | LOW: 16

### Repo content not mapped to script (this component)
- ~40 empty comment-only screen banners (s0–s9, s16–s41, s55–s77) — leftover split-build stubs.
- Orphaned JS: `CHARACTER_SCREEN_REGISTRY`, `resetScreenState()` branches, `advanceFromS0()`–`advanceFromS4()` for the non-existent s0–s41 screens; a fully authored `VQ` config for component 04 (s58–s75) with zero matching HTML in this file.
- Commented-out `s54Reset()` button, inert, no script basis.
- Unreferenced assets: `Trackplay.png`, `play.png`, `path-1.png`, `V_uniq.png`, `X_uniq.png`, several bubble/icon SVGs, `warmup.png`, `Step-by-step_1.png`, `ButtonV.png`, `Icon_hint.svg`.

### Script ambiguities found (this component)
- Slide 57 (s43): "180 לייקים" is later treated as "36% of total views" — mixing likes and views as the same metric. Math is self-consistent (180/0.36=500), repo matches verbatim; flagged for awareness only.
- Slide 68 (s54) hint: "\"במתמטית\" היחס נרשם..." — likely a script typo for "במתמטיקה", reproduced verbatim in the repo.

**Summary:** Covered all 13 screens/states for component 03-03 (s42–s54, script slides 55–68). 0 CRITICAL, 0 HIGH, 3 MEDIUM, 16 LOW severity findings — no correct-answer, scoring, or attempts-logic bugs; issues are mostly minor hint/content wording drift plus two feedback-text mismatches on s53 and one dropped praise line on s50.

---

## methodica-math-percent-03-04

Repo: `index.html` (737 lines), `script.js` (4981 lines), `styles.css` (5560 lines).

**Architecture note:** this folder is a "split build" (`SPLIT_FIRST=49`, `SPLIT_LAST=50`, `TOTAL_SCREENS=2`); `goTo(n)` hard-refuses to leave `[49,50]`. The only live screens are `s55` (data-screen 49) and `s56` (data-screen 50) — everything else in the file is inert by construction.

### Screen s55 — transition/congratulations
Script slide(s): 70 | Repo: `index.html:388-412` | Item: 03-03-001 (mislabeled; true index 03-04) | Type: TransitionScreen (s30 pattern) | STATUS: MATCH

| Category | Severity | Script requirement | Repo implementation | Action | Evidence |
|---|---|---|---|---|---|
| ASSET | LOW | slide 70: "מקום לגיף" (place for a gif) | Looping `<video>` (character pose, MP4) instead of a gif | none — MP4-for-gif is the project-wide convention everywhere | slide 70 / index.html:395-407 |

Content: PASS (all three lines match wording/order exactly). Continue gating: PASS. Back: PASS. Asset: PASS.

### Screen s56 — class survey + "draw conclusions" (Dropdown Question)
Script slide(s): 71, 72 (both share the identical speaker note — "Dropdown Question/Single Paragraph/state 01" — so this is two states of one Figma screen; the repo's merge into one `<section id="s56">` is correct, not a finding).
Repo: `index.html:414-499`, `script.js:4563-4588`, `script.js:4547-4553` (unitReset), `styles.css:5406-5431` | Type: DropdownQuestion/single paragraph, ungraded | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Repo implementation | Action | Evidence |
|---|---|---|---|---|---|
| CONTENT | LOW | Slide 71 para0: "קומו מהכיסא והסתכלו סביב." | Repo prepends "עכשיו " | CHANGE: remove or confirm intentional | slide 71 / index.html:419 |
| CONTENT | LOW | Slide 71 para3: missing a ב before "כיתה" (script typo) | Repo: "...בכיתה יש..." (has the ב) | SCRIPT CHECK: repo looks like a typo-fix; flag to script owner | slide 71 / index.html:427 |
| CONTENT | HIGH | Slide 71 (two paragraphs): use אומדן **only if numbers are convenient**; "ואם לא, היעזרו **בטבלת** הפרופורציה" (otherwise use the proportion table) | Repo collapses to one sentence: "...אומדן, **או** באמצעות פרופורציה" — the conditional and the word "table" are both gone | CHANGE: restore the conditional + "table" wording — changes instructional guidance, not just phrasing | slide 71 / index.html:431-434 |
| CONTENT | LOW | Slide 72 para0 (blue+bold) "עכשיו בואו נסיק מסקנות:" appears **once** | Repo shows it **twice** | CHANGE: duplicated heading not called for by script | slide 72 / index.html:416 and :436 |
| SCRIPT CHECK | — | Slide 72 has two apparent script typos ("השחרות" missing a letter; "בלי" likely should be "בעלי") | Repo already uses what looks like corrected wording | Flag to script owner — don't silently resolve | slide 72 / index.html:436-440 |
| ASSET | MEDIUM | Slide 72 image alt-text: character kneeling in a pleading pose, tied to the nudge-bubble moment | `CHARACTER_SCREEN_REGISTRY.s56` is fixed to `poseKey:'happy'`; no kneeling/pleading pose exists at all | ADD: add the kneeling/pleading asset and swap to it when the bubble fires, or confirm "happy" is an accepted substitute | slide 72 / script.js:176-181, 4581-4588; index.html:471-484 |
| LOGIC | **CRITICAL** | Script slide 83's note requires the reset-unit button to appear **only on the last screen of the unit** | A button "↻ איפוס היחידה" wired to `onclick="unitReset()"` renders on **s56** — this component's 2nd-of-2 screen, with 3 more components still ahead | CHANGE: remove from here; per script this belongs only on the unit's true last screen | slide 83 (given) / index.html:492-494, script.js:4547-4553 |
| CHANGE (naming) | LOW | — | Reset button's CSS class `s54-reset-btn` is inherited from an unrelated, narrower feature (`s54Reset()`, not present in this file) | Cosmetic rename recommended | index.html:492, styles.css:5291,5305 |

Content: FAIL (conditional/table-wording loss, HIGH). Attempts: N/A (ungraded; script NOTE: "הזנת טקסט בלי משוב"). Partial feedback: **PASS** — script NOTE about advancing without data-entry matches `s56Continue()` exactly (first empty-Continue click shows the bubble and blocks; further clicks pass through). Continue gating: **FAIL (informational)** — the "advance" branch calls `goTo(51)`, outside this file's own range, so it silently no-ops standalone; this mirrors the same pattern at every split boundary and is likely intentional cross-file sequencing. Back: PASS. Asset: FAIL (kneeling pose, MEDIUM).

### Component checklist
Screens/states in script: 2 (s55, s56) | Screens/states in repo: 2 implemented + ~75 empty comment-only stub markers
Fully matching: 1 (s55) | Needing changes: 1 (s56)
ADD: 1 | CHANGE: 8 | REMOVE: 2 | LOGIC: 1 | ASSET: 2 | CONTENT: 5 | SCRIPT CHECK: 4
CRITICAL: 1 | HIGH: 1 | MEDIUM: 3 | LOW: 7

### Repo content not mapped to script (this component)
- **Front stubs (screens 0–54, index.html:87-379):** comment-only headers, **no `<section>` markup at all** — confirmed only 2 real `<section>` elements exist in the whole file (s55, s56); `id="s0"` does not exist. Dead leftovers belonging to 03-01/03-02/03-03. Confirmed contiguous split ranges: 03-01=0-27, 03-02=27-35 (overlap at 27), 03-03=36-48, 03-04=49-50, 03-05=51-58.
- **Back stubs (screens 57–77, index.html:501-584):** same pattern — content now lives in 03-05/06/07.
- Net: ~75 of the ~77 original screen markers are inert comments in this 737-line file; only s55/s56 are real.
- `script.js` is NOT trimmed to the split: it still contains `s54Reset()` (targets `#s51`-`#s54`, absent from DOM), `CHARACTER_SCREEN_REGISTRY` entries for a dozen unrelated screens, and matching `resetScreenState()` branches — all orphaned, MEDIUM cleanup candidate.

### Script ambiguities found (this component)
- Slide 83's note requires reset-unit "רק במסך האחרון של היחידה" but sends the learner "לתחילת הרכיב" — mixes unit/component scope (see Cross-unit #5). `unitReset()` returns to this component's own first screen, but its placement on s56 fails "last screen of the unit" under either reading.
- Slide 72 likely has two typos of its own; repo already uses what looks like corrected wording — flagged for script-owner confirmation, not silently endorsed.

**Summary:** 2 real screens audited (s55 MATCH, s56 CHANGES REQUIRED). Worst severity: CRITICAL — the `unitReset()`/"↻ איפוס היחידה" button on s56 violates script slide 83's "last screen of the unit only" requirement. Confirmed the empty-stub pattern extends to the entire front of the file (screens 0–54), not just the back (s57–s77) — only s55 and s56 contain real markup in this 737-line file.

---

## methodica-math-percent-03-05

Repo: `index.html` (1337 lines), `script.js` (4981 lines), `styles.css` (5816 lines), `assets/images/` (42 files).
Script slide range: 73 (component divider) through 81. Slide 74 = transition ("3 advanced questions"), slides 75–81 = 3 items.

### Structural note — screens "s0"–"s56" are dead stubs, not a working intro duplicate
Verified: `grep -n 'id="s0"'` etc. return no matches. `script.js` confirms a deliberate split build: `SPLIT_FIRST=51`/`SPLIT_LAST=58`; `goTo()` hard-guards outside that range. This file only ever renders data-screens 51–58 (s57–s64) — exactly the 8 assigned slides (74–81). `selectedCharacter` initializes to `null` with no persistence read anywhere, so this split file always falls back to the default character.

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| SCRIPT CHECK | MEDIUM | Not specified — script gives no instruction on cross-component state/character persistence | This file is a standalone split-build starting at s57; `selectedCharacter` always initializes `null` → always renders the default character pose | Confirm whether these 7 component files run as fully independent deliverables or as sequential pages of one continuous unit needing explicit handoff | script.js:16-22,326,397-407 |

### Screen s57 (transition — "3 advanced questions")
Script slide(s): 74 | Repo: `index.html:397-413` | Type: TransitionScreen | STATUS: MATCH
Content: PASS. Continue gating: PASS (always enabled → goTo(52)). Back: PASS. Asset: PASS (char-1.png, "thumbsup" pose). Production notes: PASS.

### Screen s58 — Advanced Q1א (furniture price)
Script slide(s): 75 | Repo: `index.html:416-525`; `script.js:3931-3946, 4318-4423` | Item: 04-001 | Type: ValueInputQuestion | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | LOW | Table row uses "x" | Feedback table uses "?" | CHANGE: use "x" | slide 75 / script.js:3936 |
| CONTENT | LOW | Hint: "מהו האחוז הנתון?" / "עכשיו היעזרו בטבלת הפרופורציה!" | "מהו האחוז החלקי הנתון?" / "...בשיטת הפרופורציה!" | CHANGE | slide 75 / index.html:516-517 |
| CONTENT | LOW | Slide 75's feedback placeholder shape is empty in the PPTX | script.js supplies a full worked-solution feedback body | ADD (repo→script) — Repo Content Not Mapped to Script; numbers match, wording has no script source | slide 75 / script.js:3931-3946 |
| PRODUCTION NOTES | MEDIUM | NOTE: "גלילה לאורך כל סעיפי השאלה." (scroll along all sections) | No overflow/scroll rule found in styles.css | CHANGE: verify actual scroll behavior or confirm content always fits | slide 75 NOTE / styles.css:3838-3842 |

Content: FAIL · Correct answer: PASS (25000) · Attempts: PASS · Hint: FAIL · Continue gating: PASS · Back: PASS · Asset: PASS (advanced_1.png, alt-text verbatim) · Production notes: FAIL (scroll note)

### Screen s59 — Advanced Q1ב (per-payment amount)
Script slide(s): 76 | Repo: `index.html:528-635`; `script.js:3947-3964` | Item: 04-001 | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | LOW | Hint: "זכרו שהוריו של איתן **כבר שילמו** מקדמה..." | Word order swapped | CHANGE: match script's order | slide 76 / index.html:627 |
| CONTENT | LOW | Slide 76 feedback placeholder is empty | script.js supplies full worked-solution feedback | ADD (repo→script) — numbers consistent, wording unscripted | slide 76 / script.js:3947-3964 |

Content: FAIL (word order) · Correct answer: PASS (4800) · Hint: FAIL · Asset: PASS (advanced_1_b.png) · Production notes: PASS ("ש"ח" fixed suffix correct)

### Screen s60 — Advanced Q1ג (4 payments — value + dropdown)
Script slide(s): 77 | Repo: `index.html:638-766`; `script.js:3965-3987` | Item: 04-001 | Type: ValueInputQuestion + dropdown (matches NOTE) | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | LOW | Label: "כמה **הם** ישלמו בכל תשלום?" | Repo drops "הם" | CHANGE: restore "הם" | slide 77 / index.html:657 |
| CONTENT | LOW | Slide 77 has no feedback text | script.js supplies full feedback | ADD (repo→script) — numbers consistent, wording unscripted | slide 77 / script.js:3965-3987 |

Content: FAIL (dropped pronoun) · Correct answer: PASS (value 6000 AND dropdown "אותו דבר" both required, consistent with 1,000+4×6,000 = 1,000+5×4,800 = 25,000) · Hint: PASS (verbatim) · Asset: PASS · Production notes: PASS

### Screen s61 — Advanced Q2א (grade-level student count)
Script slide(s): 78 | Repo: `index.html:769-838`; `script.js:3988-4007` | Item: 04-002 | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | LOW | Hint: "מהו האחוז הנתון?" / "...בטבלת הפרופורציה!" | "מה האחוז החלקי?" / "...בשיטת הפרופורציה!" | CHANGE: match script wording | slide 78 / index.html:829-830 |
| CONTENT | LOW | Slide 78 feedback placeholder is empty | script.js supplies full feedback | ADD (repo→script) — number consistent, wording unscripted | slide 78 / script.js:3988-4007 |
| PRODUCTION NOTES | MEDIUM | NOTE: "גלילה לאורך כל הסעיפים" | No scroll/overflow rule found (same gap as s58) | CHANGE: verify scroll behavior or confirm content fits | slide 78 NOTE |

Content: FAIL (hint wording x2) · Correct answer: PASS (250) · Hint: FAIL · Asset: PASS (no image — script has none either) · Production notes: FAIL (scroll note)

### Screen s62 — Advanced Q2ב (students present at exam) — **most significant screen in this component**
Script slide(s): 79 | Repo: `index.html:841-908`; `script.js:4008-4015` | Item: 04-002 | STATUS: CHANGES REQUIRED / SCRIPT CHECK

Slide 79 deliberately shifts to gender-inclusive phrasing partway through the item (slide 78 used masculine-only phrasing; slide 79 switches to "תלמידות תלמידים"/"התלמידות והתלמידים"). The repo's s62 reuses slide 78's masculine-only stem almost verbatim instead of slide 79's actual wording.

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | HIGH | Slide 79 stem uses gender-inclusive "תלמידות תלמידים" / "התלמידות והתלמידים" throughout | Repo reuses slide 78's masculine-only stem, not slide 79's actual wording | CHANGE: replace with slide 79's actual gender-inclusive wording | slide 79 / index.html:849-853 |
| CONTENT | MEDIUM | Hint: "...מתוך סך **התלמידות והתלמידים** נעדרו..." | Repo drops "התלמידות ו" | CHANGE: restore gender-inclusive phrasing | slide 79 / index.html:900 |
| SCRIPT CHECK | MEDIUM | Slide 79 speaker NOTE says "תלמידים" is fixed text — but the slide's own fixed-text shape literally reads "תלמידות ותלמידים" | Repo suffix renders "תלמידים" (matches the NOTE, not the shape's own text) | SCRIPT AMBIGUITY/CONFLICT: NOTE and the slide's own text box disagree; repo made a defensible choice but should be confirmed with the author | index.html:872-873 |
| CONTENT | LOW | Slide 79 feedback placeholder is empty | script.js supplies feedback (250−40=210) | ADD (repo→script) — number consistent, wording unscripted | slide 79 / script.js:4008-4015 |

Content: FAIL (gendered-phrasing drop, HIGH) · Correct answer: PASS (210) · Hint: FAIL (gendered-phrasing drop) · Production notes: SCRIPT CHECK (fixed-suffix conflict)

### Screen s63 — Advanced Q3א (garden ratio)
Script slide(s): 80 | Repo: `index.html:910-1019` (repo's own comment already flags this); `script.js:4016-4023` | Item: 04-003 | STATUS: SCRIPT CHECK

The script itself is internally contradictory here, and the repo developer already noticed and manually resolved it (repo comment: "NOTE: per manual decision, answer = 9:11 and the question asks סככה:גידולים").

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| SCRIPT CHECK | **CRITICAL** | Slide 80's own question text asks for cultivation:shed. But the slide's own answer box shows "9:11" and its own feedback computes shed:cultivation reduced to 9:11 (cultivation:shed reduced would be 11:9, not 9:11) | Repo changes the question wording to match the given 9:11 answer and the script's own feedback math | SCRIPT AMBIGUITY/CONFLICT — quote both: question wording vs. the script's own stated answer/feedback. Repo's fix is math-consistent but is a content CHANGE from the script's literal question that should be confirmed | slide 80 (question) vs slide 80 (feedback + "9:11" answer) / index.html:913,926 |
| CONTENT | MEDIUM | FinalWrong title: "**זו טעות. למדו את הפתרון:**" | Repo: "**זו טעות, שימו לב לפתרון:**" | CHANGE: match script's exact title | slide 80 / script.js:4021 |
| CONTENT | MEDIUM | Correct-feedback body has no repeated "נכון מאוד" | Repo's correct AND finalWrong bodies both insert "**נכון מאוד**," — especially confusing inside the finalWrong body | CHANGE: remove the inserted phrase (at minimum from finalWrong) | slide 80 / script.js:4019-4022 |

Content: FAIL (title + inserted phrase + ratio-order ambiguity) · Correct answer: PASS given repo's manual resolution — but see SCRIPT CHECK · Hint: PASS (verbatim) · Correct feedback: FAIL (extra phrase) · Incorrect feedback: FAIL (title + extra phrase) · Asset: PASS (advanced_3.png)

### Screen s64 — Advanced Q3ב (garden total area)
Script slide(s): 81 | Repo: `index.html:1022-1132`; `script.js:4024-4043` | Item: 04-003 | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | LOW | Table row uses "x" | Feedback table uses "?" | CHANGE: use "x" | slide 81 / script.js:4029 |
| CONTENT | LOW | Slide 81 feedback placeholder is empty | script.js supplies full feedback | ADD (repo→script) — number consistent, wording unscripted | slide 81 / script.js:4024-4043 |
| LOGIC | MEDIUM | Script ends the "3 advanced questions" section at slide 81; nothing specifies the hand-off after this item | `vqSubmit` sets `next: 59` for s64 → `goTo(59)`. Screen s65 has no `<section>` in this file (only an empty stub) and `SPLIT_LAST=58`, so `goTo(59)` silently no-ops | SCRIPT CHECK: confirm the intended hand-off into 03-06 is provided outside this file | script.js:17,674,4026; index.html:1134-1136 |

Content: FAIL (table symbol) · Correct answer: PASS (200) · Hint: PASS (verbatim — this slide already says "שיטת") · Continue gating: FAIL (dead-end, see LOGIC) · Asset: PASS · Production notes: PASS ("מ"ר" fixed suffix correct)

### Component checklist
Screens/states in script: 8 | Screens/states in repo: 8 (s57–s64)
Fully matching: 1 (s57) | Needing changes: 7
ADD: 6 | CHANGE: 11 | REMOVE: 1 | LOGIC: 1 | ASSET: 0 | CONTENT: 14 | SCRIPT CHECK: 4
CRITICAL: 1 | HIGH: 1 | MEDIUM: 8 | LOW: 13

### Repo content not mapped to script (this component)
- Worked-solution feedback text for s58, s59, s60, s61, s62, s64 has no source in the script — the PPTX's own feedback placeholder shapes for these six items are empty (only slide 80/s63 has fully authored feedback text). Numeric answers are internally consistent; narrative wording is the repo's own invention following the standard project-wide pattern.
- `script.js` contains fully-built answer/feedback configs for `s67`–`s70`, `s73`–`s74` ("PEAK question 1/2") with no corresponding `<section>` here — unreachable dead code, likely belonging to 03-06/03-07.
- `index_dev.html`/`viewer.html` — auxiliary files, not reviewed in depth.
- Cosmetic-only: s61's hidden QA label reads "שאלת שיא א'" though s61 is actually an *advanced* question — internal tooling label mismatch, invisible to learners.

### Script ambiguities found (this component)
- Slide 79's speaker NOTE conflicts with the slide's own fixed-text shape (see s62).
- Slide 80's question wording conflicts with its own stated correct answer/feedback math (see s63; repo already resolved it via a documented manual decision that should be confirmed against the source).

**Summary:** Covered all 8 screens/states (1 transition + 7 questions across slides 74–81). Worst severity: CRITICAL (screen s63/slide 80 has an internal script contradiction between its question wording and its own stated correct answer, already silently resolved in the repo's code with a documented manual decision, but not corrected in the source script). Next-worst: HIGH (screen s62/slide 79 — the repo dropped the script's deliberate gender-inclusive phrasing and instead reused an earlier slide's masculine-only question stem).

---

## methodica-math-percent-03-06

Repo: `index.html` (1206 lines), `script.js` (4981 lines), `styles.css` (5809 lines). Script chunk covers slides 84–90.

**Structural note:** split build — `SPLIT_FIRST=59`/`SPLIT_LAST=64`; only `<section>` markup for data-screen 59–64 (`s65`–`s70`) exists. Every other screen id is an empty comment header, with `script.js` still carrying live-looking but unreachable code referencing them.

### Screen s65 — TransitionScreen ("מסך הזנקה שאלת שיא")
Script slide(s): 85 | Repo: `index.html:430-456` | Type: TransitionScreen | STATUS: MATCH
Content: PASS. Continue gating: PASS (always enabled). Back: PASS. Asset: PASS (`poseKey:'happy'` → `Yellow_happy.mp4`/`Green_happy.mp4`, matches "תנועת שמחה עם הידיים"). Production notes: PASS.

### Screen s66 — Info screen ("חזרה לטלפון ולטיול השנתי")
Script slide(s): 86 | Repo: `index.html:459-530` | Item: 03-04-004 (mislabeled) | Type: plain info/context screen | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | MEDIUM | "בערב לפני הטיול הבנתם שהסוללה שלכם נגמרת מהר **ובדקתם את הסוללה**." | "...**והרצתם בדיקת סוללה**." | CHANGE: align wording | slide 86 / index.html:467-468 |
| PRODUCTION NOTES | MEDIUM | NOTE: "גלילה לאורך כל סעיפי השאלה" | No overflow/scroll rule scoped to this screen anywhere in styles.css — fixed-position box, no overflow | CHANGE: confirm content fits, else add scroll affordance | slide 86 / styles.css:3768-3773 |

Content: FAIL (one wording drift; 4-item list and closing bold lines otherwise verbatim). Continue gating: PASS. Back: PASS. Asset: PASS (alt-text byte-for-byte identical). Production notes: FAIL.

### Screen s67 — Peak Q1א — minimum points (ValueInputQuestion)
Script slide(s): 87 | Repo: `index.html:533-641`; `script.js:4046-4065, 4590-4706` | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT | MEDIUM | "מה סך הנקודות **הנדרש** לצריכת סוללה תקינה?" | "...**המינימאלי**..." | CHANGE: "required" reworded to "minimal" | slide 87 / index.html:534,546-548 |
| CONTENT | LOW | "להגיע ל-100% **מנקודות** היעד" | "...**מהנקודות**..." | CHANGE: minor article diff | slide 87 / index.html:543 |
| HINT | LOW | Scaffold text uses "טבלת **הפרופורציה**" — no "אפשר רמז?" trigger shape on this slide | Gated behind a hidden hint button, reads "...בטבלת **ההמרה**..." | SCRIPT CHECK + CHANGE (wording; also gating itself) | slide 87 / index.html:629-639 |
| FEEDBACK | MEDIUM | No correct/wrong feedback copy exists on slide 87 (only a "300" reference badge) | Full explanatory feedback body invented for both correct and finalWrong | CONTENT/SCRIPT CHECK: no source in this slide range | slide 87 / script.js:4049-4064 |

Content: FAIL · Correct answer: PASS (300) · Attempts: PASS · Hint: FAIL (see cross-screen SCRIPT CHECK) · Correct/Incorrect feedback: FAIL (no script source) · Continue gating: PASS · Back: PASS · Asset: PASS (`see_1_b.png`) · Production notes: PASS

### Screen s68 — Peak Q1ב — heating percentage (ValueInputQuestion)
Script slide(s): 88 | Repo: `index.html:644-753`; `script.js:4066-4079` | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| HINT | LOW | Reminder sentence, no trigger shape on slide | Gated behind hidden hint button; text matches exactly | SCRIPT CHECK on gating | slide 88 / index.html:741-751 |
| FEEDBACK | MEDIUM | No feedback copy on slide 88 (only "24" reference badge) | Full explanatory feedback invented | CONTENT/SCRIPT CHECK | slide 88 / script.js:4069-4078 |

Content: PASS (question + 3 context lines verbatim) · Correct answer: PASS (24) · Hint: FAIL (gating SCRIPT CHECK) · Correct/Incorrect feedback: FAIL (no script source) · Asset: PASS (`see_1_c.png`) · Production notes: PASS

### Screen s69 — Peak Q1ג — brightness points (ValueInputQuestion)
Script slide(s): 89 | Repo: `index.html:756-864`; `script.js:4080-4097` | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| HINT | LOW | "היזכרו **כיצד לחשב** את ערך האחוז..." | Gated hint reads "היזכרו **איך מחשבים**..." | CHANGE (wording) + SCRIPT CHECK (gating) | slide 89 / index.html:851-857 |
| FEEDBACK | MEDIUM | No feedback copy on slide 89 (only "84" reference badge) | Full explanatory feedback invented | CONTENT/SCRIPT CHECK | slide 89 / script.js:4083-4096 |

Content: PASS (question + closing line verbatim) · Correct answer: PASS (84) · Hint: FAIL · Correct/Incorrect feedback: FAIL · Asset: PASS (`see_1_d.png`) · Production notes: PASS

### Screen s70 — Peak Q1ד — verdict (3 inputs + dropdown)
Script slide(s): 90 | Repo: `index.html:867-1025`; `script.js:4098-4120, 4711-4738` | Type: ValueInputQuestion combo | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| SCRIPT CHECK | — | Slide 90 has **no speaker-notes block at all**, unlike every sibling slide 85-89 | N/A | Flag missing notes to script owner | slide 90 / N/A |
| CONTENT | MEDIUM | "10% **מניקוד המינימום** הם ___ נקודות." | "10% **מסך הנקודות הכולל** הם ___ נקודות." | CHANGE: reworded | slide 90 / index.html:887-903 |
| CONTENT | LOW | Dropdown shape order in script: "בחרו", "לא ניתן לדעת", "מעולה", "לא מעולה" | `<select>` order: "בחרו תשובה", "מעולה", "לא מעולה", "לא ניתן לדעת" | SCRIPT CHECK: PPTX shape order ≠ confirmed list order | slide 90 / index.html:944-949 |
| HINT | LOW | "חשבו כמה נקודות הם 10% **מתוך סך 300** הנקודות הכולל." | Drops "300" | CHANGE: hint loses numeric anchor | slide 90 / index.html:1013-1018 |
| CONTENT | LOW | Wrong title: "...**בואו** נבין למה:" | Drops "בואו" | CHANGE | slide 90 / script.js:4115 |
| LOGIC | MEDIUM | Script's two feedback states both show the full explanation directly | On final wrong, an extra "רוצים לראות את הפתרון הנכון?" reveal-gate prompt appears first — inconsistent with s67-s69's direct-reveal pattern | SCRIPT CHECK: extra gating step not evidenced (notes absent for this slide) | slide 90 / script.js:4098-4120,4669-4691,4711-4738 |

Content: FAIL (2 wording drifts + dropdown order/placeholder + hint drops "300") · Correct answer: PASS (v1=30, v2=330, v3=324, verdict="לא מעולה") · Hint: FAIL · Correct feedback: PASS (text matches) · Incorrect feedback: FAIL (extra reveal-gate step; wording drop) · Continue gating: PASS · Back: PASS · Asset: PASS (`see_1_e.png`) · Production notes: N/A (no notes block exists)

### Component checklist
Screens/states in script: 6 (slides 85–90) | Screens/states in repo: 6 (s65–s70)
Fully matching: 1 (s65) | Needing changes: 5
ADD: 0 | CHANGE: 9 | REMOVE: 0 | LOGIC: 1 | ASSET: 0 | CONTENT: 9 | SCRIPT CHECK: 6
CRITICAL: 0 | HIGH: 0 | MEDIUM: 8 | LOW: 9

### Repo content not mapped to script (this component)
- Magnifying-glass image-zoom buttons on every hero image (s65-s70) — a shared global project-wide component, not mentioned in slides 84-90.
- Full explanatory feedback bodies for s67/s68/s69's correct/incorrect states have no textual source anywhere in slides 87-89 (only slide 90 gives explicit feedback copy).
- Comment blocks for "SCREEN 0" through "SCREEN 64" and "SCREEN 71" through "SCREEN 77" are empty stubs with dead references in `script.js` — same pattern as component 03-04's, larger range here.

### Script ambiguities found (this component)
- Slides 87/88/89 each carry a reminder/scaffold sentence with no accompanying "אפשר רמז?" trigger shape, unlike slide 90 which has one explicitly. Repo gates all four sentences uniformly behind a hint button — unclear whether slides 87-89's sentences were meant to be always-visible scaffolding.
- Slide 90 has no speaker-notes block at all, unlike every sibling slide.
- The invented feedback bodies for s67-s69 may be inherited from an older draft or reflect an established project-wide convention (same vqTri+MathJax pattern recurs pervasively elsewhere) — flagged for the lead auditor's judgment (see Cross-unit #6 for the related terminology-drift pattern).

**Summary:** 6 screens covered (s65–s70), 0 CRITICAL, 0 HIGH, 8 MEDIUM, 9 LOW findings, plus 6 SCRIPT CHECK items — worst severity MEDIUM. No correctness-breaking issues; the notable findings are wording drifts, an inconsistent hint-gating pattern across the four peak sub-questions, and feedback text for three of the four sub-questions that has no source anywhere in the given script chunk.

---

## methodica-math-percent-03-07

Repo: `index.html` (1085 lines), `script.js` (4982 lines), `styles.css` (5849 lines).

**Architecture note:** split build — `SPLIT_FIRST=65`, `SPLIT_LAST=71`, `TOTAL_SCREENS=7`. Real `<section>` markup exists only for `s71`–`s77`; everything earlier (`s0`–`s70`) is an empty comment stub, some with dead JS config for `s67-s70` carried over from the merged build.

### Structural check — s0–s5 stub duplication
Confirmed empty stubs, no `<section>` markup. Associated JS targets non-existent elements (dead code).

### Screen "component divider" — slide 91
STATUS: MATCH (divider only, no repo action expected).

### Screen — slide 92 (TransitionScreen, "הנה שאלת השיא… 4 סעיפים… 3 לפחות")
STATUS: SCRIPT CHECK

Slide 92's text does **not** match this component's s71. It matches `s65`'s registry entry exactly (`poseKey:'happy'`, `dataScreen:59`) and `peakFinish()`'s 4-key/3-threshold check — i.e. slide 92 intros "Peak Question 1" (battery, 03-06's s67-s70), not the trivia-game question that is this component's actual content. See Cross-unit #7 for the likely copy-paste origin of this mismatch.

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| SCRIPT CHECK | MEDIUM | Slide 92 TransitionScreen ("4 סעיפים, 3 לפחות" + happy character) | No real `<section>` for slide 92 in this file; the matching registry entry (`s65`) is stub-only here | Confirm slide 92 belongs to the battery peak question and is implemented for real in 03-06 | script.js:188-193, 4557-4562; index.html:429-431 |

### Screen s72 — Info screen (trivia game context)
Script slide(s): 93 | Repo: `index.html:481-540` | STATUS: MATCH

Content: PASS — body text and bold/blue "בואו נעזור להם!" reproduced verbatim. Continue gating: PASS (always-enabled). Back: PASS. Asset: PASS (`see2_0.png` alt-text matches verbatim). Production notes: **FAIL** — see below.

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| ASSET / PRODUCTION NOTES | HIGH | Slide 93's production note: "לג'נרט מחדש בבקשה, בלי ילד עם קרחת" (regenerate, no bald kid) | Visually inspected `see2_0.png`: still shows a bald teenager (2nd from left) — the exact thing the note asked to remove | Regenerate/replace `see2_0.png`, or confirm the note is superseded | index.html:498-499; assets/images/see2_0.png (visually confirmed) |

### Screen s73 — Peak Q2א: T/F "האם רוני צודקת או טועה?" (ONE attempt)
Script slide(s): 94 | Repo: `index.html:543-658`; `script.js:4124-4131, 4591-4707` | Type: StatementAssessmentQuestion → implemented as 2-option single-choice | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| ATTEMPTS | — | NOTE: "שימו לב, ניסיון מענה אחד בלבד" | `oneAttempt: true`; any wrong answer treated as final | PASS — correctly implemented | script.js:4125, 4659, 4665-4706 |
| ASSET | HIGH | Slide 94 alt-text describes a photo of a card pile with a handwritten note + "טריוויה ח'6 נושא: מדעים" card | Actual `alt` describes an unrelated handwritten "14%=56 points" note — wrong description (the correct image IS used; only the alt text is mismatched) | Replace `alt`/`data-zoom-alt` with the script's verbatim alt-text | index.html:592, 599; assets/images/see2_1.png (visually confirmed) |
| CONTENT | LOW | Slide 94 shape order: "צודקת" before "טועה" | Repo order reversed | Low-confidence flag — PPTX shape z-order ≠ necessarily visual order | index.html:566-583 |

Content: PASS. Correct answer: PASS (`correctIndex:0`="טועה", matches script). Attempts: PASS. Hint: PASS (verbatim; "חזרה לשאלה" present). Correct/Incorrect feedback: PASS. Continue gating: PASS. Back: PASS. Asset: **FAIL** (alt-text). Production notes: PASS (one-attempt honored).

### Screen s74 — Peak Q2ב: value input "סך הנקודות הכולל"
Script slide(s): 95 | Repo: `index.html:661-766`; `script.js:4132-4141` | STATUS: MATCH

Content: PASS. Correct answer: PASS — accepts exactly `400` (56÷14%=400). Hint: PASS. Correct/Incorrect feedback: PASS (formula matches). Continue gating: PASS. Asset: PASS (`see2_2.png` alt matches verbatim). Production notes: PASS ("נקודות" fixed non-editable text, matching the explicit note).

### Screen s75 — Peak Q2ג: multi-select "מדוע שיטת הפרופורציה מהירה ויעילה יותר…" — **most severe findings in this component**
Script slide(s): 96 (last slide of the entire script) | Repo: `index.html:769-880`; `script.js:4142-4150, 4557-4562, 4591-4601` | Type: MultipleChoiceQuestion | STATUS: CHANGES REQUIRED

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| CONTENT / CORRECT ANSWER | **CRITICAL** | Slide 96's feedback — in BOTH the correct and wrong blocks — states verbatim "כל התשובות נכונות." (ALL statements are correct) | `correctIndices: [0,1,3]` only — excludes two statements as distractors. Selecting all 5 (what the script's own text asserts) is marked WRONG | **SCRIPT AMBIGUITY/CONFLICT** — human decision needed on the true distractor set | script.js:4142-4150 |
| CONTENT | MEDIUM | Slide 96 wrong-branch title/body (singular phrasing, asserts "כל התשובות נכונות") | Repo rewords both title and body, apparently to dodge the contradiction above | CHANGE — plausible deliberate fix but needs content-team sign-off, verbatim deviation | script.js:4148-4149 |
| LOGIC | **CRITICAL** | N/A (repo-only defect) | On finishing s75, `peakFinish()` checks ONLY `practiceResults['p1a'..'p1d']` (the unrelated battery question, 03-06) and ignores `p2a/p2b/p2c` (this component's own results). Within this standalone file `p1a..p1d` are always unset → routing to the FAIL screen fires **every time**, regardless of the actual answer | Fix `peakFinish()` to evaluate `p2a/p2b/p2c` for this routing decision. As shipped, the success screen s77 is unreachable via normal play in this component | script.js:4142-4150, 4557-4562, 4591-4601 |

Content/Correct answer: FAIL (see CRITICAL). Hint: PASS (verbatim). Correct/Incorrect feedback: FAIL. Continue gating: PASS. Production notes: **FAIL** — critical routing bug.

### Screen s76 — End screen: peak question not passed
Script slide(s): **none** — no corresponding slide anywhere in the script | Repo: `index.html:883-905` | STATUS: SCRIPT CHECK

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| SCRIPT CHECK | HIGH | No slide provides content for a "failed" outcome screen | Full screen with encouragement text, character, reset btn, finish btn | Human decision — same open question as s77 below | index.html:883-905; no matching slide |
| LOGIC | **CRITICAL** | N/A (repo-only) | "סיימתי" → `goTo(0)`; `goTo()` refuses `n<65` — click does **nothing** in this standalone file | As delivered, finish button is dead (a merged full-unit build would presumably reach real `s0`) | index.html:901; script.js:673-675,16-18 |

### Screen s77 — End screen: unit completed successfully ("השלמת את היחידה בהצלחה! 🤯")
Script slide(s): **none** — the script ends at slide 96 with the multiple-choice question | Repo: `index.html:908-932` | STATUS: SCRIPT CHECK

Full text: heading "כל הכבוד!", body "השלמת את היחידה בהצלחה! 🤯", a victory-pose character video, a reset button (`onclick="unitReset()"`, text "↻ איפוס היחידה"), and a "סיימתי" finish button.

**Reset button:** appears exactly twice in this repo — here and on s76 — both wired to `unitReset()`, which clears progress and returns to `SPLIT_FIRST` (this component's own first screen, s71). Per script slide 83's requirement (reset only on the last screen, returning to "start of the component"), this correctly matches "start of the component," and having it on both alternative final screens is consistent with "last screen" — **no placement violation found here** (unlike 03-04's mid-unit s56 case).

| Category | Severity | Script requirement | Current repo implementation | Required action | Evidence |
|---|---|---|---|---|---|
| SCRIPT CHECK | HIGH | Script ends at slide 96 with no unit-completion screen anywhere | Full closing screen exists with specific wording, victory video, working reset, finish button | Human decision: (a) extend the script with a formal closing screen, or (b) confirm this is stale content from an older/longer draft to reconcile or remove | slide 96 is the script's last slide; index.html:908-931 |
| LOGIC | **CRITICAL** | N/A (repo-only, same root cause as s76) | "סיימתי" → `goTo(0)`; blocked by the split-range guard — click does nothing | Same as s76 | index.html:928; script.js:673-675 |

### Component checklist
Screens/states in script: 6 slides (91-96) | Screens/states in repo: 7 real sections (s71-s77) + dead stubs for s0-s5 and s65-s70
Fully matching: 2 (s72, s74) | Needing changes: 6
ADD: 0 | CHANGE: 3 | REMOVE: 0 | LOGIC: 3 | ASSET: 2 | CONTENT: 4 | SCRIPT CHECK: 6
CRITICAL: 3 | HIGH: 4 | MEDIUM: 3 | LOW: 3

### Repo content not mapped to script (this component)
- `s0`-`s5`: empty comment stubs with live but unreachable JS hooks.
- `s65`-`s70` (Peak Q1 battery-question config, plus a registry entry for `s65`): fully-written content with no `<section>` in this file — dead code whose true home, per the slide-92 analysis, is 03-06.
- `s76` and `s77` (both end screens): no corresponding script slide at all.

### Script ambiguities found (this component)
- Slide 96: feedback text asserts "כל התשובות נכונות" in both correct AND incorrect blocks, contradicting the multi-select exact-match grading. Needs content-team decision on the true correct set.
- Slide 92 content doesn't match anything in this component's real screens — appears misfiled/deck-adjacent rather than truly part of 03-07 (see Cross-unit #7).
- Slide 93's production note ("no bald kid") appears unactioned in the current asset.
- Central "unit complete" gap reconfirmed: zero slides exist for either outcome (fail/success) after slide 96.

**Summary:** 9 screens/stub-groups covered, 13 distinct findings (3 CRITICAL, 4 HIGH, 3 MEDIUM, 3 LOW). Worst severity: CRITICAL — three items: the `peakFinish()` scoring-logic bug that always routes to the failure screen after s75, the dead "סיימתי"/`goTo(0)` finish buttons on both s76 and s77, and the slide-96 script self-contradiction between "all statements are correct" feedback text and the 3-of-5 grading logic.

---

## Repo Content Not Mapped to Script (consolidated)

Nothing below is recommended for deletion — each item is flagged for the team to review and decide.

**The dominant pattern, by far, is the split-build dead-code footprint** (see Cross-unit #4): every one of the 7 `index.html` files contains empty HTML comment stubs for every screen outside its own slice, and every one of the 7 `script.js` files carries the full original engine, including live-looking functions, character registries, and in three cases (03-02, 03-03, 03-05) **fully-authored answer/feedback configs for screens that belong to other components** and have no HTML anywhere in that file. None of this is reachable at runtime, but it roughly triples the size of every file with content that isn't this component's job.

Per-component highlights (full detail in each section above):
- **03-01**: dead functions for s34–s77; two unused pie-chart images referenced only inside HTML comments; an unused hotspot-tooltip system with no matching markup; a repo-only "reveal solution" toggle on s7 not called for by the script.
- **03-02**: dead bodies for s0–s32 and a component-04 `VQ` config for s58–s75; the orphaned `unitReset()` function that slide 83 actually needs wired up here; a dozen unreferenced image/video assets.
- **03-03**: ~40 empty comment banners (s0–s9, s16–s41, s55–s77); a complete, unreachable component-04 `VQ` config (s58–s75).
- **03-04**: ~75 of 77 original screen markers are inert; `script.js` still carries an unrelated `s54Reset()` function and a dozen character-registry entries for screens that don't exist here.
- **03-05**: dead `VQ` configs for 03-06's peak questions (`s67`-`s70`, `s73`-`s74`); a cosmetic-only internal QA label on s61 that misnames it a "peak" question when it's an "advanced" one.
- **03-06**: shared global magnifying-glass/zoom component (not script-specific); dead comment stubs for everything outside s65-s70.
- **03-07**: dead config for 03-06's `s65`-`s70`; the two end screens (`s76`, `s77`) themselves have no script slide at all — the unit's single biggest content-coverage question (see Cross-unit #10 / Top-10 #10).

## Script Ambiguities / Human Decisions Required (consolidated)

These require a decision from whoever owns the script — none were resolved unilaterally by this audit.

1. **Component/item numbering system is broken from slide 69 onward** (Cross-unit #1) — needs the script's own divider/item labels corrected, and a decision on whether slides 73–96 (which never reset their item counter) were meant to be one component or the three the repo made of them.
2. **Character-selection persistence across components is undefined** (Cross-unit #3) — the script only stages this once, under 03-01; nothing says what components 02–07 should do, and no persistence mechanism exists in the code today.
3. **"Reset unit" placement rule is self-contradictory and inconsistently implemented** (Cross-unit #5, Top-10 #4/#5) — the script's own note mixes "unit" and "component" scope; the repo implementation is inconsistent under either reading (missing in 03-02, wrongly placed mid-component in 03-04, correctly placed in 03-07, absent in 03-06).
4. **Slide 92's "4 sections, need 3" intro doesn't match the 3-part question that follows it** (Cross-unit #7) — likely copy-pasted from slide 85's template and never updated.
5. **Slides 82–83 sit in the wrong physical position in the deck** (Cross-unit #8) — confirm this wasn't an accidental drag-reorder during editing.
6. **Slide 80's ratio question contradicts its own answer** (03-05, s63) — question asks for cultivation:shed, but the script's own worked feedback computes shed:cultivation = 9:11; repo silently chose the shed:cultivation reading.
7. **Slide 96's feedback text contradicts its own grading key** (03-07, s75) — "כל התשובות נכונות" (all correct) is asserted for a multi-select graded as exactly 3-of-5 correct. This is on the very last slide of the script and needs a definitive answer key.
8. **Slide 79's speaker note contradicts the slide's own on-slide fixed-text shape** (03-05, s62) on whether "תלמידים" or "תלמידות ותלמידים" is the fixed suffix.
9. **Slide 71's apparent missing letter and slide 72's apparent two typos** (03-04) — the repo has already silently "corrected" these; script owner should confirm the corrections are right rather than the repo guessing.
10. **No "unit complete" screen exists anywhere in the current 96-slide script** (Cross-unit #10, Top-10 #10) — yet 03-07 ships one in full. Decide whether to extend the script or formally retire/reconcile the repo screen.
11. **Slide 90 (03-06) has no speaker-notes block at all**, unlike every sibling slide — several of this screen's requirements (dropdown option order, hint gating, reveal-before-explanation behavior) cannot be independently verified without notes; worth asking the script owner if notes were accidentally deleted.
12. **Proportion-table hint terminology has drifted into 4+ inconsistent names across components** (Cross-unit #6) — not a script ambiguity per se, but worth a single standardization decision rather than 20+ scattered fixes.

## Recommended Fix Order

Ordered by the audit's own priority scheme (CRITICAL logic/content → flow/navigation/state → attempts+feedback → missing/extra screens → content → assets → minor/local), with the affected screens named explicitly.

**1. CRITICAL logic/content**
- Fix the wrong-question feedback on **03-02 s36** (popsicles calculation shown instead of the furniture/party-budget working).
- Remove the hint on **03-02 s39 §א** where the script explicitly forbids one.
- Fix the guided-practice math error on **03-01 s26** (wrong percentage divisor, wrong displayed arithmetic).
- Resolve the two SCRIPT AMBIGUITY items that block a correct implementation until answered: **03-05 s63** (ratio direction) and **03-07 s75** (which 3 of 5 statements are actually correct).

**2. Flow/navigation/state**
- Fix `peakFinish()` on **03-07** to grade `p2a/p2b/p2c` instead of `p1a-p1d`, so the success screen (s77) becomes reachable.
- Fix the two dead "סיימתי" finish buttons on **03-07 s76/s77** (`goTo(0)` inside a split-range guard that blocks it).
- Wire the missing unit-reset feature + fix the dead Continue button on **03-02 s41**.
- Remove or relocate the mid-unit reset button on **03-04 s56**.
- Decide and implement the cross-unit reset-button policy (Human Decision #3) consistently across 03-02/03-04/03-06/03-07.

**3. Attempts + feedback**
- Move the full-derivation correct-answer feedback to the right branch on **03-01 s31**.
- Fix the incorrect-feedback title mismatch and body paraphrase on **03-02 s53**.
- Fix the wrong "checkmark always shown" logic on **03-01 s18**.
- Fill in or confirm the numerous unscripted-but-plausible feedback bodies invented across **03-05 (s58,s59,s60,s61,s62,s64)** and **03-06 (s67,s68,s69)** — the numbers check out, but the wording needs script-owner sign-off since it currently has no source.

**4. Missing/extra screens**
- Resolve Human Decision #10 (unit-complete screen) — affects **03-07 s76/s77**.
- Confirm or remove the dead split-build stub ranges across **all 7 components** (large but low-risk cleanup).
- Confirm the plastic-island slide pair's correct position — affects **03-02 s40/s41** (Human Decision #5).

**5. Content**
- Restore the gender-inclusive phrasing dropped on **03-05 s62**.
- Fix the ~20 "טבלת הפרופורציה" hint-wording drifts spread across **03-02, 03-03, 03-05, 03-06** (Human Decision #12) — recommended as one pass, not per-screen fixes.
- Fix the smaller wording drifts noted individually in **03-01 (s4), 03-02 (s33,s34,s37,s38), 03-03 (s42,s44,s50,s51), 03-04 (s56), 03-05 (s58,s59,s60,s61), 03-06 (s66,s67,s69,s70)**.

**6. Assets**
- Source the missing `standard_6_c.png` for **03-02 s39 §ג**.
- Fix mismatched/empty alt-text on **03-02 (s35, s51)**, **03-07 (s73)**.
- Regenerate `see2_0.png` for **03-07 s72** (production note asked for the bald-teenager figure to be removed; it's still present).
- Give the CSS-drawn pie chart on **03-01 s17-s20** a text alternative, or switch to the named asset the script specifies.

**7. Minor/local**
- Everything logged as LOW severity throughout the per-component sections above (58 items) — cosmetic punctuation, single dropped/added words, duplicated headings, etc.

---

## Audit Coverage

```
Script slides reviewed: 1–96 (all 96, full deck, start to finish)
Speaker notes reviewed: YES — every NOTE block on every slide, including slides with no notes (flagged where notable, e.g. slide 90)
Production notes reviewed: YES — every "הנחיות הפקה:" block, and every yellow/bold/colored text run extracted and checked
Repo components reviewed: methodica-math-percent-03-01, -02, -03, -04, -05, -06, -07 (all 7)
Repo screens/states reviewed: 73 real implemented screens (s0/s33 spanning 03-01–03-02 through s71-s77 in 03-07), plus the empty-stub ranges in every component's index.html and the corresponding dead-code ranges in every script.js
Unmapped script slides: none — every slide was assigned to a component and a screen (including the two anomalies: slides 82–83 physically out of sequence but mapped to 03-02 by content; slide 92 orphaned/misattributed but mapped and flagged)
Unmapped repo screens/states: methodica-math-percent-03-07's s76 and s77 (both end screens have no corresponding script slide at all — this is the audit's most significant coverage gap, see Top-10 #10)
```

No technical failure occurred reading the PPTX — all slide text, tables, image alt-text, bold/color/yellow formatting, and speaker notes were successfully extracted and reviewed for all 96 slides. This audit is complete as scoped: no screen, slide, or component was skipped.




</details>
