// MBTI 채점 알고리즘

class MBTIScoring {
    constructor() {
        this.responses = [];
        this.attentionCheckFailures = 0;
        this.consistencyScores = {};
    }

    // 응답 기록
    recordResponse(questionId, answer, question) {
        this.responses.push({
            questionId,
            answer,
            question,
            timestamp: Date.now()
        });
    }

    // 점수 변환 (역방향 문항 처리)
    convertScore(answer, direction, dimension) {
        // 주의력 체크나 일관성 체크 문항은 점수 변환하지 않음
        if (dimension === 'CHECK') {
            return null;
        }

        // "잘 모르겠음"은 중간값(3)으로 처리
        if (answer === 0) {
            answer = 3;
        }

        // 정방향: E, S, T, J에 점수 쌓기
        const forwardDirections = ['E', 'S', 'T', 'J'];
        
        if (forwardDirections.includes(direction)) {
            // 정방향: 그대로 사용
            return answer;
        } else {
            // 역방향: 6 - answer (1↔5, 2↔4, 3은 그대로)
            return 6 - answer;
        }
    }

    // 지표별 점수 계산
    calculateDimensionScores() {
        // 모든 문항을 E/S/T/J에 점수를 쌓는 방식으로 통일
        const leftScores = {
            E: 0,
            S: 0,
            T: 0,
            J: 0
        };

        const dimensionCounts = {
            EI: { total: 0 },
            SN: { total: 0 },
            TF: { total: 0 },
            JP: { total: 0 }
        };

        // 각 응답에 대해 점수 계산 (모두 왼쪽 지표에 점수 쌓기)
        this.responses.forEach(response => {
            const { question, answer } = response;
            
            if (question.dimension === 'CHECK') {
                return; // 보정 문항은 점수 계산에서 제외
            }

            const convertedScore = this.convertScore(answer, question.direction, question.dimension);
            if (convertedScore === null) return;

            const dimension = question.dimension;
            dimensionCounts[dimension].total++;

            if (dimension === 'EI') {
                leftScores.E += convertedScore;
            } else if (dimension === 'SN') {
                leftScores.S += convertedScore;
            } else if (dimension === 'TF') {
                leftScores.T += convertedScore;
            } else if (dimension === 'JP') {
                leftScores.J += convertedScore;
            }
        });

        // 각 지표의 총 가능 점수 계산 (5점 척도, 문항당 최대 5점)
        const maxScores = {
            EI: dimensionCounts.EI.total * 5,
            SN: dimensionCounts.SN.total * 5,
            TF: dimensionCounts.TF.total * 5,
            JP: dimensionCounts.JP.total * 5
        };

        // 오른쪽 지표 점수 = 총 가능 점수 - 왼쪽 지표 점수
        const scores = {
            E: leftScores.E,
            I: maxScores.EI - leftScores.E,
            S: leftScores.S,
            N: maxScores.SN - leftScores.S,
            T: leftScores.T,
            F: maxScores.TF - leftScores.T,
            J: leftScores.J,
            P: maxScores.JP - leftScores.J
        };

        return { scores, dimensionCounts };
    }

    // 가중치 문항(Anchor) 점수 계산
    calculateAnchorScores() {
        const anchorLeftScores = {
            E: 0,
            S: 0,
            T: 0,
            J: 0
        };

        const anchorCounts = {
            EI: 0,
            SN: 0,
            TF: 0,
            JP: 0
        };

        this.responses.forEach(response => {
            const { question, answer } = response;
            
            if (!question.isAnchor || question.dimension === 'CHECK') {
                return;
            }

            const convertedScore = this.convertScore(answer, question.direction, question.dimension);
            if (convertedScore === null) return;

            const dimension = question.dimension;
            anchorCounts[dimension]++;

            if (dimension === 'EI') {
                anchorLeftScores.E += convertedScore;
            } else if (dimension === 'SN') {
                anchorLeftScores.S += convertedScore;
            } else if (dimension === 'TF') {
                anchorLeftScores.T += convertedScore;
            } else if (dimension === 'JP') {
                anchorLeftScores.J += convertedScore;
            }
        });

        // 오른쪽 지표 점수 계산
        const anchorMaxScores = {
            EI: anchorCounts.EI * 5,
            SN: anchorCounts.SN * 5,
            TF: anchorCounts.TF * 5,
            JP: anchorCounts.JP * 5
        };

        const anchorScores = {
            E: anchorLeftScores.E,
            I: anchorMaxScores.EI - anchorLeftScores.E,
            S: anchorLeftScores.S,
            N: anchorMaxScores.SN - anchorLeftScores.S,
            T: anchorLeftScores.T,
            F: anchorMaxScores.TF - anchorLeftScores.T,
            J: anchorLeftScores.J,
            P: anchorMaxScores.JP - anchorLeftScores.J
        };

        return anchorScores;
    }

