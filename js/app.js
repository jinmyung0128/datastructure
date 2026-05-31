const HIERARCHY = [
  { id: "PokemonADT", row: 0, parent: null },
  { id: "Pokemon", row: 1, parent: "PokemonADT" },
  { id: "Pikachu", row: 2, parent: "Pokemon" },
  { id: "Charmander", row: 2, parent: "Pokemon" },
  { id: "Squirtle", row: 2, parent: "Pokemon" },
  { id: "Bulbasaur", row: 2, parent: "Pokemon" },
];

const CARD_THEME = {
  slate: "class-card--adt",
  indigo: "class-card--base",
  yellow: "class-card--elec",
  orange: "class-card--fire",
  blue: "class-card--water",
  green: "class-card--grass",
};

const TYPE_TAG_CLASS = {
  yellow: "type-tag--elec",
  orange: "type-tag--fire",
  blue: "type-tag--water",
  green: "type-tag--grass",
};

let selectedId = null;
let logEntries = [];
let demoRunning = false;

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
    rowEl.className = isInstanceRow ? "diagram-row instances" : "diagram-row";

    rowNodes.forEach((node) => {
      const meta = getMeta(node.id);
      const themeClass = CARD_THEME[meta.color] || "class-card--adt";
      const isSelected = selectedId === node.id;

      const card = document.createElement("button");
      card.type = "button";
      card.dataset.id = node.id;
      card.className = [
        "class-card",
        themeClass,
        isInstanceRow ? "compact" : "normal",
        isSelected ? "is-selected" : "",
      ]
        .filter(Boolean)
        .join(" ");

      card.innerHTML = `
        <span class="badge">${meta.badge}</span>
        <div class="card-title-row">
          <span class="emoji">${meta.emoji || "◆"}</span>
          <h3>${meta.label}</h3>
        </div>
        <p class="desc">${meta.description}</p>
        <span class="hint">클릭 → attack()</span>
      `;

      card.addEventListener("click", () => handleNodeClick(node.id));
      rowEl.appendChild(card);
    });

    container.appendChild(rowEl);

    if (rowIndex < rows.length - 1) {
      const connector = document.createElement("div");
      connector.className = "diagram-connector";
      connector.innerHTML = `
        <div class="diagram-connector-inner">
          <div class="line"></div>
          <span>extends / implements</span>
          <div class="line"></div>
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
  const typeTagClass = TYPE_TAG_CLASS[monster.color] || "type-tag--elec";

  panel.innerHTML = `
    <div class="monster-panel-head">
      <p>야생 몬스터</p>
      <span class="type-tag ${typeTagClass}">${typeInfo.emoji} ${typeInfo.label}</span>
    </div>
    <h4 class="monster-name">${monster.name}</h4>
    <div class="hp-row">
      <span>HP</span>
      <span>${monster.hp} / ${monster.maxHp}</span>
    </div>
    <div class="hp-bar">
      <div class="hp-bar-fill" style="width: ${hpPercent}%"></div>
    </div>
    <p class="monster-note">타입: ${monster.ptype} · Instance 클릭으로 공격</p>
  `;
}

function showAdtPanel() {
  document.getElementById("panel-title").textContent = "PokemonADT (Abstract Data Type)";
  document.getElementById("panel-subtitle").textContent =
    "추상 메서드 정의 — 다형성의 계약(Contract)";

  document.getElementById("intro-result").innerHTML = `
    <p class="result-message">abstract introduce(): void</p>
    <p class="result-message">abstract attack(attackType, damage): Result</p>
  `;

  document.getElementById("attack-result").innerHTML = `
    <div class="result-box result-box--info">
      ADT는 인스턴스화할 수 없습니다. 아래 <strong>Pokemon</strong> 기본 클래스나
      <strong>하위 인스턴스</strong>를 클릭하면 각각 오버라이드된 attack() 결과가 다르게 출력됩니다.
    </div>
  `;

  document.getElementById("method-badge").textContent = "Abstract";
  document.getElementById("method-badge").className = "ssu-badge ssu-badge--abstract";
}

function showInteractionPanel(pokemon, meta, intro, result, config, battleResult = null) {
  document.getElementById("panel-title").textContent = meta.label;
  document.getElementById("panel-subtitle").textContent = `${meta.badge} — 오버라이드된 attack() 호출`;

  document.getElementById("intro-result").innerHTML = `
    <div class="intro-box">
      <span class="mono">introduce()</span>
      <p>${intro}</p>
    </div>
  `;

  const damageClass = result.success
    ? result.critical
      ? "result-box--critical"
      : "result-box--success"
    : "result-box--fail";

  let battleHtml = "";
  if (battleResult) {
    const battleClass = battleResult.defeated
      ? "result-box--defeat"
      : battleResult.battleSuccess
        ? "result-box--success"
        : "result-box--fail";

    battleHtml = `
      <div class="result-box ${battleClass}" style="margin-top:8px">
        <p class="battle-label">몬스터 전투 결과</p>
        <p class="result-message">${battleResult.message}</p>
        ${
          battleResult.defeated
            ? `<p class="result-sub">새 몬스터 ${currentMonster.name} (${getTypeInfo(currentMonster.ptype).label}, HP ${currentMonster.hp}) 등장!</p>${
                battleResult.multiplier !== 1
                  ? `<p class="result-sub">${battleResult.effectivenessLabel} (기본 ${battleResult.baseDamage} → ${battleResult.damageDealt})</p>`
                  : ""
              }`
            : battleResult.battleSuccess && battleResult.damageDealt > 0
              ? `<p class="result-sub">-${battleResult.damageDealt} HP${
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
    <div class="result-box ${damageClass}">
      <div class="result-box-head">
        <span class="mono">attack("${config.attackType}", ${config.damage})</span>
        ${
          result.success
            ? `<span class="result-damage">${result.damage > 0 ? `-${result.damage} HP` : ""}</span>`
            : `<span class="result-miss">MISS</span>`
        }
      </div>
      <p class="result-message">${result.message}</p>
    </div>
    ${battleHtml}
  `;

  document.getElementById("method-badge").textContent = meta.kind === "base" ? "Base Method" : "Overridden";
  document.getElementById("method-badge").className =
    meta.kind === "base" ? "ssu-badge ssu-badge--base" : "ssu-badge ssu-badge--override";
}

function addLog(entry) {
  logEntries.unshift({ ...entry, time: new Date() });
  if (logEntries.length > 12) logEntries.pop();
  renderLog();
}

function renderLog() {
  const logEl = document.getElementById("log-list");
  if (logEntries.length === 0) {
    logEl.innerHTML = `<li class="log-empty">클래스 노드를 클릭하면 polymorphic attack() 결과가 기록됩니다.</li>`;
    return;
  }

  logEl.innerHTML = logEntries
    .map(
      (entry) => `
      <li>
        <div class="log-item-head">
          <span class="title">${entry.title}</span>
          <span class="time">${entry.time.toLocaleTimeString("ko-KR")}</span>
        </div>
        <p class="log-item-body">${entry.message}</p>
      </li>
    `
    )
    .join("");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runDemoAll() {
  if (demoRunning) return;

  const demoBtn = document.getElementById("demo-btn");
  demoRunning = true;
  demoBtn.disabled = true;
  demoBtn.classList.add("is-disabled");
  demoBtn.textContent = "데모 진행 중...";

  const steps = [
    {
      pokemonId: "Bulbasaur",
      monsterType: "grass",
      title: "데모 1 · 같은 타입 공격",
      message:
        "풀 타입 몬스터 등장 → 이상해씨(풀) 공격. 같은 타입이므로 데미지가 들어가지 않습니다.",
    },
    {
      pokemonId: "Charmander",
      monsterType: "grass",
      title: "데모 2 · 추가 피해 (×1.5)",
      message:
        "풀 타입 몬스터 등장 → 파이리(불) 공격. 불은 풀에게 효과가 뛰어나 추가 데미지가 적용됩니다.",
    },
    {
      pokemonId: "Bulbasaur",
      monsterType: "fire",
      title: "데모 3 · 감소 피해 (×0.5)",
      message:
        "불 타입 몬스터 등장 → 이상해씨(풀) 공격. 풀은 불에게 효과가 별로라 데미지가 감소합니다.",
    },
  ];

  logEntries = [];
  renderLog();
  addLog({
    type: "info",
    title: "전체 데모 시작",
    message: "같은 타입 / 추가 피해 / 감소 피해 순서로 시연합니다.",
  });

  await sleep(900);

  for (const step of steps) {
    spawnMonsterWithType(step.monsterType, 80);
    renderMonsterPanel();
    addLog({
      type: "info",
      title: step.title,
      message: step.message,
    });
    await sleep(700);
    handleNodeClick(step.pokemonId);
    await sleep(2800);
  }

  addLog({
    type: "info",
    title: "데모 완료",
    message: "일반 플레이를 위해 새로운 랜덤 몬스터를 소환했습니다.",
  });
  spawnMonster();
  renderMonsterPanel();
  selectedId = null;
  renderDiagram();
  showAdtPanel();

  demoRunning = false;
  demoBtn.disabled = false;
  demoBtn.classList.remove("is-disabled");
  demoBtn.textContent = "전체 데모 실행";
}

function openManualModal() {
  const modal = document.getElementById("manual-modal");
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeManualModal() {
  const modal = document.getElementById("manual-modal");
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
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

  document.getElementById("manual-open-btn").addEventListener("click", openManualModal);
  document.getElementById("manual-close-btn").addEventListener("click", closeManualModal);
  document.getElementById("manual-confirm-btn").addEventListener("click", closeManualModal);
  document.getElementById("manual-modal").addEventListener("click", (e) => {
    if (e.target.id === "manual-modal") closeManualModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeManualModal();
  });
});
