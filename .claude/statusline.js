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
