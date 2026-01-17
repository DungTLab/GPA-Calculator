let courses = []; // Mảng để lưu trữ các môn học
const gradeMapping = {
    // Ánh xạ điểm hệ 10 sang điểm hệ 4 và điểm chữ dựa trên ảnh
    // Xếp loại: Xuất sắc
    '9.0-10.0': { char: 'A+', gpa4: 4.0 },
    // Xếp loại: Giỏi
    '8.5-9.0': { char: 'A', gpa4: 3.75 },
    '8.0-8.5': { char: 'A-', gpa4: 3.5 },
    // Xếp loại: Khá
    '7.5-8.0': { char: 'B+', gpa4: 3.25 },
    '7.0-7.5': { char: 'B', gpa4: 3.0 },
    // Xếp loại: Trung bình khá
    '6.5-7.0': { char: 'B-', gpa4: 2.75 },
    '6.0-6.5': { char: 'C+', gpa4: 2.5 },
    // Xếp loại: Trung bình
    '5.5-6.0': { char: 'C', gpa4: 2.25 },
    '5.0-5.5': { char: 'C-', gpa4: 2.0 },
    // Xếp loại: Không đạt
    '0.0-5.0': { char: 'F', gpa4: 0.0 } // Dưới 5.0 là F
};

/**
 * Chuyển đổi điểm hệ 10 sang điểm hệ 4 và điểm chữ.
 * @param {number} score10 - Điểm hệ 10.
 * @returns {object} - Đối tượng chứa điểm chữ (char) và điểm hệ 4 (gpa4).
 */
function convertScore(score10) {
    if (score10 >= 9.0 && score10 <= 10.0) return gradeMapping['9.0-10.0'];
    if (score10 >= 8.5 && score10 < 9.0) return gradeMapping['8.5-9.0'];
    if (score10 >= 8.0 && score10 < 8.5) return gradeMapping['8.0-8.5'];
    if (score10 >= 7.5 && score10 < 8.0) return gradeMapping['7.5-8.0'];
    if (score10 >= 7.0 && score10 < 7.5) return gradeMapping['7.0-7.5'];
    if (score10 >= 6.5 && score10 < 7.0) return gradeMapping['6.5-7.0'];
    if (score10 >= 6.0 && score10 < 6.5) return gradeMapping['6.0-6.5'];
    if (score10 >= 5.5 && score10 < 6.0) return gradeMapping['5.5-6.0'];
    if (score10 >= 5.0 && score10 < 5.5) return gradeMapping['5.0-5.5'];
    return gradeMapping['0.0-5.0']; // Dưới 5.0 là F
}

/**
 * Thêm một môn học mới vào danh sách.
 */
function addCourse() {
    console.log('addCourse() được gọi.'); // Debug: Hàm được gọi
    const score10Input = document.getElementById('score10');
    const creditsInput = document.getElementById('credits');

    const score10 = parseFloat(score10Input.value);
    const credits = parseInt(creditsInput.value);

    // Kiểm tra đầu vào hợp lệ
    if (isNaN(score10) || score10 < 0 || score10 > 10) {
        showMessage('Vui lòng nhập điểm hệ 10 hợp lệ (từ 0 đến 10).');
        console.log('Lỗi: Điểm hệ 10 không hợp lệ.'); // Debug: Lỗi đầu vào
        return;
    }
    if (isNaN(credits) || credits < 1) {
        showMessage('Vui lòng nhập số tín chỉ hợp lệ (ít nhất 1).');
        console.log('Lỗi: Số tín chỉ không hợp lệ.'); // Debug: Lỗi đầu vào
        return;
    }

    const converted = convertScore(score10);
    const course = {
        score10: score10,
        credits: credits,
        charGrade: converted.char,
        gpa4: converted.gpa4
    };
    courses.push(course);
    console.log('Môn học đã thêm:', course); // Debug: Môn học được thêm vào mảng
    console.log('Mảng courses hiện tại:', courses); // Debug: Trạng thái mảng courses

    renderCourseList();

    // Xóa giá trị trong ô input sau khi thêm
    score10Input.value = '';
    creditsInput.value = '';
    score10Input.focus(); // Tập trung vào ô điểm để nhập môn tiếp theo
    hideMessage(); // Ẩn thông báo nếu có
}

/**
 * Hiển thị danh sách các môn học đã thêm.
 */
