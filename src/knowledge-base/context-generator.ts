import { delmiInstitute, DelmiInstituteInfo } from './delmi-institute';

export interface CaptionContext {
  instituteInfo: string;
  courseContext?: string;
  styleGuidelines: string;
  hashtags: string[];
  platformGuidelines?: string;
}

export class KnowledgeBaseContextGenerator {
  private institute: DelmiInstituteInfo;

  constructor() {
    this.institute = delmiInstitute;
  }

  /**
   * Generate comprehensive context for caption generation
   */
  generateContext(
    selectedStyle: 'professional' | 'casual' | 'creative',
    userPrompt?: string,
    imageAnalysis?: string,
    selectedCourse?: string,
    platform?: string
  ): CaptionContext {
    const courseContext = selectedCourse 
      ? this.getCourseContext(selectedCourse)
      : this.getAllCoursesContext();

    const platformGuidelines = platform 
      ? this.getPlatformGuidelines(platform)
      : undefined;

    const instituteInfo = this.generateInstituteInfo();
    const styleGuidelines = this.getStyleGuidelines(selectedStyle);
    const hashtags = this.getRelevantHashtags(selectedCourse, platform);

    return {
      instituteInfo,
      courseContext,
      styleGuidelines,
      hashtags,
      platformGuidelines
    };
  }

  /**
   * Generate the main institute information
   */
  private generateInstituteInfo(): string {
    return `
Delmi Training Institute Knowledge Base:
${this.institute.description}

Core Values:
${this.institute.values.map(value => `- ${value}`).join('\n')}

Key Achievements:
${this.institute.achievements.map(achievement => `- ${achievement}`).join('\n')}

Facilities:
${this.institute.facilities.map(facility => `- ${facility}`).join('\n')}

Target Audience:
${this.institute.targetAudience.map(audience => `- ${audience}`).join('\n')}
`;
  }

  /**
   * Get context for a specific course
   */
  private getCourseContext(courseName: string): string {
    const course = this.institute.courses.find(c => 
      c.name.toLowerCase().includes(courseName.toLowerCase()) ||
      courseName.toLowerCase().includes(c.name.toLowerCase())
    );

    if (!course) {
      return this.getAllCoursesContext();
    }

    return `
Course Focus: ${course.name}
Description: ${course.description}
Duration: ${course.duration}

Key Highlights:
${course.highlights.map(highlight => `- ${highlight}`).join('\n')}

Career Opportunities:
${course.careerOpportunities.map(opportunity => `- ${opportunity}`).join('\n')}

Course Hashtags: ${course.hashtags.join(', ')}
`;
  }

  /**
   * Get context for all courses
   */
  private getAllCoursesContext(): string {
    return `
Available Courses:
${this.institute.courses.map(course => 
  `- ${course.name}: ${course.description} (${course.duration})`
).join('\n')}

Popular Career Paths:
${this.institute.courses.flatMap(course => course.careerOpportunities).slice(0, 10).map(opportunity => 
  `- ${opportunity}`
).join('\n')}
`;
  }

  /**
   * Get style-specific guidelines
   */
  private getStyleGuidelines(style: 'professional' | 'casual' | 'creative'): string {
    const guidelines = this.institute.brandVoice[style];
    const socialGuidelines = this.institute.socialMediaGuidelines;

    return `
Style: ${style.charAt(0).toUpperCase() + style.slice(1)}
Brand Voice: ${guidelines}

Social Media Best Practices:
Do's:
${socialGuidelines.do.map(doItem => `- ${doItem}`).join('\n')}

Don'ts:
${socialGuidelines.dont.map(dontItem => `- ${dontItem}`).join('\n')}
`;
  }

  /**
   * Get platform-specific guidelines
   */
  private getPlatformGuidelines(platform: string): string {
    const platformInfo = this.institute.socialMediaGuidelines.platforms.find(p => 
      p.name.toLowerCase().includes(platform.toLowerCase()) ||
      platform.toLowerCase().includes(p.name.toLowerCase())
    );

    if (!platformInfo) {
      return '';
    }

    return `
Platform: ${platformInfo.name}
Description: ${platformInfo.description}

Content Types:
${platformInfo.contentTypes.map(type => `- ${type}`).join('\n')}

Hashtag Strategy: ${platformInfo.hashtagStrategy}
`;
  }

