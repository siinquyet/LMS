# KẾ HOẠCH ANDROID APP - LMS    

## A. TỔNG QUAN HỆ THỐNG

```
┌─────────────────────────────────────────────────────────┐
│                 ANDROID APP (Kotlin)                    │
├─────────────────────────────────────────────────────────┤
│  UI Layer: Activity + XML Layout + RecyclerView          │
│  Data Layer: SQLite (SQLiteOpenHelper)                  │
│  Mock Data: Seed vào SQLite khi app khởi đầu          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              SQLITE DATABASE (lms.db)                   │
│  - Dữ liệu từ Frontend mockData.ts                     │
└─────────────────────────────────────────────────────────┘
```

---

## B. ENTITY + DỮ LIỆU

### Tổng hợp Entity từ Frontend:

| STT | Entity | Table SQL | Fields | Used on UI |
|-----|-------|----------|--------|-----------|
| 1 | User | nguoi_dung | id, ten_dang_nhap, email, mat_khau, ten, ho, anh_dai_dien, so_dien_thoai, dia_chi, gioi_thieu, bi_khoa, ngay_tham_gia, vai_tro | Login, Profile |
| 2 | Category | danh_muc | id, ten | Store Filter |
| 3 | Course | khoa_hoc | id, tieu_de, giang_vien_id, danh_muc_id, gia, so_luong_toi_da, so_luong_da_dang_ky, trang_thai, mo_ta, thumbnail, muc_do, thoi_luong, so_bai_hoc, xep_hang | Store, Course Detail |
| 4 | Chapter | chuong_hoc | id, khoa_hoc_id, tieu_de, thu_tu | Course Detail |
| 5 | Lesson | bai_hoc | id, chuong_hoc_id, tieu_de, video_url, loai, thoi_luong, noi_dung | Learning |
| 6 | Enrollment | dang_ky_khoa_hoc | id, nguoi_dung_id, khoa_hoc_id, ngay_dang_ky | My Courses |
| 7 | Progress | tien_do_bai_hoc | nguoi_dung_id, bai_hoc_id, da_hoan_thanh, ngay_hoan_thanh | Learning |
| 8 | Order | don_hang | id, nguoi_dung_id, tong_tien, trang_thai, ngay_dat | Cart |
| 9 | OrderItem | chi_tiet_don_hang | id, don_hang_id, khoa_hoc_id, gia | Cart |
| 10 | Payment | thanh_toan | id, don_hang_id, so_tien, trang_thai, ngay_thanh_toan, phuong_thuc | - |
| 11 | Comment | binh_luan | id, bai_hoc_id, nguoi_dung_id, noi_dung, parent_id, ngay_tao | Learning |
| 12 | Notification | thong_bao | id, nguoi_dung_id, tieu_de, noi_dung, loai, da_doc, ngay_tao, link | Header |
| 13 | Quiz | bai_kiem_tra | id, bai_hoc_id, tieu_de, thoi_gian_lam, so_cau_hoi | Quiz |
| 14 | QuizQuestion | cau_hoi | id, quiz_id, cau_hoi, lua_chon, dap_an_dung | Quiz |
| 15 | QuizAttempt | lam_bai | id, quiz_id, nguoi_dung_id, diem, ngay_lam | Quiz Result |
| 16 | Assignment | bai_tap | id, bai_hoc_id, tieu_de, mo_ta, bat_buoc, han_nop | Learning |
| 17 | AssignmentSubmission | nop_bai | id, bai_tap_id, nguoi_dung_id, noi_dung, file_dinh_kem, diem, nhan_xet, ngay_nop | - |
| 18 | Certificate | chung_chi | id, nguoi_dung_id, khoa_hoc_id, ngay_cap, ma_chung_chi | Profile |

---

## C. MAPPING WEB → SQLITE → ANDROID

### 1. User

| Web Field | SQLite Field | Kotlin Field | Ghi chú |
|----------|-------------|-------------|---------|
| id | id | id | Int |
| ten_dang_nhap | ten_dang_nhap | username | String |
| email | email | email | String |
| mat_khau | mat_khau | password | String (plain text for demo) |
| ten | ten | firstName | String |
| ho | ho | lastName | String |
| anh_dai_dien | anh_dai_dien | avatarUrl | String? |
| so_dien_thoai | so_dien_thoai | phone | String? |
| dia_chi | dia_chi | address | String? |
| gioi_thieu | gioi_thieu | bio | String? |
| bi_khoa | bi_khoa | isLocked | Int (0/1) |
| ngay_tham_gia | ngay_tham_gia | joinDate | String |
| vai_tro | vai_tro | role | String (hoc_vien/giang_vien/admin) |

### 2. Course

| Web Field | SQLite Field | Kotlin Field | Ghi chú |
|----------|-------------|-------------|---------|
| id | id | id | Int |
| tieu_de | tieu_de | title | String |
| giang_vien_id | giang_vien_id | instructorId | Int (FK to user) |
| danh_muc_id | danh_muc_id | categoryId | Int (FK to category) |
| gia | gia | price | Double |
| so_luong_toi_da | so_luong_toi_da | maxStudents | Int? |
| so_luong_da_dang_ky | so_luong_da_dang_ky | enrolledCount | Int |
| trang_thai | trang_thai | status | String |
| mo_ta | mo_ta | description | String? |
| thumbnail | thumbnail | thumbnailUrl | String? |
| muc_do | muc_do | level | String? |
| thoi_luong | thoi_luong | duration | String? |
| so_bai_hoc | so_bai_hoc | lessonCount | Int |
| xep_hang | xep_hang | rating | Double |

### 3. Chapter

| Web Field | SQLite Field | Kotlin Field | Ghi chú |
|----------|-------------|-------------|---------|
| id | id | id | Int |
| khoa_hoc_id | khoa_hoc_id | courseId | Int |
| tieu_de | tieu_de | title | String |
| thu_tu | thu_tu | orderIndex | Int |

### 4. Lesson

| Web Field | SQLite Field | Kotlin Field | Ghi chú |
|----------|-------------|-------------|---------|
| id | id | id | Int |
| chuong_hoc_id | chuong_hoc_id | chapterId | Int |
| tieu_de | tieu_de | title | String |
| video_url | video_url | videoUrl | String? |
| loai | loai | type | String (video/document/quiz/exercise) |
| thoi_luong | thoi_luong | duration | String? |
| noi_dung | noi_dung | content | String? |

### 5. Enrollment

| Web Field | SQLite Field | Kotlin Field | Ghi chú |
|----------|-------------|-------------|---------|
| id | id | id | Int |
| nguoi_dung_id | nguoi_dung_id | userId | Int |
| khoa_hoc_id | khoa_hoc_id | courseId | Int |
| ngay_dang_ky | ngay_dang_ky | enrollDate | String |

### 6. Quiz (Bài kiểm tra)

| Web Field | SQLite Field | Kotlin Field | Ghi chú |
|----------|-------------|-------------|---------|
| id | id | id | Int |
| bai_hoc_id | bai_hoc_id | lessonId | Int |
| tieu_de | tieu_de | title | String |
| thoi_gian_lam | thoi_gian_lam | timeLimit | Int? (phút) |
| so_cau_hoi | so_cau_hoi | questionCount | Int |

### 7. QuizQuestion

| Web Field | SQLite Field | Kotlin Field | Ghi chú |
|----------|-------------|-------------|---------|
| id | id | id | Int |
| quiz_id | quiz_id | quizId | Int |
| cau_hoi | cau_hoi | question | String |
| lua_chon | lua_chon | options | String (JSON format) |
| dap_an_dung | dap_an_dung | correctAnswer | String |

---

## D. SCHEMA SQLITE

