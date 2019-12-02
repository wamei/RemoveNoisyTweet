# RemoveNoisyTweet
This is a userscript that remove noisy tweet on Tweet Deck

# Usage
On Chrome
1. Install [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) or etc that can execute userscript.
1. Click [https://wamei.github.io/RemoveNoisyTweet/remove-noisy-tweet.user.js](https://wamei.github.io/RemoveNoisyTweet/remove-noisy-tweet.user.js) to install 'Remove Noisy Tweet'.
1. Open [https://tweetdeck.twitter.com/](https://tweetdeck.twitter.com/).
1. Open Remove Noisy Tweet Settings.
1. Add the keyword that you want to exclude from tweets.  
  (You can use Regular Expression. ex) "/apple|orange/" matches "apple" or "orange")
1. Click 'Save on close'.
1. Automatically Remove tweets that contains the keywords.

![image](https://user-images.githubusercontent.com/2811188/69854829-69274b80-12cd-11ea-8f9d-fdf446576b6d.png)

![image](https://user-images.githubusercontent.com/2811188/69928924-9445b100-1500-11ea-8d04-0f53cd89fee8.png)

![image](https://user-images.githubusercontent.com/2811188/69928885-682a3000-1500-11ea-9fe7-d0d34fa339e9.png)

# Tips
match 'apple'
```
apple
```

match 'apple' OR 'orange' OR 'grape'
```
/apple|orange|grape/
```

match 'apple' AND 'orange' AND 'grape'
```
/^(?=[\s\S]*apple)(?=[\s\S]*orange)(?=[\s\S]*grape)/
```
