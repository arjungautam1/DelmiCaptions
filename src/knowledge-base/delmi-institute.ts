export interface DelmiInstituteInfo {
  name: string;
  description: string;
  contactInfo: ContactInfo;
  courses: Course[];
  values: string[];
  facilities: string[];
  achievements: string[];
  targetAudience: string[];
  paymentOptions: PaymentOptions;
  socialMediaGuidelines: SocialMediaGuidelines;
  brandVoice: BrandVoice;
  hashtags: string[];
}

export interface ContactInfo {
  website: string;
  location: string;
  phone: string;
  email: string;
}

export interface PaymentOptions {
  monthlyPaymentAvailable: boolean;
  minimumPayment: string;
  termsAndConditions: string;
  enrollmentLink: string;
}

export interface Course {
  name: string;
  code: string;
  description: string;
  duration: string;
  price: string;
  highlights: string[];
  careerOpportunities: string[];
  hashtags: string[];
  status?: string;
  spotsLeft?: number;
}

export interface SocialMediaGuidelines {
  tone: string;
  do: string[];
  dont: string[];
  platforms: Platform[];
}

export interface Platform {
  name: string;
  description: string;
  contentTypes: string[];
  hashtagStrategy: string;
}

export interface BrandVoice {
  professional: string;
  casual: string;
  creative: string;
}

