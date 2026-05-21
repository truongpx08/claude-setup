---
name: feedback-gitnexus-toolsearch
description: "GitNexus là deferred tools: PHẢI gọi ToolSearch trước, không fallback sang Explore/Grep"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f146c00e-c29d-427a-8f73-4f5b6d8acca0
---

GitNexus tools (`mcp__gitnexus__*`) là deferred tools — schema chưa được load sẵn. PHẢI gọi `ToolSearch(query: "select:mcp__gitnexus__<tool>")` trước khi dùng bất kỳ GitNexus tool nào.

**Why:** Gọi trực tiếp mà không ToolSearch trước sẽ fail với InputValidationError vì schema chưa có.

**How to apply:** Không fallback sang Explore hoặc Grep khi cần dữ liệu từ graph. Luôn load schema qua ToolSearch rồi mới gọi tool.
