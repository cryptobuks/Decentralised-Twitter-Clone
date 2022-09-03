const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Twitter Contract Testing: ", function() {

    let Twitter;
    let twitter;
    let owner;

    const num_of_other_tweets = 5;
    const num_of_my_tweets = 3;

    let totalTweets;
    let totalMyTweets;

    beforeEach(async function() {

        Twitter = await ethers.getContractFactory("TwitterContract");
        [owner, addr1, addr2] = await ethers.getSigners();
        twitter = await Twitter.deploy();

        totalTweets = [];
        totalMyTweets = [];

        for (i = 0;  i < num_of_other_tweets; i++) {
            let tweet = {
                'tweetText': 'Ramdon text with id:- ' + i,
                'username': addr1,
                'isDeleted': false
              };

            await twitter.connect(addr1).addTweet(tweet.tweetText, tweet.isDeleted);
            totalTweets.push(tweet);
        }

        for (i = 0;  i < num_of_my_tweets; i++) {
            let tweet = {
                'tweetText': 'Ramdon text with id:- ' + i,
                'username': addr1,
                'isDeleted': false
              };

            await twitter.addTweet(tweet.tweetText, tweet.isDeleted);
            totalTweets.push(tweet);
            totalMyTweets.push(tweet);
        }
    });

    describe("Add tweet testing: ", function() {

        it("Should emit Add event: ", async function() {

            let tweet = {
                'tweetText': 'New Tweet',
                'isDeleted': false
              };

              await expect(await twitter.addTweet(tweet.tweetText, tweet.isDeleted)
              ).to.emit(twitter, 'AddTweet').withArgs(owner.address, num_of_my_tweets + num_of_other_tweets);
        });
    });


    describe("Get tweets testing: ", function() {

        it("Should return the correct number of tweets: ", async function() {

            const tweets = await twitter.getAllTweets();
            expect(tweets.length).to.equal(num_of_my_tweets + num_of_other_tweets);
        });

        
        it("Should return the correct number of my tweets: ", async function() {

            const myTweets = await twitter.getMyTweets();
            expect(myTweets.length).to.equal(num_of_my_tweets);
        });
    });


    describe("Delete tweet testing: ", function() {

        it("Should emit delete tweet event: ", async function() {

            const tweetId = 0;
            const tweetDeleted = true;

            await expect(await twitter.connect(addr1).deleteTweet(tweetId, tweetDeleted)
            ).to.emit(twitter, "DeleteTweet").withArgs(tweetId, tweetDeleted);
        });
    });
});