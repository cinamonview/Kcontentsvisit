# 1단계 데이터 (앱 내장용)

1단계(서버 없이 앱만)에서 앱에 넣어 쓰는 데이터입니다. 테이블과 컬럼은 [PRD ERD](../../docs/PRD.md#part-2-erd)와 같은 모양이라, 2단계에서 그대로 Flyway 시드 SQL로 옮길 수 있습니다.
목록의 근거는 [spot-candidates.md](../../docs/spot-candidates.md)입니다.

| 파일 | ERD 테이블 | 내용 |
|---|---|---|
| `contents.json` | CONTENT | 작품/아티스트 4개 (BTS, 이태원 클라쓰, 케이팝 데몬 헌터스, TWICE) |
| `spots.json` | SPOT | 성지 30곳 |
| `spot_contents.json` | SPOT_CONTENT | 성지와 작품의 연결 31개 (경복궁은 근거가 2개) |
| `content_media.json` | CONTENT_MEDIA | 비어 있음. 공식 채널 링크를 직접 확인하고 넣기 |
| `reviews.json` | REVIEW | 비어 있음 |

앱은 이 파일들을 `api/` 한 곳에서 읽어 PRD의 API 응답 모양(`/api/contents/{id}/spots` 등)으로 합쳐 씁니다. 2단계에서는 그 한 곳만 서버 호출로 바꿉니다.

## ERD에 없는 것

- `spots.coord_verified`: 좌표를 지도에서 확인했는지. **지금은 30곳 모두 `false`**입니다. 좌표는 지오코딩 서비스 없이 적은 대략값이라 수백 m 정도 어긋날 수 있습니다. 네이버·구글 지도에서 확인하면 고치고 `true`로 바꿉니다.
- `spot_contents.source_type`에 `OFFICIAL_TOURISM`(서울시·관광공사)과 `NEWS`(언론 기사)를 추가로 씁니다.

## 아직 비어 있거나 확인이 필요한 것

- `last_verified_at`: 모두 `null`. 현장이나 공식 채널로 확인한 날짜를 넣습니다.
- `opening_hours`, `admission`: 알려진 주의사항만 적었습니다. 나머지는 `null`.
- 주소와 가까운 역: 출처에 있는 것은 그대로 옮겼고, 나머지는 확인 전입니다. 특히 오리올(20번)은 정확한 주소가 없습니다.
- 운영·출입 여부 확인이 필요한 곳: 7 바이닐앤플라스틱, 10 한국가구박물관, 15 일영역, 20 오리올, 22 잠실 올림픽주경기장, 29 용마랜드, 30 고양종합운동장
- 출처 보강: 16 카페 휴가("옛 숙소"), 30 고양종합운동장(단일 출처)
- 28 양재천 벚꽃길이 어느 MV인지('CHEER UP' / 'Like OOH-AHH') 영상으로 확인
- 하이브 사옥 1층 팝업 공간(기간 한정)은 아직 넣지 않았습니다. 공식 공지 링크를 정한 뒤 추가합니다.
