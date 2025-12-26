// 메인 애플리케이션 로직

let currentQuestionIndex = 0;
let arrangedQuestions = [];
let scoring = new MBTIScoring();
let savedAnswers = {}; // 이전 답변 저장

// DOM 요소
const startScreen = document.getElementById('start-screen');
const surveyScreen = document.getElementById('survey-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const totalQuestionsCountSpan = document.getElementById('total-questions-count');
const progressFill = document.getElementById('progress-fill');
const answerInputs = document.querySelectorAll('input[name="answer"]');
const resultType = document.getElementById('result-type');
const resultStrengths = document.getElementById('result-strengths');
const resultDetails = document.getElementById('result-details');
const resultWarnings = document.getElementById('result-warnings');

// 초기화
function init() {
    arrangedQuestions = arrangeQuestions();
    totalQuestionsCountSpan.textContent = arrangedQuestions.length;
    totalQuestionsSpan.textContent = arrangedQuestions.length;
    
    startBtn.addEventListener('click', startSurvey);
    nextBtn.addEventListener('click', nextQuestion);
    prevBtn.addEventListener('click', prevQuestion);
    restartBtn.addEventListener('click', restartSurvey);
    
    // 라디오 버튼 변경 감지
    answerInputs.forEach(input => {
        input.addEventListener('change', () => {
            nextBtn.disabled = false;
            // 답변 저장 (실시간)
            const question = arrangedQuestions[currentQuestionIndex];
            if (question) {
                savedAnswers[question.id] = parseInt(input.value);
            }
        });
    });
}

// 검사 시작
function startSurvey() {
    currentQuestionIndex = 0;
    scoring = new MBTIScoring();
    savedAnswers = {}; // 답변 초기화
    
    startScreen.classList.remove('active');
    surveyScreen.classList.add('active');
    resultScreen.classList.remove('active');
    
    showQuestion();
}

// 문항 표시
function showQuestion() {
    if (currentQuestionIndex >= arrangedQuestions.length) {
        showResult();
        return;
    }

    const question = arrangedQuestions[currentQuestionIndex];
    questionText.textContent = question.text;
    
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    totalQuestionsSpan.textContent = arrangedQuestions.length;
    
    // 진행률 업데이트
    const progress = ((currentQuestionIndex + 1) / arrangedQuestions.length) * 100;
    progressFill.style.width = progress + '%';
    
    // 이전 버튼 표시/숨김
    if (currentQuestionIndex === 0) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-block';
    }
    
    // 저장된 답변 복원
    const savedAnswer = savedAnswers[question.id];
    answerInputs.forEach(input => {
        if (savedAnswer !== undefined && parseInt(input.value) === savedAnswer) {
            input.checked = true;
        } else {
            input.checked = false;
        }
    });
    
    // 답변이 있으면 다음 버튼 활성화
    nextBtn.disabled = savedAnswer === undefined;
}

// 다음 문항
function nextQuestion() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    
    if (!selectedAnswer) {
        alert('답변을 선택해주세요.');
        return;
    }

    const answer = parseInt(selectedAnswer.value);
    const question = arrangedQuestions[currentQuestionIndex];
    
    // 답변 저장
    savedAnswers[question.id] = answer;
    
    // 응답 기록 (잘 모르겠음은 점수 계산에서 제외하거나 중간값 처리)
    if (answer !== 0) {
        // 기존 응답이 있으면 제거 후 새로 추가
        scoring.responses = scoring.responses.filter(r => r.questionId !== question.id);
        scoring.recordResponse(question.id, answer, question);
    }
    
    currentQuestionIndex++;
    showQuestion();
}

// 이전 문항
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        // 현재 답변 저장
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (selectedAnswer) {
            const answer = parseInt(selectedAnswer.value);
            const question = arrangedQuestions[currentQuestionIndex];
            savedAnswers[question.id] = answer;
            
            // 응답 기록 업데이트
            if (answer !== 0) {
                scoring.responses = scoring.responses.filter(r => r.questionId !== question.id);
                scoring.recordResponse(question.id, answer, question);
            }
        }
        
        currentQuestionIndex--;
        showQuestion();
    }
}

// 결과 표시
function showResult() {
    surveyScreen.classList.remove('active');
    resultScreen.classList.add('active');
    
    const result = scoring.calculateResult();
    
    // 타입 표시
    resultType.textContent = result.type;
    
    // 강도 표시
    displayStrengths(result);
    
    // 상세 정보 표시
    displayDetails(result);
    
    // 경고 표시
    displayWarnings(result);
}