function renderCourseList() {
    console.log('renderCourseList() được gọi. Số môn học:', courses.length); // Debug: Hàm được gọi
    const courseListDiv = document.getElementById('courseList');
    const noCoursesMessage = document.getElementById('noCoursesMessage');

    // Xóa tất cả các mục môn học hiện có, giữ lại thẻ thông báo "noCoursesMessage"
    // Lặp ngược để xóa các phần tử một cách an toàn trong khi lặp
    for (let i = courseListDiv.children.length - 1; i >= 0; i--) {
        const child = courseListDiv.children[i];
        if (child.classList.contains('course-item')) {
            courseListDiv.removeChild(child);
        }
    }

    if (courses.length === 0) {
        noCoursesMessage.classList.remove('hidden'); // Hiển thị thông báo
        console.log('Không có môn học nào, hiển thị thông báo.'); // Debug: Không có môn học
    } else {
        noCoursesMessage.classList.add('hidden'); // Ẩn thông báo
        courses.forEach((course, index) => {
            const courseItem = document.createElement('div');
            courseItem.className = 'course-item'; // Thêm class này để dễ dàng nhận diện và xóa sau này
            courseItem.innerHTML = `
                <div class="course-details">
                    <div>Điểm hệ 10: <span>${course.score10.toFixed(2)}</span></div>
                    <div>Tín chỉ: <span>${course.credits}</span></div>
                    <div>Điểm chữ: <span>${course.charGrade}</span></div>
                    <div>Điểm hệ 4: <span>${course.gpa4.toFixed(2)}</span></div>
                </div>
                <button class="delete-button" onclick="deleteCourse(${index})">Xóa</button>
            `;
            // Thêm mục môn học mới vào cuối danh sách
            courseListDiv.appendChild(courseItem);
            console.log('Đã thêm môn học vào DOM:', course); // Debug: Môn học được thêm vào DOM
        });
    }
}

/**
 * Xóa một môn học khỏi danh sách.
 * @param {number} index - Chỉ số của môn học cần xóa.
 */
function deleteCourse(index) {
    console.log('deleteCourse() được gọi. Xóa môn học tại chỉ số:', index); // Debug: Hàm được gọi
    courses.splice(index, 1); // Xóa môn học khỏi mảng
    renderCourseList(); // Cập nhật lại danh sách hiển thị
    // Nếu không còn môn học nào, ẩn kết quả GPA
    if (courses.length === 0) {
        document.getElementById('result').classList.add('hidden');
    }
    console.log('Mảng courses sau khi xóa:', courses); // Debug: Trạng thái mảng courses
}

/**
 * Tính toán điểm GPA.
 */
function calculateGPA() {
    console.log('calculateGPA() được gọi.'); // Debug: Hàm được gọi
    if (courses.length === 0) {
        showMessage('Vui lòng thêm ít nhất một môn học để tính GPA.');
        console.log('Lỗi: Không có môn học để tính GPA.'); // Debug: Lỗi tính toán
        return;
    }

    let totalWeightedScore = 0;
    let totalCredits = 0;

    courses.forEach(course => {
        totalWeightedScore += course.gpa4 * course.credits;
        totalCredits += course.credits;
    });

    let gpa = 0;
    if (totalCredits > 0) {
        gpa = totalWeightedScore / totalCredits;
    }

    displayResult(gpa.toFixed(2)); // Làm tròn đến 2 chữ số thập phân
    hideMessage(); // Ẩn thông báo nếu có
    console.log('GPA đã tính:', gpa.toFixed(2)); // Debug: Kết quả GPA
}

/**
 * Hiển thị kết quả GPA.
 * @param {string} gpa - Điểm GPA đã tính.
 */
function displayResult(gpa) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `Điểm GPA của bạn là: <span class="text-blue-700">${gpa}</span>`;
    resultDiv.classList.remove('hidden');
}

/**
 * Đặt lại máy tính GPA về trạng thái ban đầu.
 */
function resetCalculator() {
    console.log('resetCalculator() được gọi.'); // Debug: Hàm được gọi
    courses = []; // Xóa tất cả môn học
    renderCourseList(); // Cập nhật lại danh sách hiển thị
    document.getElementById('result').classList.add('hidden'); // Ẩn kết quả
    document.getElementById('score10').value = '';
    document.getElementById('credits').value = '';
    hideMessage(); // Ẩn thông báo nếu có
}

/**
 * Hiển thị thông báo lỗi hoặc hướng dẫn.
 * @param {string} message - Nội dung thông báo.
 */
function showMessage(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<p class="text-red-600 font-normal">${message}</p>`;
    resultDiv.classList.remove('hidden');
    resultDiv.style.backgroundColor = '#fee2e2'; // Light red background for messages
    resultDiv.style.borderColor = '#fca5a5'; // Red border
}

/**
 * Ẩn thông báo.
 */
function hideMessage() {
    const resultDiv = document.getElementById('result');
    // Đặt lại màu nền và viền về mặc định nếu không phải là thông báo lỗi
    if (resultDiv.style.backgroundColor === 'rgb(254, 226, 226)') { // Check for the red background
        resultDiv.style.backgroundColor = '#e0f2fe';
        resultDiv.style.borderColor = '#90cdf4';
    }
}

// Khởi tạo danh sách môn học khi tải trang
document.addEventListener('DOMContentLoaded', renderCourseList);
