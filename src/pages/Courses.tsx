import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, CarFront, GraduationCap, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/components/cart/CartProvider";
import PageNameSection from "@/components/PageNameSection";
import SiteFooter from "@/components/SiteFooter";
import SiteCtaSection, { siteCtaPrimaryClassName, siteCtaSecondaryClassName } from "@/components/SiteCtaSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import type { CourseCatalogItem } from "@/data/courseCatalog";
import { officeLocation } from "@/data/serviceLocations";
import { usePublicCourses } from "@/hooks/usePublicCourses";
import { getCartItemKey } from "@/lib/cart";

const learningPath = [
  {
    title: "Choose Your\nPath",
    text: "Choose a course track based on your current driving level and road test goals.",
  },
  {
    title: "Build Driving Confidence",
    text: "Complete structured lessons with practical drills you can apply on real roads.",
  },
  {
    title: "Improve With Feedback",
    text: "Get instructor feedback, track your progress, and move forward with a clear next-step plan.",
  },
];

const getCoursePreviewColumnCount = () => {
  if (typeof window === "undefined") {
    return 1;
  }

  if (window.matchMedia("(min-width: 1024px)").matches) {
    return 3;
  }

  if (window.matchMedia("(min-width: 640px)").matches) {
    return 2;
  }

  return 1;
};

const courseFaqs = [
  {
    question: "Who are these driving courses best suited for?",
    answer: "Our courses are designed for beginners, licensed drivers who want to improve their skills, and anyone preparing for a road or knowledge test.",
  },
  {
    question: "Do I need any driving experience before starting?",
    answer: "No experience is required for beginner courses. Our instructors guide you step-by-step from basic vehicle control to confident road driving.",
  },
  {
    question: "How long does a typical course take?",
    answer: "Course duration depends on your experience and goals. Most learners complete their training in flexible sessions scheduled around their availability.",
  },
  {
    question: "Do you provide a car for lessons and road tests?",
    answer: "Yes. Training vehicles with dual controls are provided for lessons, and you can also use the instructor's vehicle for your road test if needed.",
  },
  {
    question: "Can I book multiple lessons or combine courses?",
    answer: "Yes. Many students combine courses such as Beginner Training with Road Test Preparation to build confidence and improve their chances of passing.",
  },
];

const CourseCard = ({ course }: { course: CourseCatalogItem }) => {
  const { addCourse, items, removeItem, updateQuantity } = useCart();
  const { toast } = useToast();
  const isBlue = course.tone.includes("202121");
  const DeliveryIcon =
    course.deliveryFormat === "In-class" ? GraduationCap : course.deliveryFormat === "In-class + In-car" ? BookOpen : CarFront;
  const courseEntryKey = getCartItemKey("course", course.id, officeLocation.id);
  const courseQuantity = items.find((item) => item.key === courseEntryKey)?.quantity ?? 0;
  const viewCourseClassName = isBlue
    ? "inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-5 py-3 text-xs font-bold text-[#1d52a1] transition-colors hover:bg-white/90 sm:px-7 sm:text-sm"
    : "inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#1d52a1] px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-[#17488d] sm:px-7 sm:text-sm";
  const quantityControlClassName = isBlue
    ? "inline-flex items-center justify-between rounded-full border-2 border-white bg-white px-2 py-1.5 text-[#1d52a1]"
    : "inline-flex items-center justify-between rounded-full border-2 border-[#1d52a1] bg-white px-2 py-1.5 text-[#1d52a1]";
  const removeButtonClassName = isBlue
    ? "inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/60 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-white/10"
    : "inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:border-[#E6242A] hover:text-[#E6242A]";
  const addToCartClassName = isBlue
    ? "inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-full border-2 border-white px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-white hover:text-[#1d52a1] sm:px-7 sm:text-sm"
    : "inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-full border-2 border-[#1d52a1] px-5 py-3 text-xs font-bold text-[#1d52a1] transition-colors hover:bg-[#1d52a1] hover:text-white sm:px-7 sm:text-sm";

  const handleAddCourse = () => {
    addCourse({ courseId: course.id, locationId: officeLocation.id });
    toast({
      title: "Course added to cart",
      description: `${course.title} was added for ${officeLocation.name}.`,
    });
  };

  return (
    <article className={`group flex h-full flex-col overflow-hidden rounded-3xl shadow-sm transition-transform duration-300 hover:-translate-y-1 ${course.tone}`}>
      <div className="overflow-hidden bg-white">
        <img
          src={course.image}
          alt={course.title}
          loading="lazy"
          decoding="async"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="h-auto w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex flex-wrap gap-2">
          <p
            className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-1 text-xs font-bold ${
              isBlue ? "bg-white/20 text-white" : "bg-white text-[#E6242A]"
            }`}
          >
            <BookOpen size={14} /> {course.level}
          </p>
          <p
            className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-1 text-xs font-bold ${
              isBlue
                ? course.deliveryFormat === "In-class"
                  ? "bg-[#E6242A] text-white"
                  : course.deliveryFormat === "In-car"
                    ? "bg-[#F3B233] text-[#202121]"
                    : "bg-white/20 text-white"
                : course.deliveryFormat === "In-class"
                  ? "bg-[#E6242A]/10 text-[#E6242A]"
                  : course.deliveryFormat === "In-car"
                    ? "bg-[#F3B233]/15 text-[#B77900]"
                    : "bg-[#1d52a1]/10 text-[#1d52a1]"
            }`}
          >
            <DeliveryIcon size={14} /> {course.deliveryFormat}
          </p>
        </div>
        <h4 className={`mt-4 text-3xl font-black leading-tight sm:text-4xl ${isBlue ? "text-white" : "text-[#202121]"}`}>
          {course.title}
        </h4>
        <p className={`mt-3 text-base ${isBlue ? "text-white/90" : "text-slate-700"}`}>{course.description}</p>

        <div className="mt-auto pt-6 responsive-cta-row">
          <Link
            to={`/courses/${course.id}`}
            aria-label={`Open ${course.title}`}
            className={viewCourseClassName}
          >
            View course page
            <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${isBlue ? "border-[#1d52a1]/20" : "border-current"}`}>
              <ArrowRight size={11} />
            </span>
          </Link>

          {courseQuantity > 0 ? (
            <div className="flex flex-1 flex-col gap-2">
              <div className={quantityControlClassName}>
                <button
                  type="button"
                  onClick={() => updateQuantity(courseEntryKey, courseQuantity - 1)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#F2F2F2]"
                  aria-label={`Decrease quantity for ${course.title}`}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-sm font-bold">{courseQuantity} in cart</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(courseEntryKey, courseQuantity + 1)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#F2F2F2]"
                  aria-label={`Increase quantity for ${course.title}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItem(courseEntryKey)}
                className={removeButtonClassName}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddCourse}
              className={addToCartClassName}
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

