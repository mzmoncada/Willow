var data = {
    showJournalOptions : {
        text: [
            "How would you like to journal today? Say 'History' at any point to view your previous entries.",
            "What do you want to journal about today?",
            "How would you like to journal today?",
            "What do you want to journal about today? Say 'History' at any point to view your previous entries."
        ],
        quick_replies: [{"title":"(About my day)","block_names": ["DayGuided"]},{"title":"Dream Journal","block_names": ["DreamJournal"]},{"title":"Gratitude","block_names": ["GratitudeJournal"]},{"title":"Go back","block_names": ["InterestCheck"]}],
        
    },
    showDayGuided : {
        text: [
            "How do you feel today?",
            "How are you?",
            "How are you feeling?"
        ],
        quick_replies: [{"title":"Poor","set_attributes": {"primaryEmotion": "Poor"},"block_names": ["Poor_0"]},{"title":"Alright","set_attributes": {"primaryEmotion": "Alright"},"block_names": ["Alright_0"]},{"title":"Great","set_attributes": {"primaryEmotion": "Great"},"block_names": ["Great_0"]},{"title":"Go back","block_names": ["JournalOptions"]}],
        
    },
    askGratitude : {
        text: [
            "Gratitude makes our life beautiful. What do you feel grateful for today?",
            "Nothing is more honorable than a grateful heart. What are you grateful for today?",
            "An attitude of gratitude brings great things. What are you grateful for? ",
            "It is only with gratitude that life becomes rich. What do you feel gratitude for?",
        ],
        quick_replies: [{"title":"Go back","block_names": ["JournalOptions"]}],
        quick_reply_options: {"process_text_by_ai": false,"text_attribute_name": "gratitudeStory"}
    },
    getGreatDetailedEmotion : {
        text: [
            "I'm so happy to hear that! What emotion did you feel most strongly?",
            "Such a great news! What kind of emotion did you experience?",
            "Amazing! What emotion did you feel most strongly?",
            "I am so happy for you! What were your emotions?",
        ],
        quick_replies: [{"title":"Powerful","set_attributes": {"detailedEmotion": "Powerful"},"block_names": ["Great_1"]},{"title":"Peaceful","set_attributes": {"detailedEmotion": "Peaceful"},"block_names": ["Great_1"]},{"title":"Joyful","set_attributes": {"detailedEmotion": "Joyful"},"block_names": ["Great_1"]},{"title":"Go back","block_names": ["DayGuided"]}],
        
    },
    getGreatTopicCause : {
        text: [
            "That's a great emotion to feel! Let's keep the momentum going. What area contributed most to this?",
            "Such a great emotion! What area contributed to this the most?",
            "Great! Which area of your life made you feel this emotion?",
            "Wow! What do you think contributed to this emotion the most?",
        ],
        quick_replies: [{"title":"Career","set_attributes": {"topicCause": "Career"},"block_names": ["Cause_0"]},{"title":"Relationships","set_attributes": {"topicCause": "Relationships"},"block_names": ["Cause_0"]},{"title":"Self","set_attributes": {"topicCause": "Self"},"block_names": ["Cause_0"]},{"title":"Other","set_attributes": {"topicCause": "Other"},"block_names": ["Cause_0"]},{"title":"Go back","block_names": ["Great_0"]}],
        
    },
    askAlrightMessage : {
        text: [
            "Some days are better than others. Don't worry! What happened today?",
            "Don't worry. You can tell me what happened today?",
            "Don't worry. Everything will be okay in the end. Why do you feel this way?",
            "Take a deep breadth and relax and tell me what happened today?",
        ],
        "quick_replies": [{"title":"Go back","block_names": ["DayGuided"]}],
        "quick_reply_options": {"process_text_by_ai": false,"text_attribute_name": "causeDetail"}
    },
    getPoorDetailedEmotion : {
        text: [
            "I'm sorry you haven't been having a good day :( . What are some primary emotions you felt?",
            "Everything will be okay in the end. What emotion did you feel the most?",
            "Tough times don't last but tough people do! What emotion did you experience the most today?",
            "I am so sorry to hear that! What emotion did you experience the most today?"
        ],
        quick_replies: [{"title":"Sad","set_attributes": {"detailedEmotion": "Sad"},"block_names": ["Poor_1"]},{"title":"Mad","set_attributes": {"detailedEmotion": "Mad"},"block_names": ["Poor_1"]},{"title":"Scared","set_attributes": {"detailedEmotion": "Scared"},"block_names": ["Poor_1"]},{"title":"Go back","block_names": ["DayGuided"]}],
        
    },
    getPoorTopicCause : {
        text: [
            "I'm sorry you felt that way? What area contributed most to this?",
            "Don't worry! It's gonna be alright. Which area of your life contributed most to this?",
            "You are a strong person. Let me know which area contributed to this emotion.",
            "Every little thing's gonna be alright! What do you think contributed to this the most?"
        ],
        quick_replies: [{"title":"My Career","set_attributes": {"topicCause": "My Career"},"block_names": ["Cause_0"]},{"title":"My Relationships","set_attributes": {"topicCause": "My Relationships"},"block_names": ["Cause_0"]},{"title":"Myself","set_attributes": {"topicCause": "Myself"},"block_names": ["Cause_0"]},{"title":"Other","set_attributes": {"topicCause": "Other"},"block_names": ["Cause_0"]},{"title":"Go back","block_names": ["Poor_0"]}],
        
    },
    askDreamType : {
        text: [
            "What kind of dream did you see?",
            "What kind of dream did you have last night?",
            "What kind of dream did you have last night?",
            "How would you describe your dream?"
        ],
        "quick_replies": [{"title":"Nothing","set_attributes": {"dreamType": "Nothing"},"block_names": ["Dream_0"]},{"title":"Confusing","set_attributes": {"dreamType": "Confusing"},"block_names": ["Dream_0"]},{"title":"Scary","set_attributes": {"dreamType": "Scary"},"block_names": ["Dream_0"]},{"title":"Nightmare","set_attributes": {"dreamType": "Nightmare"},"block_names": ["Dream_0"]},{"title":"Pleasant","set_attributes": {"dreamType": "Pleasant"},"block_names": ["Dream_0"]},{"title":"Go back","block_names": ["JournalOptions"]}],
        
    },
    askDreamStory : {
        text: [
            "Tell me more about your dream.",
            "Please let me know more about your dream.",
            "You can tell me more about your dream.",
            "I would like to know more about your dream."
        ],
        "quick_replies": [{"title":"Go back","block_names": ["DreamJournal"]}],
        "quick_reply_options": {"process_text_by_ai": false,"text_attribute_name": "dreamStory"}
    },
    askDreamRate : {
        text: [
            "How will you rate it on 1-10?",
            "On the scale of 1 to 10, how would you rate it?",
            "How would you rate it from 1 to 10?",
            "How do you think the dream was from 1 to 10?"
        ],
        "quick_replies": [{"title":"1","set_attributes": {"dreamRate": "1"},"block_names": ["SaveDreamJournal"]},{"title":"2","set_attributes": {"dreamRate": "2"},"block_names": ["SaveDreamJournal"]},{"title":"3","set_attributes": {"dreamRate": "3"},"block_names": ["SaveDreamJournal"]},{"title":"4","set_attributes": {"dreamRate": "4"},"block_names": ["SaveDreamJournal"]},{"title":"5","set_attributes": {"dreamRate": "5"},"block_names": ["SaveDreamJournal"]},{"title":"6","set_attributes": {"dreamRate": "6"},"block_names": ["SaveDreamJournal"]},{"title":"7","set_attributes": {"dreamRate": "7"},"block_names": ["SaveDreamJournal"]},{"title":"8","set_attributes": {"dreamRate": "8"},"block_names": ["SaveDreamJournal"]},{"title":"9","set_attributes": {"dreamRate": "9"},"block_names": ["SaveDreamJournal"]},{"title":"10","set_attributes": {"dreamRate": "10"},"block_names": ["SaveDreamJournal"]},{"title":"Go back","block_names": ["JournalOptions"]}],
        
    },
    askForFeedbackText : [
        "Would you like to give us feedback so that we can improve our service?",
        "Your feedback will help us give you better service next time. So would you like to give us your feedback?",
        "Do you have any feedbacks for us?",
        "We were wondering if you could spare a few minutes to let us know what we are getting right and what we can improve."
    ],
    askForFeedbackThumbs : {
        text: [
            "How was your experience? ",
            "Please let me know how was your experience?",
            "So how did you feel?",
            "How was our service?"
        ],
        "quick_replies": [{"title":"👍","set_attributes": {"feedbackThumbs": "up"},"block_names": ["FeedBackBlock"]},{"title":"👎","set_attributes": {"feedbackThumbs": "down"},"block_names": ["FeedBackBlock"]}],
        "quick_reply_options": {"process_text_by_ai": true}
    },
    endingText : [
        "Congratulations, you just completed a flow! Check-in later today or tomorrow to earn more experience! ",
        "Congrats, you just completed a flow! Keep up the good work.",
        "Congratulation, you completed an entire flow."
    ],
    rateDailyJournalText : [
        "How will you rate your day on 1-10 ?",
        "On the scale of 1 to 10, how would you rate your day?",
        "How would you rate your day from 1 to 10?",
        "How do you think your day was from 1 to 10?"
    ],
    reminderMessagesText : [
        "Take a moment to check in with yourself and just breathe. How many times do you get caught up in your thoughts throughout the day and forget to appreciate yourself now?",
        "Quick mindfulness exercise: breathe in for a count of 5, hold for 5, and exhale for a count of 5. Repeat 5 times.",
        "Take a moment to be compassionate to yourself right now. Breathe. Think about the gratitude you have for yourself and all you have been through.",
        "Feel into your entire body. Where are you holding tension? Breathe deeply into those areas. How do you feel afterwards?",
        "\"Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.\" - Buddha",
        "\"Surrender to what is. Let go of what was. Have faith in what will be.\"- Sonia Ricotti",
        "\"The present moment is filled with joy and happiness. If you are attentive, you will see it.\" - Thich Nhat Hanh",
        "\"Mindfulness isn't difficult. We just need to remember to do it.\" - Sharon Salzberg",
        "\"Be happy in the moment, that's enough. Each moment is all we need, not more.\" - Mother Teresa",
        "\"What day is it?\" asked Pooh. \"It's today,\" squeaked Piglet. \"My favourite day,\" said Pooh."
    ]

};
data.rateAlrightDailyJournal = {
    text: data.rateDailyJournalText,
    quick_replies: [{"title":"1","set_attributes": {"dayRate": "1"},"block_names": ["Alright_0_3"]},{"title":"2","set_attributes": {"dayRate": "2"},"block_names": ["Alright_0_3"]},{"title":"3","set_attributes": {"dayRate": "3"},"block_names": ["Alright_0_3"]},{"title":"4","set_attributes": {"dayRate": "4"},"block_names": ["Alright_0_3"]},{"title":"5","set_attributes": {"dayRate": "5"},"block_names": ["Alright_0_3"]},{"title":"6","set_attributes": {"dayRate": "6"},"block_names": ["Alright_0_3"]},{"title":"7","set_attributes": {"dayRate": "7"},"block_names": ["Alright_0_3"]},{"title":"8","set_attributes": {"dayRate": "8"},"block_names": ["Alright_0_3"]},{"title":"9","set_attributes": {"dayRate": "9"},"block_names": ["Alright_0_3"]},{"title":"10","set_attributes": {"dayRate": "10"},"block_names": ["Alright_0_3"]}],
    
};
data.getDayRate = {
    text: data.rateDailyJournalText,
    quick_replies: [{"title":"1","set_attributes": {"dayRate": "1"},"block_names": ["Cause_1"]},{"title":"2","set_attributes": {"dayRate": "2"},"block_names": ["Cause_1"]},{"title":"3","set_attributes": {"dayRate": "3"},"block_names": ["Cause_1"]},{"title":"4","set_attributes": {"dayRate": "4"},"block_names": ["Cause_1"]},{"title":"5","set_attributes": {"dayRate": "5"},"block_names": ["Cause_1"]},{"title":"6","set_attributes": {"dayRate": "6"},"block_names": ["Cause_1"]},{"title":"7","set_attributes": {"dayRate": "7"},"block_names": ["Cause_1"]},{"title":"8","set_attributes": {"dayRate": "8"},"block_names": ["Cause_1"]},{"title":"9","set_attributes": {"dayRate": "9"},"block_names": ["Cause_1"]},{"title":"10","set_attributes": {"dayRate": "10"},"block_names": ["Cause_1"]}],
    
};

module.exports.data = data;