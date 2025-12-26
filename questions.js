// MBTI 문항 데이터
// 각 지표당 15문항 (정방향/역방향 반반)
// 구조: { id, text, dimension, direction, isAnchor, checkType }

const questions = [
    // EI (에너지 방향) - 15문항
    // 정방향 (E) - 8문항
    { id: 1, text: "친구들과 놀고 나면 기분이 좋아진다", dimension: 'EI', direction: 'E', isAnchor: true, checkType: null },
    { id: 2, text: "말하면서 생각을 정리하는 편이다", dimension: 'EI', direction: 'E', isAnchor: false, checkType: null },
    { id: 3, text: "갑자기 친구에게 전화해서 놀자고 한다", dimension: 'EI', direction: 'E', isAnchor: false, checkType: null },
    { id: 4, text: "여러 친구들과 함께 있을 때 편하다", dimension: 'EI', direction: 'E', isAnchor: true, checkType: null },
    { id: 5, text: "처음 보는 친구를 만나는 게 즐겁다", dimension: 'EI', direction: 'E', isAnchor: false, checkType: null },
    { id: 6, text: "모둠 활동에서 적극적으로 참여한다", dimension: 'EI', direction: 'E', isAnchor: false, checkType: null },
    { id: 7, text: "밖에서 놀 때 힘이 난다", dimension: 'EI', direction: 'E', isAnchor: false, checkType: null },
    { id: 8, text: "바로바로 결정을 내린다", dimension: 'EI', direction: 'E', isAnchor: false, checkType: null },
    
    // 역방향 (I) - 7문항
    { id: 9, text: "혼자만의 시간이 필요하다", dimension: 'EI', direction: 'I', isAnchor: true, checkType: null },
    { id: 10, text: "말하기 전에 먼저 생각해본다", dimension: 'EI', direction: 'I', isAnchor: false, checkType: null },
    { id: 11, text: "친구 한 명과 둘이서 노는 게 좋다", dimension: 'EI', direction: 'I', isAnchor: false, checkType: null },
    { id: 12, text: "혼자 있을 때 힘이 난다", dimension: 'EI', direction: 'I', isAnchor: true, checkType: null },
    { id: 13, text: "조용한 곳에서 공부가 잘 된다", dimension: 'EI', direction: 'I', isAnchor: false, checkType: null },
    { id: 14, text: "가까운 친구 몇 명과 깊이 이야기하는 게 좋다", dimension: 'EI', direction: 'I', isAnchor: false, checkType: null },
    { id: 15, text: "친구들과 오래 있으면 피곤하고 혼자 쉬고 싶다", dimension: 'EI', direction: 'I', isAnchor: false, checkType: null },

    // SN (정보 선호) - 15문항
    // 정방향 (S) - 8문항
    { id: 16, text: "실제로 본 것과 경험한 것을 중요하게 생각한다", dimension: 'SN', direction: 'S', isAnchor: true, checkType: null },
    { id: 17, text: "설명할 때 구체적인 예를 들어 설명한다", dimension: 'SN', direction: 'S', isAnchor: false, checkType: null },
    { id: 18, text: "지금 상황을 잘 파악하고 현실적으로 생각한다", dimension: 'SN', direction: 'S', isAnchor: false, checkType: null },
    { id: 19, text: "한 번 해본 방법을 다시 사용하는 게 좋다", dimension: 'SN', direction: 'S', isAnchor: true, checkType: null },
    { id: 20, text: "차근차근 순서대로 하는 게 좋다", dimension: 'SN', direction: 'S', isAnchor: false, checkType: null },
    { id: 21, text: "전에 해봤던 경험을 바탕으로 판단한다", dimension: 'SN', direction: 'S', isAnchor: false, checkType: null },
    { id: 22, text: "실제로 쓸 수 있는 정보에 관심이 많다", dimension: 'SN', direction: 'S', isAnchor: false, checkType: null },
    { id: 23, text: "눈에 보이는 것과 직접 해본 것을 믿는다", dimension: 'SN', direction: 'S', isAnchor: false, checkType: null },
    
    // 역방향 (N) - 7문항
    { id: 24, text: "규칙과 가능성을 중요하게 생각한다", dimension: 'SN', direction: 'N', isAnchor: true, checkType: null },
    { id: 25, text: "설명할 때 전체적인 큰 그림을 먼저 보여준다", dimension: 'SN', direction: 'N', isAnchor: false, checkType: null },
    { id: 26, text: "앞으로 일어날 일과 새로운 아이디어에 관심이 많다", dimension: 'SN', direction: 'N', isAnchor: false, checkType: null },
    { id: 27, text: "새로운 방법을 시도해보는 게 좋다", dimension: 'SN', direction: 'N', isAnchor: true, checkType: null },
    { id: 28, text: "의미와 서로 연결되는 점을 찾는 게 재미있다", dimension: 'SN', direction: 'N', isAnchor: false, checkType: null },
    { id: 29, text: "상상하고 비유하는 것을 좋아한다", dimension: 'SN', direction: 'N', isAnchor: false, checkType: null },
    { id: 30, text: "이론과 추상적인 생각에 관심이 많다", dimension: 'SN', direction: 'N', isAnchor: false, checkType: null },

    // TF (판단 기준) - 15문항
    // 정방향 (T) - 8문항
    { id: 31, text: "규칙과 논리를 중요하게 생각한다", dimension: 'TF', direction: 'T', isAnchor: true, checkType: null },
    { id: 32, text: "조언을 줄 때 바로바로 명확하게 말한다", dimension: 'TF', direction: 'T', isAnchor: false, checkType: null },
    { id: 33, text: "싸움이 났을 때 사실에 집중한다", dimension: 'TF', direction: 'T', isAnchor: false, checkType: null },
    { id: 34, text: "같은 기준을 일관되게 적용하는 게 좋다", dimension: 'TF', direction: 'T', isAnchor: true, checkType: null },
    { id: 35, text: "감정보다 이치에 맞는지 먼저 생각한다", dimension: 'TF', direction: 'T', isAnchor: false, checkType: null },
    { id: 36, text: "공평함을 중요하게 생각한다", dimension: 'TF', direction: 'T', isAnchor: false, checkType: null },
    { id: 37, text: "결정할 때 이유를 찾아본다", dimension: 'TF', direction: 'T', isAnchor: false, checkType: null },
    { id: 38, text: "화가 나도 이성적으로 판단하려고 한다", dimension: 'TF', direction: 'T', isAnchor: false, checkType: null },
    
    // 역방향 (F) - 7문항
    { id: 39, text: "친구들과 사이좋게 지내는 게 중요하다", dimension: 'TF', direction: 'F', isAnchor: true, checkType: null },
    { id: 40, text: "조언을 줄 때 상대방 기분을 생각한다", dimension: 'TF', direction: 'F', isAnchor: false, checkType: null },
    { id: 41, text: "싸움이 났을 때 상대방이 상처받지 않도록 한다", dimension: 'TF', direction: 'F', isAnchor: false, checkType: null },
    { id: 42, text: "각 사람의 마음과 감정을 존중한다", dimension: 'TF', direction: 'F', isAnchor: true, checkType: null },
    { id: 43, text: "이해하고 배려하는 게 우선이다", dimension: 'TF', direction: 'F', isAnchor: false, checkType: null },
    { id: 44, text: "친구들의 기분을 잘 알아차린다", dimension: 'TF', direction: 'F', isAnchor: false, checkType: null },
    { id: 45, text: "결정할 때 사람들의 기분을 생각한다", dimension: 'TF', direction: 'F', isAnchor: false, checkType: null },

    // JP (생활 양식) - 15문항
    // 정방향 (J) - 8문항
    { id: 46, text: "제출 기한과 계획을 지키는 게 좋다", dimension: 'JP', direction: 'J', isAnchor: true, checkType: null },
    { id: 47, text: "정리정돈이 되어 있으면 마음이 편하다", dimension: 'JP', direction: 'J', isAnchor: false, checkType: null },
    { id: 48, text: "여행 갈 때 계획표를 만든다", dimension: 'JP', direction: 'J', isAnchor: false, checkType: null },
    { id: 49, text: "빨리빨리 결정하는 게 좋다", dimension: 'JP', direction: 'J', isAnchor: true, checkType: null },
    { id: 50, text: "할 일 목록을 만들고 체크하는 게 좋다", dimension: 'JP', direction: 'J', isAnchor: false, checkType: null },
    { id: 51, text: "계획대로 하는 게 좋다", dimension: 'JP', direction: 'J', isAnchor: false, checkType: null },
    { id: 52, text: "미리미리 준비하는 편이다", dimension: 'JP', direction: 'J', isAnchor: false, checkType: null },
    { id: 53, text: "일의 시작과 끝을 뚜렷하게 구분한다", dimension: 'JP', direction: 'J', isAnchor: false, checkType: null },
    
    // 역방향 (P) - 7문항
    { id: 54, text: "여유롭고 자유로운 일정이 좋다", dimension: 'JP', direction: 'P', isAnchor: true, checkType: null },
    { id: 55, text: "자유롭게 선택할 수 있을 때 편하다", dimension: 'JP', direction: 'P', isAnchor: false, checkType: null },
    { id: 56, text: "여행 갈 때 갑자기 계획을 바꾸는 게 좋다", dimension: 'JP', direction: 'P', isAnchor: false, checkType: null },
    { id: 57, text: "여러 가지 선택지를 열어두는 게 좋다", dimension: 'JP', direction: 'P', isAnchor: true, checkType: null },
    { id: 58, text: "상황에 맞게 바꿔가는 게 좋다", dimension: 'JP', direction: 'P', isAnchor: false, checkType: null },
    { id: 59, text: "마감일이 다가와야 집중이 잘 된다", dimension: 'JP', direction: 'P', isAnchor: false, checkType: null },
    { id: 60, text: "새로운 정보가 들어오면 계획을 바꾸는 게 좋다", dimension: 'JP', direction: 'P', isAnchor: false, checkType: null },

    // 보정 문항들
    // 주의력 체크 문항 (2개)
    { id: 61, text: "이 문항은 '보통'을 선택해 주세요", dimension: 'CHECK', direction: null, isAnchor: false, checkType: 'attention', expectedAnswer: 3 },
    { id: 62, text: "이 문항은 '그렇다'를 선택해 주세요", dimension: 'CHECK', direction: null, isAnchor: false, checkType: 'attention', expectedAnswer: 4 },
];

// 문항 셔플 함수 (랜덤 순서로 섞기)
function shuffleQuestions(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// 문항 배치 전략: 보정 문항을 적절한 위치에 배치
function arrangeQuestions() {
    const mainQuestions = questions.filter(q => q.checkType === null);
    const attentionChecks = questions.filter(q => q.checkType === 'attention');
    
    // 메인 문항을 섞기
    const shuffledMain = shuffleQuestions(mainQuestions);
    
    // 주의력 체크 문항을 중간과 끝 부분에 배치
    const arranged = [...shuffledMain];
    const midPoint = Math.floor(arranged.length / 2);
    arranged.splice(midPoint, 0, attentionChecks[0]);
    arranged.splice(arranged.length - 5, 0, attentionChecks[1]);
    
    return arranged;
}

