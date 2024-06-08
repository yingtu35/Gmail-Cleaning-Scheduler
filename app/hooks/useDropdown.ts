'use client'

import { useState, useEffect, useRef, RefObject } from "react";

export default function useDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef: RefObject<HTMLDivElement> = useRef(null);

  function handleClickItem() {
    setOpen(!open);
  }

  function handleClickOutside(event: any) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return { open, handleClickItem, dropdownRef };
}