```sql
-- ============================================
-- LMS SQLite Schema (for Android)
-- ============================================

-- 1. NGƯỜI DÙNG
CREATE TABLE nguoi_dung (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ten_dang_nhap TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    mat_khau TEXT NOT NULL,
    ho TEXT NOT NULL,
    ten TEXT NOT NULL,
    anh_dai_dien TEXT,
    so_dien_thoai TEXT,
    dia_chi TEXT,
    gioi_thieu TEXT,
    bi_khoa INTEGER DEFAULT 0,
    ngay_tham_gia TEXT,
    vai_tro TEXT DEFAULT 'hoc_vien'
);

-- 2. DANH MỤC
CREATE TABLE danh_muc (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ten TEXT NOT NULL
);

-- 3. KHÓA HỌC
CREATE TABLE khoa_hoc (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tieu_de TEXT NOT NULL,
    giang_vien_id INTEGER NOT NULL,
    danh_muc_id INTEGER,
    gia REAL NOT NULL,
    so_luong_toi_da INTEGER,
    so_luong_da_dang_ky INTEGER DEFAULT 0,
    trang_thai TEXT DEFAULT 'draft',
    mo_ta TEXT,
    yeu_cau TEXT,
    ban_thiet_bi TEXT,
    thumbnail TEXT,
    muc_do TEXT,
    thoi_luong TEXT,
    so_bai_hoc INTEGER DEFAULT 0,
    xep_hang REAL DEFAULT 0,
    FOREIGN KEY (giang_vien_id) REFERENCES nguoi_dung(id),
    FOREIGN KEY (danh_muc_id) REFERENCES danh_muc(id)
);

-- 4. CHƯƠNG HỌC
CREATE TABLE chuong_hoc (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    khoa_hoc_id INTEGER NOT NULL,
    tieu_de TEXT,
    thu_tu INTEGER,
    FOREIGN KEY (khoa_hoc_id) REFERENCES khoa_hoc(id)
);

-- 5. BÀI HỌC
CREATE TABLE bai_hoc (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chuong_hoc_id INTEGER NOT NULL,
    tieu_de TEXT,
    video_url TEXT,
    loai TEXT DEFAULT 'video',
    thoi_luong TEXT,
    noi_dung TEXT,
    FOREIGN KEY (chuong_hoc_id) REFERENCES chuong_hoc(id)
);

-- 6. ĐĂNG KÝ KHÓA HỌC
CREATE TABLE dang_ky_khoa_hoc (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nguoi_dung_id INTEGER NOT NULL,
    khoa_hoc_id INTEGER NOT NULL,
    ngay_dang_ky TEXT,
    UNIQUE(nguoi_dung_id, khoa_hoc_id),
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id),
    FOREIGN KEY (khoa_hoc_id) REFERENCES khoa_hoc(id)
);

-- 7. TIẾN ĐỘ BÀI HỌC
CREATE TABLE tien_do_bai_hoc (
    nguoi_dung_id INTEGER NOT NULL,
    bai_hoc_id INTEGER NOT NULL,
    da_hoan_thanh INTEGER DEFAULT 0,
    ngay_hoan_thanh TEXT,
    PRIMARY KEY (nguoi_dung_id, bai_hoc_id),
    FOREIGN KEY (bai_hoc_id) REFERENCES bai_hoc(id)
);

-- 8. ĐƠN HÀNG
CREATE TABLE don_hang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nguoi_dung_id INTEGER NOT NULL,
    tong_tien REAL,
    trang_thai TEXT DEFAULT 'pending',
    ngay_dat TEXT,
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id)
);

-- 9. CHI TIẾT ĐƠN HÀNG
CREATE TABLE chi_tiet_don_hang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    don_hang_id INTEGER NOT NULL,
    khoa_hoc_id INTEGER NOT NULL,
    gia REAL,
    FOREIGN KEY (don_hang_id) REFERENCES don_hang(id),
    FOREIGN KEY (khoa_hoc_id) REFERENCES khoa_hoc(id)
);

-- 10. THANH TOÁN
CREATE TABLE thanh_toan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    don_hang_id INTEGER NOT NULL,
    so_tien REAL,
    trang_thai TEXT DEFAULT 'pending',
    ngay_thanh_toan TEXT,
    phuong_thuc TEXT,
    FOREIGN KEY (don_hang_id) REFERENCES don_hang(id)
);

-- 11. BÌNH LUẬN
CREATE TABLE binh_luan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bai_hoc_id INTEGER NOT NULL,
    nguoi_dung_id INTEGER NOT NULL,
    noi_dung TEXT,
    parent_id INTEGER,
    ngay_tao TEXT,
    FOREIGN KEY (bai_hoc_id) REFERENCES bai_hoc(id),
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id)
);

-- 12. THÔNG BÁO
CREATE TABLE thong_bao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nguoi_dung_id INTEGER NOT NULL,
    tieu_de TEXT,
    noi_dung TEXT,
    loai TEXT DEFAULT 'info',
    da_doc INTEGER DEFAULT 0,
    ngay_tao TEXT,
    link TEXT,
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id)
);

-- 13. BÀI KIỂM TRA (QUIZ)
CREATE TABLE bai_kiem_tra (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bai_hoc_id INTEGER NOT NULL,
    tieu_de TEXT,
    thoi_gian_lam INTEGER,
    so_cau_hoi INTEGER,
    FOREIGN KEY (bai_hoc_id) REFERENCES bai_hoc(id)
);

-- 14. CÂU HỎI QUIZ
CREATE TABLE cau_hoi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER NOT NULL,
    cau_hoi TEXT,
    lua_chon TEXT,
    dap_an_dung TEXT,
    FOREIGN KEY (quiz_id) REFERENCES bai_kiem_tra(id)
);

-- 15. LÀM BÀI
CREATE TABLE lam_bai (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER NOT NULL,
    nguoi_dung_id INTEGER NOT NULL,
    diem REAL,
    ngay_lam TEXT,
    FOREIGN KEY (quiz_id) REFERENCES bai_kiem_tra(id),
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id)
);

-- 16. BÀI TẬP
CREATE TABLE bai_tap (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bai_hoc_id INTEGER NOT NULL,
    tieu_de TEXT,
    mo_ta TEXT,
    bat_buoc INTEGER DEFAULT 0,
    han_nop TEXT,
    FOREIGN KEY (bai_hoc_id) REFERENCES bai_hoc(id)
);

-- 17. NỘP BÀI
CREATE TABLE nop_bai (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bai_tap_id INTEGER NOT NULL,
    nguoi_dung_id INTEGER NOT NULL,
    noi_dung TEXT,
    file_dinh_kem TEXT,
    diem REAL,
    nhan_xet TEXT,
    ngay_nop TEXT,
    FOREIGN KEY (bai_tap_id) REFERENCES bai_tap(id),
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id)
);

-- 18. CHỨNG CHỈ
CREATE TABLE chung_chi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nguoi_dung_id INTEGER NOT NULL,
    khoa_hoc_id INTEGER NOT NULL,
    ngay_cap TEXT,
    ma_chung_chi TEXT,
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id),
    FOREIGN KEY (khoa_hoc_id) REFERENCES khoa_hoc(id)
);
```

---

## E. KOTLIN DATA MODEL

