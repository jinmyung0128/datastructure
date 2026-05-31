const MONSTER_TYPES = [
  { id: "elec", label: "전기", emoji: "⚡", color: "yellow" },
  { id: "fire", label: "불", emoji: "🔥", color: "orange" },
  { id: "water", label: "물", emoji: "💧", color: "blue" },
  { id: "grass", label: "풀", emoji: "🌿", color: "green" },
];

let monsterCounter = 0;
let currentMonster = null;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getTypeInfo(typeId) {
  return MONSTER_TYPES.find((t) => t.id === typeId) || MONSTER_TYPES[0];
}

function spawnMonster() {
  monsterCounter += 1;
  const type = MONSTER_TYPES[randomInt(0, MONSTER_TYPES.length - 1)];
  const maxHp = randomInt(50, 100);

  currentMonster = {
    id: monsterCounter,
    name: `야생 몬스터 #${monsterCounter}`,
    ptype: type.id,
    typeLabel: type.label,
    emoji: type.emoji,
    color: type.color,
    maxHp,
    hp: maxHp,
  };

  return currentMonster;
}

function resolveBattle(attackType, attackResult) {
  if (!currentMonster) {
    spawnMonster();
  }

  const monster = currentMonster;
  const typeInfo = getTypeInfo(monster.ptype);

  if (attackType === monster.ptype) {
    return {
      battleSuccess: false,
      defeated: false,
      message: `공격 실패! 몬스터도 ${typeInfo.label} 타입(${monster.ptype})이라 같은 타입 공격은 통하지 않습니다.`,
      damageDealt: 0,
      monster,
    };
  }

  if (!attackResult.success || attackResult.damage <= 0) {
    return {
      battleSuccess: false,
      defeated: false,
      message: attackResult.message,
      damageDealt: 0,
      monster,
    };
  }

  monster.hp = Math.max(0, monster.hp - attackResult.damage);

  if (monster.hp <= 0) {
    const defeatedMonster = { ...monster };
    spawnMonster();
    return {
      battleSuccess: true,
      defeated: true,
      message: "몬스터를 처치 했습니다!",
      damageDealt: attackResult.damage,
      defeatedMonster,
      monster: currentMonster,
    };
  }

  return {
    battleSuccess: true,
    defeated: false,
    message: `${monster.name}에게 ${attackResult.damage} 데미지! (남은 HP: ${monster.hp}/${monster.maxHp})`,
    damageDealt: attackResult.damage,
    monster,
  };
}
