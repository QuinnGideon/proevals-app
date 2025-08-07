import React from 'react';
import { PmLevel, SkillCategory, Testimonial, PricingPlan, FaqItem } from './types';

export const TESTIMONIALS: Testimonial[] = [
    { "quote": "ProEvals is the sparring partner I've always needed. The scenarios are tough, relevant, and have genuinely sharpened my product instincts.", "author": "Sarah L., Senior Product Manager" },
    { "quote": "We use ProEvals to benchmark new hires. It gives us a data point on judgment that you just can't get from interviews.", "author": "David C., Director of Product" },
    { "quote": "The calibration score is humbling and incredibly useful. It's a clear metric for professional growth.", "author": "Michael P., VP of Product" },
    { "quote": "Finally, a way to practice the hard parts of product management without real-world consequences.", "author": "Emily R., Product Lead" },
    { "quote": "This is mandatory for our APM program. It accelerates their learning curve like nothing else.", "author": "Jessica M., Group Product Manager" },
    { "quote": "The best way to prep for PM interviews. Period. The scenarios are incredibly realistic.", "author": "Alex T., Aspiring PM" },
    { "quote": "I've seen a measurable improvement in my team's decision-making velocity and quality since we adopted ProEvals.", "author": "Maria G., Head of Product" },
    { "quote": "As a hiring manager, a high ProEvals score is a strong signal. It shows a commitment to the craft.", "author": "Ben K., Product Leader" },
    { "quote": "This is the gym for your product sense. You have to put in the reps, and ProEvals makes it easy and effective.", "author": "Chris J., Principal PM" },
    { "quote": "The feedback loop is immediate. You know not just what the right answer is, but why. That's invaluable.", "author": "Priya S., Product Manager" },
    { "quote": "ProEvals helped me land my dream PM job. I felt so much more confident in my interviews.", "author": "Leo F., Associate Product Manager" },
    { "quote": "It bridges the gap between theory and practice perfectly. The scenarios feel like they're pulled from my actual work week.", "author": "Samantha W., Senior PM" },
    { "quote": "The focus on calibration is a game-changer. It's not just about being right, but knowing how confident you should be.", "author": "Frank D., VP of Engineering" },
    { "quote": "An essential tool for any PM looking to level up. I recommend it to all my mentees.", "author": "Grace H., Product Mentor" },
    { "quote": "The quality of the drills is top-notch. They force you to consider trade-offs you don't find in books.", "author": "Omar R., Director of Product Management" }
];

export const PRICING_PLANS: PricingPlan[] = [
    {
        name: 'Free',
        monthlyPrice: 0,
        annualPrice: 0,
        description: 'For individuals starting their journey to elite judgment.',
        features: [
            '3 per day Daily Drills',
            'Access All Skill Levels',
            'Personal Calibration Score',
            'Weekly & Monthly Leaderboards'
        ],
        ctaText: 'Get Started'
    },
    {
        name: 'Plus',
        recommended: true,
        monthlyPrice: 12,
        annualPrice: 9.58,
        description: 'For professionals committed to mastering their craft.',
        features: [
            'Everything in Free, plus:',
            'Unlimited Daily Drills',
            'Complete Drill History',
            'Skill Heatmap & Analytics',
            '"Runner-Up Answer" Mode',
            'Verified Performance Report',
            'Skill-Category Leaderboards'
        ],
        ctaText: 'Upgrade to Plus',
        annualTag: 'Save 20%'
    },
    {
        name: 'Teams',
        monthlyPrice: '15 / user',
        annualPrice: 15,
        description: 'For organizations dedicated to building high-performance teams.',
        features: [
            'Everything in Plus, plus:',
            'Centralized Billing',
            'Team Performance Analytics',
            'Admin Controls'
        ],
        ctaText: 'Get Started'
    }
];

