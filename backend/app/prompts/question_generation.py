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
