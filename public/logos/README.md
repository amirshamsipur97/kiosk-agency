# Client logos (Trusted-by strip)

Drop each client's real logo file here using the exact filename below. The
"Trusted by Leading Brands" marquee (`src/components/sections/TrustedBy.tsx`)
loads `/logos/<file>` for each brand and falls back to the brand name as text
if the file is missing.

Recommended: **SVG** (single-colour / monochrome works best — the strip applies
a white filter so logos render uniformly on the dark background). PNG with a
transparent background also works.

Expected files:

- jw-marriott.svg
- shangri-la.svg
- movenpick.svg
- bentley.svg
- bank-dhofar.svg
- lamborghini.svg
- oq.svg
- hotel-indigo.svg
- ferrari.svg
- oxy.svg

Only use logos you have the right to display (e.g. real client/partner
relationships). To change the brand list, edit the `brands` array in
`src/components/sections/TrustedBy.tsx`.
