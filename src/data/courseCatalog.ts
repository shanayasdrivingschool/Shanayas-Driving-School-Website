import { getCourseImage } from "@/data/courseImages";

export type CourseCatalogItem = {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Test Prep" | "Flexible" | "Senior Support";
  deliveryFormat: "In-class" | "In-car" | "In-class + In-car";
  duration: string;
  detail: string;
  description: string;
  highlights: string[];
  tone: string;
  image: string;
  quizTags: string[];
  pricing: {
    fixedPrice?: number;
    sixtyMinuteClasses?: number;
    ninetyMinuteClasses?: number;
    sixtyMinutePrice?: number;
    ninetyMinutePrice?: number;
    discountPercent?: number;
  };
};

const courseCatalogSeed: CourseCatalogItem[] = [
  {
    id: "beginner-driving-course",
    title: "Beginner's Driving Course",
    level: "Beginner",
    deliveryFormat: "In-car",
    duration: "10 x 90 min beginner lessons",
    detail: "10 x 90 min beginner lessons",
    description: "Perfect for first-time drivers, covering essential car control, traffic rules, and safe driving habits.",
    highlights: ["Basic Car Control", "Traffic Rules", "Safe Driving Habits", "Road Awareness"],
    tone: "bg-white text-black border border-gray-200",
    image: "https://private-us-east-1.manuscdn.com/sessionFile/YcTfnhvF4PHLy9OpoFm3lC/sandbox/nAmH4CdRAUGAW8wWxfAg5z_1773905025864_na1fn_L2hvbWUvdWJ1bnR1L3VwbG9hZC9zZWFyY2hfaW1hZ2VzL3lwbkFjZ2JQVlNMQQ.jpg?x-oss-process=image/resize,w_4096,h_4096/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvWWNUZm5odkY0UEhMeTlPcG9GbTNsQy9zYW5kYm94L25BbUg0Q2RSQVVHQVc4d1d4ZkFnNXpfMTc3MzkwNTAyNTg2NF9uYTFmbl9MMmh2YldVdmRXSjFiblIxTDNWd2JHOWhaQzl6WldGeVkyaGZhVzFoWjJWekwzbHdia0ZqWjJKUVZsTk1RUS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd180MDk2LGhfNDA5Ni9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=OqNlugdj0ErAMkTPDWZBRLQVa3sdwoDMfDhqlk48uFIXhm9CGmoulPuEgJzkT1t-6tI6FNR1goTpbnnUlC8h1WpDE6ah68cC-0LuI1aDlSZiEAWt9O5KPPy85gvSsltNkqPdzoBpSfdR8JNY8JB3-xt49MX1lzbCA5RtwStsNvs1noG7kl75YhbDun5h1QjrNsgTiOYEipyJApJl36W95G9mO5OtpePqE~CM7MI3YDbZtaSLXZ6boE0Cce7R2aM6AhEJVLrk70fJnA6p~2e7xEBDOhH6O0y-EqC424z6dJkafrj1bvNt4Gnyw2w2iPb70qS2TUER0o9crT~KrmLJ~Q__",
    quizTags: ["beginner", "foundation", "confidence", "road-awareness"],
    pricing: { ninetyMinuteClasses: 10 },
  },
  {
    id: "knowledge-test-prep-course",
    title: "Knowledge Test Prep Course",
    level: "Beginner",
    deliveryFormat: "In-class",
    duration: "8 in-class sessions",
    detail: "8 in-class sessions",
    description: "Build confidence for the knowledge test by learning road signs, traffic rules, and exam-style practice questions.",
    highlights: ["Road Signs", "Traffic Rules", "Practice Questions", "Test Preparation"],
    tone: "bg-white text-black border border-gray-200",
    image: "https://media.istockphoto.com/id/1241536937/photo/back-view-of-large-group-of-high-school-students-on-a-class-in-the-classroom.jpg?s=170667a&w=0&k=20&c=RYTMDA38NJqM0tNeg06y-jn5Tl8NRy5ox9WtbifJ2z4=",
    quizTags: ["knowledge-test", "written-test", "rules", "beginner"],
    pricing: { fixedPrice: 300 },
  },
  {
    id: "parking-course",
    title: "Parking Course",
    level: "Beginner",
    deliveryFormat: "In-car",
    duration: "3 x 90 min classes",
    detail: "3 x 90 min classes",
    description: "Dedicated parking practice for parallel parking, stall parking, and low-speed vehicle control.",
    highlights: ["Parallel Parking", "Stall Parking", "Low-Speed Control", "Tight Maneuvers"],
    tone: "bg-white text-black border border-gray-200",
    image: "https://private-us-east-1.manuscdn.com/sessionFile/YcTfnhvF4PHLy9OpoFm3lC/sandbox/nAmH4CdRAUGAW8wWxfAg5z_1773905025864_na1fn_L2hvbWUvdWJ1bnR1L3VwbG9hZC9zZWFyY2hfaW1hZ2VzL29sVUdETjBkZzhWVQ.jpg?x-oss-process=image/resize,w_4096,h_4096/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvWWNUZm5odkY0UEhMeTlPcG9GbTNsQy9zYW5kYm94L25BbUg0Q2RSQVVHQVc4d1d4ZkFnNXpfMTc3MzkwNTAyNTg2NF9uYTFmbl9MMmh2YldVdmRXSjFiblIxTDNWd2JHOWhaQzl6WldGeVkyaGZhVzFoWjJWekwyOXNWVWRFVGpCa1p6aFdWUS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd180MDk2LGhfNDA5Ni9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=oUNFPHio4QUVW2bP-nPYE24GSwe6uNZfofozc5kAfk933JkzBGOR5mYzSoqE7VeSFIrZmkBBeqYclo-bW9b4YEvYTRit8UA1YntBY4Dn8CTfY286r4Y29C7IwdVSxrxXh~7jiz3e3mna5NixliHGe9zFK7fXHJAC1-~EPH3D8xUJEGhpxij-bfxuUZ5vqal0a58XgyF5lRy8RzMl6SyrNeiNf9SV5vnC5EFXUhV~yf0mzsNZ6ZLUy8~57uoL69DwqqlCMWwnGkX26EZc0FFOl0HwqQbfJoiVpXt59dyGut8J9ArhmF50eohl0kJdhhHgpgfj2dNahJKifUaU2-Uwhg__",
    quizTags: ["parking", "maneuvers", "beginner", "road-test"],
    pricing: { ninetyMinuteClasses: 3 },
  },
  {
    id: "make-your-own-class",
    title: "Make Your Own Class",
    level: "Flexible",
    deliveryFormat: "In-car",
    duration: "Custom-focus lesson",
    detail: "Custom-focus lesson",
    description: "Choose your own lesson focus based on the area where you want the most support.",
    highlights: ["Flexible Focus", "Weak Area Support", "Custom Lesson Plan", "Personalized Coaching"],
    tone: "bg-white text-black border border-gray-200",
    image: "https://a-plusdriving.com/wp-content/uploads/2023/08/driving-instructor-girl.jpg",
    quizTags: ["custom", "flexible", "mixed-needs"],
    pricing: { ninetyMinuteClasses: 1 },
  },
  {
    id: "lesson-road-test-prep-course",
    title: "Lesson + Road Test Prep + Rental",
    level: "Test Prep",
    deliveryFormat: "In-car",
    duration: "2 x 60 min + road test prep and rental",
    detail: "2 x 60 min + road test prep and rental",
    description: "Two focused lessons, road test preparation, and a rental car for your road test.",
    highlights: ["Warm-Up Lessons", "Road Test Focus", "Car Included", "Route Preparation"],
    tone: "bg-white text-black border border-gray-200",
    image: "https://www.easydriversed.com/wp-content/uploads/2025/01/the-road-test-process.jpg",
    quizTags: ["road-test", "combined", "test-prep", "maneuvers"],
    pricing: { sixtyMinuteClasses: 2, sixtyMinutePrice: 350, ninetyMinutePrice: 450 },
  },
  {
    id: "road-test-prep-course",
    title: "Road Test Prep Course",
    level: "Test Prep",
    deliveryFormat: "In-car",
    duration: "1 x 90 min lesson",
    detail: "1 x 90 min lesson",
    description: "Get focused practice on test routes, key maneuvers, and ICBC road test standards to improve your chances of passing.",
    highlights: ["Mock Test Routes", "Parking Practice", "ICBC Standards", "Exam Readiness"],
    tone: "bg-white text-black border border-gray-200",
    image: "https://i1.sndcdn.com/artworks-Mibfz7Hd4Kvub70F-VYoMjw-t500x500.jpg",
    quizTags: ["road-test", "test-routes", "maneuvers", "test-prep"],
    pricing: { ninetyMinuteClasses: 1 },
  },
  {
    id: "new-to-canada",
    title: "New to Canada",
    level: "Beginner",
    deliveryFormat: "In-car",
    duration: "3 x 90 min classes",
    detail: "3 x 90 min classes",
    description: "Helpful for drivers adjusting to local road rules, driving culture, and test expectations in Canada.",
    highlights: ["Canadian Road Rules", "Local Driving Culture", "Sign Review", "Test Expectations"],
    tone: "bg-white text-black border border-gray-200",
    image: "https://achev.ca/wp-content/uploads/2022/09/diverse-group-with-canadian-flags.png",
    quizTags: ["newcomer", "canada-rules", "confidence", "beginner"],
    pricing: { ninetyMinuteClasses: 3 },
  },
  {
    id: "defensive-driving-course",
    title: "Defensive Driving Course",
    level: "Intermediate",
    deliveryFormat: "In-car",
    duration: "5 x 90 min classes",
    detail: "5 x 90 min classes",
    description: "Focused on defensive driving techniques, hazard perception, and proactive strategies to reduce risk in complex traffic conditions.",
    highlights: ["Hazard Perception", "Risk Reduction", "Defensive Techniques", "Traffic Awareness"],
    tone: "bg-white text-black border border-gray-200",
    image: "https://tse1.mm.bing.net/th/id/OIP.PRMLIAbXgbQIpq24oi3kWQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
    quizTags: ["defensive", "hazard-awareness", "traffic", "intermediate"],
    pricing: { ninetyMinuteClasses: 5 },
  },
  {
    id: "refresher-driving-course",
    title: "Refresher Driving Course",
    level: "Intermediate",
    deliveryFormat: "In-car",
    duration: "2 x 90 min classes",
    detail: "2 x 90 min classes",
    description: "Ideal for licensed drivers returning after a break or preparing to re-test, focused on rebuilding confidence and refreshing core driving skills.",
    highlights: ["Skill Refresh", "Confidence Building", "Road Practice", "Driving Review"],
    tone: "bg-white text-black border border-gray-200",
    image: "https://static.wixstatic.com/media/941078_f4cc1b14a8aa4a9186227ef1fd5067a7~mv2.png/v1/fill/w_2500,h_2500,al_c/941078_f4cc1b14a8aa4a9186227ef1fd5067a7~mv2.png",
    quizTags: ["refresher", "returning-driver", "confidence", "intermediate"],
    pricing: { ninetyMinuteClasses: 2 },
  },
  {
    id: "mock-test-evaluation",
    title: "Mock Test Evaluation",
    level: "Test Prep",
    deliveryFormat: "In-car",
    duration: "1 x 60 min class",
    detail: "1 x 60 min class",
    description: "A realistic road test simulation with feedback on what to improve before test day.",
    highlights: ["Mock Test", "Exam Feedback", "Readiness Check", "Improvement Plan"],
    tone: "bg-white text-black border border-gray-200",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80",
    quizTags: ["mock-test", "road-test", "feedback", "test-prep"],
    pricing: { sixtyMinuteClasses: 1, sixtyMinutePrice: 120, ninetyMinutePrice: 150 },
  },
  {
    id: "confidence-booster-course",
    title: "Confidence Booster Course",
    level: "Beginner",
    deliveryFormat: "In-car",
    duration: "8 x 90 min classes",
    detail: "8 x 90 min classes",
    description: "Perfect for drivers with basic skills who need a confidence boost to feel comfortable and safe on the road.",
    highlights: ["Confidence Training", "Road Comfort", "Driving Practice", "Skill Reinforcement"],
    tone: "bg-white text-black border border-gray-200",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
    quizTags: ["confidence", "nervous-driver", "practice", "beginner"],
    pricing: { ninetyMinuteClasses: 8 },
  },
  {
    id: "advanced-driving-course",
    title: "Advanced Driving Course",
    level: "Advanced",
    deliveryFormat: "In-car",
    duration: "5 x 90 min classes",
    detail: "5 x 90 min classes",
    description: "Designed for experienced drivers to refine skills and apply advanced driving techniques for safer, more controlled driving.",
    highlights: ["Advanced Control", "Precision Driving", "Traffic Strategy", "Road Safety"],
    tone: "bg-white text-black border border-gray-200",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    quizTags: ["advanced", "precision", "highway", "complex-situations"],
    pricing: { ninetyMinuteClasses: 5 },
  },
  {
    id: "winter-driving-course",
    title: "Winter Driving Course",
    level: "Intermediate",
    deliveryFormat: "In-car",
    duration: "Seasonal skill training",
    detail: "Seasonal skill training",
    description: "Learn essential winter driving skills for icy and low-visibility conditions. Build confidence and control in difficult weather.",
    highlights: ["Snow Driving", "Ice Control", "Low Visibility Driving", "Vehicle Stability"],
    tone: "bg-white text-black border border-gray-200",
    image: "https://private-us-east-1.manuscdn.com/sessionFile/YcTfnhvF4PHLy9OpoFm3lC/sandbox/nAmH4CdRAUGAW8wWxfAg5z_1773905025864_na1fn_L2hvbWUvdWJ1bnR1L3VwbG9hZC9zZWFyY2hfaW1hZ2VzL3dnTFFuREhPa2h3eQ.png?x-oss-process=image/resize,w_4096,h_4096/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvWWNUZm5odkY0UEhMeTlPcG9GbTNsQy9zYW5kYm94L25BbUg0Q2RSQVVHQVc4d1d4ZkFnNXpfMTc3MzkwNTAyNTg2NF9uYTFmbl9MMmh2YldVdmRXSjFiblIxTDNWd2JHOWhaQzl6WldGeVkyaGZhVzFoWjJWekwzZG5URkZ1UkVoUGEyaDNlUS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd180MDk2LGhfNDA5Ni9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=vCjxnwlQigrh3aPY6J6Ezni-loNNEj1GP36nuU8G0AzHQc4kRPn9nG61fICPti9N8SEZh9iTo8tLdX-eaDQE74QRjMQjPDKBD8DVFEyNzR9Wo6fA-G7mfUP5C5~QfJWbTwk4iTJ-43b8riHlYox69tQM~0vCWEtNyqX2xWPuRWh7Pv-6EratO~U75Bf713rx4x-Z896K1jiXxGwinEjc0QA65CYcJi9neH1-20WITFEJUlb5RPNCfVrk1YGWpHtD~D1mNevfNf7X0~2QX~7VeEq-54XKveTA--Amsp6FVeq0-njyk3uDquZM9-HmECUvv7CemJSHEM96JdwTnnuYiw__",
    quizTags: ["winter", "weather", "seasonal", "confidence"],
    pricing: { ninetyMinuteClasses: 1 },
  },
  {
    id: "seniors-driving-course",
    title: "Enhanced Road Assessment",
    level: "Senior Support",
    deliveryFormat: "In-class + In-car",
    duration: "Confidence and review sessions",
    detail: "Confidence and review sessions",
    description: "Tailored for senior drivers, focusing on safe habits, awareness, reaction time, and refreshing important road rules.",
    highlights: ["Safe Driving Habits", "Awareness Training", "Reaction Practice", "Road Rules Review"],
    tone: "bg-white text-black border border-gray-200",
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80",
    quizTags: ["senior", "confidence", "road-rules", "refresher"],
    pricing: { ninetyMinuteClasses: 1 },
  },
];

export const courseCatalog = courseCatalogSeed.map((course) => ({
  ...course,
  image: getCourseImage(course.id, course.image),
}));

export const courseCatalogById = Object.fromEntries(courseCatalog.map((course) => [course.id, course])) as Record<
  string,
  CourseCatalogItem
>;







