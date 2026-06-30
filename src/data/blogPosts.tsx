import type { ReactNode } from "react";

export type BlogPostData = {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  content: ReactNode;
  relatedSlugs?: string[];
};

export const blogPosts: BlogPostData[] = [
  {
    slug: "pass-road-test",
    title: "How to Pass Your Road Test on the First Try",
    description:
      "Practical tips and common mistakes to avoid so you can walk out of ICBC with your licence in hand.",
    heroImage:
      "https://drivinginstructorblog.com/wp-content/uploads/2021/11/ROAD-TEST-TIPS-FROM-A-STUDENT-DRIVER.png",
    author: "Shanaya's Driving School",
    date: "March 1, 2026",
    readTime: "6 min read",
    category: "Road Test Tips",
    relatedSlugs: ["defensive-driving", "newcomers-guide-bc"],
    content: (
      <>
        <p>
          Passing your road test on the first try is absolutely achievable when you know what to
          expect and have practiced the right way. Here are the key strategies our instructors share
          with every student before test day.
        </p>

        <h2>1. Know the Test Route</h2>
        <p>
          While the exact route may vary, most ICBC road tests follow similar patterns in your local
          area. Practice driving through common test zones - school zones, residential streets,
          intersections with advanced greens, and areas with high pedestrian traffic.
        </p>

        <h2>2. Master the Basics</h2>
        <p>
          Examiners look for smooth vehicle control, proper mirror checks, shoulder checks, and
          consistent speed management. These fundamentals account for the majority of test marks.
        </p>

        <h2>3. Stay Calm and Focused</h2>
        <p>
          Nervousness causes rushed decisions. Take a breath before each manoeuvre, check your
          mirrors methodically, and drive at a pace that feels controlled - not hurried.
        </p>

        <h2>4. Avoid Common Mistakes</h2>
        <ul>
          <li>Forgetting shoulder checks before lane changes</li>
          <li>Rolling through stop signs</li>
          <li>Speeding in school or playground zones</li>
          <li>Not yielding to pedestrians at crosswalks</li>
          <li>Improper hand position on the steering wheel</li>
        </ul>

        <h2>5. Take a Mock Test</h2>
        <p>
          A mock road test with your instructor simulates the real experience. It highlights weak
          spots and builds the confidence you need to perform calmly on the actual day.
        </p>

        <blockquote>
          "Practice doesn't make perfect - it makes <strong>prepared</strong>."
        </blockquote>

        <p>
          At Shanaya's Driving School, our structured road test preparation has helped hundreds of
          students pass on their first attempt. Book a lesson today and let us help you get there.
        </p>
      </>
    ),
  },
  {
    slug: "defensive-driving",
    title: "Defensive Driving: Skills That Keep You Safe",
    description:
      "Learn the core defensive driving habits our instructors teach every student - from hazard scanning to safe following distances.",
    heroImage:
      "https://media-blog.zutobi.com/wp-content/uploads/sites/2/2021/06/14165940/WHAT-IS-DEFENSIVE-DRIVING-scaled.jpg",
    author: "Shanaya's Driving School",
    date: "February 20, 2026",
    readTime: "5 min read",
    category: "Driving Skills",
    relatedSlugs: ["pass-road-test", "newcomers-guide-bc"],
    content: (
      <>
        <p>
          Defensive driving is about anticipating hazards before they become emergencies. It's the
          difference between reacting and being prepared.
        </p>

        <h2>What Is Defensive Driving?</h2>
        <p>
          Defensive driving means staying aware of your surroundings, predicting what other drivers
          might do, and keeping a safe margin of error at all times.
        </p>

        <h2>Key Habits to Develop</h2>
        <ul>
          <li>
            <strong>Scan ahead:</strong> Look 12-15 seconds down the road, not just at the car in
            front of you.
          </li>
          <li>
            <strong>Check mirrors frequently:</strong> Every 5-8 seconds, glance at your mirrors to
            stay aware of traffic around you.
          </li>
          <li>
            <strong>Maintain safe following distance:</strong> Keep at least 3 seconds of space
            between you and the vehicle ahead.
          </li>
          <li>
            <strong>Expect the unexpected:</strong> Assume other drivers may make mistakes - be
            ready to respond safely.
          </li>
        </ul>

        <h2>Why It Matters</h2>
        <p>
          Defensive driving reduces accidents, lowers insurance costs, and builds the kind of
          confidence that lasts a lifetime. It's a core part of every lesson at Shanaya's Driving
          School.
        </p>
      </>
    ),
  },
  {
    slug: "newcomers-guide-bc",
    title: "A Newcomer's Guide to Driving in BC",
    description:
      "Moving to British Columbia? Here's everything you need to know about getting your BC driver's licence and staying road-legal.",
    heroImage:
      "https://imgv2-2-f.scribdassets.com/img/document/590636925/original/b9ac4ae164/1?v=1",
    author: "Shanaya's Driving School",
    date: "February 10, 2026",
    readTime: "7 min read",
    category: "Newcomer Resources",
    relatedSlugs: ["pass-road-test", "defensive-driving"],
    content: (
      <>
        <p>
          If you've recently moved to British Columbia, understanding the local driving rules and
          licensing process is one of the first things to take care of. Here's a clear guide to help
          you get started.
        </p>

        <h2>Step 1: Visit an ICBC Driver Licensing Office</h2>
        <p>
          Within 90 days of becoming a BC resident, you must obtain a BC driver's licence. Bring
          your current licence, two pieces of ID, and proof of residency.
        </p>

        <h2>Step 2: Understand the Graduated Licensing Program</h2>
        <p>
          BC uses a graduated licensing system (GLP). Depending on your existing experience, you may
          need to complete the Learner (L) and Novice (N) stages before receiving a full licence.
        </p>

        <h2>Step 3: Learn BC-Specific Rules</h2>
        <ul>
          <li>Right turns on red are allowed (unless posted otherwise)</li>
          <li>School zones are 30 km/h during posted hours</li>
          <li>Playground zones are 30 km/h dawn to dusk</li>
          <li>Distracted driving laws are strictly enforced</li>
          <li>Winter tires are required on many highways from October to April</li>
        </ul>

        <h2>Step 4: Consider Professional Lessons</h2>
        <p>
          Even experienced international drivers benefit from professional lessons to understand
          local road culture, signage differences, and defensive driving techniques used in BC.
        </p>

        <blockquote>
          "Learning the local rules is the fastest way to feel confident on BC roads."
        </blockquote>
      </>
    ),
  },
];
