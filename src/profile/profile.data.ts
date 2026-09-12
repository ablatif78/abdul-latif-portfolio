import { Profile } from './profile.types';

/**
 * Single source of truth for every piece of content on the site.
 * Editing this file is all it takes to update the portfolio.
 */
export const profile: Profile = {
  name: 'Abdul Latif',
  initials: 'AL',
  photo: {
    src: '/static/abdul-latif.png',
    alt: 'Abdul Latif',
    width: 300,
    height: 300,
  },
  cv: {
    href: '/cv',
    source: 'abdul-latif-cv.pdf',
    filename: 'Abdul-Latif-CV.pdf',
  },
  role: 'Web Developer & Design Lead',
  tagline: 'I design and build web experiences — and research machine learning for healthcare.',
  intro:
    'Web developer and design lead with six years of building websites, landing pages and brand systems for teams in the UK, Czechia and Bangladesh — alongside published deep-learning research in medical signal analysis.',
  about: [
    'I started out designing interfaces and ended up owning the whole pipeline: research, UI, build, SEO and the content team that keeps it all moving. Today I lead web and product design at Tiles Porcelain in Durham, UK, where I look after everything from information architecture to the HubSpot landing pages that bring customers in.',
    'The other half of my work is research. My undergraduate thesis predicted chronic kidney disease with machine learning, and in 2025 I published a deep-learning approach for detecting cardiovascular disease from paper-based ECG signals at IEEE COMPAS.',
    'I am now working towards a Master’s in Computer Science, going deeper into artificial intelligence, data science, computer graphics and software engineering — the areas where careful engineering and good design have the most to gain from each other.',
  ],
  location: 'Durham, United Kingdom',
  origin: 'Tangail, Bangladesh',
  email: 'abdullatif.cse@gmail.com',
  phone: '+880 1521 493032',
  availability: 'Web development, product design and ML research roles',
  socials: [
    { label: 'GitHub', handle: 'ablatif78', url: 'https://github.com/ablatif78' },
    { label: 'YouTube', handle: 'Likhon24', url: 'https://www.youtube.com/@Likhon24' },
    {
      label: 'IEEE Xplore',
      handle: 'Publication',
      url: 'https://ieeexplore.ieee.org/document/11381847',
    },
    { label: 'Email', handle: 'abdullatif.cse@gmail.com', url: 'mailto:abdullatif.cse@gmail.com' },
  ],
  stats: [
    { value: '6+', label: 'Years designing & building for the web' },
    { value: '4', label: 'Companies across 3 countries' },
    { value: '1', label: 'IEEE-published research paper' },
    { value: 'B.Sc.', label: 'Computer Science & Engineering' },
  ],
  nav: [
    { id: 'about', label: 'About' },
    { id: 'work', label: 'Work' },
    { id: 'projects', label: 'Projects' },
    { id: 'research', label: 'Research' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ],
  experience: [
    {
      role: 'Web Developer',
      company: 'Tiles Porcelain Ltd',
      companyUrl: 'https://tilesporcelain.co.uk/',
      location: 'Durham, United Kingdom · Remote',
      start: 'Jun 2025',
      end: 'Present',
      current: true,
      summary:
        'Own the company website end to end — design, build, SEO and the content design team behind it.',
      highlights: [
        'Lead website design and development, from information architecture through to release.',
        'Run project management and ongoing product maintenance and updates.',
        'Optimise user experience and interface across the customer journey.',
        'Drive search engine optimisation for organic growth.',
        'Lead a content design team.',
      ],
      stack: ['Web Design', 'UX/UI', 'SEO', 'Project Management', 'Content Strategy'],
    },
    {
      role: 'Design Lead & Web Developer',
      company: 'Field Service Techs',
      companyUrl: 'https://fieldservice-techs.com/',
      location: 'Prague, Czech Republic · Remote',
      start: 'Sep 2023',
      end: 'May 2025',
      summary:
        'Built the service marketing surface — HubSpot landing pages, localised sites and the social design system around them.',
      highlights: [
        'Developed service landing pages using HubSpot, including newsletters, webinars and eBooks.',
        'Translated and adapted webpages for international audiences.',
        'Collaborated with product teams to design a user-friendly interface.',
        'Designed and maintained social media content.',
      ],
      stack: ['HubSpot', 'Landing Pages', 'Localisation', 'UI Design', 'Social Design'],
    },
    {
      role: 'Lab Associate',
      company: 'Daffodil International University',
      companyUrl: 'https://daffodilvarsity.edu.bd/',
      location: 'Dhaka, Bangladesh',
      start: 'Jan 2023',
      end: 'Dec 2023',
      summary:
        'Supported students through lab activities, coding tasks and the programmes around them.',
      highlights: [
        'Assisted students in solving course-related problems during lab activities and coding tasks.',
        'Collected, reviewed and evaluated student lab reports.',
        'Helped students become familiar with laboratory equipment and procedures.',
        'Supported event planning and execution for lab activities and programmes.',
      ],
      stack: ['Teaching', 'C/C++', 'Java', 'Python', 'Lab Operations'],
    },
    {
      role: 'Web Design & Developer',
      company: 'Axelman Digital',
      companyUrl: 'https://axelmandigital.co.uk/',
      location: 'London, United Kingdom · Remote',
      start: 'Feb 2023',
      end: 'Jul 2023',
      summary:
        'Agency work spanning websites, motion graphics and brand identity for client projects.',
      highlights: [
        'Designed and developed client websites end to end.',
        'Optimised user experience and user interface across projects.',
        'Produced motion graphics and branding assets.',
      ],
      stack: ['Web Design', 'Development', 'Motion Graphics', 'Branding'],
    },
  ],
  projects: [
    {
      title: 'Cardiovascular Disease Detection from ECG',
      kind: 'Deep learning research',
      period: '2025',
      description:
        'A robust deep-learning pipeline that detects cardiovascular disease from enhanced paper-based ECG signals — turning printed clinical records into a usable diagnostic input. Published and presented at IEEE COMPAS 2025.',
      stack: ['Python', 'Deep Learning', 'Image Processing', 'Signal Analysis'],
      links: [{ label: 'Read on IEEE Xplore', url: 'https://ieeexplore.ieee.org/document/11381847' }],
    },
    {
      title: 'Service Landing Pages',
      kind: 'Web development',
      period: 'Feb 2024 — Apr 2024',
      description:
        'Designed and built responsive service landing pages for Field Service Techs, including newsletter, webinar and eBook campaigns, all delivered through HubSpot.',
      stack: ['HubSpot', 'HTML', 'CSS', 'JavaScript', 'Responsive Design'],
      links: [{ label: 'Visit site', url: 'https://fieldservice-techs.com/' }],
    },
    {
      title: 'Te-Hiasa Landing Page',
      kind: 'UI design',
      period: 'Aug 2024',
      description:
        'End-to-end UI design and interactive prototype for a product landing page, built in Figma with supporting illustration work in Adobe Illustrator.',
      stack: ['Figma', 'Adobe Illustrator', 'Prototyping'],
      links: [
        {
          label: 'Figma file',
          url: 'https://www.figma.com/design/7ofN4QrNjfiFHuxn57dvH5/Te-Hiasa-Landing-Page',
        },
      ],
    },
    {
      title: 'Video Call & Chat App',
      kind: 'Android application',
      period: 'Mar 2022 — Jun 2022',
      description:
        'An online meeting and chat app for Android. Users create profiles, generate meeting codes and chat in real time, backed by Firebase authentication and messaging.',
      stack: ['Java', 'Android Studio', 'Firebase'],
      links: [{ label: 'GitHub repository', url: 'https://github.com/ablatif78/Video-Call-App' }],
    },
    {
      title: 'Road Side View',
      kind: 'Computer graphics',
      period: 'Jan 2022',
      description:
        'An animated village scene rendered in OpenGL with C++ — sunrise lighting transitions, drifting clouds, a parachute descent and continuous vehicle motion.',
      stack: ['C++', 'OpenGL', 'Computer Graphics'],
      links: [{ label: 'GitHub repository', url: 'https://github.com/ablatif78/DIU-Road-side-view' }],
    },
    {
      title: 'Predicting Chronic Kidney Disease',
      kind: 'Undergraduate thesis',
      period: '2023',
      description:
        'Machine-learning models trained to predict chronic kidney disease from clinical indicators, comparing algorithms on accuracy and clinical usefulness.',
      stack: ['Python', 'Machine Learning', 'Statistics', 'Jupyter'],
      links: [],
    },
  ],
  publications: [
    {
      title:
        'A Robust Deep Learning Approach for Cardiovascular Disease Detection from Enhanced Paper-Based ECG Signals',
      authors:
        'Abdul Latif, Sabuj Kumar Kundu, Md Amzad Sadik Abid, Ahnaf Tahmid Jamee, Md Nazmul Hossain, Fazla Rabbi Somrat',
      venue:
        '2025 IEEE 2nd International Conference on Computing, Applications and Systems (COMPAS), Kushtia, Bangladesh',
      date: '23–24 October 2025',
      indexed: 'IEEE Xplore · 12 February 2026',
      url: 'https://ieeexplore.ieee.org/document/11381847',
    },
  ],
  education: [
    {
      degree: 'B.Sc. in Computer Science and Engineering',
      institution: 'Daffodil International University',
      institutionUrl: 'https://daffodilvarsity.edu.bd/',
      location: 'Ashulia, Dhaka, Bangladesh',
      period: 'May 2018 — Mar 2023',
      grade: 'CGPA 3.46 / 4.00 · 148 credits · EQF level 6',
      details: [
        'Thesis: Predicting Chronic Kidney Disease Using Machine Learning Techniques.',
        'Core study: Data Structures & Algorithms, Databases, Computer Networks, Software Engineering, Artificial Intelligence, Data Mining, OOP, Statistics, Linear Algebra.',
      ],
    },
    {
      degree: 'Higher Secondary Certificate — Science',
      institution: 'Government Mujib College, Sakhipur',
      location: 'Tangail, Bangladesh',
      period: 'Jul 2014 — Aug 2016',
      grade: 'GPA 4.94 / 5.00',
    },
    {
      degree: 'Secondary School Certificate — Science',
      institution: 'Surja Tarun Shixmangan School, Sakhipur',
      location: 'Tangail, Bangladesh',
      period: 'Jan 2012 — May 2014',
      grade: 'GPA 4.75 / 5.00',
    },
  ],
  skills: [
    {
      title: 'Web design & development',
      items: ['HTML', 'CSS', 'JavaScript', 'Flutter', 'HubSpot', 'Responsive UI', 'SEO'],
    },
    {
      title: 'Programming languages',
      items: ['C', 'C++', 'Java', 'Python', 'Dart'],
    },
    {
      title: 'Research & data',
      items: ['Machine Learning', 'Deep Learning', 'Image Processing', 'Statistics'],
    },
    {
      title: 'Data & visualisation tools',
      items: ['Jupyter Notebook', 'Google Colab', 'Kaggle', 'Microsoft Power BI'],
    },
    {
      title: 'Design & creative',
      items: ['Figma', 'Adobe Illustrator', 'Canva Pro', 'Motion Graphics', 'Branding', 'Video Editing'],
    },
    {
      title: 'Ways of working',
      items: ['Project Management', 'Team Leadership', 'Content Strategy', 'GitHub', 'Google Workspace'],
    },
  ],
  languages: [
    { name: 'Bengali', level: 'Native', note: 'Mother tongue' },
    { name: 'English', level: 'B2', note: 'Independent user across all four skills' },
  ],
  awards: [
    'Brilliant Academic Result scholarship, Daffodil International University — tuition waived up to 40% across several semesters.',
    'Yearly Top Performer, Field Service Techs, 2023.',
    'Best Volunteer Award 2022, Voluntary Service Club DIU.',
  ],
  training: [
    {
      title: 'Basic Circuit Design',
      organiser: 'DIU Robotics Lab',
      period: 'Feb 2022',
      description:
        'Six-hour training on printed circuit board design, with hands-on practice designing and analysing simple electronic circuits.',
    },
    {
      title: 'Youth Social Leadership',
      organiser: 'Funded by USAID',
      period: 'Mar 2020',
      description:
        'Leadership, communication and problem-solving training focused on identifying and resolving social issues through group work.',
    },
    {
      title: 'Bangladesh Ansar VDP',
      organiser: 'Bangladesh Ansar & VDP',
      period: 'Jan 2016 — Feb 2016',
      description:
        'Basic training in discipline, self-defence, public safety, emergency response and community development.',
    },
  ],
  volunteering: [
    {
      role: 'Vice-President',
      organisation: 'Voluntary Service Club, DIU',
      period: 'Feb 2021 — Jan 2022',
      highlights: [
        'Led community service programmes, event planning and execution.',
        'Organised webinars, training and workshops promoting volunteerism.',
        'Ran promotion and awareness campaigns across the student body.',
      ],
    },
    {
      role: 'Team Leader',
      organisation: "Boy's Scout",
      period: 'Jan 2012 — Dec 2013',
      highlights: [
        'Led and motivated team members through camps, training and community service.',
        'Maintained team discipline, safety and coordination.',
      ],
    },
  ],
  creative: {
    title: 'Likhon24',
    description:
      'A YouTube channel and Facebook page where I publish tutorials on programming, Microsoft tools, video editing and more — started to help students in Bangladesh work more productively.',
    url: 'https://www.youtube.com/@Likhon24',
  },
};
