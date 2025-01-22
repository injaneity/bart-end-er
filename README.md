# Setup Instructions
Since the application fully using NextJS and MongoDB, no setup is needed -- there is a publicly accessible link, necessary because the .env required is stored on Vercel itself (which includes the Clerk secret key and MongoDB URI). If you'd like to set up the frontend WITHOUT the database, do the following:
```
npm i
```

```
npm run dev
```

# Project Overview
Bartender is a peer to peer book exchange application built with NextJS and MongoDB as the main tech stack, with functionality for:
- Adding books via ISBN or manual entry
- Specifying the condition that a book is in
- Adding reviews for books you own
- Offering exchanges for books
- View reviews for books
- Reposting reviews
- Profile page
- Clerk secure sign in and authentication with Google / Github

From a barebones UI/UX perspective, almost everything that was **necessary** was present in the final prototype, with a strong focus on the community features such as public reviews and reposting. However, there were many features planned out that could not be executed (more details discussed below)

Planned Functionality (can be completed within the next 24 hours):
- Accepting & executing book exchanges
- Photo Verification for possession of book

### Other Discussed Features
- Some fun features that I thought would be cool to add included:
- Vanity numbers such as number of trades, number of total books read
- An option to loan books rather than permanently exchange them
- Achievements related to said vanity numbers for user retention

- Comments section for people to argue with the reviewer about the book in question
- LLM to analyse the synopsis of the book and determine the tags associated with the book, which could be used to improve the search function (opposed to searching just by name)
- Natural language prompts in the search bar as opposed to conventional keyword matching

# Ideation Process

The ideation process was relatively smooth: I planned out all the features I wanted to do, including some QoL features that I felt were important, followed by a quick categorisation of said features in terms of importance and urgency:

![alt text](image.png)

This was followed by me asking around for anyone who still reads physical books (turns out... pretty rare) and taking feedback on what features they would like to see in an application like this. Some key ones mentioned were:
- Specifying the condition that the book was in
- Some form of verification that the person exchanging the book actually has said book
- A loan system instead of permanent exchanges

These were all really cool ideas, unfortunately I was forced to prioritise given the 24 hour time limit.

# Key Design Decisions

In the end, the core feature of the landing page was inspired partly by the "for you page" of Tiktok and Instagram, whilst having the slightly more formal nature similar to LinkedIn -- a design choice meant to focus on the actual content of the reviews, rather than eye catching visuals and audio that I felt would take away from the purpose of a physical book exchange app in the first place. The goal was to have as much focus as possible on the landing page, and as few bells and whistles elsewhere.

Clerk was used for a simple to set up, yet secure and seamless authentication option. The choice to deploy rather than working exclusively on localhost was to show that deploying fully working prototypes is definitely achieveable under a 24 hour time frame, relying on some convenient technology.

# Project Plan
First 24 hours: MVP, some unfinished main features
Next 24 hours: Complete all core features, such as CV model for book verification etc
Next Month: Work on social media features (messaging, making reposts visible and giving posts weight)
Onwards: Implement loan system, and other fun / QoL features

  
***
# **Just for Fun Section**
***

### The Drizzle ORM incident
In theory, the tech stack was simple:
- Vercel frontend
- Drizzle ORM backend (that had Vercel support!)
- OpenAI / Gemini API (if on-browser compute was viable)

By 4pm the Vercel frontend structure was more or less complete, with the outline of key pages, components and desired functions laid out. This meant that it was time to transition to a proper database and introduce CRUD functions. Vercel PostGreSQL offered a direct integration with Drizzle ORM, which I thought would be useful for the project.

Unfortunately, that was not the case.

I was running into mysterious errors of Drizzle not being able to find my connection string (despite me putting it in 2 env files, .env and .env.local, testing every permutation and deleting each file once to be sure), and on top of that, more problems continue to crop up as the documentation proved to be inconsistent between node.js and vercel. My mistake was deciding to dive further into the documentation, hoping that I would figure it out and link the mess of articles together (StackOverflow wasn't really helpful, people were suggesting to rename the .env). This cost me over 5 hours as I tried every fix I could find.

This meant that by 10pm, I had no database and nothing to work with. I decided to revert back to my failsafe of MongoDB, which was much easier to set up (and also nonrelational, which is convenient). The database was then up and running around 11pm, with the CRUD functions effectively complete by 12 midnight. The next few hours would be putting the pieces together for the final prototype

So at this point, at around 5am as I'm writing this, between all the bugs and the incidents, I called it a night. I honestly had many features that I thought would be fun to implement and would significantly improve the user experience, unfortunately I underestimated how much of a beast implementing an unfamiliar database in Drizzle ORM turned out to be.

