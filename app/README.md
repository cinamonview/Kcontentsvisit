# K-Spot Trail 앱 (1단계)

Expo SDK 57 + TypeScript + Expo Router. 서버 없이 `../data/phase1`의 JSON을 읽어서 동작합니다.

## 실행

```bash
cd app
npm install
npx expo start
```

폰에 **Expo Go** 앱을 설치하고, 터미널에 나온 QR 코드를 찍으면 바로 열립니다. 폰과 컴퓨터가 같은 와이파이에 있어야 합니다.

확인용 명령:

```bash
npm run typecheck   # 타입 검사
npm run lint        # 린트
```

## 화면

| 화면 | 파일 | PRD 기능 |
|---|---|---|
| 탐색 탭 | `src/app/(tabs)/index.tsx` | F-01 작품/아티스트 목록, 종류 필터, 검색 |
| 지도 탭 | `src/app/(tabs)/map.tsx` | F-04 마커, 작품 필터 (웹에서는 목록으로 대체) |
| 내 여정 탭 | `src/app/(tabs)/trail.tsx` | F-06 방문 진행률, F-07 저장한 곳 |
| 작품 상세 | `src/app/content/[id].tsx` | F-02 성지 목록 |
| 성지 상세 | `src/app/spot/[id].tsx` | F-03 관련 장면·출처, F-05 구글/네이버 지도 열기, F-10 매너, F-15·F-16 교통·안전, F-19 공식 영상 링크 |

모든 화면 아래에 "비공식 팬 가이드" 문구가 나옵니다 (PRD 8번).

## 구조

```
src/
  app/          화면 (파일 하나 = 화면 하나, Expo Router)
  api/          데이터를 읽는 유일한 곳. 2단계에서 여기만 서버 호출로 바꿈
  store/        저장·방문 기록 (AsyncStorage, 기기에만 저장)
  i18n/         화면 문구 (en.json, ko.json). 기기 언어가 한국어면 한국어
  components/   공용 UI
  lib/links.ts  외부 지도 앱, 공식 링크 열기
```

## Flutter와 비교하면

| Flutter | 여기 |
|---|---|
| Widget | 컴포넌트 (함수 하나가 화면 조각 하나) |
| `Navigator` / go_router | Expo Router: `src/app` 폴더 구조가 곧 라우트 |
| `FutureBuilder` | `useApi` 훅 (`src/hooks/use-api.ts`) |
| `Provider` / `InheritedWidget` | React Context (`src/store/trail.tsx`) |
| `ListView.builder` | `FlatList` |
| `pubspec.yaml` + `flutter pub add` | `package.json` + `npx expo install` |

## 알아둘 것

- 패키지는 `npm install`이 아니라 `npx expo install <패키지>`로 추가합니다. SDK 57에 맞는 버전을 골라 줍니다.
- 지도 핀 위치는 아직 대략값입니다 (`coord_verified: false`). 상세 화면에 경고가 같이 나옵니다.
- Android 정식 빌드에서 구글 지도를 쓰려면 Google Maps API 키가 필요합니다. Expo Go에서는 키 없이 됩니다.
