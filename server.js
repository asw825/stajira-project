const express = require("express");
const bodyParser = require("body-parser");
const { runSelenium } = require("./scraper");
const PORT = process.env.PORT || 5001;
const app = express();

// EJS 설정
app.set("view engine", "ejs");
app.use(express.static("public")); // 정적 파일 사용
app.use(bodyParser.urlencoded({ extended: true })); // Form 데이터 파싱

// 홈 페이지 (폼 입력)
app.get("/", (req, res) => {
    const formData = 
`
[재현환경] 
서버: 테스트 환경, 시스템 도메인 기재
테스트기기: PC, 휴대기기 등
어플리케이션 정보: 크롬, 사파리, 배민사장님앱, 배민앱, 가상환경 등
버전정보: OS버전, 앱버전, 웹뷰버전, 형상버전 등
[사전조건]
테스트 계정
가게번호
주문번호
[재현스텝]
누가 보더라도 재현할 수 있는 스텝으로 작성
[예상결과]
(파란색글씨)
[실제결과]
(빨간색글씨)
[참고]
테스트 베이시스(기획서, API문서), 슬랙링크 등
재현빈도
추가 재현여부 확인한 재현환경`

    res.render("index", {formData}); // views/index.ejs
});

// 폼 데이터 제출 → Selenium 실행 → 결과 페이지로 이동
app.post("/submit", async (req, res) => {
    const formData = req.body; // 입력한 form 데이터
    console.log("받은 formData:", formData);
    res.send("✅ 요청이 접수되었습니다. Selenium 작업이 백그라운드에서 실행됩니다.");

    try {
       await runSelenium(formData); // Selenium 실행
    } catch (error) {
        console.log(error)
    }
    process.on("SIGTERM", () => {
        console.log("🚨 프로세스 종료 감지됨. 서버 종료 중...");
        process.exit(0);
    });
});

// 서버 실행
app.listen(PORT, () => console.log(`✅ 서버 실행 중: http://localhost:${PORT}`));
