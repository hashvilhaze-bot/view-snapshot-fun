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

## Blocked — waiting on the client
- Real WhatsApp number / phone / email (all contact points are placeholders)
- The Make webhook URL for leads (no lead integration exists in this project's code)
- Google Sign-In: optional UX layer only, needs the backend enabled — not added yet
- Missing facts marked `[להשלמה: ...]` in content

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
- [ ] English version infrastructure — not started (needs user decision on scope)
- [x] Facts completed: rafting grades + seasons, gear list, walking hours, Tsum extension, Chitwan/yoga durations, festival timing
- [ ] Still blocked on client: partner names/background, phone/WhatsApp/email, lead webhook URL
- [x] Kathmandu spelling normalised to קטמנדו site-wide
