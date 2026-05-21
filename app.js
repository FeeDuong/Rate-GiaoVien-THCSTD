/* eslint-disable */
/**
 * 🎯 APP.JS V4 - TÂN DÂN HUB (BẢN UPDATE FULL 53 HỌC SINH 8A1 TỪ EXCEL)
 */

const SUPABASE_URL = "https://ymqojrhnllaphkuhbcml.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltcW9qcmhubGxhcGhrdWhiY21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjE4MzIsImV4cCI6MjA5NDgzNzgzMn0.q9C7cviN2cFt-0zwtqkV44ieewVp0wuNmLaxvBJ438c";

const mySupabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 🔥 FULL DANH SÁCH 53 CHIẾN THẦN LỚP 8A1 TRÍCH XUẤT CHUẨN TỪ EXCEL CỦA CON
const STUDENT_DATABASE = [
    { name: "Nguyễn Quốc An", class: "8A1" }, [cite: 1]
    { name: "Dương Quỳnh Anh", class: "8A1" }, [cite: 1]
    { name: "Vũ Phương Anh", class: "8A1" }, [cite: 1]
    { name: "Tạ Khánh Băng", class: "8A1" }, [cite: 1]
    { name: "Hoàng Quỳnh Chi", class: "8A1" }, [cite: 1]
    { name: "Đỗ Linh Đan", class: "8A1" }, [cite: 1]
    { name: "Nguyễn Hoàng Dương", class: "8A1" }, [cite: 1]
    { name: "Nguyễn Hoàng Phi Dương", class: "8A1" }, [cite: 1]
    { name: "Nguyễn Thái Bình Dương", class: "8A1" }, [cite: 1]
    { name: "Phùng Ánh Dương", class: "8A1" }, [cite: 1]
    { name: "Bùi Ngân Giang", class: "8A1" }, [cite: 1]
    { name: "Đỗ Hương Giang", class: "8A1" }, [cite: 1]
    { name: "Nguyễn Hà Giang", class: "8A1" }, [cite: 1]
    { name: "Nguyễn Thị Trà Giang", class: "8A1" }, [cite: 1]
    { name: "Đỗ Hoàng Hải", class: "8A1" }, [cite: 1]
    { name: "Nguyễn Văn Hải", class: "8A1" }, [cite: 1]
    { name: "Dương Trung Hiếu", class: "8A1" }, [cite: 1]
    { name: "Ngô Duy Hưng", class: "8A1" }, [cite: 1]
    { name: "Dương Tuấn Huy", class: "8A1" }, [cite: 2]
    { name: "Nguyễn Ngọc Huy", class: "8A1" }, [cite: 2]
    { name: "Nguyễn Bảo Khánh", class: "8A1" }, [cite: 2]
    { name: "Phùng Duy Khánh", class: "8A1" }, [cite: 2]
    { name: "Phạm Nhật Trung Kiên", class: "8A1" }, [cite: 2]
    { name: "Ngô Duy Lân", class: "8A1" }, [cite: 2]
    { name: "Tăng Ngọc Linh", class: "8A1" }, [cite: 2]
    { name: "Phạm Nguyễn Hải Long", class: "8A1" }, [cite: 2]
    { name: "Hà Tuyết Mai", class: "8A1" }, [cite: 2]
    { name: "Nguyễn Hải Minh", class: "8A1" }, [cite: 2]
    { name: "Nguyễn Nguyệt Minh", class: "8A1" }, [cite: 2]
    { name: "Bùi Trà My", class: "8A1" }, [cite: 2]
    { name: "Đỗ Diễm Thảo My", class: "8A1" }, [cite: 2]
    { name: "Nguyễn Ngọc Trà My", class: "8A1" }, [cite: 2]
    { name: "Nguyễn Hải Nam", class: "8A1" }, [cite: 2]
    { name: "Nguyễn Nhật Nam", class: "8A1" }, [cite: 2]
    { name: "Bùi Kim Ngân", class: "8A1" }, [cite: 2]
    { name: "Bùi Thị Minh Ngọc", class: "8A1" }, [cite: 2]
    { name: "Dương Tâm Ngọc", class: "8A1" }, [cite: 2]
    { name: "Hoàng Như Ngọc", class: "8A1" }, [cite: 2]
    { name: "Tạ Hoàng Minh Ngọc", class: "8A1" }, [cite: 2]
    { name: "Nguyễn Thị Tuyết Nhung", class: "8A1" }, [cite: 2]
    { name: "Phùng Nhất Phi", class: "8A1" }, [cite: 2]
    { name: "Phùng Hải Phong", class: "8A1" }, [cite: 3]
    { name: "Vũ Tuấn Phong", class: "8A1" }, [cite: 3]
    { name: "Dương Hoàng Quân", class: "8A1" }, [cite: 3]
    { name: "Nguyễn Minh Quân (19/11)", class: "8A1" }, // Sư phụ phân biệt theo ngày sinh cho con dễ nhìn [cite: 3]
    { name: "Nguyễn Minh Quân (30/10)", class: "8A1" }, // Tránh trùng tên lộn phốt [cite: 3]
    { name: "Đỗ Hải Thanh", class: "8A1" }, // [cite: 3]
    { name: "Bùi Anh Thư", class: "8A1" }, // [cite: 3]
    { name: "Vũ Thu Thủy", class: "8A1" }, // [cite: 3]
    { name: "Phùng Minh Trang", class: "8A1" }, // [cite: 3]
    { name: "Nguyễn Tuấn Tú", class: "8A1" }, // [cite: 3]
    { name: "Nguyễn Minh Tuấn", class: "8A1" }, // [cite: 3]
    { name: "Phùng Mạnh Tùng", class: "8A1" } // [cite: 3]
];

