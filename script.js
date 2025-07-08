// 全局状态管理
class AppState {
    constructor() {
        this.currentQuestion = null;
        this.userAnswer = null;
        this.isAnswered = false;
        this.showAnalysis = false;
        this.similarQuestion = null;
        this.similarAnswered = false;
    }
}

const appState = new AppState();

// 模拟数据
const questionData = {
    "201129": {
        questionNumber: "201129",
        questionSource: "2011年英语（一）第29题",
        fullText: `"When Liam McGee departed as president of Bank of America in August, his explanation was surprisingly straight up. Rather than cloaking his exit in the usual vague excuses, he came right out and said he was leaving \"to pursue my goal of running a company.\" Broadcasting his ambition was \"very much my decision,\" McGee says. Within two weeks, he was talking for the first time with the board of Hartford Financial Services Group, which named him CEO and chairman on September 29. McGee says leaving without a position lined up gave him time to reflect on what kind of company he wanted to run. It also sent a clear message to the outside world about his aspirations. And McGee isn't alone. In recent weeks the No.2 executives at Avon and American Express quit with the explanation that they were looking for a CEO post. As boards scrutinize succession plans in response to shareholder pressure, executives who don't get the nod also may wish to move on. A turbulent business environment also has senior managers cautious of letting vague pronouncements cloud their reputations. As the first signs of recovery begin to take hold, deputy chiefs may be more willing to make the jump without a net."`,
        question: "It can be inferred from the last paragraph that______",
        candidateAnswers: [
            "[A] top performers used to cling to their posts.",
            "[B] loyalty of top performers is getting out-dated.",
            "[C] top performers care more about reputations.",
            "[D] it's safer to stick to the traditional rules."
        ],
        answer: "[A] top performers used to cling to their posts.",
        questionType: "阅读题",
        locateWord: "top performers, cling, posts, traditional",
        questionTypeTag: "推理题",
        locateSentence: "As boards scrutinize succession plans in response to shareholder pressure, executives who don't get the nod also may wish to move on.",
        keySentence: "As boards scrutinize succession plans in response to shareholder pressure, executives who don't get the nod also may wish to move on.",
        knowledgeTag: "推理题关键句定位",
        translation: "当董事会因股东压力而审查继任计划时，那些没有得到认可的 executives 也可能希望离开。",
        explanation: "这道题目是一道推理题，需要从最后一段推断出结论。根据关键句'As boards scrutinize succession plans in response to shareholder pressure, executives who don't get the nod also may wish to move on'，可以推断出高管们不再像以前那样坚守岗位，而是更愿意主动离开寻找新的机会。因此正确答案是A选项。",
        distractorAnalysis: [
            {
                option: "[B] loyalty of top performers is getting out-dated.",
                optionPoint: "1) loyalty 2) top performers 3) out-dated",
                explanation: "B选项错误地认为忠诚度过时了，但原文并没有直接表达这个观点，属于过度推理。",
                knowledgeTag: "过度推理"
            },
            {
                option: "[C] top performers care more about reputations.",
                optionPoint: "1) top performers 2) care more 3) reputations",
                explanation: "C选项虽然提到了声誉，但原文中并没有直接比较高管们是否更关心声誉，属于信息歪曲。",
                knowledgeTag: "信息歪曲"
            },
            {
                option: "[D] it's safer to stick to the traditional rules.",
                optionPoint: "1) safer 2) stick to 3) traditional rules",
                explanation: "D选项与原文意思相反，原文表明高管们更愿意冒险离开，而不是坚持传统规则，属于反向干扰。",
                knowledgeTag: "反向干扰"
            }
        ],
        analysisStatus: "success"
    }
};

const similarQuestionData = {
    "201026": {
        questionNumber: "201026",
        questionSource: "2010年英语（一）第26题",
        paragraph: "Business-method patents have recently aroused concern because of their potential to restrict competition and innovation. Now the nation's top patent court appears completely ready to scale back on business-method patents, which have been controversial ever since they were first authorized 10 years ago.",
        question: "Business-method patents have recently aroused concern because of______",
        candidateAnswers: [
            "[A] their limited value to businesses.",
            "[B] their connection with asset allocation.",
            "[C] the possible restriction on their granting.",
            "[D] the controversy over their authorization."
        ],
        answer: "[C] the possible restriction on their granting.",
        questionType: "阅读题"
    }
};

