/**
 * 🎯 APP.JS V2 - HỆ 10 SAO CLICK NGẦU LÒI & FETCH API THUỒN CHỐNG CORS
 */

const SUPABASE_URL = "https://ymqojrhnallaphkuhbcml.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_0hYJ6ctupuXGaVVo8jAoKw_8_FRhu90"; 

const teacherSelect = document.getElementById("teacherSelect");
const submitBtn = document.getElementById("submitBtn");
const reviewComment = document.getElementById("reviewComment");
const reviewsContainer = document.getElementById("reviewsContainer");
const statsContainer = document.getElementById("statsContainer");
const ratingDisplay = document.getElementById("ratingDisplay");
const nameInputWrapper = document.getElementById("nameInputWrapper");
const studentNameInput = document.getElementById("studentName");

let currentRating = 0;

// 1. XỬ LÝ CLICK CHỌN SAO (HỆ NGẦU LÒI)
document.querySelectorAll(".star").forEach(star => {
    // Sự kiện Click
    star.addEventListener("click", (e) => {
        currentRating = parseInt(e.target.getAttribute("data-value"));
        ratingDisplay.innerText = `${currentRating}/10★`;
        updateStars(currentRating);
    });

    // Sự kiện Di chuột (Hover cho ngầu)
    star.addEventListener("mouseenter", (e) => {
        const hoverVal = parseInt(e.target.getAttribute("data-value"));
        updateStars(hoverVal);
    });

    // Sự kiện Rời chuột (Trả về giá trị đã chọn)
    star.addEventListener("mouseleave", () => {
        updateStars(currentRating);
    });
});

function updateStars(rating) {
    document.querySelectorAll(".star").forEach(star => {
        const val = parseInt(star.getAttribute("data-value"));
        if (val <= rating) {
            star.style.color = "#fbbf24"; // Màu vàng sáng rực
            star.style.transform = "scale(1.2)";
        } else {
            star.style.color = "#374151"; // Màu xám tối
            star.style.transform = "scale(1.0)";
        }
    });
}

// 2. XỬ LÝ ẨN/HIỆN Ô NHẬP TÊN
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

// 3. THUẬT TOÁN GỬI DATA BẰNG FETCH THUỒN (CHỐNG CORS)
submitBtn.addEventListener("click", async () => {
    const teacherName = teacherSelect.value;
    const commentText = reviewComment.value.trim();
    
    const identityMode = document.querySelector('input[name="identityMode"]:checked').value;
    let displayName = "🕵️ Học Sinh Ẩn Danh";
    
    if (identityMode === 'public') {
        const inputName = studentNameInput.value.trim();
        if (!inputName) return alert("🚨 Đã chọn Hiện tên thì phải nhập tên con trai ơi!");
        displayName = `😎 ${inputName}`;
    }

    if (!teacherName) return alert("🚨 Chọn thầy cô đã!");
    if (currentRating === 0) return alert("🚨 Bấm vào sao để chấm điểm đi con!");
    if (!commentText) return alert("🚨 Viết lời review đã nào!");

    submitBtn.disabled = true;
    submitBtn.innerText = "⚡ Đang gửi lên mây...";

    try {
        const finalComment = `[${displayName}] ${commentText}`;

        const response = await fetch(`${SUPABASE_URL}/rest/v1/teacher_reviews`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                teacher_name: teacherName,
                rating: currentRating,
                comment: finalComment
            })
        });

        if (!response.ok) throw new Error("Lỗi API Supabase");

        alert("🎉 Chấm điểm 10★ thành công rực rỡ vcl!");
        reviewComment.value = "";
        studentNameInput.value = "";
        currentRating = 0;
        ratingDisplay.innerText = "0/10★";
        updateStars(0);
        
        await loadReviewsAndStats();

    } catch (error) {
        alert("🚨 Lỗi: " + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Gửi Đánh Giá Ngay";
    }
});

// 4. THUẬT TOÁN TẢI DATA BẰNG FETCH THUỒN
async function loadReviewsAndStats() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/teacher_reviews?select=*&order=id.desc`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        const reviews = await response.json();
        if (!response.ok) throw new Error("Lỗi load data");

        reviewsContainer.innerHTML = "";
        statsContainer.innerHTML = "";
        
        if (!reviews || reviews.length === 0) {
            reviewsContainer.innerHTML = `<p class="text-gray-500 text-center py-4">Chưa có ai chấm điểm...</p>`;
            return;
        }

        const stats = {};
        reviews.forEach(r => {
            if (!stats[r.teacher_name]) stats[r.teacher_name] = { total: 0, count: 0 };
            stats[r.teacher_name].total += (r.rating <= 5 ? r.rating * 2 : r.rating);
            stats[r.teacher_name].count += 1;
        });

        let statsHTML = "";
        for (const [name, info] of Object.entries(stats)) {
            const avg = (info.total / info.count).toFixed(1);
            statsHTML += `<div class="bg-gray-800 p-3 rounded-xl border border-gray-700 flex justify-between items-center mb-1">
                <span class="font-bold text-gray-200">${name}</span>
                <span class="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-950 px-2.5 py-1 rounded-lg text-xs font-black shadow">⭐ ${avg}/10 (${info.count} lượt)</span>
            </div>`;
        }
        statsContainer.innerHTML = statsHTML;

        let reviewsHTML = "";
        reviews.forEach(r => {
            let sender = "🕵️ Học Sinh Ẩn Danh", pureComment = r.comment || "";
            if (pureComment.startsWith("[")) {
                const idx = pureComment.indexOf("]");
                if (idx !== -1) { sender = pureComment.substring(1, idx); pureComment = pureComment.substring(idx + 1).trim(); }
            }
            const isAnon = sender.includes("Ẩn Danh");
            const badgeClass = isAnon ? "bg-orange-950 text-orange-400 border border-orange-900" : "bg-green-950 text-green-400 border border-green-900";
            let displayStars = r.rating <= 5 ? r.rating * 2 : r.rating;

            reviewsHTML += `<div class="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg mb-3">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs px-2.5 py-1 rounded-md font-bold ${badgeClass}">${sender}</span>
                </div>
                <p class="text-xs text-gray-400 mb-1">Giáo viên: <span class="text-white font-medium">${r.teacher_name}</span></p>
                <div class="text-yellow-500 text-xs font-black mb-2">Đã chấm: ${displayStars}/10 ★</div>
                <p class="text-gray-200 text-sm italic bg-gray-950 p-3 rounded-lg border-l-4 border-orange-500">"${pureComment}"</p>
            </div>`;
        });
        reviewsContainer.innerHTML = reviewsHTML;

    } catch (e) { console.error(e); }
}

window.addEventListener("DOMContentLoaded", loadReviewsAndStats);