# RemoveNoisyTweet
Tweet Deck上で邪魔なツイートを非表示にするUserscriptです

# 使い方
Chrome
1. [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) かその他Userscriptが動かせる拡張機能をインストールする
1. [https://wamei.github.io/RemoveNoisyTweet/remove-noisy-tweet.user.js](https://wamei.github.io/RemoveNoisyTweet/remove-noisy-tweet.user.js) をクリックして 'Remove Noisy Tweet' をインストールする
1. [https://tweetdeck.twitter.com/](https://tweetdeck.twitter.com/) を開く
1. Remove Noisy Tweet の設定画面を開く
1. タイムラインから除外したいキーワードを追加する  
  (正規表現も使用可能 例) "/apple|orange/" だと "apple" もしくは "orange" にマッチする)
1. 'Save on close' をクリックする
1. 自動的に上記キーワードを含むツイートはタイムラインから削除される

![image](https://user-images.githubusercontent.com/2811188/69854829-69274b80-12cd-11ea-8f9d-fdf446576b6d.png)

# Tips
'apple' を含むものにマッチ
```
apple
```

'apple' もしくは 'orange' もしくは 'grape' を含むものにマッチ
```
/apple|orange|grape/
```

'apple' と 'orange' と 'grape' の全てを含むものにマッチ
```
/^(?=[\s\S]*apple)(?=[\s\S]*orange)(?=[\s\S]*grape)/
```
