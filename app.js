/**
 * 🎯 APP.JS V2 - FIX TRIỆT ĐỂ LỖI RENDER SÓT BÌNH LUẬN
 */

const SUPABASE_URL = "https://ymqojrhnallaphkuhbcml.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltcW9qcmhubGxhcGhrdWhiY21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjE4MzIsImV4cCI6MjA5NDgzNzgzMn0.q9C7cviN2cFt-0zwtqkV44ieewVp0wuNmLaxvBJ438c"; 

const mySupabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const teacherSelect = document.getElementById("teacherSelect");
const ratingSelect = document.getElementById("ratingSelect");
const submitBtn = document.getElementById("submitBtn");
const reviewComment = document.getElementById("reviewComment");
const reviewsContainer = document.getElementById("reviewsContainer");
const statsContainer = document.getElementById("statsContainer");
const nameInputWrapper = document.getElementById("nameInputWrapper");
const studentNameInput = document.getElementById("studentName");

// Xử lý ẩn hiện ô điền tên thật
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

// Gửi dữ liệu lên database
submitBtn.addEventListener("click", async () => {
    const teacherName = teacherSelect.value;
    const ratingValue = parseInt(ratingSelect.value);
    const commentText = reviewComment.value.trim();
    
    const identityMode = document.querySelector('input[name="identityMode"]:checked').value;
    let displayName = "🕵️ Học Sinh Ẩn Danh";
    
    if (identityMode === 'public') {
        const inputName = studentNameInput.value.trim();
        if (!inputName) {
            alert("🚨 Đã chọn chế độ Hiện tên thì điền tên vào đi con trai!");
            return;
        }
        displayName = `😎 ${inputName}`;
    }

    if (!teacherName || !ratingValue || !commentText) {
        alert("🚨 Điền đầy đủ thông tin thầy cô, số sao với bình luận đã con!");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "⚡ Đang bắn dữ liệu lên mây...";

    try {
        const finalComment = `[${displayName}] ${commentText}`;

        const { error } = await mySupabase
            .from('teacher_reviews')
            .insert([{ teacher_name: teacherName, rating: ratingValue, comment: finalComment }]);

        if (error) throw error;

        alert("🎉 Đánh giá hệ 10 sao thành công rực rỡ!");
        reviewComment.value = "";
        studentNameInput.value = "";
        ratingSelect.value = "";
        
        await loadReviewsAndStats();

    } catch (error) {
        alert("🚨 Lỗi: " + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Gửi Đánh Giá Ngay";
    }
});

// Thuật toán bốc data về vẽ lên màn hình (Chống đạn, không sót hàng)
async function loadReviewsAndStats() {
    try {
        const { data: reviews, error } = await mySupabase
            .from('teacher_reviews')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;

        // Reset sạch vùng chứa trước khi vẽ
        statsContainer.innerHTML = "";
        reviewsContainer.innerHTML = "";
        
        if (!reviews || reviews.length === 0) {
            reviewsContainer.innerHTML = `<p class="text-gray-500 text-center py-4">Chưa có đánh giá nào.</p>`;
            return;
        }

        // 1. TÍNH ĐIỂM TRUNG BÌNH HỆ 10
        const stats = {};
        reviews.forEach(r => {
            if (!stats[r.teacher_name]) {
                stats[r.teacher_name] = { totalRating: 0, count: 0 };
            }
            // Tương thích ngược dữ liệu: Nếu là đánh giá 5 sao cũ thì tự x2 lên hệ 10
            let currentStars = r.rating <= 5 ? r.rating * 2 : r.rating;
            stats[r.teacher_name].totalRating += currentStars;
            stats[r.teacher_name].count += 1;
        });

        // Vẽ bảng điểm
        let statsHTML = "";
        for (const [name, info] of Object.entries(stats)) {
            const avg = (info.totalRating / info.count).toFixed(1);
            statsHTML += `
                <div class="bg-gray-800 p-3 rounded-xl border border-gray-700 flex justify-between items-center">
                    <span class="font-bold text-gray-200">${name}</span>
                    <span class="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-950 px-2.5 py-1 rounded-lg text-xs font-black shadow">⭐ ${avg}/10 (${info.count} lượt)</span>
                </div>
            `;
        }
        statsContainer.innerHTML = statsHTML;

        // 2. VẼ DANH SÁCH BÌNH LUẬN (Dùng cộng chuỗi liên tục để tuyệt đối không sót card nào)
        let reviewsHTML = "";
        reviews.forEach(r => {
            let sender = "🕵️ Học Sinh Ẩn Danh";
            let pureComment = r.comment;

            // Bóc tách giấu ngoặc vuông tinh vi
            if (r.comment && r.comment.startsWith("[")) {
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

            reviewsHTML += `
                <div class="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="text-xs px-2.5 py-1 rounded-md font-bold ${badgeClass}">${sender}</span>
                    </div>
                    <p class="text-xs text-gray-400">Đánh giá giáo viên: <span class="text-white font-medium">${r.teacher_name}</span></p>
                    <div class="text-yellow-500 text-xs font-black">Đã chấm: ${displayStars}/10 ★</div>
                    <p class="text-gray-200 text-sm italic bg-gray-950 p-3 rounded-lg border-l-4 border-orange-500">"${pureComment}"</p>
                </div>
            `;
        });
        
        reviewsContainer.innerHTML = reviewsHTML;

    } catch (error) {
        console.error("Lỗi tải data:", error);
    }
}

window.addEventListener("DOMContentLoaded", loadReviewsAndStats);