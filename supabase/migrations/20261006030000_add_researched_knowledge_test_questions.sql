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
      'What must you do at a stop sign?',
      'Slow down and continue if the intersection looks clear',
      'Come to a complete stop, check carefully, and proceed only when it is safe',
      'Stop only when another road user is present',
      'Sound your horn before continuing',
      'b',
      'A stop sign requires a complete stop. After stopping, check the intersection and proceed only when it is safe and you have yielded as required.',
      'road_signs'
    ),
    (
      'What does a flashing green traffic light mean in British Columbia?',
      'It is a protected left-turn signal',
      'It is a pedestrian-controlled light; proceed only if the intersection is clear and be ready for it to change',
      'The signal is broken, so treat it as a four-way stop',
      'Speed up because the light will remain green only briefly',
      'b',
      'In B.C., a flashing green light is pedestrian-controlled. Watch for pedestrians and proceed only when the intersection is clear.',
      'rules_of_the_road'
    ),
    (
      'What do double solid yellow centre lines mean when you are considering passing another motor vehicle?',
      'Passing is allowed whenever the road looks clear',
      'Passing is not allowed',
      'Traffic on both sides moves in the same direction',
      'Only motorcycles may pass',
      'b',
      'Double solid yellow centre lines mean that passing another motor vehicle is not allowed. Separate rules may permit crossing a centre line for a lawful turn or, when safe, to give required space to a vulnerable road user.',
      'road_markings'
    ),
    (
      'Two vehicles reach an uncontrolled intersection at the same time. Which driver must yield?',
      'The driver on the right must yield to the driver on the left',
      'The driver of the smaller vehicle must yield',
      'The driver on the left must yield to the driver on the right',
      'The driver travelling faster has the right-of-way',
      'c',
      'At an uncontrolled intersection, if two vehicles arrive at the same time, the driver on the left must yield to the driver on the right.',
      'rules_of_the_road'
    ),
    (
      'At a four-way stop, which vehicle should normally go first?',
      'The vehicle that first arrived and came to a complete stop',
      'The largest vehicle',
      'The vehicle turning left',
      'The vehicle moving fastest',
      'a',
      'The first vehicle to arrive and stop should go first. If two arrive together, the vehicle on the right should usually go first; a left-turning driver must also yield to an opposing vehicle going straight.',
      'rules_of_the_road'
    ),
    (
      'Who must you yield to before entering a roundabout?',
      'Only vehicles waiting behind you',
      'Traffic already in the roundabout and pedestrians at the entry crosswalk',
      'No one, because entering traffic has priority',
      'Only large trucks and buses',
      'b',
      'Slow down, choose the correct lane, yield to pedestrians at the entry crosswalk, and yield to traffic already travelling in the roundabout.',
      'rules_of_the_road'
    ),
    (
      'When may you turn right at a steady red light in British Columbia?',
      'Without stopping if no vehicle is approaching',
      'Never',
      'After a complete stop, if no sign prohibits the turn and you yield to lawful traffic and pedestrians',
      'Only between sunset and sunrise',
      'c',
      'Unless a sign prohibits it, you may turn right after stopping completely and yielding to pedestrians, cyclists, and vehicles lawfully proceeding through the intersection.',
      'rules_of_the_road'
    ),
    (
      'When passing a vulnerable road user who is not in a separated and protected lane or on a sidewalk, what minimum distances apply in British Columbia?',
      '0.5 m on every road',
      '1 m on every road',
      '1 m on highways with limits of 50 km/h or less, and 1.5 m when the limit is above 50 km/h',
      '2 m only when a sign is posted',
      'c',
      'B.C. requires at least 1 m on highways with speed limits of 50 km/h or less and 1.5 m on highways with limits above 50 km/h. A separate 0.5 m minimum applies when the vulnerable road user is in a separated and protected lane or on a sidewalk.',
      'safe_driving'
    ),
    (
      'When may you proceed after stopping for a school bus with alternating flashing red lights?',
      'As soon as no children are visible',
      'After waiting for 30 seconds',
      'When the bus resumes moving or its driver signals that it is safe to proceed',
      'Immediately if you are approaching from the opposite direction',
      'c',
      'Traffic approaching a stopped school bus with its required warning signal must stop and remain stopped until the bus moves again or the bus driver signals that it is safe to proceed.',
      'rules_of_the_road'
    ),
    (
      'Unless a sign shows another limit, what is the general maximum speed on a highway within a municipality in British Columbia?',
      '30 km/h',
      '40 km/h',
      '50 km/h',
      '60 km/h',
      'c',
      'The general maximum is 50 km/h within a municipality unless a posted sign or another applicable rule sets a different limit. Conditions may require a slower speed.',
      'rules_of_the_road'
    ),
    (
      'When is a posted 30 km/h playground-zone limit normally in effect?',
      'From dawn to dusk every day',
      'Only from 8 a.m. to 5 p.m. on school days',
      'Only when children are visible',
      'Only on weekends and holidays',
      'a',
      'A playground-zone sign with a 30 km/h tab applies every day from dawn to dusk, unless the sign states otherwise.',
      'road_signs'
    ),
    (
      'What blood-alcohol and blood-drug restriction applies when driving with a Class 7L or 7N licence?',
      'Up to 0.05 blood-alcohol concentration is allowed',
      'Zero alcohol and zero drugs',
      'The restriction applies only at night',
      'The restriction applies only when driving without an instructor',
      'b',
      'Drivers in the Graduated Licensing Program must have zero alcohol and zero drugs in their blood when they drive.',
      'safe_driving'
    ),
    (
      'What is a major risk of entering a curve too quickly?',
      'The vehicle may lose traction, skid, or run wide off its intended path',
      'The steering automatically becomes more accurate',
      'The stopping distance becomes shorter',
      'The tires gain extra grip',
      'a',
      'Excess speed in a curve can cause loss of traction and a skid. Slow down before entering the curve and steer smoothly.',
      'hazard_awareness'
    ),
    (
      'What should you do before driving from a driveway, alley, or parking lot across a sidewalk and onto a road?',
      'Stop on the sidewalk so you can see traffic',
      'Sound your horn and enter the road immediately',
      'Stop before the sidewalk or pedestrian area, then yield and wait for a safe gap',
      'Pedestrians must always yield to vehicles leaving private property',
      'c',
      'Stop before the sidewalk or area where pedestrians may be walking. Then pull out carefully and yield to road traffic while waiting for a safe gap.',
      'rules_of_the_road'
    ),
    (
      'Which combination helps reduce risk when driving at night?',
      'Keep interior lights bright, follow more closely, and use high beams near other vehicles',
      'Adjust mirrors for night driving, keep interior lights low or off, slow down, and increase following distance',
      'Use parking lights instead of headlights and watch only the centre line',
      'Wear sunglasses and speed up to shorten the trip',
      'b',
      'ICBC recommends reducing glare, keeping interior lighting low, scanning carefully, slowing down, and increasing following distance at night.',
      'hazard_awareness'
    ),
    (
      'When should you perform a shoulder check?',
      'Only when judging following distance',
      'Whenever you plan to change direction or road position, such as turning or changing lanes',
      'Only after completing a lane change',
      'Only when another driver sounds a horn',
      'b',
      'Use mirrors and a shoulder check before changing direction or road position so you can check the blind spot on the side you plan to move toward.',
      'safe_driving'
    ),
    (
      'What is a safe response when another driver is following too closely behind you?',
      'Brake suddenly to warn the driver',
      'Speed above the limit to create distance',
      'Slow slightly to increase the space ahead and, when safe, let the driver pass',
      'Keep the same spacing and ignore the vehicle',
      'c',
      'Increasing the space ahead lets you stop more gradually. You can also change lanes or pull over safely to let the tailgater pass.',
      'safe_driving'
    ),
    (
      'How should you respond to a flashing yellow traffic light?',
      'Come to a complete stop and wait for a green light',
      'Speed up before the light changes',
      'Slow down, proceed with caution, and yield to pedestrians as required',
      'Treat it as an uncontrolled railway crossing',
      'c',
      'A flashing yellow light means to slow down and proceed cautiously. You must yield to pedestrians lawfully in the intersection or nearby crosswalk.',
      'rules_of_the_road'
    ),
    (
      'Which action should you avoid at the scene of a crash?',
      'Exchanging the required contact, vehicle, and insurance information',
      'Recording witness details and taking photos when safe',
      'Discussing who is at fault for the crash',
      'Notifying your insurer promptly',
      'c',
      'Exchange the required information and document the scene, but avoid discussing who is at fault. Report the crash and notify your insurer as required.',
      'safe_driving'
    ),
    (
      'What should you do if the rear of your vehicle begins to skid?',
      'Brake hard and turn sharply in the opposite direction',
      'Accelerate until the tires regain grip',
      'Ease off the accelerator, look where you want to go, and steer smoothly in that direction',
      'Turn off the ignition immediately',
      'c',
      'Ease off the accelerator and steer smoothly in the direction you want to travel. Avoid braking during the skid because it can make the situation worse.',
      'hazard_awareness'
    ),
    (
      'What should you do when poor visibility prevents you from seeing far enough ahead to pass safely?',
      'Pass quickly before conditions worsen',
      'Use the shoulder to pass',
      'Do not pass; wait until visibility and conditions allow a safe, legal pass',
      'Follow closely and copy the vehicle ahead',
      'c',
      'Do not pass unless you can see far enough ahead and can complete the manoeuvre safely and legally. In extreme weather, wait or pull over safely until visibility improves.',
      'hazard_awareness'
    ),
    (
      'On your side of a road posted below 80 km/h, what must you do when approaching a stopped official vehicle displaying flashing lights?',
      'Maintain the posted speed and sound your horn',
      'Slow to no more than 40 km/h and, if safe, move into another lane away from the vehicle',
      'Stop in your lane beside the official vehicle',
      'Slow to 60 km/h only when workers are visible',
      'b',
      'On a road posted below 80 km/h, the maximum passing speed is 40 km/h. If you are in the adjacent or same lane, move over when it is safe unless directed otherwise.',
      'rules_of_the_road'
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
