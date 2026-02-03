# Luckydraw ES 2025 - Phân tích dự án

Dự án này là một ứng dụng quay số trúng thưởng (Lucky Draw) cho sự kiện ES 2025. Ứng dụng bao gồm giao diện người dùng (Frontend) được xây dựng bằng React và máy chủ (Backend) được xây dựng bằng Node.js.

## 📁 Cấu trúc thư mục

```text
Luckydraw.ES.2025/
├── client/                 # Mã nguồn Frontend (React + Vite)
│   ├── src/
│   │   ├── Components/     # Các thành phần giao diện (Modal, SpinName)
│   │   ├── App.tsx         # Logic chính của ứng dụng và giao diện chính
│   │   ├── App.scss        # Styles cho ứng dụng
│   │   └── main.tsx        # Điểm bắt đầu của React
│   └── package.json        # Các phụ thuộc của Frontend (antd, axios, xlsx)
    ├── server/                 # Mã nguồn Backend (Node.js + Express)
    │   ├── server.js           # Logic xử lý API và quản lý dữ liệu
    │   ├── LuckyUser.json      # Lưu danh sách người đã trúng thưởng (lưu lại sau khi xác nhận)
    │   ├── SelectedUser.json   # Lưu tạm danh sách người đã được chọn trong phiên hiện tại
    │   ├── Final_Checkin_Report.xlsx # File dữ liệu người tham gia mới
    │   └── package.json        # Các phụ thuộc của Backend (express, xlsx)
└── PROJECT_STRUCTURE.md    # File phân tích này
```

## 🛠 Công nghệ sử dụng

- **Frontend**:
  - **React**: Thư viện chính cho UI.
  - **Vite**: Công cụ build cực nhanh.
  - **Ant Design (antd)**: Bộ component UI cho các nút, thông báo, popconfirm.
  - **Axios**: Giao tiếp với API Backend.
  - **Sass (SCSS)**: Xử lý CSS nâng cao.
  - **XLSX**: Đọc dữ liệu từ file Excel (phía client nếu cần).

- **Backend**:
  - **Node.js & Express**: Máy chủ API.
  - **XLSX**: Đọc file Excel `Checkin_2025.xlsx` để lấy danh sách người tham gia.
  - **CORS & Body-parser**: Middleware cho API.

## 🚀 Logic chính của ứng dụng

### 1. Quản lý người tham gia
Dữ liệu người tham gia được đọc từ file Excel mới đặt tại: `server/Final_Checkin_Report.xlsx`.
Mỗi người dùng có các trường chính: `ID`, `FULLNAME`, `EMAIL`, `ACCOUNT`, `IMAGE`, v.v. Các trường này được Backend chuẩn hóa sang `Id`, `FullName`, `Email` để đồng bộ với Frontend.

### 2. Quy trình quay thưởng
1. **Bắt đầu**: Người dùng nhấn nút "Quay thưởng" trên UI.
2. **Chọn người**: Frontend gọi API `/get-lucky-user`.
3. **Backend xử lý**:
   - Đọc danh sách tất cả người dùng từ Excel.
   - Đọc danh sách những người đã được chọn từ `SelectedUser.json`.
   - Chọn ngẫu nhiên một người chưa từng trúng thưởng.
   - Xác định bộ giải thưởng dựa trên số lượng người đã trúng (36 giải tổng cộng: 20x500k, 10x1M, 5x2M, 1x5M).
   - Lưu người được chọn vào `SelectedUser.json`.
4. **Hiệu ứng**: Frontend thực hiện hiệu ứng quay tên (spinning) dựa trên Họ, Đệm và Tên của người được chọn trong khoảng 16 giây.
5. **Xác nhận**: Sau khi hiệu ứng kết thúc, một Modal hiện ra để xác nhận lưu kết quả. Nếu xác nhận, gọi `/update-lucky-user` để lưu vĩnh viễn vào `LuckyUser.json`.

### 3. Âm thanh (Audio)
- Sử dụng file `Bia.mp3` khi đang quay.
- Sử dụng file `Votay.mp3` khi công bố người trúng thưởng.

### 4. Reset dữ liệu
Nút "Reset" sẽ gọi API `/reset` để làm trống hai file `LuckyUser.json` và `SelectedUser.json`, cho phép bắt đầu lại từ đầu.

## 📡 API Endpoints (Backend)

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| GET | `/list-user` | Lấy danh sách toàn bộ người dùng từ file Excel. |
| GET | `/get-lucky-user` | Chọn ngẫu nhiên một người trúng thưởng mới. |
| POST | `/update-lucky-user` | Lưu người trúng thưởng vào danh sách chính thức. |
| GET | `/list-lucky-user` | Lấy danh sách những người đã trúng thưởng. |
| GET | `/reset` | Xóa sạch dữ liệu trúng thưởng để bắt đầu lại. |

## 📝 Lưu ý quan trọng cho lần sau
- File `server/Final_Checkin_Report.xlsx` là nguồn dữ liệu duy nhất hiện tại.
- Backend thực hiện chuẩn hóa (Normalization) dữ liệu từ file Excel (từ HOA sang CamelCase).
- Giao diện được thiết kế để chạy mượt mà trên trình duyệt với độ phân giải cao (Full HD).
