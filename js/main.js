// --- State & Data ---
let courses = JSON.parse(localStorage.getItem('gpa_courses')) || [];
let pendingConfirmAction = null;

const gradeMapping = [
    { min: 9.0, max: 10.0, char: 'A+', gpa4: 4.0 },
    { min: 8.5, max: 8.99, char: 'A', gpa4: 3.75 },
    { min: 8.0, max: 8.49, char: 'A-', gpa4: 3.5 },
    { min: 7.5, max: 7.99, char: 'B+', gpa4: 3.25 },
    { min: 7.0, max: 7.49, char: 'B', gpa4: 3.0 },
    { min: 6.5, max: 6.99, char: 'B-', gpa4: 2.75 },
    { min: 6.0, max: 6.49, char: 'C+', gpa4: 2.5 },
    { min: 5.5, max: 5.99, char: 'C', gpa4: 2.25 },
    { min: 5.0, max: 5.49, char: 'C-', gpa4: 2.0 },
    { min: 4.0, max: 4.99, char: 'D+', gpa4: 1.5 },
    { min: 0.0, max: 3.99, char: 'F', gpa4: 0.0 }
];

// --- Theme Logic ---

function initTheme() {
    // Kiểm tra cài đặt đã lưu hoặc ưu tiên hệ thống
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        updateThemeIcon(true);
    } else {
        document.documentElement.classList.remove('dark');
        updateThemeIcon(false);
    }
}

function toggleTheme() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.theme = 'light';
        updateThemeIcon(false);
    } else {
        html.classList.add('dark');
        localStorage.theme = 'dark';
        updateThemeIcon(true);
    }
}

function updateThemeIcon(isDark) {
    const icon = document.getElementById('themeIcon');
    if (isDark) {
        icon.classList.remove('ph-sun', 'text-slate-600');
        icon.classList.add('ph-moon', 'text-yellow-400');
    } else {
        icon.classList.remove('ph-moon', 'text-yellow-400');
        icon.classList.add('ph-sun', 'text-slate-600');
    }
}

// --- Core Logic ---

function convertScore(score10) {
    for (let grade of gradeMapping) {
        if (score10 >= grade.min && score10 <= grade.max) {
            return grade;
        }
    }
    return score10 >= 9.0 ? gradeMapping[0] : gradeMapping[gradeMapping.length - 1];
}

function calculateTotal() {
    if (courses.length === 0) return { gpa: 0, credits: 0, rank: '-' };

    let totalWeightedScore = 0;
    let totalCredits = 0;

    courses.forEach(c => {
        totalWeightedScore += c.gpa4 * c.credits;
        totalCredits += c.credits;
    });

    const gpa = totalCredits > 0 ? (totalWeightedScore / totalCredits) : 0;
    
    let rank = 'Kém';
    if (gpa >= 3.6) rank = 'Xuất sắc';
    else if (gpa >= 3.2) rank = 'Giỏi';
    else if (gpa >= 2.5) rank = 'Khá';
    else if (gpa >= 2.0) rank = 'Trung bình';

    return { gpa, credits: totalCredits, rank };
}

function saveData() {
    localStorage.setItem('gpa_courses', JSON.stringify(courses));
    renderUI();
}

// --- UI Handling ---

function handleFormSubmit(e) {
    e.preventDefault();
    const scoreInput = document.getElementById('score10');
    const creditsInput = document.getElementById('credits');
    const editIndexInput = document.getElementById('editIndex');

    const score = parseFloat(scoreInput.value);
    const credits = parseInt(creditsInput.value);
    const editIndex = parseInt(editIndexInput.value);

    if (isNaN(score) || score < 0 || score > 10) {
        showToast('Điểm không hợp lệ (0-10)', 'error');
        return;
    }
    if (isNaN(credits) || credits < 1) {
        showToast('Số tín chỉ không hợp lệ', 'error');
        return;
    }

    const converted = convertScore(score);
    const courseData = {
        score10: score,
        credits: credits,
        charGrade: converted.char,
        gpa4: converted.gpa4,
        id: Date.now()
    };

    if (editIndex > -1) {
        courses[editIndex] = courseData;
        showToast('Cập nhật môn học thành công!');
        cancelEdit();
    } else {
        courses.push(courseData);
        showToast('Đã thêm môn học mới');
    }

    if (editIndex === -1) {
        scoreInput.value = '';
        creditsInput.value = '';
        scoreInput.focus();
    }

    saveData();
}

// --- Confirmation Modal Logic ---

function openConfirmModal(msg, action) {
    document.getElementById('confirmMessage').innerText = msg;
    pendingConfirmAction = action;
    const modal = document.getElementById('confirmModal');
    const content = document.getElementById('confirmModalContent');
    
    modal.classList.remove('hidden');
    // Trigger reflow
    void modal.offsetWidth;
    modal.classList.remove('opacity-0');
    content.classList.remove('scale-95');
    content.classList.add('scale-100');
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    const content = document.getElementById('confirmModalContent');
    
    modal.classList.add('opacity-0');
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        pendingConfirmAction = null;
    }, 300);
}

function executeConfirmAction() {
    if (pendingConfirmAction) pendingConfirmAction();
    closeConfirmModal();
}

// --- Course Actions ---

