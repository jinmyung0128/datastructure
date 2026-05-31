class PokemonADT {
  get name() {
    throw new Error("Abstract property: name");
  }

  get ptype() {
    throw new Error("Abstract property: ptype");
  }

  get level() {
    throw new Error("Abstract property: level");
  }

  introduce() {
    throw new Error("Abstract method: introduce");
  }

  attack(attackType, damage) {
    throw new Error("Abstract method: attack");
  }

  getMeta() {
    return {
      kind: "adt",
      label: "PokemonADT",
      description: "추상 데이터 타입 (ADT) — name, ptype, level 속성과 introduce(), attack() 메서드를 정의합니다.",
      badge: "Abstract",
      color: "slate",
    };
  }
}

class Pokemon extends PokemonADT {
  constructor(name, ptype, level) {
    super();
    this._name = name;
    this._ptype = ptype;
    this._level = level;
  }

  get name() {
    return this._name;
  }

  get ptype() {
    return this._ptype;
  }

  get level() {
    return this._level;
  }

  introduce() {
    return `이름: ${this.name}, 타입: ${this.ptype}, 레벨: ${this.level}`;
  }

  attack(attackType, damage) {
    if (attackType !== this.ptype) {
      return {
        success: false,
        message: `${this.name}의 공격 실패! 자신의 타입(${this.ptype})과 다른 타입으로는 공격할 수 없습니다.`,
        damage: 0,
      };
    }
    return {
      success: true,
      message: `${this.name} attacks! type: ${attackType}, damage: ${damage}`,
      damage,
    };
  }

  getMeta() {
    return {
      kind: "base",
      label: "Pokemon",
      description: "기본 클래스 — ADT를 구현하며 introduce()와 attack()의 기본 동작을 제공합니다.",
      badge: "Base Class",
      color: "indigo",
    };
  }
}

class Pikachu extends Pokemon {
  constructor() {
    super("피카츄", "elec", 20);
  }

  attack(attackType, damage) {
    if (attackType !== this.ptype) {
      return {
        success: false,
        message: `${this.name}의 공격이 실패하였습니다! ${this.name}의 타입은 ${this.ptype}입니다.`,
        damage: 0,
      };
    }

    const isCritical = Math.random() < 0.4;
    const finalDamage = isCritical ? damage * 2 : damage;

    return {
      success: true,
      message: isCritical
        ? `${this.name}의 전기타입 크리티컬 공격! ⚡ 데미지: ${finalDamage}`
        : `${this.name}의 전기타입 공격! 데미지: ${finalDamage}`,
      damage: finalDamage,
      critical: isCritical,
    };
  }

  getMeta() {
    return {
      kind: "instance",
      label: "Pikachu",
      description: "전기 타입 포켓몬 — attack()을 오버라이드하여 확률적 크리티컬 데미지를 적용합니다.",
      badge: "Instance",
      color: "yellow",
      emoji: "⚡",
    };
  }
}

class Charmander extends Pokemon {
  constructor() {
    super("파이리", "fire", 20);
  }

  attack(attackType, damage) {
    if (attackType !== this.ptype) {
      return {
        success: false,
        message: `${this.name}의 공격이 실패하였습니다! ${this.name}의 타입은 ${this.ptype}입니다.`,
        damage: 0,
      };
    }

    return {
      success: true,
      message: `${this.name}의 불타입 공격! 🔥 고정 데미지: ${damage}`,
      damage,
    };
  }

  getMeta() {
    return {
      kind: "instance",
      label: "Charmander",
      description: "불 타입 포켓몬 — attack()을 오버라이드하여 고정 데미지 불 공격을 수행합니다.",
      badge: "Instance",
      color: "orange",
      emoji: "🔥",
    };
  }
}

class Squirtle extends Pokemon {
  constructor() {
    super("꼬부기", "water", 20);
  }

  attack(attackType, damage) {
    if (attackType !== this.ptype) {
      return {
        success: false,
        message: `${this.name}의 공격이 실패하였습니다! ${this.name}의 타입은 ${this.ptype}입니다.`,
        damage: 0,
      };
    }

    const splashBonus = Math.floor(Math.random() * 6) + 5;
    const finalDamage = damage + splashBonus;

    return {
      success: true,
      message: `${this.name}의 물타입 공격! 💧 데미지: ${finalDamage} (기본 ${damage} + 추가 ${splashBonus})`,
      damage: finalDamage,
    };
  }

  getMeta() {
    return {
      kind: "instance",
      label: "Squirtle",
      description: "물 타입 포켓몬 — attack()을 오버라이드하여 추가 스플래시 데미지를 적용합니다.",
      badge: "Instance",
      color: "blue",
      emoji: "💧",
    };
  }
}

class Bulbasaur extends Pokemon {
  constructor() {
    super("이상해씨", "grass", 20);
  }

  attack(attackType, damage) {
    if (attackType !== this.ptype) {
      return {
        success: false,
        message: `${this.name}의 공격이 실패하였습니다! ${this.name}의 타입은 ${this.ptype}입니다.`,
        damage: 0,
      };
    }

    return {
      success: true,
      message: `${this.name}의 풀타입 공격! 🌿 데미지: ${damage}`,
      damage,
    };
  }

  getMeta() {
    return {
      kind: "instance",
      label: "Bulbasaur",
      description: "풀 타입 포켓몬 — attack()을 오버라이드하여 풀 타입 공격 메시지를 출력합니다.",
      badge: "Instance",
      color: "green",
      emoji: "🌿",
    };
  }
}

const POKEMON_REGISTRY = {
  PokemonADT: { Class: PokemonADT, instance: null },
  Pokemon: {
    Class: Pokemon,
    instance: new Pokemon("포켓몬", "normal", 1),
  },
  Pikachu: { Class: Pikachu, instance: new Pikachu() },
  Charmander: { Class: Charmander, instance: new Charmander() },
  Squirtle: { Class: Squirtle, instance: new Squirtle() },
  Bulbasaur: { Class: Bulbasaur, instance: new Bulbasaur() },
};

const ATTACK_CONFIG = {
  Pikachu: { attackType: "elec", damage: 50 },
  Charmander: { attackType: "fire", damage: 40 },
  Squirtle: { attackType: "water", damage: 45 },
  Bulbasaur: { attackType: "grass", damage: 35 },
  Pokemon: { attackType: "normal", damage: 30 },
};