export const FAQ_CONTENT: { category: string, items: FaqItem[] }[] = [
    {
        category: 'About ProEvals',
        items: [
            {
                question: 'What is ProEvals?',
                answer: React.createElement('p', null, `ProEvals is a professional development platform designed to help you improve your decision-making skills through short, daily exercises called "Drills." It's a flight simulator for the high-stakes scenarios you face in your career.`)
            },
            {
                question: 'Who is ProEvals for?',
                answer: React.createElement('p', null, `Initially, ProEvals is designed for Product Managers at all levels (Associate, Mid-Level, and Senior). We plan to expand to other professions where judgment is a critical skill, such as marketing, finance, and strategy.`)
            },
            {
                question: 'What does ProEvals stand for?',
                answer: React.createElement('p', null, `ProEvals stands for Professional Evaluations.`)
            }
        ]
    },
    {
        category: 'The Drills & Scoring',
        items: [
            {
                question: 'How long does a Drill take?',
                answer: React.createElement('p', null, `Each Drill is designed to be completed in about 5 minutes. It's a quick, high-impact way to invest in your professional growth daily.`)
            },
            {
                question: 'What is a Calibration Score?',
                answer: React.createElement('p', null, `Your Calibration Score is a unique metric that measures how well your stated confidence aligns with your actual accuracy. It helps you understand not just what you know, but how well you know what you know, which is crucial for high-stakes decision-making.`)
            },
            {
                question: 'How is the Calibration Score calculated?',
                answer: React.createElement('p', null, `The score is calculated using a formula that compares your confidence rating with the outcome (whether you chose the "Optimal Choice"). The goal isn't always to be right, but to be calibrated. You get a high score for being very confident and right, but you also get a high score for being not very confident and being wrong. The lowest scores come from being highly confident and wrong.`)
            },
            {
                question: 'Are the answers always black and white?',
                answer: React.createElement('p', null, `No. We recognize that real-world decisions are nuanced. While each drill has an "Optimal Choice" based on expert analysis, we often include a "Strategic Alternative" that is also a strong, defensible position. The goal is to train your judgment, not to test for a single right answer.`)
            },
            {
                question: "How do the 'Daily Streak' and 'Session Streak' work?",
                answer: React.createElement('p', null, `The Daily Streak tracks consecutive calendar days (midnight to midnight in your local timezone) that you complete at least one drill, making it the best measure of consistent, daily habit-building. If you miss a day, it resets. For existing users, this streak count begins with your next drill and is not retroactive to ensure a fair start for everyone. The Session Streak is different; it tracks how many drills you complete in a row without a long break (less than 36 hours apart), rewarding focused practice sessions.`)
            }
        ]
    },
    {
        category: 'Leaderboards',
        items: [
            {
                question: 'How do the Weekly & Monthly leaderboards work?',
                answer: React.createElement('p', null, `The Weekly and Monthly leaderboards are open to all users. Ranking is based on performance within the specific time period (last 7 or 30 days). The rules are: 1) Primary Metric: Average Calibration Score. 2) Qualifier: You must complete a minimum of 5 drills in the period to be ranked. 3) Tie-Breaker: If scores are tied, the user with more completed drills ranks higher. The weekly board resets every Monday at midnight UTC, and the monthly board resets on the first of the month.`)
            },
            {
                question: 'What are the All-Time Skill Leaderboards and how do they work?',
                answer: React.createElement('p', null, `This is a premium feature for Plus and Teams subscribers. These leaderboards measure your mastery in a specific competency over your entire history. The rules are stricter to reflect true expertise: 1) Primary Metric: Your all-time Average Calibration Score within that specific skill category. 2) Qualifier: You must complete a minimum of 10 drills in that category to appear on its leaderboard. 3) Tie-Breaker: If scores are tied, the user with more total drills completed in that skill category ranks higher.`)
            }
        ]
    },
    {
        category: 'Account & Subscription',
        items: [
            {
                question: 'How many drills can I do for free?',
                answer: React.createElement('p', null, `The free version of ProEvals includes 3 new drills every day.`)
            },
            {
                question: 'When do my daily drills reset?',
                answer: React.createElement('p', null, `Your 24-hour cooldown period begins after you complete your first drill of the day. If you complete your first drill at 9:00 AM, your next set of drills will be available after 9:00 AM the following day.`)
            },
            {
                question: 'How much of my drill history can I see?',
                answer: React.createElement(React.Fragment, null,
                    React.createElement('p', { className: 'mb-2' }, `To keep your dashboard clean and focused, your Drill History view defaults to showing your activity from the last 30 days.`),
                    React.createElement('p', null, `ProEvals Plus subscribers have full control and can use the filter to view their <strong class="text-[var(--color-text-primary)]">entire drill history</strong> at any time. This allows you to track long-term progress without the clutter.`)
                )
            },
            {
                question: 'Can I save drills to review later?',
                answer: React.createElement('p', null, `Yes! This is a ProEvals Plus feature. Subscribers can bookmark any drill after completing it and access it from the "Saved Drills" tab on their dashboard to review the scenario, expert analysis, and their performance.`)
            },
            {
                question: 'Can I cancel my subscription?',
                answer: React.createElement('p', null, `Yes, you can cancel your Plus subscription at any time. You will retain access to Plus features until the end of your current billing period.`)
            }
        ]
    }
];

