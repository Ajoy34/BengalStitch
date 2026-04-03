# Design System Specification: The Luminous Nexus

## 1. Overview & Creative North Star
The creative North Star for this design system is **"The Luminous Nexus."** 

We are not building a standard utility dashboard; we are crafting a digital stage for creators. The aesthetic avoids the "template" look by rejecting rigid, boxed-in layouts in favor of **intentional asymmetry** and **tonal depth**. By utilizing high-contrast typography scales and overlapping glass surfaces, we create an editorial experience that feels both high-tech and human-centric. The interface should feel like a premium dark-room studio—focused, energetic, and infinitely deep.

## 2. Color & Atmospheric Theory
The palette is rooted in the depth of space, punctuated by electric pulses of light. We use a hierarchy of dark purples and blues to create a sense of infinite canvas.

### The Color Palette
*   **Background (`#14121b`)**: Our foundation. A deep, void-like purple-black.
*   **Primary (`#00dddd`)**: "Electric Cyan." Reserved for core actions and critical creator paths.
*   **Secondary (`#ffabf3`)**: "Vibrant Magenta." Used for creative accents, badges, and "pro" features.
*   **Tertiary (`#cfbdff`)**: "Soft Lavender." Used for secondary information and subtle interactive states.

### The "No-Line" Rule
**Strict Mandate:** 1px solid borders for sectioning are prohibited. Boundaries must be defined solely through background color shifts. 
*   To separate a sidebar from a main feed, transition from `surface` to `surface-container-low`. 
*   To define a header, use a backdrop-blur on a `surface-container` background rather than a bottom-stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the `surface-container` tiers to create depth:
1.  **Base Layer:** `surface` or `surface-dim`
2.  **Sectional Layer:** `surface-container-low` (e.g., a page section)
3.  **Component Layer:** `surface-container-highest` (e.g., a card or a modal)
4.  **Floating Layer:** Glassmorphism (semi-transparent surface colors with 20px-40px backdrop-blur).

### Signature Textures
Main CTAs should never be flat. Use a linear gradient from `primary` to `primary-container` at a 135-degree angle. This "inner glow" provides a 3D soul to the high-tech interface.

## 3. Typography: Editorial Authority
We utilize two typefaces to balance "Professional Tech" with "Creator Energy."

*   **Display & Headlines (Plus Jakarta Sans):** These are our "Editorial" voices. Use `display-lg` for hero sections with tight letter-spacing (-2%). These should feel massive and authoritative.
*   **Body & Labels (Inter):** This is our "Functional" voice. Inter provides high legibility at small sizes, particularly in dark mode where "halation" (glow) can occur.

**Hierarchy Strategy:** 
Use a high contrast between `headline-lg` and `body-md`. Do not be afraid of whitespace; a single line of `headline-sm` in `primary` color can carry an entire section if given enough room to breathe.

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering** and **Ambient Light**, not structural lines.

*   **The Layering Principle:** Instead of shadows, place a `surface-container-lowest` card on a `surface-container-low` section. This creates a "recessed" look that is softer and more sophisticated than a drop shadow.
*   **Ambient Shadows:** When an element must float (like a dropdown or a premium creator card), use a shadow with a blur radius of 30px-60px and an opacity of 6%. The shadow color should not be black, but a tinted version of `surface-container-highest` to mimic natural light absorption.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token at **15% opacity**. This creates a "whisper" of an edge that defines the shape without breaking the fluid aesthetic.
*   **Glassmorphism:** For top-tier navigation or floating music/video players, use `surface-variant` at 60% opacity with a `blur(12px)` filter.

## 5. Components

### Buttons
*   **Primary:** Gradient (`primary` to `primary-container`), `rounded-md`, `label-md` uppercase with 5% letter spacing.
*   **Secondary:** Ghost style. Transparent background with a `Ghost Border` and `secondary` text color.
*   **Tertiary:** No background. `primary` text with a subtle underline on hover.

### Creator Cards
*   **Structure:** No borders. Use `surface-container-high`. 
*   **Interaction:** On hover, the card should lift using a `primary` ambient shadow and a 2% scale increase. 
*   **Content:** Avoid dividers. Use `2rem` of vertical padding between the header and the body text.

### Input Fields
*   **Style:** `surface-container-lowest` background. 
*   **States:** On focus, the `Ghost Border` transitions to 100% opacity `primary` color with a 2px outer "glow" (a shadow using the primary color at 20% opacity).

### Chips
*   **Selection:** Use `secondary-container` with `on-secondary-container` text.
*   **Shape:** Always `rounded-full`.

### Tooltips & Modals
*   Apply `backdrop-filter: blur(8px)` to the background behind modals.
*   Tooltip backgrounds should use `inverse-surface` to provide a sharp contrast against the deep purple background.

## 6. Do’s and Don’ts

### Do:
*   **Do** overlap elements. Let a 3D asset or image bleed from one `surface-container` into another to create a sense of unity.
*   **Do** use `primary-fixed-dim` for large icons to prevent "retina burn" in dark mode.
*   **Do** use asymmetrical margins (e.g., 5% left, 10% right) in hero layouts to create a bespoke, editorial feel.

### Don't:
*   **Don't** use pure black (`#000000`). It kills the depth of the purples and blues.
*   **Don't** use 100% opaque, high-contrast borders. They make the UI feel like a legacy spreadsheet.
*   **Don't** use standard "drop shadows" (small blur, high opacity). They look "dirty" on dark themes.
*   **Don't** crowd the interface. If a screen feels busy, increase the spacing scale rather than adding lines to organize it.