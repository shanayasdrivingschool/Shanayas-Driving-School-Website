insert into public.questions (
  question_text,
  option_a,
  option_b,
  option_c,
  option_d,
  correct_option,
  explanation,
  category
)
select
  seed.question_text,
  seed.option_a,
  seed.option_b,
  seed.option_c,
  seed.option_d,
  seed.correct_option,
  seed.explanation,
  seed.category
from (
  values
    (
      'What does an inverted red-and-white triangular YIELD sign require you to do?',
      'Stop for three seconds in every situation',
      'Give the right-of-way to other vehicles and crossing pedestrians',
      'Speed up before entering the intersection',
      'Yield only to cyclists',
      'b',
      'A yield sign requires you to give the right-of-way to other vehicles and crossing pedestrians. Slow down, stop if necessary, and proceed only when it is safe.',
      'road_signs'
    ),
    (
      'What does a red WRONG WAY sign tell you?',
      'You are travelling against the permitted traffic flow and must not continue',
      'The road becomes two-way ahead',
      'Only commercial vehicles may continue',
      'The road ends after the next intersection',
      'a',
      'A WRONG WAY sign warns that you are facing traffic in the prohibited direction. Do not continue; move out of danger safely.',
      'road_signs'
    ),
    (
      'What does a DO NOT ENTER sign mean?',
      'You may enter after yielding',
      'The road is closed only to trucks',
      'You must not enter the roadway from this direction',
      'You may enter to make a U-turn',
      'c',
      'A DO NOT ENTER sign prohibits entering the roadway from your direction. It is commonly used where traffic would be travelling against you.',
      'road_signs'
    ),
    (
      'What does a ONE WAY sign with an arrow show?',
      'Traffic must travel only in the direction of the arrow',
      'Traffic may travel in either direction',
      'All vehicles must turn around',
      'Only buses may use the roadway',
      'a',
      'A ONE WAY sign shows the permitted direction of traffic. Do not drive against the direction indicated by the arrow.',
      'road_signs'
    ),
    (
      'What should you do when approaching a school-crosswalk sign?',
      'Maintain speed unless a school bus is present',
      'Yield to pedestrians and follow a crossing guard''s directions',
      'Stop only when the crossing guard raises both hands',
      'Pass any vehicle that slows near the crosswalk',
      'b',
      'A school-crosswalk sign identifies a crossing used by pedestrians. Yield to people crossing and follow the directions of a crossing guard when one is present.',
      'road_signs'
    ),
    (
      'What does a right-turn arrow crossed out by a red circle and slash mean?',
      'Right turns are permitted after stopping',
      'Right turns are required',
      'Right turns are prohibited as indicated by the sign',
      'Only large vehicles may turn right',
      'c',
      'The red circle and slash indicate a prohibited movement. Do not turn right where this regulatory sign applies, including during any posted times.',
      'road_signs'
    ),
    (
      'What does the number on a posted B.C. maximum-speed sign mean?',
      'The speed you must maintain in every condition',
      'The maximum legal speed when the road is bare and dry and visibility is good',
      'The minimum speed for the road',
      'The recommended speed for trucks only',
      'b',
      'The posted number is the maximum legal speed under good conditions. Drive more slowly when weather, visibility, traffic, or road conditions make the posted speed unsafe.',
      'road_signs'
    ),
    (
      'What does a sign displaying a lower speed with a downward arrow mean?',
      'The lower speed limit begins immediately at that warning sign',
      'A lower speed limit is ahead, so prepare to slow down',
      'The displayed speed is a minimum',
      'The current speed limit has ended with no replacement',
      'b',
      'This sign gives advance warning of a lower speed limit ahead. Reduce speed in time to obey the new limit when it begins.',
      'road_signs'
    ),
    (
      'What does a posted WINTER TIRES OR CHAINS sign require?',
      'Winter tires or chains must be used when the sign is displayed',
      'Studded tires must be used throughout the year',
      'Only four-wheel-drive vehicles may continue',
      'The road is closed whenever snow is visible',
      'a',
      'The sign means winter tires or chains must be used when the requirement is displayed. Check current route and seasonal requirements before travelling.',
      'road_signs'
    ),
    (
      'What does a KEEP RIGHT OF DIVIDER sign require?',
      'Pass the divider on either side',
      'Keep to the right side of the divider or obstruction',
      'Make a right turn at the next intersection',
      'Stop before reaching the divider',
      'b',
      'This regulatory sign directs traffic to pass on the right side of the divider or obstruction.',
      'road_signs'
    ),
    (
      'What does a PASSING LANE AHEAD sign tell you?',
      'A passing lane is coming up',
      'Passing is prohibited for the rest of the road',
      'The roadway changes to one-way traffic',
      'Only motorcycles may pass',
      'a',
      'The sign gives advance notice that a passing lane is ahead. Continue to obey lane markings, signs, and safe-passing rules.',
      'road_signs'
    ),
    (
      'What does a NO STOPPING sign without posted times mean?',
      'Stopping is prohibited between that sign and the next no-stopping sign',
      'You may stop for up to five minutes',
      'Only parking is prohibited; stopping is always allowed',
      'You must stop and check for pedestrians',
      'a',
      'A no-stopping sign prohibits stopping between it and the next no-stopping sign. Signs with posted times apply during those stated times.',
      'road_signs'
    ),
    (
      'What does a parking symbol crossed out by a red circle and slash mean?',
      'Parking is reserved for permit holders',
      'Parking is not allowed where or when the sign applies',
      'Parking is free for a limited time',
      'The area is a passenger-loading zone',
      'b',
      'The crossed-out parking symbol means do not park where the sign applies. Any posted times or arrows define when and where the restriction is in effect.',
      'road_signs'
    ),
    (
      'What does a bicycle symbol crossed out by a red circle and slash mean?',
      'A bicycle lane begins',
      'Cyclists must dismount only at night',
      'Bicycle riding is prohibited beyond the sign',
      'Bicycle parking is available',
      'c',
      'This regulatory sign means bicycle riding is not permitted beyond that point.',
      'road_signs'
    ),
    (
      'What does a NO RIGHT TURN ON RED sign mean?',
      'You may turn right after stopping for three seconds',
      'You must wait for a signal that permits the right turn',
      'You may turn if no pedestrians are visible',
      'Only buses may turn on the red light',
      'b',
      'The sign prohibits a right turn while the light is red. Wait until the traffic signal permits the turn and the movement is safe.',
      'road_signs'
    ),
    (
      'What does a DISASTER ROUTE sign mean during a major disaster?',
      'The road is reserved for emergency vehicles, so other traffic must stay off it',
      'The road is the public evacuation route for every vehicle',
      'Only vehicles with winter tires may use the road',
      'The road is closed permanently',
      'a',
      'During a major disaster, a designated disaster route may be used only by emergency vehicles. Other drivers must stay off the road.',
      'road_signs'
    ),
    (
      'What does a SLOW VEHICLES USE PULLOUTS sign require?',
      'Slow-moving drivers should use the pullouts for the stated distance as directed',
      'All vehicles must stop at every pullout',
      'Only buses may enter the pullouts',
      'Drivers should pass slow vehicles on the shoulder',
      'a',
      'The sign directs slow vehicles to use designated pullouts over the stated distance so other traffic can pass safely.',
      'road_signs'
    ),
    (
      'What does a TWO-WAY TRAFFIC sign mean?',
      'The roadway ahead carries traffic in both directions',
      'Both lanes travel in your direction',
      'The road becomes a divided highway',
      'Passing is required before the sign',
      'a',
      'The sign warns that traffic travels in both directions ahead. Keep right and be alert for oncoming traffic.',
      'road_signs'
    ),
    (
      'How should you respond to a warning sign showing a deer?',
      'Speed up to leave the area quickly',
      'Slow down, scan for animals, and be prepared to stop',
      'Use high beams at all times',
      'Stop immediately beside the sign',
      'b',
      'The sign warns that deer may be on or near the road ahead. Reduce risk by slowing down, scanning carefully, and being ready to stop.',
      'road_signs'
    ),
    (
      'What does a RAILWAY CROSSING AHEAD sign tell you to do?',
      'Increase speed before reaching the tracks',
      'Prepare to stop and remember that trains always have the right-of-way',
      'Stop only when another vehicle stops',
      'Drive around lowered gates if no train is visible',
      'b',
      'The sign warns of a railway crossing ahead. Be prepared to stop, watch for warning devices, and always yield to trains.',
      'road_signs'
    )
) as seed (
  question_text,
  option_a,
  option_b,
  option_c,
  option_d,
  correct_option,
  explanation,
  category
)
where not exists (
  select 1
  from public.questions existing
  where lower(trim(existing.question_text)) = lower(trim(seed.question_text))
);
