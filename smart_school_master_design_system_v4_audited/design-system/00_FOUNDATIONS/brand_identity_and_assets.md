# Brand Identity & SVG Assets

Brand idea: **مدرسه هوشمند آینده (AI-Powered Smart School)** --- learning that is intelligent, humane, and
explainable. The mark combines an open-book/page fold with a prism-like
neural node. The SVGs below are standalone vector assets with no
external image, font, script, or CSS dependency.

## 1. Primary logo icon

Save as `02_ASSETS/svg/brand-icon.svg`.

``` svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" role="img" aria-labelledby="title desc">
  <title id="title">Nava intelligent learning mark</title>
  <desc id="desc">An open book folded into a luminous neural prism.</desc>
  <defs>
    <linearGradient id="aura" x1="12" y1="16" x2="116" y2="112" gradientUnits="userSpaceOnUse">
      <stop stop-color="#7C3AED"/>
      <stop offset=".52" stop-color="#4F46E5"/>
      <stop offset="1" stop-color="#06B6D4"/>
    </linearGradient>
    <linearGradient id="page" x1="25" y1="42" x2="65" y2="100" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F8FAFC"/>
      <stop offset="1" stop-color="#CBD5E1"/>
    </linearGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <path d="M64 13 108 38 108 87 64 113 20 87 20 38Z" fill="#0F172A" stroke="url(#aura)" stroke-width="2.5"/>
  <path d="M31 43c12-5 23-3 33 5v42c-10-8-21-10-33-5Z" fill="url(#page)" stroke="#94A3B8" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M97 43c-12-5-23-3-33 5v42c10-8 21-10 33-5Z" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M64 48v42" stroke="#7C3AED" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M40 55c6-2 11-1 16 2M40 65c6-2 11-1 16 2M72 57c5-3 10-4 16-2M72 67c5-3 10-4 16-2" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>
  <g filter="url(#glow)">
    <path d="m64 23 13 13-13 13-13-13Z" fill="url(#aura)" stroke="#A5F3FC" stroke-width="1.5"/>
    <circle cx="64" cy="36" r="4" fill="#F8FAFC"/>
  </g>
  <path d="M64 49v-7M51 36H43M77 36h8M64 49l-7 8M64 49l7 8" stroke="#67E8F9" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="43" cy="36" r="2.5" fill="#06B6D4"/><circle cx="85" cy="36" r="2.5" fill="#06B6D4"/>
  <circle cx="57" cy="57" r="2" fill="#7C3AED"/><circle cx="71" cy="57" r="2" fill="#06B6D4"/>
</svg>
```

## 2. Horizontal bilingual wordmark

Save as `02_ASSETS/svg/wordmark-horizontal.svg`. The wordmark uses live
text with generic font fallbacks; for production brand lockups, convert
text to paths in the design tool after the font and legal naming are
approved.

``` svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 112" width="440" height="112" role="img" aria-labelledby="title desc">
  <title id="title">Nava bilingual wordmark</title>
  <desc id="desc">Nava learning platform, in English and Persian.</desc>
  <defs>
    <linearGradient id="mark" x1="12" y1="12" x2="94" y2="94" gradientUnits="userSpaceOnUse">
      <stop stop-color="#7C3AED"/><stop offset=".55" stop-color="#4F46E5"/><stop offset="1" stop-color="#06B6D4"/>
    </linearGradient>
  </defs>
  <g transform="translate(8 4)">
    <path d="M48 5 87 27v44L48 94 9 71V27Z" fill="#0F172A" stroke="url(#mark)" stroke-width="2.5"/>
    <path d="M20 35c10-4 19-2 28 5v34c-9-7-18-9-28-5Zm56 0c-10-4-19-2-28 5v34c9-7 18-9 28-5Z" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M48 40v34" stroke="#7C3AED" stroke-width="2"/>
    <path d="m48 13 10 10-10 10-10-10Z" fill="url(#mark)" stroke="#A5F3FC" stroke-width="1.5"/>
    <circle cx="48" cy="23" r="3" fill="#fff"/>
  </g>
  <text x="118" y="51" fill="#F8FAFC" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="750" letter-spacing="1.5">NAVA</text>
  <text x="118" y="78" fill="#94A3B8" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="600" letter-spacing="2.2">INTELLIGENT LEARNING</text>
  <text x="428" y="52" text-anchor="end" direction="rtl" unicode-bidi="plaintext" fill="#E2E8F0" font-family="Vazirmatn, Tahoma, sans-serif" font-size="24" font-weight="700">نوا</text>
  <text x="428" y="77" text-anchor="end" direction="rtl" unicode-bidi="plaintext" fill="#94A3B8" font-family="Vazirmatn, Tahoma, sans-serif" font-size="12">مدرسه هوشمند و سنجش‌یار</text>
</svg>
```

