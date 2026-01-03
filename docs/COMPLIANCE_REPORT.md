# Compliance Report: HotShareGames Integration

**Date:** 2026-01-03
**Target Site:** https://www.hotsharegames.com
**Operator:** Movisoft Co., Ltd (South Korea)

---

## ❌ INTEGRATION NOT PERMITTED

### Summary
**HotShareGames does NOT provide legal means for third-party integration.**

---

## Findings

### 1. Terms of Service Analysis

| Aspect | Status | Evidence |
|--------|--------|----------|
| Standalone Game Services | ❌ PROHIBITED | "핫쉐어의 게임들로 단독 게임 서비스를 할 수 없습니다" (Games cannot be used as standalone services) |
| Content Redistribution | ❌ REQUIRES WRITTEN CONSENT | "사전 서면 동의" (prior written consent required) |
| API Access | ❌ NOT AVAILABLE | No API documentation exists |
| Embed Codes | ❌ NOT PROVIDED | No public embed system |
| Scraping/Data Mining | ❌ EXPLICITLY PROHIBITED | Terms forbid automated data collection |

### 2. Prohibited Actions (Direct Quotes)

From the Terms of Service:
> Users cannot "복제, 저장, 공개, 전송, 수정, 번역, 게시, 재라이선스"
> (reproduce, store, publish, transmit, modify, translate, post, or relicense) without written authorization.

### 3. What IS Allowed

- Commercial use is permitted ("개인, 기업 구분없이 상업적 목적으로 사용이 가능합니다")
- BUT only within their platform, not redistribution to external sites

### 4. Contact for Partnership

If you wish to pursue a formal partnership:
- **Email:** biz@movisoft.co.kr
- **Phone:** +82-70-4012-7683
- **Address:** 621 Jeonil Building, 245 Geumnam-ro, Dong-gu, Gwangju, South Korea

---

## ✅ LEGAL ALTERNATIVES

Since HotShareGames integration is not permitted, we will use these **legal providers**:

### Provider 1: GamePix (Already Integrated)
- **Status:** ✅ Active in your codebase
- **Method:** Official Publisher API
- **Endpoint:** `https://games.gamepix.com/games`
- **License:** Publisher embed with revenue share
- **Games:** 1000+ HTML5 games

### Provider 2: itch.io HTML5 Games
- **Status:** 🔄 To be implemented
- **Method:** oEmbed API + Creator permissions
- **License:** Per-game (many allow embedding)
- **URL:** https://itch.io/games/html5

### Provider 3: Open Source Games
- **Status:** 🔄 To be implemented
- **Method:** Self-hosted (MIT/Apache/CC licenses)
- **Sources:** GitHub collections, js13kgames, etc.

---

## Action Items

1. ✅ Continue using GamePix (already working)
2. 🔄 Add itch.io connector for creator-permitted games
3. 🔄 Add curated open-source games list
4. 📧 Optionally send partnership inquiry to HotShareGames

---

## Legal Disclaimer

This report is based on publicly available terms as of January 2026.
Always verify current terms before any integration attempt.
When in doubt, obtain written permission from content owners.
