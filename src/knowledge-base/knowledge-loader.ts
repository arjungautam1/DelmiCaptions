import { delmiInstitute } from './delmi-institute';

export interface KnowledgeBase {
  institute: typeof delmiInstitute;
  coursesDetailed: {
    [key: string]: {
      curriculum: string[];
      tools: string[];
      careerPaths: string[];
      learningOutcomes: string[];
    };
  };
}

export class KnowledgeBaseLoader {
  private static instance: KnowledgeBaseLoader;
  private knowledgeBase: KnowledgeBase;

  private constructor() {
    this.knowledgeBase = {
      institute: delmiInstitute,
      coursesDetailed: {
        'DTIL 101': {
          curriculum: [
            'Cable Media Types: Twisted Pair (Cat5e, Cat6), Coaxial Cables, Fiber Optic Cables',
            'Network Topologies: Star, Bus, Ring, and Hybrid networks',
            'Signal Propagation & Bandwidth: Understanding signal loss, attenuation, noise',
            'Tools & Techniques: Wire toner, RJ45/RJ11 crimpers, coaxial tools, punch down tools, cable testers',
            'Installation & Termination: UTP, coaxial, fiber optic cable termination, patch cables',
            'Support Systems & Spaces: Plenum/non-plenum environments, labeling, cable management',
            'Site Preparation: Blueprint reading, site surveys, jobsite safety, workflow planning',
            'Codes & Compliance: Industry codes, safety protocols, local legislation',
            'Estimating & Pro Tips: Project cost estimation, real-world trade tricks'
          ],
          tools: [
            'Wire toner and cable tracers',
            'RJ45/RJ11 crimpers and connectors',
            'Coaxial cable tools and connectors',
            'Punch down tools and patch panels',
            'Cable testers and certification equipment',
            'Fish tape and cable pulling systems',
            'Label makers and cable management',
            'Safety equipment and protective gear'
          ],
          careerPaths: [
            'Network Cabling Technician',
            'Structured Cabling Specialist',
            'Field Technician',
            'Installation Technician',
            'Network Infrastructure Specialist',
            'Telecommunications Technician',
            'Cable Installation Supervisor'
          ],
          learningOutcomes: [
            'Identify and prep various cable types',
            'Install, fish, label, and terminate in walls, ceilings, and racks',
            'Make and test patch cables (straight-through & crossover)',
            'Troubleshoot and certify installed cables',
            'Read and follow blueprints',
            'Estimate project materials and costs accurately',
            'Follow building codes and industry standards'
          ]
        },
        'DTIL 201': {
          curriculum: [
            'CCTV Evolution & System Components: History, key components, modern applications',
            'Analog & AHD Cameras: Traditional CCTV, CVI & TVI technology',
            'IP vs. Megapixel Cameras: Network-based systems, high-resolution imaging',
            'DVRs, HVRs & NVRs: Digital, Hybrid, and Network Video Recorders',
            'Video Encoders & Servers: Signal conversion, compression, storage solutions',
            'Weatherproofing & Ingress Ratings: Protection against elements',
            'Software Licensing & Protocols: Camera software, ONVIF integration',
            'Storage & Video Retention: Hard drive management, retention policies',
            'PoE & Extenders: Power over Ethernet, power budgets, cable extenders',
            'Camera Installation & Lens Selection: Placement, lens choice, installation'
          ],
          tools: [
            '12 VDC Power Supply and PoE Injector',
            'PoE Splitter and Camera Config Tool',
            'HP Monitor and Power Supply',
            'PoE Extender and Baluns',
            'Power Splitters and Coaxial Cables',
            'Power Surge Protector',
            'HDMI/VGA IP PoE Over Coax',
            'Installation and testing equipment'
          ],
          careerPaths: [
            'CCTV Technician',
            'Surveillance System Specialist',
            'Security System Installer',
            'Electronic Security Technician',
            'Security Integration Specialist',
            'Video Analytics Specialist',
            'Security Operations Center Technician'
          ],
          learningOutcomes: [
            'Install and configure IP and analog cameras',
            'Program and manage DVR/NVR systems',
            'Design surveillance systems for various environments',
            'Understand bandwidth management and storage requirements',
            'Work with major brands: Hikvision, Dahua, Avigilon, Ajax',
            'Implement proper weatherproofing and cable management',
            'Troubleshoot system issues and optimize performance'
          ]
        },
        'DTIL 401': {
          curriculum: [
            'Electronics Fundamentals: Resistors, diodes, transistors, circuit board designs',
            'Relay Systems: Single and multi-relay systems, relay timers, functionalities',
            'Locks & Power Supplies: Maglocks, electric strikes, power supply integration',
            'Input/Output Devices: Sensors, switches, readers, expansion modules, LED indicators',
            'System Design: Planning, designing, implementing complete security systems',
            'Fault Finding: Troubleshooting techniques, root-cause analysis',
            'Safety Standards: Safety codes, building regulations, risk assessment',
            'On-Site Surveys: Practical site surveys, data gathering, system planning',
            'Documentation & Standards: Associations, standards, inspectorates, regulations'
          ],
          tools: [
            '6062 timer and relay components',
            'CX247, CX12 and CX33 low voltage splice connectors',
            'Wire strippers and access control cable',
            'Different gauge conductor wires',
            'Standalone readers and door strikes',
            'Door contacts and LED indicators',
            'Double pole double throw relays',
            'Single pole double throw relays',
            'Normally open/closed switches',
            'AC to DC power supplies'
          ],
          careerPaths: [
            'Electronic Security Technician',
            'Access Control Specialist',
            'Security System Designer',
            'Automation Technician',
            'Field Service Technician',
            'Electronics Repair Specialist',
            'Security Integration Specialist'
          ],
          learningOutcomes: [
            'Understand electronics fundamentals and circuit design',
            'Design and implement relay-based security systems',
            'Integrate locks, sensors, and control panels',
            'Perform system troubleshooting and fault finding',
            'Conduct professional site surveys',
            'Follow safety standards and building codes',
            'Create system documentation and maintenance plans'
          ]
        },
        'DTIL 402': {
          curriculum: [
            'Access Control Fundamentals: Credentials, readers, controllers, AC/DC voltage applications',
            'Access Control Systems: Stand-alone and multi-door systems, IP and analog panels',
            'Readers & Credentials: Magnetic strip, proximity, biometric, card-free, smartphone readers',
            'Locks & Power Supplies: Magnetic locks, electric strikes, mechanical locks, power supplies',
            'Relay Systems: Request-to-exit devices, door contacts, relay integration',
            'System Design: Residential, commercial, and industrial settings',
            'Troubleshooting: Fault-finding techniques, wiring, readers, panels',
            'Safety & Building Codes: Safety protocols, building codes, security regulations',
            'Maintenance & Documentation: Maintenance agreements, system documentation, standards'
          ],
          tools: [
            '6062 timer and system components',
            'CX247, CX12 and CX33 low voltage splice connectors',
            'Wire strippers and access control cable',
            'Standalone readers and credential systems',
            'Door strikes and magnetic locks',
            'Door contacts and LED indicators',
            'Relay systems and control panels',
            'AC to DC power supplies',
            'Testing and diagnostic equipment'
          ],
          careerPaths: [
            'Access Control Specialist',
            'Security System Technician',
            'Electronic Security Installer',
            'Field Service Technician',
            'System Designer',
            'Security Integration Specialist',
            'Credential System Administrator'
          ],
          learningOutcomes: [
            'Design multi-door access control systems',
            'Install and configure various reader types',
            'Integrate biometric and smartphone-based access',
            'Troubleshoot system faults and connectivity issues',
            'Understand commercial and residential applications',
            'Follow safety protocols and building codes',
            'Create maintenance documentation and schedules'
          ]
        }
      }
    };
  }