const CourseGrid = ({ courses }: { courses: CourseCatalogItem[] }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      {courses.map((course) => (
        <div key={course.id} className="min-w-0 h-full">
          <CourseCard course={course} />
        </div>
      ))}
    </div>
  );
};

const Courses = () => {
  const coursesQuery = usePublicCourses();
  const courses = coursesQuery.data;
  const [previewColumnCount, setPreviewColumnCount] = useState(getCoursePreviewColumnCount);
  const [showAllCourses, setShowAllCourses] = useState(false);

  useEffect(() => {
    const mediaQueries = [
      window.matchMedia("(min-width: 1024px)"),
      window.matchMedia("(min-width: 640px)"),
    ];

    const updatePreviewColumns = () => {
      setPreviewColumnCount(getCoursePreviewColumnCount());
    };

    updatePreviewColumns();
    mediaQueries.forEach((mediaQuery) => mediaQuery.addEventListener("change", updatePreviewColumns));

    return () => {
      mediaQueries.forEach((mediaQuery) => mediaQuery.removeEventListener("change", updatePreviewColumns));
    };
  }, []);

  const collapsedCourseCount = previewColumnCount === 3 ? 6 : previewColumnCount === 2 ? 4 : 2;
  const visibleCourses = showAllCourses ? courses : courses.slice(0, collapsedCourseCount);
  const shouldShowCourseToggle = courses.length > collapsedCourseCount;

  return (
    <main className="bg-[#ffffff] text-[#202121]">
      <PageNameSection
        eyebrow="Our all-inclusive courses"
        title={<span className="text-white">Choose your course</span>}
        description="We offer practical driving programs for beginners, returning drivers, and students preparing for ICBC road test."
        backgroundImage="https://png.pngtree.com/thumb_back/fh260/background/20220503/pngtree-joyful-driving-school-student-displaying-car-keys-person-auto-driving-photo-image_36266878.jpg"
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">The Program</p>
        <h3 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">Pick Your Learning Path</h3>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
          Each course is practical, confidence-focused, and designed for real road readiness.
        </p>

        <div className="mt-12">
          <CourseGrid courses={visibleCourses} />
        </div>

        {shouldShowCourseToggle ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllCourses((current) => !current)}
              className="rounded-full bg-[#E6242A] px-10 py-3 text-base font-semibold text-white transition-all duration-300 hover:bg-[#C41E23] hover:shadow-[0_10px_25px_rgba(230,36,42,0.35)]"
            >
              {showAllCourses ? "View less" : "View more"}
            </button>
          </div>
        ) : null}
      </section>

      <section className="bg-white pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-6 rounded-[32px] border border-slate-200 bg-[#F2F2F2] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Course quiz</p>
              <h3 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">Need help choosing the right courses?</h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
                Take a short quiz based on your driving stage, weak spots, and goals. We will recommend the courses
                that match your needs only.
              </p>
            </div>

            <Link
              to="/course-quiz"
              className="inline-flex items-center justify-center rounded-full bg-[#E6242A] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#C41E23]"
            >
              Take Course Quiz
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#F2F2F2] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">The Flow</p>
          <h3 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">How You Progress</h3>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {learningPath.map((step, index) => (
              <article key={step.title} className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                <p className="text-sm font-black uppercase tracking-wide text-[#E6242A]">Step {index + 1}</p>
                <h4 className="mt-3 whitespace-pre-line text-3xl font-black text-slate-900">{step.title}</h4>
                <p className="mt-3 text-lg text-slate-600">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl">FAQs</p>
          <h3 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl">Frequently Asked Questions</h3>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
            Quick answers to common questions before you enroll.
          </p>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-white px-6 py-2 shadow-sm sm:px-8">
            <Accordion type="single" collapsible className="w-full">
              {courseFaqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`faq-${index}`} className="border-slate-200">
                  <AccordionTrigger className="text-left text-lg font-semibold text-slate-900 hover:no-underline sm:text-xl">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-slate-600">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <SiteCtaSection
        eyebrow="Ready To Start?"
        title="Drive with confidence."
        description="Learn on real roads with patient instructors and get test-ready with structured lessons."
        actions={
          <>
            <Link to="/contact" className={siteCtaPrimaryClassName}>
              Book a Lesson
            </Link>
            <Link to="/courses" className={siteCtaSecondaryClassName}>
              View Courses
            </Link>
          </>
        }
      />

      <SiteFooter />
    </main>
  );
};

export default Courses;
