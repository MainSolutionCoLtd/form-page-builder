import React, { useState, useRef, useEffect } from "react";
import {
  Type, Mail, Phone, Hash, Lock, AlignLeft, AlignCenter, AlignRight, ChevronDown,
  ChevronRight, Circle, CheckSquare, ToggleLeft, Calendar, Clock, Copy, Trash2, Eye, Code2, Plus,
  X, GripVertical, ArrowUp, ArrowDown, Check, ClipboardCopy, Pencil,
  Save, FolderOpen, FilePlus2, Loader2, AlertCircle, ListChecks, FileText,
  User, MapPin, Building2, Globe, CreditCard, Star, Flag, Home,
  Briefcase, Monitor, Tablet, Smartphone, Image as ImageIcon,
  CircleAlert, PartyPopper, Bold, Italic, Languages, Layers, Settings, RotateCcw, Ruler,
} from "lucide-react";

// Design tokens (colors + layout) and runtime/builder strings — the
// package's override surface. Form content itself is bilingual per-field
// (see bi/t/withLang below), independent of these.
const DEFAULT_THEME = {
  primary: "#5B5FEF", primarySoft: "#EEF0FF", danger: "#C4432E", dangerSoft: "#FDECE4",
  ink: "#1B1E24", muted: "#9296A3", border: "#E2E4E9", surface: "#FFFFFF",
  canvas: "#F5F6F8", pageBackground: "#FFFFFF",
  layout: { maxWidth: 640, pagePadding: 28, canvasPadding: 20, sectionGap: 20, fieldGap: 16, toolbarPadding: 10, panelPadding: 14, ticketPadding: 14 },
};

const DEFAULT_LANGUAGES = [{ code: "en", label: "EN" }, { code: "ja", label: "日本語" }];

const DEFAULT_STRINGS = {
  en: {
    submit: "Submit", selectPlaceholder: "Select...", requiredError: "This field is required.",
    invalidEmail: "Enter a valid email address.", invalidPhone: "Enter a valid phone number.",
    fixErrors: "Please fix the highlighted fields before submitting.", submittedTitle: "Form submitted",
    submittedBody: "Here's what would be sent to your backend:", addFieldsHint: "Add fields in Build mode to see them here.",
    close: "Close",
    tooLong: (n) => `Must be ${n} characters or fewer.`,
    tooSmall: (n) => `Must be at least ${n}.`,
    tooLarge: (n) => `Must be at most ${n}.`,
  },
  ja: {
    submit: "送信", selectPlaceholder: "選択してください", requiredError: "この項目は必須です。",
    invalidEmail: "有効なメールアドレスを入力してください。", invalidPhone: "有効な電話番号を入力してください。",
    fixErrors: "入力内容をご確認のうえ、再度送信してください。", submittedTitle: "送信完了",
    submittedBody: "バックエンドに送信される内容は以下の通りです：", addFieldsHint: "ビルドモードでフィールドを追加すると、ここに表示されます。",
    close: "閉じる",
    tooLong: (n) => `${n}文字以内で入力してください。`,
    tooSmall: (n) => `${n}以上の値を入力してください。`,
    tooLarge: (n) => `${n}以下の値を入力してください。`,
  },
};

const CHROME = {
  en: {
    contentBlocks: "Content", formFields: "Form Fields", addingTo: "Adding to",
    properties: "Properties", selectFieldHint: "Select a field to edit its properties.",
    label: "Label", hideLabel: "Hide label", inputType: "Input type", content: "Content",
    headingStyle: "Heading style", typography: "Typography", style: "Style", align: "Align",
    color: "Color", imageUrl: "Image URL",
    imageUrlHelper: "Upload the image on your own end (Drive, CDN, S3...) and paste the link here — this package doesn't host images.",
    altText: "Alt text", linkOptional: "Link (optional)", shape: "Shape",
    placeholder: "Placeholder", maxLength: "Max length", noLimit: "No limit",
    minValue: "Min value", maxValue: "Max value", options: "Options", addOption: "Add option",
    defaultValue: "Default value", defaultChecked: "Default checked", checked: "Checked",
    unchecked: "Unchecked", none: "None", requiredField: "Required field", layout: "Layout",
    width: "Width", full: "Full", labelPosition: "Label position", above: "Above",
    inline: "Inline", verticalAlign: "Vertical align", top: "Top", middle: "Middle",
    bottom: "Bottom", icon: "Icon", showIcon: "Show icon next to label",
    deleteField: "Delete field", build: "Build", preview: "Preview", newForm: "New",
    myForms: "My forms", save: "Save", viewJson: "View JSON", saving: "Saving...",
    saved: "Saved", saveFailed: "Save failed", startNewForm: "Start a new form",
    openSavedForm: "Open a saved form", saveToLibraryTitle: "Save this form to your library",
    sectionTitlePlaceholder: (n) => `Section ${n} title (optional)`,
    noFieldsInSection: "No fields in this section yet — pick a field type on the left.",
    addSection: "Add section", moveUp: "Move up", moveDown: "Move down",
    duplicate: "Duplicate", delete: "Delete", deleteSection: "Delete section",
    required: "required", formJson: "Form JSON", copy: "Copy", copied: "Copied",
    nothingSaved: "Nothing saved yet. Click \"Save\" in the toolbar to store this form here.",
    updated: "Updated", open: "Open", saveForm: "Save form", formName: "Form name",
    saveToLibrary: "Save to library", loadingDraft: "Loading your draft...",
    current: "current", customColor: "Custom color",
    fieldsCount: (n) => `${n} field${n === 1 ? "" : "s"}`,
    formSettings: "Form settings", submitLabel: "Submit button text",
    submitMode: "Submit button", combined: "Combined (one button)", perSection: "Per section",
    settings: "Form settings",
    fieldTypeInput: "Input", fieldTypeTextarea: "Textarea", fieldTypeSelect: "Select",
    fieldTypeRadio: "Radio group", fieldTypeCheckboxGroup: "Checkbox group",
    fieldTypeCheckbox: "Checkbox", fieldTypeToggle: "Toggle", fieldTypeParagraph: "Paragraph",
    fieldTypeImage: "Image",
    subtypeText: "Text", subtypeEmail: "Email", subtypePhone: "Phone", subtypeNumber: "Number",
    subtypePassword: "Password", subtypeDate: "Date", subtypeTime: "Time",
    shapeSquare: "Square", shapeCircle: "Circle", shapeBanner: "Banner",
    tagBody: "Body", tagCaption: "Caption",
    submitSectionTitle: "Submit", submitStyle: "Submit button style", buttonSize: "Size",
    theme: "Theme", primaryColor: "Primary color", pageBackground: "Page background",
    maxWidthPx: "Max width (px)", reset: "Reset",
    deviceLaptop: "Laptop", deviceTablet: "Tablet", deviceMobile: "Mobile",
    untitledField: "Untitled field", optionSeed: (n) => `Option ${n}`,
    spacing: "Spacing", spacingPagePadding: "Page padding", spacingCanvasPadding: "Canvas padding",
    spacingSectionGap: "Section gap", spacingFieldGap: "Field gap", spacingToolbarPadding: "Toolbar padding",
    spacingPanelPadding: "Panel padding", spacingTicketPadding: "Field padding",
  },
  ja: {
    contentBlocks: "コンテンツ", formFields: "フォーム項目", addingTo: "追加先",
    properties: "プロパティ", selectFieldHint: "編集するフィールドを選択してください。",
    label: "ラベル", hideLabel: "ラベルを非表示", inputType: "入力タイプ", content: "内容",
    headingStyle: "見出しスタイル", typography: "文字スタイル", style: "スタイル", align: "配置",
    color: "色", imageUrl: "画像URL",
    imageUrlHelper: "画像は各自でアップロード（Drive、CDN、S3など）し、そのURLをここに貼り付けてください。本パッケージは画像を保存しません。",
    altText: "代替テキスト", linkOptional: "リンク（任意）", shape: "形状",
    placeholder: "プレースホルダー", maxLength: "最大文字数", noLimit: "制限なし",
    minValue: "最小値", maxValue: "最大値", options: "選択肢", addOption: "選択肢を追加",
    defaultValue: "初期値", defaultChecked: "初期選択", checked: "オン",
    unchecked: "オフ", none: "なし", requiredField: "必須項目", layout: "レイアウト",
    width: "幅", full: "全幅", labelPosition: "ラベル位置", above: "上",
    inline: "横並び", verticalAlign: "垂直位置", top: "上", middle: "中央",
    bottom: "下", icon: "アイコン", showIcon: "ラベル横にアイコンを表示",
    deleteField: "フィールドを削除", build: "作成", preview: "プレビュー", newForm: "新規",
    myForms: "マイフォーム", save: "保存", viewJson: "JSONを表示", saving: "保存中...",
    saved: "保存済み", saveFailed: "保存に失敗しました", startNewForm: "新しいフォームを作成",
    openSavedForm: "保存済みフォームを開く", saveToLibraryTitle: "このフォームをライブラリに保存",
    sectionTitlePlaceholder: (n) => `セクション${n}のタイトル（任意）`,
    noFieldsInSection: "このセクションにはまだフィールドがありません。左のパネルからフィールドを選んでください。",
    addSection: "セクションを追加", moveUp: "上へ移動", moveDown: "下へ移動",
    duplicate: "複製", delete: "削除", deleteSection: "セクションを削除",
    required: "必須", formJson: "フォームJSON", copy: "コピー", copied: "コピーしました",
    nothingSaved: "まだ保存されていません。ツールバーの「保存」をクリックしてください。",
    updated: "更新日時", open: "開く", saveForm: "フォームを保存", formName: "フォーム名",
    saveToLibrary: "ライブラリに保存", loadingDraft: "下書きを読み込んでいます...",
    current: "現在編集中", customColor: "カスタムカラー",
    fieldsCount: (n) => `${n}件のフィールド`,
    formSettings: "フォーム設定", submitLabel: "送信ボタンのテキスト",
    submitMode: "送信ボタンの表示", combined: "まとめて1つ", perSection: "セクションごと",
    settings: "フォーム設定",
    fieldTypeInput: "入力", fieldTypeTextarea: "テキストエリア", fieldTypeSelect: "セレクト",
    fieldTypeRadio: "ラジオボタン", fieldTypeCheckboxGroup: "チェックボックスグループ",
    fieldTypeCheckbox: "チェックボックス", fieldTypeToggle: "トグル", fieldTypeParagraph: "段落",
    fieldTypeImage: "画像",
    subtypeText: "テキスト", subtypeEmail: "メール", subtypePhone: "電話番号", subtypeNumber: "数値",
    subtypePassword: "パスワード", subtypeDate: "日付", subtypeTime: "時刻",
    shapeSquare: "正方形", shapeCircle: "円形", shapeBanner: "バナー",
    tagBody: "本文", tagCaption: "キャプション",
    submitSectionTitle: "送信", submitStyle: "送信ボタンのスタイル", buttonSize: "サイズ",
    theme: "テーマ", primaryColor: "メインカラー", pageBackground: "ページ背景色",
    maxWidthPx: "最大幅（px）", reset: "リセット",
    deviceLaptop: "パソコン", deviceTablet: "タブレット", deviceMobile: "モバイル",
    untitledField: "名称未設定のフィールド", optionSeed: (n) => `選択肢${n}`,
    spacing: "余白設定", spacingPagePadding: "ページ余白", spacingCanvasPadding: "キャンバス余白",
    spacingSectionGap: "セクション間隔", spacingFieldGap: "フィールド間隔", spacingToolbarPadding: "ツールバー余白",
    spacingPanelPadding: "パネル余白", spacingTicketPadding: "フィールド内余白",
  },
};

const DRAFT_KEY = "form-builder:draft";
const INDEX_KEY = "form-builder:index";
const formKey = (id) => `form-builder:saved:${id}`;
const genFormId = () => `form_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
const genSectionId = () => `section_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
const hasStorage = typeof window !== "undefined" && !!window.storage;

