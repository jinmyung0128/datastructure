from pokemon import Pokemon


class Squirtle(Pokemon):
    def __init__(self):
        super().__init__("꼬부기", "water", 20)

    
    def attack(self, attack_type, damage):
        if attack_type != self.ptype:
            print(f"{self.name}의 공격이 실패하였습니다! {self.name}의 타입은 {self.ptype}입니다.")
        else:
            print(f"{self.name}의 물타입 공격! 데미지: {damage}")