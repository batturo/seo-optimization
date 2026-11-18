# seo-optimization

## Ebooks

### The Off-Ramp: The 90-Day Plan for Keeping Your Results After GLP-1s

A 47-page workbook for people stopping, tapering or losing access to GLP-1 medications. That is a large, underserved group: about half stop within a year, and there is no standard plan for what comes next.

- **Finished PDF:** [`ebook/the-off-ramp/dist/the-off-ramp.pdf`](ebook/the-off-ramp/dist/the-off-ramp.pdf)
- **Cover images (ebook, square, banner):** [`ebook/the-off-ramp/dist/covers/`](ebook/the-off-ramp/dist/covers/)
- **Plain-text manuscript (for review):** [`ebook/the-off-ramp/dist/manuscript.md`](ebook/the-off-ramp/dist/manuscript.md)
- **Why this niche:** [`ebook/the-off-ramp/RESEARCH.md`](ebook/the-off-ramp/RESEARCH.md)
- **Listing copy, hooks, SEO keywords:** [`ebook/the-off-ramp/SALES-KIT.md`](ebook/the-off-ramp/SALES-KIT.md)

#### Editing and rebuilding

All of the text lives in `ebook/the-off-ramp/content.mjs`. Edit it there, then rebuild:

```bash
cd ebook/the-off-ramp && node build.mjs
```

The build needs Node and Playwright with Chromium, plus the Caladea and Inter fonts. It writes the HTML, the PDF and the manuscript to `dist/`. Run `node cover.mjs` to re-render the marketplace cover images into `dist/covers/`; the illustration lives in `cover-art.mjs` and is shared with the PDF's first page. If any page's content overflows its page, or any table header wraps, the build fails and names the page.