const bi = (en = "", ja = "") => ({ en, ja });
function t(val, lang) {
  if (val && typeof val === "object") return val[lang] || val.en || "";
  return val || "";
}
function withLang(val, lang, value) {
  const base = val && typeof val === "object" ? val : bi(typeof val === "string" ? val : "");
  return { ...base, [lang]: value };
}

const ICON_LIBRARY = {
  Type, Mail, Phone, Hash, Lock, AlignLeft, ChevronDown, Circle, CheckSquare,
  ListChecks, ToggleLeft, Calendar, Clock, User, MapPin, Building2, Globe,
  CreditCard, FileText, Star, Flag, Home, Briefcase,
};

const WIDTH_OPTIONS = [{ value: "1/3", label: "1/3" }, { value: "1/2", label: "1/2" }, { value: "1/1", labelKey: "full" }];
const WIDTH_PERCENT = { "1/3": "33.3333%", "1/2": "50%", "1/1": "100%" };
const ALIGN_MAP = { top: "flex-start", middle: "center", bottom: "flex-end" };
function effectiveWidth(width, device) {
  if (device === "mobile") return "1/1";
  if (device === "tablet" && width === "1/3") return "1/2";
  return width || "1/1";
}

const INPUT_SUBTYPES = ["text", "email", "phone", "number", "password", "date", "time"];
const IMAGE_SHAPES = ["square", "circle", "banner"];
const FONT_SIZE_OPTIONS = [{ value: "sm", label: "S", px: 12 }, { value: "md", label: "M", px: 14 }, { value: "lg", label: "L", px: 18 }, { value: "xl", label: "XL", px: 24 }];
const TEXT_ALIGN_OPTIONS = [{ value: "left", label: "", icon: AlignLeft }, { value: "center", label: "", icon: AlignCenter }, { value: "right", label: "", icon: AlignRight }];
const COLOR_SWATCHES = ["", "#1B1E24", "#5B5FEF", "#C4432E", "#0EA5A4", "#D97706"];
const SECTION_BG_SWATCHES = ["", "#FFFFFF", "#F5F6F8", "#EEF0FF", "#FDF4E7", "#E9F7EF", "#FDECEC"];
const BUTTON_COLOR_SWATCHES = ["", "#5B5FEF", "#0EA5A4", "#D97706", "#C4432E", "#1B1E24"];
const SUBMIT_SIZE_OPTIONS = [{ value: "sm", label: "S" }, { value: "md", label: "M" }, { value: "lg", label: "L" }];
const SUBMIT_SIZE_STYLES = { sm: { padding: "7px 12px", fontSize: 12.5 }, md: { padding: "10px 16px", fontSize: 13.5 }, lg: { padding: "13px 22px", fontSize: 15 } };
function resolveSubmitStyle(style) {
  const sizeStyle = SUBMIT_SIZE_STYLES[style?.size || "md"] || SUBMIT_SIZE_STYLES.md;
  return { ...sizeStyle, background: style?.color || "var(--fb-primary)" };
}

const SPACING_FIELDS = [
  { key: "pagePadding", labelKey: "spacingPagePadding" },
  { key: "canvasPadding", labelKey: "spacingCanvasPadding" },
  { key: "sectionGap", labelKey: "spacingSectionGap" },
  { key: "fieldGap", labelKey: "spacingFieldGap" },
  { key: "toolbarPadding", labelKey: "spacingToolbarPadding" },
  { key: "panelPadding", labelKey: "spacingPanelPadding" },
  { key: "ticketPadding", labelKey: "spacingTicketPadding" },
];

const PARAGRAPH_TAG_OPTIONS = ["h1", "h2", "h3", "p", "caption"];
const TAG_PRESETS = {
  h1: { fontSize: "xl", fontWeight: "bold" }, h2: { fontSize: "lg", fontWeight: "bold" },
  h3: { fontSize: "md", fontWeight: "bold" }, p: { fontSize: "md", fontWeight: "normal" },
  caption: { fontSize: "sm", fontWeight: "normal" },
};
const TAG_TO_ELEMENT = { h1: "h1", h2: "h2", h3: "h3", p: "p", caption: "span" };
const TAG_CHROME_KEY = { p: "tagBody", caption: "tagCaption" };

const FIELD_TYPE_CHROME_KEY = {
  paragraph: "fieldTypeParagraph", image: "fieldTypeImage", input: "fieldTypeInput",
  textarea: "fieldTypeTextarea", select: "fieldTypeSelect", radio: "fieldTypeRadio",
  checkboxGroup: "fieldTypeCheckboxGroup", checkbox: "fieldTypeCheckbox", toggle: "fieldTypeToggle",
};
const INPUT_SUBTYPE_CHROME_KEY = { text: "subtypeText", email: "subtypeEmail", phone: "subtypePhone", number: "subtypeNumber", password: "subtypePassword", date: "subtypeDate", time: "subtypeTime" };
const IMAGE_SHAPE_CHROME_KEY = { square: "shapeSquare", circle: "shapeCircle", banner: "shapeBanner" };

const FIELD_TYPES = [
  { type: "paragraph", icon: FileText, isContent: true, defaultIcon: "FileText" },
  { type: "image", icon: ImageIcon, isContent: true, isImage: true, defaultIcon: "Type" },
  { type: "input", icon: Type, placeholder: true, hasSubtype: true, defaultIcon: "Type" },
  { type: "textarea", icon: AlignLeft, placeholder: true, defaultIcon: "AlignLeft" },
  { type: "select", icon: ChevronDown, options: true, defaultIcon: "ChevronDown" },
  { type: "radio", icon: Circle, options: true, defaultIcon: "Circle" },
  { type: "checkboxGroup", icon: ListChecks, options: true, multiValue: true, defaultIcon: "ListChecks" },
  { type: "checkbox", icon: CheckSquare, boolean: true, defaultIcon: "CheckSquare" },
  { type: "toggle", icon: ToggleLeft, boolean: true, defaultIcon: "ToggleLeft" },
];
const TYPE_MAP = Object.fromEntries(FIELD_TYPES.map((f) => [f.type, f]));
const CONTENT_TYPES = FIELD_TYPES.filter((f) => f.isContent);
const FORM_TYPES = FIELD_TYPES.filter((f) => !f.isContent);
function getMeta(type) { return TYPE_MAP[type] || TYPE_MAP.input; }

const LEGACY_INPUT_TYPES = ["text", "email", "phone", "number", "password", "date"];

