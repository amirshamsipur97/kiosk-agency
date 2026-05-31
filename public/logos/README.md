# Client logos (Trusted-by strip)

Drop each client's real logo file here using the exact filename below. The
"Trusted by Leading Brands" marquee (`src/components/sections/TrustedBy.tsx`)
loads `/logos/<file>` for each brand and falls back to the brand name as text
if the file is missing.

Recommended: **SVG** (single-colour / monochrome works best — the strip applies
a white filter so logos render uniformly on the dark background). PNG with a
transparent background also works.

Expected files (real client logos, full-colour on white — shown in white cards):

- jw-marriott.png
- shangri-la.png
- movenpick.png
- bentley.png
- bank-dhofar.png
- lamborghini.png
- oq.png
- hotel-indigo.png
- ferrari.png
- oxy.png

Only use logos you have the right to display (e.g. real client/partner
relationships). To change the brand list, edit the `brands` array in
`src/components/sections/TrustedBy.tsx`.