  /**
   * Get relevant hashtags based on context
   */
  private getRelevantHashtags(selectedCourse?: string, platform?: string): string[] {
    let hashtags = [...this.institute.hashtags];

    // Add course-specific hashtags
    if (selectedCourse) {
      const course = this.institute.courses.find(c => 
        c.name.toLowerCase().includes(selectedCourse.toLowerCase()) ||
        selectedCourse.toLowerCase().includes(c.name.toLowerCase())
      );
      if (course) {
        hashtags = [...hashtags, ...course.hashtags];
      }
    }

    // Add platform-specific hashtags
    if (platform) {
      const platformInfo = this.institute.socialMediaGuidelines.platforms.find(p => 
        p.name.toLowerCase().includes(platform.toLowerCase()) ||
        platform.toLowerCase().includes(p.name.toLowerCase())
      );
      if (platformInfo) {
        // Add platform-specific hashtags
        if (platformInfo.name.toLowerCase().includes('linkedin')) {
          hashtags.push('#ProfessionalDevelopment', '#Networking', '#CareerGrowth');
        } else if (platformInfo.name.toLowerCase().includes('instagram')) {
          hashtags.push('#StudentLife', '#Learning', '#Education');
        } else if (platformInfo.name.toLowerCase().includes('facebook')) {
          hashtags.push('#Community', '#Education', '#Learning');
        }
      }
    }

    return hashtags;
  }

  /**
   * Generate a complete prompt for caption generation
   */
  generateCaptionPrompt(
    selectedStyle: 'professional' | 'casual' | 'creative',
    userPrompt?: string,
    imageAnalysis?: string,
    selectedCourse?: string,
    platform?: string
  ): string {
    const context = this.generateContext(selectedStyle, userPrompt, imageAnalysis, selectedCourse, platform);
    
    let prompt = `${context.instituteInfo}\n\n`;

    if (context.courseContext) {
      prompt += `${context.courseContext}\n\n`;
    }

    if (context.platformGuidelines) {
      prompt += `${context.platformGuidelines}\n\n`;
    }

    prompt += `${context.styleGuidelines}\n\n`;

    if (imageAnalysis) {
      prompt += `Image Analysis: ${imageAnalysis}\n\n`;
    }

    if (userPrompt) {
      prompt += `User Request: ${userPrompt}\n\n`;
    }

    prompt += `Generate 3 different ${selectedStyle} social media captions based on the above context. Each caption should:
- Be engaging and relevant to the content
- Include appropriate hashtags from: ${context.hashtags.join(', ')}
- Reflect Delmi Training Institute's professional brand voice
- Be suitable for social media platforms
- Include a call-to-action when appropriate
- Be between 100-200 characters for optimal engagement

CRITICAL: Return ONLY the 3 captions numbered 1-3. Do not include any thinking process, reasoning, explanations, or internal thoughts. Just the captions.`;

    return prompt;
  }

  /**
   * Generate a modern AI-enhanced prompt for caption generation
   */
  generateModernCaptionPrompt(
    selectedStyle: 'professional' | 'casual' | 'creative',
    userPrompt?: string,
    imageAnalysis?: string,
    analysisMode: 'modern' | 'standard' = 'standard',
    selectedCourse?: string,
    platform?: string
  ): string {
    const context = this.generateContext(selectedStyle, userPrompt, imageAnalysis, selectedCourse, platform);
    
    let prompt = `You are an advanced AI social media expert specializing in creating engaging captions for Delmi Training Institute. 

KNOWLEDGE BASE REFERENCE:
${context.instituteInfo}\n\n`;

    if (context.courseContext) {
      prompt += `COURSE-SPECIFIC CONTEXT:
${context.courseContext}\n\n`;
    }

    if (context.platformGuidelines) {
      prompt += `PLATFORM GUIDELINES:
${context.platformGuidelines}\n\n`;
    }

    prompt += `STYLE GUIDELINES:
${context.styleGuidelines}\n\n`;

    if (imageAnalysis) {
      prompt += `AI IMAGE ANALYSIS:
${imageAnalysis}\n\n`;
    }

    if (userPrompt) {
      prompt += `USER REQUEST:
${userPrompt}\n\n`;
    }

    prompt += `MODERN AI ANALYSIS INSTRUCTIONS:
1. Analyze the content using modern social media trends and engagement patterns
2. Consider current industry developments in security and training
3. Incorporate relevant hashtags and trending topics
4. Apply psychological triggers for higher engagement
5. Use data-driven insights for optimal performance

AVAILABLE HASHTAGS: ${context.hashtags.join(', ')}

Generate 3 different ${selectedStyle} social media captions that:
- Leverage modern AI analysis for maximum engagement
- Include trending hashtags and relevant keywords
- Reflect current industry trends and developments
- Use psychological triggers (urgency, curiosity, social proof)
- Include data-driven call-to-actions
- Optimize for platform-specific algorithms
- Be between 100-200 characters for optimal engagement
- Include emojis strategically for visual appeal

CRITICAL: Return ONLY the 3 captions numbered 1-3. Do not include any thinking process, reasoning, explanations, or internal thoughts. Just the captions.`;

    return prompt;
  }
}

export default KnowledgeBaseContextGenerator; 