import { useState } from "react";
import { PartyPopper, X, CircleAlert } from "lucide-react";
import type { ChromeShape } from "../i18n/chrome";
import type { StringsShape } from "../i18n/strings";
import type { ButtonField, FieldPatch, LocalizedString, Section, SubmitPayload } from "../types";
import { buildDeviceOptions, effectiveWidth, WIDTH_PERCENT, ALIGN_MAP } from "../constants/layout";
import { getMeta } from "../constants/fieldTypes";
import { validateField } from "../lib/validate";
import { formatValue } from "../lib/format";
import { collectFieldValues } from "../lib/collectSubmission";
import { t } from "../lib/bilingual";
import { styles } from "../styles/styles";
import { Segmented } from "./Segmented";
import { FieldBlock } from "./fields/FieldBlock";

export interface PreviewPaneProps {
  title: LocalizedString;
  sections: Section[];
  onFieldChange: (fieldId: string, patch: FieldPatch) => void;
  language: string;
  strings: StringsShape;
  chrome: ChromeShape;
  baseMaxWidth: number;
  onSubmit?: (payload: SubmitPayload) => void;
}

interface SubmittedRow {
  label: string;
  value: string;
}

export function PreviewPane({ title, sections, onFieldChange, language, strings, chrome, baseMaxWidth, onSubmit }: PreviewPaneProps) {
  const [device, setDevice] = useState<"laptop" | "tablet" | "mobile">("laptop");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<SubmittedRow[] | null>(null);
  const [attemptedButtonId, setAttemptedButtonId] = useState<string | null>(null);
  const deviceOptions = buildDeviceOptions(baseMaxWidth, chrome);
  const maxWidth = (deviceOptions.find((d) => d.value === device) || deviceOptions[0]).maxWidth;
  const allFields = sections.flatMap((s) => s.fields);

  function runValidation(fields: typeof allFields) {
    const errs: Record<string, string> = {};
    fields.forEach((f) => {
      const e = validateField(f, (f as any).defaultValue, strings);
      if (e) errs[f.id] = e;
    });
    return errs;
  }

  function buildSectionsBreakdown() {
    return sections.map((s) => ({ sectionId: s.id, values: collectFieldValues(s.fields) }));
  }

  function handleSubmitAll(buttonId: string) {
    const errs = runValidation(allFields);
    setErrors(errs);
    setAttemptedButtonId(buttonId);
    if (Object.keys(errs).length > 0) { setSubmitted(null); return; }
    setSubmitted(allFields.filter((f) => !getMeta(f.type).isContent).map((f) => ({ label: t(f.label, language), value: formatValue(f, language) })));
    const sectionsBreakdown = buildSectionsBreakdown();
    const all = collectFieldValues(allFields);
    onSubmit?.({ buttonId, scope: "form", values: all, sections: sectionsBreakdown, all });
  }

  function handleSubmitSection(section: Section, buttonId: string) {
    const errs = runValidation(section.fields);
    setErrors((prev) => {
      const next = { ...prev };
      section.fields.forEach((f) => delete next[f.id]);
      return { ...next, ...errs };
    });
    setAttemptedButtonId(buttonId);
    if (Object.keys(errs).length > 0) { setSubmitted(null); return; }
    setSubmitted(section.fields.filter((f) => !getMeta(f.type).isContent).map((f) => ({ label: t(f.label, language), value: formatValue(f, language) })));
    const sectionsBreakdown = buildSectionsBreakdown();
    const all = collectFieldValues(allFields);
    onSubmit?.({ buttonId, scope: "section", sectionId: section.id, values: collectFieldValues(section.fields), sections: sectionsBreakdown, all });
  }

  function handleButtonAction(field: ButtonField) {
    if (field.action === "link") {
      if (field.href) window.open(field.href, field.target === "_blank" ? "_blank" : "_self", field.target === "_blank" ? "noopener,noreferrer" : undefined);
      return;
    }
    if (field.submitScope === "section") {
      const section = sections.find((s) => s.fields.some((f) => f.id === field.id));
      if (section) handleSubmitSection(section, field.id);
    } else {
      handleSubmitAll(field.id);
    }
  }

  return (
    <div style={styles.previewWrap}>
      <div style={{ width: "100%", maxWidth, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={styles.previewToolbar}><Segmented options={deviceOptions} value={device} onChange={setDevice} /></div>
        <div style={{ ...styles.previewCard, maxWidth, width: "100%" }}>
          <h2 style={styles.previewTitle}>{t(title, language)}</h2>
          {allFields.length === 0 && <p style={{ color: "var(--fb-muted)", fontSize: 14 }}>{strings.addFieldsHint}</p>}

          {sections.map((section) => {
            return (
              <div key={section.id} style={{ background: section.background || "transparent", padding: section.background ? 16 : 0, borderRadius: section.background ? 10 : 0, marginBottom: "var(--fb-space-section)" }}>
                {t(section.title, language) && <h3 style={styles.sectionRuntimeTitle}>{t(section.title, language)}</h3>}
                <div style={styles.previewGrid}>
                  {section.fields.map((field) => {
                    const width = effectiveWidth(field.width, device);
                    const flexBasis = `1 1 calc(${WIDTH_PERCENT[width]} - 14px)`;
                    return (
                      <div key={field.id} style={{ flex: flexBasis, minWidth: 0, alignSelf: ALIGN_MAP[field.verticalAlign || "top"] }}>
                        <FieldBlock field={field} lang={language} onFieldChange={onFieldChange} strings={strings} chrome={chrome} error={errors[field.id]} onButtonAction={handleButtonAction} />
                        {field.type === "button" && field.id === attemptedButtonId && Object.keys(errors).length > 0 && (
                          <p style={styles.formErrorNote}><CircleAlert size={13} /> {strings.fixErrors}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {submitted && (
        <div style={styles.modalOverlay} onClick={() => setSubmitted(null)}>
          <div style={{ ...styles.modal, width: 420 }} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span style={{ fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 7 }}><PartyPopper size={15} color="var(--fb-primary)" /> {strings.submittedTitle}</span>
              <button style={styles.iconBtn} onClick={() => setSubmitted(null)}><X size={16} /></button>
            </div>
            <div style={{ padding: 16 }}>
              <p style={{ fontSize: 12.5, color: "var(--fb-muted)", marginTop: 0 }}>{strings.submittedBody}</p>
              <div style={styles.submittedList}>
                {submitted.map((row, i) => (<div key={i} style={styles.submittedRow}><span style={styles.submittedLabel}>{row.label}</span><span style={styles.submittedValue}>{row.value}</span></div>))}
              </div>
              <button style={{ ...styles.primaryBtn, width: "100%", justifyContent: "center", marginTop: 14 }} onClick={() => setSubmitted(null)}>{strings.close}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
