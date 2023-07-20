# ecommerce-backend

## Setup lib project

    - express
    - helmet
    - nodemon
    - bcrypt": encrypt, decrypt
    - compression": nén request response
    - dotenv": cấu hình doc file environment .env
    - helmet": che giấu thông tin stack phía server, thông tin riêng tư...
    - jsonwebtoken": thư viện jwt
    - mongoose": connect mongodb
    - morgan": thư viện in ra các log khi một người dùng request xuống

## Mongodb

    - Nhược điểm của cách connect cũ
    - Cách connect mới, khuyên dùng
    - Kiểm tra hệ thống có bao nhiêu connect
    - THông báo khi server quá tải connect
    - Có nên disConnect liên tục hay không?
    - PoolSize là gì? vì sao lại quan trọng?
    - Nếu vượt quá kết nối poolsize?
    - MongoDB Desing pattern
          - Polymorphic pattern
          - Attribute pattern
          - Bucket pattern
          - Outlier pattern
          - Computed pattern
          - Subnet pattern
          - Extended reference pattern
          - Approximation pattern
          - Tree pattern
          - Preallocation pattern
          - Document versioning pattenr
          - Schema versioning pattern
