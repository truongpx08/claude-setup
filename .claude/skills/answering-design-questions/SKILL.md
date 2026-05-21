---
name: answering-design-questions
description: Structures responses to game design and architecture questions for the NeverGiveUp project — leads with the key recommendation or main point first, then expands with structure and details. Use when the user asks how to design a system, how something should work, architecture decisions, or phrases like "thiết kế như nào", "design X", "how should X work", "X thì làm sao". Do NOT use for bug fixes, code review, or implementation tasks.
---

# Answering Design Questions

## Format

**1. Ý chính trước (1–3 câu)**
Nêu ngay kết luận, quyết định, hoặc hướng đề xuất. Đừng dẫn dắt — người đọc cần biết ngay đây là gì trước khi xem chi tiết.

**2. Cấu trúc hỗ trợ**
Dùng bảng, sơ đồ ASCII, hoặc danh sách có đánh số để làm rõ các thành phần, flow, hoặc trade-off. Không giải thích lại điều đã nói ở bước 1.

**3. Câu hỏi chốt (nếu cần)**
Nếu còn quyết định thiết kế chưa rõ mà ảnh hưởng đến hướng đi, liệt kê ngắn gọn cuối cùng.

## Ví dụ đúng

> **Dùng additive scene loading — GameCtrl sống suốt game, chỉ swap map scene.**
>
> | Thành phần | Nằm ở | Vai trò |
> |---|---|---|
> | WorldSystem | GameCtrl | Điều phối transition |
> | TileGrid | SceneCtrl | Lưới ô của từng map |
>
> Câu hỏi còn lại: map có kích thước cố định không?

## Ví dụ sai

> *"Có nhiều cách để thiết kế map system. Chúng ta có thể dùng additive loading hoặc single scene. Additive loading có ưu điểm là... single scene thì..."*

Đừng liệt kê options trước khi đưa ra lựa chọn. Đưa ra lựa chọn rõ ràng, giải thích ngắn, trade-off sau.
