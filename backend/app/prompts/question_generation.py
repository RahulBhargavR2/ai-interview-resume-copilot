BASE_QUESTION_PROMPT = """
You are an expert technical interviewer.

Role: {role}
Interview Type: {interview_type}
Difficulty: {difficulty}

Previous Questions:
{previous_questions}

Generate ONE interview question.

Follow the interview criteria below:

{criteria}

Requirements:
- Ask only one question.
- Do not repeat previous questions.
- Match the difficulty level.
- Prefer practical and realistic interview questions.
- Return only the question text.
"""


BACKEND_GENERATION = """
Focus on:

- API design
- Databases
- Authentication
- Authorization
- Caching
- Scalability
- Security
- Concurrency

Prefer scenario-based questions over theory questions.
"""

FRONTEND_GENERATION = """
Focus on:

- React
- State management
- Component architecture
- Browser rendering
- Performance optimization
- Accessibility

Prefer practical implementation questions.
"""

SYSTEM_DESIGN_GENERATION = """
Focus on:

- Scalability
- Availability
- Databases
- Caching
- Load balancing
- Tradeoffs

Ask open-ended design questions.
"""

DSA_GENERATION = """
Focus on:

- Data structures
- Algorithms
- Complexity analysis
- Edge cases

Generate coding interview questions.
"""

RESUME_GENERATION = """
Candidate Resume:

Skills:
{skills}

Projects:
{projects}

Experience:
{experience}

Generate a question based on the candidate's resume.

Priority:
1. Projects (60%)
2. Skills (30%)
3. Experience (10%)

Focus on:
- Architecture
- Design decisions
- Tradeoffs
- Challenges faced
- Implementation details
- Lessons learned

Avoid generic textbook questions.

Prefer questions that verify real project ownership and hands-on experience.
"""

RESUME_CRITERIA = """
Use the candidate's resume as the primary source of context.

Focus on:

- Technical skills mentioned in the resume
- Projects and their implementation details
- Internship and work experience
- Technologies, frameworks, and tools used
- Architectural and design decisions
- Trade-offs made during development
- Challenges faced and how they were solved
- Best practices followed
- Performance optimizations
- Testing and debugging approaches


Interview Strategy:

- Begin with questions directly related to the candidate's strongest skills.
- Ask the candidate to explain projects in depth.
- Generate follow-up questions based on previous answers.
- Gradually increase the difficulty.
- Explore the candidate's actual understanding instead of asking for memorized definitions.
- Prefer practical, scenario-based questions over theoretical questions.
- Do not ask about technologies that are not mentioned in the resume unless they are fundamental to the discussed topic.
- Avoid repeating previous questions.
- If the candidate performs well, increase the complexity.
- If the candidate struggles, ask simpler follow-up questions to assess core understanding.

- Cover the entire resume instead of focusing on a single project.
- Distribute questions across projects, skills, and experience.
- Ask at least one question from each major project before revisiting any project.
- If multiple projects exist, rotate between them.
- Balance questions across:
    - Projects
    - Technical Skills
    - Experience
    - Problem Solving
- Do not spend more than two consecutive questions on the same project unless the previous answer naturally requires a follow-up.
"""

QUESTION_TEMPLATES = {
    "backend": BACKEND_GENERATION,
    "frontend": FRONTEND_GENERATION,
    "system_design": SYSTEM_DESIGN_GENERATION,
    "dsa": DSA_GENERATION,
    # "behavioral": BEHAVIORAL_GENERATION,
    "resume": RESUME_GENERATION,
}


def get_criteria(interview_type: str, resume_aware: bool = False):
    criteria = QUESTION_TEMPLATES.get(interview_type, "")

    if resume_aware:
        criteria += "\n\n" + RESUME_CRITERIA

    return criteria
