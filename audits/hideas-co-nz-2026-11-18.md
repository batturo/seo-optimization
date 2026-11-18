# SEO audit: www.hideas.co.nz

Date: 18 November 2026
Platform: Shopify (theme 11), served through Cloudflare
Scope: all 52 URLs in the XML sitemap, fetched and parsed with the claude-seo plugin's HTML parser and page checks, plus a Chromium render of the FAQ and contact pages.

Not covered: Core Web Vitals and PageSpeed (the Google API host is not allowed in this environment), backlinks, Search Console data, rankings, and the plain-HTTP to HTTPS redirect (couldn't be tested through this environment's proxy).

## Summary

The technical base is solid. All 52 sitemap URLs return 200. Every page has one H1 and a self-referencing canonical. No image is missing alt text. Product titles and descriptions are well written and unique. Old product handles 301 to the new ones, robots.txt is the sensible Shopify default, and `llms.txt`, `agents.md` and a UCP endpoint are in place for AI agents.

The problems are mostly content and structured data: an empty FAQ page, five empty collections in the sitemap, split product schema that keeps review stars apart from price data, and weak meta data on a handful of pages.

## Critical

### 1. The FAQ page is empty
`/pages/faq` has the title "FAQ" and a one-line intro ("Quick answers about HideAs leather bags, shipping, returns, repairs and care."). Rendered in Chromium, it has 12 words in `<main>` and no questions. It's in the sitemap and promises answers it doesn't give.

