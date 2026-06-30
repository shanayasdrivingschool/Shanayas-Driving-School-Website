import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypingWordsProps {
  words: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export const TypingWords = ({
  words,
  className,
  typingSpeed = 90,
  deletingSpeed = 55,
  pauseDuration = 1100,
}: TypingWordsProps) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const safeWords = words.length > 0 ? words : [""];
  const currentWord = safeWords[wordIndex % safeWords.length];

  useEffect(() => {
    const atWordEnd = charIndex === currentWord.length;
    const atWordStart = charIndex === 0;

    if (!isDeleting && atWordEnd) {
      const pauseTimer = window.setTimeout(() => setIsDeleting(true), pauseDuration);
      return () => window.clearTimeout(pauseTimer);
    }

    if (isDeleting && atWordStart) {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % safeWords.length);
      return;
    }

    const nextDelay = isDeleting ? deletingSpeed : typingSpeed;
    const step = isDeleting ? -1 : 1;
    const timer = window.setTimeout(() => setCharIndex((prev) => prev + step), nextDelay);
    return () => window.clearTimeout(timer);
  }, [charIndex, currentWord.length, deletingSpeed, isDeleting, pauseDuration, safeWords.length, typingSpeed]);

  const displayWord = currentWord.slice(0, charIndex);

  return (
    <span className={cn("inline-flex items-baseline whitespace-nowrap", className)}>
      <span>{displayWord}</span>
      <span className="ml-0.5 inline-block animate-pulse text-current">|</span>
    </span>
  );
};