let idCounter = 1;
const nextId = () => `field_${idCounter++}`;
function resyncIdCounter(fields) {
  let max = 0;
  fields.forEach((f) => {
    const m = /^field_(\d+)$/.exec(f.id);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  idCounter = Math.max(idCounter, max + 1);
}

function defaultFieldFor(type, language, chrome) {
  const meta = getMeta(type);
  const seedLabel = chrome[FIELD_TYPE_CHROME_KEY[type]] || type;
  const base = {
    id: nextId(),
    type,
    label: withLang(bi(), language, seedLabel),
    hideLabel: false,
    width: "1/1",
    verticalAlign: "top",
    labelPosition: "top",
    showIcon: false,
    displayIcon: meta.defaultIcon,
  };
  if (!meta.isContent) base.required = false;
  if (meta.hasSubtype) base.inputType = "text";
  if (meta.placeholder) base.placeholder = bi();
  if (meta.options) {
    base.options = [
      { label: withLang(bi(), language, chrome.optionSeed(1)), value: "option_1" },
      { label: withLang(bi(), language, chrome.optionSeed(2)), value: "option_2" },
    ];
  }
  if (meta.isImage) {
    base.src = "";
    base.alt = bi();
    base.link = "";
    base.shape = "square";
  } else if (meta.boolean) {
    base.defaultValue = false;
  } else if (meta.multiValue) {
    base.defaultValue = [];
  } else if (type === "paragraph") {
    base.content = bi();
    base.tag = "p";
    base.fontSize = "md";
    base.fontWeight = "normal";
    base.fontStyle = "normal";
    base.textAlign = "left";
    base.color = "";
  } else {
    base.defaultValue = "";
  }
  return base;
}

function defaultSection(titleEn = "") {
  return { id: genSectionId(), title: bi(titleEn, ""), background: "", collapsed: false, submitStyle: null, fields: [] };
}

function migrateField(field) {
  let f = { ...field };
  if (LEGACY_INPUT_TYPES.includes(f.type)) f = { ...f, type: "input", inputType: f.type };
  f.label = typeof f.label === "string" ? bi(f.label) : f.label || bi();
  f.hideLabel = !!f.hideLabel;
  if ("placeholder" in f) f.placeholder = typeof f.placeholder === "string" ? bi(f.placeholder) : f.placeholder || bi();
  if ("content" in f) f.content = typeof f.content === "string" ? bi(f.content) : f.content || bi();
  if ("alt" in f) f.alt = typeof f.alt === "string" ? bi(f.alt) : f.alt || bi();
  if (f.options) f.options = f.options.map((o) => ({ ...o, label: typeof o.label === "string" ? bi(o.label) : o.label || bi() }));
  if (f.type === "paragraph") {
    f.tag = f.tag || "p";
    f.fontSize = f.fontSize || "md";
    f.fontWeight = f.fontWeight || "normal";
    f.fontStyle = f.fontStyle || "normal";
    f.textAlign = f.textAlign || "left";
    f.color = f.color || "";
  }
  f.verticalAlign = f.verticalAlign || "top";
  return f;
}
function migrateFields(fields) { return (fields || []).map(migrateField); }
function migrateDocument(raw) {
  if (!raw) return null;
  const title = typeof raw.title === "string" ? bi(raw.title) : raw.title || bi();
  const submitLabel = typeof raw.submitLabel === "string" ? bi(raw.submitLabel) : raw.submitLabel || bi();
  const submitMode = raw.submitMode === "perSection" ? "perSection" : "combined";
  const submitStyle = raw.submitStyle || { color: "", size: "md" };
  const themeOverrides = raw.themeOverrides || {};
  if (raw.sections) {
    return {
      title, submitLabel, submitMode, submitStyle, themeOverrides,
      sections: raw.sections.map((s) => ({
        id: s.id || genSectionId(),
        title: typeof s.title === "string" ? bi(s.title) : s.title || bi(),
        background: s.background || "",
        collapsed: !!s.collapsed,
        submitStyle: s.submitStyle || null,
        fields: migrateFields(s.fields || []),
      })),
    };
  }
  return { title, submitLabel, submitMode, submitStyle, themeOverrides, sections: [{ ...defaultSection(), fields: migrateFields(raw.fields || []) }] };
}

function validateField(field, value, strings) {
  const meta = getMeta(field.type);
  if (meta.isContent) return null;
  const isEmpty =
    value === undefined || value === null || value === "" ||
    (Array.isArray(value) && value.length === 0) ||
    (meta.boolean && field.required && value !== true);
  if (field.required && isEmpty) return strings.requiredError;
  if (isEmpty) return null;
  if (field.type === "input" && field.inputType === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return strings.invalidEmail;
  if (field.type === "input" && field.inputType === "phone" && !/^[0-9+\-\s()]{7,20}$/.test(value)) return strings.invalidPhone;
  if (field.type === "input" && field.inputType === "number") {
    const num = Number(value);
    if (field.min !== undefined && field.min !== null && field.min !== "" && num < Number(field.min)) return strings.tooSmall(field.min);
    if (field.max !== undefined && field.max !== null && field.max !== "" && num > Number(field.max)) return strings.tooLarge(field.max);
  }
  if (
    (field.type === "textarea" || (field.type === "input" && !["number", "date", "time"].includes(field.inputType))) &&
    field.maxLength && String(value).length > field.maxLength
  ) {
    return strings.tooLong(field.maxLength);
  }
  return null;
}

function buildDeviceOptions(baseMaxWidth, chrome) {
  const mw = Number(baseMaxWidth) > 0 ? baseMaxWidth : DEFAULT_THEME.layout.maxWidth;
  return [
    { value: "laptop", label: chrome.deviceLaptop, icon: Monitor, maxWidth: mw },
    { value: "tablet", label: chrome.deviceTablet, icon: Tablet, maxWidth: Math.min(mw, 480) },
    { value: "mobile", label: chrome.deviceMobile, icon: Smartphone, maxWidth: Math.min(mw, 340) },
  ];
}

export default function FormBuilder({
  theme: themeOverrideProp,
  language: languageOverride,
  languages = DEFAULT_LANGUAGES,
  strings: stringsOverride,
  chrome: chromeOverride,
  themeEditable = false,
} = {}) {
  const baseTheme = {
    ...DEFAULT_THEME,
    ...(themeOverrideProp || {}),
    layout: { ...DEFAULT_THEME.layout, ...((themeOverrideProp && themeOverrideProp.layout) || {}) },
  };
  const [themeOverrides, setThemeOverrides] = useState({});
  const theme = { ...baseTheme, ...themeOverrides, layout: { ...baseTheme.layout, ...(themeOverrides.layout || {}) } };
  function updateThemeColor(key, value) { setThemeOverrides((prev) => ({ ...prev, [key]: value })); }
  function updateThemeLayout(key, value) { setThemeOverrides((prev) => ({ ...prev, layout: { ...prev.layout, [key]: value } })); }
  function resetTheme() { setThemeOverrides({}); }

  const [language, setLanguage] = useState(languageOverride || languages[0]?.code || "en");
  const strings = { ...(DEFAULT_STRINGS[language] || DEFAULT_STRINGS.en), ...((stringsOverride && stringsOverride[language]) || {}) };
  const chrome = { ...(CHROME[language] || CHROME.en), ...((chromeOverride && chromeOverride[language]) || {}) };

  const [title, setTitle] = useState(bi("Untitled form", ""));
  const [submitLabel, setSubmitLabelState] = useState(bi());
  const [submitMode, setSubmitMode] = useState("combined");
  const [submitStyle, setSubmitStyleState] = useState({ color: "", size: "md" });
  const [sections, setSections] = useState([defaultSection()]);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState("build");
  const [showJson, setShowJson] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLayoutPanel, setShowLayoutPanel] = useState(false);
  const [copied, setCopied] = useState(false);
  const dragRef = useRef({ sectionId: null, index: null });
  const [dragOverKey, setDragOverKey] = useState(null);

  const [currentFormId, setCurrentFormId] = useState(null);
  const [loadingDraft, setLoadingDraft] = useState(true);
  const [saveState, setSaveState] = useState("idle");
  const [savedForms, setSavedForms] = useState([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showSaveAs, setShowSaveAs] = useState(false);
  const [saveAsName, setSaveAsName] = useState("");
  const autosaveTimer = useRef(null);
  const hasLoadedOnce = useRef(false);

  const allFields = sections.flatMap((s) => s.fields);
  const selected = allFields.find((f) => f.id === selectedId) || null;
  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0] || defaultSection();

  useEffect(() => {
    if (!hasStorage) { setLoadingDraft(false); hasLoadedOnce.current = true; return; }
    (async () => {
      try {
        const result = await window.storage.get(DRAFT_KEY, false);
        if (result && result.value) {
          const raw = JSON.parse(result.value);
          const doc = migrateDocument(raw);
          if (doc) {
            resyncIdCounter(doc.sections.flatMap((s) => s.fields));
            setSections(doc.sections);
            setActiveSectionId(doc.sections[0]?.id || null);
            setTitle(doc.title);
            setSubmitLabelState(doc.submitLabel);
            setSubmitMode(doc.submitMode);
            setSubmitStyleState(doc.submitStyle);
            setThemeOverrides(doc.themeOverrides);
          }
          if (raw.currentFormId) setCurrentFormId(raw.currentFormId);
        } else {
          setActiveSectionId((prev) => prev || sections[0]?.id);
        }
      } catch (err) {
        setActiveSectionId((prev) => prev || sections[0]?.id);
      } finally {
        setLoadingDraft(false);
        hasLoadedOnce.current = true;
      }
    })();
    refreshLibrary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refreshLibrary() {
    if (!hasStorage) { setSavedForms([]); return; }
    try {
      const result = await window.storage.get(INDEX_KEY, false);
      const list = result && result.value ? JSON.parse(result.value) : [];
      setSavedForms(list.sort((a, b) => b.updatedAt - a.updatedAt));
    } catch (err) {
      setSavedForms([]);
    }
  }

  useEffect(() => {
    if (!hasLoadedOnce.current || !hasStorage) return;
    setSaveState("saving");
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(async () => {
      try {
        await window.storage.set(DRAFT_KEY, JSON.stringify({ title, submitLabel, submitMode, submitStyle, themeOverrides, sections, currentFormId }), false);
        setSaveState("saved");
      } catch (err) {
        setSaveState("error");
      }
    }, 600);
    return () => clearTimeout(autosaveTimer.current);
  }, [title, submitLabel, submitMode, submitStyle, themeOverrides, sections, currentFormId]);

  async function saveAs(name) {
    if (!hasStorage) return;
    const id = genFormId();
    const now = Date.now();
    try {
      await window.storage.set(formKey(id), JSON.stringify({ id, title: bi(name, ""), submitLabel, submitMode, submitStyle, themeOverrides, sections, updatedAt: now }), false);
      const next = [...savedForms, { id, title: name, updatedAt: now }];
      await window.storage.set(INDEX_KEY, JSON.stringify(next), false);
      setSavedForms(next);
      setCurrentFormId(id);
      setTitle(bi(name, ""));
      setShowSaveAs(false);
      setSaveAsName("");
    } catch (err) {
      alert("Couldn't save the form. Please try again.");
    }
  }

  async function saveExisting() {
    if (!hasStorage) return;
    if (!currentFormId) {
      setSaveAsName(t(title, language));
      setShowSaveAs(true);
      return;
    }
    const now = Date.now();
    try {
      await window.storage.set(formKey(currentFormId), JSON.stringify({ id: currentFormId, title, submitLabel, submitMode, submitStyle, themeOverrides, sections, updatedAt: now }), false);
      const next = savedForms.map((f) => (f.id === currentFormId ? { ...f, title: t(title, "en"), updatedAt: now } : f));
      setSavedForms(next);
      await window.storage.set(INDEX_KEY, JSON.stringify(next), false);
    } catch (err) {
      alert("Couldn't save the form. Please try again.");
    }
  }

  async function loadForm(id) {
    if (!hasStorage) return;
    try {
      const result = await window.storage.get(formKey(id), false);
      if (!result || !result.value) return;
      const doc = migrateDocument(JSON.parse(result.value));
      resyncIdCounter(doc.sections.flatMap((s) => s.fields));
      setSections(doc.sections);
      setActiveSectionId(doc.sections[0]?.id || null);
      setTitle(doc.title);
      setSubmitLabelState(doc.submitLabel);
      setSubmitMode(doc.submitMode);
      setSubmitStyleState(doc.submitStyle);
      setThemeOverrides(doc.themeOverrides);
      setCurrentFormId(id);
      setSelectedId(null);
      setShowLibrary(false);
    } catch (err) {
      alert("Couldn't load that form.");
    }
  }

  async function deleteForm(id) {
    if (!hasStorage) return;
    try {
      await window.storage.delete(formKey(id), false);
      const next = savedForms.filter((f) => f.id !== id);
      setSavedForms(next);
      await window.storage.set(INDEX_KEY, JSON.stringify(next), false);
      if (currentFormId === id) setCurrentFormId(null);
    } catch (err) {
      // Non-critical.
    }
  }

  function newForm() {
    const s = defaultSection();
    setSections([s]);
    setActiveSectionId(s.id);
    setTitle(bi("Untitled form", ""));
    setSubmitLabelState(bi());
    setSubmitMode("combined");
    setSubmitStyleState({ color: "", size: "md" });
    setCurrentFormId(null);
    setSelectedId(null);
  }

  function updateTitle(value) { setTitle((prev) => withLang(prev, language, value)); }
  function updateSubmitLabel(value) { setSubmitLabelState((prev) => withLang(prev, language, value)); }
  function updateSubmitStyle(patch) { setSubmitStyleState((prev) => ({ ...prev, ...patch })); }

  function addSection() {
    const s = defaultSection();
    setSections((prev) => [...prev, s]);
    setActiveSectionId(s.id);
  }
  function duplicateSection(sectionId) {
    const newSectionId = genSectionId();
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === sectionId);
      if (idx === -1) return prev;
      const copy = { ...prev[idx], id: newSectionId, fields: prev[idx].fields.map((f) => ({ ...f, id: nextId() })) };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
    setActiveSectionId(newSectionId);
  }
  function deleteSection(sectionId) {
    setSections((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((s) => s.id !== sectionId);
      setActiveSectionId((curr) => (curr === sectionId ? next[0].id : curr));
      return next;
    });
  }
  function moveSection(sectionId, dir) {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === sectionId);
      const swap = idx + dir;
      if (swap < 0 || swap >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }
  function updateSectionTitle(sectionId, value) {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, title: withLang(s.title, language, value) } : s)));
  }
  function updateSectionBackground(sectionId, color) {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, background: color } : s)));
  }
  function toggleSectionCollapse(sectionId) {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, collapsed: !s.collapsed } : s)));
  }
  function updateSectionSubmitStyle(sectionId, patch) {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, submitStyle: { ...(s.submitStyle || submitStyle), ...patch } } : s)));
  }
  function clearSectionSubmitStyle(sectionId) {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, submitStyle: null } : s)));
  }

  function addField(type) {
    const field = defaultFieldFor(type, language, chrome);
    const targetId = activeSectionId || sections[0]?.id;
    if (!targetId) return;
    setSections((prev) => prev.map((s) => (s.id === targetId ? { ...s, fields: [...s.fields, field] } : s)));
    setSelectedId(field.id);
  }
  function updateField(fieldId, patch) {
    setSections((prev) => prev.map((s) => ({ ...s, fields: s.fields.map((f) => (f.id === fieldId ? { ...f, ...patch } : f)) })));
  }
  function deleteField(fieldId) {
    setSections((prev) => prev.map((s) => ({ ...s, fields: s.fields.filter((f) => f.id !== fieldId) })));
    if (selectedId === fieldId) setSelectedId(null);
  }
  function duplicateField(fieldId) {
    const newId = nextId();
    setSections((prev) => prev.map((s) => {
      const idx = s.fields.findIndex((f) => f.id === fieldId);
      if (idx === -1) return s;
      const copy = { ...s.fields[idx], id: newId };
      const fields = [...s.fields];
      fields.splice(idx + 1, 0, copy);
      return { ...s, fields };
    }));
    setSelectedId(newId);
  }
  function moveField(fieldId, dir) {
    setSections((prev) => prev.map((s) => {
      const idx = s.fields.findIndex((f) => f.id === fieldId);
      if (idx === -1) return s;
      const swap = idx + dir;
      if (swap < 0 || swap >= s.fields.length) return s;
      const fields = [...s.fields];
      [fields[idx], fields[swap]] = [fields[swap], fields[idx]];
      return { ...s, fields };
    }));
  }
  function reorderWithinSection(sectionId, fromIdx, toIdx) {
    if (fromIdx === toIdx || fromIdx == null || toIdx == null) return;
    setSections((prev) => prev.map((s) => {
      if (s.id !== sectionId) return s;
      const fields = [...s.fields];
      const [moved] = fields.splice(fromIdx, 1);
      fields.splice(toIdx, 0, moved);
      return { ...s, fields };
    }));
  }
  function updateOption(fieldId, optIdx, patch) {
    setSections((prev) => prev.map((s) => ({
      ...s,
      fields: s.fields.map((f) => {
        if (f.id !== fieldId || !f.options) return f;
        return { ...f, options: f.options.map((o, i) => (i === optIdx ? { ...o, ...patch } : o)) };
      }),
    })));
  }
  function addOption(fieldId) {
    setSections((prev) => prev.map((s) => ({
      ...s,
      fields: s.fields.map((f) => {
        if (f.id !== fieldId || !f.options) return f;
        const n = f.options.length + 1;
        return { ...f, options: [...f.options, { label: withLang(bi(), language, chrome.optionSeed(n)), value: `option_${n}` }] };
      }),
    })));
  }
  function removeOption(fieldId, optIdx) {
    setSections((prev) => prev.map((s) => ({
      ...s,
      fields: s.fields.map((f) => (f.id !== fieldId || !f.options ? f : { ...f, options: f.options.filter((_, i) => i !== optIdx) })),
    })));
  }

  const jsonDoc = {
    version: 4,
    title, submitLabel, submitMode, submitStyle, themeOverrides,
    sections: sections.map((s) => ({ id: s.id, title: s.title, background: s.background, collapsed: s.collapsed, submitStyle: s.submitStyle, fields: s.fields })),
  };
  const jsonString = JSON.stringify(jsonDoc, null, 2);

  function copyJson() {
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  }

  return (
    <div
      style={{
        ...styles.app,
        "--fb-primary": theme.primary, "--fb-primary-soft": theme.primarySoft,
        "--fb-danger": theme.danger, "--fb-danger-soft": theme.dangerSoft,
        "--fb-ink": theme.ink, "--fb-muted": theme.muted, "--fb-border": theme.border,
        "--fb-surface": theme.surface, "--fb-canvas": theme.canvas, "--fb-page-bg": theme.pageBackground,
        "--fb-space-page": `${theme.layout.pagePadding}px`, "--fb-space-canvas": `${theme.layout.canvasPadding}px`,
        "--fb-space-section": `${theme.layout.sectionGap}px`, "--fb-space-field": `${theme.layout.fieldGap}px`,
        "--fb-space-toolbar": `${theme.layout.toolbarPadding}px`, "--fb-space-panel": `${theme.layout.panelPadding}px`,
        "--fb-space-ticket": `${theme.layout.ticketPadding}px`,
      }}
    >
      <style>{css}</style>

      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <div style={styles.logoMark}>FB</div>
          <input value={t(title, language)} onChange={(e) => updateTitle(e.target.value)} style={styles.titleInput} aria-label="Form title" />
        </div>
        <div style={styles.toolbarRight}>
          <span style={styles.saveStatus}>
            {saveState === "saving" && (<><Loader2 size={12} className="spin" /> {chrome.saving}</>)}
            {saveState === "saved" && chrome.saved}
            {saveState === "error" && (<span style={{ color: "var(--fb-danger)", display: "flex", alignItems: "center", gap: 4 }}><AlertCircle size={12} /> {chrome.saveFailed}</span>)}
          </span>
          <div style={styles.toolbarDivider} />
          <Languages size={14} color="var(--fb-muted)" />
          <Segmented options={languages.map((l) => ({ value: l.code, label: l.label }))} value={language} onChange={setLanguage} />
          <div style={styles.toolbarDivider} />
          <button style={mode === "build" ? styles.tabBtnActive : styles.tabBtn} onClick={() => setMode("build")}><Pencil size={14} /> {chrome.build}</button>
          <button style={mode === "preview" ? styles.tabBtnActive : styles.tabBtn} onClick={() => setMode("preview")}><Eye size={14} /> {chrome.preview}</button>
          <div style={styles.toolbarDivider} />
          {themeEditable && (
            <div style={{ position: "relative" }}>
              <button style={styles.iconBtn} title={chrome.spacing} onClick={() => setShowLayoutPanel((v) => !v)}><Ruler size={14} /></button>
              {showLayoutPanel && (
                <div style={styles.layoutPanel}>
                  <div style={styles.layoutPanelHeader}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{chrome.theme} / {chrome.spacing}</span>
                    <button type="button" style={styles.resetLinkBtn} onClick={resetTheme}><RotateCcw size={11} /> {chrome.reset}</button>
                  </div>
                  <label style={styles.propLabel}>{chrome.primaryColor}</label>
                  <div style={styles.swatchRow}>
                    {BUTTON_COLOR_SWATCHES.slice(1).map((c) => (<button key={c} type="button" title={c} style={{ ...styles.swatchBtn, background: c, ...(theme.primary === c ? styles.swatchBtnActive : {}) }} onClick={() => updateThemeColor("primary", c)} />))}
                    <input type="color" value={theme.primary} onChange={(e) => updateThemeColor("primary", e.target.value)} style={styles.colorPickerInput} />
                  </div>
                  <label style={styles.propLabel}>{chrome.pageBackground}</label>
                  <div style={styles.swatchRow}>
                    {SECTION_BG_SWATCHES.filter(Boolean).map((c) => (<button key={c} type="button" title={c} style={{ ...styles.swatchBtn, background: c, ...(theme.pageBackground === c ? styles.swatchBtnActive : {}) }} onClick={() => updateThemeColor("pageBackground", c)} />))}
                    <input type="color" value={theme.pageBackground} onChange={(e) => updateThemeColor("pageBackground", e.target.value)} style={styles.colorPickerInput} />
                  </div>
                  <label style={styles.propLabel}>{chrome.maxWidthPx}</label>
                  <input type="number" style={styles.propInput} value={theme.layout.maxWidth} onChange={(e) => updateThemeLayout("maxWidth", Number(e.target.value) || DEFAULT_THEME.layout.maxWidth)} />
                  <div style={styles.inspectorDivider} />
                  <div style={styles.panelHeading}>{chrome.spacing}</div>
                  {SPACING_FIELDS.map(({ key, labelKey }) => (
                    <div key={key} style={styles.spacingRow}>
                      <span style={styles.spacingLabel}>{chrome[labelKey]}</span>
                      <input type="number" style={styles.spacingInput} value={theme.layout[key]} onChange={(e) => updateThemeLayout(key, Number(e.target.value) || 0)} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <button style={styles.iconBtn} title={chrome.settings} onClick={() => setShowSettings(true)}><Settings size={14} /></button>
          <button style={styles.ghostBtn} onClick={newForm} title={chrome.startNewForm}><FilePlus2 size={14} /> {chrome.newForm}</button>
          <button style={styles.ghostBtn} onClick={() => setShowLibrary(true)} title={chrome.openSavedForm}>
            <FolderOpen size={14} /> {chrome.myForms}
            {savedForms.length > 0 && <span style={styles.countBadge}>{savedForms.length}</span>}
          </button>
          <button style={styles.primaryBtn} onClick={saveExisting} title={chrome.saveToLibraryTitle}><Save size={14} /> {chrome.save}</button>
          <button style={styles.ghostBtn} onClick={() => setShowJson(true)}><Code2 size={14} /> {chrome.viewJson}</button>
        </div>
      </div>

      {loadingDraft ? (
        <div style={styles.loadingScreen}>
          <Loader2 size={20} className="spin" />
          <span style={{ marginTop: 8, fontSize: 13, color: "var(--fb-muted)" }}>{chrome.loadingDraft}</span>
        </div>
      ) : mode === "build" ? (
        <div style={styles.workArea}>
          <div style={styles.palette}>
            <div style={styles.activeSectionHint}>
              {chrome.addingTo} <strong>{t(activeSection?.title, language) || `#${sections.findIndex((s) => s.id === activeSection?.id) + 1}`}</strong>
            </div>
            <div style={styles.panelHeading}>{chrome.contentBlocks}</div>
            <div style={styles.paletteList}>
              {CONTENT_TYPES.map((f) => {
                const Icon = f.icon;
                return (<button key={f.type} style={styles.paletteItem} onClick={() => addField(f.type)}><Icon size={16} color="var(--fb-primary)" /><span>{chrome[FIELD_TYPE_CHROME_KEY[f.type]]}</span><Plus size={13} color="#A6A8B3" style={{ marginLeft: "auto" }} /></button>);
              })}
            </div>
            <div style={{ ...styles.panelHeading, marginTop: 16 }}>{chrome.formFields}</div>
            <div style={styles.paletteList}>
              {FORM_TYPES.map((f) => {
                const Icon = f.icon;
                return (<button key={f.type} style={styles.paletteItem} onClick={() => addField(f.type)}><Icon size={16} color="var(--fb-primary)" /><span>{chrome[FIELD_TYPE_CHROME_KEY[f.type]]}</span><Plus size={13} color="#A6A8B3" style={{ marginLeft: "auto" }} /></button>);
              })}
            </div>
          </div>

          <div style={styles.canvas}>
            {sections.map((section, sIdx) => (
              <div
                key={section.id}
                style={{ ...styles.sectionBlock, background: section.background || "transparent", border: activeSectionId === section.id ? "1px solid var(--fb-primary)" : "1px dashed var(--fb-border)" }}
                onClick={() => setActiveSectionId(section.id)}
              >
                <div style={styles.sectionHeader}>
                  <button style={styles.chevronBtn} onClick={(e) => { e.stopPropagation(); toggleSectionCollapse(section.id); }}>
                    {section.collapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}
                  </button>
                  <span style={{ ...styles.colorDot, background: section.background || "var(--fb-canvas)" }} />
                  <input
                    style={styles.sectionTitleInput}
                    placeholder={chrome.sectionTitlePlaceholder(sIdx + 1)}
                    value={t(section.title, language)}
                    onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  {section.collapsed && <span style={styles.miniBadge}>{chrome.fieldsCount(section.fields.length)}</span>}
                  <div style={styles.sectionHeaderActions} onClick={(e) => e.stopPropagation()}>
                    {!section.collapsed && (
                      <div style={styles.swatchRow}>
                        {SECTION_BG_SWATCHES.map((c) => (
                          <button key={c || "none"} type="button" title={c || chrome.none} style={{ ...styles.swatchBtn, background: c || "var(--fb-canvas)", ...(section.background === c ? styles.swatchBtnActive : {}) }} onClick={() => updateSectionBackground(section.id, c)} />
                        ))}
                        <input type="color" title={chrome.customColor} value={/^#/.test(section.background) ? section.background : "#ffffff"} onChange={(e) => updateSectionBackground(section.id, e.target.value)} style={styles.colorPickerInput} />
                      </div>
                    )}
                    <button style={styles.iconBtn} title={chrome.duplicate} onClick={() => duplicateSection(section.id)}><Copy size={13} /></button>
                    <button style={styles.iconBtn} title={chrome.moveUp} disabled={sIdx === 0} onClick={() => moveSection(section.id, -1)}><ArrowUp size={13} /></button>
                    <button style={styles.iconBtn} title={chrome.moveDown} disabled={sIdx === sections.length - 1} onClick={() => moveSection(section.id, 1)}><ArrowDown size={13} /></button>
                    <button style={{ ...styles.iconBtn, ...styles.iconBtnDanger }} title={chrome.deleteSection} disabled={sections.length <= 1} onClick={() => deleteSection(section.id)}><Trash2 size={13} /></button>
                  </div>
                </div>

                {!section.collapsed && submitMode === "perSection" && (
                  <div style={styles.submitStyleRow} onClick={(e) => e.stopPropagation()}>
                    <span style={styles.miniLabel}>{chrome.submitStyle}</span>
                    <div style={styles.swatchRow}>
                      {BUTTON_COLOR_SWATCHES.map((c) => (
                        <button key={c || "inherit"} type="button" title={c || chrome.none} style={{ ...styles.swatchBtn, background: c || "var(--fb-primary)", ...((section.submitStyle?.color || "") === c ? styles.swatchBtnActive : {}) }} onClick={() => updateSectionSubmitStyle(section.id, { color: c })} />
                      ))}
                    </div>
                    <Segmented options={SUBMIT_SIZE_OPTIONS} value={section.submitStyle?.size || submitStyle.size} onChange={(v) => updateSectionSubmitStyle(section.id, { size: v })} />
                    {section.submitStyle && (<button type="button" style={styles.resetLinkBtn} onClick={() => clearSectionSubmitStyle(section.id)}><RotateCcw size={11} /> {chrome.reset}</button>)}
                  </div>
                )}

                {!section.collapsed && (
                  section.fields.length === 0 ? (
                    <div style={styles.sectionEmpty}>{chrome.noFieldsInSection}</div>
                  ) : (
                    <div style={styles.fieldList}>
                      {section.fields.map((field, idx) => {
                        const meta = getMeta(field.type);
                        const Icon = meta.icon;
                        const isSelected = field.id === selectedId;
                        const widthPct = WIDTH_PERCENT[field.width || "1/1"];
                        const dragKey = `${section.id}:${idx}`;
                        return (
                          <div
                            key={field.id}
                            onDragOver={(e) => { e.preventDefault(); setDragOverKey(dragKey); }}
                            onDragLeave={() => setDragOverKey(null)}
                            onDrop={() => {
                              if (dragRef.current.sectionId === section.id) reorderWithinSection(section.id, dragRef.current.index, idx);
                              dragRef.current = { sectionId: null, index: null };
                              setDragOverKey(null);
                            }}
                            onClick={() => { setSelectedId(field.id); setActiveSectionId(section.id); }}
                            style={{
                              ...styles.ticket,
                              flex: `1 1 calc(${widthPct} - 10px)`,
                              minWidth: 230,
                              alignSelf: ALIGN_MAP[field.verticalAlign || "top"],
                              ...(isSelected ? styles.ticketSelected : {}),
                              ...(dragOverKey === dragKey ? styles.ticketDragOver : {}),
                            }}
                          >
                            <div style={styles.ticketIndex}>{String(idx + 1).padStart(2, "0")}</div>
                            <div style={styles.ticketPerforation} />
                            <div style={styles.ticketBody}>
                              <div style={styles.ticketTop}>
                                <span draggable onDragStart={() => (dragRef.current = { sectionId: section.id, index: idx })} style={{ cursor: "grab", display: "flex" }}><GripVertical size={14} color="#C4C6D0" /></span>
                                <Icon size={13} color="var(--fb-primary)" />
                                <span style={styles.typeBadge}>
                                  {chrome[FIELD_TYPE_CHROME_KEY[field.type]] || field.type}
                                  {field.type === "input" && field.inputType && field.inputType !== "text" ? ` · ${chrome[INPUT_SUBTYPE_CHROME_KEY[field.inputType]]}` : ""}
                                </span>
                                {field.required && <span style={styles.requiredBadge}>{chrome.required}</span>}
                              </div>
                              {(field.width && field.width !== "1/1") || field.labelPosition === "inline" || field.verticalAlign !== "top" || field.hideLabel ? (
                                <div style={styles.chipRow}>
                                  {field.width && field.width !== "1/1" && <span style={styles.miniBadge}>{chrome.width} {field.width}</span>}
                                  {field.labelPosition === "inline" && <span style={styles.miniBadge}>{chrome.inline}</span>}
                                  {field.verticalAlign !== "top" && <span style={styles.miniBadge}>{chrome[field.verticalAlign]}</span>}
                                  {field.hideLabel && <span style={styles.miniBadge}>{chrome.hideLabel}</span>}
                                </div>
                              ) : null}
                              <div style={{ marginTop: 8 }}>
                                <FieldBlock field={field} lang={language} onFieldChange={updateField} strings={strings} chrome={chrome} isBuild />
                              </div>
                            </div>
                            <div style={styles.ticketActions}>
                              <button style={styles.iconBtn} title={chrome.moveUp} onClick={(e) => { e.stopPropagation(); moveField(field.id, -1); }}><ArrowUp size={13} /></button>
                              <button style={styles.iconBtn} title={chrome.moveDown} onClick={(e) => { e.stopPropagation(); moveField(field.id, 1); }}><ArrowDown size={13} /></button>
                              <button style={styles.iconBtn} title={chrome.duplicate} onClick={(e) => { e.stopPropagation(); duplicateField(field.id); }}><Copy size={13} /></button>
                              <button style={{ ...styles.iconBtn, ...styles.iconBtnDanger }} title={chrome.delete} onClick={(e) => { e.stopPropagation(); deleteField(field.id); }}><Trash2 size={13} /></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            ))}
            <button style={styles.addSectionBtn} onClick={addSection}><Layers size={14} /> {chrome.addSection}</button>
          </div>

          <div style={styles.inspector}>
            <div style={styles.panelHeading}>{chrome.properties}</div>
            {!selected ? (
              <div style={styles.inspectorEmpty}>{chrome.selectFieldHint}</div>
            ) : (
              <div style={styles.inspectorBody}>
                {!getMeta(selected.type).isContent && (
                  <>
                    <label style={styles.propLabel}>{chrome.label}</label>
                    <input style={styles.propInput} value={t(selected.label, language)} onChange={(e) => updateField(selected.id, { label: withLang(selected.label, language, e.target.value) })} />
                    <label style={styles.toggleRow}>
                      <input type="checkbox" checked={!!selected.hideLabel} onChange={(e) => updateField(selected.id, { hideLabel: e.target.checked })} style={{ width: 15, height: 15, accentColor: "var(--fb-primary)" }} />
                      <span style={{ fontSize: 13, color: "#4A4D57" }}>{chrome.hideLabel}</span>
                    </label>
                  </>
                )}

                {getMeta(selected.type).hasSubtype && (
                  <>
                    <label style={styles.propLabel}>{chrome.inputType}</label>
                    <select style={styles.propInput} value={selected.inputType || "text"} onChange={(e) => updateField(selected.id, { inputType: e.target.value })}>
                      {INPUT_SUBTYPES.map((s) => (<option key={s} value={s}>{chrome[INPUT_SUBTYPE_CHROME_KEY[s]]}</option>))}
                    </select>
                  </>
                )}

                {selected.type === "paragraph" && (
                  <>
                    <label style={styles.propLabel}>{chrome.content}</label>
                    <textarea style={{ ...styles.propInput, minHeight: 70, resize: "vertical" }} value={t(selected.content, language)} onChange={(e) => updateField(selected.id, { content: withLang(selected.content, language, e.target.value) })} />

                    <div style={styles.inspectorDivider} />
                    <div style={styles.panelHeading}>{chrome.typography}</div>
                    <label style={styles.propLabel}>{chrome.headingStyle}</label>
                    <Segmented options={PARAGRAPH_TAG_OPTIONS.map((v) => ({ value: v, label: TAG_CHROME_KEY[v] ? chrome[TAG_CHROME_KEY[v]] : v.toUpperCase() }))} value={selected.tag || "p"} onChange={(v) => updateField(selected.id, { tag: v, ...TAG_PRESETS[v] })} />
                    <label style={styles.propLabel}>{chrome.width}</label>
                    <Segmented options={FONT_SIZE_OPTIONS} value={selected.fontSize || "md"} onChange={(v) => updateField(selected.id, { fontSize: v })} />
                    <label style={styles.propLabel}>{chrome.style}</label>
                    <div style={styles.styleToggleRow}>
                      <button type="button" style={selected.fontWeight === "bold" ? styles.styleToggleActive : styles.styleToggle} onClick={() => updateField(selected.id, { fontWeight: selected.fontWeight === "bold" ? "normal" : "bold" })}><Bold size={14} /></button>
                      <button type="button" style={selected.fontStyle === "italic" ? styles.styleToggleActive : styles.styleToggle} onClick={() => updateField(selected.id, { fontStyle: selected.fontStyle === "italic" ? "normal" : "italic" })}><Italic size={14} /></button>
                    </div>
                    <label style={styles.propLabel}>{chrome.align}</label>
                    <Segmented options={TEXT_ALIGN_OPTIONS} value={selected.textAlign || "left"} onChange={(v) => updateField(selected.id, { textAlign: v })} />
                    <label style={styles.propLabel}>{chrome.color}</label>
                    <div style={styles.swatchRow}>
                      {COLOR_SWATCHES.map((c) => (<button key={c || "default"} type="button" title={c || chrome.none} style={{ ...styles.swatchBtn, background: c || "var(--fb-ink)", ...(selected.color === c ? styles.swatchBtnActive : {}) }} onClick={() => updateField(selected.id, { color: c })} />))}
                      <input type="color" value={selected.color || "#1B1E24"} onChange={(e) => updateField(selected.id, { color: e.target.value })} style={styles.colorPickerInput} />
                    </div>
                  </>
                )}

                {selected.type === "image" && (
                  <>
                    <label style={styles.propLabel}>{chrome.imageUrl}</label>
                    <input style={styles.propInput} placeholder="https://..." value={selected.src || ""} onChange={(e) => updateField(selected.id, { src: e.target.value })} />
                    <p style={styles.helperText}>{chrome.imageUrlHelper}</p>
                    <label style={styles.propLabel}>{chrome.altText}</label>
                    <input style={styles.propInput} value={t(selected.alt, language)} onChange={(e) => updateField(selected.id, { alt: withLang(selected.alt, language, e.target.value) })} />
                    <label style={styles.propLabel}>{chrome.linkOptional}</label>
                    <input style={styles.propInput} placeholder="https://..." value={selected.link || ""} onChange={(e) => updateField(selected.id, { link: e.target.value })} />
                    <label style={styles.propLabel}>{chrome.shape}</label>
                    <Segmented options={IMAGE_SHAPES.map((v) => ({ value: v, label: chrome[IMAGE_SHAPE_CHROME_KEY[v]] }))} value={selected.shape || "square"} onChange={(v) => updateField(selected.id, { shape: v })} />
                    <p style={styles.helperText}>Fills the field's own width (set below under Layout) and scales height automatically — always responsive, never overflows.</p>
                  </>
                )}

                {getMeta(selected.type).placeholder && (
                  <>
                    <label style={styles.propLabel}>{chrome.placeholder}</label>
                    <input style={styles.propInput} value={t(selected.placeholder, language)} onChange={(e) => updateField(selected.id, { placeholder: withLang(selected.placeholder, language, e.target.value) })} />
                  </>
                )}

                {selected.type === "input" && (selected.inputType === "text" || selected.inputType === "password" || !selected.inputType) && (
                  <><label style={styles.propLabel}>{chrome.maxLength}</label><input type="number" style={styles.propInput} placeholder={chrome.noLimit} value={selected.maxLength || ""} onChange={(e) => updateField(selected.id, { maxLength: e.target.value ? Number(e.target.value) : null })} /></>
                )}
                {selected.type === "input" && selected.inputType === "number" && (
                  <>
                    <label style={styles.propLabel}>{chrome.minValue}</label><input type="number" style={styles.propInput} value={selected.min ?? ""} onChange={(e) => updateField(selected.id, { min: e.target.value === "" ? null : Number(e.target.value) })} />
                    <label style={styles.propLabel}>{chrome.maxValue}</label><input type="number" style={styles.propInput} value={selected.max ?? ""} onChange={(e) => updateField(selected.id, { max: e.target.value === "" ? null : Number(e.target.value) })} />
                  </>
                )}
                {selected.type === "textarea" && (
                  <><label style={styles.propLabel}>{chrome.maxLength}</label><input type="number" style={styles.propInput} placeholder={chrome.noLimit} value={selected.maxLength || ""} onChange={(e) => updateField(selected.id, { maxLength: e.target.value ? Number(e.target.value) : null })} /></>
                )}

                {getMeta(selected.type).options && (
                  <>
                    <label style={styles.propLabel}>{chrome.options}</label>
                    <div style={styles.optionList}>
                      {(selected.options || []).map((opt, i) => (
                        <div key={i} style={styles.optionRow}>
                          <input style={styles.optionInput} value={t(opt.label, language)} onChange={(e) => updateOption(selected.id, i, { label: withLang(opt.label, language, e.target.value) })} />
                          <button style={styles.iconBtn} onClick={() => removeOption(selected.id, i)} disabled={(selected.options || []).length <= 1}><X size={13} /></button>
                        </div>
                      ))}
                      <button style={styles.addOptionBtn} onClick={() => addOption(selected.id)}><Plus size={13} /> {chrome.addOption}</button>
                    </div>
                  </>
                )}

                <DefaultValueEditor field={selected} meta={getMeta(selected.type)} lang={language} chrome={chrome} onChange={(patch) => updateField(selected.id, patch)} />

                {!getMeta(selected.type).isContent && (
                  <label style={styles.toggleRow}>
                    <input type="checkbox" checked={selected.required} onChange={(e) => updateField(selected.id, { required: e.target.checked })} style={{ width: 15, height: 15, accentColor: "var(--fb-primary)" }} />
                    <span style={{ fontSize: 13, color: "#4A4D57" }}>{chrome.requiredField}</span>
                  </label>
                )}

                <div style={styles.inspectorDivider} />
                <div style={styles.panelHeading}>{chrome.layout}</div>
                <label style={styles.propLabel}>{chrome.width}</label>
                <Segmented options={WIDTH_OPTIONS.map((o) => ({ ...o, label: o.labelKey ? chrome[o.labelKey] : o.label }))} value={selected.width || "1/1"} onChange={(v) => updateField(selected.id, { width: v })} />
                <label style={styles.propLabel}>{chrome.verticalAlign}</label>
                <Segmented options={[{ value: "top", label: chrome.top }, { value: "middle", label: chrome.middle }, { value: "bottom", label: chrome.bottom }]} value={selected.verticalAlign || "top"} onChange={(v) => updateField(selected.id, { verticalAlign: v })} />
                {!getMeta(selected.type).boolean && !getMeta(selected.type).isContent && (
                  <><label style={styles.propLabel}>{chrome.labelPosition}</label><Segmented options={[{ value: "top", label: chrome.above }, { value: "inline", label: chrome.inline }]} value={selected.labelPosition || "top"} onChange={(v) => updateField(selected.id, { labelPosition: v })} /></>
                )}

                {!getMeta(selected.type).isContent && (
                  <>
                    <div style={styles.inspectorDivider} />
                    <div style={styles.panelHeading}>{chrome.icon}</div>
                    <label style={styles.toggleRow}>
                      <input type="checkbox" checked={!!selected.showIcon} onChange={(e) => updateField(selected.id, { showIcon: e.target.checked })} style={{ width: 15, height: 15, accentColor: "var(--fb-primary)" }} />
                      <span style={{ fontSize: 13, color: "#4A4D57" }}>{chrome.showIcon}</span>
                    </label>
                    {selected.showIcon && (
                      <div style={styles.iconGrid}>
                        {Object.keys(ICON_LIBRARY).map((key) => {
                          const IconComp = ICON_LIBRARY[key];
                          const active = selected.displayIcon === key;
                          return (<button key={key} type="button" title={key} style={active ? styles.iconGridBtnActive : styles.iconGridBtn} onClick={() => updateField(selected.id, { displayIcon: key })}><IconComp size={15} /></button>);
                        })}
                      </div>
                    )}
                  </>
                )}

                <div style={styles.inspectorDivider} />
                <button style={styles.deleteFieldBtn} onClick={() => deleteField(selected.id)}><Trash2 size={13} /> {chrome.deleteField}</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <PreviewPane
          title={title} sections={sections} onFieldChange={updateField} language={language}
          strings={strings} chrome={chrome} baseMaxWidth={theme.layout.maxWidth}
          submitLabel={submitLabel} submitMode={submitMode} submitStyle={submitStyle}
        />
      )}

      {showJson && (
        <div style={styles.modalOverlay} onClick={() => setShowJson(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{chrome.formJson}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={styles.ghostBtn} onClick={copyJson}>{copied ? <Check size={14} /> : <ClipboardCopy size={14} />}{copied ? chrome.copied : chrome.copy}</button>
                <button style={styles.iconBtn} onClick={() => setShowJson(false)}><X size={16} /></button>
              </div>
            </div>
            <pre style={styles.jsonPre}>{jsonString}</pre>
          </div>
        </div>
      )}

      {showLibrary && (
        <div style={styles.modalOverlay} onClick={() => setShowLibrary(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}><span style={{ fontWeight: 600, fontSize: 14 }}>{chrome.myForms}</span><button style={styles.iconBtn} onClick={() => setShowLibrary(false)}><X size={16} /></button></div>
            <div style={styles.libraryBody}>
              {savedForms.length === 0 ? (
                <div style={styles.inspectorEmpty}>{chrome.nothingSaved}</div>
              ) : (
                savedForms.map((f) => (
                  <div key={f.id} style={styles.libraryRow}>
                    <div style={{ minWidth: 0 }}>
                      <div style={styles.libraryRowTitle}>{f.title}{f.id === currentFormId && <span style={styles.currentBadge}>{chrome.current}</span>}</div>
                      <div style={styles.libraryRowMeta}>{chrome.updated} {new Date(f.updatedAt).toLocaleString()}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button style={styles.ghostBtn} onClick={() => loadForm(f.id)}>{chrome.open}</button>
                      <button style={{ ...styles.iconBtn, ...styles.iconBtnDanger }} title={chrome.delete} onClick={() => deleteForm(f.id)}><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {showSaveAs && (
        <div style={styles.modalOverlay} onClick={() => setShowSaveAs(false)}>
          <div style={{ ...styles.modal, width: 380 }} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}><span style={{ fontWeight: 600, fontSize: 14 }}>{chrome.saveForm}</span><button style={styles.iconBtn} onClick={() => setShowSaveAs(false)}><X size={16} /></button></div>
            <div style={{ padding: 16 }}>
              <label style={styles.propLabel}>{chrome.formName}</label>
              <input autoFocus style={styles.propInput} value={saveAsName} onChange={(e) => setSaveAsName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveAsName.trim() && saveAs(saveAsName.trim())} />
              <button style={{ ...styles.primaryBtn, width: "100%", justifyContent: "center", marginTop: 14 }} disabled={!saveAsName.trim()} onClick={() => saveAs(saveAsName.trim())}><Save size={14} /> {chrome.saveToLibrary}</button>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div style={styles.modalOverlay} onClick={() => setShowSettings(false)}>
          <div style={{ ...styles.modal, width: 400 }} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}><span style={{ fontWeight: 600, fontSize: 14 }}>{chrome.formSettings}</span><button style={styles.iconBtn} onClick={() => setShowSettings(false)}><X size={16} /></button></div>
            <div style={{ padding: 16 }}>
              <div style={styles.panelHeading}>{chrome.submitSectionTitle}</div>
              <label style={styles.propLabel}>{chrome.submitLabel}</label>
              <input style={styles.propInput} placeholder={strings.submit} value={t(submitLabel, language)} onChange={(e) => updateSubmitLabel(e.target.value)} />
              <label style={styles.propLabel}>{chrome.submitMode}</label>
              <Segmented options={[{ value: "combined", label: chrome.combined }, { value: "perSection", label: chrome.perSection }]} value={submitMode} onChange={setSubmitMode} />

              <div style={styles.inspectorDivider} />
              <div style={styles.panelHeading}>{chrome.submitStyle}</div>
              <label style={styles.propLabel}>{chrome.color}</label>
              <div style={styles.swatchRow}>
                {BUTTON_COLOR_SWATCHES.map((c) => (<button key={c || "default"} type="button" title={c || chrome.none} style={{ ...styles.swatchBtn, background: c || "var(--fb-primary)", ...((submitStyle.color || "") === c ? styles.swatchBtnActive : {}) }} onClick={() => updateSubmitStyle({ color: c })} />))}
                <input type="color" value={submitStyle.color || "#5B5FEF"} onChange={(e) => updateSubmitStyle({ color: e.target.value })} style={styles.colorPickerInput} />
              </div>
              <label style={styles.propLabel}>{chrome.buttonSize}</label>
              <Segmented options={SUBMIT_SIZE_OPTIONS} value={submitStyle.size} onChange={(v) => updateSubmitStyle({ size: v })} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Segmented({ options, value, onChange }) {
  return (
    <div style={styles.segmented}>
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.value;
        return (<button key={opt.value} type="button" style={active ? styles.segmentedBtnActive : styles.segmentedBtn} onClick={() => onChange(opt.value)}>{Icon && <Icon size={13} />}{opt.label}</button>);
      })}
    </div>
  );
}

function DefaultValueEditor({ field, meta, lang, chrome, onChange }) {
  if (meta.isContent) return null;

  if (meta.boolean) {
    return (
      <>
        <label style={styles.propLabel}>{chrome.defaultValue}</label>
        <button style={styles.toggleRow} onClick={() => onChange({ defaultValue: !field.defaultValue })}>
          <span style={{ ...styles.toggleTrack, background: field.defaultValue ? "var(--fb-primary)" : "var(--fb-border)" }}><span style={{ ...styles.toggleThumb, transform: field.defaultValue ? "translateX(16px)" : "translateX(0)" }} /></span>
          <span style={{ fontSize: 13, color: "#4A4D57" }}>{field.defaultValue ? chrome.checked : chrome.unchecked}</span>
        </button>
      </>
    );
  }

  if (meta.multiValue) {
    const selectedVals = field.defaultValue || [];
    return (
      <>
        <label style={styles.propLabel}>{chrome.defaultChecked}</label>
        <div style={styles.optionList}>
          {(field.options || []).map((o) => {
            const checked = selectedVals.includes(o.value);
            return (<label key={o.value} style={{ ...styles.previewRadio, cursor: "pointer" }}><input type="checkbox" checked={checked} onChange={(e) => { const next = e.target.checked ? [...selectedVals, o.value] : selectedVals.filter((v) => v !== o.value); onChange({ defaultValue: next }); }} style={{ accentColor: "var(--fb-primary)" }} />{t(o.label, lang)}</label>);
          })}
        </div>
      </>
    );
  }

  if (meta.options) {
    return (
      <>
        <label style={styles.propLabel}>{chrome.defaultValue}</label>
        <select style={styles.propInput} value={field.defaultValue || ""} onChange={(e) => onChange({ defaultValue: e.target.value })}>
          <option value="">{chrome.none}</option>
          {(field.options || []).map((o) => (<option key={o.value} value={o.value}>{t(o.label, lang)}</option>))}
        </select>
      </>
    );
  }

  const htmlType =
    field.type === "input" && field.inputType === "number" ? "number" :
    field.type === "input" && field.inputType === "date" ? "date" :
    field.type === "input" && field.inputType === "time" ? "time" : "text";
  return (
    <>
      <label style={styles.propLabel}>{chrome.defaultValue}</label>
      <input type={htmlType} style={styles.propInput} value={field.defaultValue || ""} onChange={(e) => onChange({ defaultValue: e.target.value })} />
    </>
  );
}

// Always responsive: width fills the field's own grid width (1/3, 1/2, Full),
// height is derived from aspect-ratio, object-fit crops cleanly. No fixed
// pixel dimensions, so nothing can overflow on narrow screens.
function buildImageStyle(field) {
  const aspectRatio = field.shape === "banner" ? "16 / 5" : "1 / 1";
  return {
    width: "100%", aspectRatio, objectFit: "cover", display: "block",
    borderRadius: field.shape === "circle" ? "50%" : 8,
    background: "var(--fb-canvas)",
  };
}

function FieldBlock({ field, lang, onFieldChange, strings, chrome, error, isBuild }) {
  if (field.type === "image") return <ImageBlock field={field} lang={lang} />;

  if (field.type === "paragraph") {
    const fontPx = FONT_SIZE_OPTIONS.find((f) => f.value === field.fontSize)?.px || 14;
    const Tag = TAG_TO_ELEMENT[field.tag] || "p";
    return (
      <Tag style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: fontPx, fontWeight: field.fontWeight === "bold" ? 700 : 400, fontStyle: field.fontStyle === "italic" ? "italic" : "normal", textAlign: field.textAlign || "left", color: field.color || "var(--fb-ink)", lineHeight: 1.6 }}>
        {t(field.content, lang) || "..."}
      </Tag>
    );
  }

  const meta = getMeta(field.type);
  const IconComp = field.showIcon && field.displayIcon ? ICON_LIBRARY[field.displayIcon] : null;
  const isInline = field.labelPosition === "inline" && !meta.boolean;
  const labelText = t(field.label, lang);
  const showLabel = !meta.boolean && !field.hideLabel;

  return (
    <div>
      <div style={{ display: "flex", flexDirection: isInline ? "row" : "column", alignItems: isInline ? "center" : "stretch", gap: isInline ? 10 : 6 }}>
        {showLabel && (
          <label style={{ ...styles.previewLabel, marginBottom: isInline ? 0 : 6, flexShrink: 0, width: isInline ? 120 : "auto", display: "flex", alignItems: "center", gap: 6 }}>
            {IconComp && <IconComp size={14} color="#6B6E79" />}
            {labelText || (isBuild ? <span style={{ fontStyle: "italic", color: "var(--fb-muted)" }}>{chrome?.untitledField || "Untitled field"}</span> : "")}
            {field.required && <span style={{ color: "var(--fb-danger)" }}> *</span>}
          </label>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>{renderInteractive(field, lang, onFieldChange, IconComp, !!error, strings)}</div>
      </div>
      {error && (<div style={styles.fieldError}><CircleAlert size={12} /> {error}</div>)}
    </div>
  );
}

function ImageBlock({ field, lang }) {
  const shapeStyle = buildImageStyle(field);
  const img = field.src ? (
    <img src={field.src} alt={t(field.alt, lang || "en")} style={shapeStyle} />
  ) : (
    <div style={{ ...shapeStyle, ...styles.imagePlaceholder }}><ImageIcon size={20} color="var(--fb-muted)" /></div>
  );
  return field.link ? <a href={field.link} target="_blank" rel="noreferrer" style={{ display: "block" }}>{img}</a> : img;
}

function renderInteractive(field, lang, onFieldChange, IconComp, hasError, strings) {
  const value = field.defaultValue;
  const set = (v) => onFieldChange(field.id, { defaultValue: v });
  const inputStyle = hasError ? { ...styles.realInput, ...styles.realInputError } : styles.realInput;
  const common = { style: inputStyle, placeholder: t(field.placeholder, lang), value: value || "", onChange: (e) => set(e.target.value) };

  if (field.type === "input") {
    switch (field.inputType) {
      case "number": return <input type="number" {...common} min={field.min ?? undefined} max={field.max ?? undefined} />;
      case "email": return <input type="email" {...common} />;
      case "password": return <input type="password" {...common} maxLength={field.maxLength || undefined} />;
      case "phone": return <input type="tel" {...common} />;
      case "date": return <input type="date" {...common} />;
      case "time": return <input type="time" {...common} />;
      default: return <input type="text" {...common} maxLength={field.maxLength || undefined} />;
    }
  }

  switch (field.type) {
    case "textarea":
      return <textarea {...common} rows={3} maxLength={field.maxLength || undefined} />;
    case "select":
      return (
        <select style={inputStyle} value={value || ""} onChange={(e) => set(e.target.value)}>
          <option value="">{strings.selectPlaceholder}</option>
          {(field.options || []).map((o) => (<option key={o.value} value={o.value}>{t(o.label, lang)}</option>))}
        </select>
      );
    case "radio":
      return (<div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 4 }}>{(field.options || []).map((o) => (<label key={o.value} style={styles.previewRadio}><input type="radio" name={field.id} value={o.value} checked={value === o.value} onChange={(e) => set(e.target.value)} />{t(o.label, lang)}</label>))}</div>);
    case "checkboxGroup": {
      const vals = Array.isArray(value) ? value : [];
      return (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 4 }}>
          {(field.options || []).map((o) => { const checked = vals.includes(o.value); return (<label key={o.value} style={styles.previewRadio}><input type="checkbox" checked={checked} onChange={(e) => { const next = e.target.checked ? [...vals, o.value] : vals.filter((v) => v !== o.value); set(next); }} style={{ accentColor: "var(--fb-primary)" }} />{t(o.label, lang)}</label>); })}
        </div>
      );
    }
    case "checkbox":
      return (<label style={styles.previewRadio}><input type="checkbox" checked={!!value} onChange={(e) => set(e.target.checked)} style={{ accentColor: "var(--fb-primary)" }} />{IconComp && <IconComp size={14} color="#6B6E79" />}{t(field.label, lang)}{field.required && <span style={{ color: "var(--fb-danger)" }}> *</span>}</label>);
    case "toggle":
      return (<label style={styles.previewRadio}><input type="checkbox" checked={!!value} onChange={(e) => set(e.target.checked)} style={{ accentColor: "var(--fb-primary)" }} />{IconComp && <IconComp size={14} color="#6B6E79" />}{t(field.label, lang)}</label>);
    default:
      return <input type="text" {...common} />;
  }
}

function PreviewPane({ title, sections, onFieldChange, language, strings, chrome, baseMaxWidth, submitLabel, submitMode, submitStyle }) {
  const [device, setDevice] = useState("laptop");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const deviceOptions = buildDeviceOptions(baseMaxWidth, chrome);
  const maxWidth = (deviceOptions.find((d) => d.value === device) || deviceOptions[0]).maxWidth;
  const allFields = sections.flatMap((s) => s.fields);
  const submitText = t(submitLabel, language) || strings.submit;
  const overallHasFormFields = allFields.some((f) => !getMeta(f.type).isContent);

  function runValidation(fields) {
    const errs = {};
    fields.forEach((f) => { const e = validateField(f, f.defaultValue, strings); if (e) errs[f.id] = e; });
    return errs;
  }

  function handleSubmitAll() {
    const errs = runValidation(allFields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) { setSubmitted(null); return; }
    setSubmitted(allFields.filter((f) => !getMeta(f.type).isContent).map((f) => ({ label: t(f.label, language), value: formatValue(f, language) })));
  }

  function handleSubmitSection(section) {
    const errs = runValidation(section.fields);
    setErrors((prev) => {
      const next = { ...prev };
      section.fields.forEach((f) => delete next[f.id]);
      return { ...next, ...errs };
    });
    if (Object.keys(errs).length > 0) { setSubmitted(null); return; }
    setSubmitted(section.fields.filter((f) => !getMeta(f.type).isContent).map((f) => ({ label: t(f.label, language), value: formatValue(f, language) })));
  }

  return (
    <div style={styles.previewWrap}>
      <div style={{ width: "100%", maxWidth, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={styles.previewToolbar}><Segmented options={deviceOptions} value={device} onChange={setDevice} /></div>
        <div style={{ ...styles.previewCard, maxWidth, width: "100%" }}>
          <h2 style={styles.previewTitle}>{t(title, language)}</h2>
          {allFields.length === 0 && <p style={{ color: "var(--fb-muted)", fontSize: 14 }}>{strings.addFieldsHint}</p>}

          {sections.map((section) => {
            const sectionHasFormFields = section.fields.some((f) => !getMeta(f.type).isContent);
            const sectionHasErrors = section.fields.some((f) => errors[f.id]);
            return (
              <div key={section.id} style={{ background: section.background || "transparent", padding: section.background ? 16 : 0, borderRadius: section.background ? 10 : 0, marginBottom: "var(--fb-space-section)" }}>
                {t(section.title, language) && <h3 style={styles.sectionRuntimeTitle}>{t(section.title, language)}</h3>}
                <div style={styles.previewGrid}>
                  {section.fields.map((field) => {
                    const width = effectiveWidth(field.width, device);
                    const flexBasis = `1 1 calc(${WIDTH_PERCENT[width]} - 14px)`;
                    return (
                      <div key={field.id} style={{ flex: flexBasis, minWidth: 0, alignSelf: ALIGN_MAP[field.verticalAlign || "top"] }}>
                        <FieldBlock field={field} lang={language} onFieldChange={onFieldChange} strings={strings} chrome={chrome} error={errors[field.id]} />
                      </div>
                    );
                  })}
                </div>
                {submitMode === "perSection" && sectionHasFormFields && (
                  <>
                    <button style={{ ...styles.submitBtn, ...resolveSubmitStyle(section.submitStyle || submitStyle) }} onClick={() => handleSubmitSection(section)}>{submitText}</button>
                    {sectionHasErrors && (<p style={styles.formErrorNote}><CircleAlert size={13} /> {strings.fixErrors}</p>)}
                  </>
                )}
              </div>
            );
          })}

          {submitMode === "combined" && overallHasFormFields && (<button style={{ ...styles.submitBtn, ...resolveSubmitStyle(submitStyle) }} onClick={handleSubmitAll}>{submitText}</button>)}
          {submitMode === "combined" && Object.keys(errors).length > 0 && (<p style={styles.formErrorNote}><CircleAlert size={13} /> {strings.fixErrors}</p>)}
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

function formatValue(field, lang) {
  const v = field.defaultValue;
  if (Array.isArray(v)) {
    if (v.length === 0) return "—";
    return v.map((val) => t((field.options || []).find((o) => o.value === val)?.label, lang) || val).join(", ");
  }
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (field.options && v) return t((field.options || []).find((o) => o.value === v)?.label, lang) || v;
  if (v === undefined || v === null || v === "") return "—";
  return String(v);
}

const css = `
  * { box-sizing: border-box; }
  button { font-family: inherit; cursor: pointer; }
  input, textarea, select { font-family: inherit; }
  @keyframes fb-spin { to { transform: rotate(360deg); } }
  .spin { animation: fb-spin 0.8s linear infinite; }
`;

const styles = {
  app: { fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: "var(--fb-canvas)", borderRadius: 12, overflow: "hidden", border: "1px solid var(--fb-border)", color: "var(--fb-ink)", minHeight: 640, display: "flex", flexDirection: "column" },
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--fb-space-toolbar) 16px", borderBottom: "1px solid var(--fb-border)", background: "var(--fb-surface)", flexWrap: "wrap", gap: 8, position: "relative" },
  toolbarLeft: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: { width: 26, height: 26, borderRadius: 7, background: "var(--fb-primary)", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.5px" },
  titleInput: { border: "none", outline: "none", fontSize: 14, fontWeight: 600, background: "transparent", color: "var(--fb-ink)", padding: "4px 6px", borderRadius: 6, minWidth: 160 },
  toolbarRight: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" },
  toolbarDivider: { width: 1, height: 20, background: "var(--fb-border)", margin: "0 4px" },
  tabBtn: { display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 7, border: "1px solid transparent", background: "transparent", color: "#6B6E79", fontSize: 13, fontWeight: 500 },
  tabBtnActive: { display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 7, border: "1px solid var(--fb-border)", background: "var(--fb-primary-soft)", color: "var(--fb-primary)", fontSize: 13, fontWeight: 600 },
  ghostBtn: { display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 7, border: "1px solid var(--fb-border)", background: "var(--fb-surface)", color: "#4A4D57", fontSize: 13, fontWeight: 500 },
  primaryBtn: { display: "flex", alignItems: "center", gap: 6, padding: "6px 13px", borderRadius: 7, border: "1px solid var(--fb-primary)", background: "var(--fb-primary)", color: "#fff", fontSize: 13, fontWeight: 600 },
  saveStatus: { display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--fb-muted)", minWidth: 60 },
  countBadge: { fontSize: 10.5, fontWeight: 700, background: "var(--fb-primary-soft)", color: "var(--fb-primary)", borderRadius: 9, padding: "1px 6px", marginLeft: 2 },
  loadingScreen: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--fb-muted)" },
  libraryBody: { padding: "var(--fb-space-panel)", overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 },
  libraryRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "10px 8px", borderRadius: 8, border: "1px solid #F0F1F4" },
  libraryRowTitle: { fontSize: 13.5, fontWeight: 600, color: "var(--fb-ink)", display: "flex", alignItems: "center", gap: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  libraryRowMeta: { fontSize: 11.5, color: "var(--fb-muted)", marginTop: 2 },
  currentBadge: { fontSize: 10, fontWeight: 700, color: "var(--fb-primary)", background: "var(--fb-primary-soft)", padding: "2px 6px", borderRadius: 5, flexShrink: 0 },
  workArea: { display: "flex", flex: 1, minHeight: 0 },
  palette: { width: 200, borderRight: "1px solid var(--fb-border)", background: "var(--fb-surface)", padding: "var(--fb-space-panel)", overflowY: "auto" },
  panelHeading: { fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--fb-muted)", marginBottom: 10 },
  activeSectionHint: { fontSize: 11.5, color: "var(--fb-muted)", marginBottom: 14, lineHeight: 1.4 },
  paletteList: { display: "flex", flexDirection: "column", gap: 4 },
  paletteItem: { display: "flex", alignItems: "center", gap: 9, padding: "8px 9px", borderRadius: 8, border: "1px solid transparent", background: "transparent", fontSize: 13, color: "#33353E", textAlign: "left" },
  canvas: { flex: 1, padding: "var(--fb-space-canvas)", overflowY: "auto", background: "var(--fb-canvas)" },
  sectionBlock: { borderRadius: 12, padding: "var(--fb-space-panel)", marginBottom: "var(--fb-space-section)", transition: "border-color 0.12s" },
  sectionHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" },
  chevronBtn: { width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", border: "none", background: "transparent", color: "var(--fb-muted)", flexShrink: 0 },
  colorDot: { width: 10, height: 10, borderRadius: "50%", border: "1px solid var(--fb-border)", flexShrink: 0 },
  sectionTitleInput: { border: "none", outline: "none", background: "transparent", fontSize: 14, fontWeight: 700, color: "var(--fb-ink)", padding: "2px 0", minWidth: 120, flex: 1 },
  sectionHeaderActions: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginLeft: "auto" },
  sectionEmpty: { fontSize: 12.5, color: "var(--fb-muted)", padding: "18px 4px", textAlign: "center", border: "1px dashed var(--fb-border)", borderRadius: 8 },
  submitStyleRow: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", background: "#F7F8FA", border: "1px solid #F0F1F4", borderRadius: 8, padding: "6px 10px", marginBottom: 12 },
  miniLabel: { fontSize: 11, fontWeight: 600, color: "var(--fb-muted)" },
  resetLinkBtn: { display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "var(--fb-muted)", background: "transparent", border: "none", padding: "2px 4px" },
  addSectionBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", padding: "10px", borderRadius: 10, border: "1px dashed #C7C9D6", background: "transparent", color: "var(--fb-primary)", fontSize: 13, fontWeight: 600 },
  swatchRow: { display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" },
  swatchBtn: { width: 20, height: 20, borderRadius: "50%", border: "1px solid var(--fb-border)", padding: 0 },
  swatchBtnActive: { border: "2px solid var(--fb-primary)" },
  colorPickerInput: { width: 22, height: 22, padding: 0, border: "none", borderRadius: "50%", overflow: "hidden", background: "none", cursor: "pointer" },
  fieldList: { display: "flex", flexWrap: "wrap", gap: "var(--fb-space-field)" },
  ticket: { display: "flex", alignItems: "stretch", background: "var(--fb-surface)", border: "1px solid var(--fb-border)", borderRadius: 10, position: "relative", transition: "border-color 0.12s, box-shadow 0.12s" },
  ticketSelected: { borderColor: "var(--fb-primary)", boxShadow: "0 0 0 3px var(--fb-primary-soft)" },
  ticketDragOver: { borderColor: "var(--fb-muted)" },
  ticketIndex: { fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: "#C7C9D6", width: 34, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  ticketPerforation: { width: 0, borderLeft: "1px dashed var(--fb-border)" },
  ticketBody: { flex: 1, padding: "10px var(--fb-space-ticket)", minWidth: 0 },
  ticketTop: { display: "flex", alignItems: "center", gap: 7, marginBottom: 4 },
  typeBadge: { fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", color: "var(--fb-muted)" },
  requiredBadge: { fontSize: 10, fontWeight: 700, color: "#B4522F", background: "var(--fb-danger-soft)", padding: "2px 6px", borderRadius: 5, letterSpacing: "0.02em", marginLeft: "auto" },
  chipRow: { display: "flex", gap: 5, marginBottom: 7, flexWrap: "wrap" },
  miniBadge: { fontSize: 10, fontWeight: 600, color: "var(--fb-primary)", background: "var(--fb-primary-soft)", padding: "2px 6px", borderRadius: 5, letterSpacing: "0.02em" },
  segmented: { display: "flex", gap: 3, background: "#F0F1F4", padding: 3, borderRadius: 8, marginBottom: 4 },
  segmentedBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "6px 8px", borderRadius: 6, border: "none", background: "transparent", color: "#6B6E79", fontSize: 12.5, fontWeight: 500 },
  segmentedBtnActive: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "6px 8px", borderRadius: 6, border: "none", background: "#fff", color: "var(--fb-ink)", fontSize: 12.5, fontWeight: 600, boxShadow: "0 1px 2px rgba(0,0,0,0.08)" },
  iconGrid: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 5, marginTop: 6 },
  iconGridBtn: { width: 30, height: 30, borderRadius: 7, border: "1px solid var(--fb-border)", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B6E79" },
  iconGridBtnActive: { width: 30, height: 30, borderRadius: 7, border: "1px solid var(--fb-primary)", background: "var(--fb-primary-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--fb-primary)" },
  styleToggleRow: { display: "flex", gap: 5, marginBottom: 4 },
  styleToggle: { width: 30, height: 30, borderRadius: 7, border: "1px solid var(--fb-border)", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--fb-muted)" },
  styleToggleActive: { width: 30, height: 30, borderRadius: 7, border: "1px solid var(--fb-primary)", background: "var(--fb-primary-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--fb-primary)" },
  previewInput: { border: "1px solid #E9EAEE", borderRadius: 7, padding: "7px 10px", fontSize: 13, color: "var(--fb-muted)", background: "#FBFBFD", display: "flex", alignItems: "center", justifyContent: "space-between" },
  previewRadio: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#4A4D57" },
  ticketActions: { display: "flex", flexDirection: "column", gap: 3, padding: 8, borderLeft: "1px solid #F0F1F4" },
  iconBtn: { width: 24, height: 24, borderRadius: 6, border: "1px solid #E9EAEE", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B6E79" },
  iconBtnDanger: { color: "var(--fb-danger)" },
  inspector: { width: 270, borderLeft: "1px solid var(--fb-border)", background: "var(--fb-surface)", padding: "var(--fb-space-panel)", overflowY: "auto" },
  inspectorEmpty: { fontSize: 13, color: "var(--fb-muted)", lineHeight: 1.5, marginTop: 6 },
  inspectorBody: { display: "flex", flexDirection: "column", gap: 4 },
  helperText: { fontSize: 11, color: "var(--fb-muted)", lineHeight: 1.4, margin: "2px 0 4px" },
  propLabel: { fontSize: 11.5, fontWeight: 600, color: "#6B6E79", marginTop: 12, marginBottom: 5 },
  propInput: { border: "1px solid var(--fb-border)", borderRadius: 7, padding: "7px 9px", fontSize: 13, color: "var(--fb-ink)", outline: "none", width: "100%", boxSizing: "border-box" },
  optionList: { display: "flex", flexDirection: "column", gap: 6 },
  optionRow: { display: "flex", gap: 6, alignItems: "center" },
  optionInput: { flex: 1, border: "1px solid var(--fb-border)", borderRadius: 6, padding: "6px 8px", fontSize: 12.5, outline: "none", minWidth: 0, boxSizing: "border-box" },
  addOptionBtn: { display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "var(--fb-primary)", background: "transparent", border: "1px dashed #C7C9D6", borderRadius: 7, padding: "6px 8px", justifyContent: "center", marginTop: 2 },
  toggleRow: { display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", padding: "8px 0" },
  toggleTrack: { width: 30, height: 17, borderRadius: 20, position: "relative", transition: "background 0.15s", display: "inline-block" },
  toggleThumb: { position: "absolute", top: 2, left: 2, width: 13, height: 13, borderRadius: "50%", background: "#fff", transition: "transform 0.15s", boxShadow: "0 1px 2px rgba(0,0,0,0.2)" },
  inspectorDivider: { height: 1, background: "var(--fb-border)", margin: "14px 0 10px" },
  deleteFieldBtn: { display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--fb-danger)", background: "var(--fb-danger-soft)", border: "none", borderRadius: 7, padding: "8px 10px", justifyContent: "center" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(20,22,28,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 },
  modal: { background: "#fff", borderRadius: 12, width: 520, maxHeight: "70vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" },
  modalHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--fb-border)" },
  jsonPre: { margin: 0, padding: 16, fontSize: 12, lineHeight: 1.6, overflow: "auto", background: "#14171C", color: "#D6D8E0", fontFamily: "'JetBrains Mono', monospace" },
  previewWrap: { flex: 1, display: "flex", justifyContent: "center", padding: "var(--fb-space-page) 20px", overflowY: "auto", background: "var(--fb-canvas)" },
  previewToolbar: { width: "100%", display: "flex", gap: 10, marginBottom: 16, justifyContent: "center" },
  previewCard: { width: "100%", maxWidth: 480, background: "var(--fb-page-bg)", border: "1px solid var(--fb-border)", borderRadius: 12, padding: "var(--fb-space-page)" },
  previewTitle: { fontSize: 19, fontWeight: 700, margin: "0 0 20px" },
  previewLabel: { display: "block", fontSize: 13, fontWeight: 600, color: "#33353E", marginBottom: 6 },
  previewGrid: { display: "flex", flexWrap: "wrap", gap: "var(--fb-space-field)" },
  sectionRuntimeTitle: { fontSize: 15, fontWeight: 700, margin: "0 0 12px", color: "var(--fb-ink)" },
  imagePlaceholder: { display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed var(--fb-border)" },
  fieldError: { display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--fb-danger)", marginTop: 5 },
  formErrorNote: { display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--fb-danger)", marginTop: 10, justifyContent: "center" },
  submittedList: { display: "flex", flexDirection: "column", gap: 8, marginTop: 4 },
  submittedRow: { display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13, padding: "6px 0", borderBottom: "1px solid var(--fb-border)" },
  submittedLabel: { color: "var(--fb-muted)", flexShrink: 0 },
  submittedValue: { color: "var(--fb-ink)", fontWeight: 600, textAlign: "right" },
  realInput: { width: "100%", border: "1px solid var(--fb-border)", borderRadius: 8, padding: "9px 11px", fontSize: 13.5, outline: "none", color: "var(--fb-ink)", boxSizing: "border-box" },
  realInputError: { borderColor: "var(--fb-danger)" },
  submitBtn: { marginTop: 8, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, width: "100%" },
  layoutPanel: { position: "absolute", top: "calc(100% + 6px)", right: 0, width: 260, background: "#fff", border: "1px solid var(--fb-border)", borderRadius: 10, boxShadow: "0 12px 32px rgba(0,0,0,0.18)", padding: 14, zIndex: 60, maxHeight: "70vh", overflowY: "auto" },
  layoutPanelHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  spacingRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "4px 0" },
  spacingLabel: { fontSize: 12, color: "#4A4D57" },
  spacingInput: { width: 60, border: "1px solid var(--fb-border)", borderRadius: 6, padding: "4px 6px", fontSize: 12, textAlign: "right", outline: "none" },
};