function requestDeleteCourse(index) {
    openConfirmModal('Bạn có chắc muốn xóa môn học này không?', () => {
        courses.splice(index, 1);
        if (parseInt(document.getElementById('editIndex').value) === index) {
            cancelEdit();
        }
        saveData();
        showToast('Đã xóa môn học');
    });
}

function requestReset() {
    if (courses.length === 0) return;
    openConfirmModal('Toàn bộ danh sách môn học sẽ bị xóa sạch. Bạn có chắc chắn không?', () => {
        courses = [];
        cancelEdit();
        saveData();
        showToast('Đã làm mới toàn bộ');
    });
}

function editCourse(index) {
    const course = courses[index];
    document.getElementById('score10').value = course.score10;
    document.getElementById('credits').value = course.credits;
    document.getElementById('editIndex').value = index;
    
    const btn = document.getElementById('submitBtn');
    btn.innerHTML = `<i class="ph-bold ph-check"></i> <span>Lưu thay đổi</span>`;
    btn.classList.remove('bg-blue-600', 'hover:bg-blue-700', 'dark:bg-blue-600');
    btn.classList.add('bg-indigo-600', 'hover:bg-indigo-700', 'dark:bg-indigo-600');
    
    document.getElementById('cancelEditBtn').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
    document.getElementById('courseForm').reset();
    document.getElementById('editIndex').value = "-1";
    
    const btn = document.getElementById('submitBtn');
    btn.innerHTML = `<i class="ph-bold ph-plus"></i> <span>Thêm</span>`;
    btn.classList.add('bg-blue-600', 'hover:bg-blue-700', 'dark:bg-blue-600');
    btn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700', 'dark:bg-indigo-600');
    
    document.getElementById('cancelEditBtn').classList.add('hidden');
}

// --- Rendering ---

function renderUI() {
    const listEl = document.getElementById('courseList');
    const resultCard = document.getElementById('resultCard');
    const countBadge = document.getElementById('courseCountBadge');
    
    countBadge.innerText = courses.length;

    if (courses.length === 0) {
        listEl.innerHTML = `
            <div class="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-slate-500 animate-fade-in">
                <i class="ph-duotone ph-notebook text-5xl mb-3 text-slate-300 dark:text-slate-600"></i>
                <p class="font-medium">Chưa có môn học nào</p>
                <p class="text-sm">Nhập điểm ở bảng bên trái để bắt đầu</p>
            </div>`;
        resultCard.classList.add('hidden');
    } else {
        resultCard.classList.remove('hidden');
        let html = '';
        courses.forEach((c, i) => {
            let gradeColor = 'text-slate-600 dark:text-slate-400';
            // Cập nhật màu cho Dark Mode
            if (c.charGrade.startsWith('A')) gradeColor = 'text-green-600 dark:text-green-400';
            else if (c.charGrade.startsWith('B')) gradeColor = 'text-blue-600 dark:text-blue-400';
            else if (c.charGrade.startsWith('C')) gradeColor = 'text-yellow-600 dark:text-yellow-400';
            else if (c.charGrade === 'F') gradeColor = 'text-red-500 dark:text-red-400';

            html += `
            <div class="group p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between rounded-lg animate-fade-in">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold ${gradeColor}">
                        ${c.charGrade}
                    </div>
                    <div>
                        <div class="text-sm font-medium text-slate-800 dark:text-slate-200">
                            Điểm 10: <span class="font-bold">${c.score10}</span>
                            <span class="mx-1 text-slate-300 dark:text-slate-600">|</span>
                            ${c.credits} TC
                        </div>
                        <div class="text-xs text-slate-500 dark:text-slate-400">Thang 4: ${c.gpa4}</div>
                    </div>
                </div>
                <div class="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button onclick="editCourse(${i})" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all" title="Sửa">
                        <i class="ph-bold ph-pencil-simple"></i>
                    </button>
                    <button onclick="requestDeleteCourse(${i})" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all" title="Xóa">
                        <i class="ph-bold ph-trash"></i>
                    </button>
                </div>
            </div>`;
        });
        listEl.innerHTML = html;
    }

    const stats = calculateTotal();
    document.getElementById('gpaDisplay').innerText = stats.gpa.toFixed(2);
    document.getElementById('totalCreditsDisplay').innerText = stats.credits;
    document.getElementById('rankDisplay').innerText = stats.rank;
}

// --- Utils & Init ---

function toggleGradeTable() {
    const modal = document.getElementById('gradeModal');
    const content = document.getElementById('gradeModalContent');
    
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        void modal.offsetWidth;
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
    } else {
        modal.classList.add('opacity-0');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
}

function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toastMessage');
    const iconEl = document.getElementById('toastIcon');

    msgEl.innerText = msg;
    
    if(type === 'error') {
        iconEl.className = 'ph-fill ph-warning-circle text-red-400 text-xl';
    } else {
        iconEl.className = 'ph-fill ph-check-circle text-green-400 text-xl';
    }

    toast.classList.remove('translate-y-20', 'opacity-0');
    
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// Khởi chạy khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    initTheme(); // Khởi tạo theme
    renderUI();
    
    document.getElementById('gradeModal').addEventListener('click', (e) => {
        if(e.target === document.getElementById('gradeModal')) toggleGradeTable();
    });
    document.getElementById('confirmModal').addEventListener('click', (e) => {
        if(e.target === document.getElementById('confirmModal')) closeConfirmModal();
    });
});