    // 최근 3문항 평균 계산 (타이브레이커용)
    // 각 방향(왼쪽/오른쪽)의 최근 문항 점수를 비교
    calculateRecentAverage(dimension) {
        const dimensionResponses = this.responses
            .filter(r => r.question.dimension === dimension && r.question.dimension !== 'CHECK')
            .slice(-3);

        if (dimensionResponses.length === 0) return { left: 0, right: 0 };

        let leftSum = 0;
        let rightSum = 0;
        let leftCount = 0;
        let rightCount = 0;

        dimensionResponses.forEach(response => {
            const convertedScore = this.convertScore(
                response.answer,
                response.question.direction,
                response.question.dimension
            );
            if (convertedScore === null) return;

            // 왼쪽 방향(E/S/T/J)인지 확인
            const isLeft = ['E', 'S', 'T', 'J'].includes(response.question.direction);
            
            if (isLeft) {
                leftSum += convertedScore;
                leftCount++;
            } else {
                // 역방향 문항은 변환된 점수가 왼쪽에 더해지는 점수이므로
                // 오른쪽 점수는 (6 - convertedScore) 또는 총점에서 빼는 방식
                // 하지만 여기서는 단순히 원래 답변값의 역을 사용
                const rightScore = 6 - response.answer;
                rightSum += rightScore;
                rightCount++;
            }
        });

        return {
            left: leftCount > 0 ? leftSum / leftCount : 0,
            right: rightCount > 0 ? rightSum / rightCount : 0
        };
    }

    // 지표별 타입 결정 (타이브레이커 포함)
    determineType(dimension, scores, anchorScores) {
        let left, right, leftScore, rightScore;

        if (dimension === 'EI') {
            left = 'E';
            right = 'I';
            leftScore = scores.E;
            rightScore = scores.I;
        } else if (dimension === 'SN') {
            left = 'S';
            right = 'N';
            leftScore = scores.S;
            rightScore = scores.N;
        } else if (dimension === 'TF') {
            left = 'T';
            right = 'F';
            leftScore = scores.T;
            rightScore = scores.F;
        } else if (dimension === 'JP') {
            left = 'J';
            right = 'P';
            leftScore = scores.J;
            rightScore = scores.P;
        }

        // 1단계: 기본 점수 비교
        if (leftScore > rightScore) {
            return left;
        } else if (rightScore > leftScore) {
            return right;
        }

        // 2단계: 동점일 때 가중치 문항 비교
        const leftAnchor = anchorScores[left] || 0;
        const rightAnchor = anchorScores[right] || 0;

        if (leftAnchor > rightAnchor) {
            return left;
        } else if (rightAnchor > leftAnchor) {
            return right;
        }

        // 3단계: 최근 3문항 평균 비교
        const recentAvg = this.calculateRecentAverage(dimension);
        if (recentAvg.left > recentAvg.right) {
            return left;
        } else if (recentAvg.right > recentAvg.left) {
            return right;
        }

        // 4단계: 그래도 동점이면 X 처리
        return 'X';
    }

