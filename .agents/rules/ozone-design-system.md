---
trigger: always_on
---

# Ozone Design System Guidelines

- **Touch-first, not compact**: Ozone was developed for Touch. Prioritize room to breathe, comfort, and generous tap targets (medium-to-large elements) over dense/compact layouts so components stay fluent across mobile and desktop.
- **Use Ozone primitives**:
  - Use `<Indicator />` / `<InlineIndicator />` for transient counts and live status dots.
  - Use `<Badge />` for category, status, or tier tags (e.g., `PRO`, `SOON`).
  - Use `<PillButton />` (`@/components/primitives/PillButton`) for touch-first soft-surface circular/pill header and toolbar buttons (`iconOnly` for circles, default for labeled pills).
  - Use Ozone `<Button />`, `<Dialog />`, and `<Icon />` instead of ad-hoc styled elements.
- **Clean headers & no emojis**: Keep modal/dialog headers clean without decorative icons or unnecessary supportive text, and never use emojis in Ozone UI.