// 강도 표시
function displayStrengths(result) {
    const dimensionLabels = {
        EI: { left: 'E (외향)', right: 'I (내향)' },
        SN: { left: 'S (감각)', right: 'N (직관)' },
        TF: { left: 'T (사고)', right: 'F (감정)' },
        JP: { left: 'J (판단)', right: 'P (인식)' }
    };

    let html = '<h3>지표별 강도</h3>';
    
    Object.keys(result.strengths).forEach(dim => {
        const strength = result.strengths[dim];
        const type = result.types[dim];
        const labels = dimensionLabels[dim];
        const percentage = result.percentages[dim];
        
        const leftLabel = dim === 'EI' ? 'E' : dim === 'SN' ? 'S' : dim === 'TF' ? 'T' : 'J';
        const rightLabel = dim === 'EI' ? 'I' : dim === 'SN' ? 'N' : dim === 'TF' ? 'F' : 'P';
        
        const leftPct = percentage[leftLabel];
        const rightPct = percentage[rightLabel];
        
        let strengthText = '';
        if (strength >= 80) {
            strengthText = '매우 뚜렷함';
        } else if (strength >= 60) {
            strengthText = '뚜렷함';
        } else if (strength >= 40) {
            strengthText = '보통';
        } else {
            strengthText = '비교적 중간';
        }
        
        html += `
            <div class="strength-item">
                <div class="strength-label">
                    <span>${labels.left} vs ${labels.right}</span>
                    <span class="strength-value">${strength}% (${strengthText})</span>
                </div>
                <div class="strength-bar-container">
                    <div class="strength-bar" style="width: ${strength}%">${strength}%</div>
                </div>
                <div style="margin-top: 10px; font-size: 0.9em; color: #666;">
                    ${leftLabel}: ${leftPct}% | ${rightLabel}: ${rightPct}%
                </div>
            </div>
        `;
    });
    
    resultStrengths.innerHTML = html;
}

// 상세 정보 표시
function displayDetails(result) {
    let html = '<h3>상세 분석</h3>';
    
    const typeDescriptions = {
        'E': '외향형 - 친구들과 함께 있을 때 힘이 나고, 말하면서 생각을 정리해요.',
        'I': '내향형 - 혼자 있을 때 힘이 나고, 생각한 후에 말해요.',
        'S': '감각형 - 실제로 본 것과 경험한 것을 중요하게 생각해요.',
        'N': '직관형 - 규칙과 가능성을 중요하게 생각해요.',
        'T': '사고형 - 규칙과 논리를 중요하게 생각해요.',
        'F': '감정형 - 친구들과 사이좋게 지내는 것을 중요하게 생각해요.',
        'J': '판단형 - 계획을 세우고 정리하는 것을 좋아해요.',
        'P': '인식형 - 자유롭고 유연한 것을 좋아해요.',
        'X': '중간형 - 양쪽 성향이 비슷해요.'
    };
    
    html += '<p><strong>당신의 성격 유형:</strong></p>';
    
    const dimensions = ['EI', 'SN', 'TF', 'JP'];
    dimensions.forEach(dim => {
        const type = result.types[dim];
        const description = typeDescriptions[type] || '';
        html += `<p>• ${dim}: ${type} - ${description}</p>`;
    });
    
    // 비슷한 축 안내
    const weakDimensions = [];
    Object.keys(result.strengths).forEach(dim => {
        if (result.strengths[dim] < 50) {
            weakDimensions.push(dim);
        }
    });
    
    if (weakDimensions.length > 0) {
        html += '<p style="margin-top: 15px;"><strong>비슷한 성향:</strong></p>';
        weakDimensions.forEach(dim => {
            const type = result.types[dim];
            if (type !== 'X') {
                html += `<p>• ${dim} 지표에서 ${type} 성향이 비교적 중간이에요.</p>`;
            }
        });
    }
    
    resultDetails.innerHTML = html;
}

// 경고 표시
function displayWarnings(result) {
    const warnings = [];
    
    // 주의력 체크 실패
    if (result.attentionFailures > 0) {
        warnings.push(`주의 깊게 읽어야 하는 문항을 잘못 답했어요. 결과가 정확하지 않을 수 있어요.`);
    }
    
    // 일관성 체크는 중복 문제 제거로 인해 비활성화
    
    // X 타입이 있는 경우
    if (result.type.includes('X')) {
        warnings.push(`일부 지표에서 성향이 명확하지 않아요. 이는 양쪽 성향이 비슷하다는 뜻이에요.`);
    }
    
    if (warnings.length > 0) {
        let html = '<h4>주의사항</h4><ul>';
        warnings.forEach(warning => {
            html += `<li>${warning}</li>`;
        });
        html += '</ul>';
        resultWarnings.innerHTML = html;
        resultWarnings.style.display = 'block';
    } else {
        resultWarnings.style.display = 'none';
    }
}

// 검사 다시 시작
function restartSurvey() {
    currentQuestionIndex = 0;
    scoring = new MBTIScoring();
    savedAnswers = {}; // 답변 초기화
    arrangedQuestions = arrangeQuestions();
    
    resultScreen.classList.remove('active');
    startScreen.classList.add('active');
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);

