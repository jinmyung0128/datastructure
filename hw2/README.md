# 자료구조 과제 2 — OOP 다형성 인터랙티브 웹앱

과제 1(`hw1/`)의 Pokemon OOP 설계를 기반으로, 상속 구조 시각화 및 `attack()` 다형성 인터랙션을 구현한 웹앱입니다.

## 상속 구조

```
PokemonADT (Abstract)
    ↑ implements
Pokemon (Base Class)
    ↑ extends
├── Pikachu
├── Charmander
├── Squirtle
└── Bulbasaur
```

## 다형성 동작

각 클래스 노드를 클릭하면 `attack()` 메서드가 호출됩니다.

| 클래스 | attack() 특성 |
|--------|---------------|
| **Charmander** | 고정 데미지 (-40 HP) |
| **Pikachu** | 확률적 크리티컬 (50 또는 100 HP) |
| **Squirtle** | 기본 데미지 + 랜덤 추가 데미지 |
| **Bulbasaur** | 풀 타입 고정 데미지 (-35 HP) |
| **Pokemon** | 타입 불일치 시 공격 실패 메시지 |

## 로컬 실행

브라우저에서 `index.html`을 열거나, 간단한 로컬 서버를 사용합니다.

```bash
# Python이 설치되어 있다면
cd hw2
python -m http.server 8080
# http://localhost:8080 접속
```

## GitHub 업로드

```bash
cd hw2
git init
git add .
git commit -m "Add OOP polymorphism interactive web app (HW2)"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/datastructure-hw2.git
git push -u origin main
```

## Vercel 배포

1. [vercel.com](https://vercel.com) 로그인
2. **Add New Project** → GitHub 저장소 Import
3. Root Directory: `hw2` (또는 저장소 루트가 hw2인 경우 그대로)
4. Framework Preset: **Other** (정적 사이트)
5. Deploy 클릭

배포 후 제공되는 URL을 과제 PDF에 제출하세요.

## 기술 스택

- HTML5 + Tailwind CSS (CDN)
- Vanilla JavaScript (ES6 Classes)
- Vercel Static Hosting