```kotlin
// ============================================
// MODEL - User.kt
// ============================================
data class User(
    val id: Int,
    val username: String,
    val email: String,
    val password: String,
    val firstName: String,
    val lastName: String,
    val avatarUrl: String?,
    val phone: String?,
    val address: String?,
    val bio: String?,
    val isLocked: Int,
    val joinDate: String,
    val role: String // hoc_vien, giang_vien, admin
)

// ============================================
// MODEL - Category.kt
// ============================================
data class Category(
    val id: Int,
    val name: String
)

// ============================================
// MODEL - Course.kt
// ============================================
data class Course(
    val id: Int,
    val title: String,
    val instructorId: Int,
    val categoryId: Int?,
    val price: Double,
    val maxStudents: Int?,
    val enrolledCount: Int,
    val status: String,
    val description: String?,
    val thumbnailUrl: String?,
    val level: String?,
    val duration: String?,
    val lessonCount: Int,
    val rating: Double
)

// ============================================
// MODEL - Chapter.kt
// ============================================
data class Chapter(
    val id: Int,
    val courseId: Int,
    val title: String,
    val orderIndex: Int
)

// ============================================
// MODEL - Lesson.kt
// ============================================
data class Lesson(
    val id: Int,
    val chapterId: Int,
    val title: String,
    val videoUrl: String?,
    val type: String, // video, document, quiz, exercise
    val duration: String?,
    val content: String?
)

// ============================================
// MODEL - Enrollment.kt
// ============================================
data class Enrollment(
    val id: Int,
    val userId: Int,
    val courseId: Int,
    val enrollDate: String
)

// ============================================
// MODEL - Quiz.kt
// ============================================
data class Quiz(
    val id: Int,
    val lessonId: Int,
    val title: String,
    val timeLimit: Int?, // minutes
    val questionCount: Int
)

// ============================================
// MODEL - QuizQuestion.kt
// ============================================
data class QuizQuestion(
    val id: Int,
    val quizId: Int,
    val question: String,
    val options: String, // JSON: "a:Option1,b:Option2,c:Option3,d:Option4"
    val correctAnswer: String
)

// ============================================
// MODEL - QuizAttempt.kt
// ============================================
data class QuizAttempt(
    val id: Int,
    val quizId: Int,
    val userId: Int,
    val score: Double,
    val attemptDate: String
)

// ============================================
// MODEL - Order.kt
// ============================================
data class Order(
    val id: Int,
    val userId: Int,
    val totalAmount: Double,
    val status: String,
    val orderDate: String
)

// ============================================
// MODEL - OrderItem.kt
// ============================================
data class OrderItem(
    val id: Int,
    val orderId: Int,
    val courseId: Int,
    val price: Double
)

// ============================================
// MODEL - Comment.kt
// ============================================
data class Comment(
    val id: Int,
    val lessonId: Int,
    val userId: Int,
    val content: String,
    val parentId: Int?,
    val createdAt: String
)

// ============================================
// MODEL - Progress.kt
// ============================================
data class Progress(
    val userId: Int,
    val lessonId: Int,
    val completed: Int,
    val completedAt: String?
)

// ============================================
// MODEL - Notification.kt
// ============================================
data class Notification(
    val id: Int,
    val userId: Int,
    val title: String,
    val content: String,
    val type: String,
    val isRead: Int,
    val createdAt: String,
    val link: String?
)
```

---

## F. DATABASE HELPER (SEED DATA)

