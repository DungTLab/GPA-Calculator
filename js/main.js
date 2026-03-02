// --- STATE & INITIAL DATA ---
let courses = JSON.parse(localStorage.getItem('gpa_courses_v2')) || [];
let pendingConfirmAction = null;

// Standard grading scale mapping
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

// --- THEME MANAGEMENT (LIGHT/DARK) ---
function initTheme() {
    // Check local storage or system preferences for dark mode
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
        icon.className = 'ph-fill ph-moon text-xl text-yellow-400';
    } else {
        icon.className = 'ph-fill ph-sun text-xl text-slate-600';
    }
}

// --- SCORE CALCULATION LOGIC ---
function convertScore(score10) {
    for (let grade of gradeMapping) {
        if (score10 >= grade.min && score10 <= grade.max) return grade;
    }
    // Fallback for edge cases (e.g. exactly 10 or 0)
    return score10 >= 9.0 ? gradeMapping[0] : gradeMapping[gradeMapping.length - 1];
}

function calculateTotal() {
    // Return default zero values if no courses exist
    if (courses.length === 0) return { gpa: 0, credits: 0, rank: '-' };

    let totalWeightedScore = 0;
    let totalCredits = 0;

    courses.forEach(c => {
        totalWeightedScore += c.gpa4 * c.credits;
        totalCredits += c.credits;
    });

    const gpa = totalCredits > 0 ? (totalWeightedScore / totalCredits) : 0;

    // Determine the rank based on GPA
    let rank = 'Kém';
    if (gpa >= 3.6) rank = 'Xuất sắc';
    else if (gpa >= 3.2) rank = 'Giỏi';
    else if (gpa >= 2.5) rank = 'Khá';
    else if (gpa >= 2.0) rank = 'Trung bình';

    return { gpa, credits: totalCredits, rank };
}

function saveData() {
    // Save to local storage and update the UI
    localStorage.setItem('gpa_courses_v2', JSON.stringify(courses));
    renderUI();
}

// --- FORM HANDLING (ADD/EDIT) ---
function handleFormSubmit(e) {
    e.preventDefault();

    const nameInput = document.getElementById('courseName');
    const scoreInput = document.getElementById('score10');
    const creditsInput = document.getElementById('credits');
    const editIndexInput = document.getElementById('editIndex');

    const name = nameInput.value.trim();
    const score = parseFloat(scoreInput.value);
    const credits = parseInt(creditsInput.value);
    const editIndex = parseInt(editIndexInput.value);

    // Validation
    if (isNaN(score) || score < 0 || score > 10) {
        showToast('Điểm hệ 10 phải từ 0 đến 10', 'error');
        return;
    }
    if (isNaN(credits) || credits < 1) {
        showToast('Tín chỉ phải lớn hơn 0', 'error');
        return;
    }

    const converted = convertScore(score);
    const courseData = {
        name: name || `Môn học ${courses.length + 1}`, // Default name if empty
        score10: score,
        credits: credits,
        charGrade: converted.char,
        gpa4: converted.gpa4,
        id: Date.now() // Unique ID
    };

    if (editIndex > -1) {
        // Update existing course
        courses[editIndex] = courseData;
        showToast('Đã cập nhật môn học!');
        cancelEdit();
    } else {
        // Add new course
        courses.push(courseData);
        showToast('Đã thêm thành công!');

        // Reset input fields
        nameInput.value = '';
        scoreInput.value = '';
        creditsInput.value = '';
        nameInput.focus(); // Keep focus for fast data entry
    }
    saveData();
}

// --- DELETE COURSE LOGIC ---
function requestDeleteCourse(index) {
    const courseName = courses[index].name;
    // Open confirmation modal before deleting
    openConfirmModal(`Bạn có chắc muốn xóa điểm môn "${courseName}" không?`, () => {
        courses.splice(index, 1);

        // If the user deletes the course they are currently editing, cancel the edit mode
        if (parseInt(document.getElementById('editIndex').value) === index) {
            cancelEdit();
        }
        saveData();
        showToast('Đã xóa môn học');
    });
}

function requestReset() {
    if (courses.length === 0) return;
    openConfirmModal('Toàn bộ bảng điểm sẽ bị xóa sạch. Bạn không thể hoàn tác!', () => {
        courses = [];
        cancelEdit();
        saveData();
        showToast('Đã làm mới bảng điểm');
    });
}

// --- EDIT COURSE LOGIC ---
function editCourse(index) {
    const course = courses[index];

    // Populate form fields with selected course data
    document.getElementById('courseName').value = course.name;
    document.getElementById('score10').value = course.score10;
    document.getElementById('credits').value = course.credits;
    document.getElementById('editIndex').value = index;

    // Update button appearance to indicate Edit mode
    const btn = document.getElementById('submitBtn');
    document.getElementById('submitText').innerText = 'Lưu thay đổi';
    btn.innerHTML = `<i class="ph-bold ph-check"></i> <span id="submitText">Lưu thay đổi</span>`;
    btn.classList.replace('bg-blue-600', 'bg-indigo-600');
    btn.classList.replace('hover:bg-blue-700', 'hover:bg-indigo-700');
    btn.classList.replace('dark:bg-blue-600', 'dark:bg-indigo-600');

    document.getElementById('cancelEditBtn').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll back to form
}

