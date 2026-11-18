# Changes made to www.hideas.co.nz

Date: 18 November 2026, via the Shopify Admin API, following [the audit](hideas-co-nz-2026-11-18.md). Each change was checked against the live site after it was made.

## 1. Brand name: "HideAs" everywhere

- **Product vendor** changed from "Hide-as" to "HideAs" on 16 products (the Gisborne chest bag was already correct). The vendor feeds the `brand` in Product structured data, which now reads "HideAs" on every product page.
- **Page text** "Hide-as" changed to "HideAs" on: Shipping & Returns (3 mentions), Privacy Policy (1), Terms of Service (4), Reviews (1), and Our Leather (2, unpublished). Before-and-after comparison of the live text confirms nothing else changed.
- **Collection descriptions:** Featured (`frontpage`) and Men's.
- **Live theme** renamed from "Hide-as — Reviews page" to "HideAs — Reviews page". The theme name appears in every page's source code.

Not changed: the Queenstown Messenger Bag SKU `HA-HERNEBAY`. SKUs are internal and can be tied to inventory and feeds.

## 2. FAQ page rewritten

`/pages/faq` went from a single intro line to 23 questions (about 1,080 words) in six sections: Our leather, Care, Choosing a bag, Shipping, Returns/warranty/repairs, and Gifts and orders.

Topics were chosen from the questions comparable leather bag brands answer most: leather grade, natural marks, patina, smell, water, care, laptop fit, shipping, returns, warranty and repairs. Every answer uses only facts already on hideas.co.nz (shipping rates, return terms, warranty, care guide, About page), with no new claims. All 24 internal links were checked (200). The existing SEO title and meta description were kept.

Not answered, because the site doesn't say: where the bags are made, product dimensions (only the Gisborne lists them), payment methods, gift wrapping, and whether personalisation is offered. Adding these would make the FAQ stronger.

## 3. Empty collections hidden

Totes, Small Leather Goods, Wallets & Card Cases, Women's and Men's (0 products each) now have `seo.hidden = 1`. Verified live: each page outputs `noindex,nofollow`, and all five are gone from `sitemap_collections_1.xml`.

The connector blocks unpublishing, so the pages are still reachable by direct URL. To archive them fully, remove the sales channels from each collection in Shopify admin. Undo: delete the `seo.hidden` metafield, or set it to 0.

## 4. Meta descriptions

Added (131–152 characters):

| Page | Description |
|---|---|
| /pages/contact | Contact HideAs, the Kiwi-owned leather bag brand. Email hello@hideas.co.nz about orders, returns, repairs or products. We reply within one business day. |
| /pages/about | HideAs makes full-grain buffalo leather bags inspired by New Zealand, each named after a Kiwi place. Simple, practical bags built to last. |
| /pages/shipping-returns | HideAs shipping and returns: NZ delivery in 2–4 business days, $9 or free over $300. 30-day returns with a free NZ return label, plus repairs. |
| /pages/privacy-policy | How HideAs collects, uses and protects your personal information when you shop at hideas.co.nz, and your rights under the NZ Privacy Act 2020. |
| /pages/terms-of-service | The terms for shopping with HideAs: orders, NZD pricing, our one-year warranty on leather goods, and your rights under the Consumer Guarantees Act. |
| /pages/leather-care | How to care for a full-grain leather bag: keep it out of direct sun, dry it naturally, condition it once or twice a year and store it well. |
| /pages/reviews | Read real reviews of HideAs full-grain buffalo leather bags and journals from New Zealand customers who bought online or in person. |
| /pages/our-leather (unpublished) | Why HideAs uses only full-grain leather: no sanding or embossing, vegetable tanning where possible, and a patina that deepens every year. |
| /blogs/news | Leather bag guides from HideAs: how to choose a laptop bag, duffle or journal, how to care for full-grain leather, and gift ideas from New Zealand. |
| 5 hidden collections | Written for when they're restocked (e.g. Totes: "Full-grain leather tote bags from HideAs, built to carry a laptop and a full day's work…") |

Verified live: all 51 HTML pages in the sitemap now have a meta description between 70 and 160 characters.

## 5. Queenstown (formerly Hernebay) reviews: not fixed, needs Judge.me

The Queenstown Messenger Bag's review (Tane N, 5 stars) is attached to the correct product. But Judge.me's stored copy still uses the old handle `hideas-hernebay`:
- Review structured data `@id` is `/products/hideas-hernebay#product`, a different entity from the theme's `/products/queenstown-messenger-bag#product`, so Google sees two products and the rating isn't joined to the price and offer.
- Review widget links point to `/products/hideas-hernebay`, which 301s.

Writing corrected values was attempted: Shopify accepted the request but saved nothing, because the `judgeme` metafields belong to the Judge.me app. Updating the products didn't make Judge.me refresh either.

**To fix:** in the Judge.me app, re-sync the product data from Shopify, or ask Judge.me support to update the stored handle for product 9733307105523 from `hideas-hernebay` to `queenstown-messenger-bag`. The same stale-handle problem affects 10 other products (`hideas-kaiwaka`, `hideas-mangawhai`, `hideas-milldale`, `hideas-waipu`, `hideas-wanaka-laptop-bag`, `hideas-whangarei-laptop-bag`, `hideas-birkenhead-overnight-bag`, `hideas-northcote-duffle`, `hideas-milford-duffle-bag`, `hideas-wellington-duffle-bag`), so a full re-sync fixes all of them. Once the handles match, Judge.me's `@id` will equal the theme's, and Google will merge the rating into the product.

## Noticed, not changed

- The unpublished "Leather gifts" page says free NZ shipping over NZ$250, but the shipping page says $300. It also still has a `[LAST ORDER DATE]` placeholder and uses old product URLs (they redirect).
- Most product descriptions have no dimensions.
