# So you want to delete your tweets

Great! Let's get started.

## Setup

### (Optional) Sign up for Glitch

You _can_ setup and run this app without signing up for Glitch, but if there's an issue and you need to come back later and resume deleting, making an account will make sure your stuff is saved and that it picks up from where it left off. Up to you!
1. TODO instructions

### Download your Twitter archive

1. Go to your [Twitter account settings](https://twitter.com/settings/account)
2. Scroll down to "Your Tweet archive" and click the "Request your archive" button
3. Wait to get an email from Twitter. It takes longer if you have a lot of tweets, but in my experience not usually more than an hour
4. Follow the link in your email and download your archive from the page
5. Unzip the archive (it'll have a long name of letters and numbers) and open the folder
6. TODO how to get the archive onto Glitch?

### Register with Twitter as a developer

1. Go to the [Twitter developer portal](https://developer.twitter.com)
2. Click "Apply" in the top nav, and then the "Apply For A Developer Account" button
3. If you don't have a verified phone number on your account, Twitter will ask you to add one.  
   _Twitter requires developers to have a verified phone number, ostensibly to have a point of contact in case of abuse. If you're comfortable giving Twitter your phone number, go for it. If not, there are a number of services that let you generate temporary phone numbers, although I can't vouch for any of them and it might be risky to permanently tie your account to a burner number out of your control. Ultimately it's up to you. Your best bet is probably to add your real phone number and then if you want, remove it from your account when you're done using this app._
4. Click "Continue" to associate your current username.
5. Select "I am requesting access for my own personal use." Fill in your Twitter username and select your country. Click "Continue".
6. Select "Other" as your use case. In the "Describe in your own words what you're building" box, feel free to enter your own explanation or copy/paste this text that already meets their minimum text requirement:
   ```
   1. I'm using Twitter's API to programmatically delete my own Twitter archive.
   2. I do not plan to analyze Tweets, Twitter users, or their content.
   3. I will not be Tweeting, Retweeting, or liking content.
   4. I will not be displaying any data, I'm just using the API for programmatic access to my own tweets.
   ```
   Choose "No" for the question about information being available to government entities.
7. Scroll through and accept the terms and conditions. If you feel like reading them, they're actually pretty plain English.
8. Twitter will now send you a verification email to complete your application. When you recieve it, click the "Confirm your email" button.

### Create an app and add the credentials to this project

1. Go to Twitter's [create an app](https://developer.twitter.com/en/apps/create) page
2. Enter `yourusername archive deleter` as the App name
3. Enter `Glitch Twitter archive deleter credentials` as the Application description
4. Enter `https://twitter.com` as the website URL  
   _This value doesn't actually matter - it won't be used or referenced in this app_
5. Scroll to the bottom of the page and copy/paste this text in the "Tell us how this app will be used" field  
   ```
   This app will be used to generate credentials that let me use the Twitter API on behalf of my own account.
   ```
6. Press Create, and then press Create again on the popop
7. Click on the "Keys and tokens" tab at the top. Under the "Access token & access token secret
" section, click the Create button
8. In this project, copy the contents of `.env.sample` into `.env` (the one with the little key)
9. Copy & paste your Consumer Key, Consumer Secret, Access Token, and Access Token secret from the Twitter app page into your `.env`. It should look like this, with your values filled in:
   ```
   TWITTER_CONSUMER_KEY=Pqhe6a6rSFb4vfCun7sYyDWOA
   TWITTER_CONSUMER_SECRET=HfTfQc0lFm33T3Ixfv4cCmRj0k6daT9iSa6DF2n3H6qwZ4lWai
   TWITTER_ACCESS_TOKEN=12345678-AzNwMwPGtNehMvf86ChlhYuowX95Bw7BBbpmFm2qw
   TWITTER_ACCESS_TOKEN_SECRET=ym62oXokuSH5f7jqw18Mr7LuwCaifQHaFIQUtcoeC8QZL
   ```
   