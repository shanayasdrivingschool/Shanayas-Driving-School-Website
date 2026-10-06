# Knowledge-test question update notes

**Prepared:** October 6, 2026  
**Publication state:** Implemented locally; database migration not yet applied to production

## Brief

- **Reader:** People preparing for the British Columbia Class 7 knowledge test.
- **Question:** Can the supplied research topics be turned into accurate, useful practice questions?
- **Location:** British Columbia.
- **Outcome:** Expand the independent practice bank with original multiple-choice questions and explanations based on current official material.
- **Scope:** Fallback question data and Supabase migrations; each session includes the complete current bank in randomized order.
- **Overlap:** Candidate topics were compared with the existing fallback/database questions. Existing topics were not duplicated.
- **Evidence gaps:** The supplied reports did not contain usable source links and included ambiguous or outdated statements. Those reports were treated as planning inputs rather than publication evidence.
- **Original contribution:** Questions, distractors, and explanations were rewritten for this project instead of copying reported live-test or third-party practice wording.
- **Responsible organization:** Shanaya's Driving School.
- **Required review:** A qualified driving instructor should review the practical-driving questions before the bank is labelled fully reviewed.
- **Next step:** Apply the new Supabase migration, deploy the site, and complete a live practice session.
- **Maintenance:** Recheck time-sensitive B.C. rules when legislation, ICBC guidance, or Graduated Licensing Program rules change.

## Implementation decisions

- Added 66 questions across the four supplied reports, bringing the fallback bank from 13 to 79 questions.
- Updated each session to include all 79 questions in a randomized order.
- Corrected the third report's non-B.C. circular speed-sign description and used ICBC's B.C. maximum-speed-sign meaning instead.
- Consolidated its overlapping STOP, pedestrian-crosswalk, roundabout, and school-zone items with existing coverage rather than duplicating them.
- Corrected the fourth report's yellow-arrow, opposing four-way-stop, bicycle-lane, lane-control, and uphill-parking descriptions before adding supported questions.
- Replaced the supplied cyclist answer with the current minimum-distance rule: 1 m at 50 km/h or less and 1.5 m above 50 km/h, with the separate 0.5 m rule stated for protected lanes and sidewalks.
- Excluded the taxi-front-seat item because the supplied wording and reported answer were ambiguous about whether the driver was included.
- Excluded the general music/device item because the answer changes with licence class and device use. The existing L/N electronic-device question is clearer and remains in the bank.
- Excluded L-supervisor-age and passenger-limit questions because ICBC states that related rules change on October 19, 2026. Avoiding them prevents an immediately stale question.
- Did not describe any question as an official or recalled ICBC test item.

## Claim log

| Topics | Source | Evidence used | Checked on | Gap or review |
| --- | --- | --- | --- | --- |
| Signs, signals, road markings, school/playground zones | ICBC, *Learn to Drive Smart*, Chapter 3 | Regulatory, warning, parking, lane-control, railway, arrow-signal, road-marking, and zone meanings | October 6, 2026 | Instructor review pending |
| Intersections, right turns on red, four-way stops, roundabouts, driveways and passing | ICBC, *Learn to Drive Smart*, Chapter 4; B.C. Motor Vehicle Act | Right-of-way, stopping, entry and passing rules | October 6, 2026 | Instructor review pending |
| Shoulder checks, following distance and tailgaters | ICBC, *Learn to Drive Smart*, Chapter 5 | Shoulder checks before changing road position and increased forward space when tailgated | October 6, 2026 | Instructor review pending |
| Two-way stops, traffic-circle direction and parking rules | ICBC, *Learn to Drive Smart*, Chapter 4 | Through-road priority, left-turn yielding, counter-clockwise travel, wheel direction and legal parking distances | October 6, 2026 | Instructor review pending |
| School buses | ICBC, *Learn to Drive Smart*, Chapter 6; Motor Vehicle Act s. 149 | Stop for the bus and remain stopped until it moves or the driver signals that it is safe | October 6, 2026 | None for legal rule; instructor review pending |
| Night driving, skids, crashes and poor visibility | ICBC, *Learn to Drive Smart*, Chapter 8 | Night-risk reduction, skid recovery, crash-scene guidance and visibility limits | October 6, 2026 | Instructor review pending |
| Vulnerable-road-user passing distance | Province of B.C., Sharing the road safely | 1 m at 50 km/h or less; 1.5 m above 50 km/h; 0.5 m for a separated and protected lane or sidewalk | October 6, 2026 | Time-sensitive legal rule |
| Stopped official vehicles | B.C. Motor Vehicle Act Regulations s. 47.02 | 40 km/h below an 80 km/h posted limit and move over when safe | October 6, 2026 | Time-sensitive legal rule |
| L/N zero alcohol and drugs | ICBC, Graduated Licensing and Class 7L pages | Zero blood alcohol and zero blood drug content remains a restriction | October 6, 2026 | Recheck after October 19, 2026 GLP changes |

## Readiness

- **Page quality:** Draft awaiting instructor review. The legal and ICBC-source checks are complete for the added questions, but practical-driving explanations have not been reviewed by a qualified instructor.
- **Intent satisfaction:** The bank now covers the supported, distinct topics from all three supplied research files while avoiding inaccurate, ambiguous, duplicated, and imminently outdated items.
- **Publication state:** Implemented locally. The migration must be applied to the production Supabase database and the built site deployed before the questions are live.