// TAB SWITCHING ELEMENTS
const tabTeacherBtn = document.getElementById("tabTeacherBtn");
const tabStudentBtn = document.getElementById("tabStudentBtn");
const sectionTeacher = document.getElementById("sectionTeacher");
const sectionStudent = document.getElementById("sectionStudent");

// TAB SWITCHING LOGIC
tabTeacherBtn.addEventListener("click", () => {
    tabTeacherBtn.className = "flex-1 py-2 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg";
    tabStudentBtn.className = "flex-1 py-2 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer text-gray-400 hover:text-white";
    sectionTeacher.classList.remove("hidden");
    sectionStudent.classList.add("hidden");
});

tabStudentBtn.addEventListener("click", () => {
    tabStudentBtn.className = "flex-1 py-2 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg";
    tabTeacherBtn.className = "flex-1 py-2 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer text-gray-400 hover:text-white";
    sectionStudent.classList.remove("hidden");
    sectionTeacher.classList.add("hidden");
    loadStudentReviews();
});


// ================= PART 1: LOGIC GIÁO VIÊN V2 (CHẠY ĐÉT) =================
const teacherSelect = document.getElementById("teacherSelect");
const submitBtn = document.getElementById("submitBtn");
const reviewComment = document.getElementById("reviewComment");
const reviewsContainer = document.getElementById("reviewsContainer");
const statsContainer = document.getElementById("statsContainer");
const ratingDisplay = document.getElementById("ratingDisplay");
const nameInputWrapper = document.getElementById("nameInputWrapper");
const studentNameInput = document.getElementById("studentName");
let currentRating = 0;

document.querySelectorAll(".star").forEach(star => {
    star.addEventListener("click", (e) => {
        currentRating = parseInt(e.target.getAttribute("data-value"));
        ratingDisplay.innerText = `${currentRating}/10★`;
        updateStars(currentRating);
    });
    star.addEventListener("mouseenter", (e) => {
        updateStars(parseInt(e.target.getAttribute("data-value")));
    });
    star.addEventListener("mouseleave", () => {
        updateStars(currentRating);
    });
});

function updateStars(rating) {
    document.querySelectorAll(".star").forEach(star => {
        const val = parseInt(star.getAttribute("data-value"));
        star.style.color = val <= rating ? "#fbbf24" : "#4b5563";
        star.style.transform = val <= rating ? "scale(1.2)" : "scale(1.0)";
    });
}

document.querySelectorAll('input[name="identityMode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'public') nameInputWrapper.classList.remove('hidden');
        else { nameInputWrapper.classList.add('hidden'); studentNameInput.value = ""; }
    });
});

submitBtn.addEventListener("click", async () => {
    const teacherName = teacherSelect.value;
    const commentText = reviewComment.value.trim();
    const identityMode = document.querySelector('input[name="identityMode"]:checked').value;
    let displayName = "🕵️ Học Sinh Ẩn Danh";
    
    if (identityMode === 'public') {
        const inputName = studentNameInput.value.trim();
        if (!inputName) return alert("🚨 Phải điền tên vào con trai ơi!");
        displayName = `😎 ${inputName}`;
    }
    if (!teacherName || currentRating === 0 || !commentText) return alert("🚨 Điền đủ thông tin đã con!");

    submitBtn.disabled = true;
    submitBtn.innerText = "⚡ Đang đồng bộ...";
    try {
        const finalComment = `[${displayName}] ${commentText}`;
        const { error } = await mySupabase.from('teacher_reviews').insert([{ teacher_name: teacherName, rating: currentRating, comment: finalComment }]);
        if (error) throw error;
        alert("🎉 Chấm điểm giáo viên thành công rực rỡ!");
        reviewComment.value = ""; studentNameInput.value = ""; currentRating = 0;
        ratingDisplay.innerText = "0/10★"; updateStars(0);
        await loadReviewsAndStats();
    } catch (e) { alert("🚨 Lỗi: " + e.message); }
    finally { submitBtn.disabled = false; submitBtn.innerText = "Gửi Đánh Giá Ngay"; }
});