  public static getInstance(): KnowledgeBaseLoader {
    if (!KnowledgeBaseLoader.instance) {
      KnowledgeBaseLoader.instance = new KnowledgeBaseLoader();
    }
    return KnowledgeBaseLoader.instance;
  }

  public getKnowledgeBase(): KnowledgeBase {
    return this.knowledgeBase;
  }

  public generateChatContext(): string {
    const kb = this.knowledgeBase;

    return `You are a friendly admissions advisor at Delmi Training Institute. Chat naturally with prospective students who are interested in our technical training programs. Give helpful, conversational answers without being overly formal or creating long structured lists.

INSTITUTE OVERVIEW:
${kb.institute.name} - ${kb.institute.description}

Location: ${kb.institute.contactInfo.location}
Phone: ${kb.institute.contactInfo.phone}
Website: ${kb.institute.contactInfo.website}
Email: ${kb.institute.contactInfo.email}

COURSE SUMMARY:
${kb.institute.courses.map(course => 
  `${course.code} - ${course.name} (${course.price}, ${course.duration}${course.spotsLeft ? `, ${course.spotsLeft} spots left` : ''}): ${course.description}`
).join('\n')}

PAYMENT OPTIONS:
Monthly plans available starting at ${kb.institute.paymentOptions.minimumPayment}
${kb.institute.paymentOptions.termsAndConditions}
Enroll at ${kb.institute.paymentOptions.enrollmentLink}

DETAILED COURSE INFORMATION:
When students ask about specific courses, you have access to comprehensive curriculum details:

${Object.entries(kb.coursesDetailed).map(([code, details]) => 
  `${code} CURRICULUM: ${details.curriculum.slice(0, 5).join('; ')}
${code} CAREER PATHS: ${details.careerPaths.join(', ')}
${code} KEY TOOLS: ${details.tools.slice(0, 4).join(', ')}`
).join('\n\n')}

INSTITUTE VALUES:
${kb.institute.values.join(', ')}

TARGET AUDIENCE:
${kb.institute.targetAudience.join(', ')}

UNIQUE FEATURES:
- Hands-on training with industry-standard equipment
- Small class sizes for personalized attention
- Field-ready training with real-world applications
- 2 weeks hands-on field experience upon completion of all courses
- Certifications upon completion
- Career-focused development

Keep responses conversational, helpful, and concise. Answer their specific questions directly. Don't create formatted lists or overly structured responses unless they specifically ask for a course comparison. Use the detailed course information to provide specific answers about curriculum, tools, career opportunities, and learning outcomes.

LEADERSHIP & TEAM INFORMATION:
President & Founder: Roland Akwensivie
- President at Delmi Solutions Incorporated, Delmi Training Institute, Delmi Media & Entertainment & The Shidaa Foundation
- Experienced Infrastructure cabling, Wireless and Security Professional with many years of hands-on experience
- Founded Delmi Training Institute in 2016
- Also serves as President of Delmi Solutions Inc. (since 2011)
- Co-Founder of The Shidaa Foundation (since 2019)
- Educational background: B.Sc (Hons) Physics from Kwame Nkrumah University of Science and Technology, Post Graduate Project Management from Humber College
- Certifications: CompTIA A+, CompTIA Network+
- Expertise areas: IP CCTV, Access Control, Alarm and Intrusion Systems, Wireless Solutions, Network Cabling, Fiber Optic Installation
- Self-motivated with passion to transfer knowledge and train the next generation of professionals
- Location: Greater Toronto Area, Canada

Web Developer & Content Creator: Arjun Gautam
- Content Marketing Specialist with programming background at Delmi Solutions Inc.
- Web Developer (December 2024 - Present) and Content Creator/Social Media Specialist (June 2024 - Present)
- YouTube Creator at "CodeWithArjun" with 35K+ subscribers and 10+ million lifetime views
- Educational background: Bachelor's in Computer Science, Post Graduate in Full Stack Software Development from Lambton College
- Expertise areas: MERN Stack development, AI integration, content creation, social media marketing, SEO optimization
- Developed online course enrollment and booking system for Delmi Training Institute
- Built exam portal with automated certificate generation
- Manages content across YouTube, Instagram, TikTok, and Facebook for Delmi Training Institute
- Tools expertise: DaVinci Resolve, Adobe Premiere Pro, AI tools (ChatGPT, ElevenLabs, Sora, Kling AI), Shopify, WordPress
- Location: Toronto, Ontario, Canada

INSTRUCTORS:
Christian - Instructor at Delmi Training Institute
- Technical training instructor specializing in hands-on practical training
- Provides expertise in security systems and electronic installations

Mirac - Instructor at Delmi Training Institute
- Technical training instructor with field experience
- Delivers hands-on training in network cabling and security systems

SOCIAL MEDIA TEAM:
Social Media Specialists: Puja Sharma, CJ, Kalise, and Emefa
- Content creation and social media management team
- Manage Delmi Training Institute's presence across various social media platforms
- Create engaging educational content and student success stories
- Handle community engagement and digital marketing initiatives
- Work closely with the content team to promote courses and student achievements

DISCOUNT INFORMATION:
From time to time, we offer discounts up to 50% off our courses. Contact the institute directly to get the most out of current promotions and special offers.

IMPORTANT: Only provide information that is explicitly stated in the knowledge base. Do NOT create or mention:
- Specific discount codes or promotional codes
- Exact discount amounts other than "up to 50%"
- Limited-time offers with specific deadlines
- Referral programs or specific promotional details
When asked about discounts or special offers, mention that discounts up to 50% are available from time to time and direct them to contact the institute directly for current promotions.`;
  }

  public getCourseDetails(courseCode: string): {
    curriculum: string[];
    tools: string[];
    careerPaths: string[];
    learningOutcomes: string[];
  } | null {
    const code = courseCode.toUpperCase();
    
    if (code.includes('101') || code.includes('NETWORK') || code.includes('CABLING')) {
      return this.knowledgeBase.coursesDetailed['DTIL 101'];
    } else if (code.includes('201') || code.includes('CCTV') || code.includes('SURVEILLANCE')) {
      return this.knowledgeBase.coursesDetailed['DTIL 201'];
    } else if (code.includes('401') || code.includes('ELECTRONICS') || code.includes('RELAY')) {
      return this.knowledgeBase.coursesDetailed['DTIL 401'];
    } else if (code.includes('402') || code.includes('ACCESS') || code.includes('CONTROL')) {
      return this.knowledgeBase.coursesDetailed['DTIL 402'];
    }
    
    return null;
  }

  public getInstituteInfo() {
    return this.knowledgeBase.institute;
  }
}

export const knowledgeLoader = KnowledgeBaseLoader.getInstance();