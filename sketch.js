let questions = [
  { target: "海", required: ["塩", "水"], model: "地球の表面にある凹地を埋めている海水（塩水）の巨大な塊であり、地球表面の約70.8%を占めています。" },
  { target: "カレー", required: ["辛", "スパイス"], model: "多種多様な香辛料を併用して、肉や野菜などの食材を味付けして煮込んだインド風の料理。" },
  { target: "スマートフォン", required: ["アプリ", "画面"], model: "画面を触ってアプリを動かす電話。インターネット利用や多機能なソフトウェア実行が可能な携帯端末。" },
  { target: "猫", required: ["鳴く", "毛"], model: "愛玩動物として一般的な哺乳類。ニャーと鳴く声が特徴で、全身が柔らかい毛で覆われている。" },
  { target: "ラーメン", required: ["麺", "スープ"], model: "小麦粉で作った麺を、出汁の効いたスープに入れて食べる中国由来の日本料理。" },
  { target: "学校", required: ["勉強", "先生"], model: "先生が教え、学生が勉強するための施設。教育基本法などに基づき設置される教育機関。" },
  { target: "飛行機", required: ["空", "飛ぶ"], model: "固定された翼に揚力を発生させ、空を飛ぶことができる重航空機の一種。" },
  { target: "お正月", required: ["餅", "1月"], model: "1月の最初の行事。年神様を迎え、家族で餅などを食べて祝う日本の伝統的な年中行事。" }
];

let qIndex = 0;
let inputField, submitBtn;
let resultMsg = "";
let feedbackColor = [50, 50, 50];
let syncRate = 0;
let showAnswer = false;

function setup() {
  createCanvas(500, 550); // 正解表示用に少し縦を伸ばしました
  
  inputField = createElement('textarea', '');
  inputField.position(50, 160);
  inputField.size(400, 100);
  inputField.style('font-size', '18px');
  inputField.style('border-radius', '10px');
  inputField.style('padding', '10px');
  
  submitBtn = createButton('提出・採点');
  submitBtn.position(150, 280);
  submitBtn.size(200, 40);
  submitBtn.style('cursor', 'pointer');
  submitBtn.mousePressed(checkAnswer);
}

function draw() {
  background(250);
  textAlign(CENTER);
  
  if (qIndex < questions.length) {
    let q = questions[qIndex];
    
    fill(150);
    textSize(14);
    text("第 " + (qIndex + 1) + " 問 / 全 " + questions.length + " 問", width/2, 30);
    
    fill(50);
    textSize(28);
    textStyle(BOLD);
    text("【お題】 " + q.target, width/2, 70);
    textStyle(NORMAL);
    
    textSize(16);
    text("以下の言葉を必ず使って説明してください：", width/2, 105);
    
    // 必須ワードの表示
    for (let i = 0; i < q.required.length; i++) {
      let word = q.required[i];
      let isIncluded = inputField.value().includes(word);
      let xPos = (width/2 - ((q.required.length-1)*50)) + i * 100;
      
      if (isIncluded) { fill(46, 204, 113); stroke(255); } 
      else { fill(231, 76, 60); noStroke(); }
      
      rectMode(CENTER);
      rect(xPos, 130, 90, 30, 15);
      fill(255); noStroke();
      text(word, xPos, 135);
    }

    // 正解率と答え合わせの表示
    if (syncRate > 0) {
      fill(feedbackColor);
      textSize(24);
      text("正答率: " + syncRate + "%", width/2, 350);
      
      if (showAnswer) {
        fill(240); stroke(200);
        rect(width/2, 430, 440, 100, 10);
        noStroke(); fill(80); textSize(13); textAlign(LEFT);
        text("【辞書の定義】\n" + q.model, 45, 400, 410);
        textAlign(CENTER);
      }
    }
    
    fill(feedbackColor);
    textSize(16);
    text(resultMsg, width/2, 375);

  } else {
    inputField.hide();
    submitBtn.hide();
    textSize(40);
    fill(255, 150, 0);
    text("🎉 全問合格！！ 🎉", width/2, height/2);
  }
}

function checkAnswer() {
  let q = questions[qIndex];
  let userText = inputField.value();
  let missing = q.required.filter(word => !userText.includes(word));
  
  if (missing.length > 0) {
    resultMsg = "「" + missing.join("」「") + "」が使われていません。";
    feedbackColor = [231, 76, 60];
    syncRate = 0;
    return;
  }
  
  // 辞書文との一致率を計算
  syncRate = getDictionaryScore(userText, q.model);
  
  if (syncRate >= 60) {
    resultMsg = "✨ 合格！ 辞書に近い説明です ✨";
    feedbackColor = [46, 204, 113];
    showAnswer = true;
    submitBtn.attribute('disabled', '');
    
    setTimeout(() => {
      qIndex++;
      inputField.value('');
      resultMsg = "";
      syncRate = 0;
      showAnswer = false;
      feedbackColor = [50, 50, 50];
      submitBtn.removeAttribute('disabled');
    }, 5000);
  } else {
    resultMsg = "もっと辞書のような正確な表現にしてみて！";
    feedbackColor = [231, 76, 60];
  }
}

function getDictionaryScore(user, model) {
  let matches = 0;
  let uniqueModelChars = [...new Set(model)];
  for (let char of uniqueModelChars) {
    if (user.includes(char)) matches++;
  }
  return min(100, floor((matches / uniqueModelChars.length) * 100));
}
