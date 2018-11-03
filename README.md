# So you want to delete your old tweets

Great! The setup process may seem like a lot of steps, but it's not that hard and should only take you 15-20 minutes. It's mostly just filling out forms and clicking buttons. Unfortunately, that's the trade-off of doing things yourself instead of letting a service to do it for you.

You're in the `README.md` file right now. If you look at the left you'll see a list of files that includes all the code necessary to make this app work. Don't worry about the rest of it, just remember that when you leave to do things always come back to the README.

If you have any issues or questions, feel free to reach out to me on Twitter [@ryangiglio](https://twitter.com/ryangiglio) and I'll help you out.

## Setup

### (Optional) Sign up for Glitch

You _can_ setup and run this app without signing up for Glitch, but if there's an issue and you need to come back later and resume deleting, making an account will make sure your stuff is saved and that it picks up from where it left off. Up to you!

1. Click Sign In at the top of this page

2. Log in with Facebook or Github. If you don't have either one, it's very quick to sign up for Github on the Free plan.  
   _If your Twitter is anonymous, don't worry, your login account won't be linked to it in any way._

### Register with Twitter as a developer

1. Go to the [Twitter developer portal](https://developer.twitter.com)

2. Click "Apply" in the top nav, and then the "Apply For A Developer Account" button
   _You need to have a developer account in order to access Twitter's API, which is how this app deletes your tweets._

3. If you don't have a verified phone number on your account, Twitter will ask you to add one.  
   _Twitter requires developers to have a verified phone number to have a point of contact in case of abuse. If you're not comfortable giving them your real phone number, there are a number of services that let you generate temporary phone numbers, although I can't vouch for any of them and it seems risky to permanently tie your account to a burner number. Your best bet is probably to add your real phone number and then if you want, remove it from your account when you're done using this app._

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

   _The values you enter for steps 2, 3, and 4 don't actually matter for the functionality of this app, you're just naming a few things._

2. Enter `(your username here) archive deleter` as the App name

3. Enter `Glitch Twitter archive deleter credentials` as the Application description

4. Enter `https://twitter.com` as the website URL

5. Scroll to the bottom of the page and copy/paste this text in the "Tell us how this app will be used" field

   ```
   This app will be used to generate credentials that let me use the Twitter API on behalf of my own account.
   ```

6. Press Create, and then press Create again on the popup

7. Click on the "Keys and tokens" tab at the top. Under the "Access token & access token secret" section, click the Create button

8. Open your `.env` file from the list on the left (it's the one with the little key). Copy your Consumer API Key, Consumer API Secret Key, Access Token, and Access Token Secret from the Twitter app page and paste them into the `.env` file after each `=`. It should look like this, with your values filled in:

   ```
   TWITTER_CONSUMER_API_KEY=Pqhe6a6rSFb4vfCun7sYyDWOA
   TWITTER_CONSUMER_API_SECRET_KEY=HfTfQc0lFm33T3Ixfv4cCmRj0k6daT9iSa6DF2n3H6qwZ4lWai
   TWITTER_ACCESS_TOKEN=12345678-AzNwMwPGtNehMvf86ChlhYuowX95Bw7BBbpmFm2qw
   TWITTER_ACCESS_TOKEN_SECRET=ym62oXokuSH5f7jqw18Mr7LuwCaifQHaFIQUtcoeC8QZL
   ```

### Download your Twitter archive

1. Go to your [Twitter account settings](https://twitter.com/settings/account)

2. Scroll down to "Your Tweet archive" and click the "Request your archive" button

3. Wait to get an email from Twitter. It takes longer if you have a lot of tweets, but in my experience not usually more than an hour

4. Follow the link in your email and download your archive from the page

5. Unzip the archive (it'll have a long name of letters and numbers) and open the folder

6. Drag and drop the `tweets.csv` file into this window. You should see a bunch of numbers and symbols – that's the content of the csv. You should also see tweets.csv show up in the sidebar to the left.

### (Optional) Specify any tweets you don't want deleted

If you have some Tweets you just can't bear to part with, you can add them as exceptions so they don't get deleted along with the rest.

1. Go to the tweet on [twitter.com](https://twitter.com) and click on it.

2. In the URL bar at the top of your browser, you should see `https://twitter.com/username/status/#####`. Copy all of those numbers at the end - this is the Tweet ID.

3. Open the file `config/default.js` in the list of files on the left.

4. Inside the `[ ]` brackets, add a new line with the Tweet ID in single quotes followed by a comma at the end, the same as `'1234567890',`.

5. Repeat for as many Tweets as you want to save. The final file should look like this:
   ```
   module.exports = {
     savedTweets: [
       '1234567890',
       '###########',
       '###########',
       '###########',
     ],
   }
   ```

### You're done with setup!

Hopefully that wasn't too hard! Once you're done with setup, click the `Show` button at the top of this page next to the cool sunglasses to move on to the last step.
