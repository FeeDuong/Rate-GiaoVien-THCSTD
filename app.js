/**
 * 🎯 APP.JS V2 - THANG ĐIỂM 10★ & TÙY CHỌN DANH TÍNH CHUẨN ĐÉT
 */

const SUPABASE_URL = "https://ymqojrhnallaphkuhbcml.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltcW9qcmhubGxhcGhrdWhiY21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjE4MzIsImV4cCI6MjA5NDgzNzgzMn0.q9C7cviN2cFt-0zwtqkV44ieewVp0wuNmLaxvBJ438c"; 

// Khởi tạo Client bằng thư viện UMD chống lỗi CORS
const mySupabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const teacherSelect = document.getElementById("teacherSelect");
const ratingSelect = document.getElementById("ratingSelect");
const submitBtn = document.getElementById("submitBtn");
const reviewComment = document.getElementById("reviewComment");
const reviewsContainer = document.getElementById("reviewsContainer");
const statsContainer = document.getElementById("statsContainer");
const nameInputWrapper = document.getElementById("nameInputWrapper");
const studentNameInput = document.getElementById("studentName");

// HIỆN/ẨN Ô NHẬP TÊN KHI CHỌN PHÂN LOẠI DANH TÍNH
document.querySelectorAll('input[name="identityMode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'public') {
            nameInputWrapper.classList.remove('hidden');
        } else {
            nameInputWrapper.classList.add('hidden');
            studentNameInput.value = ""; 
        }
    });
});

// THUẬT TOÁN GỬI ĐÁNH GIÁ V2
submitBtn.addEventListener("click", async () => {
    const teacherName = teacherSelect.value;
    const ratingValue = parseInt(ratingSelect.value);
    const commentText = reviewComment.value.trim();
    
    // Xử lý danh tính người gửi
    const identityMode = document.querySelector('input[name="identityMode"]:checked').value;
    let displayName = "🕵️ Học Sinh Ẩn Danh";
    
    if (identityMode === 'public') {
        const inputName = studentNameInput.value.trim();
        if (!inputName) {
            alert("🚨 Con chọn chế độ Hiện tên thì phải nhập tên vào nhé!");
            return;
        }
        displayName = `😎 ${inputName}`;
    }

    // Kiểm tra đầu vào chống đạn
    if (!teacherName) {
        alert("🚨 Con chưa chọn Thầy/Cô kìa!");
        return;
    }
    if (!ratingValue) {
        alert("🚨 Con chưa chọn số sao hệ 10 kìa!");
        return;
    }
    if (!commentText) {
        alert("🚨 Viết vài chữ review đã rồi hãy bấm nút gửi!");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "⚡ Đang gửi lên mây...";

    try {
        // MẸO HỆ CHIẾN: Gộp Tên vào chuỗi comment để tận dụng bảng Supabase cũ mà không cần đổi cột!
        const finalComment = `[${displayName}] ${commentText}`;

        const { data, error } = await mySupabase
            .from('teacher_reviews')
            .insert([
                { teacher_name: teacherName, rating: ratingValue, comment: finalComment }
            ]);

        if (error) throw error;

        alert("🎉 Đánh giá hệ 10 sao thành công rực rỡ vcl!");
        reviewComment.value = "";
        studentNameInput.value = "";
        ratingSelect.value = "";
        
        await loadReviewsAndStats();

    } catch (error) {
        console.error("Lỗi kết nối:", error);
        alert("🚨 Lỗi! Chi tiết: " + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Gửi Đánh Giá Ngay";
    }
});

// THUẬT TOÁN LOAD DỮ LIỆU REAL-TIME
async function loadReviewsAndStats() {
    try {
        const { data: reviews, error } = await mySupabase
            .from('teacher_reviews')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;

        reviewsContainer.innerHTML = "";
        
        if (!reviews || reviews.length === 0) {
            reviewsContainer.innerHTML = `<p class="text-gray-500 text-center py-4">Chưa có đánh giá nào. Hãy mở bát hệ 10 sao đi con trai!</p>`;
            return;
        }

        // Gom nhóm tính điểm trung bình hệ 10
        const stats = {};
        reviews.forEach(r => {
            if (!stats[r.teacher_name]) {
                stats[r.teacher_name] = { totalRating: 0, count: 0 };
            }
            // Mẹo tương thích ngược: Nếu dính data 5 sao cũ, nhân đôi lên thành hệ 10 cho công bằng
            let currentStars = r.rating <= 5 ? r.rating * 2 : r.rating;
            stats[r.teacher_name].totalRating += currentStars;
            stats[r.teacher_name].count += 1;
        });

        // Vẽ bảng điểm top giáo viên
        statsContainer.innerHTML = "";
        for (const [name, info] of Object.entries(stats)) {
            const avg = (info.totalRating / info.count).toFixed(1);
            statsContainer.innerHTML += `
                <div class="bg-gray-800 p-3 rounded-xl border border-gray-700 flex justify-between items-center">
                    <span class="font-bold text-gray-200">${name}</span>
                    <span class="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-950 px-2.5 py-1 rounded-lg text-xs font-black shadow">⭐ ${avg}/10 (${info.count} lượt)</span>
                </div>
            `;
        }

        // Vẽ danh sách bình luận động
        reviews.forEach(r => {
            let sender = "🕵️ Học Sinh Ẩn Danh";
            let pureComment = r.comment;

            // Bóc tách tên nếu comment ở định dạng chuẩn v2 "[Tên] nội dung"
            if (r.comment.startsWith("[")) {
                const closeBracketIndex = r.comment.indexOf("]");
                if (closeBracketIndex !== -1) {
                    sender = r.comment.substring(1, closeBracketIndex);
                    pureComment = r.comment.substring(closeBracketIndex + 1).trim();
                }
            }

            const isAnon = sender.includes("Ẩn Danh");
            const badgeClass = isAnon 
                ? "bg-orange-950 text-orange-400 border border-orange-900" 
                : "bg-green-950 text-green-400 border border-green-900";

            let displayStars = r.rating <= 5 ? r.rating * 2 : r.rating;

            reviewsContainer.innerHTML += `
                <div class="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-xs px-2.5 py-1 rounded-md font-bold ${badgeClass}">${sender}</span>
                    </div>
                    <p class="text-xs text-gray-400 mb-1">Đánh giá giáo viên: <span class="text-white font-medium">${r.teacher_name}</span></p>
                    <div class="text-yellow-500 text-xs font-black mb-2">Đã chấm: ${displayStars}/10 ★</div>
                    <p class="text-gray-200 text-sm italic bg-gray-950 p-3 rounded-lg border-l-4 border-orange-500">"${pureComment}"</p>
                </div>
            `;
        });

    } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
    }
}

window.addEventListener("DOMContentLoaded", loadReviewsAndStats);