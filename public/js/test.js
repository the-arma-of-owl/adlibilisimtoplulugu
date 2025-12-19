// Field configurations
const fields = [
    {
        name: 'Digital Forensics',
        icon: '🔍',
        character: '/images/characters/digital-forensics.png',
        description: 'Dijital delillerin analizi ve adli süreçler konusunda uzmanlaşabilirsiniz. Bilgisayar sistemlerinden, mobil cihazlardan ve ağlardan delil toplama ve analiz etme becerileri geliştirebilirsiniz.'
    },
    {
        name: 'Offensive Security',
        icon: '⚔️',
        character: '/images/characters/offensive-security.png',
        description: 'Penetrasyon testleri ve güvenlik açığı analizi alanında kariyer yapabilirsiniz. Sistemlerin güvenlik açıklarını bulma ve sömürme konusunda uzmanlaşabilirsiniz.'
    },
    {
        name: 'Defensive Security',
        icon: '🛡️',
        character: '/images/characters/defensive-security.png',
        description: 'SOC operasyonları ve savunma stratejileri alanında çalışabilirsiniz. Siber saldırıları tespit etme, analiz etme ve önleme konularında kendinizi geliştirebilirsiniz.'
    },
    {
        name: 'Network Security',
        icon: '🌐',
        character: '/images/characters/network-security.png',
        description: 'Ağ güvenliği ve altyapı koruması konusunda uzmanlaşabilirsiniz. Ağ trafiğini izleme, güvenlik duvarları ve ağ mimarisi tasarımı alanlarında kariyer yapabilirsiniz.'
    },
    {
        name: 'Sosyal Mühendislik',
        icon: '🎭',
        character: '/images/characters/sosyal-muhendislik.png',
        description: 'Sosyal mühendislik ve insan faktörü güvenliği alanında uzmanlaşabilirsiniz. İnsan psikolojisini anlayarak güvenlik açıklarını tespit etme ve önleme konusunda kariyer yapabilirsiniz.'
    },
    {
        name: 'Cyber Threat Intelligence',
        icon: '📊',
        character: '/images/characters/cyber-threat-intelligence.png',
        description: 'Tehdit istihbaratı ve risk analizi konusunda kariyer yapabilirsiniz. Siber tehditleri araştırma, analiz etme ve raporlama becerileri geliştirebilirsiniz.'
    }
];

// Field mapping for answer calculation
const fieldMap = {
    'OS': 1, // Offensive Security
    'SE': 4, // Sosyal Mühendislik
    'DF': 0, // Digital Forensics
    'DS': 2, // Defensive Security
    'CTI': 5, // Cyber Threat Intelligence
    'NS': 3  // Network Security
};

