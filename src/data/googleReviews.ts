export type GoogleReview = {
  id: string;
  quote: string | null;
  name: string;
  source: "Google review";
  publishedAtDate: string;
  stars: number;
  avatarUrl: string;
  reviewUrl: string;
};

/**
 * Current Google Maps review snapshot fetched on 2026-10-14.
 * Source run: https://console.apify.com/actors/Xb8osYTtOjlsgI6k9/runs/WXwCWrpCyhJq25o5S
 * Source dataset: https://console.apify.com/storage/datasets/7A5difTv2Z4uue3vC
 *
 * All 40 review records are represented. Written reviews use faithful excerpts
 * of at most 24 words; the one rating-only review remains text-free.
 */
export const googleReviews = [
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2t4dVRYQjRhRGRYYzBWM1owTndhMHhWU0d0TU9IYxAB",
    "quote": "Inconsistent/overlapping customers schedule, expect at least 75% of scheduled practice to start at least 5-10minutes late. Lack of accountability from management during conflict resolution.…",
    "name": "Chibuike Eze",
    "source": "Google review",
    "publishedAtDate": "2026-10-10T19:14:15.419Z",
    "stars": 1,
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjUKpeyegIOTrk5UdbFWSXh7m4AJj6LCpnL6EN7hyaGSj4Rf0bhGHQ=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2t4dVRYQjRhRGRYYzBWM1owTndhMHhWU0d0TU9IYxAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOkxuTXB4aDdXc0V3Z0Nwa0xVSGtMOHc%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT21KSVJrVkpUbWhJUzJkblNtSnNielZoWWpGZlNrRRAB",
    "quote": "Booking my free trial with Shanaya’s Driving School was effortless! The office staff were super helpful, and made everything easy from the first contact.…",
    "name": "Lovejeet Multani",
    "source": "Google review",
    "publishedAtDate": "2026-10-07T21:58:36.785Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjVSla0zMfHqHOpp0PHC832cHdywtWk1nnSbMhODINyUIdm9F78=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT21KSVJrVkpUbWhJUzJkblNtSnNielZoWWpGZlNrRRAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOmJIRkVJTmhIS2dnSmJsbzVhYjFfSkE%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT21VM05FazNUVlJRVEVaUE9VTXdkelpzZEVOclZrRRAB",
    "quote": "I had a great experience with my free trial lesson! My instructor Azhar was very kind, patient, and made me feel comfortable right from…",
    "name": "Kayley L",
    "source": "Google review",
    "publishedAtDate": "2026-09-22T19:45:56.507Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocKrLlpR9bJN2svWYexX0otupAMDyBnvpe2NWo22YL4mFUKFbA=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT21VM05FazNUVlJRVEVaUE9VTXdkelpzZEVOclZrRRAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOmU3NEk3TVRQTEZPOUMwdzZsdENrVkE%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT20xa1ExOW9ibXBsUjNKUGRqSTBWMlE0WkVKRldrRRAB",
    "quote": "Great free trial lesson! The instructor explained the basics clearly, gave helpful feedback, and was very kind and patient.",
    "name": "Carls Jr",
    "source": "Google review",
    "publishedAtDate": "2026-09-09T02:50:56.733Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocJWLGPY40YqhESqZ-dENlYr_kBncAvXmoaHM0Alo7Z1Wi2cCw=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT20xa1ExOW9ibXBsUjNKUGRqSTBWMlE0WkVKRldrRRAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOm1kQ19obmplR3JPdjI0V2Q4ZEJFWkE%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT25sMVZYSk1OaTFJTmxCbFRHdGxkbWxNYm1SSloxRRAB",
    "quote": "⭐️⭐️⭐️⭐️⭐️ I highly recommend Azhar, my driving instructor! When I first started, I was very confused and nervous about driving. Azhar was patient, supportive,…",
    "name": "Umu mamad",
    "source": "Google review",
    "publishedAtDate": "2026-08-25T21:08:59.230Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocJjjQxYha1mjr3M6G5o3Gtcm9TnBtFlI6TjNX6URG9OH7i0Unhi=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT25sMVZYSk1OaTFJTmxCbFRHdGxkbWxNYm1SSloxRRAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOnl1VXJMNi1INlBlTGtldmlMbmRJZ1E%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2tKVmJ6WXhWa3RRUkZCUFNXRTNhbGRyVGpCb1UyYxAB",
    "quote": "Signed up for ERA assessment lesson the lesson was very helpful. Learned a lot which I didn't know before.I definitely will recommend the ERA…",
    "name": "don cottrell",
    "source": "Google review",
    "publishedAtDate": "2026-08-15T21:26:31.837Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocIR9VyKcAcAKO9B98JX2LjM2q5Qfq61u5paNRN26PEvhWX8=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2tKVmJ6WXhWa3RRUkZCUFNXRTNhbGRyVGpCb1UyYxAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOkJVbzYxVktQRFBPSWE3aldrTjBoU2c%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2tzdGVqWnpZV2RmTUVkSGJGOU5VREk1VkRGUWJsRRAB",
    "quote": "Great first impression with trial Lesson and very kind and thoughtful!",
    "name": "Mya Chumber",
    "source": "Google review",
    "publishedAtDate": "2026-08-14T22:52:02.187Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocItMB83wpdi28TQUhvxKW0xA6AaBPdIfnlihSFpSZEBy-yx=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2tzdGVqWnpZV2RmTUVkSGJGOU5VREk1VkRGUWJsRRAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOkstejZzYWdfMEdHbF9NUDI5VDFQblE%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2toVlNrMDRMVzF5Vm1aQ05qaGxkVWd5UXpkeVkxRRAB",
    "quote": "Tried out the free assessment and it felt very useful to get an honest feedback. The instructor took their time and explained everything methodically.…",
    "name": "Tee",
    "source": "Google review",
    "publishedAtDate": "2026-08-12T20:36:32.593Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjUjbrN476JHWGOnXTfx7NoyhAghSA0r-iOmRGuxcSaLwfAWV0XV=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2toVlNrMDRMVzF5Vm1aQ05qaGxkVWd5UXpkeVkxRRAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOkhVSk04LW1yVmZCNjhldUgyQzdyY1E%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT25ORE4xRm1TRFZQVDJnNVR6RjVXamRNY1hZMFptYxAB",
    "quote": "Patient, non-judgemental, and makes it a point to give positive reinforcement. Thank you!!",
    "name": "Emily Menary",
    "source": "Google review",
    "publishedAtDate": "2026-08-09T03:42:58.275Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjWTKYqY1LRPqbeCuAS3jsvk9X95qf9a6y9Kp5fajaHMV4_Bbn84=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT25ORE4xRm1TRFZQVDJnNVR6RjVXamRNY1hZMFptYxAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOnNDN1FmSDVPT2g5TzF5WjdMcXY0Zmc%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2tzek5tbEZUMVozT0VreVYwUjJSMk5xVUZwSE5YYxAB",
    "quote": "It was good i learned some basic things. And it was helpfull",
    "name": "Jagdeep Kauur",
    "source": "Google review",
    "publishedAtDate": "2026-08-08T21:41:05.743Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocIaKKfsE4kxJhDIB5H3z99CXuOU4uCjCENpSV4MRYQ8yjc9pA=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2tzek5tbEZUMVozT0VreVYwUjJSMk5xVUZwSE5YYxAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOkszNmlFT1Z3OEkyV0R2R2NqUFpHNXc%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT25aQ1REbHNXVk5xYTA5dmVFMUlNemhGYTNkM2RXYxAB",
    "quote": "I had my driving lesson today, and Azy was my instructor. He taught very well and explained everything clearly and in great detail, which…",
    "name": "Amita",
    "source": "Google review",
    "publishedAtDate": "2026-08-08T04:34:33.397Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocLhmn8Ajpu57y_vrFSuZGMridZia-teTzmVqX09V9Ls7cJxlQ=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT25aQ1REbHNXVk5xYTA5dmVFMUlNemhGYTNkM2RXYxAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOnZCTDlsWVNqa09veE1IMzhFa3d3dWc%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2tSUlJWTktNRUp0ZDA1U1NXVXRWRFp6VjFabU1VRRAB",
    "quote": "Highly recommend their free trial driving lesson! Booking was easy, and they accommodated my preferred schedule. The instructor was patient, professional, and made me…",
    "name": "Alden Caldo",
    "source": "Google review",
    "publishedAtDate": "2026-08-06T16:02:47.220Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocIqGkHkS5TATYaFbK1PVeza_-q95oU57kHVXN_jBfXsaCi4lg=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2tSUlJWTktNRUp0ZDA1U1NXVXRWRFp6VjFabU1VRRAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOkRRRVNKMEJtd05SSWUtVDZzV1ZmMUE%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT25odE9VYzNZMFZCYnpZelYzcFViSHBpTFZseVIwRRAB",
    "quote": "Azhar is an outstanding driving instructor—patient, professional, and very knowledgeable. He explains everything clearly, builds confidence behind the wheel, and makes learning to drive…",
    "name": "Karan Gulati",
    "source": "Google review",
    "publishedAtDate": "2026-08-05T07:09:10.527Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocLDjl42gDSzWxIF1nYLJPDGMnVyDIW02sBgwhixh1imUSvg7A=s1920-c-rp-mo-ba12-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT25odE9VYzNZMFZCYnpZelYzcFViSHBpTFZseVIwRRAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOnhtOUc3Y0VBbzYzV3pUbHpiLVlyR0E%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2t0U2VUZFhRVk5sZDBzMmEyVkVhbWxZZW1wMk5XYxAB",
    "quote": "I had a great driving experience today. The instructor was really helpful in all ways. Besides, he is knowledgeable, and skilful. I enjoyed my…",
    "name": "Alfred Taban",
    "source": "Google review",
    "publishedAtDate": "2026-08-04T20:14:51.161Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjUR-lsrMF1iUWNNr_EjGLTZGq3AiJ1QPBRQwQS3c6ZYmLwiya73dQ=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2t0U2VUZFhRVk5sZDBzMmEyVkVhbWxZZW1wMk5XYxAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOktSeTdXQVNld0s2a2VEamlYemp2NWc%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2xWek1XRlhWRVF3YkdSMU1UQnFWRWRrWTFjM1FuYxAB",
    "quote": "Azi was very professional, knowledgeable, and made me feel comfortable throughout my trial class / driving assessment. He took the time to identify the…",
    "name": "Harriet",
    "source": "Google review",
    "publishedAtDate": "2026-08-04T05:13:30.442Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocL3VfoTgvIxGWTqKIcUAXJjpISuOK7fS-4Q78EYBT3R7KE7=s1920-c-rp-mo-ba12-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2xWek1XRlhWRVF3YkdSMU1UQnFWRWRrWTFjM1FuYxAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOlVzMWFXVEQwbGR1MTBqVEdkY1c3Qnc%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2xCbE1WbGFhMlpGVUVsT09HRkhjVjlMUTJGWWRXYxAB",
    "quote": "I had a very good experienced driving an automatic transmission car with a very patient and thorough instructor in Azy. It’s my first and…",
    "name": "Rolando Jr Godinez",
    "source": "Google review",
    "publishedAtDate": "2026-07-31T17:25:21.390Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjViOcfHf-NYvcg_F0zA1W1jvkL_1HhJoz47k-g3ynn3keuOSW0v=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2xCbE1WbGFhMlpGVUVsT09HRkhjVjlMUTJGWWRXYxAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOlBlMVlaa2ZFUElOOGFHcV9LQ2FYdWc%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2xONlVsOVFhM0ZwVkRWU01FaG5YM28xV2xVeVRtYxAB",
    "quote": "They so friendly, and so nice with my son, Recommend with anyone , Thank you so much",
    "name": "Cindy Trinh",
    "source": "Google review",
    "publishedAtDate": "2026-07-31T03:38:06.170Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjWYGxOC6iqmLLGXnIfh-oBaQ9jNnefnsH4Vc6ad1Ey0T8r_XGGa=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2xONlVsOVFhM0ZwVkRWU01FaG5YM28xV2xVeVRtYxAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOlN6Ul9Qa3FpVDVSMEhnX3o1WlUyTmc%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT205TmRURklhMjVCUVY5eE9VbFlTSFV0T0VOWmRYYxAB",
    "quote": "I had an excellent trial lesson with Shanaya's driving School. My instructor, Azhar, was very knowledgeable and professional. Before this, I had already taken…",
    "name": "Aulakh",
    "source": "Google review",
    "publishedAtDate": "2026-07-30T06:55:42.951Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocJXQAz01kaSN6N1q55MvgXgXo5jsV5v_QoRe9io-LHkTuV3Nw=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT205TmRURklhMjVCUVY5eE9VbFlTSFV0T0VOWmRYYxAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOm9NdTFIa25BQV9xOUlYSHUtOENZdXc%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT25kYVZETTBWbXBhWkdreWRVbDRiMDAxTkRSV2MyYxAB",
    "quote": "I took a trial lesson and had a great experience. The instructor was patient, knowledgeable, and made me feel comfortable even though I was…",
    "name": "Yogita Bang",
    "source": "Google review",
    "publishedAtDate": "2026-07-27T07:15:19.253Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjXc6iErp5LKTmvZpH3GKRadagWyVtDV6KU5DWjJaKvj3r5y6ZOsew=s1920-c-rp-mo-ba12-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT25kYVZETTBWbXBhWkdreWRVbDRiMDAxTkRSV2MyYxAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOndaVDM0VmpaZGkydUl4b001NDRWc2c%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2pkd0xXeDRVRTlyV0dkSlVXWk9SVkZRU0hab05HYxAB",
    "quote": null,
    "name": "Jake Pinote",
    "source": "Google review",
    "publishedAtDate": "2026-07-26T20:08:54.717Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjUf0s6YyNT1wG4EEH5WBy28Hoa57R6dz8UblkCVkJpnRb31UFqb=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2pkd0xXeDRVRTlyV0dkSlVXWk9SVkZRU0hab05HYxAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOjdwLWx4UE9rWGdJUWZORVFQSHZoNGc%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2xadE1uZG9aWEpVWDJONlYwWTBWVEpoYUdZdFFsRRAB",
    "quote": "I tried their trial class, and it was definitely worth it. They have a complete checklist to make sure every student is fully prepared…",
    "name": "AMAYA John",
    "source": "Google review",
    "publishedAtDate": "2026-07-26T00:08:47.134Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocLvuwyWikbFeSlMCAMstHiUBR1wLkNST2EeJbFPOhf_9R5uAQ=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2xadE1uZG9aWEpVWDJONlYwWTBWVEpoYUdZdFFsRRAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOlZtMndoZXJUX2N6V0Y0VTJhaGYtQlE%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2xwWloxUktMWFZZUWxnNVEzbGxUVE53TVhSRWIyYxAB",
    "quote": "I highly recommend this driving school! Azy, my son’s instructor is very patient, knowledgeable, and generous in sharing his expertise. My son started with…",
    "name": "Vanessa Nicdao",
    "source": "Google review",
    "publishedAtDate": "2026-07-24T06:06:57.828Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjVWknfL5baqBEjrsXFDAcxqTPfu1n1MwvhwyizbfVa1tzqakaWsVA=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2xwWloxUktMWFZZUWxnNVEzbGxUVE53TVhSRWIyYxAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOlpZZ1RKLXVYQlg5Q3llTTNwMXREb2c%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2tsQlRWODFiM1JrTjJkT09EQnNOM1l6Y1daWE1GRRAB",
    "quote": "I really appreciated how Azy started by teaching the fundamentals and taking the time to explain the details of the car. Previous instructors never…",
    "name": "rebecca mushata",
    "source": "Google review",
    "publishedAtDate": "2026-07-21T01:57:44.052Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocIFssR8tr06pFfk03DpXeWyXxT8CObOm6xhKUvfvFr24v9m4w=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2tsQlRWODFiM1JrTjJkT09EQnNOM1l6Y1daWE1GRRAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOklBTV81b3RkN2dOODBsN3YzcWZXMFE%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2s1d1pXRmhOV1ZIVEVscE5qVkhTWFpZWm5oYWEzYxAB",
    "quote": "Great training, knowledge and skills earned with Shanaya’s driving school.",
    "name": "Bikram Sharma USA",
    "source": "Google review",
    "publishedAtDate": "2026-07-20T23:54:50.928Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjUJUCiHHSIPoL7-0j_DYlCXkaWg0pLK-UDqtEZqnTkSnSY4ZUP3=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2s1d1pXRmhOV1ZIVEVscE5qVkhTWFpZWm5oYWEzYxAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOk5wZWFhNWVHTElpNjVHSXZYZnhaa3c%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT21SVGVsTnJZbW95WWtnNWNYSTRRMUphTTJ3eGJVRRAB",
    "quote": "I love it My first lesson with them is great I was nervous for the first 10 minutes then I got comfortable with my…",
    "name": "Caseydean Henry",
    "source": "Google review",
    "publishedAtDate": "2026-07-12T22:06:32.626Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjXhs_Wlp79wkMLn-H6g6fbkQ_Ghqkoyr8BFXaYWVzSfU52XTzI=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT21SVGVsTnJZbW95WWtnNWNYSTRRMUphTTJ3eGJVRRAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOmRTelNrYmoyYkg5cXI4Q1JaM2wxbUE%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2pCbVFrY3pXVTl4YTJ0RWRIRkNiR0k0YkdkWU9WRRAB",
    "quote": "My daughter has been extremely nervous behind the wheel since obtaining her L, and therefore has only had a few lessons from myself and…",
    "name": "Angela",
    "source": "Google review",
    "publishedAtDate": "2026-07-08T16:26:08.405Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocKTGkj6nSmtAFA3ElpsGC_6PM1hbuwe4-UMqgDiuQhaT-KSYA=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2pCbVFrY3pXVTl4YTJ0RWRIRkNiR0k0YkdkWU9WRRAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOjBmQkczWU9xa2tEdHFCbGI4bGdYOVE%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2pORVFtbENaRUpoWDNaMFlXMXlZbkJNVm1oNGNGRRAB",
    "quote": "Thank you Azy for all the help to prepare me for my road test.. I strongly recommend Azy brst instructir in Victoria",
    "name": "Navdeep Singh Malhi",
    "source": "Google review",
    "publishedAtDate": "2026-07-07T21:57:50.542Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocLM9P8SjpPjkJLJuZverxDND82YdNOv00kD_aEQJsxzQlDnJw=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2pORVFtbENaRUpoWDNaMFlXMXlZbkJNVm1oNGNGRRAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOjNEQmlCZEJhX3Z0YW1yYnBMVmh4cFE%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2s1RFlucERkRWt4ZFY5b01VeE5SbVZETFRKemQwRRAB",
    "quote": "Azy is a good and very patient instructor. He is what every new driver need for learning experience. 👌🏻",
    "name": "Ritchell Antonio",
    "source": "Google review",
    "publishedAtDate": "2026-07-06T18:01:40.051Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocKySbmrz4o_W7XPynn48NuWw_AoZEI5o4q0ht699UntfJ06Xw=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2s1RFlucERkRWt4ZFY5b01VeE5SbVZETFRKemQwRRAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOk5DYnpDdEkxdV9oMUxNRmVDLTJzd0E%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT21kSmRqRnhVMHBOTVUxS2VqWkdUVkp1YzBVM1NuYxAB",
    "quote": "Instructor is very patient and informative.Thank you for the experience",
    "name": "Roniza Santiago",
    "source": "Google review",
    "publishedAtDate": "2026-07-05T00:32:59.216Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocIJhPAYWbjSaTN8ixEQF2kCW1AqHL6tpplCDFIJ6C6tjQ1fFQ=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT21kSmRqRnhVMHBOTVUxS2VqWkdUVkp1YzBVM1NuYxAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOmdJdjFxU0pNMU1KejZGTVJuc0U3Snc%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT21oeVVEaFVVVXhvUTFKdmRFRkZkM0EyU1dST1kyYxAB",
    "quote": "I had a great experience learning with Shanaya Driving School. My instructor was patient, professional, and explained everything clearly, which made me feel confident…",
    "name": "Akinshe deborah",
    "source": "Google review",
    "publishedAtDate": "2026-07-04T15:22:56.958Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocKw9NcpUemY5MgMlp1INOCCaf_7t7mCvqjOsdBtcBctOGYaMQ=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT21oeVVEaFVVVXhvUTFKdmRFRkZkM0EyU1dST1kyYxAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOmhyUDhUUUxoQ1JvdEFFd3A2SWROY2c%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2xOQ1FYSmpkWEUzTVVWb01VaDNWRGxETjIxaGFsRRAB",
    "quote": "I only took one class with this academy , and I really enjoyed it. The instructor is very patient and explains everything very well.…",
    "name": "Lauren Valoyes",
    "source": "Google review",
    "publishedAtDate": "2026-07-02T23:58:16.194Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocIhcmZ9O-ITfxA1r1l7nczQ0eOXOSa1efI5c_Nbe9a1VZ_PEg=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2xOQ1FYSmpkWEUzTVVWb01VaDNWRGxETjIxaGFsRRAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOlNCQXJjdXE3MUVoMUh3VDlDN21halE%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2tNM05UTjBZWGRGUzB0UlJqSXdWMUZ3UjBsU1dHYxAB",
    "quote": "I had an amazing experience with Shanaya's Driving School and highly recommend them to anyone looking to learn driving in Victoria. My instructor, Azhar,…",
    "name": "Divya Pandya",
    "source": "Google review",
    "publishedAtDate": "2026-07-02T04:40:45.158Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocLUNlf2q6NfvzOtgd2XIEKT2ra-nF2fxkIkFCtmJ4BpJvMSXg=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2tNM05UTjBZWGRGUzB0UlJqSXdWMUZ3UjBsU1dHYxAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOkM3NTN0YXdFS0tRRjIwV1FwR0lSWGc%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2tJd1VFMVNPRzVmT0hsWFIwRXRZVmxTVjNsb2VXYxAB",
    "quote": "I had a great experience with Shanaya's Driving School, especially with Azy as my instructor. He is calm, patient, professional, and explains everything clearly,…",
    "name": "Zandra Tiemsim",
    "source": "Google review",
    "publishedAtDate": "2026-07-02T03:05:47.897Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocJgRsVzSRyl6t_4_KiBi95H6JlSH6yy9vKJ9U3hjuWIFqHK=s1920-c-rp-mo-ba12-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2tJd1VFMVNPRzVmT0hsWFIwRXRZVmxTVjNsb2VXYxAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOkIwUE1SOG5fOHlXR0EtYVlSV3loeWc%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2tOYWJ6VnpXVVpDWm1GMFNIUnBaVlJvUzAxa00wRRAB",
    "quote": "Mr. Azhar is the best coach I have ever seen. He is always nice and professional, he increased me a lot of confidence so…",
    "name": "david li",
    "source": "Google review",
    "publishedAtDate": "2026-06-28T05:50:10.153Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjXKmZah_VtqZmfWKakNQzap7_Azz34Vy8AhtE_toqzKgU3gni0=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2tOYWJ6VnpXVVpDWm1GMFNIUnBaVlJvUzAxa00wRRAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOkNabzVzWUZCZmF0SHRpZVRoS01kM0E%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT25ONE1uUkhiekF5V0dSclZGTnVTbVZKVFhCT2NVRRAB",
    "quote": "So I’ve been learning from here for a while now ( about 2 months, I believe ), so I figured knows probably a good…",
    "name": "Isai Frenette",
    "source": "Google review",
    "publishedAtDate": "2026-06-23T04:04:45.627Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjW6jpRv4bVqWznq7uM9MU9pz9uWPwu0U8EgV_eAYQsEVkZm5G8=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT25ONE1uUkhiekF5V0dSclZGTnVTbVZKVFhCT2NVRRAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOnN4MnRHbzAyWGRrVFNuSmVJTXBOcUE%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT25jNGRXSkZValZYYTBKdWRrZE5iV2RpY2twclJIYxAB",
    "quote": "Everything changed when I started lessons with Azhar at Shanaya’s Driving School. Azhar is incredibly patient, knowledgeable, and very supportive person. He helped me…",
    "name": "Violet Lily",
    "source": "Google review",
    "publishedAtDate": "2026-06-22T19:09:08.050Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjWDY1ocd_eVhJ2oJwINhwtK4Bh3CNaDwme5KMyj6nsWRUiltYc=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT25jNGRXSkZValZYYTBKdWRrZE5iV2RpY2twclJIYxAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOnc4dWJFUjVXa0JudkdNbWdickprRHc%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2s1MWNub3RaekIxYkRFNE0zb3pWa2R2YnpZek5VRRAB",
    "quote": "I’ve been taking lessons with Shanaya’s Driving School, and I’ve started feeling so much more confident behind the wheel. The instructor is very knowledgeable…",
    "name": "Alexis Dumaresq",
    "source": "Google review",
    "publishedAtDate": "2026-06-12T00:50:20.589Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjXN08wKN9e8dgdXD9Hq4FkavsdaEzc0vxtMA4AyKJtOqm1FjUZM=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2s1MWNub3RaekIxYkRFNE0zb3pWa2R2YnpZek5VRRAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOk51cnotZzB1bDE4M3ozVkdvbzYzNUE%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2w5WFJ6TmxVR3h6WjBrdFZYcGZZbnBSVVRJNFUwRRAB",
    "quote": "Azhar is a fantastic person and an excellent instructor. He has incredible knowledge of navigating the streets and always guides me through the areas…",
    "name": "Siddharth Pandya",
    "source": "Google review",
    "publishedAtDate": "2026-06-03T20:37:31.923Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocLMyaIVv7PBXSbpP4FG0s3a2tq3jw-vLVXD0_jACWsKIHfWrg=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2w5WFJ6TmxVR3h6WjBrdFZYcGZZbnBSVVRJNFUwRRAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOl9XRzNlUGxzZ0ktVXpfYnpRUTI4U0E%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT21KaGRUbHRiMnBmV25BNExWbE5XVlptU3kwelIzYxAB",
    "quote": "I’m very happy with the driving lessons both my kids have done. I’ve seen their skills improve and their confidence behind the wheel has…",
    "name": "Tanya Frenette",
    "source": "Google review",
    "publishedAtDate": "2026-06-02T02:23:54.923Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjWamoQQCGuDLnNN6xG0F_D6mFkSaid3Ap0bBBavCeuXSShuDcU=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT21KaGRUbHRiMnBmV25BNExWbE5XVlptU3kwelIzYxAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOmJhdTltb2pfWnA4LVlNWVZmSy0zR3c%7C%7C?hl=en"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2xKS2JtRTFiUzFmZUdZMGJpMWlSblJRTFUxU1UxRRAB",
    "quote": "It was a great experience with the driving school, the teacher was nice and also the philosophy of the teacher's teaching was really fantastic.",
    "name": "사진자연",
    "source": "Google review",
    "publishedAtDate": "2026-05-30T21:39:07.115Z",
    "stars": 5,
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjUickFmTVIS4ClnoWqvbI9NLx4Uy3wP04HDZc9Ga9HmD8MUCouj=s1920-c-rp-mo-br100",
    "reviewUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2xKS2JtRTFiUzFmZUdZMGJpMWlSblJRTFUxU1UxRRAB!2m1!1s0x0:0xf890ce589bc36216!3m1!1s2@1:CAIQACodChtycF9oOlJKbmE1bS1feGY0bi1iRnRQLU1SU1E%7C%7C?hl=en"
  }
] satisfies GoogleReview[];

