/* ==========================================================================
   PawCompanion — Content & media data
   All imagery (Unsplash) and videos (Wikimedia Commons) are freely licensed
   (no copyright). Update the "updates" array daily to refresh the
   "Today's Solution" hub (good for Google Ads / SEO freshness).
   ========================================================================== */
window.PC = window.PC || {};

/* ---------- Images (Unsplash — free license, no attribution required) ---------- */
PC.img = {
  heroMain: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1100&q=80',
  heroCompanion: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=900&q=80',
  dog1: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&q=80',
  dog2: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=900&q=80',
  dog3: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=900&q=80',
  dog4: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=900&q=80',
  dog5: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=900&q=80',
  dog6: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=900&q=80',
  dog7: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=900&q=80',
  dog8: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=900&q=80',
  dog9: 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=900&q=80',
  dog10: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=900&q=80',
  dogOwner: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=900&q=80',
  cat1: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=900&q=80',
  cat2: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=900&q=80',
  cat3: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=900&q=80',
  cat4: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=900&q=80',
  cat5: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=900&q=80',
  cat6: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=900&q=80',
  cat7: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=900&q=80',
  update1: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800&q=80'
};

/* ---------- Videos (Wikimedia Commons — freely licensed / public domain) ---------- */
PC.video = {
  puppyPlaying: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/2/21/Puppy_playing.webm/Puppy_playing.webm.480p.vp9.webm',
  goldendoodleFighting: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/0/04/Goldendoodle_and_Black_Lab_puppies_play_fighting_in_slow_motion.webm/Goldendoodle_and_Black_Lab_puppies_play_fighting_in_slow_motion.webm.480p.vp9.webm',
  bombayCat: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/1/10/Bombay_Cat_kitten_video_of_Blue_Sinfonie.ogv/Bombay_Cat_kitten_video_of_Blue_Sinfonie.ogv.480p.vp9.webm',
  catLapping: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/a/ac/Cat_lapping_water_off_ground_in_slow_motion.gk.webm/Cat_lapping_water_off_ground_in_slow_motion.gk.webm.480p.vp9.webm'
};

/* ---------- Subscription plans ($2.99 – $9.99) ---------- */
PC.plans = [
  { id: 'starter', name: 'Paw Starter', tag: 'Essentials', monthly: 2.99, annual: 2.49,
    blurb: 'Just getting started with a companion? Get the essentials.',
    features: ['Weekly wellness checklists', 'Pet care blog library', 'Feeding & reminder email', 'Community support', 'Cancel anytime'] },
  { id: 'family', name: 'Paw Family', tag: 'Most Popular', featured: true, monthly: 5.99, annual: 4.99,
    blurb: 'Everyday support for you and your furry family.',
    features: ['Everything in Starter', 'Daily unique solutions feed', 'Health & habit tracking', 'Video call vet-advice chat', 'Shopping discounts', '2 pets included'] },
  { id: 'guardian', name: 'Paw Guardian', tag: 'Full Care', monthly: 9.99, annual: 8.32,
    blurb: 'Complete care — best value for households with many pets.',
    features: ['Everything in Family', 'Unlimited pets', 'Elderly-care companion mode', 'Smart feeding/medication reminders', 'Priority support', 'Home-care planning tools'] }
];

/* ---------- Daily unique solutions (the "Today's Solution" hub) ----------
   Update the items below every day. Each entry = a unique, helpful pet-care
   solution. Categories: Nutrition, Behavior, Health, Senior Care, Wellness. */
PC.updates = [
  { cat: 'Nutrition', emoji: '🥣', title: 'Slow-feed, not speed-feed', body: 'Switch to a textured slow-feeder bowl. Eating in under 3 minutes raises the risk of bloat, vomiting and weight gain. A 10-minute mealtime also digests better.' },
  { cat: 'Senior Care', emoji: '👴', title: 'The 3-3-3 elder routine', body: 'For older pets: 3 short walks, 3 fresh-water checks, and 3 gentle stretches a day. Small, predictable routines keep joints and minds sharp.' },
  { cat: 'Behavior', emoji: '🪶', title: 'The 5-minute scruff shake', body: 'A daily 5-minute "shake, sniff, settle" game re-sets anxious pets. Random rewards for calm behaviour reinforce confidence far better than punishment.' },
  { cat: 'Health', emoji: '🩺', title: 'Ear & paw splash check', body: 'Every bath day, check between toes and inside ears for redness or a musty smell — the two earliest signs of allergies and ear infections.' },
  { cat: 'Wellness', emoji: '🧘', title: 'The human-match breathing trick', body: "Match your breath to your pet's for 1 minute before bed. Their calm signals your nervous system to relax — a mutual anti-anxiety ritual." },
  { cat: 'Nutrition', emoji: '🫐', title: 'Berry boost, portion-perfect', body: 'Frozen blueberries make a sugar-safe, antioxidant-rich treat. Rule: 1 berry per 5kg of body weight, never more than 10 a day.' },
  { cat: 'Senior Care', emoji: '🗓️', title: 'The 7-day med audit', body: 'Once a week, count pills, check expiry dates and confirm doses with your vet. Refills arrive late more often than owners expect.' },
  { cat: 'Behavior', emoji: '🎾', title: 'Dinner is a puzzle', body: "Hide half a day's kibble in a snuffle mat or folded towel. Encourages natural foraging, burns energy and curbs boredom-based barking." },
  { cat: 'Health', emoji: '🌡️', title: 'Cool-paw floor test', body: "On hot days, place your palm on the pavement for 5 seconds. If it's too hot for your hand, it's too hot for their paws." },
  { cat: 'Wellness', emoji: '💬', title: 'The two-word check-in', body: 'Ask your pet\'s "body, mood, belly" each morning. Tracking these three words daily catches subtle illness weeks before symptoms show.' },
  { cat: 'Nutrition', emoji: '🎣', title: 'Omega for a healthy coat', body: 'Some owners add a small amount of omega (e.g. sardine oil or a supplement) to support coat and skin. Always check with your vet before adding any supplement.' },
  { cat: 'Senior Care', emoji: '🪑', title: 'The anti-slip bootie hack', body: 'Senior pets on slick floors need grip. Non-slip socks or a yoga mat runway stop the panic-scramble that leads to hip and knee injuries.' }
];

/* ---------- Blog posts metadata ---------- */
PC.blog = [
  { slug: 'pets-as-companions-in-busy-lives', title: 'Pets as Companions in Our Busy Lives', cat: 'Companionship', time: 6, img: 'dog1' },
  { slug: 'pets-as-antidepressants', title: 'How Pets Support Emotional Wellbeing', cat: 'Wellbeing', time: 7, img: 'dogOwner' },
  { slug: 'the-important-role-of-pets-in-human-life', title: 'The Important Role Pets Play in Human Life', cat: 'Wellness', time: 8, img: 'cat1' },
  { slug: 'budget-friendly-pet-care-at-home', title: 'Budget-Friendly Pet Care You Can Do at Home', cat: 'Tips', time: 5, img: 'dog4' },
  { slug: 'senior-pet-care-guide', title: 'Caring for a Senior Pet: The Gentle Guide', cat: 'Senior Care', time: 6, img: 'dog9' }
];