```kotlin
// ============================================
// DATABASE - DatabaseHelper.kt
// ============================================
package com.lms.app.database

import android.content.ContentValues
import android.content.Context
import android.database.Cursor
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class DatabaseHelper(context: Context) : SQLiteOpenHelper(context, DB_NAME, null, DB_VERSION) {

    companion object {
        const val DB_NAME = "lms.db"
        const val DB_VERSION = 1
    }

    override fun onCreate(db: SQLiteDatabase) {
        // Create tables
        db.execSQL("""
            CREATE TABLE nguoi_dung (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ten_dang_nhap TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                mat_khau TEXT NOT NULL,
                ho TEXT NOT NULL,
                ten TEXT NOT NULL,
                anh_dai_dien TEXT,
                so_dien_thoai TEXT,
                dia_chi TEXT,
                gioi_thieu TEXT,
                bi_khoa INTEGER DEFAULT 0,
                ngay_tham_gia TEXT,
                vai_tro TEXT DEFAULT 'hoc_vien'
            )
        """)

        db.execSQL("""
            CREATE TABLE danh_muc (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ten TEXT NOT NULL
            )
        """)

        db.execSQL("""
            CREATE TABLE khoa_hoc (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tieu_de TEXT NOT NULL,
                giang_vien_id INTEGER NOT NULL,
                danh_muc_id INTEGER,
                gia REAL NOT NULL,
                so_luong_toi_da INTEGER,
                so_luong_da_dang_ky INTEGER DEFAULT 0,
                trang_thai TEXT DEFAULT 'draft',
                mo_ta TEXT,
                thumbnail TEXT,
                muc_do TEXT,
                thoi_luong TEXT,
                so_bai_hoc INTEGER DEFAULT 0,
                xep_hang REAL DEFAULT 0,
                FOREIGN KEY (giang_vien_id) REFERENCES nguoi_dung(id),
                FOREIGN KEY (danh_muc_id) REFERENCES danh_muc(id)
            )
        """)

        db.execSQL("""
            CREATE TABLE chuong_hoc (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                khoa_hoc_id INTEGER NOT NULL,
                tieu_de TEXT,
                thu_tu INTEGER,
                FOREIGN KEY (khoa_hoc_id) REFERENCES khoa_hoc(id)
            )
        """)

        db.execSQL("""
            CREATE TABLE bai_hoc (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                chuong_hoc_id INTEGER NOT NULL,
                tieu_de TEXT,
                video_url TEXT,
                loai TEXT DEFAULT 'video',
                thoi_luong TEXT,
                noi_dung TEXT,
                FOREIGN KEY (chuong_hoc_id) REFERENCES chuong_hoc(id)
            )
        """)

        db.execSQL("""
            CREATE TABLE dang_ky_khoa_hoc (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nguoi_dung_id INTEGER NOT NULL,
                khoa_hoc_id INTEGER NOT NULL,
                ngay_dang_ky TEXT,
                UNIQUE(nguoi_dung_id, khoa_hoc_id),
                FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id),
                FOREIGN KEY (khoa_hoc_id) REFERENCES khoa_hoc(id)
            )
        """)

        db.execSQL("""
            CREATE TABLE tien_do_bai_hoc (
                nguoi_dung_id INTEGER NOT NULL,
                bai_hoc_id INTEGER NOT NULL,
                da_hoan_thanh INTEGER DEFAULT 0,
                ngay_hoan_thanh TEXT,
                PRIMARY KEY (nguoi_dung_id, bai_hoc_id),
                FOREIGN KEY (bai_hoc_id) REFERENCES bai_hoc(id)
            )
        """)

        db.execSQL("""
            CREATE TABLE don_hang (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nguoi_dung_id INTEGER NOT NULL,
                tong_tien REAL,
                trang_thai TEXT DEFAULT 'pending',
                ngay_dat TEXT,
                FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id)
            )
        """)

        db.execSQL("""
            CREATE TABLE chi_tiet_don_hang (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                don_hang_id INTEGER NOT NULL,
                khoa_hoc_id INTEGER NOT NULL,
                gia REAL,
                FOREIGN KEY (don_hang_id) REFERENCES don_hang(id),
                FOREIGN KEY (khoa_hoc_id) REFERENCES khoa_hoc(id)
            )
        """)

        db.execSQL("""
            CREATE TABLE thanh_toan (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                don_hang_id INTEGER NOT NULL,
                so_tien REAL,
                trang_thai TEXT DEFAULT 'pending',
                ngay_thanh_toan TEXT,
                phuong_thuc TEXT,
                FOREIGN KEY (don_hang_id) REFERENCES don_hang(id)
            )
        """)

        db.execSQL("""
            CREATE TABLE binh_luan (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                bai_hoc_id INTEGER NOT NULL,
                nguoi_dung_id INTEGER NOT NULL,
                noi_dung TEXT,
                parent_id INTEGER,
                ngay_tao TEXT,
                FOREIGN KEY (bai_hoc_id) REFERENCES bai_hoc(id),
                FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id)
            )
        """)

        db.execSQL("""
            CREATE TABLE thong_bao (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nguoi_dung_id INTEGER NOT NULL,
                tieu_de TEXT,
                noi_dung TEXT,
                loai TEXT DEFAULT 'info',
                da_doc INTEGER DEFAULT 0,
                ngay_tao TEXT,
                link TEXT,
                FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id)
            )
        """)

        db.execSQL("""
            CREATE TABLE bai_kiem_tra (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                bai_hoc_id INTEGER NOT NULL,
                tieu_de TEXT,
                thoi_gian_lam INTEGER,
                so_cau_hoi INTEGER,
                FOREIGN KEY (bai_hoc_id) REFERENCES bai_hoc(id)
            )
        """)

        db.execSQL("""
            CREATE TABLE cau_hoi (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                quiz_id INTEGER NOT NULL,
                cau_hoi TEXT,
                lua_chon TEXT,
                dap_an_dung TEXT,
                FOREIGN KEY (quiz_id) REFERENCES bai_kiem_tra(id)
            )
        """)

        db.execSQL("""
            CREATE TABLE lam_bai (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                quiz_id INTEGER NOT NULL,
                nguoi_dung_id INTEGER NOT NULL,
                diem REAL,
                ngay_lam TEXT,
                FOREIGN KEY (quiz_id) REFERENCES bai_kiem_tra(id),
                FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id)
            )
        """)

        db.execSQL("""
            CREATE TABLE bai_tap (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                bai_hoc_id INTEGER NOT NULL,
                tieu_de TEXT,
                mo_ta TEXT,
                bat_buoc INTEGER DEFAULT 0,
                han_nop TEXT,
                FOREIGN KEY (bai_hoc_id) REFERENCES bai_hoc(id)
            )
        """)

        db.execSQL("""
            CREATE TABLE nop_bai (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                bai_tap_id INTEGER NOT NULL,
                nguoi_dung_id INTEGER NOT NULL,
                noi_dung TEXT,
                file_dinh_kem TEXT,
                diem REAL,
                nhan_xet TEXT,
                ngay_nop TEXT,
                FOREIGN KEY (bai_tap_id) REFERENCES bai_tap(id),
                FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id)
            )
        """)

        db.execSQL("""
            CREATE TABLE chung_chi (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nguoi_dung_id INTEGER NOT NULL,
                khoa_hoc_id INTEGER NOT NULL,
                ngay_cap TEXT,
                ma_chung_chi TEXT,
                FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id),
                FOREIGN KEY (khoa_hoc_id) REFERENCES khoa_hoc(id)
            )
        """)

        // Seed mock data
        seedMockData(db)
    }

    private fun seedMockData(db: SQLiteDatabase) {
        // Users
        db.execSQL("""
            INSERT INTO nguoi_dung (id, ten_dang_nhap, email, mat_khau, ho, ten, anh_dai_dien, so_dien_thoai, dia_chi, gioi_thieu, bi_khoa, ngay_tham_gia, vai_tro)
            VALUES (1, 'user', 'user@example.com', 'user', 'Nguyen', 'User', 'https://picsum.photos/seed/user/100/100', '0912345678', 'Ho Chi Minh City', 'Học viên yêu công nghệ', 0, '2025-01-15', 'hoc_vien')
        """)
        db.execSQL("""
            INSERT INTO nguoi_dung (id, ten_dang_nhap, email, mat_khau, ho, ten, anh_dai_dien, bi_khoa, ngay_tham_gia, vai_tro)
            VALUES (2, 'admin', 'admin@example.com', 'admin', 'Tran', 'Admin', 'https://picsum.photos/seed/admin/100/100', 0, '2024-06-01', 'admin')
        """)
        db.execSQL("""
            INSERT INTO nguoi_dung (id, ten_dang_nhap, email, mat_khau, ho, ten, anh_dai_dien, so_dien_thoai, gioi_thieu, bi_khoa, ngay_tham_gia, vai_tro)
            VALUES (3, 'teacher', 'teacher@example.com', 'teacher', 'Le', 'Teacher', 'https://picsum.photos/seed/teacher/100/100', '0987654321', 'Giảng viên chuyên nghiệp với 10 năm kinh nghiệm', 0, '2024-03-10', 'giang_vien')
        """)
        db.execSQL("""
            INSERT INTO nguoi_dung (id, ten_dang_nhap, email, mat_khau, ho, ten, anh_dai_dien, bi_khoa, ngay_tham_gia, vai_tro)
            VALUES (4, 'teacher2', 'teacher2@example.com', 'teacher2', 'Pham', 'Thi B', 'https://picsum.photos/seed/teacher2/100/100', 0, '2024-05-20', 'giang_vien')
        """)

        // Categories
        db.execSQL("INSERT INTO danh_muc (id, ten) VALUES (1, 'Lập trình')")
        db.execSQL("INSERT INTO danh_muc (id, ten) VALUES (2, 'Thiết kế')")
        db.execSQL("INSERT INTO danh_muc (id, ten) VALUES (3, 'Marketing')")
        db.execSQL("INSERT INTO danh_muc (id, ten) VALUES (4, 'Kinh doanh')")

        // Courses
        db.execSQL("""
            INSERT INTO khoa_hoc (id, tieu_de, giang_vien_id, danh_muc_id, gia, so_luong_toi_da, so_luong_da_dang_ky, trang_thai, mo_ta, thumbnail, muc_do, thoi_luong, so_bai_hoc, xep_hang)
            VALUES (1, 'React & Next.js Full Course', 3, 1, 699000, 1000, 1250, 'completed', 'Khóa học toàn diện về React và Next.js, từ cơ bản đến nâng cao', 'https://picsum.photos/seed/react/300/200', 'Trung cấp', '40 giờ', 120, 4.8)
        """)
        db.execSQL("""
            INSERT INTO khoa_hoc (id, tieu_de, giang_vien_id, danh_muc_id, gia, so_luong_da_dang_ky, trang_thai, mo_ta, thumbnail, muc_do, thoi_luong, so_bai_hoc, xep_hang)
            VALUES (2, 'TypeScript Fundamentals', 3, 1, 499000, 890, 'completed', 'Khóa học TypeScript cơ bản', 'https://picsum.photos/seed/ts/300/200', 'Cơ bản', '20 giờ', 60, 4.9)
        """)
        db.execSQL("""
            INSERT INTO khoa_hoc (id, tieu_de, giang_vien_id, danh_muc_id, gia, so_luong_da_dang_ky, trang_thai, mo_ta, thumbnail, muc_do, thoi_luong, so_bai_hoc, xep_hang)
            VALUES (3, 'Node.js Backend Development', 4, 1, 799000, 2100, 'completed', 'Khóa học Node.js nâng cao', 'https://picsum.photos/seed/node/300/200', 'Nâng cao', '50 giờ', 150, 4.7)
        """)

        // Chapters (Course 1)
        db.execSQL("INSERT INTO chuong_hoc (id, khoa_hoc_id, tieu_de, thu_tu) VALUES (1, 1, 'Giới thiệu React', 1)")
        db.execSQL("INSERT INTO chuong_hoc (id, khoa_hoc_id, tieu_de, thu_tu) VALUES (2, 1, 'JSX và Components', 2)")
        db.execSQL("INSERT INTO chuong_hoc (id, khoa_hoc_id, tieu_de, thu_tu) VALUES (3, 1, 'State và Props', 3)")
        db.execSQL("INSERT INTO chuong_hoc (id, khoa_hoc_id, tieu_de, thu_tu) VALUES (4, 1, 'React Hooks', 4)")
        db.execSQL("INSERT INTO chuong_hoc (id, khoa_hoc_id, tieu_de, thu_tu) VALUES (5, 1, 'Next.js Basics', 5)")

        // Chapters (Course 2)
        db.execSQL("INSERT INTO chuong_hoc (id, khoa_hoc_id, tieu_de, thu_tu) VALUES (6, 2, 'TypeScript Overview', 1)")
        db.execSQL("INSERT INTO chuong_hoc (id, khoa_hoc_id, tieu_de, thu_tu) VALUES (7, 2, 'Type System', 2)")
        db.execSQL("INSERT INTO chuong_hoc (id, khoa_hoc_id, tieu_de, thu_tu) VALUES (8, 2, 'Advanced Types', 3)")

        // Lessons (Chapter 1 - React Intro)
        db.execSQL("INSERT INTO bai_hoc (id, chuong_hoc_id, tieu_de, video_url, loai, thoi_luong) VALUES (1, 1, 'React là gì?', 'https://example.com/video/1', 'video', '10:00')")
        db.execSQL("INSERT INTO bai_hoc (id, chuong_hoc_id, tieu_de, video_url, loai, thoi_luong) VALUES (2, 1, 'Cài đặt môi trường', 'https://example.com/video/2', 'video', '15:30')")
        db.execSQL("INSERT INTO bai_hoc (id, chuong_hoc_id, tieu_de, video_url, loai, thoi_luong) VALUES (3, 1, 'Tạo project đầu tiên', 'https://example.com/video/3', 'video', '20:00')")

        // Lessons (Chapter 2 - JSX)
        db.execSQL("INSERT INTO bai_hoc (id, chuong_hoc_id, tieu_de, video_url, loai, thoi_luong) VALUES (4, 2, 'JSX Syntax', 'https://example.com/video/4', 'video', '12:00')")
        db.execSQL("INSERT INTO bai_hoc (id, chuong_hoc_id, tieu_de, video_url, loai, thoi_luong) VALUES (5, 2, 'Components cơ bản', 'https://example.com/video/5', 'video', '18:00')")
        db.execSQL("INSERT INTO bai_hoc (id, chuong_hoc_id, tieu_de, loai) VALUES (6, 2, 'Quiz chương 2', 'quiz')")

        // Lessons (Chapter 3 - State & Props)
        db.execSQL("INSERT INTO bai_hoc (id, chuong_hoc_id, tieu_de, video_url, loai, thoi_luong) VALUES (7, 3, 'useState hook', 'https://example.com/video/7', 'video', '25:00')")
        db.execSQL("INSERT INTO bai_hoc (id, chuong_hoc_id, tieu_de, video_url, loai, thoi_luong) VALUES (8, 3, 'Props trong React', 'https://example.com/video/8', 'video', '15:00')")
        db.execSQL("INSERT INTO bai_hoc (id, chuong_hoc_id, tieu_de, loai) VALUES (9, 3, 'Bài tập useState', 'exercise')")

        // Enrollments
        db.execSQL("INSERT INTO dang_ky_khoa_hoc (id, nguoi_dung_id, khoa_hoc_id, ngay_dang_ky) VALUES (1, 1, 1, '2025-02-01')")
        db.execSQL("INSERT INTO dang_ky_khoa_hoc (id, nguoi_dung_id, khoa_hoc_id, ngay_dang_ky) VALUES (2, 1, 2, '2025-02-15')")
        db.execSQL("INSERT INTO dang_ky_khoa_hoc (id, nguoi_dung_id, khoa_hoc_id, ngay_dang_ky) VALUES (3, 1, 3, '2025-03-01')")

        // Progress
        db.execSQL("INSERT INTO tien_do_bai_hoc (nguoi_dung_id, bai_hoc_id, da_hoan_thanh, ngay_hoan_thanh) VALUES (1, 1, 1, '2025-02-02')")
        db.execSQL("INSERT INTO tien_do_bai_hoc (nguoi_dung_id, bai_hoc_id, da_hoan_thanh, ngay_hoan_thanh) VALUES (1, 2, 1, '2025-02-03')")
        db.execSQL("INSERT INTO tien_do_bai_hoc (nguoi_dung_id, bai_hoc_id, da_hoan_thanh, ngay_hoan_thanh) VALUES (1, 3, 1, '2025-02-04')")
        db.execSQL("INSERT INTO tien_do_bai_hoc (nguoi_dung_id, bai_hoc_id, da_hoan_thanh, ngay_hoan_thanh) VALUES (1, 4, 1, '2025-02-05')")
        db.execSQL("INSERT INTO tien_do_bai_hoc (nguoi_dung_id, bai_hoc_id, da_hoan_thanh) VALUES (1, 5, 0)")
        db.execSQL("INSERT INTO tien_do_bai_hoc (nguoi_dung_id, bai_hoc_id, da_hoan_thanh) VALUES (1, 6, 0)")

        // Orders
        db.execSQL("INSERT INTO don_hang (id, nguoi_dung_id, tong_tien, trang_thai, ngay_dat) VALUES (1, 1, 699000, 'success', '2025-02-01')")
        db.execSQL("INSERT INTO don_hang (id, nguoi_dung_id, tong_tien, trang_thai, ngay_dat) VALUES (2, 1, 499000, 'success', '2025-02-15')")
        db.execSQL("INSERT INTO don_hang (id, nguoi_dung_id, tong_tien, trang_thai, ngay_dat) VALUES (3, 1, 799000, 'success', '2025-03-01')")

        // Order Items
        db.execSQL("INSERT INTO chi_tiet_don_hang (id, don_hang_id, khoa_hoc_id, gia) VALUES (1, 1, 1, 699000)")
        db.execSQL("INSERT INTO chi_tiet_don_hang (id, don_hang_id, khoa_hoc_id, gia) VALUES (2, 2, 2, 499000)")
        db.execSQL("INSERT INTO chi_tiet_don_hang (id, don_hang_id, khoa_hoc_id, gia) VALUES (3, 3, 3, 799000)")

        // Payments
        db.execSQL("INSERT INTO thanh_toan (id, don_hang_id, so_tien, trang_thai, ngay_thanh_toan, phuong_thuc) VALUES (1, 1, 699000, 'success', '2025-02-01', 'vnpay')")
        db.execSQL("INSERT INTO thanh_toan (id, don_hang_id, so_tien, trang_thai, ngay_thanh_toan, phuong_thuc) VALUES (2, 2, 499000, 'success', '2025-02-15', 'vnpay')")
        db.execSQL("INSERT INTO thanh_toan (id, don_hang_id, so_tien, trang_thai, ngay_thanh_toan, phuong_thuc) VALUES (3, 3, 799000, 'success', '2025-03-01', 'stripe')")

        // Comments
        db.execSQL("INSERT INTO binh_luan (id, bai_hoc_id, nguoi_dung_id, noi_dung, ngay_tao) VALUES (1, 1, 1, 'Bài giảng rất dễ hiểu!', '2025-02-02')")
        db.execSQL("INSERT INTO binh_luan (id, bai_hoc_id, nguoi_dung_id, noi_dung, ngay_tao) VALUES (2, 1, 2, 'Cảm ơn giảng viên', '2025-02-03')")
        db.execSQL("INSERT INTO binh_luan (id, bai_hoc_id, nguoi_dung_id, noi_dung, parent_id, ngay_tao) VALUES (3, 1, 3, 'Cảm ơn phản hồi!', 1, '2025-02-04')")
        db.execSQL("INSERT INTO binh_luan (id, bai_hoc_id, nguoi_dung_id, noi_dung, ngay_tao) VALUES (4, 4, 1, 'JSX syntax khá thú vị', '2025-02-05')")

        // Notifications
        db.execSQL("INSERT INTO thong_bao (id, nguoi_dung_id, tieu_de, noi_dung, loai, da_doc, ngay_tao, link) VALUES (1, 1, 'Đăng ký khóa học thành công', 'Bạn đã đăng ký khóa React & Next.js Full Course', 'success', 0, '2025-02-01', '/my-courses')")
        db.execSQL("INSERT INTO thong_bao (id, nguoi_dung_id, tieu_de, noi_dung, loai, da_doc, ngay_tao, link) VALUES (2, 1, 'Khóa học mới', 'Khóa TypeScript Fundamentals đã được cập nhật', 'info', 1, '2025-02-10', '/course/2')")
        db.execSQL("INSERT INTO thong_bao (id, nguoi_dung_id, tieu_de, noi_dung, loai, da_doc, ngay_tao, link) VALUES (3, 1, 'Nhắc nhở', 'Hãy hoàn thành bài tập tuần này', 'warning', 1, '2025-02-15', '/assignments')")

        // Quizzes
        db.execSQL("INSERT INTO bai_kiem_tra (id, bai_hoc_id, tieu_de, thoi_gian_lam, so_cau_hoi) VALUES (1, 6, 'Quiz chương 2: JSX và Components', 15, 10)")
        db.execSQL("INSERT INTO bai_kiem_tra (id, bai_hoc_id, tieu_de, thoi_gian_lam, so_cau_hoi) VALUES (2, 7, 'Quiz chương 3: State và Props', 20, 15)")

        // Quiz Questions
        db.execSQL("INSERT INTO cau_hoi (id, quiz_id, cau_hoi, lua_chon, dap_an_dung) VALUES (1, 1, 'JSX là gì?', 'a:JavaScript XML,b:Java Syntax Extension,c:JavaScript Extension,d:JavaScript Extra', 'c')")
        db.execSQL("INSERT INTO cau_hoi (id, quiz_id, cau_hoi, lua_chon, dap_an_dung) VALUES (2, 1, 'Để render JSX trong React ta dùng?', 'a:render(),b:ReactDOM.render(),c:React.render(),d:renderDOM()', 'b')")
        db.execSQL("INSERT INTO cau_hoi (id, quiz_id, cau_hoi, lua_chon, dap_an_dung) VALUES (3, 1, 'Component trong React là gì?', 'a:Một hàm JavaScript,b:Một đối tượng JavaScript,c:Một khối code có thể tái sử dụng,d:Một file HTML', 'c')")

        // Quiz Attempts
        db.execSQL("INSERT INTO lam_bai (id, quiz_id, nguoi_dung_id, diem, ngay_lam) VALUES (1, 1, 1, 8, '2025-02-05')")

        // Assignments
        db.execSQL("INSERT INTO bai_tap (id, bai_hoc_id, tieu_de, mo_ta, bat_buoc, han_nop) VALUES (1, 9, 'Bài tập useState', 'Tạo counter app sử dụng useState', 1, '2025-02-20')")
        db.execSQL("INSERT INTO bai_tap (id, bai_hoc_id, tieu_de, mo_ta, bat_buoc, han_nop) VALUES (2, 9, 'Bài tập Props', 'Tạo component hiển thị thông tin user', 0, '2025-02-25')")

        // Assignment Submissions
        db.execSQL("INSERT INTO nop_bai (id, bai_tap_id, nguoi_dung_id, noi_dung, diem, nhan_xet, ngay_nop) VALUES (1, 1, 1, 'Đã hoàn thành bài tập', 9, 'Làm tốt lắm!', '2025-02-15')")

        // Certificates
        db.execSQL("INSERT INTO chung_chi (id, nguoi_dung_id, khoa_hoc_id, ngay_cap, ma_chung_chi) VALUES (1, 1, 1, '2025-03-01', 'LMS-2025-001')")
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS nguoi_dung")
        db.execSQL("DROP TABLE IF EXISTS danh_muc")
        db.execSQL("DROP TABLE IF EXISTS khoa_hoc")
        db.execSQL("DROP TABLE IF EXISTS chuong_hoc")
        db.execSQL("DROP TABLE IF EXISTS bai_hoc")
        db.execSQL("DROP TABLE IF EXISTS dang_ky_khoa_hoc")
        db.execSQL("DROP TABLE IF EXISTS tien_do_bai_hoc")
        db.execSQL("DROP TABLE IF EXISTS don_hang")
        db.execSQL("DROP TABLE IF EXISTS chi_tiet_don_hang")
        db.execSQL("DROP TABLE IF EXISTS thanh_toan")
        db.execSQL("DROP TABLE IF EXISTS binh_luan")
        db.execSQL("DROP TABLE IF EXISTS thong_bao")
        db.execSQL("DROP TABLE IF EXISTS bai_kiem_tra")
        db.execSQL("DROP TABLE IF EXISTS cau_hoi")
        db.execSQL("DROP TABLE IF EXISTS lam_bai")
        db.execSQL("DROP TABLE IF EXISTS bai_tap")
        db.execSQL("DROP TABLE IF EXISTS nop_bai")
        db.execSQL("DROP TABLE IF EXISTS chung_chi")
        onCreate(db)
    }

    // ================ HELPER METHODS ================

    fun login(username: String, password: String): User? {
        val db = readableDatabase
        val cursor = db.query("nguoi_dung", null, "ten_dang_nhap=? AND mat_khau=?",
            arrayOf(username, password), null, null, null)
        return cursor.use {
            if (it.moveToFirst()) cursorToUser(it) else null
        }
    }

    fun getUserById(id: Int): User? {
        val db = readableDatabase
        val cursor = db.query("nguoi_dung", null, "id=?", arrayOf(id.toString()), null, null, null)
        return cursor.use {
            if (it.moveToFirst()) cursorToUser(it) else null
        }
    }

    fun getAllCourses(): List<Course> {
        val courses = mutableListOf<Course>()
        val db = readableDatabase
        val cursor = db.query("khoa_hoc", null, "trang_thai=?", arrayOf("completed"), null, null, "xep_hang DESC")
        cursor.use {
            while (it.moveToNext()) {
                courses.add(cursorToCourse(it))
            }
        }
        return courses
    }

    fun getCourseById(id: Int): Course? {
        val db = readableDatabase
        val cursor = db.query("khoa_hoc", null, "id=?", arrayOf(id.toString()), null, null, null)
        return cursor.use {
            if (it.moveToFirst()) cursorToCourse(it) else null
        }
    }

    fun getChaptersByCourseId(courseId: Int): List<Chapter> {
        val chapters = mutableListOf<Chapter>()
        val db = readableDatabase
        val cursor = db.query("chuong_hoc", null, "khoa_hoc_id=?", arrayOf(courseId.toString()), null, null, "thu_tu")
        cursor.use {
            while (it.moveToNext()) {
                chapters.add(cursorToChapter(it))
            }
        }
        return chapters
    }

    fun getLessonsByChapterId(chapterId: Int): List<Lesson> {
        val lessons = mutableListOf<Lesson>()
        val db = readableDatabase
        val cursor = db.query("bai_hoc", null, "chuong_hoc_id=?", arrayOf(chapterId.toString()), null, null, null)
        cursor.use {
            while (it.moveToNext()) {
                lessons.add(cursorToLesson(it))
            }
        }
        return lessons
    }

    fun getEnrollmentsByUserId(userId: Int): List<Enrollment> {
        val enrollments = mutableListOf<Enrollment>()
        val db = readableDatabase
        val cursor = db.query("dang_ky_khoa_hoc", null, "nguoi_dung_id=?", arrayOf(userId.toString()), null, null, "ngay_dang_ky DESC")
        cursor.use {
            while (it.moveToNext()) {
                enrollments.add(cursorToEnrollment(it))
            }
        }
        return enrollments
    }

    fun enrollCourse(userId: Int, courseId: Int): Long {
        val db = writableDatabase
        val values = ContentValues().apply {
            put("nguoi_dung_id", userId)
            put("khoa_hoc_id", courseId)
            put("ngay_dang_ky", java.text.SimpleDateFormat("yyyy-MM-dd").format(java.util.Date()))
        }
        return db.insert("dang_ky_khoa_hoc", null, values)
    }

    fun updateProgress(userId: Int, lessonId: Int, completed: Boolean): Int {
        val db = writableDatabase
        val values = ContentValues().apply {
            put("da_hoan_thanh", if (completed) 1 else 0)
            put("ngay_hoan_thanh", if (completed) java.text.SimpleDateFormat("yyyy-MM-dd").format(java.util.Date()) else null)
        }
        return db.update("tien_do_bai_hoc", values, "nguoi_dung_id=? AND bai_hoc_id=?", arrayOf(userId.toString(), lessonId.toString()))
    }

    fun isLessonCompleted(userId: Int, lessonId: Int): Boolean {
        val db = readableDatabase
        val cursor = db.query("tien_do_bai_hoc", null, "nguoi_dung_id=? AND bai_hoc_id=? AND da_hoan_thanh=1",
            arrayOf(userId.toString(), lessonId.toString()), null, null, null)
        return cursor.use { it.count > 0 }
    }

    fun createOrder(userId: Int, courseId: Int, totalAmount: Double): Long {
        val db = writableDatabase
        val orderId = db.insert("don_hang", null, ContentValues().apply {
            put("nguoi_dung_id", userId)
            put("tong_tien", totalAmount)
            put("trang_thai", "pending")
            put("ngay_dat", java.text.SimpleDateFormat("yyyy-MM-dd").format(java.util.Date()))
        })
        db.insert("chi_tiet_don_hang", null, ContentValues().apply {
            put("don_hang_id", orderId)
            put("khoa_hoc_id", courseId)
            put("gia", totalAmount)
        })
        return orderId
    }

    fun getQuizByLessonId(lessonId: Int): Quiz? {
        val db = readableDatabase
        val cursor = db.query("bai_kiem_tra", null, "bai_hoc_id=?", arrayOf(lessonId.toString()), null, null, null)
        return cursor.use {
            if (it.moveToFirst()) cursorToQuiz(it) else null
        }
    }

    fun getQuestionsByQuizId(quizId: Int): List<QuizQuestion> {
        val questions = mutableListOf<QuizQuestion>()
        val db = readableDatabase
        val cursor = db.query("cau_hoi", null, "quiz_id=?", arrayOf(quizId.toString()), null, null, null)
        cursor.use {
            while (it.moveToNext()) {
                questions.add(cursorToQuizQuestion(it))
            }
        }
        return questions
    }

    fun saveQuizAttempt(quizId: Int, userId: Int, score: Double): Long {
        val db = writableDatabase
        return db.insert("lam_bai", null, ContentValues().apply {
            put("quiz_id", quizId)
            put("nguoi_dung_id", userId)
            put("diem", score)
            put("ngay_lam", java.text.SimpleDateFormat("yyyy-MM-dd").format(java.util.Date()))
        })
    }

    fun getNotifications(userId: Int): List<Notification> {
        val notifications = mutableListOf<Notification>()
        val db = readableDatabase
        val cursor = db.query("thong_bao", null, "nguoi_dung_id=?", arrayOf(userId.toString()), null, null, "ngay_tao DESC")
        cursor.use {
            while (it.moveToNext()) {
                notifications.add(cursorToNotification(it))
            }
        }
        return notifications
    }

    fun getCategories(): List<Category> {
        val categories = mutableListOf<Category>()
        val db = readableDatabase
        val cursor = db.query("danh_muc", null, null, null, null, null, null, null)
        cursor.use {
            while (it.moveToNext()) {
                categories.add(Category(it.getInt(0), it.getString(1)))
            }
        }
        return categories
    }

    // ================ CURSOR MAPPERS ================

    private fun cursorToUser(cursor: Cursor): User {
        return User(
            id = cursor.getInt(cursor.getColumnIndexOrThrow("id")),
            username = cursor.getString(cursor.getColumnIndexOrThrow("ten_dang_nhap")),
            email = cursor.getString(cursor.getColumnIndexOrThrow("email")),
            password = cursor.getString(cursor.getColumnIndexOrThrow("mat_khau")),
            firstName = cursor.getString(cursor.getColumnIndexOrThrow("ten")),
            lastName = cursor.getString(cursor.getColumnIndexOrThrow("ho")),
            avatarUrl = cursor.getString(cursor.getColumnIndexOrThrow("anh_dai_dien")),
            phone = cursor.getString(cursor.getColumnIndexOrThrow("so_dien_thoai")),
            address = cursor.getString(cursor.getColumnIndexOrThrow("dia_chi")),
            bio = cursor.getString(cursor.getColumnIndexOrThrow("gioi_thieu")),
            isLocked = cursor.getInt(cursor.getColumnIndexOrThrow("bi_khoa")),
            joinDate = cursor.getString(cursor.getColumnIndexOrThrow("ngay_tham_gia")),
            role = cursor.getString(cursor.getColumnIndexOrThrow("vai_tro"))
        )
    }

    private fun cursorToCourse(cursor: Cursor): Course {
        return Course(
            id = cursor.getInt(cursor.getColumnIndexOrThrow("id")),
            title = cursor.getString(cursor.getColumnIndexOrThrow("tieu_de")),
            instructorId = cursor.getInt(cursor.getColumnIndexOrThrow("giang_vien_id")),
            categoryId = cursor.getInt(cursor.getColumnIndexOrThrow("danh_muc_id")),
            price = cursor.getDouble(cursor.getColumnIndexOrThrow("gia")),
            maxStudents = cursor.getInt(cursor.getColumnIndexOrThrow("so_luong_toi_da")),
            enrolledCount = cursor.getInt(cursor.getColumnIndexOrThrow("so_luong_da_dang_ky")),
            status = cursor.getString(cursor.getColumnIndexOrThrow("trang_thai")),
            description = cursor.getString(cursor.getColumnIndexOrThrow("mo_ta")),
            thumbnailUrl = cursor.getString(cursor.getColumnIndexOrThrow("thumbnail")),
            level = cursor.getString(cursor.getColumnIndexOrThrow("muc_do")),
            duration = cursor.getString(cursor.getColumnIndexOrThrow("thoi_luong")),
            lessonCount = cursor.getInt(cursor.getColumnIndexOrThrow("so_bai_hoc")),
            rating = cursor.getDouble(cursor.getColumnIndexOrThrow("xep_hang"))
        )
    }

    private fun cursorToChapter(cursor: Cursor): Chapter {
        return Chapter(
            id = cursor.getInt(cursor.getColumnIndexOrThrow("id")),
            courseId = cursor.getInt(cursor.getColumnIndexOrThrow("khoa_hoc_id")),
            title = cursor.getString(cursor.getColumnIndexOrThrow("tieu_de")),
            orderIndex = cursor.getInt(cursor.getColumnIndexOrThrow("thu_tu"))
        )
    }

    private fun cursorToLesson(cursor: Cursor): Lesson {
        return Lesson(
            id = cursor.getInt(cursor.getColumnIndexOrThrow("id")),
            chapterId = cursor.getInt(cursor.getColumnIndexOrThrow("chuong_hoc_id")),
            title = cursor.getString(cursor.getColumnIndexOrThrow("tieu_de")),
            videoUrl = cursor.getString(cursor.getColumnIndexOrThrow("video_url")),
            type = cursor.getString(cursor.getColumnIndexOrThrow("loai")),
            duration = cursor.getString(cursor.getColumnIndexOrThrow("thoi_luong")),
            content = cursor.getString(cursor.getColumnIndexOrThrow("noi_dung"))
        )
    }

    private fun cursorToEnrollment(cursor: Cursor): Enrollment {
        return Enrollment(
            id = cursor.getInt(cursor.getColumnIndexOrThrow("id")),
            userId = cursor.getInt(cursor.getColumnIndexOrThrow("nguoi_dung_id")),
            courseId = cursor.getInt(cursor.getColumnIndexOrThrow("khoa_hoc_id")),
            enrollDate = cursor.getString(cursor.getColumnIndexOrThrow("ngay_dang_ky"))
        )
    }

    private fun cursorToQuiz(cursor: Cursor): Quiz {
        return Quiz(
            id = cursor.getInt(cursor.getColumnIndexOrThrow("id")),
            lessonId = cursor.getInt(cursor.getColumnIndexOrThrow("bai_hoc_id")),
            title = cursor.getString(cursor.getColumnIndexOrThrow("tieu_de")),
            timeLimit = cursor.getInt(cursor.getColumnIndexOrThrow("thoi_gian_lam")),
            questionCount = cursor.getInt(cursor.getColumnIndexOrThrow("so_cau_hoi"))
        )
    }

    private fun cursorToQuizQuestion(cursor: Cursor): QuizQuestion {
        return QuizQuestion(
            id = cursor.getInt(cursor.getColumnIndexOrThrow("id")),
            quizId = cursor.getInt(cursor.getColumnIndexOrThrow("quiz_id")),
            question = cursor.getString(cursor.getColumnIndexOrThrow("cau_hoi")),
            options = cursor.getString(cursor.getColumnIndexOrThrow("lua_chon")),
            correctAnswer = cursor.getString(cursor.getColumnIndexOrThrow("dap_an_dung"))
        )
    }

    private fun cursorToNotification(cursor: Cursor): Notification {
        return Notification(
            id = cursor.getInt(cursor.getColumnIndexOrThrow("id")),
            userId = cursor.getInt(cursor.getColumnIndexOrThrow("nguoi_dung_id")),
            title = cursor.getString(cursor.getColumnIndexOrThrow("tieu_de")),
            content = cursor.getString(cursor.getColumnIndexOrThrow("noi_dung")),
            type = cursor.getString(cursor.getColumnIndexOrThrow("loai")),
            isRead = cursor.getInt(cursor.getColumnIndexOrThrow("da_doc")),
            createdAt = cursor.getString(cursor.getColumnIndexOrThrow("ngay_tao")),
            link = cursor.getString(cursor.getColumnIndexOrThrow("link"))
        )
    }
}
```