export const FRAMEWORK_CONTENT: { category: string, items: FaqItem[] }[] = [
    {
        category: 'Prioritization Frameworks',
        items: [
            {
                question: 'RICE Scoring Model',
                answer: React.createElement('p', null, `RICE is a prioritization framework designed to help product managers determine which products, features, and other initiatives to put on their roadmaps by scoring them according to four factors: Reach, Impact, Confidence, and Effort. The final score is calculated as (Reach * Impact * Confidence) / Effort.`)
            },
            {
                question: 'Kano Model',
                answer: React.createElement(React.Fragment, null,
                    React.createElement('p', null, "A tool that categorizes customer needs to help prioritize features based on their impact on satisfaction. By understanding how features influence perception (from basic requirements to unexpected delights), teams can make informed decisions about what to build."),
                    React.createElement('h4', { className: "font-semibold text-[var(--color-text-primary)] mt-4" }, "1. Understanding Customer Needs"),
                    React.createElement('p', null, "The model classifies features into five categories:"),
                    React.createElement('ul', { className: "list-disc list-inside space-y-1 mt-2 text-sm" },
                        React.createElement('li', null, React.createElement('strong', null, "Must-be (Basic):"), " Features customers expect. Their absence causes dissatisfaction (e.g., working brakes on a car)."),
                        React.createElement('li', null, React.createElement('strong', null, "Performance (Linear):"), " More of these directly increases satisfaction (e.g., better fuel efficiency)."),
                        React.createElement('li', null, React.createElement('strong', null, "Excitement (Delighters):"), " Unexpected features that delight customers and create a competitive advantage (e.g., remote start)."),
                        React.createElement('li', null, React.createElement('strong', null, "Indifferent:"), " Features customers don't care about."),
                        React.createElement('li', null, React.createElement('strong', null, "Reverse:"), " Features that cause dissatisfaction when present.")
                    ),
                    React.createElement('h4', { className: "font-semibold text-[var(--color-text-primary)] mt-4" }, "2. Prioritizing Features"),
                    React.createElement('p', null, "Based on these categories, product managers prioritize by:"),
                    React.createElement('ul', { className: "list-disc list-inside space-y-1 mt-2 text-sm" },
                        React.createElement('li', null, "Ensuring all ", React.createElement('strong', null, "Must-be"), " needs are met first."),
                        React.createElement('li', null, "Investing in ", React.createElement('strong', null, "Performance"), " features for a direct return on satisfaction."),
                        React.createElement('li', null, "Strategically adding ", React.createElement('strong', null, "Excitement"), " features to differentiate and build loyalty."),
                        React.createElement('li', null, "Avoiding resources on ", React.createElement('strong', null, "Indifferent"), " or ", React.createElement('strong', null, "Reverse"), " features.")
                    ),
                    React.createElement('h4', { className: "font-semibold text-[var(--color-text-primary)] mt-4" }, "3. Implementation"),
                    React.createElement('p', null, `The model is often implemented using surveys that ask functional ("How would you feel if this was available?") and dysfunctional ("How would you feel if this was NOT available?") questions. Responses are analyzed to categorize features and inform the product roadmap.`)
                )
            },
            {
                question: 'MoSCoW Method',
                answer: React.createElement('p', null, `MoSCoW is a prioritization technique used in management, business analysis, project management, and software development to reach a common understanding with stakeholders on the importance they place on the delivery of each requirement. It stands for Must-have, Should-have, Could-have, and Won't-have (this time).`)
            },
        ]
    },
    {
        category: 'Growth & Metrics Frameworks',
        items: [
            {
                question: 'AARRR "Pirate" Metrics',
                answer: React.createElement('p', null, `AARRR is a five-metric framework for understanding your customers and improving your marketing funnel. The acronym stands for Acquisition (where do users come from?), Activation (do users have a great first experience?), Retention (do they come back?), Referral (do they tell others?), and Revenue (how do you make money?).`)
            },
        ]
    },
    {
        category: 'User Needs Frameworks',
        items: [
            {
                question: 'Jobs to Be Done (JTBD)',
                answer: React.createElement('p', null, `Jobs to Be Done is a framework that helps you understand customer motivation and needs. The core idea is that customers "hire" products to get a "job" done. By focusing on the underlying job, not the product or the customer demographics, you can innovate more effectively and create products that people truly want.`)
            },
        ]
    },
    {
        category: 'Business Strategy Frameworks',
        items: [
            {
                question: 'Business Model Canvas',
                answer: React.createElement(React.Fragment, null,
                    React.createElement('p', null, "The Business Model Canvas is a strategic management tool for developing new or documenting existing business models. It's a visual chart with elements describing a firm's or product's value proposition, infrastructure, customers, and finances, helping businesses align their activities by illustrating potential trade-offs."),
                    React.createElement('p', { className: "mt-2" }, "It is broken down into nine fundamental building blocks:"),
                    React.createElement('ol', { className: "list-decimal list-inside space-y-2 mt-4 text-sm" },
                        React.createElement('li', null, 
                            React.createElement('strong', null, "Customer Segments:"), 
                            " Defines the different groups of people or organizations a business aims to reach and serve."
                        ),
                        React.createElement('li', null, 
                            React.createElement('strong', null, "Value Proposition:"), 
                            " Describes the benefits customers receive from the product or service."
                        ),
                        React.createElement('li', null, 
                            React.createElement('strong', null, "Channels:"), 
                            " Outlines how a business reaches its customer segments to deliver its value proposition."
                        ),
                        React.createElement('li', null, 
                            React.createElement('strong', null, "Customer Relationships:"), 
                            " Explains the types of relationships a business establishes with its customer segments."
                        ),
                        React.createElement('li', null, 
                            React.createElement('strong', null, "Revenue Streams:"), 
                            " Describes how a business generates income from each customer segment."
                        ),
                        React.createElement('li', null, 
                            React.createElement('strong', null, "Key Resources:"), 
                            " Identifies the most important assets required to make the business model work."
                        ),
                        React.createElement('li', null, 
                            React.createElement('strong', null, "Key Activities:"), 
                            " Lists the most important things a business must do to make its business model work."
                        ),
                        React.createElement('li', null, 
                            React.createElement('strong', null, "Key Partnerships:"), 
                            " Highlights the network of suppliers and partners that enable the business model."
                        ),
                        React.createElement('li', null, 
                            React.createElement('strong', null, "Cost Structure:"), 
                            " Describes all the costs incurred to operate the business model."
                        )
                    )
                )
            }
        ]
    }
];