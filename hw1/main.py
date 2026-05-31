from pikachu import Pikachu
from charmander import Charmander
from squirtle import Squirtle
from bulbasaur import Bulbasaur


if __name__ == "__main__":

    pokemons = [
        Pikachu(),
        Charmander(),
        Squirtle(),
        Bulbasaur()
    ]

    print("--- 포켓몬 소개 ---")
    for p in pokemons:
        p.introduce()

    print("\n--- 공격 성공 예시 ---")
    correct_types = ["elec", "fire", "water", "grass"]
    damages = [50, 40, 45, 35]

    for i in range(len(pokemons)):
        pokemons[i].attack(correct_types[i], damages[i])

    print("\n--- 공격 실패 예시 ---")
    wrong_types = ["fire", "water", "grass", "elec"]

    for i in range(len(pokemons)):
        pokemons[i].attack(wrong_types[i], damages[i])