// DOM元素
const elements = {
    articleContent: document.getElementById('articleContent'),
    questionText: document.getElementById('questionText'),
    optionsContainer: document.getElementById('optionsContainer'),
    answerResult: document.getElementById('answerResult'),
    analysisContainer: document.getElementById('analysisContainer'),
    showAnalysisBtn: document.getElementById('showAnalysisBtn'),
    similarQuestionsBtn: document.getElementById('similarQuestionsBtn'),
    similarModal: document.getElementById('similarModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    returnBtn: document.getElementById('returnBtn'),
    similarArticleContent: document.getElementById('similarArticleContent'),
    similarQuestionText: document.getElementById('similarQuestionText'),
    similarOptions: document.getElementById('similarOptions'),
    similarResult: document.getElementById('similarResult'),
    locateWord: document.getElementById('locateWord'),
    locateSentence: document.getElementById('locateSentence'),
    keySentence: document.getElementById('keySentence'),
    translation: document.getElementById('translation'),
    explanation: document.getElementById('explanation'),
    distractorItems: document.getElementById('distractorItems')
};

// 初始化应用
function initApp() {
    loadQuestion('201129');
    bindEvents();
}

// 加载题目数据
function loadQuestion(questionNumber) {
    const data = questionData[questionNumber];
    if (!data) return;
    
    appState.currentQuestion = data;
    renderQuestion(data);
}

// 渲染题目
function renderQuestion(data) {
    // 渲染原文
    renderArticle(data.fullText);
    
    // 渲染问题
    elements.questionText.textContent = data.question;
    
    // 渲染选项
    renderOptions(data.candidateAnswers);
    
    // 重置状态
    appState.isAnswered = false;
    appState.showAnalysis = false;
    elements.answerResult.style.display = 'none';
    elements.analysisContainer.style.display = 'none';
}

// 渲染原文
function renderArticle(text) {
    // 将文本分段
    const paragraphs = text.split('\n').filter(p => p.trim());
    
    elements.articleContent.innerHTML = paragraphs.map(paragraph => {
        return `<p>${makeTextClickable(paragraph)}</p>`;
    }).join('');
}

// 使文本可点击
function makeTextClickable(text) {
    // 简单的单词分割和点击处理
    return text.split(' ').map(word => {
        const cleanWord = word.replace(/[.,!?;:]/g, '');
        if (cleanWord.length > 3) {
            return `<span class="highlight" onclick="highlightWord(this)">${word}</span>`;
        }
        return word;
    }).join(' ');
}

// 高亮单词
function highlightWord(element) {
    element.classList.toggle('selected');
}

// 渲染选项
function renderOptions(options) {
    elements.optionsContainer.innerHTML = options.map((option, index) => {
        const letter = String.fromCharCode(65 + index); // A, B, C, D
        return `
            <div class="option-item" onclick="selectOption(this, '${option}')">
                <div class="option-letter">${letter}</div>
                <div class="option-text">${option}</div>
            </div>
        `;
    }).join('');
}

// 选择选项
function selectOption(element, optionText) {
    if (appState.isAnswered) return;
    
    // 清除之前的选择
    document.querySelectorAll('.option-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // 标记当前选择
    element.classList.add('selected');
    appState.userAnswer = optionText;
    
    // 提交答案
    submitAnswer();
}

// 提交答案
function submitAnswer() {
    if (!appState.userAnswer || !appState.currentQuestion) return;
    
    appState.isAnswered = true;
    
    const isCorrect = appState.userAnswer === appState.currentQuestion.answer;
    
    // 显示结果
    showAnswerResult(isCorrect);
    
    // 标记选项
    markOptions();
}

// 显示答题结果
function showAnswerResult(isCorrect) {
    const resultMessage = elements.answerResult.querySelector('.result-message');
    
    if (isCorrect) {
        resultMessage.textContent = '✓ 回答正确！';
        resultMessage.className = 'result-message correct';
    } else {
        resultMessage.textContent = '✗ 回答错误';
        resultMessage.className = 'result-message incorrect';
    }
    
    elements.answerResult.style.display = 'block';
}

// 标记选项
function markOptions() {
    const options = document.querySelectorAll('.option-item');
    const correctAnswer = appState.currentQuestion.answer;
    
    options.forEach(option => {
        const optionText = option.querySelector('.option-text').textContent;
        
        if (optionText === correctAnswer) {
            option.classList.add('correct');
        } else if (optionText === appState.userAnswer && appState.userAnswer !== correctAnswer) {
            option.classList.add('incorrect');
        }
    });
}

// 显示解析
function showAnalysis() {
    if (!appState.currentQuestion) return;
    
    const data = appState.currentQuestion;
    
    // 填充解析数据
    elements.locateWord.textContent = data.locateWord;
    elements.locateSentence.textContent = data.locateSentence;
    elements.keySentence.textContent = data.keySentence;
    elements.translation.textContent = data.translation;
    elements.explanation.textContent = data.explanation;
    
    // 渲染干扰项分析
    renderDistractorAnalysis(data.distractorAnalysis);
    
    // 标记原文中的关键句
    markKeySentences();
    
    elements.analysisContainer.style.display = 'block';
    appState.showAnalysis = true;
}

// 渲染干扰项分析
function renderDistractorAnalysis(distractors) {
    elements.distractorItems.innerHTML = distractors.map(distractor => `
        <div class="distractor-item">
            <div class="distractor-header" onclick="toggleDistractor(this)">
                <span class="distractor-option">${distractor.option}</span>
                <span class="distractor-tag">${distractor.knowledgeTag}</span>
            </div>
            <div class="distractor-content">
                <div class="distractor-points">${distractor.optionPoint}</div>
                <div class="distractor-explanation">${distractor.explanation}</div>
            </div>
        </div>
    `).join('');
}

// 切换干扰项显示
function toggleDistractor(header) {
    const content = header.nextElementSibling;
    content.classList.toggle('show');
}

// 标记关键句
function markKeySentences() {
    const articleContent = elements.articleContent;
    const locateSentence = appState.currentQuestion.locateSentence;
    const keySentence = appState.currentQuestion.keySentence;
    
    // 标记定位句
    if (locateSentence) {
        highlightSentence(articleContent, locateSentence, 'locate-sentence');
    }
    
    // 标记关键句
    if (keySentence) {
        highlightSentence(articleContent, keySentence, 'key-sentence');
    }
}

// 高亮句子
function highlightSentence(container, sentence, className) {
    const text = container.textContent;
    const index = text.indexOf(sentence);
    
    if (index !== -1) {
        const before = text.substring(0, index);
        const after = text.substring(index + sentence.length);
        
        container.innerHTML = `
            ${before}<span class="${className}">${sentence}</span>${after}
        `;
    }
}

// 显示相似题
function showSimilarQuestion() {
    const similarData = similarQuestionData['201026'];
    appState.similarQuestion = similarData;
    
    // 填充相似题数据
    elements.similarArticleContent.textContent = similarData.paragraph;
    elements.similarQuestionText.textContent = similarData.question;
    
    // 渲染相似题选项
    renderSimilarOptions(similarData.candidateAnswers);
    
    // 显示模态框
    elements.similarModal.style.display = 'block';
    
    // 重置相似题状态
    appState.similarAnswered = false;
    elements.similarResult.style.display = 'none';
}

// 渲染相似题选项
function renderSimilarOptions(options) {
    elements.similarOptions.innerHTML = options.map((option, index) => {
        const letter = String.fromCharCode(65 + index);
        return `
            <div class="similar-option" onclick="selectSimilarOption(this, '${option}')">
                <div class="option-letter">${letter}</div>
                <div class="option-text">${option}</div>
            </div>
        `;
    }).join('');
}

// 选择相似题选项
function selectSimilarOption(element, optionText) {
    if (appState.similarAnswered) return;
    
    // 清除之前的选择
    document.querySelectorAll('.similar-option').forEach(item => {
        item.classList.remove('selected');
    });
    
    // 标记当前选择
    element.classList.add('selected');
    
    // 检查答案
    const isCorrect = optionText === appState.similarQuestion.answer;
    
    // 标记选项
    markSimilarOptions(isCorrect, optionText);
    
    // 显示结果
    showSimilarResult(isCorrect);
    
    appState.similarAnswered = true;
}

// 标记相似题选项
function markSimilarOptions(isCorrect, userAnswer) {
    const options = document.querySelectorAll('.similar-option');
    const correctAnswer = appState.similarQuestion.answer;
    
    options.forEach(option => {
        const optionText = option.querySelector('.option-text').textContent;
        
        if (optionText === correctAnswer) {
            option.classList.add('correct');
        } else if (optionText === userAnswer && userAnswer !== correctAnswer) {
            option.classList.add('incorrect');
        }
    });
}

// 显示相似题结果
function showSimilarResult(isCorrect) {
    const resultText = isCorrect ? '✓ 回答正确！' : '✗ 回答错误';
    const resultClass = isCorrect ? 'correct' : 'incorrect';
    
    elements.similarResult.textContent = resultText;
    elements.similarResult.className = `similar-result ${resultClass}`;
    elements.similarResult.style.display = 'block';
}

// 关闭模态框
function closeModal() {
    elements.similarModal.style.display = 'none';
}

// 返回原题
function returnToOriginal() {
    closeModal();
    // 可以在这里添加返回原题的逻辑
}

// 绑定事件
function bindEvents() {
    // 查看解析按钮
    elements.showAnalysisBtn.addEventListener('click', showAnalysis);
    
    // 相似题按钮
    elements.similarQuestionsBtn.addEventListener('click', showSimilarQuestion);
    
    // 关闭模态框
    elements.closeModalBtn.addEventListener('click', closeModal);
    elements.returnBtn.addEventListener('click', returnToOriginal);
    
    // 点击模态框外部关闭
    elements.similarModal.addEventListener('click', (e) => {
        if (e.target === elements.similarModal) {
            closeModal();
        }
    });
    
    // 键盘事件
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// 全局函数（用于HTML中的onclick）
window.highlightWord = highlightWord;
window.selectOption = selectOption;
window.toggleDistractor = toggleDistractor;
window.selectSimilarOption = selectSimilarOption;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp); 