export const delmiInstitute: DelmiInstituteInfo = {
  name: "Delmi Training Institute",
  description: "A leading training institute offering professional courses in various fields with focus on practical skills, career development, and industry-relevant training. We provide modern, innovative approach to education with hands-on learning and strong community of learners, professionals, and industry experts.",
  
  contactInfo: {
    website: "www.delmitraining.com",
    location: "7600 ON-27 #5a, Woodbridge, ON L4H 0P8",
    phone: "+1 (905) 783-3564",
    email: "enquiry@delmitraining.com"
  },

  paymentOptions: {
    monthlyPaymentAvailable: true,
    minimumPayment: "CA $174.89",
    termsAndConditions: "Terms & conditions apply",
    enrollmentLink: "delmitraining.com/enroll"
  },
  
  courses: [
    {
      name: "Network Cabling Specialist",
      code: "DTIL 101",
      description: "Comprehensive network cabling course covering structured cabling, fiber optics, and troubleshooting",
      duration: "4-5 weeks intensive training",
      price: "$1,999.99 CAD",
      highlights: [
        "Structured cabling installation",
        "Fiber optics and copper cabling",
        "Cable termination and testing",
        "RJ45 connectors and patch panels",
        "Troubleshooting and maintenance"
      ],
      careerOpportunities: [
        "Network Cabling Technician",
        "Structured Cabling Specialist",
        "Field Technician",
        "Installation Technician",
        "Network Infrastructure Specialist"
      ],
      hashtags: ["#NetworkCabling", "#StructuredCabling", "#HandsOnLearning", "#CablingCourse", "#FieldReady"]
    },
    {
      name: "CCTV Surveillance Technician",
      code: "DTIL 201",
      description: "Professional CCTV surveillance course covering IP/analog cameras, DVR/NVR systems, and security integration",
      duration: "5 days intensive",
      price: "$1,999.99 CAD",
      highlights: [
        "IP and analog camera installation",
        "DVR/NVR programming and configuration",
        "System integration and bandwidth management",
        "Top brands: Hikvision, Dahua, Avigilon, Legend NX",
        "Field-ready security skills"
      ],
      careerOpportunities: [
        "CCTV Technician",
        "Surveillance System Specialist",
        "Security System Installer",
        "Electronic Security Technician",
        "Security Integration Specialist"
      ],
      hashtags: ["#CCTVTraining", "#SurveillanceTech", "#HandsOnLearning", "#SecurityTraining", "#FieldTrainingToronto"]
    },
    {
      name: "Electronics & Relays",
      code: "DTIL 401",
      description: "Comprehensive electronic security course covering access control, relays, and automation systems",
      duration: "4 weeks",
      price: "$1,999.99 CAD",
      highlights: [
        "Access control systems and card readers",
        "Electronics and relay systems",
        "Biometric security systems",
        "Automation and circuit design",
        "Real-world troubleshooting skills"
      ],
      careerOpportunities: [
        "Electronic Security Technician",
        "Access Control Specialist",
        "Security System Technician",
        "Automation Specialist",
        "Electronic Systems Technician"
      ],
      hashtags: ["#ElectronicSecurity", "#AccessControl", "#ElectronicsAndRelays", "#SecuritySystems", "#HandsOnTraining"]
    },
    {
      name: "Access Control Technician",
      code: "DTIL 402",
      description: "Comprehensive access control course covering keypads, RFID, maglocks, panels, and system wiring",
      duration: "4 weeks",
      price: "$1,999.99 CAD",
      status: "Starts August 18",
      spotsLeft: 2,
      highlights: [
        "Access control systems design",
        "Card readers and biometric systems",
        "Keypads and RFID technology",
        "Maglocks and security panels",
        "System wiring and integration"
      ],
      careerOpportunities: [
        "Access Control Specialist",
        "Security System Technician",
        "Electronic Security Technician",
        "Security Integration Specialist",
        "Electronic Systems Technician"
      ],
      hashtags: ["#AccessControl", "#ElectronicSecurity", "#SecuritySystems", "#HandsOnTraining", "#FieldReady"]
    }
  ],

  values: [
    "Excellence in education and training",
    "Practical, industry-relevant skills",
    "Innovation and modern learning approaches",
    "Strong community and networking",
    "Career-focused development",
    "Quality and professional standards",
    "Continuous learning and improvement",
    "Student success and support"
  ],

  facilities: [
    "Hands-on training labs with real equipment",
    "Network cabling workshop with industry tools",
    "CCTV and security system training facilities",
    "Electronics and relay testing stations",
    "Access control system demonstration area",
    "Working at heights safety training equipment",
    "Industry-standard tools and equipment",
    "Field-ready training environment"
  ],

  achievements: [
    "500+ successful graduates",
    "95% placement rate",
    "Industry partnerships with leading security companies",
    "Certified training programs with hands-on experience",
    "Field-ready curriculum with real-world equipment",
    "Strong alumni network in skilled trades",
    "Positive student feedback and success stories",
    "Continuous program updates with latest technology"
  ],

  targetAudience: [
    "Recent graduates seeking skilled trade careers",
    "Working professionals looking to enter security industry",
    "Career changers exploring technical trades",
    "Newcomers to Canada building technical skills",
    "Students preparing for field technician roles",
    "Professionals seeking security certifications",
    "Individuals interested in network cabling",
    "Those pursuing electronic security careers"
  ],

  socialMediaGuidelines: {
    tone: "Professional yet approachable, inspiring and educational",
    do: [
      "Share success stories and testimonials",
      "Highlight industry trends and insights",
      "Showcase student achievements",
      "Provide valuable educational content",
      "Engage with industry professionals",
      "Use professional but friendly language",
      "Include relevant hashtags",
      "Post regularly and consistently"
    ],
    dont: [
      "Use overly casual or unprofessional language",
      "Share personal opinions on controversial topics",
      "Over-promote or use hard sales tactics",
      "Ignore negative feedback",
      "Post irrelevant content",
      "Use excessive emojis or informal language"
    ],
    platforms: [
      {
        name: "LinkedIn",
        description: "Professional networking and B2B content",
        contentTypes: [
          "Industry insights and trends",
          "Professional development tips",
          "Success stories and case studies",
          "Course announcements and updates",
          "Thought leadership content"
        ],
        hashtagStrategy: "Use professional hashtags like #Education, #Training, #CareerDevelopment"
      },
      {
        name: "Instagram",
        description: "Visual content and student engagement",
        contentTypes: [
          "Campus and facility photos",
          "Student success stories",
          "Behind-the-scenes content",
          "Course highlights and features",
          "Motivational quotes and tips"
        ],
        hashtagStrategy: "Mix educational and lifestyle hashtags like #Learning, #Education, #StudentLife"
      },
      {
        name: "Facebook",
        description: "Community building and engagement",
        contentTypes: [
          "Event announcements and updates",
          "Community discussions",
          "Student testimonials",
          "Course information and registration",
          "Interactive polls and questions"
        ],
        hashtagStrategy: "Use community-focused hashtags like #Education, #Learning, #CareerGrowth"
      }
    ]
  },

  brandVoice: {
    professional: "Formal, authoritative, and expertise-focused. Use industry terminology, emphasize quality and professionalism, maintain a business-oriented tone while being approachable.",
    casual: "Friendly, conversational, and relatable. Use everyday language, create personal connections, share stories and experiences, maintain professionalism while being warm and accessible.",
    creative: "Innovative, exciting, and inspiring. Use dynamic language, incorporate relevant emojis, focus on possibilities and growth, maintain enthusiasm while staying professional and credible."
  },

  hashtags: [
    "#DelmiTraining",
    "#HandsOnLearning",
    "#SkilledTrades",
    "#CareerTraining",
    "#FieldReady",
    "#SkillTradeCanada",
    "#NetworkCabling",
    "#ElectronicSecurity",
    "#CCTVTraining",
    "#AccessControl",
    "#ElectronicsAndRelays",
    "#WorkingAtHeights",
    "#SafetyTraining",
    "#TorontoTech",
    "#WoodbridgeTraining"
  ]
};

export default delmiInstitute; 