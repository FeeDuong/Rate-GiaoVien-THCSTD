/**
 * 🎯 APP.JS V2 - THANG ĐIỂM 10★ & TÙY CHỌN DANH TÍNH CHUẨN ĐÉT
 */

const SUPABASE_URL = "https://ymqojrhnallaphkuhbcml.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltcW9qcmhubGxhcGhrdWhiY21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjE4MzIsImV4cCI6MjA5NDgzNzgzMn0.q9C7cviN2cFt-0zwtqkV44ieewVp0wuNmLaxvBJ438c"; 

// Khởi tạo Client bằng thư viện UMD chống lỗi CORS hoàn toàn
const mySupabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const teacherSelect = document.getElementById("teacherSelect");
const submitBtn = document.getElementById("submitBtn");
const reviewComment = document.getElementById("reviewComment");
const reviewsContainer = document.getElementById("reviewsContainer");
const statsContainer = document.getElementById("statsContainer");
const ratingDisplay = document.getElementById("ratingDisplay");
const nameInputWrapper = document.getElementById("nameInputWrapper");
const studentNameInput = document.getElementById("studentName");

let currentRating = 0;

// LOGIC HIỆN/ẨN Ô NHẬP TÊN KHI CHỌN DANH TÍNH
document.querySelectorAll('input[name="identityMode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'public') {
            nameInputWrapper.classList.remove('hidden');
        } else {
            nameInputWrapper.classList.add('hidden');
            studentNameInput.value = ""; // Xóa tên cũ nếu chuyển lại ẩn danh
        }
    });
});

// XỬ LÝ CLICK CHỌN 10 SAO VÀ ĐỔI MÀU MƯỢT MÀ
document.querySelectorAll(".star").forEach(star => {
    star.addEventListener("click", (e) => {
        currentRating = parseInt(e.target.getAttribute("data-value"));
        ratingDisplay.innerText = `${currentRating}/10★`;
        updateStars(currentRating);
    });
});

function updateStars(rating) {
    document.querySelectorAll(".star").forEach(star => {
        const val = parseInt(star.getAttribute("data-value"));
        if (val <= rating) {
            star.style.color = "#eab308"; // Vàng đậm hệ 10 sao
        } else {
            star.style.color = "#374151"; // Xám tối
        }
    });
}

