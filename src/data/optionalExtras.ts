import type { ProductOutlineSection } from "@/data/productTypes";

export type OptionalExtra = {
  id: string;
  title: string;
  description: string;
  detail?: string;
  image?: string;
  price?: number;
  formatLabel?: "In-class" | "In-car" | "In-class + In-car";
  highlights?: string[];
  outlineSections?: ProductOutlineSection[];
  outcomes?: string[];
  courseId?: string;
  href?: string;
  actionLabel?: string;
};

export const optionalExtras: OptionalExtra[] = [
  {
    id: "extra-parking-practice",
    title: "Extra Parking Practice",
    description: "Add extra parking drills if you want more repetition before moving to the next stage.",
    courseId: "parking-course",
  },
  {
    id: "mock-test-evaluation",
    title: "Mock Test Evaluation",
    description:
      "Book a stand-alone practice road test to assess your readiness and receive feedback on areas for improvement.",
    courseId: "mock-test-evaluation",
  },
  {
    id: "road-test-day-support",
    title: "Road Test Day Support",
    description: "Add warm-up guidance and instructor support for a calmer and better prepared test day.",
    courseId: "lesson-road-test-prep-course",
  },
  {
    id: "car-rental",
    title: "Car Rental",
    description:
      "Book an instructor-approved training car for road test day when you want to test in a familiar vehicle.",
    detail: "Road test day vehicle rental",
    image:
      "https://th.bing.com/th/id/R.938bd1619651dfafcc414b34125030cc?rik=YGc%2fiHscOQkg8A&riu=http%3a%2f%2fdualcontrolvehiclehire.co.uk%2fassets%2fimages%2fdual-internal-1266x949.jpeg&ehk=sBzyh82TS%2fru%2fNH3cCjSrvjtlhpolkb8a0RbECqzZ6o%3d&risl=&pid=ImgRaw&r=0",
    price: 250,
    formatLabel: "In-car",
    highlights: [
      "Use a familiar instructor-approved vehicle on test day.",
      "Keep your final practice flow aligned with the same car setup.",
      "Reduce last-minute friction around vehicle sourcing and readiness.",
      "Add the rental directly to checkout instead of arranging it separately.",
    ],
    outlineSections: [
      {
        title: "What is included",
        objectives: [
          "Road test day use of a training car prepared for the appointment.",
          "Instructor-approved vehicle setup that matches the school fleet standard.",
          "Scheduling linked to the selected service area in your checkout.",
        ],
      },
      {
        title: "Best fit for",
        objectives: [
          "Students who want consistency between training and the road test vehicle.",
          "Students who do not have a suitable vehicle available for the test day.",
          "Learners who want to keep test-day logistics simple and predictable.",
        ],
      },
    ],
    outcomes: [
      "Arrive at the road test with one less moving part to manage.",
      "Use a vehicle you already understand instead of adapting at the last minute.",
      "Keep your focus on the test itself rather than on vehicle logistics.",
    ],
  },
];

export const optionalExtrasById = Object.fromEntries(optionalExtras.map((extra) => [extra.id, extra])) as Record<
  string,
  OptionalExtra
>;
