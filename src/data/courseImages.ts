const buildUpdatedCourseImage = (fileName: string) =>
  `/Course-pictures-updated/${encodeURIComponent(fileName)}`;

const courseImageOverridesById: Record<string, string> = {
  "advanced-driving-course": buildUpdatedCourseImage("Advanced driving course whatsapp catalogue_.webp"),
  "beginner-driving-course": buildUpdatedCourseImage("Beiginners driving course whatsapp catalogue_.webp"),
  "confidence-booster-course": buildUpdatedCourseImage("Confidence boostercourse whatsapp catalogue.webp"),
  "defensive-driving-course": buildUpdatedCourseImage("Defensive driving course whatsapp catalogue_.webp"),
  "knowledge-test-prep-course": buildUpdatedCourseImage("Knowledge test prep course whatsapp catalogue_.webp"),
  // Use a normalized filename here because the original asset name includes special characters.
  "lesson-road-test-prep-course": buildUpdatedCourseImage("lesson-road-test-prep-course.webp"),
  "make-your-own-class": buildUpdatedCourseImage("Make your own class whatsapp catalogue  copy 2.webp"),
  "mock-test-evaluation": buildUpdatedCourseImage("Mock test evaluation course whatsapp catalogue  copy 2.webp"),
  "new-to-canada": buildUpdatedCourseImage("New to canada course whatsapp catalogue  copy.webp"),
  "parking-course": buildUpdatedCourseImage("Parking course whatsapp catalogue  copy.webp"),
  "refresher-driving-course": buildUpdatedCourseImage("Refresherdriving course whatsapp catalogue_.webp"),
  "road-test-prep-course": buildUpdatedCourseImage("Road test prepcourse whatsapp catalogue_.webp"),
  "seniors-driving-course": buildUpdatedCourseImage("Enhanced road assessment drivincourse whatsapp catalogue_.webp"),
  "winter-driving-course": buildUpdatedCourseImage("Winter driving course whatsapp catalogue_.webp"),
};

export const getCourseImage = (courseId: string, fallbackImage: string) =>
  courseImageOverridesById[courseId] ?? fallbackImage;