// THUẬT TOÁN GỬI DỮ LIỆU LÊN SUPABASE
submitBtn.addEventListener("click", async () => {
    const teacherName = teacherSelect.value;
    const commentText = reviewComment.value.trim();
    
    // Xử lý logic tên danh tính
    const identityMode = document.querySelector('input[name="identityMode"]:checked').value;
    let displayName = "🕵️ Học Sinh Ẩn Danh";
    
    if (identityMode === 'public') {
        const inputName = studentNameInput.value.trim();
        if (!inputName) {
            alert("🚨 Con đã chọn chế độ Hiện tên thì phải nhập tên vào nhé!");
            return;
        }
        displayName = `😎 ${inputName}`;
    }

    // Kiểm tra chống đạn
    if (!teacherName) {
        alert("🚨 Con chưa chọn giáo viên kìa!");
        return;
    }
    if (currentRating === 0) {
        alert("🚨 Hãy bấm chọn số sao (từ 1 đến 10 sao) đã con trai!");
        return;
    }
    if (!commentText) {
        alert("🚨 Viết vài chữ bình luận đã rồi hãy gửi!");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "⚡ Đang đồng bộ lên mây...";

    try {
        // MẸO HỆ CHIẾN: Gộp cái Tên vào chung với chuỗi comment để khỏi sửa cấu trúc bảng Supabase cũ!
        // Chuỗi lưu xuống database sẽ có dạng: "[Tên Người Gửi] Nội dung bình luận"
        const finalComment = `[${displayName}] ${commentText}`;

        const { data, error } = await mySupabase
            .from('teacher_reviews')
            .insert([
                { 
                    teacher_name: teacherName, 
                    rating: currentRating, 
                    comment: finalComment
                }
            ]);

        if (error) throw error;

        alert("🎉 Đánh giá hệ 10 sao thành công rực rỡ vcl!");
        reviewComment.value = "";
        studentNameInput.value = "";
        currentRating = 0;
        ratingDisplay.innerText = "0/10★";
        updateStars(0);
        
        await loadReviewsAndStats();

    } catch (error) {
        console.error("Lỗi gửi:", error);
        alert("🚨 Lỗi kết nối Supabase! Chi tiết: " + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Gửi Đánh Giá Ngay";
    }
});

// THUẬT TOÁN LOAD DATA VÀ TỰ ĐỘNG TÁCH TÊN + TÍNH ĐIỂM HỆ 10
async function loadReviewsAndStats() {
    try {
        const { data: reviews, error } = await mySupabase
            .from('teacher_reviews')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;

        reviewsContainer.innerHTML = "";
        
        if (!reviews || reviews.length === 0) {
            reviewsContainer.innerHTML = `<p class="text-gray-500 text-center py-4">Chưa có đánh giá nào. Hãy phá băng hệ 10 sao đi con trai!</p>`;
            return;
        }

        // Tính điểm trung bình tổng
        const stats = {};
        reviews.forEach(r => {
            if (!stats[r.teacher_name]) {
                stats[r.teacher_name] = { totalRating: 0, count: 0 };
            }
            stats[r.teacher_name].totalRating += r.rating;
            stats[r.teacher_name].count += 1;
        });

        // Vẽ bảng điểm top giáo viên lên màn hình
        statsContainer.innerHTML = "";
        for (const [name, info] of Object.entries(stats)) {
            const avg = (info.totalRating / info.count).toFixed(1);
            statsContainer.innerHTML += `
                <div class="bg-gray-800 p-3 rounded-xl border border-gray-700 flex justify-between items-center mb-1">
                    <span class="font-bold text-gray-200">${name}</span>
                    <span class="bg-gradient-to-r from-amber-500 to-orange-500 text-gray-950 px-2.5 py-1 rounded-lg text-xs font-black shadow">⭐ ${avg}/10 (${info.count} lượt)</span>
                </div>
            `;
        }

        // Vẽ danh sách bình luận (Tự động bóc tách tên người gửi từ chuỗi comment)
        reviews.forEach(r => {
            let sender = "🕵️ Học Sinh Ẩn Danh";
            let pureComment = r.comment;

            // Nếu comment định dạng đúng chuẩn mẹo "[Tên] nội dung" thì tách ra
            if (r.comment.startsWith("[")) {
                const closeBracketIndex = r.comment.indexOf("]");
                if (closeBracketIndex !== -1) {
                    sender = r.comment.substring(1, closeBracketIndex);
                    pureComment = r.comment.substring(closeBracketIndex + 1).trim();
                }
            }

            // Đổi màu sắc nhãn tùy theo chế độ ẩn danh hay hiện tên thật
            const isAnon = sender.includes("Ẩn Danh");
            const badgeClass = isAnon 
                ? "bg-orange-950 text-orange-400 border border-orange-900" 
                : "bg-green-950 text-green-400 border border-green-900";

            reviewsContainer.innerHTML += `
                <div class="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-xs px-2.5 py-1 rounded-md font-bold ${badgeClass}">${sender}</span>
                    </div>
                    <p class="text-xs text-gray-400 mb-1">Đánh giá giáo viên: <span class="text-white font-medium">${r.teacher_name}</span></p>
                    <div class="text-yellow-500 text-xs font-black mb-2">Đã chấm: ${r.rating}/10 ★</div>
                    <p class="text-gray-200 text-sm italic bg-gray-950 p-3 rounded-lg border-l-4 border-orange-500">"${pureComment}"</p>
                </div>
            `;
        });

    } catch (error) {
        console.error("Lỗi tải:", error);
    }
}

window.addEventListener("DOMContentLoaded", loadReviewsAndStats);