// Questions array - 15 questions, balanced across 6 fields
const questions = [
    {
        text: 'Bir arkadaş grubunda kavga çıktı. Siz ne yaparsınız?',
        options: [
            { text: 'Hemen araya girip kavga edenleri ayırmaya çalışırım.', field: 'OS' },
            { text: 'Tarafları sakinleştirerek arabuluculuk yapmaya çalışırım.', field: 'SE' },
            { text: 'Kavgayı dikkatlice izler, olayın nedenini çözmeye çalışırım.', field: 'DF' },
            { text: 'Güvenlik görevlilerinden veya ilgili birinden yardım isterim.', field: 'DS' }
        ]
    },
    {
        text: 'Ofiste ya da evde kullandığınız bir eşyayı kaybettiniz. Ne yaparsınız?',
        options: [
            { text: 'Son kullandığım yeri düşünür, adımlarımı geriye doğru takip etmeye çalışırım.', field: 'DF' },
            { text: 'Arkadaşlarıma veya iş arkadaşlarıma haber verip onlardan yardım isterim.', field: 'SE' },
            { text: 'Kayıp eşya hakkında olabildiğince bilgi toplar, hatırladığım tüm detayları incelerim.', field: 'CTI' },
            { text: 'Eşyayı kaybettiğim her ihtimali değerlendirir, gerekiyorsa önlemler alırım.', field: 'DS' }
        ]
    },
    {
        text: 'Hafta sonu doğa yürüyüşü planlamışsınız ancak gideceğiniz gün fırtına haberi alıyorsunuz. Ne yaparsınız?',
        options: [
            { text: 'Hava tahminlerini kontrol eder, tehlikeyi göz önünde bulundururum.', field: 'CTI' },
            { text: 'Fırtınaya rağmen planı değiştirip yürüyüşe çıkmaya karar veririm.', field: 'OS' },
            { text: 'Ekipmanları kontrol eder, güvenlik önlemlerini güçlendiririm.', field: 'DS' },
            { text: 'Grup üyeleriyle iletişime geçip alternatif bir plan hazırlamaya çalışırım.', field: 'NS' }
        ]
    },
    {
        text: 'Ofiste bir dedikodu duyuyorsunuz. Ne yaparsınız?',
        options: [
            { text: 'Hemen herkesi toplayıp durumu açıklayıp gerçeği anlatırım.', field: 'OS' },
            { text: 'Sakin kalır, durumu dikkatlice izler, sebebini anlamaya çalışırım.', field: 'DF' },
            { text: 'Ortamı yumuşatmak için sakinleştirici sözler söylerim.', field: 'SE' },
            { text: 'Olayı yetkililere bildiririm.', field: 'DS' }
        ]
    },
    {
        text: 'Yakın bir arkadaşınız size önemli bir sır verdi. Bu durumda ne yaparsınız?',
        options: [
            { text: 'Arkadaşımı daha iyi tanımak ve sırrın gerçekten önemli olup olmadığını anlamak için onunla uzun konuşmalar yaparım.', field: 'SE' },
            { text: 'Sadece ona söz vererek sırrı kimseyle paylaşmayacağıma dair güven veririm.', field: 'DS' },
            { text: 'Durumu analiz etmek için arkadaşımı ve çevresini dikkatlice gözlemlerim.', field: 'DF' },
            { text: 'Kendi yöntemimle sırrı ortaya çıkarmaya çalışır, arkadaşımın sadakatini sınarım.', field: 'OS' }
        ]
    },
    {
        text: 'Bir grup etkinliği planlarken aksilikler çıkıyor. Nasıl bir yaklaşım sergilersiniz?',
        options: [
            { text: 'Herkese net görevler vererek süreci düzenli hale getiririm.', field: 'NS' },
            { text: 'Muhtemel risklere karşı tedbirler alır, güvenliği güçlendiririm.', field: 'DS' },
            { text: 'Problem çıktığında hızlıca alternatif çözümler üretirim.', field: 'OS' },
            { text: 'Sorun çıkabilecek noktaları önceden tespit etmeye çalışırım.', field: 'CTI' }
        ]
    },
    {
        text: 'Kapınızda daha önce tanımadığınız biri zil çalıyor. Ne yaparsınız?',
        options: [
            { text: 'Hemen kapıyı açıp gelenin kim olduğunu sorarım.', field: 'OS' },
            { text: 'Pencereden yüzüne bakar, güvenliğinden emin olmaya çalışırım.', field: 'DS' },
            { text: 'Komşulara veya başkalarına kimin gelebileceğini sorarım.', field: 'CTI' },
            { text: 'Güler yüzle karşılayıp niyetini anlamaya çalışırım.', field: 'SE' }
        ]
    },
    {
        text: 'Şirketinizin zor bir dönemden geçtiğini hissediyorsunuz. Ne yaparsınız?',
        options: [
            { text: 'Şirket içi kaynaklardan bilgi toplar, durumu araştırırım.', field: 'CTI' },
            { text: 'Ekipin moralini yüksek tutmak için motivasyon toplantısı düzenlerim.', field: 'SE' },
            { text: 'Bütçeyi gözden geçirip önlem planları hazırlarım.', field: 'DS' },
            { text: 'Riskleri test etmek için yeni stratejiler geliştiririm.', field: 'OS' }
        ]
    },
    {
        text: 'Arkadaşınızın bir şeylerden rahatsız olduğunu fark ettiniz ancak size söylemiyor. Ne yaparsınız?',
        options: [
            { text: 'Çaktırmadan onu gözlemleyip durumu anlamaya çalışırım.', field: 'DF' },
            { text: 'Direkt yanına gidip nazikçe neyin rahatsız ettiğini sorarım.', field: 'SE' },
            { text: 'Başkalarından durumu öğrenip arkadaşınız hakkında bilgi toplamaya çalışırım.', field: 'NS' },
            { text: 'Gerekli desteği sağlamak için çözüm planlamaya başlarım.', field: 'DS' }
        ]
    },
    {
        text: 'Arabanızın lastikleri patlak halde bulundu. Ne yaparsınız?',
        options: [
            { text: 'Suçu araştırmak için etraftaki delilleri dikkatlice incelerim.', field: 'DF' },
            { text: 'Komşularla konuşup olay hakkında bilgi toplamaya çalışırım.', field: 'NS' },
            { text: 'Olayı hemen polise bildiririm.', field: 'DS' },
            { text: 'Hemen lastiği tamir edip yola devam etmeyi denerim.', field: 'OS' }
        ]
    },
    {
        text: 'Mahallenizde bir yangın çıktı. İlk tepkileriniz ne olur?',
        options: [
            { text: 'Yangın sırasında herkesin güvenliğini sağlamak için tahliye düzeni kurarım.', field: 'NS' },
            { text: 'Yangını söndürmeye yardım eder, durumu kontrol altına almaya çalışırım.', field: 'DS' },
            { text: 'Olayı dikkatlice gözlemler, delil toplarım.', field: 'DF' },
            { text: 'Haberleri dinler, yangının kaynağı hakkında bilgi edinmeye çalışırım.', field: 'CTI' }
        ]
    },
    {
        text: 'Komşunuz elinde büyük çantalarla evden çıkarken görüyorsunuz. Ne yaparsınız?',
        options: [
            { text: 'Durumu araştırmak için bir plan yapar, bilgileri toplamaya çalışırım.', field: 'CTI' },
            { text: 'Peşinden gidip ne yaptığını anlamaya çalışırım.', field: 'DF' },
            { text: 'Polise haber veririm.', field: 'DS' },
            { text: 'Güler yüzle \'merhaba\' diyerek niyetini öğrenmeye çalışırım.', field: 'SE' }
        ]
    },
    {
        text: 'Arkadaşlarınız bir proje üzerinde çalışıyor ve herkes farklı fikirde. Siz ne yaparsınız?',
        options: [
            { text: 'Geçmiş projelerdeki notları inceleyip en iyi yöntemi bulmaya çalışırım.', field: 'CTI' },
            { text: 'Kendi fikrimi güçlü bir şekilde savunurum.', field: 'OS' },
            { text: 'Herkesin fikrini dinleyip ortak bir çözüm bulurum.', field: 'SE' },
            { text: 'Takım üyelerinin yeteneklerine göre görev dağılımı yaparım.', field: 'NS' }
        ]
    },
    {
        text: 'Ofisinize yeni bir çalışan katıldı. Ona nasıl yardımcı olursunuz?',
        options: [
            { text: 'Toplantı düzenleyip gerekli bilgileri toplar, açıklarım.', field: 'NS' },
            { text: 'Yeni çalışanı rahatlatmak için arkadaşça davranırım.', field: 'SE' },
            { text: 'Gerekli kaynakları araştırıp bilgi sağlarım.', field: 'CTI' },
            { text: 'Hata yapmasını önlemek için sürece müdahale ederim.', field: 'DS' }
        ]
    },
    {
        text: 'Toplumda bazı kişilerin bilmesi gereken önemli bilgilerden haberi yok. Ne yaparsınız?',
        options: [
            { text: 'Güvenilir kaynaklardan bilgi toplar, özetlerim.', field: 'CTI' },
            { text: 'Ailemi ve arkadaşlarımı bilgilendiririm.', field: 'NS' },
            { text: 'Yaratıcı bir kampanya planlayarak bilgiyi yaymaya çalışırım.', field: 'SE' },
            { text: 'İnisiyatif alıp birebir bilgi verir, gerekli çözümü uygularım.', field: 'OS' }
        ]
    },
];

