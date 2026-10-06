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
      'What does a yellow arrow traffic signal mean?',
      'The advance turn signal is about to change; stop unless you cannot stop safely in time',
      'The protected turn will remain available',
      'You must turn in the arrow''s direction without slowing',
      'Through traffic may proceed while turning traffic stops',
      'a',
      'A yellow arrow warns that the advance turn signal is about to change. Slow down and stop before the intersection unless you cannot stop safely in time.',
      'rules_of_the_road'
    ),
    (
      'What does a green arrow traffic signal allow you to do?',
      'Turn in the direction shown by the arrow when the way is clear',
      'Proceed in any direction',
      'Make a U-turn only',
      'Stop and wait for a circular green light',
      'a',
      'A green arrow permits movement in the direction shown by the arrow. Continue to watch for pedestrians and other road users.',
      'rules_of_the_road'
    ),
    (
      'What does a flashing green left arrow shown with a steady red light mean?',
      'Left turns may proceed, while through traffic must stop for the red light',
      'All traffic may proceed through the intersection',
      'Left turns must stop until the red light changes',
      'Only through traffic may proceed',
      'a',
      'The flashing green arrow permits the protected left turn. Traffic travelling straight must remain stopped for the steady red light.',
      'rules_of_the_road'
    ),
    (
      'At a two-way stop where only one road has stop signs, which traffic normally has the right-of-way?',
      'Traffic stopped at the signs',
      'Traffic on the through road without stop signs',
      'Vehicles turning left',
      'The largest vehicle',
      'b',
      'Traffic on the through road has the right-of-way. Drivers facing the stop signs must wait for a safe gap before proceeding.',
      'rules_of_the_road'
    ),
    (
      'Two vehicles face each other at a two-way stop and arrive together. One is turning left and the other is going straight. Who normally goes first?',
      'The left-turning driver',
      'The driver going straight',
      'The driver who signals last',
      'Both drivers should enter together',
      'b',
      'The left-turning driver must normally yield to the opposing driver going straight. An exception applies if the left-turning vehicle is already in the intersection and has started the turn.',
      'rules_of_the_road'
    ),
    (
      'In which direction do vehicles travel around a traffic circle or roundabout in British Columbia?',
      'Clockwise',
      'Counter-clockwise',
      'Either direction when clear',
      'The direction used by the largest vehicle',
      'b',
      'Enter by turning right and travel counter-clockwise around the centre island. Yield as required before entering.',
      'rules_of_the_road'
    ),
    (
      'What minimum following distance should you allow behind a large vehicle that blocks your view?',
      'One second',
      'Two seconds',
      'At least three seconds',
      'Exactly five seconds in every condition',
      'c',
      'ICBC recommends at least three seconds behind a large vehicle that may block your view. Increase the gap further when conditions require it.',
      'safe_driving'
    ),
    (
      'What does a broken yellow centre line mean?',
      'Passing is allowed when it is safe',
      'Passing is prohibited in both directions',
      'Traffic travels in the same direction on both sides',
      'The lane is reserved for buses',
      'a',
      'A broken yellow centre line separates opposing traffic and permits passing when the manoeuvre is legal and safe.',
      'road_markings'
    ),
    (
      'A broken yellow line is beside a solid yellow line. When may you pass?',
      'Only when the broken line is on your side and passing is safe',
      'Only when the solid line is on your side',
      'From either side whenever traffic is light',
      'Passing is never permitted from either side',
      'a',
      'You may pass only when it is safe and the broken yellow line is on your side of the centre line.',
      'road_markings'
    ),
    (
      'What does a single solid yellow centre line mean in British Columbia?',
      'Passing is allowed with extra caution when it is otherwise legal and safe',
      'Passing is prohibited in both directions',
      'Both lanes travel in the same direction',
      'The roadway is closed ahead',
      'a',
      'ICBC identifies a single solid yellow line as allowing passing with extra caution. Any pass must still be legal and safely completed with adequate visibility.',
      'road_markings'
    ),
    (
      'What do white road lines generally separate?',
      'Lanes of traffic moving in the same direction',
      'Traffic moving in opposite directions',
      'Railway tracks from the roadway',
      'School zones from playground zones',
      'a',
      'White lines generally separate lanes moving in the same direction. They also mark crosswalks, stopping positions, and highway shoulders.',
      'road_markings'
    ),
    (
      'What does a solid white line between lanes mean?',
      'Do not change lanes across the line',
      'Passing is encouraged',
      'Traffic moves in opposite directions',
      'The lane is reversible',
      'a',
      'A solid white lane line means you should not change lanes across it. A broken white line permits a lane change when safe.',
      'road_markings'
    ),
    (
      'What does a lane marked with a bicycle outline indicate?',
      'A lane for cyclists travelling in the same direction as adjacent traffic',
      'A parking lane available when no cyclists are visible',
      'A lane for motorcycles and bicycles',
      'A pedestrian-only path',
      'a',
      'A marked bicycle lane is for cyclists travelling in the same direction as nearby traffic. Drivers must not park in it and must yield to cyclists when crossing it as permitted.',
      'road_markings'
    ),
    (
      'How far must you park from a crosswalk or intersection in British Columbia?',
      'At least 3 metres',
      'At least 5 metres',
      'At least 6 metres',
      'At least 15 metres',
      'c',
      'Parking is illegal within six metres of a crosswalk or intersection.',
      'rules_of_the_road'
    ),
    (
      'When parking uphill beside a standard curb, which way should you turn the front wheels?',
      'To the left',
      'To the right',
      'Straight ahead',
      'Wheel direction does not matter if the parking brake is set',
      'a',
      'Turn the wheels left when parked uphill beside a standard curb. For a rolling or mountable curb that cannot stop the vehicle from rolling into traffic, ICBC advises turning them right.',
      'safe_driving'
    ),
    (
      'How far must you park from a fire hydrant in British Columbia?',
      'At least 3 metres',
      'At least 5 metres',
      'At least 6 metres',
      'At least 15 metres',
      'b',
      'Parking is illegal within five metres of a fire hydrant, measured from the point at the curb beside the hydrant.',
      'rules_of_the_road'
    ),
    (
      'How far must you park from the nearest rail of a railway crossing in British Columbia?',
      'At least 5 metres',
      'At least 10 metres',
      'At least 15 metres',
      'At least 30 metres',
      'c',
      'Parking is illegal within 15 metres of the nearest rail at a railway crossing.',
      'rules_of_the_road'
    ),
    (
      'What does a white diamond marking in a lane indicate?',
      'The lane is reserved; signs or additional markings identify who may use it',
      'The lane is open to every vehicle at all times',
      'The lane is for emergency stopping only',
      'The lane ends at the next intersection',
      'a',
      'A white diamond identifies a reserved lane. Nearby signs or markings state whether it is for HOVs, buses, bicycles, or other permitted users and when restrictions apply.',
      'road_markings'
    ),
    (
      'At a railway crossing with a lowered gate, when may you proceed?',
      'After stopping briefly if no train is visible',
      'Only after the gate is fully raised and it is safe',
      'As soon as the train''s last car passes',
      'When the vehicle ahead drives around the gate',
      'b',
      'Stay stopped until the railway gate is fully raised. Check that no other train is approaching and proceed only when it is safe.',
      'rules_of_the_road'
    ),
    (
      'What does a yellow X lane-control signal above your lane mean?',
      'Move out of that lane and into a lane showing a green arrow',
      'The lane is reserved for buses',
      'Stop immediately in the lane',
      'The lane is open with no restrictions',
      'a',
      'A yellow X warns you to leave that lane and move safely into a lane displaying a green arrow. A red X means do not drive in the lane.',
      'road_signs'
    ),
    (
      'When may you park in a space marked with the accessible-parking symbol?',
      'Whenever all other spaces are occupied',
      'When displaying a valid disabled-person parking permit and carrying a person with a disability',
      'For up to five minutes without a permit',
      'Only when loading commercial goods',
      'b',
      'ICBC states that the vehicle must display a disabled-person parking permit and be carrying a person with a disability.',
      'rules_of_the_road'
    ),
    (
      'What does a parking sign displaying a two-hour limit mean?',
      'Parking is allowed for no more than two hours during the times the sign applies',
      'Parking begins two hours after you arrive',
      'Only permit holders may park',
      'Parking is prohibited for two hours',
      'a',
      'A time-limited parking sign allows parking only for the displayed maximum duration during any stated operating times.',
      'road_signs'
    ),
    (
      'What does a yellow diamond sign showing a sharp curve and an advisory speed mean?',
      'A sharp curve is ahead; slow to the advisory speed shown',
      'The legal speed limit increases at the curve',
      'Only right turns are permitted',
      'A passing lane begins on the curve',
      'a',
      'The warning sign identifies a sharp curve ahead and shows an advisory speed for negotiating it safely under good conditions.',
      'road_signs'
    ),
    (
      'What does a warning sign showing a truck on a steep slope mean?',
      'A steep hill is ahead, so slow down and control your speed',
      'Trucks are prohibited beyond the sign',
      'A truck parking area is ahead',
      'Construction vehicles are crossing',
      'a',
      'The sign warns of a steep hill ahead. Reduce speed early and maintain control, especially in a large or heavily loaded vehicle.',
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
