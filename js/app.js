const HIERARCHY = [
  { id: "PokemonADT", row: 0, parent: null },
  { id: "Pokemon", row: 1, parent: "PokemonADT" },
  { id: "Pikachu", row: 2, parent: "Pokemon" },
  { id: "Charmander", row: 2, parent: "Pokemon" },
  { id: "Squirtle", row: 2, parent: "Pokemon" },
  { id: "Bulbasaur", row: 2, parent: "Pokemon" },
];

const COLOR_MAP = {
  slate: {
    ring: "ring-slate-400",
    bg: "bg-slate-100",
    border: "border-slate-300",
    text: "text-slate-800",
    badge: "bg-slate-200 text-slate-700",
    glow: "shadow-slate-300/50",
  },
  indigo: {
    ring: "ring-indigo-400",
    bg: "bg-indigo-50",
    border: "border-indigo-300",
    text: "text-indigo-900",
    badge: "bg-indigo-200 text-indigo-800",
    glow: "shadow-indigo-300/50",
  },
  yellow: {
    ring: "ring-yellow-400",
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    text: "text-yellow-900",
    badge: "bg-yellow-200 text-yellow-800",
    glow: "shadow-yellow-300/50",
  },
  orange: {
    ring: "ring-orange-400",
    bg: "bg-orange-50",
    border: "border-orange-300",
    text: "text-orange-900",
    badge: "bg-orange-200 text-orange-800",
    glow: "shadow-orange-300/50",
  },
  blue: {
    ring: "ring-blue-400",
    bg: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-900",
    badge: "bg-blue-200 text-blue-800",
    glow: "shadow-blue-300/50",
  },
  green: {
    ring: "ring-green-400",
    bg: "bg-green-50",
    border: "border-green-300",
    text: "text-green-900",
    badge: "bg-green-200 text-green-800",
    glow: "shadow-green-300/50",
  },
};

let selectedId = null;
let logEntries = [];

const TYPE_COLOR_CLASS = {
  yellow: "border-yellow-300 bg-yellow-50 text-yellow-900",
  orange: "border-orange-300 bg-orange-50 text-orange-900",
  blue: "border-blue-300 bg-blue-50 text-blue-900",
  green: "border-green-300 bg-green-50 text-green-900",
};

function getEntry(id) {
  return POKEMON_REGISTRY[id];
}

function getMeta(id) {
  const entry = getEntry(id);
  if (!entry.instance) {
    return new entry.Class().getMeta();
  }
  return entry.instance.getMeta();
}

function renderDiagram() {
  const container = document.getElementById("diagram");
  container.innerHTML = "";

  const rows = [[], [], []];
  HIERARCHY.forEach((node) => rows[node.row].push(node));

  rows.forEach((rowNodes, rowIndex) => {
    const rowEl = document.createElement("div");
    const isInstanceRow = rowIndex === 2;
    rowEl.className = isInstanceRow
      ? "grid w-full grid-cols-4 gap-2"
      : "flex justify-center gap-3";

    rowNodes.forEach((node) => {
      const meta = getMeta(node.id);
      const colors = COLOR_MAP[meta.color];
      const isSelected = selectedId === node.id;

      const card = document.createElement("button");
      card.type = "button";
      card.dataset.id = node.id;
      card.className = [
        "group relative rounded-xl border-2 text-left transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-4",
        isInstanceRow ? "min-w-0 p-2.5" : "w-44 p-3",
        colors.bg,
        colors.border,
        colors.text,
        colors.glow,
        isSelected ? `ring-4 ${colors.ring} scale-[1.02] shadow-xl` : "shadow-md",
      ].join(" ");

      card.innerHTML = `
        <span class="inline-block rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${colors.badge}">
          ${meta.badge}
        </span>
        <div class="mt-1 flex items-center gap-1.5">
          <span class="text-lg leading-none">${meta.emoji || "◆"}</span>
          <h3 class="truncate text-sm font-bold leading-tight">${meta.label}</h3>
        </div>
        <p class="mt-1 text-[10px] leading-snug opacity-80 line-clamp-2">${meta.description}</p>
        <span class="mt-1.5 block text-[10px] font-medium text-indigo-600 group-hover:underline">
          클릭 → attack()
        </span>
      `;

      card.addEventListener("click", () => handleNodeClick(node.id));
      rowEl.appendChild(card);
    });

    container.appendChild(rowEl);

    if (rowIndex < rows.length - 1) {
      const connector = document.createElement("div");
      connector.className = "flex justify-center py-0.5";
      connector.innerHTML = `
        <div class="flex flex-col items-center text-slate-400">
          <div class="h-3 w-px bg-slate-300"></div>
          <span class="text-[10px]">extends / implements</span>
          <div class="h-3 w-px bg-slate-300"></div>
        </div>
      `;
      container.appendChild(connector);
    }
  });
}

