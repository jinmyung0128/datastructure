from pokemon import Pokemon


class Pikachu(Pokemon):
    def __init__(self):
        super().__init__("피카츄", "elec", 20)


    def attack(self, attack_type, damage):
        if attack_type != self.ptype:
            print(f"{self.name}의 공격이 실패하였습니다! {self.name}의 타입은 {self.ptype}입니다.")
        else:
            print(f"{self.name}의 전기타입 공격! 데미지: {damage}")