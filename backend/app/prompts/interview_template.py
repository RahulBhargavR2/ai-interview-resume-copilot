BASE_EVALUATION_PROMPT = """
You are an expert technical interviewer.

Role: {role}
Interview Type: {interview_type}
Difficulty: {difficulty}

Question:
{question}

Candidate Answer:
{answer}


{context}

Evaluate the answer according to the evaluation criteria below.

General Scoring Rubric:

1. Technical Accuracy (0-4)
- Is the answer technically correct?
- Are concepts explained correctly?

2. Completeness (0-2)
- Does the answer address all important aspects?

3. Depth of Understanding (0-2)
- Does the candidate explain reasoning, tradeoffs, or implementation details?

4. Communication Clarity (0-2)
- Is the answer clear, structured, and easy to understand?

Difficulty Guidelines:

Easy:
- Expect basic understanding.
- Minor mistakes are acceptable.

Medium:
- Expect solid practical knowledge.
- Penalize missing important concepts.

Hard:
- Expect strong technical depth.
- Penalize shallow or generic explanations.

{criteria}

Return STRICT JSON only.
"""


BASE_SUMMARY_PROMPT = """
You are a senior technical interviewer.

Role: {role}
Interview Type: {interview_type}
Difficulty: {difficulty}

{context}
Interview History:
{history}

Evaluate the candidate across:

1. Technical Knowledge
2. Problem Solving
3. Communication
4. Depth of Understanding

Use the interview type criteria below:

{criteria}

Return STRICT JSON only.
"""


BACKEND_CRITERIA = """
Backend Interview Evaluation:

Focus on:

- API design
- Database design
- Authentication and authorization
- Security considerations
- Scalability
- Performance optimization
- Error handling
- Concurrency

Reward:

- Practical production knowledge
- Tradeoff analysis
- Scalability awareness

Penalize:

- Memorized definitions
- Ignoring security concerns
- Ignoring edge cases
"""

FRONTEND_CRITERIA = """
Frontend Interview Evaluation:

Focus on:

- Component design
- State management
- React fundamentals
- Performance optimization
- Accessibility
- Browser rendering
- Responsive design

Reward:

- Understanding of React internals
- Performance awareness
- Clean architecture

Penalize:

- Framework-specific memorization without understanding
- Ignoring accessibility
"""

SYSTEM_DESIGN_CRITERIA = """
System Design Interview Evaluation:

Focus on:

- Scalability
- Availability
- Reliability
- Database choices
- Caching
- Load balancing
- Fault tolerance
- Tradeoff analysis

Reward:

- Bottleneck identification
- Capacity estimation
- Distributed systems knowledge

Penalize:

- Overengineering
- Missing tradeoffs
- Unrealistic architectures
"""

DSA_CRITERIA = """
Data Structures and Algorithms Evaluation:

Focus on:

- Correctness
- Time complexity
- Space complexity
- Edge cases
- Optimization

Reward:

- Optimal solutions
- Multiple approaches
- Complexity analysis

Penalize:

- Incorrect solutions
- Missing edge cases
- Poor complexity reasoning
"""

DATABASE_CRITERIA = """
Database Interview Evaluation:

Focus on:

- SQL knowledge
- Schema design
- Normalization
- Indexing
- Transactions
- Query optimization
- ACID properties

Reward:

- Practical database design knowledge
- Performance awareness

Penalize:

- Incorrect SQL concepts
- Ignoring indexing or optimization
"""

BEHAVIORAL_CRITERIA = """
Behavioral Interview Evaluation:

Focus on:

- Communication
- Leadership
- Teamwork
- Conflict resolution
- Ownership
- Decision making

Reward:

- STAR format responses
- Clear examples
- Reflection and learning

Penalize:

- Generic answers
- Lack of examples
- Avoiding responsibility
"""


RESUME_CRITERIA = """
Resume-Aware Interview Evaluation

Focus on:

1. Project Ownership
- Does the candidate demonstrate personal involvement in the project?
- Can they clearly explain what they specifically built?
- Can they distinguish their contributions from team contributions?

2. Technical Understanding
- Does the candidate understand the technologies used?
- Can they explain implementation details beyond high-level descriptions?
- Can they justify architectural and design decisions?

3. Problem Solving
- Can the candidate explain challenges encountered?
- Can they describe how those challenges were resolved?
- Can they discuss alternative approaches and tradeoffs?

4. Practical Experience
- Does the answer contain real-world implementation details?
- Can the candidate explain deployment, testing, debugging, monitoring, or optimization decisions?
- Can they discuss lessons learned during development?

5. Communication
- Is the explanation clear, structured, and concise?
- Can the candidate explain technical concepts in a logical manner?

Reward:

- Detailed implementation explanations
- Design rationale and tradeoff analysis
- Real challenges and solutions
- Practical examples from the project
- Evidence of hands-on experience
- Understanding of limitations and future improvements

Penalize:

- Vague or generic explanations
- Resume buzzwords without technical depth
- Answers that simply repeat project descriptions
- Inability to explain architecture, implementation, or decisions
- Contradictions regarding technologies or project details
- Responses suggesting the candidate did not actively contribute to the project

Special Guidance:

For project-related questions:
- Prioritize evidence of hands-on development.
- Evaluate whether the candidate understands the internals of the technologies they claim to have used.
- Reward honest acknowledgment of limitations or mistakes when accompanied by clear learning outcomes.

For technology-related questions:
- Connect evaluation to the candidate's claimed experience.
- Expect deeper understanding of technologies explicitly listed on the resume than technologies not listed.
"""

NORMAL_INTERVIEW_CONTEXT = ""

RESUME_AWARE_CONTEXT = """
Candidate Resume:

Skills:
{skills}

Projects:
{projects}

Experience:
{experience}

When evaluating:

- Expect deeper understanding of technologies listed on the resume.
- Verify project ownership.
- Reward practical implementation details.
- Penalize vague answers regarding claimed experience.
"""


EVALUATION_OUTPUT_FORMAT = """
{
    "score": 0,
    "feedback": "",
    "strengths": [
        ""
    ],
    "improvements": [
        ""
    ]
}
"""


SUMMARY_OUTPUT_FORMAT = """
{
    "overall_score": 0,
    "technical_rating": "",
    "communication_rating": "",
    "problem_solving_rating": "",
    "overall_feedback": "",
    "strengths": [
        ""
    ],
    "weaknesses": [
        ""
    ],
    "recommendations": [
        ""
    ],
    "hire_recommendation": "Strong Hire | Hire | No Hire"
}
"""


TEMPLATES = {
    "backend": BACKEND_CRITERIA,
    "frontend": FRONTEND_CRITERIA,
    "system_design": SYSTEM_DESIGN_CRITERIA,
    "dsa": DSA_CRITERIA,
    "database": DATABASE_CRITERIA,
    "behavioral": BEHAVIORAL_CRITERIA,
}


def get_criteria(interview_type: str, resume_aware: bool = False):
    criteria = TEMPLATES.get(interview_type, "")

    if resume_aware:
        criteria += "\n\n" + RESUME_CRITERIA

    return criteria