---

## G. MOCK DATA SEED

Mock data đã được seed trong `seedMockData()` ở trên (trong DatabaseHelper).

---

## H. DANH SÁCH MÀN HÌNH

| STT | Màn hình | Mục tiêu | Dữ liệu hiển thị | Hành động |
|-----|----------|----------|----------------|----------------|
| 1 | LoginActivity | Đăng nhập | Form login (username, password) | Login → Home |
| 2 | RegisterActivity | Đăng ký | Form register | Register → Login |
| 3 | HomeActivity | Trang chủ | Course list (RecyclerView) | Click course → CourseDetail |
| 4 | StoreActivity | Danh sách khóa học | Course grid + category filter | Search, filter |
| 5 | CourseDetailActivity | Chi tiết khóa học | Course info, chapters, enrolled count | Enroll → MyCourses |
| 6 | MyCoursesActivity | Khóa học đã mua | Enrolled courses list | Click → Learning |
| 7 | LearningActivity | Học bài | Video player, lessons list | Mark complete |
| 8 | QuizActivity | Làm quiz | Questions + answers | Submit → Result |
| 9 | QuizResultActivity | Kết quả quiz | Score | Back → Learning |
| 10 | ProfileActivity | Thông tin user | User info | Edit profile |
| 11 | CartActivity | Giỏ hàng | Cart items | Checkout |

