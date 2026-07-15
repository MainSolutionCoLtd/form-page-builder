export const DEFAULT_STRINGS = {
  en: {
    submit: "Submit", selectPlaceholder: "Select...", requiredError: "This field is required.",
    invalidEmail: "Enter a valid email address.", invalidPhone: "Enter a valid phone number.",
    fixErrors: "Please fix the highlighted fields before submitting.", submittedTitle: "Form submitted",
    submittedBody: "Here's what would be sent to your backend:", addFieldsHint: "Add fields in Build mode to see them here.",
    close: "Close",
    tooLong: (n: number) => `Must be ${n} characters or fewer.`,
    tooSmall: (n: number) => `Must be at least ${n}.`,
    tooLarge: (n: number) => `Must be at most ${n}.`,
  },
  ja: {
    submit: "送信", selectPlaceholder: "選択してください", requiredError: "この項目は必須です。",
    invalidEmail: "有効なメールアドレスを入力してください。", invalidPhone: "有効な電話番号を入力してください。",
    fixErrors: "入力内容をご確認のうえ、再度送信してください。", submittedTitle: "送信完了",
    submittedBody: "バックエンドに送信される内容は以下の通りです：", addFieldsHint: "ビルドモードでフィールドを追加すると、ここに表示されます。",
    close: "閉じる",
    tooLong: (n: number) => `${n}文字以内で入力してください。`,
    tooSmall: (n: number) => `${n}以上の値を入力してください。`,
    tooLarge: (n: number) => `${n}以下の値を入力してください。`,
  },
};

export type StringsShape = typeof DEFAULT_STRINGS.en;
