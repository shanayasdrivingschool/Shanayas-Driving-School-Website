const buildUpdatedCourseImage = (fileName: string) =>
  `/Course-pictures-updated/${encodeURIComponent(fileName)}`;

const courseImageOverridesById: Record<string, string> = {
  "advanced-driving-course": buildUpdatedCourseImage("Advanced driving course whatsapp catalogue_.jpg"),
  "beginner-driving-course": buildUpdatedCourseImage("Beiginners driving course whatsapp catalogue_.jpg"),
  "confidence-booster-course": buildUpdatedCourseImage("Confidence boostercourse whatsapp catalogue.jpg"),
  "defensive-driving-course": buildUpdatedCourseImage("Defensive driving course whatsapp catalogue_.jpg"),
  "knowledge-test-prep-course": buildUpdatedCourseImage("Knowledge test prep course whatsapp catalogue_.jpg"),
  // Use a normalized filename here because the original asset name includes special characters.
  "lesson-road-test-prep-course": buildUpdatedCourseImage("lesson-road-test-prep-course.jpg"),
  "make-your-own-class": buildUpdatedCourseImage("Make your own class whatsapp catalogue  copy 2.jpg"),
  "mock-test-evaluation": buildUpdatedCourseImage("Mock test evaluation course whatsapp catalogue  copy 2.jpg"),
  "new-to-canada": buildUpdatedCourseImage("New to canada course whatsapp catalogue  copy.jpg"),
  "parking-course": buildUpdatedCourseImage("Parking course whatsapp catalogue  copy.jpg"),
  "refresher-driving-course": buildUpdatedCourseImage("Refresherdriving course whatsapp catalogue_.jpg"),
  "road-test-prep-course": buildUpdatedCourseImage("Road test prepcourse whatsapp catalogue_.jpg"),
  "seniors-driving-course": buildUpdatedCourseImage("Enhanced road assessment drivincourse whatsapp catalogue_.jpg"),
  "winter-driving-course": buildUpdatedCourseImage("Winter driving course whatsapp catalogue_.jpg"),
};

export const getCourseImage = (courseId: string, fallbackImage: string) =>
  courseImageOverridesById[courseId] ?? fallbackImage;
