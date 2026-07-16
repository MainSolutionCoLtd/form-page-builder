import { Layers } from "lucide-react";
import type { ChromeShape } from "../i18n/chrome";
import type { StringsShape } from "../i18n/strings";
import type { FieldPatch, Section } from "../types";
import { styles } from "../styles/styles";
import { SectionCard } from "./SectionCard";

export interface CanvasProps {
  sections: Section[];
  activeSectionId: string | null;
  selectedId: string | null;
  dragOverKey: string | null;
  chrome: ChromeShape;
  strings: StringsShape;
  language: string;
  onActivateSection: (sectionId: string) => void;
  onToggleSectionCollapse: (sectionId: string) => void;
  onUpdateSectionTitle: (sectionId: string, value: string) => void;
  onUpdateSectionBackground: (sectionId: string, color: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  onMoveSection: (sectionId: string, dir: 1 | -1) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddSection: () => void;
  onSelectField: (sectionId: string, fieldId: string) => void;
  onFieldChange: (fieldId: string, patch: FieldPatch) => void;
  onMoveField: (fieldId: string, dir: 1 | -1) => void;
  onDuplicateField: (fieldId: string) => void;
  onDeleteField: (fieldId: string) => void;
  getDropZoneHandlers: (sectionId: string, idx: number) => { onDragOver: (e: any) => void; onDragLeave: () => void; onDrop: () => void };
  getDragHandleProps: (sectionId: string, idx: number) => { draggable: boolean; onDragStart: () => void };
}

export function Canvas({
  sections, activeSectionId, selectedId, dragOverKey, chrome, strings, language,
  onActivateSection, onToggleSectionCollapse, onUpdateSectionTitle, onUpdateSectionBackground,
  onDuplicateSection, onMoveSection, onDeleteSection,
  onAddSection, onSelectField, onFieldChange, onMoveField, onDuplicateField, onDeleteField,
  getDropZoneHandlers, getDragHandleProps,
}: CanvasProps) {
  return (
    <div style={styles.canvas}>
      {sections.map((section, sIdx) => (
        <SectionCard
          key={section.id}
          section={section}
          sIdx={sIdx}
          sectionsLength={sections.length}
          isActive={activeSectionId === section.id}
          selectedId={selectedId}
          dragOverKey={dragOverKey}
          chrome={chrome}
          strings={strings}
          language={language}
          onActivate={() => onActivateSection(section.id)}
          onToggleCollapse={() => onToggleSectionCollapse(section.id)}
          onUpdateTitle={(value) => onUpdateSectionTitle(section.id, value)}
          onUpdateBackground={(color) => onUpdateSectionBackground(section.id, color)}
          onDuplicateSection={() => onDuplicateSection(section.id)}
          onMoveSection={(dir) => onMoveSection(section.id, dir)}
          onDeleteSection={() => onDeleteSection(section.id)}
          onSelectField={(fieldId) => onSelectField(section.id, fieldId)}
          onFieldChange={onFieldChange}
          onMoveField={onMoveField}
          onDuplicateField={onDuplicateField}
          onDeleteField={onDeleteField}
          getDropZoneHandlers={getDropZoneHandlers}
          getDragHandleProps={getDragHandleProps}
        />
      ))}
      <button style={styles.addSectionBtn} onClick={onAddSection}><Layers size={14} /> {chrome.addSection}</button>
    </div>
  );
}
