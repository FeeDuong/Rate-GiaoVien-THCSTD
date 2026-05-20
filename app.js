/**
 * 🎯 APP.JS - BẢN FIX TOÀN DIỆN CHO THCS TÂN DÂN
 */

// SƯ PHỤ ĐÃ FIX BỎ CÁI ĐUÔI /rest/v1/ CHO CON RỒI NHÉ!
const SUPABASE_URL = "https://ymqojrhnllaphkuhbcml.supabase.co/rest/v1/"; 
// CON NHỚ ĐỔI CÁI CHUỖI DƯỚI THÀNH THÀNH KEY THẬT CỦA CON NHA!
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltcW9qcmhubGxhcGhrdWhiY21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjE4MzIsImV4cCI6MjA5NDgzNzgzMn0.q9C7cviN2cFt-0zwtqkV44ieewVp0wuNmLaxvBJ438c"; 

// Khởi tạo Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const teacherSelect = document.getElementById("teacherSelect");
const submitBtn = document.getElementById("submitBtn");
const reviewComment = document.getElementById("reviewComment");
const reviewsContainer = document.getElementById("reviewsContainer");
const statsContainer = document.getElementById("statsContainer");

let currentRating = 0;

// XỬ LÝ CLICK SAO VÀ ĐỔI MÀU TRỰC TIẾP (Bao mượt, không sợ lỗi font)
document.querySelectorAll(".star").forEach(star => {
    star.addEventListener("click", (e) => {
        currentRating = parseInt(e.target.getAttribute("data-value"));
        updateStars(currentRating);
    });
});

function updateStars(rating) {
    document.querySelectorAll(".star").forEach(star => {
        const val = parseInt(star.getAttribute("data-value"));
        if (val <= rating) {
            star.style.color = "#facc15"; // Màu vàng rực
        } else {
            star.style.color = "#4b5563"; // Màu xám tối
        }
    });
}

// THUẬT TOÁN GỬI DỮ LIỆU
submitBtn.addEventListener("click", async () => {
    const teacherName = teacherSelect.value;
    const commentText = reviewComment.value.trim();

    if (!teacherName) {
        alert("🚨 Con chưa chọn giáo viên kìa!");
        return;
    }
    if (currentRating === 0) {
        alert("🚨 Hãy bấm chọn số sao (từ 1 đến 5 sao) đã con trai!");
        return;
    }
    if (!commentText) {
        alert("🚨 Viết vài chữ bình luận đã rồi hãy gửi!");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "⚡ Đang gửi ẩn danh...";

    try {
        const { data, error } = await supabase
            .from('teacher_reviews')
            .insert([
                { 
                    teacher_name: teacherName, 
                    rating: currentRating, 
                    comment: commentText
                }
            ]);

        if (error) throw error;

        alert("🎉 Gửi đánh giá ẩn danh thành công vcl!");
        reviewComment.value = "";
        currentRating = 0;
        updateStars(0);
        
        await loadReviewsAndStats();

    } catch (error) {
        console.error("Lỗi gửi:", error);
        alert("🚨 Lỗi rồi con ơi! Kiểm tra xem đã tạo bảng 'teacher_reviews' và Disable RLS trên Supabase chưa nhé. Chi tiết: " + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Gửi Đánh Giá Ẩn Danh";
    }
});

// THUẬT TOÁN LOAD DATA CÔNG KHAI
async function loadReviewsAndStats() {
    try {
        const { data: reviews, error } = await supabase
            .from('teacher_reviews')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;

        reviewsContainer.innerHTML = "";
        
        if (!reviews || reviews.length === 0) {
            reviewsContainer.innerHTML = `<p class="text-gray-500 text-center py-4">Chưa có đánh giá nào. Hãy là người đầu tiên bóc phốt ẩn danh!</p>`;
            return;
        }

        // Tính điểm trung bình
        const stats = {};
        reviews.forEach(r => {
            if (!stats[r.teacher_name]) {
                stats[r.teacher_name] = { totalRating: 0, count: 0 };
            }
            stats[r.teacher_name].totalRating += r.rating;
            stats[r.teacher_name].count += 1;
        });

        // Vẽ bảng điểm
        statsContainer.innerHTML = "";
        for (const [name, info] of Object.entries(stats)) {
            const avg = (info.totalRating / info.count).toFixed(1);
            statsContainer.innerHTML += `
                <div class="bg-gray-800 p-3 rounded-lg border border-gray-700 flex justify-between items-center mb-2 animate-fade-in">
                    <span class="font-bold text-gray-200">${name}</span>
                    <span class="bg-yellow-500 text-gray-900 px-2 py-1 rounded text-sm font-black">⭐ ${avg} (${info.count} lượt)</span>
                </div>
            `;
        }

        // Vẽ danh sách bình luận
        reviews.forEach(r => {
            reviewsContainer.innerHTML += `
                <div class="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg mb-3">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-xs bg-purple-900 text-purple-200 px-2 py-0.5 rounded-full font-semibold">👀 Học Sinh Ẩn Danh</span>
                    </div>
                    <p class="text-sm text-gray-400 mb-2">Đánh giá giáo viên: <span class="text-white font-medium">${r.teacher_name}</span></p>
                    <div class="text-yellow-400 text-sm mb-2">${"★".repeat(r.rating)}</div>
                    <p class="text-gray-200 text-sm italic bg-gray-900 p-2.5 rounded border-l-4 border-purple-500">"${r.comment}"</p>
                </div>
            `;
        });

    } catch (error) {
        console.error("Lỗi tải:", error);
    }
}

window.addEventListener("DOMContentLoaded", loadReviewsAndStats);