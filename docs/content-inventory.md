# Content inventory: old ellacare.com

Source: Wayback Machine snapshot of https://ellacare.com/ from 16 Jan 2026. The old site was a 2011-era WordPress install using the "Empire" theme.

## Business details

- **Name:** EllaCare / Ella Care LLC, "A quality alternative to nursing home"
- **Type:** Adult Family Home, "Home away from home!"
- **Address:** 2330 189th Place SW, Lynnwood, WA 98036
- **Phones:** Home 425-776-4026 · Cell 425-551-8910 · Emergency 408-230-5565 · Fax 425-670-2037
  - ⚠️ The header listed the **cell** number as the main contact, but the footer and contact page listed the **home** number. The new site uses the home number as the main one. If that's wrong, change `phones.main` in `src/lib/site.ts`.

## Page content

This is a summary. The full edited copy is in `src/lib/site.ts` and the page files.

- **Home:** a slider of 4 iStock photos (not reused); a "lorem ipsum" placeholder block (removed); "Who's qualified?" (interactive enrollment process); "Basic services" (24/7 monitoring, bathing and personal care, 3 home-cooked meals plus snacks, holiday parties, housekeeping, transportation); "Fun activities".
- **About Us:** home-like residential care, cheerful trained staff, independence, daily activities, home-style meals.
- **Services:**
  - quality monitoring against industry benchmarks
  - hearing, vision and language assistance, with interpreters
  - private and double rooms, with an in-room phone from 7am to 10pm
  - Skype video calls
  - medical: home doctor, nurse on call 24/7, on-site OT/PT, medication management
- **Residences:** 10 photos: 3 bedrooms, bathroom, shower, bathroom+shower, living room, dining room, kitchen, sun room. **All reused.**
- **Menus:** fresh daily cooking, custom menus for individual preferences. No actual menus were published.
- **Activities:** arts & crafts (painting, drawing, pottery), quilting and sewing, scrapbooking, puzzles, library visits, dominoes, plus games, cards, gardening, movie nights, celebrations and outdoor walks.
- **Security:** safety comes first, industry-standard procedures, feedback is welcome.
- **Testimonials:** one, from Carol DeQuoy. Kept word for word except for typo fixes.
- **Policy:** HIPAA privacy, patient rights, safety drills, smoke-free home with a designated outdoor smoking area.
- **Privacy:** "Your information will never be shared without your permission."
- **Contact:** quiet neighborhood in Lynnwood, visits by appointment, and a name/email/message form.

## Problems found on the old site

1. **The old site has been hacked.** The homepage contains an injected spam link to a pharmacy site ("kobe cialis uden recept"). Take the old WordPress install offline once the new site is live.
2. The homepage has lorem ipsum placeholder text.
3. It isn't mobile-friendly, and the images are tiny and low-res (a 936×320 slider and 300px thumbnails).
4. Phone numbers are inconsistent. The site still has old "Share and Enjoy" del.icio.us/Digg buttons and Skype references.
5. There's no clear call to action, no way to book a tour, and no SEO metadata or structured data.