function handleNodeClick(id) {
  selectedId = id;
  renderDiagram();

  const entry = getEntry(id);
  const meta = getMeta(id);

  if (id === "PokemonADT") {
    showAdtPanel();
    addLog({
      type: "info",
      title: `${meta.label} 선택`,
      message:
        "추상 클래스입니다. 직접 인스턴스화할 수 없으며, attack()과 introduce()는 하위 클래스에서 구현됩니다.",
    });
    return;
  }

  const pokemon = entry.instance;
  const intro = pokemon.introduce();
  const config = ATTACK_CONFIG[id] || { attackType: pokemon.ptype, damage: 30 };
  const result = pokemon.attack(config.attackType, config.damage);

  let battleResult = null;
  if (meta.kind === "instance") {
    battleResult = resolveBattle(config.attackType, result);
    renderMonsterPanel();
  }

  showInteractionPanel(pokemon, meta, intro, result, config, battleResult);
  addLog({
    type: battleResult
      ? battleResult.defeated
        ? "defeat"
        : battleResult.battleSuccess
          ? "attack"
          : "fail"
      : result.success
        ? "attack"
        : "fail",
    title: `${meta.label}.attack("${config.attackType}", ${config.damage})`,
    message: battleResult ? battleResult.message : result.message,
    damage: battleResult ? battleResult.damageDealt : result.damage,
    critical: result.critical,
  });
}

function renderMonsterPanel() {
  const panel = document.getElementById("monster-panel");
  if (!currentMonster) {
    spawnMonster();
  }

  const monster = currentMonster;
  const typeInfo = getTypeInfo(monster.ptype);
  const hpPercent = Math.round((monster.hp / monster.maxHp) * 100);
  const colorClass = TYPE_COLOR_CLASS[monster.color] || TYPE_COLOR_CLASS.yellow;

  panel.innerHTML = `
    <div class="flex items-center justify-between gap-2">
      <p class="text-[10px] font-semibold uppercase tracking-wide text-slate-500">야생 몬스터</p>
      <span class="rounded-full px-2 py-0.5 text-[10px] font-semibold ${colorClass} border">
        ${typeInfo.emoji} ${typeInfo.label}
      </span>
    </div>
    <h4 class="mt-1 text-sm font-bold text-slate-800">${monster.name}</h4>
    <div class="mt-2">
      <div class="mb-1 flex justify-between text-[10px] text-slate-600">
        <span>HP</span>
        <span>${monster.hp} / ${monster.maxHp}</span>
      </div>
      <div class="h-2.5 overflow-hidden rounded-full bg-slate-200">
        <div
          class="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-400 transition-all duration-300"
          style="width: ${hpPercent}%"
        ></div>
      </div>
    </div>
    <p class="mt-2 text-[10px] text-slate-500">타입: ${monster.ptype} · Instance 클릭으로 공격</p>
  `;
}

function showAdtPanel() {
  document.getElementById("panel-title").textContent = "PokemonADT (Abstract Data Type)";
  document.getElementById("panel-subtitle").textContent =
    "추상 메서드 정의 — 다형성의 계약(Contract)";

  document.getElementById("intro-result").innerHTML = `
    <p class="text-sm text-slate-600">abstract introduce(): void</p>
    <p class="text-sm text-slate-600">abstract attack(attackType, damage): Result</p>
  `;

  document.getElementById("attack-result").innerHTML = `
    <div class="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
      ADT는 인스턴스화할 수 없습니다. 아래 <strong>Pokemon</strong> 기본 클래스나
      <strong>하위 인스턴스</strong>를 클릭하면 각각 오버라이드된 attack() 결과가 다르게 출력됩니다.
    </div>
  `;

  document.getElementById("method-badge").textContent = "Abstract";
  document.getElementById("method-badge").className =
    "rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700";
}

