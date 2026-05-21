---
name: project-nevergiveup
description: "Unity game project NeverGiveUp — framework template với _Base/ đã hoàn chỉnh, _Game/ chưa có, cần setup game logic"
metadata: 
  node_type: memory
  type: project
  originSessionId: bf8bcbca-fa84-4e5a-8ace-4eca3642644b
---

Dự án **NeverGiveUp** — Unity 6000.0.68f1 game với custom framework đã sẵn sàng, chưa có game content.

**Trạng thái hiện tại:**
- `_Base/` framework hoàn chỉnh: DI (VContainer), StateMachine, EventBus, Value<T>, UniTask
- `_Game/` chưa tồn tại — cần tạo mới
- SampleScene trống
- Chưa có CLAUDE.md ở root (cần copy từ `_Base/CLAUDE_BASE.md`)

**Việc cần làm:**
1. Tạo CLAUDE.md ở root (copy từ `Assets/_Base/CLAUDE_BASE.md`, điền tên project)
2. Tạo cấu trúc `Assets/_Game/Scripts/Installers/`, `States/`, v.v.
3. Implement GameCtrl (GameCtrlBase) — entry point boot scene
4. Tạo scene đầu tiên với SceneCtrl

**Why:** Mới setup dự án, framework đã có sẵn từ template _Base.
**How to apply:** Khi làm code cho project, luôn đặt game logic vào `_Game/`, không sửa `_Base/`.