async function loadReviewsAndStats() {
    try {
        const { data: reviews, error } = await mySupabase.from('teacher_reviews').select('*').order('id', { ascending: false });
        if (error) throw error;
        reviewsContainer.innerHTML = ""; statsContainer.innerHTML = "";
        if (!reviews || reviews.length === 0) return;

        const stats = {};
        reviews.forEach(r => {
            if (!stats[r.teacher_name]) stats[r.teacher_name] = { totalRating: 0, count: 0 };
            stats[r.teacher_name].totalRating += r.rating;
            stats[r.teacher_name].count += 1;
        });

        for (const [name, info] of Object.entries(stats)) {
            const avg = (info.totalRating / info.count).toFixed(1);
            statsContainer.innerHTML += `<div class="bg-gray-800 p-3 rounded-xl border border-gray-700 flex justify-between items-center mb-1"><span class="font-bold text-gray-200">${name}</span><span class="bg-gradient-to-r from-amber-500 to-orange-500 text-gray-950 px-2.5 py-1 rounded-lg text-xs font-black">⭐ ${avg}/10 (${info.count} lượt)</span></div>`;
        }

        reviews.forEach(r => {
            let sender = "🕵️ Học Sinh Ẩn Danh", pureComment = r.comment || "";
            if (pureComment.startsWith("[")) {
                const idx = pureComment.indexOf("]");
                if (idx !== -1) { sender = pureComment.substring(1, idx); pureComment = pureComment.substring(idx + 1).trim(); }
            }
            const isAnon = sender.includes("Ẩn Danh");
            const badgeClass = isAnon ? "bg-orange-950 text-orange-400 border border-orange-900" : "bg-green-950 text-green-400 border border-green-900";
            reviewsContainer.innerHTML += `<div class="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg mb-3"><div class="flex justify-between items-center mb-2"><span class="text-xs px-2.5 py-1 rounded-md font-bold ${badgeClass}">${sender}</span></div><p class="text-xs text-gray-400 mb-1">Đánh giá giáo viên: <span class="text-white font-medium">${r.teacher_name}</span></p><div class="text-yellow-500 text-xs font-black mb-2">Đã chấm: ${r.rating}/10 ★</div><p class="text-gray-200 text-sm italic bg-gray-950 p-3 rounded-lg border-l-4 border-orange-500">"${pureComment}"</p></div>`;
        });
    } catch (error) { console.error(error); }
}


// ================= PART 2: LOGIC KHEN/PHỐT HỌC SINH (AUTOCOMPLETE) =================
const studentFormCard = document.getElementById("studentFormCard");
const targetStudentSearch = document.getElementById("targetStudentSearch");
const targetStudentClass = document.getElementById("targetStudentClass");
const searchSuggestions = document.getElementById("searchSuggestions");
const studentComment = document.getElementById("studentComment");
const submitStudentBtn = document.getElementById("submitStudentBtn");
const studentReviewsContainer = document.getElementById("studentReviewsContainer");
const totalKhenCount = document.getElementById("totalKhenCount");
const totalPhotCount = document.getElementById("totalPhotCount");

document.querySelectorAll('input[name="postType"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
        if (e.target.value === "khen") {
            studentFormCard.className = "md:col-span-1 bg-gray-900 p-6 rounded-2xl border border-cyan-800/50 shadow-2xl h-fit space-y-5 transition-all duration-300 shadow-cyan-950/20";
            submitStudentBtn.className = "w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg cursor-pointer";
            submitStudentBtn.innerText = "Đăng Tin Lên Bảng Vàng";
        } else {
            studentFormCard.className = "md:col-span-1 bg-gray-900 p-6 rounded-2xl border border-red-800/50 shadow-2xl h-fit space-y-5 transition-all duration-300 shadow-red-950/20";
            submitStudentBtn.className = "w-full bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg cursor-pointer";
            submitStudentBtn.innerText = "Nổ Phốt Lên Bảng Tin";
        }
    });
});

