from abc import ABC, abstractmethod


class PokemonADT(ABC):

    @property
    @abstractmethod
    def name(self):
        pass

    @property
    @abstractmethod
    def ptype(self):
        pass

    @property
    @abstractmethod
    def level(self):
        pass

    @abstractmethod
    def introduce(self):
        pass

    @abstractmethod
    def attack(self, attack_type, damage):
        pass
