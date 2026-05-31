from pokemon_ADT import PokemonADT


class Pokemon(PokemonADT):
    def __init__(self, name, ptype, level):
        self.__name = name
        self.__ptype = ptype
        self._level = level

    @property
    def name(self):
        return self.__name

    @property
    def ptype(self):
        return self.__ptype

    @property
    def level(self):
        return self._level

    def introduce(self):
        print(f"이름: {self.name}, 타입: {self.ptype}, 레벨: {self.level}")

    def attack(self, attack_type, damage):
        if attack_type != self.ptype:
            print(f"{self.name}의 공격 실패! 자신의 타입({self.ptype})과 다른 타입으로는 공격할 수 없습니다.")
        else:
            print(f"{self.name} attacks! type: {attack_type}, damage: {damage}")