---

## I. USER FLOWS

### Flow 1: Đăng nhập
```
LoginActivity → (success) → HomeActivity
```

### Flow 2: Xem khóa học
```
HomeActivity → StoreActivity → CourseDetailActivity → (enroll) → MyCoursesActivity
```

### Flow 3: Học bài
```
MyCoursesActivity → LearningActivity → VideoPlayer → Mark Complete
```

### Flow 4: Làm quiz
```
LearningActivity → QuizActivity → QuizResultActivity
```

### Flow 5: Xem profile
```
HomeActivity → ProfileActivity
```

---

## J. CẤU TRÚC PROJECT

```
app/
├── src/main/
│   ├── java/com/lms/app/
│   │   ├── model/
│   │   │   ├── User.kt
│   │   │   ├── Category.kt
│   │   │   ├── Course.kt
│   │   │   ├── Chapter.kt
│   │   │   ├── Lesson.kt
│   │   │   ├── Enrollment.kt
│   │   │   ├── Quiz.kt
│   │   │   ├── QuizQuestion.kt
│   │   │   ├── Order.kt
│   │   │   └── Notification.kt
│   │   │
│   │   ├── database/
│   │   │   └── DatabaseHelper.kt
│   │   │
│   │   ├── ui/
│   │   │   ├── login/
│   │   │   │   ├── LoginActivity.kt
│   │   │   │   └── activity_login.xml
│   │   │   │
│   │   │   ├── register/
│   │   │   │   ├── RegisterActivity.kt
│   │   │   │   └── activity_register.xml
│   │   │   │
│   │   │   ├── home/
│   │   │   │   ├── HomeActivity.kt
│   │   │   │   └── activity_home.xml
│   │   │   │
│   │   │   ├── store/
│   │   │   │   ├── StoreActivity.kt
│   │   │   │   ├── activity_store.xml
│   │   │   │   └── item_course.xml
│   │   │   │
│   │   │   ├── course/
│   │   │   │   ├── CourseDetailActivity.kt
│   │   │   │   └── activity_course_detail.xml
│   │   │   │
│   │   │   ├── mycourses/
│   │   │   │   ├── MyCoursesActivity.kt
│   │   │   │   └── activity_my_courses.xml
│   │   │   │
│   │   │   ├── learning/
│   │   │   │   ├── LearningActivity.kt
│   │   │   │   └── activity_learning.xml
│   │   │   │
│   │   │   ├── quiz/
│   │   │   │   ├── QuizActivity.kt
│   │   │   │   ├── QuizResultActivity.kt
│   │   │   │   └── activity_quiz.xml
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   ├── ProfileActivity.kt
│   │   │   │   └── activity_profile.xml
│   │   │   │
│   │   │   └── cart/
│   │   │       ├── CartActivity.kt
│   │   │       └── activity_cart.xml
│   │   │
│   │   ├── adapter/
│   │   │   ├── CourseAdapter.kt
│   │   │   ├── ChapterAdapter.kt
│   │   │   └── QuizAdapter.kt
│   │   │
│   │   └── util/
│   │       └── SessionManager.kt
│   │
│   └── res/
│       ├── layout/
│       ├── values/
│       └── drawable/
│
└── build.gradle
```

