const { Builder, By, Key } = require("selenium-webdriver");
const { execSync } = require('child_process');

const chrome = require("selenium-webdriver/chrome");

async function runSelenium(formData) {
    const {jiraticketurl,summary, description} = formData;
    
    let options = new chrome.Options();

     // 기존 로그인된 Chrome 창과 연결 (디버깅 포트 사용)
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--disable-gpu");
    options.addArguments("--remote-debugging-port=9222"); // ✅ 디버깅 포트 지정 (중요!)
    options.debuggerAddress = "127.0.0.1:9222";

    

    let driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();
        
        try {
            // ✅ 새 탭 열기 (Ctrl + T 입력)
            await driver.switchTo().newWindow('tab');
            // ✅ 새 탭에서 특정 URL 열기
            await driver.get(jiraticketurl);
            console.log("✅ 기존 Chrome 창에서 새 탭이 열리고 실행됨!");
            let manager = await driver.findElement(By.xpath('//*[@id="ak-main-content"]/div/div/div/div[3]/div[2]/div[2]/div/div[3]/div/div[2]/div[3]/div[2]/div[1]/div/div/details/div/div/div[1]/div/div/div/div[2]/div/div[1]/div/span/div/div/span/span')).getText();
            console.log("✅", manager);
            let reporter = await driver.findElement(By.xpath('//*[@id="ak-main-content"]/div/div/div/div[3]/div[2]/div[2]/div/div[3]/div/div[2]/div[3]/div[2]/div[1]/div/div/details/div/div/div[2]/div/div/div[2]/div/div/div/span/div/div/span/span')).getText();
            console.log("✅",reporter);
            let componentGroup = await driver.findElement(By.xpath('//*[@id="ak-main-content"]/div/div/div/div[3]/div[2]/div[2]/div/div[3]/div/div[2]/div[3]/div[2]/div[1]/div/div/details/div/div/div[5]/div/div/div[2]/div/div/div/form/div/div/div/div/div/div')).getText();
            console.log("✅",componentGroup);
            let jiraticketNumber = await driver.findElement(By.xpath('//*[@id="jira-issue-header"]/div/div/div/nav/ol/div[3]/div[2]/li/a/span')).getText();
            console.log("✅",jiraticketNumber);
            await driver.actions().pause(1000).perform();
            console.log("✅ 1초 딜레이");
            await driver.findElement(By.id("createGlobalItem")).click();
            console.log("✅ 만들기버튼 선택됨");
            await driver.sleep(3000);
            console.log("✅ 대기 3초");
            await driver.findElement(By.xpath("//*[@id='issue-create.ui.modal.create-form.type-picker.issue-type-select']"));
            let secondElement = await driver.findElement(By.xpath("//*[@id='issue-create.ui.modal.create-form.type-picker.issue-type-select']"));
            console.log("✅ xpath 경로 선택됨");
            await secondElement.click();
            console.log("✅ 버그이슈유형 클릭");
            await driver.actions().sendKeys("버그").sendKeys(Key.ENTER).perform();
            console.log("✅ 이슈유형 버그로 타이핑 완료");
            await driver.findElement(By.xpath('//*[@id="components-container"]/div/div/div[1]/div[1]')).click();
            await driver.actions().sendKeys(componentGroup).sendKeys(Key.ENTER).perform();
            console.log("✅ 컴포넌트 데이터 타이핑 완료");
            await driver.findElement(By.xpath('//*[@id="parent-container"]/div/div/div[1]/div')).click();
            console.log("✅ 상위항목 클릭됨");
            await driver.actions().sendKeys(jiraticketNumber).pause(1500).sendKeys(Key.ENTER).perform();
            console.log("✅ 상위항목에 지라티켓넘버 타이핑 완료");
            let now = new Date(Date.now()); // 현재 날짜 객체 생성
            let formattedDate = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}.`;
            console.log("✅ 날짜생성",formattedDate);
            await driver.findElement(By.xpath('//*[@id="customfield_10015-container"]/div/div[1]/div/div[1]/div/div[1]')).click();
            console.log("✅ 날짜 선택 클릭",formattedDate);
            await driver.actions().sendKeys(formattedDate).pause(1500).sendKeys(Key.ENTER).perform();
            console.log("✅ 날짜 타이핑완료",formattedDate);
            await driver.findElement(By.xpath('//*[@id="issue-create-modal-dropzone-container"]/div/div[1]/div/div[1]/div[1]/div/button')).click();
            console.log("✅ 왓차 눈알클릭");
            await driver.sleep(1000);
            await driver.actions().sendKeys(Key.TAB).sendKeys(Key.TAB).sendKeys(Key.TAB).sendKeys(Key.ENTER).perform();
            console.log("✅ 관찰자 추가 버튼 선택완료");
            await driver.actions().sendKeys(manager).pause(1500).sendKeys(Key.ENTER).perform();
            await driver.actions().pause(1000).sendKeys(reporter).pause(1500).sendKeys(Key.ENTER).perform();
            console.log("✅ 담당자,보고자 추가완료");
            await driver.findElement(By.xpath('//*[@id="summary-field"]')).click();
            console.log("✅ summary 선택");
            await driver.actions().sendKeys(summary).perform();
            console.log("✅ summary 내용 입력");
            await driver.findElement(By.xpath('//*[@id="description-container"]/div/div[1]/div/div/div/div/div/div/div/div[2]/div[2]/div')).click();
            console.log("✅ textArea 선택");
            await driver.actions().sendKeys(description).perform();
            console.log("✅ textArea 입력완료");



            


            
        
        } catch (error) {
        console.error("❌ Selenium 오류:", error);
        return { error: error.message };
    } finally {
        await driver.quit();
        console.log("✅ 동작종료");
        
      
    }
}

module.exports = { runSelenium };
