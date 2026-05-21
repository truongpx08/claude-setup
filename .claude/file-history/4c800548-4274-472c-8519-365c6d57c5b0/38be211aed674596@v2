---
name: project-farming-architecture
description: "Kiến trúc tổng thể farming game NeverGiveUp — data-driven, các hệ thống, patterns"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4c800548-4274-472c-8519-365c6d57c5b0
---

# Kiến trúc Farming Game

## Nguyên tắc cốt lõi: Data-Driven
Thêm nội dung mới (cây, con vật, NPC, story, quest) chỉ cần tạo ScriptableObject asset — không code thêm.

## 4 tầng mọi đối tượng

```
Config (ScriptableObject)     — đối tượng này là gì (bất biến)
       ↓
StateMachine / Logic          — đang làm gì, hành vi
       ↓
Runtime Data                  — đang như thế nào (thay đổi trong game)
       ↓
View                          — phản ánh ra màn hình (sprite, anim, UI)
       ↑ lắng nghe qua Value<T> hoặc EventBus
Save Data (subset of Runtime) — cần nhớ khi tắt game
```

## Các hệ thống

**Cây trồng**
- Config: growthTime, sprite, yield
- StateMachine: Planted → Growing → Ripe / Wilted
- View: đổi sprite theo state

**Con vật**
- Config: speed + IMoveBehavior (Strategy)
- StateMachine: Idle → Walking → Eating → Sleeping
- Strategy: WalkBehavior (bò), HopBehavior (gà), WaddleBehavior (vịt)
- View: play animation theo state

**NPC**
- Config: tên, portrait, dialogue, lịch sinh hoạt (ScheduleEntry: time → location → action)
- StateMachine: Idle → Walking → Working → Talking → Sleeping
- Save: relationship level, story flags
- View: dialogue bubble, animation

**Story System** (narrative tuyến tính, bắt buộc)
- StoryData: List<StoryStep>
- StoryStep (abstract ScriptableObject): DialogueStep, GiveItemStep, WaitForActionStep, FadeScreenStep
- StoryPlayer: foreach step → await step.Execute(ctx)
- DialogueStep hoàn thành khi player click Continue

**Quest System** (nhiệm vụ tự do)
- QuestData: List<QuestStepData>
- QuestStepData: eventToListen, matchValue, requiredCount
- QuestSystem lắng nghe EventBus — không biết game logic

## Scope GameCtrl vs SceneCtrl

```
GameCtrl (DontDestroyOnLoad)
  ├─ TimeSystem
  ├─ InventorySystem
  ├─ SaveSystem
  ├─ StorySystem
  └─ QuestSystem

SceneCtrl (per scene)
  ├─ FarmTileSystem
  ├─ CropSystem
  ├─ AnimalSystem
  └─ NPCSystem
```

## Giao tiếp qua EventBus

```
CropSystem   → emit OnCropHarvested
AnimalSystem → emit OnAnimalFed
NPCSystem    → emit OnNPCTalked
                    ↓
QuestSystem  lắng nghe → cập nhật progress
StorySystem  lắng nghe → advance step (WaitForActionStep)
```

## Pattern map

| Vấn đề | Pattern |
|---|---|
| Thêm loại mới không code | ScriptableObject + Data-driven |
| Đối tượng có nhiều trạng thái | StateMachine |
| Hành vi khác nhau về chất | Strategy |
| Các hệ thống giao tiếp | EventBus |
| Giá trị bind xuống UI | Value<T> |
| Class cần dùng class khác | DI (VContainer) |

**Why:** Thiết kế từ đầu để mở rộng dễ dàng — thêm cây/con vật/NPC/quest/story chỉ cần data, không phá vỡ code cũ (OCP).
**How to apply:** Khi implement hệ thống mới, luôn hỏi "cái này thay đổi theo cách nào? cái gì giống nhau? cái gì khác về chất?"