---

## K. DANH SÁCH FILE CẦN CODE

### Kotlin Files (41 files)

**Model (12 files):**
- model/User.kt
- model/Category.kt
- model/Course.kt
- model/Chapter.kt
- model/Lesson.kt
- model/Enrollment.kt
- model/Quiz.kt
- model/QuizQuestion.kt
- model/QuizAttempt.kt
- model/Order.kt
- model/OrderItem.kt
- model/Notification.kt

**Database (1 file):**
- database/DatabaseHelper.kt

**UI/Activity (11 files):**
- ui/login/LoginActivity.kt
- ui/register/RegisterActivity.kt
- ui/home/HomeActivity.kt
- ui/store/StoreActivity.kt
- ui/course/CourseDetailActivity.kt
- ui/mycourses/MyCoursesActivity.kt
- ui/learning/LearningActivity.kt
- ui/quiz/QuizActivity.kt
- ui/quiz/QuizResultActivity.kt
- ui/profile/ProfileActivity.kt
- ui/cart/CartActivity.kt

**Adapter (3 files):**
- adapter/CourseAdapter.kt
- adapter/ChapterAdapter.kt
- adapter/QuizAdapter.kt

**Util (1 file):**
- util/SessionManager.kt

### XML Layouts (11 files)

- res/layout/activity_login.xml
- res/layout/activity_register.xml
- res/layout/activity_home.xml
- res/layout/activity_store.xml
- res/layout/activity_course_detail.xml
- res/layout/activity_my_courses.xml
- res/layout/activity_learning.xml
- res/layout/activity_quiz.xml
- res/layout/activity_quiz_result.xml
- res/layout/activity_profile.xml
- res/layout/activity_cart.xml

