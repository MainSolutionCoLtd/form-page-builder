---
"form-page-builder": minor
---

- **`onImageUpload` prop.** Adds an "Upload image" button beside an image block's URL box. The host receives the picked `File` plus `{ fieldId, shape }`, can show its own crop/compress UI, and resolves to the hosted URL, which becomes the block's `src`. Rejecting leaves the block unchanged and shows a short error. Without the prop nothing changes (URL-only input). New `ImageUploadContext` type export and `chrome` strings `uploadImage`, `uploadingImage`, `uploadImageFailed`.
- **`features.maxImages`.** Caps image blocks across the document: live "Images: n / max" line in the palette, Image button disabled at the cap, and Duplicate on an image (or on a section that would exceed the cap) is ignored. New `chrome` strings `imageCount`, `imageLimitReached`.
- **`features.submitButtons`.** Set to `false` for link-only buttons: new buttons default to the link action and the action picker is hidden (default `true`, unchanged).
