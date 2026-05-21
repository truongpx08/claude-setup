# claude-setup

## Thêm StatusLine

StatusLine hiển thị thông tin context window, model và quota trên giao diện Claude Code.

Có hai phiên bản script — chọn theo hệ điều hành:

| File | Hệ điều hành | Yêu cầu |
|------|-------------|---------|
| `statusline.js` | Windows | Node.js |
| `statusline.sh` | macOS | bash + jq |

**1. Tạo file script** trong `~/.claude/`:

**`statusline.js`** (Windows):

```js
#!/usr/bin/env node
const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(chunks.join(''));
    const model = input?.model?.display_name || input?.model?.id || 'unknown';
    const ctxUsed = input?.context_window?.used_percentage;
    const ctxStr = ctxUsed != null ? `ctx:${Math.round(ctxUsed)}%` : 'ctx:--';
    const five = input?.rate_limits?.five_hour?.used_percentage;
    const week = input?.rate_limits?.seven_day?.used_percentage;
    let quotaStr = '';
    if (five != null) quotaStr += `5h:${Math.round(five)}%`;
    if (week != null) quotaStr += (quotaStr ? ' ' : '') + `7d:${Math.round(week)}%`;
    if (!quotaStr) quotaStr = 'quota:--';
    process.stdout.write(`${ctxStr} | ${model} | ${quotaStr}`);
  } catch {
    process.stdout.write('ctx:-- | error | quota:--');
  }
});
```

**`statusline.sh`** (macOS):

```sh
#!/usr/bin/env bash
input=$(cat)

model=$(echo "$input" | jq -r '.model.display_name // .model.id // "unknown"')

ctx_used=$(echo "$input" | jq -r '.context_window.used_percentage // empty')
if [ -n "$ctx_used" ]; then
  ctx_str=$(printf "ctx:%.0f%%" "$ctx_used")
else
  ctx_str="ctx:--"
fi

five=$(echo "$input" | jq -r '.rate_limits.five_hour.used_percentage // empty')
week=$(echo "$input" | jq -r '.rate_limits.seven_day.used_percentage // empty')
quota_str=""
if [ -n "$five" ]; then
  quota_str=$(printf "5h:%.0f%%" "$five")
fi
if [ -n "$week" ]; then
  [ -n "$quota_str" ] && quota_str="$quota_str "
  quota_str="${quota_str}$(printf "7d:%.0f%%" "$week")"
fi
[ -z "$quota_str" ] && quota_str="quota:--"

printf "%s | %s | %s" "$ctx_str" "$model" "$quota_str"
```

Sau khi tạo file `.sh`, cấp quyền thực thi: `chmod +x ~/.claude/statusline.sh`

**2. Thêm vào `~/.claude/settings.json`:**

Windows:
```json
{
  "statusLine": {
    "type": "command",
    "command": "node ~/.claude/statusline.js"
  }
}
```

macOS:
```json
{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/statusline.sh"
  }
}
```

**3. Khởi động lại Claude Code.**

Output mẫu:
```
ctx:42% | claude-sonnet-4-6 | 5h:18% 7d:5%
```

---

## Thêm Memory vào dự án

Memory là các file `.md` giúp Claude ghi nhớ hành vi qua các session. Lưu tại:

```
~/.claude/projects/<tên-project>/memory/
```

3 memory vừa được Hạnh thêm:

| File | Nội dung |
|------|----------|
| `feedback_writing_skills.md` | Luôn gọi skill `writing-skills` trước khi viết SKILL.md |
| `feedback_terminology_language.md` | Thuật ngữ tiếng Anh — giải thích tiếng Việt lần đầu, không lặp lại |
| `feedback_gitnexus_toolsearch.md` | GitNexus là deferred tools — PHẢI gọi `ToolSearch` trước khi dùng |

**Cách tạo một memory file:**

```markdown
---
name: tên-memory
description: Mô tả ngắn
metadata:
  type: feedback
---

Nội dung rule.

**Why:** Lý do.

**How to apply:** Cách áp dụng.
```

Sau khi tạo file, Claude sẽ tự động đọc và áp dụng trong các session tiếp theo.

---

## Skills đã thêm

Skills là các slash command tùy chỉnh, lưu trong `~/.claude/skills/<skill-name>/SKILL.md`.

Gọi trong Claude Code bằng cú pháp: `/<skill-name>`

### `writing-skills`

Hướng dẫn tạo Claude Agent Skills đúng chuẩn theo Anthropic spec. Dùng khi cần viết, tạo, sửa hoặc review một file SKILL.md. **Bắt buộc invoke trước khi viết bất kỳ SKILL.md nào.**

### `brainstorming`

Phỏng vấn người dùng liên tục về một kế hoạch hoặc thiết kế cho đến khi đạt được sự đồng thuận. Đi qua từng nhánh của cây quyết định, đặt câu hỏi từng cái một và đề xuất câu trả lời cho mỗi câu. Dùng khi muốn stress-test một plan hoặc design.

### `comparing-implementations`

So sánh hai implementation (triển khai) song song của cùng một khái niệm theo góc nhìn senior reviewer — phân loại loại object, áp dụng tiêu chí phù hợp, đưa ra verdict kèm dẫn chứng `file:line`. Dùng khi muốn đánh giá v1 vs v2 để chọn cái nào giữ lại. **Không dùng** để review uncommitted changes hoặc khi chỉ có một version.

### `reviewing-code`

Review các thay đổi local chưa commit (staged + unstaged + untracked) theo góc nhìn senior reviewer — điều tra intent và impact qua GitNexus, sau đó xuất báo cáo markdown vào `.claude/reviews/`. Dùng khi nói "review my changes", "check my changes", hoặc "is this ready to merge?".

### `answering-design-questions`

Trả lời câu hỏi về thiết kế hệ thống và kiến trúc — đưa ra kết luận/đề xuất ngay trước, sau đó mới mở rộng bằng bảng, sơ đồ hoặc danh sách. Dùng khi hỏi "thiết kế như nào", "design X", "how should X work". **Không dùng** cho bug fix, code review hoặc implementation.
