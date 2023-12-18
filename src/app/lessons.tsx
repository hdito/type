"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type LessonsType = {
  lessonNames: string[];
};

export default function Lessons({ lessonNames }: LessonsType) {
  const lessonsRef = useRef<HTMLAnchorElement[]>([]);
  const [selectedLink, setSelectedLink] = useState(0);

  useEffect(() => {
    if (!lessonsRef.current[selectedLink]) {
      return;
    }
    lessonsRef.current[selectedLink].focus();
  }, [selectedLink]);

  useEffect(() => {
    function handleNavigation(event: KeyboardEvent) {
      if (lessonsRef.current.length === 0) return;
      const supportedKeys = [
        "j",
        "J",
        "k",
        "K",
        "Space",
        "ArrowUp",
        "ArrowDown",
        " ",
      ];
      if (!supportedKeys.includes(event.key)) {
        return;
      }

      switch (event.key) {
        case "j":
        case "J":
        case "ArrowDown": {
          if (selectedLink + 1 === lessonsRef.current.length) {
            setSelectedLink(0);
            break;
          }
          setSelectedLink((prev) => prev + 1);
          break;
        }
        case "k":
        case "K":
        case "ArrowUp": {
          if (selectedLink === 0) {
            setSelectedLink(lessonsRef.current.length - 1);
            break;
          }
          setSelectedLink((prev) => prev - 1);
          break;
        }
        case " ": {
          if (!lessonsRef.current[selectedLink]) break;
          lessonsRef.current[selectedLink].click();
        }
      }
    }
    document.addEventListener("keydown", handleNavigation);
    return () => document.removeEventListener("keydown", handleNavigation);
  }, [selectedLink]);
  return (
    <ul>
      {lessonNames.map((name, index) => (
        <li key={name}>
          <Link
            onMouseEnter={() => setSelectedLink(index)}
            ref={(link) => {
              if (!link) return;
              lessonsRef.current[index] = link;
            }}
            href={`lesson/${name}`}
            className={`block focus-within:outline-none ${
              selectedLink === index ? "bg-black text-white" : ""
            }`}
          >
            {name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
