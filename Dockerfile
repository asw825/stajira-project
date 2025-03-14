# Node.js 최신 버전 사용
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 복사 및 설치
COPY package.json .
RUN npm install

# Chrome 및 chromedriver 설치
RUN apt-get update && apt-get install -y \
    wget unzip curl gnupg \
    && curl -fsSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update && apt-get install -y google-chrome-stable

# 환경 변수 설정 (Chrome 경로 지정)
ENV CHROME_BIN=/usr/bin/google-chrome

# 애플리케이션 복사 및 실행
COPY . .

# ✅ Chrome을 실행한 후 서버 시작 (VPN 유지)
CMD ["sh", "-c", "google-chrome --remote-debugging-port=9222 --user-data-dir=/root/chrome-profile & npm start"]
