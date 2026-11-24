// 结构卡：项目数据 → SVG。骨架与 logo 同构——中心是主控，放射线连到外设和 AI 能力。
import { HARDWARE_ROLES, PLATFORMS, type HardwareRole, type ProjectAi } from './taxonomy.ts';

const W = 400;
const H = 250;
const CX = W / 2;
const CY = H / 2;
const RX = 130;
const RY = 86;
const MAX_HW = 5;
const MAX_AI = 2;
const PILL_H = 30;

const C = {
  bg: '#f4f2ec',
  grid: '#dcd8cc',
  teal: '#073431',
  accent: '#1ea97f',
  accentSoft: '#e3f4ed',
  white: '#ffffff',
};

interface Node {
  label: string;
  kind: 'hw' | 'ai';
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// 粗估文字宽度：中日韩字符 1em，其余 0.6em
const textWidth = (s: string, size: number) => [...s].reduce((w, ch) => w + (/[⺀-￿]/.test(ch) ? size : size * 0.6), 0);

const clip = (s: string, max: number) => ([...s].length > max ? [...s].slice(0, max - 1).join('') + '…' : s);

// 由 id 得到稳定的小角度偏移，让每张卡的放射角度略有不同
function hashAngle(id: string): number {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return (h % 30) - 15;
}

function nodesOf(ai: ProjectAi): Node[] {
  // 同一角色的外设合并成一个节点，标签用角色名，避免型号太长挤爆卡片
  const roles: HardwareRole[] = [];
  for (const h of ai.hardware) if (!roles.includes(h.role) && h.role !== 'other') roles.push(h.role);
  const hw: Node[] = roles.slice(0, MAX_HW).map((r) => ({ label: HARDWARE_ROLES[r], kind: 'hw' }));
  const aiNodes: Node[] = ai.aiCapabilities.slice(0, MAX_AI).map((a) => ({ label: clip(a.name, 8), kind: 'ai' }));
  // AI 节点穿插在外设之间，避免挤在同一侧
  const out: Node[] = [];
  const step = aiNodes.length ? Math.max(1, Math.floor(hw.length / aiNodes.length)) : 0;
  let ai_i = 0;
  hw.forEach((n, i) => {
    if (ai_i < aiNodes.length && i % step === 0) out.push(aiNodes[ai_i++]);
    out.push(n);
  });
  while (ai_i < aiNodes.length) out.push(aiNodes[ai_i++]);
  return out;
}

function sparkle(x: number, y: number, r: number, color: string): string {
  // logo 右上角的放射状小火花，代表 AI
  const rays = [0, 45, 90, 135, 180, 225, 270, 315]
    .map((deg) => {
      const a = (deg * Math.PI) / 180;
      const r0 = r * 0.35;
      return `M${(x + Math.cos(a) * r0).toFixed(1)} ${(y + Math.sin(a) * r0).toFixed(1)}L${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)}`;
    })
    .join('');
  return `<path d="${rays}" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>`;
}

export function renderCardSvg(id: string, ai: ProjectAi): string {
  const nodes = nodesOf(ai);
  const n = nodes.length;
  const start = -90 + (n ? 180 / n : 0) + hashAngle(id);

  const centerLabel = ai.platform === 'other' ? '主控' : PLATFORMS[ai.platform];
  const cw = textWidth(centerLabel, 18) + 50;
  const ch = 48;

  const lines: string[] = [];
  const pills: string[] = [];

  nodes.forEach((node, i) => {
    const a = ((start + (360 / n) * i) * Math.PI) / 180;
    const pw = textWidth(node.label, 15) + (node.kind === 'ai' ? 44 : 36);
    // 节点中心落在椭圆上，并保证胶囊不出边界
    const x = Math.min(W - 10 - pw / 2, Math.max(10 + pw / 2, CX + Math.cos(a) * RX));
    const y = Math.min(H - 10 - PILL_H / 2, Math.max(10 + PILL_H / 2, CY + Math.sin(a) * RY));

    if (node.kind === 'ai') {
      // AI 连线用曲线，呼应 logo 里弯曲的那条线
      const mx = (CX + x) / 2 - Math.sin(a) * 26;
      const my = (CY + y) / 2 + Math.cos(a) * 26;
      lines.push(`<path d="M${CX} ${CY}Q${mx.toFixed(1)} ${my.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}" fill="none" stroke="${C.teal}" stroke-width="2"/>`);
      pills.push(
        `<g><rect x="${(x - pw / 2).toFixed(1)}" y="${(y - PILL_H / 2).toFixed(1)}" width="${pw.toFixed(1)}" height="${PILL_H}" rx="${PILL_H / 2}" fill="${C.accentSoft}" stroke="${C.accent}" stroke-width="1.5"/>` +
          sparkle(x - pw / 2 + 16, y, 8, C.teal) +
          `<text x="${(x - pw / 2 + 29).toFixed(1)}" y="${(y + 5.5).toFixed(1)}" font-size="15" fill="${C.teal}" font-weight="600">${esc(node.label)}</text></g>`,
      );
    } else {
      lines.push(`<line x1="${CX}" y1="${CY}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${C.teal}" stroke-width="2"/>`);
      pills.push(
        `<g><rect x="${(x - pw / 2).toFixed(1)}" y="${(y - PILL_H / 2).toFixed(1)}" width="${pw.toFixed(1)}" height="${PILL_H}" rx="${PILL_H / 2}" fill="${C.white}" stroke="${C.teal}" stroke-opacity=".25"/>` +
          `<circle cx="${(x - pw / 2 + 14).toFixed(1)}" cy="${y.toFixed(1)}" r="5.5" fill="${C.accent}"/>` +
          `<text x="${(x - pw / 2 + 27).toFixed(1)}" y="${(y + 5.5).toFixed(1)}" font-size="15" fill="${C.teal}">${esc(node.label)}</text></g>`,
      );
    }
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei','Noto Sans SC',sans-serif">
<defs><pattern id="g" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="1" fill="${C.grid}"/></pattern></defs>
<rect width="${W}" height="${H}" fill="${C.bg}"/><rect width="${W}" height="${H}" fill="url(#g)"/>
${lines.join('\n')}
<rect x="${(CX - cw / 2).toFixed(1)}" y="${CY - ch / 2}" width="${cw.toFixed(1)}" height="${ch}" rx="12" fill="${C.teal}"/>
<circle cx="${(CX - cw / 2 + 14).toFixed(1)}" cy="${CY}" r="4" fill="${C.accent}"/>
<text x="${(CX + 8).toFixed(1)}" y="${CY + 6.5}" font-size="18" font-weight="700" fill="${C.white}" text-anchor="middle">${esc(centerLabel)}</text>
${pills.join('\n')}
</svg>`;
}