function showInteractionPanel(pokemon, meta, intro, result, config, battleResult = null) {
  document.getElementById("panel-title").textContent = meta.label;
  document.getElementById("panel-subtitle").textContent = `${meta.badge} — 오버라이드된 attack() 호출`;

  document.getElementById("intro-result").innerHTML = `
    <div class="rounded-xl bg-white/70 p-3 text-sm shadow-inner">
      <span class="font-mono text-xs text-indigo-500">introduce()</span>
      <p class="mt-1 font-medium">${intro}</p>
    </div>
  `;

  const damageClass = result.success
    ? result.critical
      ? "border-yellow-300 bg-yellow-50 text-yellow-900"
      : "border-emerald-300 bg-emerald-50 text-emerald-900"
    : "border-red-300 bg-red-50 text-red-900";

  let battleHtml = "";
  if (battleResult) {
    const battleClass = battleResult.defeated
      ? "border-violet-400 bg-violet-50 text-violet-900"
      : battleResult.battleSuccess
        ? "border-emerald-400 bg-emerald-50 text-emerald-900"
        : "border-red-400 bg-red-50 text-red-900";

    battleHtml = `
      <div class="mt-2 rounded-xl border-2 p-3 ${battleClass}">
        <p class="text-[10px] font-semibold uppercase tracking-wide opacity-70">몬스터 전투 결과</p>
        <p class="mt-1 text-sm font-bold">${battleResult.message}</p>
        ${
          battleResult.defeated
            ? `<p class="mt-1 text-xs">새 몬스터 ${currentMonster.name} (${getTypeInfo(currentMonster.ptype).label}, HP ${currentMonster.hp}) 등장!</p>${
                battleResult.multiplier !== 1
                  ? `<p class="mt-1 text-xs">${battleResult.effectivenessLabel} (기본 ${battleResult.baseDamage} → ${battleResult.damageDealt})</p>`
                  : ""
              }`
            : battleResult.battleSuccess && battleResult.damageDealt > 0
              ? `<p class="mt-1 text-xs font-mono">-${battleResult.damageDealt} HP${
                  battleResult.multiplier !== 1
                    ? ` (기본 ${battleResult.baseDamage} × ${battleResult.multiplier})`
                    : ""
                }</p>`
              : ""
        }
      </div>
    `;
  }

  document.getElementById("attack-result").innerHTML = `
    <div class="rounded-xl border-2 p-4 ${damageClass}">
      <div class="flex items-center justify-between gap-2">
        <span class="font-mono text-xs opacity-70">attack("${config.attackType}", ${config.damage})</span>
        ${
          result.success
            ? `<span class="text-2xl font-black">${result.damage > 0 ? `-${result.damage} HP` : ""}</span>`
            : `<span class="text-sm font-semibold">MISS</span>`
        }
      </div>
      <p class="mt-2 text-sm font-medium">${result.message}</p>
    </div>
    ${battleHtml}
  `;

  document.getElementById("method-badge").textContent = meta.kind === "base" ? "Base Method" : "Overridden";
  document.getElementById("method-badge").className =
    meta.kind === "base"
      ? "rounded-full bg-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-800"
      : "rounded-full bg-fuchsia-200 px-3 py-1 text-xs font-semibold text-fuchsia-800";
}

function addLog(entry) {
  logEntries.unshift({ ...entry, time: new Date() });
  if (logEntries.length > 8) logEntries.pop();
  renderLog();
}

function renderLog() {
  const logEl = document.getElementById("log-list");
  if (logEntries.length === 0) {
    logEl.innerHTML = `<li class="text-sm text-slate-500">클래스 노드를 클릭하면 polymorphic attack() 결과가 기록됩니다.</li>`;
    return;
  }

  logEl.innerHTML = logEntries
    .map(
      (entry) => `
      <li class="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-semibold text-indigo-600">${entry.title}</span>
          <span class="text-[10px] text-slate-400">${entry.time.toLocaleTimeString("ko-KR")}</span>
        </div>
        <p class="mt-1 text-sm text-slate-700">${entry.message}</p>
      </li>
    `
    )
    .join("");
}

function runDemoAll() {
  ["Pikachu", "Charmander", "Squirtle", "Bulbasaur"].forEach((id, index) => {
    setTimeout(() => handleNodeClick(id), index * 400);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  spawnMonster();
  renderMonsterPanel();
  renderDiagram();
  showAdtPanel();
  document.getElementById("demo-btn").addEventListener("click", runDemoAll);
  document.getElementById("clear-btn").addEventListener("click", () => {
    logEntries = [];
    renderLog();
  });
});