// State
let userName = '';
let currentQuestionIndex = 0;
let answers = [];
let totalQuestions = questions.length;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeNameForm();
    generateQuestions();
});

function initializeNameForm() {
    const nameForm = document.getElementById('nameFormElement');
    nameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        userName = document.getElementById('userName').value.trim();
        if (userName) {
            document.getElementById('nameForm').classList.add('hidden');
            document.getElementById('testSection').classList.remove('hidden');
            showQuestion(0);
        }
    });
}

function generateQuestions() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    
    questions.forEach((question, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card hidden';
        questionCard.id = `question-${index}`;
        
        const optionsHtml = question.options.map((option, optIndex) => {
            return `
                <div class="option" data-option="${optIndex}" data-field="${option.field}">
                    <span class="option-label">${String.fromCharCode(65 + optIndex)})</span>
                    <span class="option-text">${option.text}</span>
                </div>
            `;
        }).join('');
        
        questionCard.innerHTML = `
            <div class="question-number">Soru ${index + 1}</div>
            <div class="question-text">${question.text}</div>
            <div class="options">
                ${optionsHtml}
            </div>
        `;
        
        container.appendChild(questionCard);
        
        // Add click handlers
        const options = questionCard.querySelectorAll('.option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                answers[index] = parseInt(option.dataset.option);
                updateButtons();
            });
        });
    });
    
    // Initialize navigation buttons
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('prevBtn').addEventListener('click', prevQuestion);
    document.getElementById('submitBtn').addEventListener('click', submitTest);
}

