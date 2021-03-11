---
title: Exploring Vercel Analytics Using Next.js 10 and GTMetrix
description: See a roundup of my look into Vercel's new analytics feature that you can enable on a Vercel project and see how I used GTMetrix to help push some numbers.
date: "2020-11-06"
tags: nextjs,react,analytics,vercel
---

Vercel announced their new [analytics feature](https://nextjs.org/analytics) during their recent Next.js conference and great news to all - it is live to try right now.

In my most [recent post](https://blog.dennisokeeffe.com/blog/2020-11-05-deploying-with-vercel-cli/), I deployed a simple Next.js 10 application to Vercel. Now is the time to test out some of their new features!

In this post, we will cover how to enable Vercel Analytics on a Vercel hosted Next.js 10 project, then use [GTMetrix](https://gtmetrix.com/) to help send some request from around the globe (using throttling for various speeds) that our analytics can collect (on top of any other potential visits to the site).



## The "what" of Vercel Analytics

A great way to understand what is on offer is to read through Vercel's [analytics overview](https://vercel.com/docs/analytics/overview#hosted-on-vercel).

It covers things such as pricing, what you get per tier, what frameworks are supported (Next.js 10+, Gatsby 2+) and an overview of each of the metrics that you get and the "why" those metrics are so important to modern web development.

While I will not cover what is in the above overview, I will be exploring some of the data points being ingested and calculated.



## Enabling Vercel Analytics

This assumes you have a Next.js 10 project currently hosted on Vercel. If you do not but would like to do so, follow my [recent post](https://blog.dennisokeeffe.com/blog/2020-11-05-deploying-with-vercel-cli/) to upload a basic site.

Once that is done, head to your [Vercel dashboard](https://vercel.com/dashboard) and select the project you would like to enable analytics on. I chose the project directly from my previous blog post.

Once on the project page, select **Analytics** from the top row and you will be greeted with a **Enable analytics** button. Don't worry if you're on the free tier; the overview informs us that on the **hobby** tier, you are eligible to **1-day retention, 100 maximum data points per day with 100% sample rate**.

> Note: On the Hobby plan, Analytics can only be enabled on a single Vercel project. Feel free to disable after the tutorial.

Once you are on the analytics tab, you will be greeted with the following modal:

![Enable Vercel Analytics](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-06-2-vercel-enable-analytics.png?raw=true)

Select **Enable**, and then Vercel will prompt you to redeploy with your build with analytics enabled. Once, that is done, Vercel will kindly let you know that it is awaiting data:

![Awaiting data on Vercel Analytics](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-06-3-vercel-awaiting-data.png?raw=true)



## Playing around with GTMetrix

[GTMetrix](https://gtmetrix.com) describe themselves as the following:

> "GTmetrix is a free tool that analyzes your page's speed performance"

Something very cool with GTMetrix is that you can use the website to make requests from different locations on different browsers with different speed emulations (think very fast broadband, 2g, etc).

This is great for yourself to test against your own websites, but it is also a great way for us to start creating some data points for Vercel to report back to us!

> Note: the metrics returned from GTMetrix and Vercel Analytics measure different things. See more on the Vercel overview resource linked to see what Vercel measures and why that is important.

I created an account with GTMetrix and at the top of the home page, you can simply copy and paste in the URL of your Vercel app's website and start tinkering with settings.

![GTMetrix Dashboard](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-06-1-gtmetrix-dashboard.png?raw=true)

I fiddled with the settings and made a number of manual calls to the app with different locations and settings - you can see some of the throttled results below:

![GTMetrix](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-06-4-gtmetrix-fully-loaded.png?raw=true)

![GTMetrix Slowest](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-06-5-gtmetrix-slowest.png?raw=true)

After doing a number of these visits, I decided to call it a night and play the waiting game.



## Viewing the analytics

Coming back to my Vercel dashboard in the morning, we had some data points to see in action!

![Vercel Analytics 75th percentile](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-06-7-p75-vercel-analytics.png?raw=true)

![Vercel Analytics 90th percentile](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-06-8-p90-vercel-analytics.png?raw=true)

![Vercel Analytics 95th percentile](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-06-9-p95-vercel-analytics.png?raw=true)

Amazing! We have lift-off!

While I will let the official overview do the talking as to what each metric refers to, I will explain the **p75/p90/p95** screenshots that I shared above by quoting a nice excerpt from a [DataDog blog post](https://www.datadoghq.com/blog/set-and-monitor-slas/) (which in turn quotes [Site Reliability Engineering](https://landing.google.com/sre/books/)):

> _"Using percentiles for indicators allows you to consider the shape of the distribution and its differing attributes: a high-order percentile, such as the 99th or 99.9th, shows you a plausible worst-case value while using the 50th percentile (also known as the median) emphasizes the typical case"_

I am going to copy the image address from the DataDog post, so hopefully, the address lasts the test of time to give you great visuals on what this means:

![Percentiles Visualised](https://imgix.datadoghq.com/img/blog/set-and-monitor-slas/latency-distribution-99pv2-newerv5.png?auto=format&w=1140&dpr=2)

In the above image, you can see p99 deals with the worst outliers while p50 gives a better look at your typical user.

The same applies to the analytics you have seen on my dashboard. The p75 metrics will show the plausible worst-case scenario for that user, again for the p90 and lastly the p95.

The ability to filter down these percentiles, even on the hobby tier is extremely valuable to getting metrics and insight from real-world users! It will empower you to make the best decisions on what you should or shouldn't focus on based on your demographic.



## In conclusion

Today's post looked at setting up Vercel Analytics with a Next.js 10 project, followed by emulating some real-world metrics though a page-speed service and finally a high-level look at what data comes back.

Vercel (and formerly as Zeit) have been building some badass tools and services for years and their platform is top-notch.

Be sure to check back as I delve further into some of the new options that Vercel and Next.js 10 provide in upcoming posts.



## Resources and further reading

1. [Vercel Analytics](https://nextjs.org/analytics)
2. [Analytics hosted on Vercel overview](https://vercel.com/docs/analytics/overview#hosted-on-vercel)
3. [DataDog Post including the definition of percentile](https://www.datadoghq.com/blog/set-and-monitor-slas/)
4. [Deploying Next.js 10 With Vercel CLI and the Vercel GitHub Integration](https://blog.dennisokeeffe.com/blog/2020-11-05-deploying-with-vercel-cli/)
5. [GTMetrix](https://gtmetrix.com)
6. [Site Reliability Engineering Book](https://landing.google.com/sre/books/)

_Image credit: [National Cancer Institute](https://unsplash.com/@nci)_

_Originally posted on my [blog](https://blog.dennisokeeffe.com/blog/2020-11-06-exploring-vercel-analytics/). Follow me on Twitter for more hidden gems [@dennisokeeffe92](https://twitter.com/dennisokeeffe92)._