    // 강도(신뢰도) 계산
    calculateStrength(dimension, leftScore, rightScore, questionCount) {
        const diff = Math.abs(leftScore - rightScore);
        // 5점 척도에서 문항당 최대 차이는 4 (1 vs 5)
        // 하지만 실제로는 모든 문항이 한쪽으로 치우칠 때 최대 차이가 나므로
        // 문항당 최대 5점, 총 가능 점수 = questionCount * 5
        // 최대 차이 = questionCount * 5 (한쪽이 0점, 다른 쪽이 최대일 때)
        const maxDiff = questionCount * 5;
        const strength = maxDiff > 0 ? Math.round((diff / maxDiff) * 100) : 0;
        return strength;
    }

    // 주의력 체크 검증
    validateAttentionChecks() {
        const attentionQuestions = this.responses.filter(
            r => r.question.checkType === 'attention'
        );

        attentionQuestions.forEach(response => {
            if (response.answer !== response.question.expectedAnswer) {
                this.attentionCheckFailures++;
            }
        });

        return this.attentionCheckFailures;
    }

    // 일관성 점수 계산 (중복 문제 제거로 인해 비활성화)
    calculateConsistencyScores() {
        return {}; // 빈 객체 반환
    }

    // 최종 결과 계산
    calculateResult() {
        // 주의력 체크 검증
        const attentionFailures = this.validateAttentionChecks();
        
        // 일관성 점수 계산
        const consistencyScores = this.calculateConsistencyScores();

        // 지표별 점수 계산
        const { scores, dimensionCounts } = this.calculateDimensionScores();
        
        // 가중치 문항 점수
        const anchorScores = this.calculateAnchorScores();

        // 각 지표별 타입 결정
        const types = {
            EI: this.determineType('EI', scores, anchorScores),
            SN: this.determineType('SN', scores, anchorScores),
            TF: this.determineType('TF', scores, anchorScores),
            JP: this.determineType('JP', scores, anchorScores)
        };

        // 강도 계산
        const strengths = {
            EI: this.calculateStrength('EI', scores.E, scores.I, dimensionCounts.EI.total),
            SN: this.calculateStrength('SN', scores.S, scores.N, dimensionCounts.SN.total),
            TF: this.calculateStrength('TF', scores.T, scores.F, dimensionCounts.TF.total),
            JP: this.calculateStrength('JP', scores.J, scores.P, dimensionCounts.JP.total)
        };

        // 최종 타입 문자열 생성
        let typeString = '';
        const typeLabels = {
            EI: { E: 'E', I: 'I', X: 'X' },
            SN: { S: 'S', N: 'N', X: 'X' },
            TF: { T: 'T', F: 'F', X: 'X' },
            JP: { J: 'J', P: 'P', X: 'X' }
        };

        typeString = types.EI + types.SN + types.TF + types.JP;

        // 비율 계산
        const totalScores = {
            EI: scores.E + scores.I,
            SN: scores.S + scores.N,
            TF: scores.T + scores.F,
            JP: scores.J + scores.P
        };

        const percentages = {
            EI: {
                E: totalScores.EI > 0 ? Math.round((scores.E / totalScores.EI) * 100) : 50,
                I: totalScores.EI > 0 ? Math.round((scores.I / totalScores.EI) * 100) : 50
            },
            SN: {
                S: totalScores.SN > 0 ? Math.round((scores.S / totalScores.SN) * 100) : 50,
                N: totalScores.SN > 0 ? Math.round((scores.N / totalScores.SN) * 100) : 50
            },
            TF: {
                T: totalScores.TF > 0 ? Math.round((scores.T / totalScores.TF) * 100) : 50,
                F: totalScores.TF > 0 ? Math.round((scores.F / totalScores.TF) * 100) : 50
            },
            JP: {
                J: totalScores.JP > 0 ? Math.round((scores.J / totalScores.JP) * 100) : 50,
                P: totalScores.JP > 0 ? Math.round((scores.P / totalScores.JP) * 100) : 50
            }
        };

        return {
            type: typeString,
            types,
            scores,
            strengths,
            percentages,
            attentionFailures,
            consistencyScores,
            dimensionCounts
        };
    }
}