function cancelEdit() {
    // Reset form and hidden index input
    document.getElementById('courseForm').reset();
    document.getElementById('editIndex').value = "-1";

    // Restore button appearance to normal Add mode
    const btn = document.getElementById('submitBtn');
    btn.innerHTML = `<i class="ph-bold ph-plus"></i> <span id="submitText">Thêm môn</span>`;
    btn.classList.replace('bg-indigo-600', 'bg-blue-600');
    btn.classList.replace('hover:bg-indigo-700', 'hover:bg-blue-700');
    btn.classList.replace('dark:bg-indigo-600', 'dark:bg-blue-600');

    document.getElementById('cancelEditBtn').classList.add('hidden');
}

// --- UI RENDERING ---
function renderUI() {
    const listEl = document.getElementById('courseList');
    const resultCard = document.getElementById('resultCard');
    const countBadge = document.getElementById('courseCountBadge');

    countBadge.innerText = courses.length;

    if (courses.length === 0) {
        // Display empty state placeholder
        listEl.innerHTML = `
                    <tr>
                        <td colspan="6" class="px-4 py-12 text-center">
                            <div class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 animate-fade-in">
                                <i class="ph-duotone ph-notebook text-6xl mb-3 text-slate-300 dark:text-slate-600"></i>
                                <p class="font-medium text-lg text-slate-500 dark:text-slate-400">Chưa có môn học nào</p>
                                <p class="text-sm mt-1">Nhập thông tin ở bảng bên trái để bắt đầu</p>
                            </div>
                        </td>
                    </tr>`;
        resultCard.classList.add('hidden');
    } else {
        resultCard.classList.remove('hidden');
        let html = '';
        courses.forEach((c, i) => {
            // Determine background color based on the letter grade
            let gradeBg = 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
            if (c.charGrade.startsWith('A')) gradeBg = 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
            else if (c.charGrade.startsWith('B')) gradeBg = 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
            else if (c.charGrade.startsWith('C')) gradeBg = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400';
            else if (c.charGrade === 'F') gradeBg = 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';

            // Build table row HTML
            html += `
                    <tr class="group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors animate-fade-in border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                        <td class="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200 truncate max-w-[150px] sm:max-w-[200px]" title="${c.name}">
                            ${c.name}
                        </td>
                        <td class="px-4 py-3.5 text-center text-slate-600 dark:text-slate-400">
                            ${c.credits}
                        </td>
                        <td class="px-4 py-3.5 text-center font-semibold text-slate-700 dark:text-slate-200">
                            ${c.score10}
                        </td>
                        <td class="px-4 py-3.5 text-center">
                            <span class="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${gradeBg}">
                                ${c.charGrade}
                            </span>
                        </td>
                        <td class="px-4 py-3.5 text-center text-slate-600 dark:text-slate-400">
                            ${c.gpa4}
                        </td>
                        <td class="px-4 py-3.5 text-right">
                            <div class="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                <button onclick="editCourse(${i})" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 dark:hover:text-blue-400 rounded-lg transition-all" title="Sửa môn này">
                                    <i class="ph-bold ph-pencil-simple text-lg"></i>
                                </button>
                                <button onclick="requestDeleteCourse(${i})" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 dark:hover:text-red-400 rounded-lg transition-all" title="Xóa môn này">
                                    <i class="ph-bold ph-trash text-lg"></i>
                                </button>
                            </div>
                        </td>
                    </tr>`;
        });
        listEl.innerHTML = html;
    }

    // Update statistics display
    const stats = calculateTotal();
    document.getElementById('gpaDisplay').innerText = stats.gpa.toFixed(2);
    document.getElementById('totalCreditsDisplay').innerText = stats.credits;
    document.getElementById('rankDisplay').innerText = stats.rank;
}

// --- UTILITY FUNCTIONS (MODALS & TOAST) ---

function openConfirmModal(msg, action) {
    document.getElementById('confirmMessage').innerText = msg;
    pendingConfirmAction = action; // Store the callback
    const modal = document.getElementById('confirmModal');
    const content = document.getElementById('confirmModalContent');

    modal.classList.remove('hidden');
    void modal.offsetWidth; // Force reflow for animation
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
        pendingConfirmAction = null; // Clear callback
    }, 300); // Wait for transition to finish
}

function executeConfirmAction() {
    if (pendingConfirmAction) pendingConfirmAction();
    closeConfirmModal();
}

function toggleGradeTable() {
    const modal = document.getElementById('gradeModal');
    const content = document.getElementById('gradeModalContent');

    if (modal.classList.contains('hidden')) {
        // Open Modal
        modal.classList.remove('hidden');
        void modal.offsetWidth;
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
    } else {
        // Close Modal
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

    // Change icon and color based on notification type
    if (type === 'error') {
        iconEl.className = 'ph-fill ph-warning-circle text-red-400 text-xl';
    } else {
        iconEl.className = 'ph-fill ph-check-circle text-green-400 text-xl';
    }

    // Show toast
    toast.classList.remove('translate-y-20', 'opacity-0');

    // Auto hide after 2.5 seconds
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 2500);
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderUI();

    // Close modals when clicking outside the content area
    document.getElementById('gradeModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('gradeModal')) toggleGradeTable();
    });
    document.getElementById('confirmModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('confirmModal')) closeConfirmModal();
    });
});