### Item Layouts (3 files)

- res/layout/item_course.xml
- res/layout/item_chapter.xml
- res/layout/item_quiz_question.xml

---

## L. THỨ TỰ CODE

### Step 1: Project + SQLite Setup
- [ ] Tạo Android Project trong Android Studio
- [ ] Thêm dependencies (Picasso/Coil, RecyclerView)
- [ ] Tạo DatabaseHelper với schema + seed data

### Step 2: Login + User Table
- [ ] LoginActivity + layout
- [ ] RegisterActivity + layout
- [ ] SessionManager (lưu userId)
- [ ] HomeActivity

### Step 3: Home + Course List
- [ ] StoreActivity + CourseAdapter
- [ ] Course list (RecyclerView)
- [ ] Category filter

### Step 4: Course Detail
- [ ] CourseDetailActivity
- [ ] Chapters + Lessons display
- [ ] Enroll button

### Step 5: Learning
- [ ] MyCoursesActivity
- [ ] LearningActivity
- [ ] VideoView player
- [ ] Mark complete

### Step 6: Quiz + Profile
- [ ] QuizActivity
- [ ] QuizResultActivity
- [ ] ProfileActivity
- [ ] CartActivity (optional)

---

## M. QUY TẮC CODE

1. **Đặt tên**: `camelCase` cho Kotlin, `snake_case` cho SQLite
2. **Layout**: Dùng `ConstraintLayout`, `LinearLayout`, `RecyclerView`
3. **Image**: Dùng Picasso hoặc Coil
4. **Video**: Dùng VideoView + MediaController
5. **List**: Dùng RecyclerView + Adapter
6. **Navigation**: Dùng Intent
7. **Data**: SQLite qua SQLiteOpenHelper
8. **Session**: SharedPreferences cho userId

---

## N. OUTPUT CHECKLIST

- [x] A. Tổng quan hệ thống
- [x] B. Entity + dữ liệu
- [x] C. Mapping Web → SQLite → Android
- [x] D. Schema SQLite
- [x] E. Kotlin model
- [x] F. Database helper + Seed
- [x] G. Mock data seed
- [x] H. Danh sách màn hình
- [x] I. User flows
- [x] J. Cấu trúc project
- [x] K. Danh sách file cần code
- [x] L. Thứ tự code
- [x] M. Quy tắc code