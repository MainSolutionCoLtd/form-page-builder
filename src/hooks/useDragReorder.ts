import { useRef, useState } from "react";
import type { DragEvent } from "react";

type ReorderFn = (sectionId: string, fromIdx: number | null, toIdx: number | null) => void;

export function useDragReorder(reorderWithinSection: ReorderFn) {
  const dragRef = useRef<{ sectionId: string | null; index: number | null }>({ sectionId: null, index: null });
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

  function getDropZoneHandlers(sectionId: string, index: number) {
    const dragKey = `${sectionId}:${index}`;
    return {
      onDragOver: (e: DragEvent) => {
        e.preventDefault();
        setDragOverKey(dragKey);
      },
      onDragLeave: () => setDragOverKey(null),
      onDrop: () => {
        if (dragRef.current.sectionId === sectionId) reorderWithinSection(sectionId, dragRef.current.index, index);
        dragRef.current = { sectionId: null, index: null };
        setDragOverKey(null);
      },
    };
  }

  function getDragHandleProps(sectionId: string, index: number) {
    return {
      draggable: true,
      onDragStart: () => {
        dragRef.current = { sectionId, index };
      },
    };
  }

  return { dragOverKey, getDropZoneHandlers, getDragHandleProps };
}
