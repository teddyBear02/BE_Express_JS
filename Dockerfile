# Sử dụng một hình ảnh chứa Node.js phiên bản 14
FROM node:14

# Đặt thư mục làm việc mặc định trong container
WORKDIR /app

# Sao chép package.json và package-lock.json (nếu có) vào thư mục hiện tại
COPY package*.json ./

# Cài đặt các dependencies của ứng dụng
RUN npm install

# Sao chép tất cả các mã nguồn vào thư mục hiện tại
COPY . .

# Mở cổng 3000 để kết nối tới ứng dụng
EXPOSE 3000

# Khởi chạy ứng dụng
CMD ["npm", "start"]
