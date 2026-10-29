---
"form-page-builder": minor
---

- **Square and circle images no longer grow without limit.** They stop at 480px (change it with the new `theme.layout.imageMaxWidth`) and are centred, in the builder and in `FormViewer` (both use `imageStyle`), so a full-width image on a large screen is no longer as tall as the page is wide. Banners are unchanged.
- **New image shape `"auto"` ("Original").** Keeps the picture's own proportions with no cropping, for images from arbitrary URLs. `ImageUploadContext.shape` can now be `"auto"`: if your `onImageUpload` handler switches on `shape`, skip cropping for it.
- **New width `"2/3"`.** Pair 1/3 with 2/3 in one row. On a tablet that pair becomes two halves; on a phone everything stacks. `FormViewer` collapses it with the container like the other widths.
- **Images that fail to load** show the placeholder in the builder instead of a broken-image icon, and images are requested with `referrerPolicy="no-referrer"` so more hotlink-protected hosts serve them.