targetStudentSearch.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase().trim();
    searchSuggestions.innerHTML = "";
    if (!value) { searchSuggestions.classList.add("hidden"); return; }

    const matches = STUDENT_DATABASE.filter(s => s.name.toLowerCase().includes(value));
    if (matches.length === 0) { searchSuggestions.classList.add("hidden"); return; }

    matches.forEach(match => {
        const div = document.createElement("div");
        div.className = "p-2.5 text-sm hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700/50 flex justify-between";
        div.innerHTML = `<span class="text-white font-medium">${match.name}</span><span class="text-gray-400 text-xs">Lớp ${match.class}</span>`;
        div.addEventListener("click", () => {
            targetStudentSearch.value = match.name;
            targetStudentClass.value = match.class;
            searchSuggestions.classList.add("hidden");
        });
        searchSuggestions.appendChild(div);
    });
    searchSuggestions.classList.remove("hidden");
});

document.addEventListener("click", (e) => {
    if (e.target !== targetStudentSearch) searchSuggestions.classList.add("hidden");
});

submitStudentBtn.addEventListener("click", async () => {
    const sName = targetStudentSearch.value.trim();
    const sClass = targetStudentClass.value.trim();
    const sComment = studentComment.value.trim();
    const sType = document.querySelector('input[name="postType"]:checked').value;

    if (!sName || !sClass || !sComment) return alert("🚨 Con trai nhập thiếu thông tin học sinh kìa!");

    submitStudentBtn.disabled = true;
    submitStudentBtn.innerText = "⚡ Đang xử lý tin đồn...";

    try {
        const { error } = await mySupabase
            .from('student_reviews')
            .insert([{ student_name: sName, student_class: sClass, type: sType, comment: sComment }]);

        if (error) throw error;

        alert(sType === 'khen' ? "😇 Đã đăng lời khen ngợi lên bảng vàng!" : "🔥 Phốt đã được nổ thành công trên bảng tin!");
        targetStudentSearch.value = "";
        targetStudentClass.value = "";
        studentComment.value = "";
        await loadStudentReviews();
    } catch (e) {
        alert("🚨 Lỗi gửi tin học sinh: " + e.message);
    } finally {
        submitStudentBtn.disabled = false;
        submitStudentBtn.innerText = sType === 'khen' ? "Đăng Tin Lên Bảng Vàng" : "Nổ Phốt Lên Bảng Tin";
    }
});

async function loadStudentReviews() {
    try {
        const { data: posts, error } = await mySupabase
            .from('student_reviews')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;

        studentReviewsContainer.innerHTML = "";
        let khenCount = 0;
        let photCount = 0;

        if (!posts || posts.length === 0) {
            studentReviewsContainer.innerHTML = `<p class="text-gray-500 text-center py-8">Trường học đang yên bình... Chưa có ai bị bóc phốt hay được khen!</p>`;
            totalKhenCount.innerText = "Khen: 0";
            totalPhotCount.innerText = "Phốt: 0";
            return;
        }

        posts.forEach(p => {
            if (p.type === 'khen') khenCount++; else photCount++;

            const isKhen = p.type === 'khen';
            const cardBorder = isKhen ? "border-cyan-900 bg-gray-900" : "border-red-950 bg-gray-900";
            const badgeClass = isKhen ? "bg-cyan-950 text-cyan-400 border border-cyan-800" : "bg-red-950 text-red-400 border border-red-900";
            const tagIcon = isKhen ? "😇 BẢNG VÀNG TUYÊN DƯƠNG" : "🔥 TIN PHỐT KHẨN CẤP";
            const quoteBorder = isKhen ? "border-cyan-500" : "border-red-500";

            studentReviewsContainer.innerHTML += `
                <div class="p-5 rounded-2xl border ${cardBorder} shadow-xl relative overflow-hidden transition-all hover:scale-[1.01]">
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-[10px] tracking-wider px-2.5 py-1 rounded-md font-black ${badgeClass}">${tagIcon}</span>
                        <span class="text-xs text-gray-500 font-mono">#ID-${p.id}</span>
                    </div>
                    <div class="mb-2">
                        <h3 class="text-lg font-black text-white inline-block mr-2">${p.student_name}</h3>
                        <span class="px-2 py-0.5 text-xs font-bold bg-gray-800 text-gray-300 rounded-md border border-gray-700">Lớp ${p.student_class}</span>
                    </div>
                    <p class="text-gray-200 text-sm italic bg-gray-950 p-3 rounded-xl border-l-4 ${quoteBorder} font-medium mt-3">
                        "${p.comment}"
                    </p>
                </div>
            `;
        });

        totalKhenCount.innerText = `Khen: ${khenCount}`;
        totalPhotCount.innerText = `Phốt: ${photCount}`;

    } catch (e) {
        console.error("Lỗi tải tin học sinh:", e);
    }
}

// KHỞI CHẠY
window.addEventListener("DOMContentLoaded", loadReviewsAndStats);