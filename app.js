/**
 * 🎯 APP.JS - LOGIC CHỐNG ĐẠN CHO HỆ THỐNG ĐÁNH GIÁ GIÁO VIÊN ẨN DANH
 * Kết nối với Supabase để lưu trữ dữ liệu tập trung và công khai.
 */

// 1. CẤU HÌNH SUPABASE (Thay thế thông số của con vào đây)
const SUPABASE_URL = "https://ymqojrhnllaphkuhbcml.supabase.co/rest/v1/"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltcW9qcmhubGxhcGhrdWhiY21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjE4MzIsImV4cCI6MjA5NDgzNzgzMn0.q9C7cviN2cFt-0zwtqkV44ieewVp0wuNmLaxvBJ438c"; 

// Khởi tạo Supabase Client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Các phần tử giao diện (DOM Elements)
const teacherSelect = document.getElementById("teacherSelect");
const ratingStars = document.getElementById("ratingStars");
const reviewComment = document.getElementById("reviewComment");
const submitBtn = document.getElementById("submitBtn");
const reviewsContainer = document.getElementById("reviewsContainer");
const statsContainer = document.getElementById("statsContainer");

let currentRating = 0;

// 2. XỬ LÝ HỆ THỐNG CHẤM SAO (UI INTERACTION)
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
            star.classList.add("text-yellow-400");
            star.classList.remove("text-gray-600");
        } else {
            star.classList.remove("text-yellow-400");
            star.classList.add("text-gray-600");
        }
    });
}

// 3. THUẬT TOÁN ĐẨY REVIEW LÊN DATABASE (SUPABASE)
submitBtn.addEventListener("click", async () => {
    const teacherName = teacherSelect.value;
    const commentText = reviewComment.value.trim();

    // Tư duy chống đạn: Kiểm tra dữ liệu đầu vào (Validation)
    if (!teacherName) {
        alert("🚨 Con chưa chọn giáo viên kìa!");
        return;
    }
    if (currentRating === 0) {
        alert("🚨 Chọn số sao đánh giá đi bro!");
        return;
    }
    if (!commentText) {
        alert("🚨 Hãy viết vài lời review ẩn danh đã nhé!");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "⚡ Đang gửi ẩn danh...";

    try {
        // Gửi dữ liệu lên bảng 'teacher_reviews' của Supabase
        const { data, error } = await supabase
            .from('teacher_reviews')
            .insert([
                { 
                    teacher_name: teacherName, 
                    rating: currentRating, 
                    comment: commentText,
                    created_at: new Date()
                }
            ]);

        if (error) throw error;

        // Reset Form sau khi gửi thành công
        reviewComment.value = "";
        currentRating = 0;
        updateStars(0);
        alert("🎉 Gửi đánh giá ẩn danh thành công vcl!");
        
        // Tải lại toàn bộ dữ liệu mới nhất
        await loadReviewsAndStats();

    } catch (error) {
        console.error("Lỗi hệ thống:", error);
        alert("🚨 Có lỗi xảy ra khi gửi lên Database rồi con ơi: " + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Gửi Đánh Giá Ẩn Danh";
    }
});

// 4. LẤY DỮ LIỆU TỪ DATABASE VÀ HIỂN THỊ CÔNG KHAI (FETCH DATA)
async function loadReviewsAndStats() {
    try {
        // Lấy tất cả review mới nhất từ Supabase (Sắp xếp theo thời gian mới nhất)
        const { data: reviews, error } = await supabase
            .from('teacher_reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Xóa danh sách cũ đi để vẽ lại
        reviewsContainer.innerHTML = "";
        
        if (reviews.length === 0) {
            reviewsContainer.innerHTML = `<p class="text-gray-500 text-center py-4">Chưa có đánh giá nào. Hãy là người đầu tiên bóc phốt ẩn danh!</p>`;
            return;
        }

        // Tính toán điểm trung bình của từng giáo viên (Bảng xếp hạng)
        const stats = {};
        reviews.forEach(r => {
            if (!stats[r.teacher_name]) {
                stats[r.teacher_name] = { totalRating: 0, count: 0 };
            }
            stats[r.teacher_name].totalRating += r.rating;
            stats[r.teacher_name].count += 1;
        });

        // Vẽ giao diện bảng xếp hạng công khai
        statsContainer.innerHTML = "";
        for (const [name, info] of Object.entries(stats)) {
            const avg = (info.totalRating / info.count).toFixed(1);
            statsContainer.innerHTML += `
                <div class="bg-gray-800 p-3 rounded-lg border border-gray-700 flex justify-between items-center mb-2">
                    <span class="font-bold text-gray-200">${name}</span>
                    <span class="bg-yellow-500 text-gray-900 px-2 py-1 rounded text-sm font-black">⭐ ${avg} (${info.count} lượt)</span>
                </div>
            `;
        }

        // Vẽ giao diện luồng bình luận ẩn danh cho cả trường cùng hóng
        reviews.forEach(r => {
            const date = new Date(r.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            reviewsContainer.innerHTML += `
                <div class="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-xs bg-purple-900 text-purple-200 px-2 py-0.5 rounded-full font-semibold">👀 Học Sinh Ẩn Danh</span>
                        <span class="text-gray-500 text-xs">${date}</span>
                    </div>
                    <p class="text-sm text-gray-400 mb-2">Đánh giá giáo viên: <span class="text-white font-medium">${r.teacher_name}</span></p>
                    <div class="text-yellow-400 text-sm mb-2">${"⭐".repeat(r.rating)}</div>
                    <p class="text-gray-200 text-sm italic bg-gray-900 p-2.5 rounded border-l-4 border-purple-500">"${r.comment}"</p>
                </div>
            `;
        });

    } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
    }
}

// Kích nổ hệ thống, tự động load dữ liệu ngay khi vừa vào trang web
window.addEventListener("DOMContentLoaded", loadReviewsAndStats);
