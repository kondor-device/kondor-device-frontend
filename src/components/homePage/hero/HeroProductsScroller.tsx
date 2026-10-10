"use client";
import React, { useRef, useState } from "react";

const DRAG_THRESHOLD = 5;

interface HeroProductsScrollerProps {
  children: React.ReactNode;
  className?: string;
}

// A row that scrolls sideways. Touch screens and trackpads scroll it natively; with a mouse
// (no scrollbar) it is dragged. A drag does not open the card link it ends on.
export default function HeroProductsScroller({
  children,
  className = "",
}: HeroProductsScrollerProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const drag = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !listRef.current) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: listRef.current.scrollLeft,
      moved: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const state = drag.current;
    if (!state.active || !listRef.current) return;

    const delta = e.clientX - state.startX;
    if (!state.moved && Math.abs(delta) < DRAG_THRESHOLD) return;

    if (!state.moved) {
      state.moved = true;
      setIsDragging(true);
      listRef.current.setPointerCapture(e.pointerId);
    }
    listRef.current.scrollLeft = state.startScroll - delta;
  };

  const endDrag = (e: React.PointerEvent<HTMLUListElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (listRef.current?.hasPointerCapture(e.pointerId)) {
      listRef.current.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  };

  // The click that ends a drag must not follow the link under the cursor
  const onClickCapture = (e: React.MouseEvent<HTMLUListElement>) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <ul
      ref={listRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
      onDragStart={(e) => e.preventDefault()}
      className={`${className} ${
        isDragging ? "cursor-grabbing snap-none" : "snap-x snap-mandatory"
      }`}
    >
      {children}
    </ul>
  );
}
