# Mandatory HCI & Cognitive Ergonomics Design Rule

All frontend UI code and components in this application MUST adhere to human-computer interaction (HCI), cognitive psychology, and visual perception invariants without exception.

## 1. Hick's Law & Decision Ergonomics ($T = b \cdot \log_2(n + 1)$)
1. **One Primary Action**: Every dialog, drawer, section, or card MUST feature exactly ONE clear primary focal point or primary CTA.
2. **Eliminate Choice Latency**: Hide or remove unneeded options, duplicate tags, and secondary noise.
3. **No Competing Buttons**: NEVER present two equally prominent buttons in the same container. The primary action commands full visual contrast, while secondary actions use subtle or ghost styling.
4. **Friction Reduction**: Group multi-action sets (>2) into a vertical stack or overflow trigger (`MoreHorizontal24Filled`).

## 2. Gestalt Laws of Visual Perception
1. **Law of Similarity & Component Grammar Reuse**:
   - UI elements that perform similar semantic roles MUST share identical visual grammar (shape, token styling, border tokens, padding).
   - Reusing consistent look and feel across cards and views drastically lowers cognitive load, preventing the brain from having to recalibrate on every screen.
   - NEVER sprinkle random badge shapes or colors across adjacent items.
2. **Law of Proximity**:
   - Tightly related controls (e.g. search input + category filter) form a unified functional group and MUST be spaced closely (`space-y-3.5` / `gap-3.5`).
   - Distinct, independent page sections (Header, Metrics, Catalog) MUST maintain generous boundary spacing (`space-y-6` / `gap-6` or more).
3. **Law of Common Region & Figure-Ground**:
   - Use explicit design tokens (`bg-[var(--bg-secondary)]`, `border-[var(--border-subtle)]`) to delineate card surfaces.
   - Color is strictly reserved for live system states (e.g., active radio wave, live timer) or primary interactive triggers.

## 3. Information Architecture & Stacking Grammar
1. **Vertical Stacking (Information Journey)**:
   - **Header (Context / Entity)**: Who or what does this record represent? (Standard circular avatar + title + subtle category tag).
   - **Middle Hero Container (Primary Focal Point)**: What is the core value or primary action? (Highest visual weight and contrast).
   - **Footer (System Outcome & Verification)**: What was the result? (Checkmark confirmation, sync status, or timestamp in subtle muted tones).
2. **Horizontal Stacking (Peer Relationships)**:
   - Horizontal rows are strictly reserved for co-equal peer data pairings (`Label` on left $\leftrightarrow$ `Value / Badge` on right).

## 4. Working Memory & Cognitive Load (Miller's Law)
1. **Chunking**: Respect working memory limits ($4 \pm 1$ visual chunks per container).
2. **Zero Emojis & Zero Literal Symbols**: Emojis are strictly prohibited. Microcopy must not include literal `+` symbols which create duplicate icon artifacts.
3. **Iconography Invariant**:
   - Interactive clickable actions: Strictly `*Filled` Fluent vector icons.
   - Static metadata, labels, and headers: Strictly `*Regular` Fluent vector icons.