## 3. Squircle app icon --- 512 × 512

Save as `02_ASSETS/svg/app-icon-512.svg`. Export PNG at 512×512 for
stores; keep the SVG as the canonical vector source.

``` svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-labelledby="title desc">
  <title id="title">Nava app icon</title>
  <desc id="desc">Open book and glowing AI prism on a dark rounded-square background.</desc>
  <defs>
    <linearGradient id="bg" x1="40" y1="24" x2="476" y2="488" gradientUnits="userSpaceOnUse">
      <stop stop-color="#111C32"/><stop offset="1" stop-color="#070A12"/>
    </linearGradient>
    <linearGradient id="neon" x1="116" y1="90" x2="398" y2="414" gradientUnits="userSpaceOnUse">
      <stop stop-color="#7C3AED"/><stop offset=".52" stop-color="#4F46E5"/><stop offset="1" stop-color="#06B6D4"/>
    </linearGradient>
    <linearGradient id="paper" x1="132" y1="216" x2="255" y2="398" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FFFFFF"/><stop offset="1" stop-color="#CBD5E1"/>
    </linearGradient>
    <filter id="halo" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="14" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect x="12" y="12" width="488" height="488" rx="112" fill="url(#bg)"/>
  <rect x="13.5" y="13.5" width="485" height="485" rx="110.5" fill="none" stroke="#334155" stroke-opacity=".75" stroke-width="3"/>
  <circle cx="256" cy="205" r="130" fill="#4F46E5" opacity=".10"/>
  <path d="M256 72 400 155v166l-144 83-144-83V155Z" fill="#0F172A" stroke="url(#neon)" stroke-width="8"/>
  <path d="M143 218c38-15 76-8 113 20v132c-37-28-75-35-113-20Z" fill="url(#paper)" stroke="#94A3B8" stroke-width="5" stroke-linejoin="round"/>
  <path d="M369 218c-38-15-76-8-113 20v132c37-28 75-35 113-20Z" fill="#E2E8F0" stroke="#94A3B8" stroke-width="5" stroke-linejoin="round"/>
  <path d="M256 238v132" stroke="#7C3AED" stroke-width="8" stroke-linecap="round"/>
  <path d="M170 259c20-7 39-4 57 5M170 290c20-7 39-4 57 5M285 264c18-9 37-12 57-5M285 295c18-9 37-12 57-5" fill="none" stroke="#64748B" stroke-width="7" stroke-linecap="round"/>
  <g filter="url(#halo)">
    <path d="m256 111 44 44-44 44-44-44Z" fill="url(#neon)" stroke="#A5F3FC" stroke-width="5"/>
    <circle cx="256" cy="155" r="13" fill="#F8FAFC"/>
  </g>
  <path d="M256 199v-20M212 155h-22M300 155h22M226 185l-15 15M286 185l15 15" fill="none" stroke="#67E8F9" stroke-width="5" stroke-linecap="round"/>
  <circle cx="190" cy="155" r="7" fill="#06B6D4"/><circle cx="322" cy="155" r="7" fill="#06B6D4"/>
</svg>
```

## 4. Agent avatar states

All four avatars use a 96×96 viewBox and a shared visual language. They
are intentionally status glyphs, not anthropomorphic faces. Use the same
accessible label as the adjacent status text. Store as separate files.

### Idle --- `agent-idle.svg`

``` svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96" role="img" aria-labelledby="t">
  <title id="t">AI assistant idle</title>
  <defs><linearGradient id="g" x1="14" y1="12" x2="82" y2="84"><stop stop-color="#7C3AED"/><stop offset=".55" stop-color="#4F46E5"/><stop offset="1" stop-color="#06B6D4"/></linearGradient></defs>
  <circle cx="48" cy="48" r="42" fill="#0F172A" stroke="#293449" stroke-width="2"/>
  <path d="M48 19 72 33v30L48 77 24 63V33Z" fill="#111C32" stroke="url(#g)" stroke-width="2.5"/>
  <path d="m48 28 12 12-12 12-12-12Z" fill="url(#g)"/>
  <circle cx="48" cy="40" r="4" fill="#F8FAFC"/>
  <path d="M35 57h26M39 63h18" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
</svg>
```

### Listening / Recording --- `agent-listening.svg`

``` svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96" role="img" aria-labelledby="t">
  <title id="t">AI assistant listening</title>
  <defs><linearGradient id="g" x1="12" y1="12" x2="84" y2="84"><stop stop-color="#7C3AED"/><stop offset=".5" stop-color="#4F46E5"/><stop offset="1" stop-color="#06B6D4"/></linearGradient></defs>
  <circle cx="48" cy="48" r="42" fill="#0F172A" stroke="#293449" stroke-width="2"/>
  <circle cx="48" cy="48" r="28" fill="#111C32" stroke="url(#g)" stroke-width="2.5"/>
  <rect x="42" y="27" width="12" height="29" rx="6" fill="#67E8F9"/>
  <path d="M33 45v4a15 15 0 0 0 30 0v-4M48 64v7M39 71h18" fill="none" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round"/>
  <path d="M21 40v16M75 40v16" stroke="#06B6D4" stroke-width="3" stroke-linecap="round"/>
</svg>
```

### Thinking / Computing --- `agent-thinking.svg`

``` svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96" role="img" aria-labelledby="t">
  <title id="t">AI assistant computing</title>
  <defs><linearGradient id="g" x1="12" y1="12" x2="84" y2="84"><stop stop-color="#7C3AED"/><stop offset=".5" stop-color="#4F46E5"/><stop offset="1" stop-color="#06B6D4"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <circle cx="48" cy="48" r="42" fill="#0F172A" stroke="#4F46E5" stroke-width="2"/>
  <path d="M48 18 74 33v30L48 78 22 63V33Z" fill="#111C32" stroke="url(#g)" stroke-width="2"/>
  <g filter="url(#glow)" fill="url(#g)" stroke="#A5F3FC" stroke-width="1.5">
    <circle cx="48" cy="31" r="5"/><circle cx="33" cy="48" r="5"/><circle cx="63" cy="48" r="5"/><circle cx="48" cy="65" r="5"/>
  </g>
  <path d="M48 36v24M38 48h20M37 37l22 22M59 37 37 59" stroke="#67E8F9" stroke-width="2" stroke-linecap="round"/>
  <circle cx="48" cy="48" r="6" fill="#F8FAFC"/>
</svg>
```

### Flagged / Alert --- `agent-flagged.svg`

``` svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96" role="img" aria-labelledby="t">
  <title id="t">AI assistant needs review</title>
  <circle cx="48" cy="48" r="42" fill="#0F172A" stroke="#F43F5E" stroke-width="2.5"/>
  <path d="M48 19 76 68H20Z" fill="#2A1424" stroke="#F43F5E" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M48 35v16" stroke="#FDA4AF" stroke-width="5" stroke-linecap="round"/>
  <circle cx="48" cy="60" r="3" fill="#FDA4AF"/>
</svg>
```

## 5. Asset integration notes

-   SVGs are source assets; export PNG app-store renditions at 512×512
    and platform-specific sizes from the canonical source.
-   Do not embed external fonts or remote references in SVGs. Verify
    title and description accessibility in the consuming UI.
-   The brand name **مدرسه هوشمند آینده (AI-Powered Smart School)** is a proposed working name. Confirm
    trademark, domain, and stakeholder approval before shipping.
