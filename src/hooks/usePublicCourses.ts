import { useQuery } from "@tanstack/react-query";
import { getFallbackPublicCourses, getPublicCourses } from "@/lib/courseService";

export const usePublicCourses = () =>
  useQuery({
    queryKey: ["public-courses"],
    queryFn: getPublicCourses,
    initialData: getFallbackPublicCourses(),
    staleTime: 60_000,
  });