function showQuestion(index) {
    // Hide all questions
    document.querySelectorAll('.question-card').forEach(card => {
        card.classList.add('hidden');
    });
    
    // Show current question
    const currentCard = document.getElementById(`question-${index}`);
    if (currentCard) {
        currentCard.classList.remove('hidden');
    }
    
    // Update progress
    const progress = ((index + 1) / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    
    // Update counter
    document.getElementById('currentQuestion').textContent = index + 1;
    document.getElementById('totalQuestions').textContent = totalQuestions;
    
    // Restore selected answer if exists
    if (answers[index] !== undefined) {
        const options = currentCard.querySelectorAll('.option');
        options.forEach(opt => {
            if (parseInt(opt.dataset.option) === answers[index]) {
                opt.classList.add('selected');
            }
        });
    }
    
    updateButtons();
}

function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    prevBtn.disabled = currentQuestionIndex === 0;
    
    if (currentQuestionIndex === totalQuestions - 1) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }
}

function nextQuestion() {
    if (currentQuestionIndex < totalQuestions - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
}

function calculateResult() {
    // Calculate scores based on actual field mappings from questions
    const scores = [0, 0, 0, 0, 0, 0]; // DF, OS, DS, NS, SE, CTI
    
    answers.forEach((answerIndex, questionIndex) => {
        if (answerIndex !== undefined && questions[questionIndex]) {
            const selectedOption = questions[questionIndex].options[answerIndex];
            if (selectedOption && selectedOption.field) {
                const fieldIndex = fieldMap[selectedOption.field];
                if (fieldIndex !== undefined) {
                    scores[fieldIndex]++;
                }
            }
        }
    });
    
    const maxScore = Math.max(...scores);
    const fieldIndex = scores.indexOf(maxScore);
    
    return fieldIndex;
}

async function submitTest() {
    // Check if all questions are answered
    let unansweredCount = 0;
    for (let i = 0; i < totalQuestions; i++) {
        if (answers[i] === undefined) {
            unansweredCount++;
        }
    }
    
    if (unansweredCount > 0) {
        alert(`Lütfen tüm soruları cevaplayın! ${unansweredCount} soru cevaplanmamış.`);
        return;
    }
    
    // Calculate result
    const fieldIndex = calculateResult();
    const selectedField = fields[fieldIndex];
    
    // Send to backend
    try {
        const response = await fetch('/api/submit-test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: userName,
                answers: answers
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Show result
            document.getElementById('testSection').classList.add('hidden');
            document.getElementById('resultSection').classList.remove('hidden');
            
            // Set character image
            const characterImg = document.getElementById('resultCharacter');
            const resultIcon = document.getElementById('resultIcon');
            
            // Reset states
            characterImg.style.display = 'block';
            resultIcon.style.display = 'none';
            
            // Set image source
            characterImg.src = selectedField.character;
            characterImg.alt = selectedField.name + ' Character';
            
            // Handle image load error
            characterImg.onerror = function() {
                // Fallback to icon if image doesn't exist
                this.style.display = 'none';
                resultIcon.style.display = 'block';
            };
            
            // Handle successful image load
            characterImg.onload = function() {
                this.style.display = 'block';
                resultIcon.style.display = 'none';
            };
            
            resultIcon.textContent = selectedField.icon;
            document.getElementById('resultTitle').textContent = selectedField.name;
            document.getElementById('resultUserName').textContent = userName;
            document.getElementById('resultDescription').textContent = selectedField.description;
        } else {
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    } catch (error) {
        alert('Sunucu hatası. Lütfen tekrar deneyin.');
    }
}