**Fix:** add 10–15 real questions and answers (leather grade, sizing and laptop fit, shipping times, returns, repairs, care, personalisation, gift wrapping, where you're based) and add `FAQPage` markup. FAQ rich results are limited to some sites now, but the content still helps long-tail and AI answers. Or remove the page and its links until it has content.

### 2. Five empty collections are indexable and in the sitemap
`/collections/mens`, `/collections/womens`, `/collections/totes`, `/collections/wallets-card-cases` and `/collections/small-leather-goods` all show "No products found". Each has a written description but no products. No other page links to them, so search engines find them only through the sitemap. Google will likely treat them as soft 404s.

**Fix:** assign products to them, or delete them (Shopify drops deleted collections from the sitemap). If they're coming soon, hide them with `seo.hidden` metafield = 1 until they have stock.

### 3. Product schema is split in two, so ratings aren't attached to offers
Each product page outputs two separate `Product` entities:
- the theme's, with `@id` `/products/wanaka-laptop-bag#product`, which has `offers` (price, availability) but no rating;
- Judge.me's, with `@id` `/products/hideas-wanaka-laptop-bag#product` (the **old** handle), which has `aggregateRating` and `review` but no `offers`.

Google sees two products: one with no rating, and one with ratings but no offer. That can cost the review-star rich result and raise "missing offers" warnings in Search Console. This affects 11 products. Judge.me IDs still use old handles such as `hideas-hernebay` (now the Queenstown Messenger Bag), `hideas-kaiwaka`, `hideas-milldale` and `hideas-waipu`.

**Fix:** in Judge.me, turn off its separate rich-snippet output and use its theme integration that merges `aggregateRating` into the theme's Product JSON-LD, or edit the theme's product schema snippet to include the Judge.me rating metafields (`reviews.rating`, `reviews.rating_count`). Afterwards, test one product in Google's Rich Results Test.

## High

### 4. Inconsistent brand name in structured data
The Product `brand` is "Hide-as" on 16 products and "HideAs" on 1 (the Gisborne chest bag). Organization, titles and Article publisher use "HideAs", and some page copy uses "Hide-as". Pick one, presumably "HideAs", and use it everywhere: the product vendor field in Shopify drives `brand`.

### 5. Organization schema is minimal; no WebSite or BreadcrumbList schema
The homepage `Organization` has only `name` and `url`. Add `logo`, `sameAs` (Instagram, Facebook and so on), `contactPoint`, and the NZ address or area served. Add `WebSite` (with `SearchAction` for `/search?q=`) on the homepage and `BreadcrumbList` on products, collections and articles. None of the 51 HTML pages has breadcrumb markup.

### 6. Missing or junk meta descriptions on 7 pages
- **Empty:** `/blogs/news`, `/pages/contact`.
- **Auto-generated from body text (320 chars, cut off mid-sentence):** `/pages/about` (it starts with a run of whitespace and reads "HideAs Simply Timeless HideAs is a New Zealand inspired brand."), `/pages/leather-care`, `/pages/shipping-returns`, `/pages/privacy-policy`, `/pages/terms-of-service`.

**Fix:** write a 120–155 character description for each in Shopify (page, then "Search engine listing").

### 7. Article author is the brand, typed as a Person
All 8 blog posts have `author: {"@type": "Person", "name": "HideAs"}`. Use a real named author (founder or maker) with a short bio and an author page. That's a direct E-E-A-T signal for buying-guide content. Otherwise, use `"@type": "Organization"`.

## Medium

### 8. Thin pages
| Page | Words in main content | Note |
|---|---|---|
| `/pages/contact` | ~6 (just the form) | Add address/region, email, phone, response time, opening hours, a map if there's a showroom |
| `/pages/about` | ~210 incl. template | The founder's story, where and how bags are made, and why buffalo leather are what builds trust |
| `/pages/leather-care` | ~160 incl. template | Overlaps the blog post `how-to-care-for-a-leather-bag`; merge into one strong guide and redirect or link |
| 4 how-to posts | 286–382 | `how-to-care…`, `how-to-choose-a-leather-laptop-bag`, `weekender-duffle-or-overnight-bag` and `what-is-full-grain-buffalo-leather` are thin next to the 700–950-word buying guides |

### 9. Weak titles on non-product pages
The Shopify default `X – HideAs` format gives short, low-intent titles:
- `/collections/mens` "Men's – HideAs", `/collections/womens`, `/collections/totes` (fix after item 2)
- `/blogs/news` "News – HideAs": try "Leather Bag Guides & Care Tips | HideAs"
- `/pages/about` "About – HideAs": try "About HideAs | Kiwi-Owned Leather Bag Brand"
- `/pages/reviews` "Reviews – HideAs": try "HideAs Reviews | Leather Bags Rated by NZ Customers"
- `/pages/contact` "Contact – HideAs"

### 10. No og:image on 32 of 51 pages, including the homepage
The homepage, all collections, all static pages, the blog index and five of the eight articles have no `og:image`, so shared links show no preview. **Fix:** set a default social sharing image in Shopify (Online Store, Preferences); pages without their own image fall back to it.

### 11. `/collections/frontpage` is in the sitemap
This is Shopify's default homepage collection (10 products, title "Featured Leather Bags & Journals"). It overlaps the homepage and Best Sellers. Leave it out of the index (`seo.hidden`) unless it's deliberately a landing page.

### 12. Year in blog URLs
`best-leather-bags-new-zealand-2027`, `best-leather-laptop-bags-nz-2027` and `best-leather-travel-journals-2027` put the year in the slug, so next year's update needs a new URL and a redirect, or the URL looks out of date. Use year-less slugs and keep the year in the title only. Now is the cheapest time to change them: all 8 posts are dated 18 Nov 2026 (`datePublished`), so they've had almost no time to build links.

### 13. Out-of-stock products
Wanaka Laptop Bag, Milldale Flap Bag, Waipu Round Bag and Mangawhai Sling Bag are `OutOfStock`. Keep the pages live (they hold reviews and links), but add a back-in-stock signup and links to similar in-stock bags so the traffic isn't wasted.

### 14. Few reviews
Rated products have 1–3 reviews each (all 5.0), and 6 products have none. Turn on Judge.me's post-purchase review request emails and photo reviews. Review volume affects both stars in results and conversion.

## Low

- **Icon-only links without accessible text:** the account link and a `/collections/all` link in the header have no text or `aria-label`. Add labels.
- **HSTS** `max-age` is about 91 days with no `includeSubDomains`. Raise it to 1 year when you're confident.
- **Product handles vs names:** `buffalo-leather-chest-bag` is "Gisborne Leather Chest Bag", `milford-travel-duffle-bag` is "Milford Duffle Bag", and `albany-large-toiletry-bag` is "Albany **Big** Toiletry Bag". They don't need changing (they're descriptive), but don't rename again without redirects.
- **Schema description text** on products runs headings into sentences ("…laptop bag for professionals…Full-grain buffalo leatherFull-grain leather keeps…"). Cosmetic, but it's what AI shopping agents read; a cleaner `description` would help.
- **HTML weight:** the homepage HTML is 599 KB and collections are 300–610 KB, with 93 `<script>` tags on the homepage and a `<head>` with more than 120 children. Review installed apps and remove unused ones. Run PageSpeed Insights to see the real impact.

## What's working

- Unique, keyword-led product titles and descriptions ("Wanaka Leather Laptop Bag NZ | HideAs") with NZ intent
- Homepage title, description, H1 and hero (`fetchpriority="high"`, not lazy loaded) are well set up
- Every image has descriptive alt text and dimensions
- Clean canonicals; collection-scoped product URLs 301 to the canonical product URL
- Old product handles 301 correctly
- `content-language: en-NZ`, NZD pricing in schema
- AI and agent readiness: `llms.txt`, `agents.md`, an agentic discovery sitemap and a UCP endpoint
- A useful buying-guide cluster (best bags, laptop bags, journals, gift guide) that links to products

## Suggested order

1. Fill the FAQ page (item 1) and fix or hide the empty collections (item 2): about an hour in Shopify admin.
2. Merge the Judge.me rating into the product schema (item 3) and unify the brand name (item 4).
3. Meta descriptions, titles and the default social image (items 6, 9, 10): about 30 minutes.
4. Schema additions: Organization, WebSite, BreadcrumbList, article author (items 5, 7).
5. Content depth: about, contact, the thin guides, and the slug change while the posts are new (items 8, 12).
